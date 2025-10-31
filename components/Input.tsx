import React, { ChangeEvent, FocusEvent } from 'react';

interface InputProps {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'date';
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', value, onChange, placeholder, step, onBlur, name }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        step={step}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />
    </div>
  );
};

export default Input;