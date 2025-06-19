import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles//ResultPage.css' // 👈 CSS 연결

function ResultPage() {
  const { filename } = useParams()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/getFeedback/${filename}`)
        setFeedback(res.data)
      } catch (err) {
        console.error(err)
        alert('❌ 피드백을 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [filename])

  if (loading) return <div className="loading">Analyzing posture... ⏳</div>
  if (!feedback) return <div className="error">❌ 분석 데이터를 불러올 수 없습니다.</div>

  return (
    <div className="result-container">
      <div className="video-box">
        <video controls>
          <source src={`https://${BUCKET_NAME}.${REGION}/videos/${filename}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="feedback-box">
        <h2>분석 피드백</h2>

        <div className="summary-box">
          <h3>최종 요약</h3>
          <p>{feedback.summary}</p>
        </div>

        {feedback.segments.map((seg, idx) => {
          const start = (seg.start / 30).toFixed(2)
          const end = (seg.end / 30).toFixed(2)

          let stateClass = 'feedback-good'
          let icon = '✅'
          let title = 'GOOD POSTURE'
          let message = '자세가 안정적입니다.'

          if (seg.state === 'tilted') {
            stateClass = 'feedback-tilted'
            icon = '⚠️'
            title = 'TILTED'
            message = '어깨가 기울어져 있어요. 좌우 밸런스를 맞춰보세요.'
          } else if (seg.state === 'no_person') {
            stateClass = 'feedback-none'
            icon = '❓'
            title = 'NO PERSON'
            message = '사람이 감지되지 않았어요.'
          }

          return (
            <div key={idx} className={`feedback-card ${stateClass}`}>
              <div className="feedback-header">
                <span>{icon} {title}</span>
                <span className="feedback-time">{start}s ~ {end}s</span>
              </div>
              <p>{message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ResultPage
