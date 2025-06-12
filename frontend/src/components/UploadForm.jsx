import { useState } from 'react'
import axios from 'axios'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
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
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Posture Perfect</h1>
        <p className="text-center text-gray-500 mb-6">AI-Powered Posture Analysis</p>

        <form onSubmit={handleUpload}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={`flex flex-col items-center justify-center w-full h-60 px-4 transition bg-indigo-50 border-2 border-dashed ${
              isDragging ? 'border-indigo-600 bg-indigo-100' : 'border-indigo-300'
            } rounded-xl cursor-pointer`}
          >
            <svg className="w-12 h-12 text-indigo-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.664-1.664a4 4 0 015.656 0L12 12m0 0l.68-.68a4 4 0 015.656 0L20 12m-8 0v6" />
            </svg>
            <p className="mb-1 text-sm text-gray-600">Drag & Drop your video here</p>
            <p className="text-sm text-indigo-500 font-medium">or <span className="underline">Browse Files</span></p>
            <input
              id="fileUpload"
              name="attachment"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Analyze Posture'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadForm
