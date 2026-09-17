"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  SiteAdmin,
  createSite,
  deactivateSite,
  fetchSites,
  updateSite,
} from "@/lib/api/admin/sites";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";

interface SiteFormState {
  name: string;
  address: string;
  active: boolean;
}

const EMPTY_FORM: SiteFormState = { name: "", address: "", active: true };

export default function SitesAdminPage() {
  const [sites, setSites] = useState<SiteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SiteFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      setSites(await fetchSites());
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger les sites."));
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

  function openEdit(site: SiteAdmin) {
    setEditingId(site.id);
    setForm({ name: site.name, address: site.address ?? "", active: site.active });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateSite(editingId, { name: form.name, address: form.address, active: form.active });
      } else {
        await createSite({ name: form.name, address: form.address });
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Impossible d'enregistrer le site."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(site: SiteAdmin) {
    try {
      if (site.active) {
        await deactivateSite(site.id);
      } else {
        await updateSite(site.id, { name: site.name, address: site.address ?? "", active: true });
      }
      await load();
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de mettre a jour le site."));
    }
  }

  return (
    <div>
      <AdminPageHeader title="Sites" actionLabel="Nouveau site" onAction={openCreate} />

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sites.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun site pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Nom</th>
                <th className="px-6 py-3 font-medium">Adresse</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sites.map((site) => (
                <tr key={site.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{site.name}</td>
                  <td className="px-6 py-3 text-gray-500">{site.address || "—"}</td>
                  <td className="px-6 py-3">
                    <StatusBadge active={site.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(site)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(site)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {site.active ? "Desactiver" : "Reactiver"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editingId ? "Modifier le site" : "Nouveau site"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="Agence Dakar"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Adresse (optionnel)</label>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
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
              Site actif
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
