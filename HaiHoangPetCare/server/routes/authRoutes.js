import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// 🧠 API Đăng nhập
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM USER WHERE Email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Email không tồn tại" });

    const user = result[0];

    // So sánh mật khẩu (ở đây demo chưa mã hóa)
    const isMatch = password === user.Password; // nếu dùng bcrypt thì thay bằng bcrypt.compare

    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

    // 🔑 Tạo JWT token
    const token = jwt.sign(
      { id: user.User_ID, email: user.Email, role: user.Role_ID },
      "SECRET_KEY_123", // đổi thành secret của bạn trong .env
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  });
});

export default router;
