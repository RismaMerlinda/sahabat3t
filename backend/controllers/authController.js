const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { full_name, npsn, email, password } = req.body;

    if (!full_name || !npsn || !email || !password) {
      return res.status(400).json({
        message: 'Semua field (termasuk NPSN) wajib diisi',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email sudah terdaftar',
      });
    }

    // Cek NPSN duplicate juga
    const existingNpsn = await User.findOne({ npsn });
    if (existingNpsn) {
      return res.status(400).json({
        message: 'NPSN sudah terdaftar',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      npsn,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Register berhasil',
      user: {
        id: user._id,
        full_name: user.full_name,
        schoolName: user.full_name, // Alias for frontend
        npsn: user.npsn,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Email atau password salah',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Email atau password salah',
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        schoolName: user.full_name, // Alias for frontend
        npsn: user.npsn,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
