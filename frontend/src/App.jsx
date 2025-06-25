import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UploadForm from './components/UploadForm'
import ResultPage from './components/ResultPage'
import { useState } from 'react'

function App() {
      const [viewType,setVeiwType] = useState("video")
  return (
    <Router>
            <header>
          <h1 className="header_title">바른척</h1>
          <div className="button-container">
              <button className={`stream ${viewType == 'stream' ? 'select-view-type':''}`} onClick={() => {setVeiwType("stream")
                location.assign('https://barunchuk.5team.store')
              }}>실시간 영상</button>
              <button className={`video ${viewType == 'video' ? 'select-view-type':''}` } onClick={() => {setVeiwType("video")
                location.assign('http://barunchuck.5team.store')
              }}>업로드 영상</button>
          </div>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/result/:filename" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
