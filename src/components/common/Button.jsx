import { useMode } from '../../context/ModeContext';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const { isSeniorMode } = useMode();

  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary-main text-white hover:bg-primary-accent active:scale-95',
    secondary: 'bg-ui-card text-ui-text border-2 border-primary-main hover:bg-primary-cream',
    outline: 'bg-transparent text-primary-main border-2 border-primary-main hover:bg-primary-cream',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeStyles = isSeniorMode ? {
    sm: 'px-4 py-3 text-base min-h-[48px]',
    md: 'px-6 py-4 text-lg min-h-[56px]',
    lg: 'px-8 py-5 text-xl min-h-[64px]',
  } : {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
