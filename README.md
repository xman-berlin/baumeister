# Baumeister

Kindergerechte Aufbausimulation — eine kleine Stadt auf einem Kachelraster aufbauen, Ressourcen sammeln und Missionen erfüllen.

**Spielen:** https://xman-berlin.github.io/baumeister/

## About

Ein kindergerechtes 2D-Aufbau-Simulationsspiel für Kinder von 6–10 Jahren. Der Spieler baut eine kleine Stadt auf einem Kachelraster, sammelt Ressourcen (Holz, Steine, Coins), erfüllt kindgerechte Missionen und beobachtet wie Bewohner durch die Straßen laufen. Das Spiel läuft vollständig im Browser, kein Backend erforderlich.

## Features

- 20×15 Kachelraster mit 6 Gebäudetypen (Haus, Strasse, Sägewerk, Steinbruch, Markt, Park)
- Ressourcensystem mit Produktion (Holz, Steine, Coins)
- NPCs (Bewohner) laufen auf Strassen mit Random-Walk
- 7 aufeinander aufbauende Missionen mit Belohnungen
- Speichern & Laden via localStorage (Auto-Save alle 30s)
- Hauptmenü mit "Neues Spiel" / "Weiterspielen"

## Tech Stack

| Layer | Choice |
|-------|--------|
| Game Engine | Phaser 3 (v3.88+) |
| Language | TypeScript (strict mode) |
| Build | Vite |
| Tests | Vitest |
| Linting | ESLint v10 (flat config) |
| Formatting | Prettier |
| Persistence | localStorage (no backend) |
| Assets | Kenney.nl (CC0) |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/xman-berlin/baumeister.git
cd baumeister
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm test             # Run tests
```

## Project Status

- [x] Phase 1: Scaffold & Raster
- [x] Phase 2: Gebäude platzieren
- [x] Phase 3: Ressourcen-System
- [x] Phase 4: Bewohner / NPCs
- [x] Phase 5: Missionen & Belohnungen
- [x] Phase 6: Polish, Sound & Speichern

See [plan.md](./plan.md) for the full implementation plan.

## License

Spiel-Assets von [Kenney](https://kenney.nl) — CC0.
