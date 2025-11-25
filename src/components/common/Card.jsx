import { useMode } from '../../context/ModeContext';

const Card = ({ children, className = '', onClick, hover = false }) => {
  const { isSeniorMode } = useMode();

  const baseStyles = 'bg-ui-card rounded-xl border border-ui-border';
  const paddingStyles = isSeniorMode ? 'p-6' : 'p-4';
  const hoverStyles = hover ? 'cursor-pointer hover:shadow-lg hover:border-primary-main transition-all duration-200' : '';

  return (
    <div
      className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
