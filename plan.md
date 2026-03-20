# Plan: Baumeister — Kindergerechte Aufbausimulation

## Context

Ein kindergerechtes 2D-Aufbau-Simulationsspiel für Kinder von 6–10 Jahren. Der Spieler baut eine kleine Stadt auf einem Kachelraster, sammelt Ressourcen (Holz, Steine, Coins), erfüllt kindgerechte Missionen und beobachtet wie Bewohner durch die Straßen laufen. Das Spiel läuft vollständig im Browser, kein Backend erforderlich.

## Progress

- [ ] Phase 1: Scaffold & Raster
- [ ] Phase 2: Gebäude platzieren
- [ ] Phase 3: Ressourcen-System
- [ ] Phase 4: Bewohner / NPCs
- [ ] Phase 5: Missionen & Belohnungen
- [ ] Phase 6: Polish, Sound & Speichern

---

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

---

## Project Structure

```
baumeister/
├── public/
│   ├── assets/
│   │   ├── tiles/          # Tileset PNGs (Gras, Wasser, Weg)
│   │   ├── buildings/      # Gebäude-Sprites (Haus, Markt, Sägewerk, etc.)
│   │   ├── characters/     # NPC-Sprites (Bewohner, Walk-Animation)
│   │   └── audio/          # Sound-Effekte (.ogg/.mp3)
│   └── index.html
├── src/
│   ├── main.ts             # Phaser Game-Konfiguration, Boot
│   ├── config.ts           # Spielkonstanten (Tile-Größe, Gebäude-Defs, etc.)
│   ├── scenes/
│   │   ├── BootScene.ts    # Assets laden, Ladebalken
│   │   ├── MenuScene.ts    # Hauptmenü (Neues Spiel / Laden)
│   │   └── GameScene.ts    # Haupt-Spielszene
│   ├── systems/
│   │   ├── GridSystem.ts   # Kachelraster, Platzierungslogik, Kollision
│   │   ├── BuildingSystem.ts  # Gebäude definieren, platzieren, entfernen
│   │   ├── ResourceSystem.ts  # Ressourcen generieren, abziehen, HUD-Update
│   │   ├── NPCSystem.ts    # Bewohner spawnen, Pathfinding auf Straßen
│   │   ├── MissionSystem.ts   # Aufgaben laden, Fortschritt prüfen, Belohnung
│   │   └── SaveSystem.ts   # localStorage serialize/deserialize
│   ├── ui/
│   │   ├── HUD.ts          # Ressourcen-Anzeige oben (Holz/Steine/Coins)
│   │   ├── BuildMenu.ts    # Gebäude-Auswahl-Panel (unten)
│   │   ├── MissionPanel.ts # Aktive Mission + Fortschrittsbalken
│   │   └── Toast.ts        # Belohnungs-Popups ("Super! +10 Coins 🎉")
│   └── types/
│       └── index.ts        # BuildingType, Resource, Mission, SaveData Interfaces
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Gebäude-Definitionen

| Gebäude | Icon | Kosten | Produktion | Belegt |
|---------|------|--------|------------|--------|
| Haus | 🏠 | 5 Holz, 3 Steine | +1 Bewohner | 1 Tile |
| Straße | 🛣️ | 1 Stein | — | 1 Tile |
| Sägewerk | 🪚 | 8 Holz | +2 Holz/10s | 2×2 Tiles |
| Steinbruch | ⛏️ | 5 Steine | +2 Steine/10s | 2×2 Tiles |
| Markt | 🏪 | 10 Holz, 10 Steine | +3 Coins/15s | 2×2 Tiles |
| Park | 🌳 | 3 Coins | — (Deko) | 1 Tile |

Startressourcen: 20 Holz, 15 Steine, 10 Coins

---

## Missionen

Missionen sind aufeinander aufbauend, jede hat ein klares Ziel und eine Belohnung:

| Nr. | Titel | Ziel | Belohnung |
|-----|-------|------|-----------|
| 1 | Erstes Haus | Baue 1 Haus | +10 Holz, +5 Steine |
| 2 | Straße bauen | Lege 3 Straßen-Tiles | +5 Coins |
| 3 | Holz produzieren | Baue 1 Sägewerk | +10 Steine |
| 4 | Kleine Stadt | Baue 3 Häuser | +1 Bewohner (NPC) |
| 5 | Marktplatz | Baue 1 Markt | +15 Coins |
| 6 | Grüne Stadt | Platziere 5 Parks | +20 Holz |
| 7 | Große Stadt | Erreiche 5 Bewohner | Freischalten: Dekobäume |

---

## Speicherdaten (localStorage)

```typescript
interface SaveData {
  version: number;           // Schema-Version für Migration
  resources: {
    wood: number;
    stone: number;
    coins: number;
  };
  grid: {                    // Sparse map: "x,y" → BuildingType
    [key: string]: BuildingType;
  };
  npcs: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  missions: {
    completed: number[];     // Mission IDs
    active: number;          // Aktuelle Mission ID
  };
  playtime: number;          // Sekunden gespielt
}
```

Schlüssel in localStorage: `baumeister_save`

---

## NPC Pathfinding

- NPCs laufen nur auf Straßen-Tiles
- Kein komplexes A* — einfache Random-Walk-Logik: NPC wählt zufälligen benachbarten Straßen-Tile
- Spawn: 1 NPC pro gebautem Haus (max. 10 NPCs gleichzeitig für Performance)
- Walk-Animation: 4-Frame Spritesheet, 8 Richtungen (oder vereinfacht 4 Richtungen)

---

## Implementierungs-Checkliste

### Phase 1: Scaffold & Raster
- [ ] `npm create vite@latest baumeister -- --template vanilla-ts`
- [ ] Phaser 3 installieren: `npm install phaser`
- [ ] `vite.config.ts` konfigurieren (assetsDir, base)
- [ ] `tsconfig.json` anpassen (strict, paths)
- [ ] `BootScene.ts` — Asset-Preload mit Ladebalken
- [ ] `GameScene.ts` — 20×15 Tile-Raster rendern (Gras-Tileset)
- [ ] `GridSystem.ts` — Tile-Koordinaten ↔ Screen-Koordinaten, Hover-Highlight
- [ ] Kamera-Scrolling mit Maus/Touch (Drag-to-pan, Zoom optional)

### Phase 2: Gebäude platzieren
- [ ] `config.ts` — alle 6 Gebäude-Typen mit Kosten und Größe definieren
- [ ] `BuildMenu.ts` — Panel am unteren Bildschirmrand, Gebäude auswählen
- [ ] Platzierungs-Preview: Ghost-Sprite folgt der Maus, rot bei ungültigem Tile
- [ ] `BuildingSystem.ts` — Gebäude platzieren (Kosten abziehen, Sprite setzen)
- [ ] Gebäude entfernen (Rechtsklick / Abriss-Tool)
- [ ] `HUD.ts` — Ressourcen-Anzeige oben links (Icons + Zahlen)

### Phase 3: Ressourcen-System
- [ ] `ResourceSystem.ts` — Produktions-Timer pro Gebäude (Phaser `time.addEvent`)
- [ ] Ressourcen hinzufügen/abziehen mit Validierung (kein Minus)
- [ ] HUD-Update bei Ressourcenänderung (Tween-Animation auf Zahl bei +Ressource)
- [ ] `Toast.ts` — kleines Popup "+2 Holz 🪵" beim Produzieren
- [ ] Startressourcen aus `config.ts` laden

### Phase 4: Bewohner / NPCs
- [ ] `NPCSystem.ts` — NPC-Klasse mit Position, Richtung, Animations-State
- [ ] NPC spawnen wenn Haus gebaut wird
- [ ] Random-Walk auf Straßen-Tiles (Tick alle 1–2s neue Richtung wählen)
- [ ] Walk-Animation (4-Frame Spritesheet)
- [ ] Max. 10 NPCs gleichzeitig
- [ ] NPCs verschwinden wenn Häuser abgerissen werden

### Phase 5: Missionen & Belohnungen
- [ ] `MissionSystem.ts` — Mission-Definitionen als Array in `config.ts`
- [ ] `MissionPanel.ts` — aktive Mission oben rechts mit Fortschrittsbalken
- [ ] Fortschritt automatisch prüfen bei jedem Build/Ressourcen-Event
- [ ] Mission abschließen: Belohnungs-Popup (groß, animiert), Ressourcen gutschreiben
- [ ] Nächste Mission automatisch starten
- [ ] Alle Missionen abgeschlossen: Glückwunsch-Screen

### Phase 6: Polish, Sound & Speichern
- [ ] Sound-Effekte einbinden: Bauen, Ressource sammeln, Mission abschließen
- [ ] Bau-Animation: Gebäude-Sprite wackelt kurz beim Platzieren (Phaser Tween)
- [ ] `SaveSystem.ts` — Spielstand in localStorage serialisieren
- [ ] Auto-Save alle 30 Sekunden + beim Schließen (`beforeunload`)
- [ ] `MenuScene.ts` — "Neues Spiel" / "Weiterspielen" (wenn Save vorhanden)
- [ ] Responsive: Spiel skaliert auf verschiedene Fenstergrößen (Phaser Scale Manager)
- [ ] Kindgerechte Schriftart (z.B. "Fredoka One" von Google Fonts)

---

## Assets (kostenlos, CC0)

- **Tiles & Gebäude**: [kenney.nl/assets/tiny-town](https://kenney.nl/assets/tiny-town) — passt perfekt
- **Characters**: [kenney.nl/assets/tiny-dungeon](https://kenney.nl/assets/tiny-dungeon) oder [kenney.nl/assets/micro-roguelike](https://kenney.nl/assets/micro-roguelike)
- **Sounds**: [kenney.nl/assets/interface-sounds](https://kenney.nl/assets/interface-sounds) + [kenney.nl/assets/fantasy-ui-borders](https://kenney.nl/assets/fantasy-ui-borders)
- Alle Kenney-Assets sind CC0 — keine Attribution nötig, kommerziell verwendbar

---

## Environment Variables

Keine — rein client-seitiges Spiel, kein Backend, kein API-Key erforderlich.

---

## Wichtige Hinweise

- **Phaser 3 + Vite**: `vite.config.ts` braucht `optimizeDeps: { exclude: ['phaser'] }` um Bundle-Fehler zu vermeiden
- **Touch-Support**: Phaser 3 unterstützt Touch nativ — Gebäude-Platzierung auch per Tap funktionsfähig machen
- **Tile-Größe**: 64×64px empfohlen für kindgerechte, gut klickbare Tiles
- **Performance**: Phaser `StaticGroup` für Tiles verwenden (nicht `Group`) — deutlich schneller bei statischen Kacheln
- **localStorage Limit**: ~5MB — bei 20×15 Grid und wenigen Gebäuden kein Problem
- **Schriftgröße**: Minimum 18px für alle UI-Texte (kindgerecht)
