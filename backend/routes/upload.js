const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const router = express.Router();

// AWS 설정
const s3 = new AWS.S3({
accessKeyId: process.env.ID,
secretAccessKey: process.env.SECRET,
region: process.env.REGION
});

const BUCKET_NAME = process.env.BUCKET_NAME;

// multer 설정
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploadedFiles')),
filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// POST /uploadFile
router.post('/uploadFile', upload.single('attachment'), async (req, res) => {
  console.log('✅ POST /uploadFile 호출됨')
try {
    const filename = req.file.filename;
    const filePath = path.join(__dirname, '../uploadedFiles', filename);
    const fileContent = fs.readFileSync(filePath);

    const params = {
    Bucket: BUCKET_NAME,
    Key: `videos/${filename}`,
    Body: fileContent,
    ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
    fs.unlink(filePath, () => {}); // 업로드 후 로컬 삭제
    if (err) return res.status(500).json({ error: 'S3 Upload failed', details: err });
    return res.status(200).json({ message: 'Upload successful', url: data.Location, filename: filename.replace(/\.mp4$/i, '') });
    });
} catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
}
});

// 분석된 피드백 불러오기
router.get('/getFeedback/:filename', async (req, res) => {
  const filename = req.params.filename.endsWith('.json')
    ? req.params.filename
    : `${req.params.filename}.json`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `feedbacks/${filename}`
  };

  try {
    const data = await s3.getObject(params).promise();
    const feedback = JSON.parse(data.Body.toString('utf-8'));
    res.json(feedback);
  } catch (err) {
    console.error('❌ Failed to fetch feedback:', err.message);
    res.status(404).json({ error: 'Feedback not found' });
}
});

module.exports = router;
