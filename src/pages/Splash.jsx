import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 모드 선택 화면으로 이동
    const timer = setTimeout(() => {
      navigate('/select-mode');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-cream via-ui-bg to-primary-light flex items-center justify-center">
      <div className="animate-fade-in flex flex-col items-center">
        {/* SVG 로고 */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="drop-shadow-2xl animate-pulse-slow"
        >
          {/* 배경 원 */}
          <circle cx="140" cy="140" r="120" fill="#F5E6D3" />

          {/* 순환 화살표 1 (상단) */}
          <path
            d="M 140 40 A 100 100 0 0 1 220 140"
            fill="none"
            stroke="#C9965F"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points="225,145 215,135 205,145"
            fill="#C9965F"
          />

          {/* 순환 화살표 2 (하단) */}
          <path
            d="M 140 240 A 100 100 0 0 1 60 140"
            fill="none"
            stroke="#B8824A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points="55,135 65,145 75,135"
            fill="#B8824A"
          />

          {/* 시계 외부 원 */}
          <circle cx="140" cy="140" r="60" fill="white" stroke="#C9965F" strokeWidth="4" />

          {/* 시계 숫자 표시 (12, 3, 6, 9) */}
          <circle cx="140" cy="90" r="3" fill="#C9965F" />
          <circle cx="190" cy="140" r="3" fill="#C9965F" />
          <circle cx="140" cy="190" r="3" fill="#C9965F" />
          <circle cx="90" cy="140" r="3" fill="#C9965F" />

          {/* 시침 */}
          <line
            x1="140"
            y1="140"
            x2="140"
            y2="115"
            stroke="#B8824A"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* 분침 */}
          <line
            x1="140"
            y1="140"
            x2="165"
            y2="115"
            stroke="#C9965F"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 중심점 */}
          <circle cx="140" cy="140" r="6" fill="#C9965F" />
        </svg>

        {/* TimeShare 텍스트 */}
        <div className="mt-6">
          <h1 className="text-5xl font-bold text-primary-main tracking-wide">
            TimeShare
          </h1>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash;
