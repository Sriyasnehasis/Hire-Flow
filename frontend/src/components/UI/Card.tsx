import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
  onClick,
}) => {
  const hoverClass = hoverable
    ? "hover:shadow-2xl hover:shadow-brand-500/10 hover:border-slate-300 cursor-pointer -translate-y-1"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/[0.02] p-6 transition-all duration-500 ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => (
  <div className={`pb-6 mb-6 border-b border-slate-50 ${className}`}>
    {title && <h3 className="text-2xl font-bold text-slate-900">{title}</h3>}
    {subtitle && <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
}) => <div className={`${className}`}>{children}</div>;

export default Card;
