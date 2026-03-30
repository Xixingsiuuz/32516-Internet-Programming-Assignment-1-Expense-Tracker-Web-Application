const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⚡ 连接 MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123Qyhsyms?', 
    database: 'expense_tracker'
});

db.connect(err => {
    if (err) {
        console.log("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
});

// 📡 获取所有数据
app.get('/expenses', (req, res) => {
    db.query('SELECT * FROM expenses', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// ➕ 添加新数据
app.post('/expenses', (req, res) => {
    const { title, category, amount, date, description } = req.body;
    const sql = 'INSERT INTO expenses (title, category, amount, date, description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, category, amount, date, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: "Added successfully" });
    });
});

// 🗑 删除数据
app.delete('/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM expenses WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: "Deleted successfully" });
    });
});

app.put('/expenses/:id', (req, res) => {
    const id = req.params.id;
    const { title, category, amount, date, description } = req.body;

    const sql = `
        UPDATE expenses
        SET title=?, category=?, amount=?, date=?, description=?
        WHERE id=?
    `;

    db.query(sql, [title, category, amount, date, description, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: "Updated successfully" });
    });
});

// 🚀 启动服务器
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});