# Dev'R — Tech Radar Personnel

[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## Features

- Trending repos GitHub en temps réel (stars, forks, langage)
- Articles Dev.to populaires avec filtres par tag
- HypeScore composite : triangulation des deux sources
- Filtres par langage et indicateur de fraîcheur des données
- Dark / Light mode automatique selon le système

---

## Architecture

```
┌─────────────────────────────────────────┐
│              Next.js 14 App             │
│                                         │
│  ┌──────────┐      ┌─────────────────┐  │
│  │ /app     │      │ /components     │  │
│  │ page.tsx │      │ RepoCard        │  │
│  └────┬─────┘      │ ArticleCard     │  │
│       │            │ HypeChart       │  │
│  ┌────▼──────────────────────────┐   │  │
│  │         BFF — /api/*          │   │  │
│  │  /github/trending             │   │  │
│  │  /devto/articles              │   │  │
│  │  /stats/hype                  │   │  │
│  └────┬──────────────────────────┘   │  │
│       │                              │  │
│  ┌────▼──────────────────────────┐   │  │
│  │         /lib                  │   │  │
│  │  cache.ts   (ICache)          │   │  │
│  │  github.ts  (fetcher)         │   │  │
│  │  devto.ts   (fetcher)         │   │  │
│  │  aggregator.ts (HypeScore)    │   │  │
│  │  rateGuard.ts (middleware)    │   │  │
│  └────┬──────────────────────────┘   │  │
└───────┼─────────────────────────────-┘  │
        │                                 │
┌───────▼──────┐   ┌────────────────┐     │
│  GitHub API  │   │   Dev.to API   │     │
└──────────────┘   └────────────────┘     │
```

**Pattern BFF (Backend For Frontend)** : zéro appel API côté client. Toutes les requêtes externes passent par les routes `/api/*` — les composants ne consomment que l'API interne Next.js.

**Cache `ICache`** : interface abstraite implémentée par `InMemoryCache` (singleton). Le contrat est swappable — passer à Redis demande uniquement une nouvelle implémentation de l'interface, sans toucher aux routes.

> **Limite serverless assumée** : le cache in-memory ne persiste pas entre les cold starts Vercel. Chaque nouvelle instance repart d'un cache vide et re-fetche les APIs. Ce comportement est documenté et accepté pour le MVP — le TTL (15min GitHub / 10min Dev.to) garantit la fraîcheur sans pour autant surcharger les APIs.

---

## HypeScore — comment ça marche

Le HypeScore est un indice composite qui agrège deux signaux indépendants pour mesurer la "chaleur" d'un sujet tech.

```
GitHub score  = (stars × 0.6 + forks × 0.4)  normalisé sur 100
Dev.to score  = réactions des articles liés,  normalisé sur 100

Hype Score    = GitHub score × 60% + Dev.to score × 40%
```

GitHub porte plus de poids (60%) car les stars et forks reflètent un engagement concret des développeurs. Dev.to complète avec le signal éditorial — un sujet peut exploser en articles avant d'atteindre ses pics de stars.

---

## Product Decisions

**Pourquoi deux sources ?** GitHub mesure l'adoption des outils, Dev.to mesure le discours. Les deux peuvent diverger — un repo peut avoir beaucoup de stars sans traction éditoriale, ou inversement un sujet buzzword sans code sérieux derrière. Croiser les deux réduit les faux positifs.

**Pourquoi TTL 15min pour GitHub ?** La GitHub Search API est limitée à 30 requêtes par minute sans auth. Un TTL de 15 minutes évite d'atteindre ce plafond en production tout en gardant des données récentes. Dev.to est moins contraint — 10min suffisent.

**Pourquoi pas d'authentification GitHub en MVP ?** L'auth OAuth augmente le rate limit de 60 à 5000 req/h, mais ajoute une surface de sécurité (token storage, refresh) et complique le déploiement. Avec un TTL de 15min et un seul dashboard, les 30 req/min anonymes couvrent largement les besoins. L'interface `ICache` permet de revisiter ce choix sans refactoring majeur.

**Pourquoi Next.js App Router ?** Server Components permettent de garder les appels API côté serveur sans boilerplate d'API layer supplémentaire. Le pattern BFF est natif à l'architecture.

---

## APIs utilisées

**GitHub Search API**
[Documentation](https://docs.github.com/en/rest/search/search#search-repositories) — `GET /search/repositories`
Rate limit : **30 req/min** sans authentification. TTL 15min configuré en conséquence.

**Dev.to API**
[Documentation](https://developers.forem.com/api) — `GET /api/articles`
Header obligatoire : `User-Agent: devr-dashboard`. Sans ce header, les requêtes sont rejetées.

---

## Roadmap v2

- [ ] Auth GitHub OAuth → rate limit 5000 req/h
- [ ] Cache Redis via Upstash (interface `ICache` déjà prête)
- [ ] Historique 7 jours (DB Planetscale ou Turso)
- [ ] Filtres personnalisés sauvegardés par l'utilisateur
- [ ] Alertes trending (webhook ou email digest)
- [ ] Score de vélocité : variation du HypeScore sur 24h

---

## Lancement local

```bash
git clone https://github.com/nathandudreuil/dev-r.git
cd dev-r
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).
