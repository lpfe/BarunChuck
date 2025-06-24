const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DRAWN_DIR = path.join(__dirname, '../drawn_videos'); // 로컬 저장 디렉토리

// 디렉토리 없으면 생성
if (!fs.existsSync(DRAWN_DIR)) {
  fs.mkdirSync(DRAWN_DIR);
}

router.get('/getDrawnVideo/:filename', (req, res) => {
  const filename = req.params.filename;
  const localPath = path.join(DRAWN_DIR, filename);

  if (!fs.existsSync(localPath)) {
    console.error(`❌ File not found: ${localPath}`);
    return res.status(404).json({ error: 'Drawn video not found' });
  }

  res.sendFile(localPath);
});

module.exports = router;
