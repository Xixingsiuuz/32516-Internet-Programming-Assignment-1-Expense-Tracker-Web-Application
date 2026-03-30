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
  const [showExpenses, setShowExpenses] = useState(false); // Control category list show
  const categoryOptions = [
                          "Bill",        
                          "Food",        
                          "Rent",        
                          "Transport",   
                          "Entertainment", 
                          "Shopping",    
                          "Healthcare",  
                          "Education",   
                          "Other"        
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

  const toggleShowExpenses = () => {
    if (!showExpenses) fetchExpenses(); 
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
  <div
    style={{
      padding: '30px 40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* Left zone */}
      <div style={{ flex: 2 }}>
        <h1 style={{ marginBottom: '20px' }}>Expense Tracker</h1>

        {editingId && (
          <p style={{ color: 'blue', fontWeight: 'bold' }}>
            Editing record #{editingId}
          </p>
        )}

        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
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
            <button
              style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '6px' }}
              onClick={addExpense}
            >
              Add
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '6px' }}
                onClick={saveExpense}
              >
                Save
              </button>
              <button
                style={{ backgroundColor: 'gray', color: 'white', padding: '10px', border: 'none', borderRadius: '6px' }}
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <button
          style={{
            backgroundColor: showExpenses ? '#555' : '#aa3bff',
            color: 'white',
            padding: '10px 14px',
            marginBottom: '20px',
            border: 'none',
            borderRadius: '6px'
          }}
          onClick={toggleShowExpenses}
        >
          {showExpenses ? 'Hide Expenses' : 'Show Expenses'}
        </button>

        {showExpenses && (
          expenses.length === 0 ? (
            <p>No data</p>
          ) : (
            expenses.map(item => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ddd',
                  marginBottom: '12px',
                  padding: '15px',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <h3>{item.title}</h3>
                <p>Category: {item.category}</p>
                <p>Amount: ${item.amount}</p>
                <p>Date: {item.date}</p>
                <p>Description: {item.description}</p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{ backgroundColor: 'red', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '6px' }}
                    onClick={() => deleteExpense(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ backgroundColor: 'orange', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '6px' }}
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        title: item.title,
                        category: item.category,
                        amount: item.amount,
                        date: item.date,
                        description: item.description
                      });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Summary zone */}
      <div style={{ flex: 1, minWidth: '260px' }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '20px'
          }}
        >
          <h2 style={{ marginTop: 0 }}>Category Summary</h2>
          {categorySummary.length === 0 ? (
            <p>No category data</p>
          ) : (
            categorySummary.map(item => (
              <div key={item.category} style={{ marginBottom: '8px' }}>
                {item.category}: ${item.total}
              </div>
            ))
          )}
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <h2 style={{ marginTop: 0 }}>Monthly Summary</h2>
          {monthlySummary.length === 0 ? (
            <p>No monthly data</p>
          ) : (
            monthlySummary.map(item => (
              <div key={item.month} style={{ marginBottom: '8px' }}>
                {item.month}: ${item.total}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default App;