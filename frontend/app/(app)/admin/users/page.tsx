"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  UserAdmin,
  UserRole,
  createUser,
  deactivateUser,
  fetchUsers,
  hardDeleteUser,
  updateUser,
} from "@/lib/api/admin/users";
import { SiteAdmin, fetchSites } from "@/lib/api/admin/sites";
import { DepartmentAdmin, fetchDepartments } from "@/lib/api/admin/departments";
import { JobTitleAdmin, fetchJobTitles } from "@/lib/api/admin/jobTitles";
import { AllowedDomainAdmin, fetchAllowedDomains } from "@/lib/api/admin/allowedDomains";
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
import { UsersIcon } from "@/components/layout/icons";
import { EyeIcon, PencilIcon, PowerIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/layout/ToastProvider";

type UserSortKey = "fullName" | "email" | "role" | "site" | "active";

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "AGENT", "USER"];

interface UserFormState {
  fullName: string;
  emailAlias: string;
  emailDomainId: string;
  password: string;
  role: UserRole;
  siteId: string;
  departmentId: string;
  jobTitleId: string;
  phoneNumber: string;
  active: boolean;
}

const EMPTY_FORM: UserFormState = {
  fullName: "",
  emailAlias: "",
  emailDomainId: "",
  password: "",
  role: "USER",
  siteId: "",
  departmentId: "",
  jobTitleId: "",
  phoneNumber: "",
  active: true,
};

