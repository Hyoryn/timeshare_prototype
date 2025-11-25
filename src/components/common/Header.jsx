import { useMode } from '../../context/ModeContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBack = false, showModeToggle = true, actions }) => {
  const { mode, switchMode, isSeniorMode } = useMode();
  const navigate = useNavigate();

  const handleModeToggle = () => {
    switchMode(mode === 'youth' ? 'senior' : 'youth');
  };

  return (
    <header className="bg-ui-card border-b border-ui-border sticky top-0 z-50">
      <div className={`max-w-screen-xl mx-auto px-4 ${isSeniorMode ? 'py-5' : 'py-4'} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className={`${isSeniorMode ? 'text-2xl p-2' : 'text-xl p-1'} text-ui-text hover:text-primary-main transition-colors`}
            >
              ←
            </button>
          )}
          <h1 className={`font-bold text-ui-text ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {showModeToggle && (
            <button
              onClick={handleModeToggle}
              className={`${isSeniorMode ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'} bg-primary-cream text-primary-main rounded-lg hover:bg-primary-light transition-colors font-medium`}
            >
              {mode === 'youth' ? '시니어 모드' : '청년 모드'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
