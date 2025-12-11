import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

interface PasswordInputProps {
  label: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required,
  className = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        required={required}
        className={className}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}