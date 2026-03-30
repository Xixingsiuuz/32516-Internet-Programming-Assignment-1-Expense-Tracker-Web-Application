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
  const [editingId, setEditingId] = useState(null); 
  const [showExpenses, setShowExpenses] = useState(false); // 控制列表显示
  const categoryOptions = [
                          "Bill",        // 水电煤、网费、电话费
                          "Food",        // 吃饭、外卖、零食
                          "Rent",        // 房租
                          "Transport",   // 交通、油费、地铁、公交
                          "Entertainment", // 电影、游戏、运动、兴趣爱好
                          "Shopping",    // 衣物、生活用品
                          "Healthcare",  // 医疗、药品
                          "Education",   // 学费、培训、书籍
                          "Other"        // 其他零碎开支
                          ];

  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchExpenses = () => {
    axios.get('http://localhost:5000/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  };

  const addExpense = () => {
    if (!form.title || !form.amount) {
      alert("Title and Amount are required!");
      return;
    }
    axios.post('http://localhost:5000/expenses', form)
      .then(() => {
        if (showExpenses) fetchExpenses();
        fetchSummary();
        setForm({ title: '', category: '', amount: '', date: '', description: '' });
      })
      .catch(err => console.error(err));
  };

  const saveExpense = () => {
    axios.put(`http://localhost:5000/expenses/${editingId}`, form)
      .then(() => {
        if (showExpenses) fetchExpenses();
        fetchSummary();
        setForm({ title: '', category: '', amount: '', date: '', description: '' });
        setEditingId(null);
      })
      .catch(err => console.error(err));
  };

  const cancelEdit = () => {
    setForm({ title: '', category: '', amount: '', date: '', description: '' });
    setEditingId(null);
  };

  const deleteExpense = (id) => {
    axios.delete(`http://localhost:5000/expenses/${id}`)
      .then(() => {
        setExpenses(prev => prev.filter(item => item.id !== id))
        fetchSummary();
      })
      .catch(err => console.error(err));
  };

  // 点击查询按钮
  const toggleShowExpenses = () => {
    if (!showExpenses) fetchExpenses(); // 只有当要显示时才请求数据
    setShowExpenses(prev => !prev);
  };

  const fetchSummary = () => {
  axios.get('http://localhost:5000/expenses/category-summary')
    .then(res => setCategorySummary(res.data));

  axios.get('http://localhost:5000/expenses/monthly-summary')
    .then(res => setMonthlySummary(res.data));
  };

  useEffect(() => {
  fetchExpenses();
  fetchSummary();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Expense Tracker</h1>

      {editingId && <p style={{ color: 'blue', fontWeight: 'bold' }}>Editing record #{editingId}</p>}

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Category</option>
          {categoryOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

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

      {/* 查询按钮 */}
      <button
        style={{ backgroundColor: showExpenses ? '#555' : '#aa3bff', color: 'white', padding: '8px', marginBottom: '20px' }}
        onClick={toggleShowExpenses}
      >
        {showExpenses ? 'Hide Expenses' : 'Show Expenses'}
      </button>

      <h2>Category Summary</h2>
      {categorySummary.map(item => (
        <div key={item.category}>
          {item.category}: ${item.total}
        </div>
      ))}

      <h2>Monthly Summary</h2>
      {monthlySummary.map(item => (
        <div key={item.month}>
          {item.month}: ${item.total}
        </div>
      ))}

      {/* 数据列表 */}
      {showExpenses && (
        expenses.length === 0 ? (
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
        )
      )}
    </div>
  );
}

export default App;