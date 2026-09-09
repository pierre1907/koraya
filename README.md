# Koraya

Plateforme SaaS mono-tenant de digitalisation des opérations internes.
Premier module : Gestion du Parc Informatique (Asset Management).

**Auteur :** Saint-Pierre KASSI — [linkedin.com/in/saint-pierre-kassi](https://www.linkedin.com/in/saint-pierre-kassi/)

---

## Architecture

- **Backend** : Spring Boot 3.3 / Java 21, module unique, PostgreSQL 15, Liquibase, JWT
- **Frontend** : Next.js 14 (App Router), TailwindCSS, Axios
- **Déploiement cible** : Railway — un déploiement par client (mono-tenant)

Voir `Bible_Projet_Koraya_v1.docx` pour la documentation fonctionnelle et technique complète.

---

## Installation sur un poste Windows neuf

### 1. Outils à installer

| Outil | Lien | Usage |
|---|---|---|
| JDK 21 (Temurin) | https://adoptium.net/temurin/releases/?version=21 | Backend Java |
| Node.js 20 LTS | https://nodejs.org/en/download | Frontend Next.js |
| Docker Desktop | https://www.docker.com/products/docker-desktop/ | PostgreSQL local |
| Git for Windows | https://git-scm.com/download/win | Versionning |
| IntelliJ IDEA Community | https://www.jetbrains.com/idea/download/?section=windows | IDE backend |
| VS Code | https://code.visualstudio.com/download | IDE frontend |
| DBeaver Community (optionnel) | https://dbeaver.io/download/ | Client graphique PostgreSQL |

Dans IntelliJ, installer le plugin **Lombok** (Settings → Plugins) après l'installation.

### 2. Lancer la base de données

```bash
cd backend
docker compose up -d
```

Ceci démarre PostgreSQL sur `localhost:5432` (base `koraya`, utilisateur `koraya`, mot de passe `koraya`).

### 3. Configurer et lancer le backend

```bash
cd backend
copy .env.example .env
```

Éditer `.env` et renseigner au minimum :
- `KORAYA_BOOTSTRAP_ADMIN_EMAIL` (ton email)
- `KORAYA_BOOTSTRAP_ADMIN_PASSWORD` (mot de passe du tout premier compte admin)
- `JWT_SECRET` (chaîne aléatoire d'au moins 32 caractères)

Puis lancer (le wrapper Maven télécharge tout automatiquement, pas besoin d'installer Maven) :

```bash
mvnw.cmd spring-boot:run
```

Le backend démarre sur `http://localhost:8080`. Au premier lancement, le compte ADMIN est créé automatiquement (voir logs).

### 4. Configurer et lancer le frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:3000`.

---

## Structure du dépôt

```
koraya/
├── backend/     ← API Spring Boot
├── frontend/    ← Interface Next.js
└── Bible_Projet_Koraya_v1.docx   ← Documentation fonctionnelle et technique
```

---

## Prochaines étapes de développement

1. Module Gestion du Parc Informatique (Asset, AssetCategory, historique d'affectation et de statut)
2. Génération PDF de la Fiche de dotation
3. CRUD Sites / Départements / Postes / Domaines autorisés côté interface admin
4. Dashboard de suivi du parc
