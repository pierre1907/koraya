"use client";

import { ReactNode } from "react";

type IconButtonVariant = "neutral" | "edit" | "success" | "warning" | "danger";

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  neutral: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
  edit: "text-koraya-navy hover:bg-koraya-navy/10",
  success: "text-emerald-600 hover:bg-emerald-50",
  warning: "text-amber-600 hover:bg-amber-50",
  danger: "text-red-600 hover:bg-red-50",
};

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
}

export default function IconButton({ icon, label, variant = "neutral", onClick, disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${VARIANT_CLASSES[variant]}`}
    >
      {icon}
    </button>
  );
}
