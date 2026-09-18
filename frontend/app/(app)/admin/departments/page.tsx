"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  DepartmentAdmin,
  createDepartment,
  deactivateDepartment,
  fetchDepartments,
  hardDeleteDepartment,
  updateDepartment,
} from "@/lib/api/admin/departments";
import { SiteAdmin, fetchSites } from "@/lib/api/admin/sites";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import DetailModal from "@/components/admin/DetailModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import SortableHeader from "@/components/admin/SortableHeader";
import SearchInput from "@/components/admin/SearchInput";
import IconButton from "@/components/admin/IconButton";
import Pagination from "@/components/admin/Pagination";
import { useSortableData } from "@/lib/hooks/useSortableData";
import { usePagination } from "@/lib/hooks/usePagination";
import { DepartmentIcon } from "@/components/layout/icons";
import { EyeIcon, PencilIcon, PowerIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/layout/ToastProvider";

type DepartmentSortKey = "name" | "site" | "active";

interface DepartmentFormState {
  name: string;
  siteId: string;
  active: boolean;
}

const EMPTY_FORM: DepartmentFormState = { name: "", siteId: "", active: true };

export default function DepartmentsAdminPage() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<DepartmentAdmin[]>([]);
  const [sites, setSites] = useState<SiteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DepartmentFormState>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [viewingDepartment, setViewingDepartment] = useState<DepartmentAdmin | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<DepartmentAdmin | null>(null);
  const [togglingDepartment, setTogglingDepartment] = useState<DepartmentAdmin | null>(null);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

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

  const {
    paginated: paginatedDepartments,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
  } = usePagination(sortedDepartments);

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
    setModalOpen(true);
  }

  function openEdit(department: DepartmentAdmin) {
    setEditingId(department.id);
    setForm({ name: department.name, siteId: department.siteId ?? "", active: department.active });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      setConfirmingSubmit(true);
      return;
    }
    try {
      await performSave();
    } catch (error) {
      showToast("error", getErrorMessage(error, "Impossible de creer le departement."));
    }
  }

  async function performSave() {
    const siteId = form.siteId || null;
    if (editingId) {
      await updateDepartment(editingId, { name: form.name, siteId, active: form.active });
      showToast("success", `Departement "${form.name}" modifie.`);
    } else {
      await createDepartment({ name: form.name, siteId });
      showToast("success", `Departement "${form.name}" cree.`);
    }
    setConfirmingSubmit(false);
    setModalOpen(false);
    await load();
  }

  async function performToggle() {
    if (!togglingDepartment) return;
    if (togglingDepartment.active) {
      await deactivateDepartment(togglingDepartment.id);
      showToast("success", `Departement "${togglingDepartment.name}" desactive.`);
    } else {
      await updateDepartment(togglingDepartment.id, {
        name: togglingDepartment.name,
        siteId: togglingDepartment.siteId,
        active: true,
      });
      showToast("success", `Departement "${togglingDepartment.name}" reactive.`);
    }
    setTogglingDepartment(null);
    await load();
  }

  async function performHardDelete() {
    if (!deletingDepartment) return;
    await hardDeleteDepartment(deletingDepartment.id);
    showToast("success", `Departement "${deletingDepartment.name}" supprime definitivement.`);
    setDeletingDepartment(null);
    await load();
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
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Nom" sortKeyValue="name" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Site" sortKeyValue="site" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDepartments.map((department) => (
                <tr key={department.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{department.name}</td>
                  <td className="px-6 py-3.5 text-gray-500">{department.siteName || "Transverse"}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge active={department.active} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton icon={EyeIcon} label="Voir le detail" onClick={() => setViewingDepartment(department)} />
                      <IconButton icon={PencilIcon} label="Modifier" variant="edit" onClick={() => openEdit(department)} />
                      <IconButton
                        icon={PowerIcon}
                        label={department.active ? "Desactiver" : "Reactiver"}
                        variant={department.active ? "warning" : "success"}
                        onClick={() => setTogglingDepartment(department)}
                      />
                      <IconButton
                        icon={TrashIcon}
                        label="Supprimer definitivement"
                        variant="danger"
                        onClick={() => setDeletingDepartment(department)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !loadError && totalItems > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={changePageSize}
          />
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
              className="rounded-md bg-koraya-navy px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>

      <DetailModal
        open={viewingDepartment !== null}
        title={viewingDepartment?.name ?? ""}
        onClose={() => setViewingDepartment(null)}
        fields={[
          { label: "Nom", value: viewingDepartment?.name },
          { label: "Site", value: viewingDepartment?.siteName || "Transverse" },
          { label: "Statut", value: viewingDepartment ? <StatusBadge active={viewingDepartment.active} /> : null },
        ]}
      />

      <ConfirmDialog
        open={confirmingSubmit}
        title="Confirmer la modification"
        description={`Enregistrer les modifications du departement "${form.name}" ?`}
        confirmLabel="Enregistrer"
        tone="primary"
        errorFallback="Impossible d'enregistrer le departement."
        onConfirm={performSave}
        onClose={() => setConfirmingSubmit(false)}
      />

      <ConfirmDialog
        open={togglingDepartment !== null}
        title={togglingDepartment?.active ? "Desactiver ce departement ?" : "Reactiver ce departement ?"}
        description={`"${togglingDepartment?.name}" sera ${togglingDepartment?.active ? "desactive" : "reactive"}.`}
        confirmLabel={togglingDepartment?.active ? "Desactiver" : "Reactiver"}
        tone={togglingDepartment?.active ? "warning" : "success"}
        errorFallback="Impossible de mettre a jour le departement."
        onConfirm={performToggle}
        onClose={() => setTogglingDepartment(null)}
      />

      <ConfirmDialog
        open={deletingDepartment !== null}
        title="Supprimer ce departement ?"
        description={`Cette action est irreversible. "${deletingDepartment?.name}" sera definitivement supprime.`}
        confirmLabel="Supprimer definitivement"
        tone="danger"
        errorFallback="Impossible de supprimer le departement."
        onConfirm={performHardDelete}
        onClose={() => setDeletingDepartment(null)}
      />
    </div>
  );
}
