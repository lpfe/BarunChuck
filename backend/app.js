const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadRouter = require('./routes/upload');
app.use('/', uploadRouter);

// 디렉토리 없으면 생성
const uploadDir = path.join(__dirname, 'uploadedFiles');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
