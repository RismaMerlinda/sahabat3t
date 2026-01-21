const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        let token;

        // 1️⃣ Ambil dari Authorization Header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // 2️⃣ Ambil dari Cookie (kalau login pakai cookie)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Akses ditolak. Token tidak ditemukan.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        console.error("AUTH ERROR:", err.message);
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau kadaluarsa",
        });
    }
};

module.exports = auth;
