export type ActionTone = "positive" | "negative" | "neutral";

interface ActionMeta {
  label: string;
  tone: ActionTone;
}

const ACTION_LABELS: Record<string, ActionMeta> = {
  USER_REGISTERED: { label: "Inscription utilisateur", tone: "positive" },
  USER_CREATED: { label: "Utilisateur cree", tone: "positive" },
  USER_UPDATED: { label: "Utilisateur modifie", tone: "neutral" },
  USER_DELETED: { label: "Utilisateur desactive", tone: "negative" },
  DOMAIN_CREATED: { label: "Domaine ajoute", tone: "positive" },
  DOMAIN_ACTIVATED: { label: "Domaine reactive", tone: "positive" },
  DOMAIN_DEACTIVATED: { label: "Domaine desactive", tone: "negative" },
};

const ENTITY_LABELS: Record<string, string> = {
  User: "Utilisateur",
  AllowedEmailDomain: "Domaine email",
  Site: "Site",
  Department: "Departement",
  JobTitle: "Poste",
};

function humanizeFallback(code: string): string {
  return code
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatAuditAction(action: string): ActionMeta {
  return ACTION_LABELS[action] ?? { label: humanizeFallback(action), tone: "neutral" };
}

export function formatEntityType(entityType: string): string {
  return ENTITY_LABELS[entityType] ?? entityType;
}
