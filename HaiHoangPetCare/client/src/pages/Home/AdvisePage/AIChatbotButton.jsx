import React, { useState, useRef, useEffect } from "react";
import AdvisePage from "./index.jsx";

export default function AIChatbotButton() {
  const [open, setOpen] = useState(false);

  // Vị trí nút
  const [pos, setPos] = useState({ right: 32, bottom: 32 });

  // Drag helpers
  const dragging = useRef(false);
  const dragged = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    dragging.current = true;
    dragged.current = false;
    offset.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    dragged.current = true;

    const dx = offset.current.x - e.clientX;
    const dy = offset.current.y - e.clientY;

    offset.current = { x: e.clientX, y: e.clientY };

    setPos((prev) => {
      let newRight = prev.right + dx;
      let newBottom = prev.bottom + dy;

      newRight = Math.max(0, Math.min(newRight, window.innerWidth - 64));
      newBottom = Math.max(0, Math.min(newBottom, window.innerHeight - 64));

      return { right: newRight, bottom: newBottom };
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleClick = () => {
    // Nếu kéo → KHÔNG mở chat
    if (dragged.current) return;

    setOpen((v) => !v);
  };

  return (
    <>
      {/* BUTTON + nút X */}
      <div
        style={{
          position: "fixed",
          right: pos.right,
          bottom: pos.bottom,
          zIndex: 2000,
        }}
      >
        {/* Nút X – chỉ hiện khi chat đang mở */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#ef4444",
              color: "white",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 2001,
            }}
          >
            ×
          </button>
        )}

        <button
          onMouseDown={onMouseDown}
          onClick={handleClick}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: open
              ? "linear-gradient(135deg,#fb923c,#f59e42)"
              : "linear-gradient(135deg,#2563eb,#3b82f6)",
            border: "4px solid #fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          <img
            src="/images/AI.png"
            alt="AI"
            style={{ width: 40, height: 40 }}
          />
        </button>
      </div>

      {/* KHUNG CHAT */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 32 + 64 + 16,
            bottom: 32,
            zIndex: 1500,
            width: 500,
            maxWidth: "98vw",
            height: "95vh",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <AdvisePage hideNotice={true} />
          </div>
        </div>
      )}
    </>
  );
}
