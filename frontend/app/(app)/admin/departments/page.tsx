"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  DepartmentAdmin,
  createDepartment,
  deactivateDepartment,
  fetchDepartments,
  updateDepartment,
} from "@/lib/api/admin/departments";
import { SiteAdmin, fetchSites } from "@/lib/api/admin/sites";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import SortableHeader from "@/components/admin/SortableHeader";
import SearchInput from "@/components/admin/SearchInput";
import { useSortableData } from "@/lib/hooks/useSortableData";
import { DepartmentIcon } from "@/components/layout/icons";

type DepartmentSortKey = "name" | "site" | "active";

interface DepartmentFormState {
  name: string;
  siteId: string;
  active: boolean;
}

const EMPTY_FORM: DepartmentFormState = { name: "", siteId: "", active: true };

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState<DepartmentAdmin[]>([]);
  const [sites, setSites] = useState<SiteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DepartmentFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filteredDepartments = departments.filter((department) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [department.name, department.siteName ?? ""].join(" ").toLowerCase().includes(query);
  });

  const {
    sorted: sortedDepartments,
    sortKey,
    sortDir,
    toggleSort,
  } = useSortableData<DepartmentAdmin, DepartmentSortKey>(
    filteredDepartments,
    {
      name: (department) => department.name.toLowerCase(),
      site: (department) => (department.siteName ?? "").toLowerCase(),
      active: (department) => (department.active ? 1 : 0),
    },
    "name",
  );

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [departmentList, siteList] = await Promise.all([fetchDepartments(), fetchSites()]);
      setDepartments(departmentList);
      setSites(siteList);
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger les departements."));
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

  function openEdit(department: DepartmentAdmin) {
    setEditingId(department.id);
    setForm({ name: department.name, siteId: department.siteId ?? "", active: department.active });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const siteId = form.siteId || null;
      if (editingId) {
        await updateDepartment(editingId, { name: form.name, siteId, active: form.active });
      } else {
        await createDepartment({ name: form.name, siteId });
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Impossible d'enregistrer le departement."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(department: DepartmentAdmin) {
    try {
      if (department.active) {
        await deactivateDepartment(department.id);
      } else {
        await updateDepartment(department.id, {
          name: department.name,
          siteId: department.siteId,
          active: true,
        });
      }
      await load();
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de mettre a jour le departement."));
    }
  }

  return (
    <div>
      <AdminPageHeader title="Departements" icon={DepartmentIcon} actionLabel="Nouveau departement" onAction={openCreate} />

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un departement..." />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sortedDepartments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {departments.length === 0 ? "Aucun departement pour le moment." : "Aucun departement ne correspond a la recherche."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Nom" sortKeyValue="name" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Site" sortKeyValue="site" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedDepartments.map((department) => (
                <tr key={department.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{department.name}</td>
                  <td className="px-6 py-3 text-gray-500">{department.siteName || "Transverse"}</td>
                  <td className="px-6 py-3">
                    <StatusBadge active={department.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(department)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(department)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {department.active ? "Desactiver" : "Reactiver"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Modifier le departement" : "Nouveau departement"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="IT, RH, Comptabilite..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Site (optionnel)</label>
            <select
              value={form.siteId}
              onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            >
              <option value="">Departement transverse</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          {editingId && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-koraya-navy focus:ring-koraya-navy"
              />
              Departement actif
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
