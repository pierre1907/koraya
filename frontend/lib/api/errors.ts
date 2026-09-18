import { isAxiosError } from "axios";

const GENERIC_REASON_PHRASES = new Set([
  "Internal Server Error",
  "Bad Request",
  "Not Found",
  "Unauthorized",
  "Forbidden",
  "Conflict",
  "Service Unavailable",
]);

const INFRA_STATUS_MESSAGES: Record<number, string> = {
  401: "Session expiree ou invalide. Merci de vous reconnecter.",
  403: "Vous n'avez pas les droits necessaires pour cette action.",
  500: "Erreur serveur inattendue. Reessayez dans un instant.",
  502: "Le serveur est momentanement indisponible. Reessayez dans un instant.",
  503: "Le serveur est momentanement indisponible. Reessayez dans un instant.",
  504: "Le serveur met trop de temps a repondre. Reessayez dans un instant.",
};

export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue."): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Le serveur est injoignable. Verifiez votre connexion et reessayez.";
    }
    const message = error.response.data?.error;
    if (typeof message === "string" && message.length > 0 && !GENERIC_REASON_PHRASES.has(message)) {
      return message;
    }
    const infraMessage = INFRA_STATUS_MESSAGES[error.response.status];
    if (infraMessage) {
      return infraMessage;
    }
  }
  return fallback;
}
