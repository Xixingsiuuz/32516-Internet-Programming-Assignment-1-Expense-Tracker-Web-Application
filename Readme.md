# 32516 Internet Programming Assignment-1: Expense Tracker Web Application

## 1. Project Summary
This project is a single-page Expense Tracker web application that helps users record and manage their daily spending. Many people find it difficult to keep track of expenses across different categories such as food, transport, and shopping. This website solves that problem by allowing users to add, view, edit, and delete expense records in a simple and dynamic interface. The system stores data in a MySQL database so that expense records can be managed persistently.

## 2. Technical Stack
- **Frontend:** React
- **Styling:** CSS and styling
- **Backend:** Node.js with Express
- **Database:** MySQL
- **Routing / API:** RESTful API routes using `GET`, `POST`, `PUT`, and `DELETE`
- **Deployment:** Not deployed for this assignment (run locally)

## 3. Feature List
- Add a new expense record
- View all saved expense records
- Edit an existing expense
- Delete an expense
- Dynamic single-page interface without full page reload
- Input fields for title, category, amount, date, and description
- Edit mode with Save and Cancel options
- Real-time update of the expense list after CRUD operations
- View expense items / total amounts by category, and trends in monthly expenditure.

## 4. Folder Structure
``` id="1l1tzb" 
expense-tracker/
│
├── frontend/                   # React frontend application
├── backend/                    # Node.js + Express backend server
├── Expenses_Tracker.sql        # SQL files for database table setup
└── Readme.md                   # The Readme File
```

## 5. Challenges Overcome
One of the main challenges in this project was connecting the React frontend to the Node.js backend and ensuring the API requests worked correctly. Another difficulty was configuring the MySQL database connection and testing CRUD operations without errors. I also encountered issues with updating the page state after deleting or editing records, because the UI did not always refresh immediately. This problem was solved by improving the React state update logic and separating add mode from edit mode. Through this process, I gained a better understanding of full-stack web development and how frontend, backend, and database components work together.

