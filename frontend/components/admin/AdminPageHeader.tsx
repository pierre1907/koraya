import { ReactNode } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { AdminIcon } from "@/components/layout/icons";

interface AdminPageHeaderProps {
  title: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminPageHeader({ title, icon, actionLabel, onAction }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Breadcrumb
          items={[
            { label: "Administration", icon: AdminIcon },
            { label: title, icon },
          ]}
        />
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-koraya-navy px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
