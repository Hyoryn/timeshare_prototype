import { useMode } from '../../context/ModeContext';

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const { isSeniorMode } = useMode();

  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-cream text-primary-main',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeStyles = isSeniorMode ? {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
  } : {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
