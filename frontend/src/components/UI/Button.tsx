import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  asChild = false,
  href,
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "font-bold rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-600/20 border border-brand-500/10",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10",
    outline:
      "border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 font-bold",
    ghost: "text-slate-600 hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const LoadingIndicator = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  if (asChild) {
    return <span className={buttonClass}>{children}</span>;
  }

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {loading && <LoadingIndicator />}
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled || loading} className={buttonClass} {...props}>
      {loading && <LoadingIndicator />}
      {children}
    </button>
  );
};

export default Button;
