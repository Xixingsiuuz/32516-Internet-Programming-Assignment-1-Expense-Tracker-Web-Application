import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null); // 当前编辑的记录ID

  // 表单输入
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 获取数据
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    axios.get('http://localhost:5000/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  };

  // 添加新记录
  const addExpense = () => {
    if (!form.title || !form.amount) {
      alert("Title and Amount are required!");
      return;
    }
    axios.post('http://localhost:5000/expenses', form)
      .then(() => {
        fetchExpenses();
        setForm({ title: '', category: '', amount: '', date: '', description: '' });
      })
      .catch(err => console.error(err));
  };

  // 保存编辑
  const saveExpense = () => {
    axios.put(`http://localhost:5000/expenses/${editingId}`, form)
      .then(() => {
        fetchExpenses();
        setForm({ title: '', category: '', amount: '', date: '', description: '' });
        setEditingId(null);
      })
      .catch(err => console.error(err));
  };

  // 取消编辑
  const cancelEdit = () => {
    setForm({ title: '', category: '', amount: '', date: '', description: '' });
    setEditingId(null);
  };

  // 删除记录
  const deleteExpense = (id) => {
    axios.delete(`http://localhost:5000/expenses/${id}`)
      .then(() => setExpenses(prev => prev.filter(item => item.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Expense Tracker</h1>

      {/* 显示编辑状态 */}
      {editingId && <p style={{ color: 'blue', fontWeight: 'bold' }}>Editing record #{editingId}</p>}

      {/* 表单 */}
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        {/* Add / Save / Cancel 按钮 */}
        {!editingId ? (
          <button style={{ backgroundColor: 'green', color: 'white', padding: '8px' }} onClick={addExpense}>
            Add
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ backgroundColor: 'blue', color: 'white', padding: '8px' }} onClick={saveExpense}>
              Save
            </button>
            <button style={{ backgroundColor: 'gray', color: 'white', padding: '8px' }} onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* 数据列表 */}
      {expenses.length === 0 ? (
        <p>No data</p>
      ) : (
        expenses.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
            <h3>{item.title}</h3>
            <p>Category: {item.category}</p>
            <p>Amount: ${item.amount}</p>
            <p>Date: {item.date}</p>
            <p>Description: {item.description}</p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ backgroundColor: 'red', color: 'white', padding: '4px 8px' }} onClick={() => deleteExpense(item.id)}>
                Delete
              </button>
              <button style={{ backgroundColor: 'orange', color: 'white', padding: '4px 8px' }} onClick={() => {
                setEditingId(item.id);
                setForm({
                  title: item.title,
                  category: item.category,
                  amount: item.amount,
                  date: item.date,
                  description: item.description
                });
              }}>
                Edit
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;