"use client";

import { ReactNode } from "react";
import Modal from "@/components/admin/Modal";

export interface DetailField {
  label: string;
  value: ReactNode;
}

interface DetailModalProps {
  open: boolean;
  title: string;
  fields: DetailField[];
  onClose: () => void;
}

export default function DetailModal({ open, title, fields, onClose }: DetailModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <dl className="divide-y divide-gray-100">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-gray-500">{field.label}</dt>
            <dd className="text-right font-medium text-gray-900">{field.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
