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

  const logoBase64 = "data:image/webp;base64,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";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-cream via-ui-bg to-primary-light flex items-center justify-center">
      <div className="animate-fade-in">
        <img
          src={logoBase64}
          alt="TimeShare Logo"
          className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl animate-pulse-slow"
        />
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
