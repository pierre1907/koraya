"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AllowedDomainAdmin,
  createAllowedDomain,
  fetchAllowedDomains,
  setAllowedDomainStatus,
} from "@/lib/api/admin/allowedDomains";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AllowedDomainsAdminPage() {
  const [domains, setDomains] = useState<AllowedDomainAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      setDomains(await fetchAllowedDomains());
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger les domaines."));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setDomain("");
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await createAllowedDomain({ domain });
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Impossible d'ajouter ce domaine."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(item: AllowedDomainAdmin) {
    try {
      await setAllowedDomainStatus(item.id, !item.active);
      await load();
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de mettre a jour le domaine."));
    }
  }

  return (
    <div>
      <AdminPageHeader title="Domaines autorises" actionLabel="Nouveau domaine" onAction={openCreate} />

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : domains.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun domaine pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Domaine</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {domains.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">@{item.domain}</td>
                  <td className="px-6 py-3">
                    <StatusBadge active={item.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {item.active ? "Desactiver" : "Reactiver"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title="Nouveau domaine autorise" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Domaine</label>
            <div className="flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-koraya-navy">
              <span className="bg-gray-50 px-3 py-2 text-sm text-gray-400">@</span>
              <input
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 text-sm focus:outline-none"
                placeholder="pfoafrica-senegal.com"
              />
            </div>
          </div>

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
