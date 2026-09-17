"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  JobTitleAdmin,
  createJobTitle,
  deactivateJobTitle,
  fetchJobTitles,
  updateJobTitle,
} from "@/lib/api/admin/jobTitles";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";

const EMPTY_FORM = { title: "", active: true };

export default function JobTitlesAdminPage() {
  const [jobTitles, setJobTitles] = useState<JobTitleAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      setJobTitles(await fetchJobTitles());
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger les postes."));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(jobTitle: JobTitleAdmin) {
    setEditingId(jobTitle.id);
    setForm({ title: jobTitle.title, active: jobTitle.active });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateJobTitle(editingId, { title: form.title, active: form.active });
      } else {
        await createJobTitle({ title: form.title });
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Impossible d'enregistrer le poste."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(jobTitle: JobTitleAdmin) {
    try {
      if (jobTitle.active) {
        await deactivateJobTitle(jobTitle.id);
      } else {
        await updateJobTitle(jobTitle.id, { title: jobTitle.title, active: true });
      }
      await load();
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de mettre a jour le poste."));
    }
  }

  return (
    <div>
      <AdminPageHeader title="Postes" actionLabel="Nouveau poste" onAction={openCreate} />

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : jobTitles.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun poste pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Intitule</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobTitles.map((jobTitle) => (
                <tr key={jobTitle.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{jobTitle.title}</td>
                  <td className="px-6 py-3">
                    <StatusBadge active={jobTitle.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(jobTitle)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(jobTitle)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {jobTitle.active ? "Desactiver" : "Reactiver"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editingId ? "Modifier le poste" : "Nouveau poste"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Intitule du poste</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="Charge Support IT"
            />
          </div>

          {editingId && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-koraya-navy focus:ring-koraya-navy"
              />
              Poste actif
            </label>
          )}

          {formError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-koraya-navy px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
