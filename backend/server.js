const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db"); // Adjust path as needed

connectDB(); // 🧠 Connect to DB BEFORE setting up routes

const app = express();

// ✅ Must match Vite frontend URL exactly
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Your routes
app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