export default function UsersAdminPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [sites, setSites] = useState<SiteAdmin[]>([]);
  const [departments, setDepartments] = useState<DepartmentAdmin[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitleAdmin[]>([]);
  const [domains, setDomains] = useState<AllowedDomainAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [viewingUser, setViewingUser] = useState<UserAdmin | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAdmin | null>(null);
  const [togglingUser, setTogglingUser] = useState<UserAdmin | null>(null);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [user.fullName, user.email, user.role, user.siteName ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const { sorted: sortedUsers, sortKey, sortDir, toggleSort } = useSortableData<UserAdmin, UserSortKey>(
    filteredUsers,
    {
      fullName: (user) => user.fullName.toLowerCase(),
      email: (user) => user.email.toLowerCase(),
      role: (user) => user.role,
      site: (user) => (user.siteName ?? "").toLowerCase(),
      active: (user) => (user.active ? 1 : 0),
    },
    "fullName",
  );

  const {
    paginated: paginatedUsers,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
  } = usePagination(sortedUsers);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [userList, siteList, departmentList, jobTitleList, domainList] = await Promise.all([
        fetchUsers(),
        fetchSites(),
        fetchDepartments(),
        fetchJobTitles(),
        fetchAllowedDomains(),
      ]);
      setUsers(userList);
      setSites(siteList);
      setDepartments(departmentList);
      setJobTitles(jobTitleList);
      setDomains(domainList);
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger les utilisateurs."));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingUser(null);
    setForm({ ...EMPTY_FORM, emailDomainId: domains.find((d) => d.active)?.id ?? "" });
    setModalOpen(true);
  }

  function openEdit(user: UserAdmin) {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      emailAlias: "",
      emailDomainId: "",
      password: "",
      role: user.role,
      siteId: user.siteId ?? "",
      departmentId: user.departmentId ?? "",
      jobTitleId: user.jobTitleId ?? "",
      phoneNumber: user.phoneNumber ?? "",
      active: user.active,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingUser) {
      setConfirmingSubmit(true);
      return;
    }
    try {
      await performSave();
    } catch (error) {
      showToast("error", getErrorMessage(error, "Impossible de creer l'utilisateur."));
    }
  }

  async function performSave() {
    if (editingUser) {
      await updateUser(editingUser.id, {
        fullName: form.fullName,
        role: form.role,
        siteId: form.siteId,
        departmentId: form.departmentId || null,
        jobTitleId: form.jobTitleId || null,
        phoneNumber: form.phoneNumber || undefined,
        active: form.active,
      });
      showToast("success", `Utilisateur "${form.fullName}" modifie.`);
    } else {
      await createUser({
        fullName: form.fullName,
        emailAlias: form.emailAlias,
        emailDomainId: form.emailDomainId,
        password: form.password,
        role: form.role,
        siteId: form.siteId,
        departmentId: form.departmentId || null,
        jobTitleId: form.jobTitleId || null,
        phoneNumber: form.phoneNumber || undefined,
      });
      showToast("success", `Utilisateur "${form.fullName}" cree.`);
    }
    setConfirmingSubmit(false);
    setModalOpen(false);
    await load();
  }

  async function performToggle() {
    if (!togglingUser) return;
    if (togglingUser.active) {
      await deactivateUser(togglingUser.id);
      showToast("success", `Utilisateur "${togglingUser.fullName}" desactive.`);
    } else {
      await updateUser(togglingUser.id, {
        fullName: togglingUser.fullName,
        role: togglingUser.role,
        siteId: togglingUser.siteId ?? "",
        departmentId: togglingUser.departmentId,
        jobTitleId: togglingUser.jobTitleId,
        phoneNumber: togglingUser.phoneNumber ?? undefined,
        active: true,
      });
      showToast("success", `Utilisateur "${togglingUser.fullName}" reactive.`);
    }
    setTogglingUser(null);
    await load();
  }

  async function performHardDelete() {
    if (!deletingUser) return;
    await hardDeleteUser(deletingUser.id);
    showToast("success", `Utilisateur "${deletingUser.fullName}" supprime definitivement.`);
    setDeletingUser(null);
    await load();
  }

  return (
    <div>
      <AdminPageHeader title="Utilisateurs" icon={UsersIcon} actionLabel="Nouvel utilisateur" onAction={openCreate} />

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un utilisateur..." />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : sortedUsers.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {users.length === 0 ? "Aucun utilisateur pour le moment." : "Aucun utilisateur ne correspond a la recherche."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Nom" sortKeyValue="fullName" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Email" sortKeyValue="email" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Role" sortKeyValue="role" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Site" sortKeyValue="site" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Statut" sortKeyValue="active" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-6 py-3.5 text-gray-500">{user.role}</td>
                  <td className="px-6 py-3.5 text-gray-500">{user.siteName || "—"}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge active={user.active} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton icon={EyeIcon} label="Voir le detail" onClick={() => setViewingUser(user)} />
                      <IconButton icon={PencilIcon} label="Modifier" variant="edit" onClick={() => openEdit(user)} />
                      <IconButton
                        icon={PowerIcon}
                        label={user.active ? "Desactiver" : "Reactiver"}
                        variant={user.active ? "warning" : "success"}
                        onClick={() => setTogglingUser(user)}
                      />
                      <IconButton
                        icon={TrashIcon}
                        label="Supprimer definitivement"
                        variant="danger"
                        onClick={() => setDeletingUser(user)}
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
        title={editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            />
          </div>

          {editingUser ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                disabled
                value={editingUser.email}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email professionnel</label>
              <div className="flex items-center gap-2">
                <input
                  required
                  value={form.emailAlias}
                  onChange={(e) => setForm((f) => ({ ...f, emailAlias: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
                  placeholder="prenom.nom"
                />
                <select
                  required
                  value={form.emailDomainId}
                  onChange={(e) => setForm((f) => ({ ...f, emailDomainId: e.target.value }))}
                  className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-koraya-navy focus:outline-none"
                >
                  <option value="">Domaine...</option>
                  {domains.filter((d) => d.active).map((d) => (
                    <option key={d.id} value={d.id}>
                      @{d.domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!editingUser && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe provisoire</label>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
                placeholder="8 caracteres minimum"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Site</label>
              <select
                required
                value={form.siteId}
                onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              >
                <option value="">Choisir...</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Departement (optionnel)</label>
              <select
                value={form.departmentId}
                onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              >
                <option value="">Aucun</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Poste (optionnel)</label>
              <select
                value={form.jobTitleId}
                onChange={(e) => setForm((f) => ({ ...f, jobTitleId: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              >
                <option value="">Aucun</option>
                {jobTitles.map((jobTitle) => (
                  <option key={jobTitle.id} value={jobTitle.id}>
                    {jobTitle.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Telephone (optionnel)</label>
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            />
          </div>

          {editingUser && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-koraya-navy focus:ring-koraya-navy"
              />
              Compte actif
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
        open={viewingUser !== null}
        title={viewingUser?.fullName ?? ""}
        onClose={() => setViewingUser(null)}
        fields={[
          { label: "Nom complet", value: viewingUser?.fullName },
          { label: "Email", value: viewingUser?.email },
          { label: "Role", value: viewingUser?.role },
          { label: "Site", value: viewingUser?.siteName || "—" },
          { label: "Departement", value: departments.find((d) => d.id === viewingUser?.departmentId)?.name || "—" },
          { label: "Poste", value: jobTitles.find((j) => j.id === viewingUser?.jobTitleId)?.title || "—" },
          { label: "Telephone", value: viewingUser?.phoneNumber || "—" },
          { label: "Statut", value: viewingUser ? <StatusBadge active={viewingUser.active} /> : null },
        ]}
      />

      <ConfirmDialog
        open={confirmingSubmit}
        title="Confirmer la modification"
        description={`Enregistrer les modifications de "${form.fullName}" ?`}
        confirmLabel="Enregistrer"
        tone="primary"
        errorFallback="Impossible d'enregistrer l'utilisateur."
        onConfirm={performSave}
        onClose={() => setConfirmingSubmit(false)}
      />

      <ConfirmDialog
        open={togglingUser !== null}
        title={togglingUser?.active ? "Desactiver cet utilisateur ?" : "Reactiver cet utilisateur ?"}
        description={`"${togglingUser?.fullName}" sera ${togglingUser?.active ? "desactive" : "reactive"}.`}
        confirmLabel={togglingUser?.active ? "Desactiver" : "Reactiver"}
        tone={togglingUser?.active ? "warning" : "success"}
        errorFallback="Impossible de mettre a jour l'utilisateur."
        onConfirm={performToggle}
        onClose={() => setTogglingUser(null)}
      />

      <ConfirmDialog
        open={deletingUser !== null}
        title="Supprimer cet utilisateur ?"
        description={`Cette action est irreversible. "${deletingUser?.fullName}" sera definitivement supprime.`}
        confirmLabel="Supprimer definitivement"
        tone="danger"
        errorFallback="Impossible de supprimer l'utilisateur."
        onConfirm={performHardDelete}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
}
