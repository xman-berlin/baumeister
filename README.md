# Baumeister

Kindergerechte Aufbausimulation — eine kleine Stadt auf einem Kachelraster aufbauen, Ressourcen sammeln und Missionen erfüllen.

## About

Ein kindergerechtes 2D-Aufbau-Simulationsspiel für Kinder von 6–10 Jahren. Der Spieler baut eine kleine Stadt auf einem Kachelraster, sammelt Ressourcen (Holz, Steine, Coins), erfüllt kindgerechte Missionen und beobachtet wie Bewohner durch die Straßen laufen. Das Spiel läuft vollständig im Browser, kein Backend erforderlich.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Game Engine | Phaser 3 (v3.88+) |
| Sprache | TypeScript |
| Build Tool | Vite |
| Persistenz | localStorage (kein Backend) |
| Audio | Phaser 3 Sound Manager (Web Audio API) |
| Assets | Kenney.nl Free Assets (CC0) |
| Deployment | Lokal (`npm run dev`) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone git@github.com:<github-user>/baumeister.git
cd baumeister
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Project Status

- [ ] Phase 1: Scaffold & Raster
- [ ] Phase 2: Gebäude platzieren
- [ ] Phase 3: Ressourcen-System
- [ ] Phase 4: Bewohner / NPCs
- [ ] Phase 5: Missionen & Belohnungen
- [ ] Phase 6: Polish, Sound & Speichern

See [plan.md](./plan.md) for the full implementation plan.

## License

Spiel-Assets von [Kenney](https://kenney.nl) — CC0.
