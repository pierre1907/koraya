interface AdminPageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminPageHeader({ title, actionLabel, onAction }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">
          <span className="text-gray-400">Administration</span> / {title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{title}</h1>
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
