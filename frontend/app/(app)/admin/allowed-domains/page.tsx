"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AllowedDomainAdmin,
  createAllowedDomain,
  fetchAllowedDomains,
  hardDeleteAllowedDomain,
  setAllowedDomainStatus,
} from "@/lib/api/admin/allowedDomains";
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
import { DomainIcon } from "@/components/layout/icons";
import { EyeIcon, PowerIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/layout/ToastProvider";

type DomainSortKey = "domain" | "active";

export default function AllowedDomainsAdminPage() {
  const { showToast } = useToast();
  const [domains, setDomains] = useState<AllowedDomainAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");
  const [viewingDomain, setViewingDomain] = useState<AllowedDomainAdmin | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<AllowedDomainAdmin | null>(null);
  const [togglingDomain, setTogglingDomain] = useState<AllowedDomainAdmin | null>(null);

  const filteredDomains = domains.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return item.domain.toLowerCase().includes(query);
  });

  const { sorted: sortedDomains, sortKey, sortDir, toggleSort } = useSortableData<AllowedDomainAdmin, DomainSortKey>(
    filteredDomains,
    {
      domain: (item) => item.domain.toLowerCase(),
      active: (item) => (item.active ? 1 : 0),
    },
    "domain",
  );

  const {
    paginated: paginatedDomains,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
  } = usePagination(sortedDomains);

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
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await performSave();
    } catch (error) {
      showToast("error", getErrorMessage(error, "Impossible d'ajouter ce domaine."));
    }
  }

  async function performSave() {
    await createAllowedDomain({ domain });
    showToast("success", `Domaine "@${domain}" ajoute.`);
    setModalOpen(false);
    await load();
  }

  async function performToggle() {
    if (!togglingDomain) return;
    await setAllowedDomainStatus(togglingDomain.id, !togglingDomain.active);
    showToast("success", `Domaine "@${togglingDomain.domain}" ${togglingDomain.active ? "desactive" : "reactive"}.`);
    setTogglingDomain(null);
    await load();
  }

  async function performHardDelete() {
    if (!deletingDomain) return;
    await hardDeleteAllowedDomain(deletingDomain.id);
    showToast("success", `Domaine "@${deletingDomain.domain}" supprime definitivement.`);
    setDeletingDomain(null);
    await load();
  }

  return (
    <div>
      <AdminPageHeader title="Domaines autorises" icon={DomainIcon} actionLabel="Nouveau domaine" onAction={openCreate} />

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un domaine..." />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sortedDomains.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {domains.length === 0 ? "Aucun domaine pour le moment." : "Aucun domaine ne correspond a la recherche."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Domaine" sortKeyValue="domain" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDomains.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-medium text-gray-900">@{item.domain}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge active={item.active} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton icon={EyeIcon} label="Voir le detail" onClick={() => setViewingDomain(item)} />
                      <IconButton
                        icon={PowerIcon}
                        label={item.active ? "Desactiver" : "Reactiver"}
                        variant={item.active ? "warning" : "success"}
                        onClick={() => setTogglingDomain(item)}
                      />
                      <IconButton
                        icon={TrashIcon}
                        label="Supprimer definitivement"
                        variant="danger"
                        onClick={() => setDeletingDomain(item)}
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
        open={viewingDomain !== null}
        title={viewingDomain ? `@${viewingDomain.domain}` : ""}
        onClose={() => setViewingDomain(null)}
        fields={[
          { label: "Domaine", value: viewingDomain ? `@${viewingDomain.domain}` : null },
          { label: "Statut", value: viewingDomain ? <StatusBadge active={viewingDomain.active} /> : null },
          {
            label: "Ajoute le",
            value: viewingDomain ? new Date(viewingDomain.createdAt).toLocaleDateString("fr-FR") : null,
          },
        ]}
      />

      <ConfirmDialog
        open={togglingDomain !== null}
        title={togglingDomain?.active ? "Desactiver ce domaine ?" : "Reactiver ce domaine ?"}
        description={`"@${togglingDomain?.domain}" sera ${togglingDomain?.active ? "desactive" : "reactive"}.`}
        confirmLabel={togglingDomain?.active ? "Desactiver" : "Reactiver"}
        tone={togglingDomain?.active ? "warning" : "success"}
        errorFallback="Impossible de mettre a jour le domaine."
        onConfirm={performToggle}
        onClose={() => setTogglingDomain(null)}
      />

      <ConfirmDialog
        open={deletingDomain !== null}
        title="Supprimer ce domaine ?"
        description={`Cette action est irreversible. "@${deletingDomain?.domain}" sera definitivement supprime.`}
        confirmLabel="Supprimer definitivement"
        tone="danger"
        errorFallback="Impossible de supprimer le domaine."
        onConfirm={performHardDelete}
        onClose={() => setDeletingDomain(null)}
      />
    </div>
  );
}
