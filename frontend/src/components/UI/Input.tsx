import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 ${icon ? "pl-10" : ""} rounded-lg
            border border-surface-300 
            focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100
            text-surface-900 placeholder-surface-400
            transition-colors duration-150
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}
            disabled:bg-surface-100 disabled:cursor-not-allowed disabled:text-surface-500
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-surface-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
