import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/UploadForm.css'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) setFile(selected)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('attachment', file)

    try {
      setUploading(true)
      // const res = await axios.post('http://56.155.62.180:8000/uploadFile', formData)
      const res = await axios.post('https://barunchuck.5team.store/uploadFile', formData)
      const name = res.data.filename.replace('.mp4', '')
      alert('✅ Upload success!')
      navigate(`/result/${name}`) // ✅ 결과 페이지로 자동 이동
    } catch (err) {
      alert('❌ Upload failed')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
      <div className="wrapper">

      <main>
      <div className="container">
      <div className="card">
        <h1 className="title">영상 분석</h1>
        <p className="subtitle">AI-Powered Posture Analysis!</p>

        <div
          className={`upload-area ${isDragging ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <svg className="upload-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.664-1.664a4 4 0 015.656 0L12 12m0 0l.68-.68a4 4 0 015.656 0L20 12m-8 0v6" />
          </svg>
          <p>Drag & Drop your video here</p>
          {/* <span className="or-text">or</span> */}

          <input
            id="fileUpload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            className="btn"
            onClick={() => document.getElementById('fileUpload').click()}
          >
            📁 Browse Files
          </button>
        </div>

          {file && (
            <p className="file-name">📁 Selected File: {file.name}</p>
          )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn full"
        >
          {uploading ? 'Uploading...' : 'Analyze Posture'}
        </button>
      </div>
    </div>
            </main>
        </div>

  )
}

export default UploadForm
