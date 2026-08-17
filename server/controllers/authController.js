const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Gmail validation
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Clean input
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Name validation
    if (cleanName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
      });
    }

    // Gmail validation
    if (!gmailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please use a valid Gmail address",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      email: cleanEmail,
    });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user
    user = new User({
      name: cleanName,
      email: cleanEmail,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      password,
      salt
    );

    // Save user
    await user.save();

    // JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Token - 7 days
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Token generation failed",
          });
        }

        res.status(201).json({
          message: "Registration successful",
          token,
        });
      }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Gmail validation
    if (!gmailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please use a valid Gmail address",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Token - 7 days
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Token generation failed",
          });
        }

        res.json({
          message: "Login successful",
          token,
        });
      }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};