# DECISIONS.md — Dev'R

## ADR-001 — GitHub Search workaround

**Contexte** : GitHub ne fournit pas d'endpoint `/trending` officiel dans son API REST.

**Options considérées** :
- Scraper github.com/trending (fragile, ToS)
- Utiliser l'API Search avec `q=created:>DATE&sort=stars&order=desc`
- Service tiers (gh-trending unofficial API)

**Choix retenu** : GitHub Search API avec filtre `created:>YYYY-MM-DD` et tri par stars.

**Raison** : Endpoint officiel, stable, documenté. Proxy fidèle du trending réel sur 7 jours.

**Conséquences** : Résultats légèrement différents du trending natif GitHub. Date de création comme proxy d'émergence. Acceptable pour MVP.

---

## ADR-002 — Cache in-memory vs Redis

**Contexte** : Les routes `/api` appellent GitHub et Dev.to à chaque requête. Sans cache, rate limit atteint rapidement.

**Options considérées** :
- Redis (Upstash) — persistant, partagé entre instances
- Cache in-memory Node.js — simple, zéro infra
- Pas de cache — appels directs à chaque requête

**Choix retenu** : Cache in-memory via `InMemoryCache` implémentant l'interface `ICache`.

**Raison** : Zéro dépendance externe pour le MVP. L'interface `ICache` permet de swapper vers Redis sans toucher aux consommateurs (`lib/github.ts`, `lib/devto.ts`).

**Conséquences** : Cache non partagé entre instances Vercel (serverless). Acceptable : chaque instance gère son propre TTL. Migration vers Redis = implémenter `ICache`, changer le singleton exporté dans `lib/cache.ts`.

---

## ADR-003 — TTL 15min GitHub / 10min Dev.to

**Contexte** : Les deux APIs ont des rate limits différents et des rythmes de mise à jour différents.

**Options considérées** :
- TTL court (1-2min) — données fraîches, risk de rate limit
- TTL long (1h+) — données stales, mauvaise UX
- TTL calibré sur le rate limit réel

**Choix retenu** : TTL 15min pour GitHub, 10min pour Dev.to.

**Raison** :
- GitHub Search API : 30 req/minute (pas /heure). TTL 15min = 1 appel toutes les 15min par instance. Très en dessous du seuil.
- Dev.to : pas de rate limit strict documenté, mais données moins volatiles. 10min = bon équilibre fraîcheur/charge.

**Conséquences** : Données jamais plus vieilles de 15min. `FreshnessIndicator` affiche le temps depuis le dernier fetch pour transparence.

---

## ADR-004 — HypeScore composite (triangulation deux sources)

**Contexte** : GitHub et Dev.to mesurent l'intérêt tech différemment. GitHub = activité code. Dev.to = intérêt communauté.

**Options considérées** :
- Score GitHub seul (stars + forks)
- Score Dev.to seul (reactions + views)
- Score composite pondéré

**Choix retenu** : Score composite — 60% GitHub / 40% Dev.to.

**Formule** :
```
GitHub score  = (stars × 0.6 + forks × 0.4) normalisé [0–1]
Dev.to score  = reactions normalisé [0–1]
HypeScore     = GitHub score × 0.6 + Dev.to score × 0.4
```

**Raison** : Triangulation entre signal technique (GitHub) et signal éditorial (Dev.to). Réduit les faux positifs d'une source unique. Pondération 60/40 reflète la richesse du signal GitHub (deux métriques vs une).

**Conséquences** : HypeScore dépend de la qualité de normalisation. Si un outlier domine, normalisation min-max le compresse. Tooltip explicatif sur `HypeChart` pour transparence de la formule.

---

## ADR-005 — Pas d'auth GitHub MVP

**Contexte** : GitHub API sans token = 60 req/heure (unauthenticated). Avec token = 5000 req/heure.

**Options considérées** :
- Token GitHub en variable d'env (`GITHUB_TOKEN`)
- OAuth GitHub (user auth)
- Aucune auth pour le MVP

**Choix retenu** : Aucune auth GitHub pour le MVP.

**Raison** : TTL 15min + cache in-memory = max 4 appels/heure par instance. Largement sous la limite unauthenticated de 60 req/heure. Complexité d'auth non justifiée pour la valeur apportée au MVP.

**Conséquences** : Si trafic fort (multiples instances Vercel), risque de hit le rate limit. Migration simple : ajouter `Authorization: Bearer ${GITHUB_TOKEN}` dans `lib/github.ts`, passer le token via env Vercel.
