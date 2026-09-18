"use client";

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import { getErrorMessage } from "@/lib/api/errors";
import { useToast } from "@/components/layout/ToastProvider";

export type ConfirmTone = "primary" | "danger" | "warning" | "success";

const CONFIRM_BUTTON_CLASSES: Record<ConfirmTone, string> = {
  primary: "bg-koraya-navy hover:bg-koraya-navy/90",
  danger: "bg-red-600 hover:bg-red-700",
  warning: "bg-amber-500 hover:bg-amber-600",
  success: "bg-emerald-600 hover:bg-emerald-700",
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: ConfirmTone;
  errorFallback?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  tone = "primary",
  errorFallback = "Une erreur est survenue.",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      showToast("error", getErrorMessage(err, errorFallback));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${CONFIRM_BUTTON_CLASSES[tone]}`}
          >
            {loading ? "Patientez..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
