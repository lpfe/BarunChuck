import { useState } from 'react'
import axios from 'axios'

function UploadForm() {
const [file, setFile] = useState(null)
const [preview, setPreview] = useState('')
const [uploading, setUploading] = useState(false)

const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
}

const handleUpload = async () => {
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
    <div className="w-full max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md text-center">
    <h1 className="text-3xl font-bold mb-2">Posture Perfect</h1>
    <p className="text-gray-500 mb-4">AI-Powered Posture Analysis</p>

    <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />
    {preview && (
        <video src={preview} controls className="w-full max-h-64 mb-4" />
    )}

    <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
    >
        {uploading ? 'Uploading...' : 'Analyze Posture'}
    </button>
    </div>
)
}

export default UploadForm
