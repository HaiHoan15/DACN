import { useState, useEffect, useRef } from "react";

export default function AdvisePage(props = {}) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const MAX_MESSAGES = 20;
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [inputMessage]);

  // Lấy lịch sử chat khi load trang
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadChatHistory(parsedUser.User_ID);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load lịch sử chat từ database
  const loadChatHistory = async (userId) => {
    try {
      const response = await fetch(`https://haihoanpetcare.online/petcare_api/get_chat_history.php?user_id=${userId}`);
      const data = await response.json();

      if (data.success && data.messages.length > 0) {
        setSessionId(data.session_id);
        const loadedMessages = data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
        // Đếm số tin nhắn của user (chỉ tính tin nhắn của user, không tính của AI)
        const userMessageCount = loadedMessages.filter(msg => msg.role === 'user').length;
        setMessageCount(userMessageCount);
      } else {
        // Nếu chưa có lịch sử, hiển thị tin nhắn chào mừng
        startNewChat();
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      startNewChat();
    }
  };

  // Bắt đầu chat mới
  const startNewChat = () => {
    const welcomeMessage = {
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý AI của HaiHoan PetCare. Tôi có thể giúp gì cho bạn về chăm sóc thú cưng hôm nay? 🐾",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setSessionId(null);
    setMessageCount(0);
  };

  // Lưu tin nhắn vào database
  const saveMessage = async (role, content, currentSessionId) => {
    try {
      const response = await fetch("https://haihoanpetcare.online/petcare_api/save_chat_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.User_ID,
          role: role,
          message: content,
          session_id: currentSessionId,
        })
      });

      const data = await response.json();
      if (data.success && data.session_id) {
        setSessionId(data.session_id);
        return data.session_id;
      }
    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn:", error);
    }
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    // Kiệm tra giới hạn tin nhắn
    if (messageCount >= MAX_MESSAGES) {
      alert("Đã đạt giới hạn 20 tin nhắn! Vui lòng nhấn 'Làm mới' để bắt đầu đoạn chat mới.");
      return;
    }

    // Nếu chỉ có ảnh mà không có text, thêm mô tả mặc định
    const messageText = inputMessage.trim() || (selectedImage ? "Hãy phân tích hình ảnh này cho tôi" : "");

    const userMessage = {
      role: "user",
      content: messageText,
      image: selectedImage?.preview,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(true);
    setMessageCount(prev => prev + 1);

    // Lưu tin nhắn user vào database
    const newSessionId = await saveMessage("user", messageText, sessionId);

    try {
      // Nếu có ảnh, kiểm tra xem API có hỗ trợ không
      if (userMessage.image) {
        console.log("Đang gửi hình ảnh lên server...");
        const response = await fetch("https://haihoanpetcare.online/petcare_api/chat_with_image.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            image: userMessage.image
          })
        });

        const data = await response.json();
        console.log("Response từ server:", data);

        if (!response.ok || data.error) {
          console.error("Lỗi API:", data);
          throw new Error(data.error || data.reply || "Lỗi không xác định");
        }

        const aiResponse = {
          role: "assistant",
          content: data.reply || "Xin lỗi, tôi không thể phân tích hình ảnh này.",
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, aiResponse]);
        await saveMessage("assistant", aiResponse.content, newSessionId || sessionId);
      } else {
        // Chỉ gửi text thông thường
        const response = await fetch("https://haihoanpetcare.online/petcare_api/chat.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();

        const aiResponse = {
          role: "assistant",
          content: data.reply ?? "",
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, aiResponse]);
        await saveMessage("assistant", aiResponse.content, newSessionId || sessionId);
      }
    }
    catch (err) {
      console.error("Chatbot error:", err);
      const errorMessage = {
        role: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi kết nối với máy chủ!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage("assistant", errorMessage.content, newSessionId || sessionId);
    }

    setLoading(false);
  };

  // Làm mới đoạn chat - Xóa lịch sử cũ
  const handleNewChat = async () => {
    if (window.confirm("Bạn có chắc muốn bắt đầu đoạn chat mới? Lịch sử chat hiện tại sẽ bị xóa.")) {
      // Xóa lịch sử chat cũ trong database
      if (sessionId) {
        try {
          await fetch("https://haihoanpetcare.online/petcare_api/delete_chat_session.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.User_ID,
              session_id: sessionId
            })
          });
        } catch (error) {
          console.error("Lỗi khi xóa lịch sử:", error);
        }
      }

      // Bắt đầu chat mới
      startNewChat();
    }
  };

  // Xử lý chọn hình ảnh
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert("Chỉ chấp nhận định dạng JPG hoặc PNG!");
        return;
      }

      // Kiểm tra kích thước file
      if (file.size > 3 * 1024 * 1024) { // Giới hạn 3MB
        alert("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 3MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Resize ảnh nếu quá lớn
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 1024;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const resizedImage = canvas.toDataURL(file.type, 0.9);

          // Log kích thước ảnh sau resize
          console.log('Kích thước ảnh gốc:', img.width, 'x', img.height);
          console.log('Kích thước sau resize:', width, 'x', height);
          console.log('Kích thước base64:', (resizedImage.length / 1024).toFixed(2), 'KB');

          setSelectedImage({
            file: file,
            preview: resizedImage
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa hình ảnh đã chọn
  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #EFF6FF, #FEF3E7)' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #2563EB, #DD6B20)' }}>
            <img src="/images/AI.png" alt="AI" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chatbot AI Tư Vấn</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để sử dụng dịch vụ tư vấn AI của chúng tôi</p>
          <button
            onClick={() => window.location.href = '/dang-nhap'}
            className="text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
            style={{ background: 'linear-gradient(to right, #2563EB, #DD6B20)' }}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(to bottom right, #EFF6FF, #FEF3E7)' }}>
      {/* HEADER */}
      <header className="bg-white border-b shadow-md p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-lg" style={{ background: 'linear-gradient(to bottom right, #2563EB, #DD6B20)' }}>
            <img src="/images/AI.png" alt="AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ background: 'linear-gradient(to right, #2563EB, #DD6B20)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HaiHoan AI Assistant
            </h1>
            <p className="text-sm text-gray-500">Trợ lý tư vấn chăm sóc thú cưng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">Đang hoạt động</span>
        </div>
      </header>

      {/* CHAT AREA */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate__animated animate__fadeIn`}
          >
            {/* Avatar */}
            {msg.role === "user" ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden bg-gray-200">
                {user?.UserPicture ? (
                  <img
                    src={user.UserPicture}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/user.png";
                    }}
                  />
                ) : (
                  <img
                    src="/images/user.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #DD6B20, #2563EB)' }}>
                <img src="/images/AI.png" alt="AI" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Message bubble */}
            <div className={`max-w-[70%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-5 py-3 rounded-2xl shadow-md text-[15px] leading-relaxed
                ${msg.role === "user"
                    ? "text-white rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                style={msg.role === "user" ? { background: 'linear-gradient(to right, #2563EB, #DD6B20)' } : {}}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="max-w-full rounded-lg mb-2 max-h-60 object-cover"
                  />
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <span className="text-xs text-gray-400 mt-1 px-2">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3 animate__animated animate__fadeIn">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #DD6B20, #2563EB)' }}>
              <img src="/images/AI.png" alt="AI" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <div className="bg-white border-t border-gray-300 px-4 py-4">
        {/* PREVIEW ẢNH */}
        {selectedImage && (
          <div className="mb-3 max-w-4xl mx-auto">
            <div className="relative inline-block">
              <img
                src={selectedImage.preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg border shadow"
              />
              <button
                className="absolute top-1 right-1 text-white bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
                onClick={removeSelectedImage}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* THANH NHẬP GIỐNG CHATGPT */}
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-white p-2 border border-gray-300 rounded-full shadow-lg">

          {/* ICON CHÈN HÌNH ẢNH */}
          <button
            className="p-2.5 rounded-full hover:bg-gray-100 transition flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            title="Thêm hình ảnh"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* TEXTAREA */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputMessage}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 max-h-40 px-2 py-2.5 outline-none resize-none text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0"
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
          />

          {/* NÚT LÀM MỚI */}
          <button
            className="p-2.5 rounded-full hover:bg-gray-100 transition flex-shrink-0"
            onClick={handleNewChat}
            title="Làm mới đoạn chat"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* NÚT GỬI */}
          <button
            className={`p-2.5 rounded-full flex items-center justify-center transition flex-shrink-0
              ${(inputMessage.trim() || selectedImage) && !loading ? "bg-black hover:bg-gray-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !selectedImage) || loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>

        </div>

        {/* THÔNG BÁO */}
        {!props.hideNotice && (
          <div className="text-center mt-3">
            <p className="text-xs font-medium" style={{
              color: messageCount >= MAX_MESSAGES ? '#DC2626' : messageCount >= 15 ? '#F59E0B' : '#6B7280'
            }}>
              {messageCount >= MAX_MESSAGES ? (
                <>🛑 Đã hết lượt chat! Vui lòng nhấn 'Làm mới' 👉 🔄 để tiếp tục.</>
              ) : (
                <>💬 Còn lại {MAX_MESSAGES - messageCount}/{MAX_MESSAGES} lượt chat • Enter để gửi, Shift+Enter để xuống dòng</>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              📸 Hình ảnh: JPG/PNG, ≤3MB, tự động resize về 1024×1024px • Mỗi lần gửi 1 ảnh
            </p>
          </div>
        )}
      </div>
    </div>
  );
}