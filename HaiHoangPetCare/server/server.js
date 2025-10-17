import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Kết nối MySQL thất bại:", err);
  } else {
    console.log("✅ Đã kết nối MySQL thành công!");
  }
});

// Route test
app.get("/", (req, res) => {
  res.send("PetCare API hoạt động 🚀");
});

// API ví dụ: lấy danh sách người dùng
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM USER", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server chạy ở cổng ${process.env.PORT}`);
});
