const jwt = require("jsonwebtoken");
const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.User;

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword
    });

    return res.status(200).json({
      message: "Doctor registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "2h" }
  );
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("❌ /me error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("❌ getCurrentUser ERROR:", err);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.query;
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ password: "🔒 Passwords are stored securely." });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
