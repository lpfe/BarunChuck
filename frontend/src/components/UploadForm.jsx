import { useState } from 'react'
import axios from 'axios'
import './styles/UploadForm.css'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

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

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('attachment', file)

    try {
      setUploading(true)
      const res = await axios.post('http://localhost:8000/uploadFile', formData)
      alert('✅ Upload success!')
      console.log(res.data)
    } catch (err) {
      alert('❌ Upload failed')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-1 text-gray-900">Posture Perfect</h1>
        <p className="text-center text-gray-500 mb-6">AI-Powered Posture Analysis</p>

        <form onSubmit={handleUpload}>
          <div
            className={`upload-box ${isDragging ? 'dragover' : ''} flex flex-col items-center justify-center rounded-xl cursor-pointer h-60`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => document.getElementById('fileUpload').click()}
          >
            <svg className="w-12 h-12 text-indigo-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.664-1.664a4 4 0 015.656 0L12 12m0 0l.68-.68a4 4 0 015.656 0L20 12m-8 0v6" />
            </svg>
            <p className="text-gray-700">Drag & Drop your video here</p>
            <span className="text-sm text-gray-500 mt-1">or</span>
            <button type="button" className="upload-button">📁 Browse Files</button>
            <input
              id="fileUpload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {file && (
            <p className="file-name">📁 Selected File: {file.name}</p>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="upload-button w-full mt-6"
          >
            {uploading ? 'Uploading...' : 'Analyze Posture'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadForm
