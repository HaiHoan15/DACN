import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AdvisePage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      setMessages([
        {
          role: "assistant",
          content:
            "Xin chào! Tôi là trợ lý AI của HaiHoang PetCare. Tôi có thể giúp gì cho bạn hôm nay?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const context = `Bạn là trợ lý AI của HaiHoang PetCare. Hãy trả lời thân thiện và đúng chuyên môn.
Câu hỏi: ${inputMessage}`;

      const result = await model.generateContent(context);
      const reply = result.response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." },
      ]);
    }

    setLoading(false);
  };

  if (!user) {
    return <div className="p-10 text-center text-xl">Hãy đăng nhập để sử dụng chatbot.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f0f0]">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          AI
        </div>
        <h1 className="text-xl font-semibold text-gray-700">
          HaiHoang PetCare ChatGPT Style
        </h1>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-[15px] leading-relaxed
              ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-3 text-gray-500 animate-pulse">
              AI đang trả lời...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow font-semibold"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}