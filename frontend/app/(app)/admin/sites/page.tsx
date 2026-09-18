"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  SiteAdmin,
  createSite,
  deactivateSite,
  fetchSites,
  hardDeleteSite,
  updateSite,
} from "@/lib/api/admin/sites";
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
import { SiteIcon } from "@/components/layout/icons";
import { EyeIcon, PencilIcon, PowerIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/layout/ToastProvider";

type SiteSortKey = "name" | "address" | "active";

interface SiteFormState {
  name: string;
  address: string;
  active: boolean;
}

const EMPTY_FORM: SiteFormState = { name: "", address: "", active: true };

export default function SitesAdminPage() {
  const { showToast } = useToast();
  const [sites, setSites] = useState<SiteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SiteFormState>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [viewingSite, setViewingSite] = useState<SiteAdmin | null>(null);
  const [deletingSite, setDeletingSite] = useState<SiteAdmin | null>(null);
  const [togglingSite, setTogglingSite] = useState<SiteAdmin | null>(null);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  const filteredSites = sites.filter((site) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [site.name, site.address ?? ""].join(" ").toLowerCase().includes(query);
  });

  const { sorted: sortedSites, sortKey, sortDir, toggleSort } = useSortableData<SiteAdmin, SiteSortKey>(
    filteredSites,
    {
      name: (site) => site.name.toLowerCase(),
      address: (site) => (site.address ?? "").toLowerCase(),
      active: (site) => (site.active ? 1 : 0),
    },
    "name",
  );

  const { paginated: paginatedSites, page, setPage, pageSize, changePageSize, totalPages, totalItems } =
    usePagination(sortedSites);

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
    setModalOpen(true);
  }

  function openEdit(site: SiteAdmin) {
    setEditingId(site.id);
    setForm({ name: site.name, address: site.address ?? "", active: site.active });
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
      showToast("error", getErrorMessage(error, "Impossible de creer le site."));
    }
  }

  async function performSave() {
    if (editingId) {
      await updateSite(editingId, { name: form.name, address: form.address, active: form.active });
      showToast("success", `Site "${form.name}" modifie.`);
    } else {
      await createSite({ name: form.name, address: form.address });
      showToast("success", `Site "${form.name}" cree.`);
    }
    setConfirmingSubmit(false);
    setModalOpen(false);
    await load();
  }

  async function performToggle() {
    if (!togglingSite) return;
    if (togglingSite.active) {
      await deactivateSite(togglingSite.id);
      showToast("success", `Site "${togglingSite.name}" desactive.`);
    } else {
      await updateSite(togglingSite.id, { name: togglingSite.name, address: togglingSite.address ?? "", active: true });
      showToast("success", `Site "${togglingSite.name}" reactive.`);
    }
    setTogglingSite(null);
    await load();
  }

  async function performHardDelete() {
    if (!deletingSite) return;
    await hardDeleteSite(deletingSite.id);
    showToast("success", `Site "${deletingSite.name}" supprime definitivement.`);
    setDeletingSite(null);
    await load();
  }

  return (
    <div>
      <AdminPageHeader title="Sites" icon={SiteIcon} actionLabel="Nouveau site" onAction={openCreate} />

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un site..." />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sortedSites.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {sites.length === 0 ? "Aucun site pour le moment." : "Aucun site ne correspond a la recherche."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Nom" sortKeyValue="name" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Adresse" sortKeyValue="address" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSites.map((site) => (
                <tr key={site.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{site.name}</td>
                  <td className="px-6 py-3.5 text-gray-500">{site.address || "—"}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge active={site.active} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton icon={EyeIcon} label="Voir le detail" onClick={() => setViewingSite(site)} />
                      <IconButton icon={PencilIcon} label="Modifier" variant="edit" onClick={() => openEdit(site)} />
                      <IconButton
                        icon={PowerIcon}
                        label={site.active ? "Desactiver" : "Reactiver"}
                        variant={site.active ? "warning" : "success"}
                        onClick={() => setTogglingSite(site)}
                      />
                      <IconButton
                        icon={TrashIcon}
                        label="Supprimer definitivement"
                        variant="danger"
                        onClick={() => setDeletingSite(site)}
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
        open={viewingSite !== null}
        title={viewingSite?.name ?? ""}
        onClose={() => setViewingSite(null)}
        fields={[
          { label: "Nom", value: viewingSite?.name },
          { label: "Adresse", value: viewingSite?.address || "—" },
          { label: "Statut", value: viewingSite ? <StatusBadge active={viewingSite.active} /> : null },
        ]}
      />

      <ConfirmDialog
        open={confirmingSubmit}
        title="Confirmer la modification"
        description={`Enregistrer les modifications du site "${form.name}" ?`}
        confirmLabel="Enregistrer"
        tone="primary"
        errorFallback="Impossible d'enregistrer le site."
        onConfirm={performSave}
        onClose={() => setConfirmingSubmit(false)}
      />

      <ConfirmDialog
        open={togglingSite !== null}
        title={togglingSite?.active ? "Desactiver ce site ?" : "Reactiver ce site ?"}
        description={`"${togglingSite?.name}" sera ${togglingSite?.active ? "desactive" : "reactive"}.`}
        confirmLabel={togglingSite?.active ? "Desactiver" : "Reactiver"}
        tone={togglingSite?.active ? "warning" : "success"}
        errorFallback="Impossible de mettre a jour le site."
        onConfirm={performToggle}
        onClose={() => setTogglingSite(null)}
      />

      <ConfirmDialog
        open={deletingSite !== null}
        title="Supprimer ce site ?"
        description={`Cette action est irreversible. "${deletingSite?.name}" sera definitivement supprime.`}
        confirmLabel="Supprimer definitivement"
        tone="danger"
        errorFallback="Impossible de supprimer le site."
        onConfirm={performHardDelete}
        onClose={() => setDeletingSite(null)}
      />
    </div>
  );
}
