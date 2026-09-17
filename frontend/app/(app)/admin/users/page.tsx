"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  UserAdmin,
  UserRole,
  createUser,
  deactivateUser,
  fetchUsers,
  updateUser,
} from "@/lib/api/admin/users";
import { SiteAdmin, fetchSites } from "@/lib/api/admin/sites";
import { DepartmentAdmin, fetchDepartments } from "@/lib/api/admin/departments";
import { JobTitleAdmin, fetchJobTitles } from "@/lib/api/admin/jobTitles";
import { AllowedDomainAdmin, fetchAllowedDomains } from "@/lib/api/admin/allowedDomains";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import SortableHeader from "@/components/admin/SortableHeader";
import SearchInput from "@/components/admin/SearchInput";
import { useSortableData } from "@/lib/hooks/useSortableData";
import { UsersIcon } from "@/components/layout/icons";

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
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

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
    setFormError(null);
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
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
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
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Impossible d'enregistrer l'utilisateur."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(user: UserAdmin) {
    try {
      if (user.active) {
        await deactivateUser(user.id);
      } else {
        await updateUser(user.id, {
          fullName: user.fullName,
          role: user.role,
          siteId: user.siteId ?? "",
          departmentId: user.departmentId,
          jobTitleId: user.jobTitleId,
          phoneNumber: user.phoneNumber ?? undefined,
          active: true,
        });
      }
      await load();
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de mettre a jour l'utilisateur."));
    }
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
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
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
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-3 text-gray-500">{user.email}</td>
                  <td className="px-6 py-3 text-gray-500">{user.role}</td>
                  <td className="px-6 py-3 text-gray-500">{user.siteName || "—"}</td>
                  <td className="px-6 py-3">
                    <StatusBadge active={user.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {user.active ? "Desactiver" : "Reactiver"}
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
