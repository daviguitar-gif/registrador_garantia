import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5";

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;