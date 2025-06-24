const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const DRAWN_DIR = path.join(__dirname, '../drawn_videos'); // 로컬 저장 디렉토리

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  region: REGION
});

// 디렉토리 없으면 생성
if (!fs.existsSync(DRAWN_DIR)) {
  fs.mkdirSync(DRAWN_DIR);
}

router.get('/getDrawnVideo/:filename', async (req, res) => {
  const filename = req.params.filename;
  const key = `videos_drawn/${filename}`;
  const localPath = path.join(DRAWN_DIR, filename);

  // 이미 파일이 로컬에 있으면 바로 제공
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }

  // S3에서 다운받아 저장하고 응답
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  const file = fs.createWriteStream(localPath);

  s3.getObject(params).createReadStream()
    .on('error', err => {
      console.error('❌ Failed to stream drawn video:', err.message);
      res.status(404).json({ error: 'Drawn video not found' });
    })
    .pipe(file)
    .on('close', () => {
      res.sendFile(localPath);
    });
});

module.exports = router;