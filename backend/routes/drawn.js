const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 로컬 저장된 keypoint 영상 위치
const DRAWN_DIR = path.join(__dirname, '../drawn_videos');
console.log("Looking for:", localPath);


// 디렉토리 없으면 생성
if (!fs.existsSync(DRAWN_DIR)) {
  fs.mkdirSync(DRAWN_DIR)
}

// 분석된 영상 불러오기 (S3 대신 로컬)
router.get('/getDrawnVideo/:filename', async (req, res) => {
  const filename = req.params.filename.endsWith('.mp4')
    ? req.params.filename
    : `${req.params.filename}.mp4`;

  const localPath = path.join(DRAWN_DIR, filename)

  if (!fs.existsSync(localPath)) {
    console.error(`❌ Video not found: ${filename}`)
    return res.status(404).json({ error: 'Drawn video not found' })
  }

  res.sendFile(localPath)
})

module.exports = router;
