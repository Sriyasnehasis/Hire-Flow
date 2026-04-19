import React from "react";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "gray";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  icon,
  onClose,
}) => {
  const variants = {
    primary: "bg-brand-100 text-brand-800 border-brand-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    danger: "bg-red-100 text-red-800 border-red-300",
    gray: "bg-surface-200 text-surface-800 border-surface-300",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 border rounded-full ${variants[variant]} ${sizes[size]} font-medium`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 hover:opacity-75 transition-opacity"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
