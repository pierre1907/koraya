"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  JobTitleAdmin,
  createJobTitle,
  deactivateJobTitle,
  fetchJobTitles,
  hardDeleteJobTitle,
  updateJobTitle,
} from "@/lib/api/admin/jobTitles";
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
import { JobTitleIcon } from "@/components/layout/icons";
import { EyeIcon, PencilIcon, PowerIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/layout/ToastProvider";

type JobTitleSortKey = "title" | "active";

const EMPTY_FORM = { title: "", active: true };

export default function JobTitlesAdminPage() {
  const { showToast } = useToast();
  const [jobTitles, setJobTitles] = useState<JobTitleAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [viewingJobTitle, setViewingJobTitle] = useState<JobTitleAdmin | null>(null);
  const [deletingJobTitle, setDeletingJobTitle] = useState<JobTitleAdmin | null>(null);
  const [togglingJobTitle, setTogglingJobTitle] = useState<JobTitleAdmin | null>(null);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  const filteredJobTitles = jobTitles.filter((jobTitle) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return jobTitle.title.toLowerCase().includes(query);
  });

  const { sorted: sortedJobTitles, sortKey, sortDir, toggleSort } = useSortableData<JobTitleAdmin, JobTitleSortKey>(
    filteredJobTitles,
    {
      title: (jobTitle) => jobTitle.title.toLowerCase(),
      active: (jobTitle) => (jobTitle.active ? 1 : 0),
    },
    "title",
  );

  const {
    paginated: paginatedJobTitles,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
  } = usePagination(sortedJobTitles);

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
    setModalOpen(true);
  }

  function openEdit(jobTitle: JobTitleAdmin) {
    setEditingId(jobTitle.id);
    setForm({ title: jobTitle.title, active: jobTitle.active });
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
      showToast("error", getErrorMessage(error, "Impossible de creer le poste."));
    }
  }

  async function performSave() {
    if (editingId) {
      await updateJobTitle(editingId, { title: form.title, active: form.active });
      showToast("success", `Poste "${form.title}" modifie.`);
    } else {
      await createJobTitle({ title: form.title });
      showToast("success", `Poste "${form.title}" cree.`);
    }
    setConfirmingSubmit(false);
    setModalOpen(false);
    await load();
  }

  async function performToggle() {
    if (!togglingJobTitle) return;
    if (togglingJobTitle.active) {
      await deactivateJobTitle(togglingJobTitle.id);
      showToast("success", `Poste "${togglingJobTitle.title}" desactive.`);
    } else {
      await updateJobTitle(togglingJobTitle.id, { title: togglingJobTitle.title, active: true });
      showToast("success", `Poste "${togglingJobTitle.title}" reactive.`);
    }
    setTogglingJobTitle(null);
    await load();
  }

  async function performHardDelete() {
    if (!deletingJobTitle) return;
    await hardDeleteJobTitle(deletingJobTitle.id);
    showToast("success", `Poste "${deletingJobTitle.title}" supprime definitivement.`);
    setDeletingJobTitle(null);
    await load();
  }

  return (
    <div>
      <AdminPageHeader title="Postes" icon={JobTitleIcon} actionLabel="Nouveau poste" onAction={openCreate} />

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un poste..." />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sortedJobTitles.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {jobTitles.length === 0 ? "Aucun poste pour le moment." : "Aucun poste ne correspond a la recherche."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Intitule" sortKeyValue="title" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedJobTitles.map((jobTitle) => (
                <tr key={jobTitle.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{jobTitle.title}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge active={jobTitle.active} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton icon={EyeIcon} label="Voir le detail" onClick={() => setViewingJobTitle(jobTitle)} />
                      <IconButton icon={PencilIcon} label="Modifier" variant="edit" onClick={() => openEdit(jobTitle)} />
                      <IconButton
                        icon={PowerIcon}
                        label={jobTitle.active ? "Desactiver" : "Reactiver"}
                        variant={jobTitle.active ? "warning" : "success"}
                        onClick={() => setTogglingJobTitle(jobTitle)}
                      />
                      <IconButton
                        icon={TrashIcon}
                        label="Supprimer definitivement"
                        variant="danger"
                        onClick={() => setDeletingJobTitle(jobTitle)}
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
        open={viewingJobTitle !== null}
        title={viewingJobTitle?.title ?? ""}
        onClose={() => setViewingJobTitle(null)}
        fields={[
          { label: "Intitule", value: viewingJobTitle?.title },
          { label: "Statut", value: viewingJobTitle ? <StatusBadge active={viewingJobTitle.active} /> : null },
        ]}
      />

      <ConfirmDialog
        open={confirmingSubmit}
        title="Confirmer la modification"
        description={`Enregistrer les modifications du poste "${form.title}" ?`}
        confirmLabel="Enregistrer"
        tone="primary"
        errorFallback="Impossible d'enregistrer le poste."
        onConfirm={performSave}
        onClose={() => setConfirmingSubmit(false)}
      />

      <ConfirmDialog
        open={togglingJobTitle !== null}
        title={togglingJobTitle?.active ? "Desactiver ce poste ?" : "Reactiver ce poste ?"}
        description={`"${togglingJobTitle?.title}" sera ${togglingJobTitle?.active ? "desactive" : "reactive"}.`}
        confirmLabel={togglingJobTitle?.active ? "Desactiver" : "Reactiver"}
        tone={togglingJobTitle?.active ? "warning" : "success"}
        errorFallback="Impossible de mettre a jour le poste."
        onConfirm={performToggle}
        onClose={() => setTogglingJobTitle(null)}
      />

      <ConfirmDialog
        open={deletingJobTitle !== null}
        title="Supprimer ce poste ?"
        description={`Cette action est irreversible. "${deletingJobTitle?.title}" sera definitivement supprime.`}
        confirmLabel="Supprimer definitivement"
        tone="danger"
        errorFallback="Impossible de supprimer le poste."
        onConfirm={performHardDelete}
        onClose={() => setDeletingJobTitle(null)}
      />
    </div>
  );
}
