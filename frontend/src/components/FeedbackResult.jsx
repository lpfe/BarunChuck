import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackResult = ({ filename }) => {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!filename) return;

    axios.get(`http://localhost:8000/getFeedback/${filename}`)
      .then(res => setFeedback(res.data))
      .catch(err => {
        alert('❌ 피드백을 불러올 수 없습니다.');
        console.error(err);
      });
  }, [filename]);

  if (!feedback) return <p className="text-center mt-4 text-gray-500">📡 피드백 로딩 중...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* 좌측: 영상 */}
      <div className="bg-black rounded-xl shadow overflow-hidden">
        <video controls className="w-full">
          <source src={`https://your-s3-bucket/videos/${filename}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 우측: 피드백 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">분석 피드백</h2>

        <div className="bg-blue-700 text-white p-4 rounded-xl mb-4">
          <h3 className="font-bold mb-1">최종 요약</h3>
          <p className="text-sm leading-relaxed">{feedback.summary}</p>
        </div>

        <div className="space-y-4">
          {feedback.segments.map((seg, idx) => {
            const start = (seg.start / 30).toFixed(2);
            const end = (seg.end / 30).toFixed(2);
            let icon = '✅';
            let color = 'bg-green-100 text-green-800';
            let title = 'GOOD POSTURE';
            let message = '자세가 안정적입니다.';

            if (seg.state === 'tilted') {
              icon = '⚠️';
              color = 'bg-yellow-100 text-yellow-800';
              title = 'TILTED';
              message = '어깨가 기울어져 있어요. 좌우 밸런스를 맞춰보세요.';
            } else if (seg.state === 'no_person') {
              icon = '❓';
              color = 'bg-gray-100 text-gray-600';
              title = 'NO PERSON';
              message = '사람이 감지되지 않았어요.';
            }

            return (
              <div key={idx} className={`p-4 rounded-xl ${color} shadow-sm`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{icon} {title}</span>
                  <span className="text-xs font-mono">{start}s ~ {end}s</span>
                </div>
                <p className="text-sm mt-1">{message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackResult;
