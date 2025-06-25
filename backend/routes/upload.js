const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION
});

const BUCKET_NAME = process.env.BUCKET_NAME;

// ✅ multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploadedFiles')),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// ✅ POST /uploadFile
router.post('/uploadFile', upload.single('attachment'), async (req, res) => {
  console.log('✅ [uploadFile] 호출됨');
  if (!req.file) {
    console.error('❌ [uploadFile] 파일이 없습니다.');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filename = req.file.filename;
    const filePath = path.join(__dirname, '../uploadedFiles', filename);
    console.log(`📁 저장된 파일: ${filePath}`);

    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: BUCKET_NAME,
      Key: `videos/${filename}`,
      Body: fileContent,
      ContentType: req.file.mimetype
    };

    console.log(`📤 S3 업로드 중... Key: videos/${filename}`);
    s3.upload(params, (err, data) => {
      fs.unlink(filePath, () => {}); // 로컬 파일 삭제
      if (err) {
        console.error('❌ S3 업로드 실패:', err);
        return res.status(500).json({ error: 'S3 Upload failed', details: err });
      }

      console.log('✅ S3 업로드 완료:', data.Location);
      res.status(200).json({
        message: 'Upload successful',
        url: data.Location,
        filename: filename.replace(/\.mp4$/i, '')
      });
    });
  } catch (err) {
    console.error('❌ 서버 에러:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// ✅ GET /getFeedback/:filename
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
