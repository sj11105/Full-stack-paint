const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User ", UserSchema); // Fixed extra space in model name

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  try {
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User  registered successfully!" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed: " + error.message,
    });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied.");

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
};

// Save drawing endpoint
app.post("/save", authenticate, (req, res) => {
  const { image } = req.body;
  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  // Create a unique filename
  const filename = `drawing_${Date.now()}.png`;
  const filePath = path.join(__dirname, "saved_drawings", filename);

  // Ensure the directory exists
  fs.mkdirSync(path.join(__dirname, "saved_drawings"), { recursive: true });

  // Save the image to the filesystem
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save drawing" });
    }
    res.json({ message: "Drawing saved successfully", filename });
  });
});

// Serve saved drawings
app.get("/drawings/:filename", (req, res) => {
  const filePath = path.join(__dirname, "saved_drawings", req.params.filename);
  res.sendFile(filePath);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
