import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UploadForm from './components/UploadForm'
import ResultPage from './components/ResultPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/result/:filename" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
