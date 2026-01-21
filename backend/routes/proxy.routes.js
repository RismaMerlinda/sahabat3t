const express = require('express');
const router = express.Router();
const https = require('https');

// Proxy untuk mengambil data sekolah dari API Kemendikbud
router.get('/sekolah', async (req, res) => {
    const { npsn } = req.query;

    if (!npsn) {
        return res.status(400).json({ message: 'NPSN diperlukan' });
    }

    const url = `https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${npsn}`;
    // Catatan: Saya ganti endpoint ke API publik lain yang lebih stabil jika fazriansyah bermasalah, 
    // atau tetap gunakan fazriansyah tapi lewat backend.

    // Mari coba fazriansyah dulu via backend, biasanya lebih stabil karena no-cors
    const apiUrl = `https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`;

    https.get(apiUrl, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const json = JSON.parse(data);
                res.json(json);
            } catch (e) {
                res.status(500).json({ message: 'Error parsing external API response' });
            }
        });

    }).on('error', (err) => {
        console.error("Proxy Error:", err);
        res.status(500).json({ message: 'Gagal mengambil data dari Kemendikbud' });
    });
});

module.exports = router;
