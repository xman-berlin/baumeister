# AGENTS.md — Baumeister

Guidance for agentic coding agents working in this repository.

## Project Overview

A child-friendly 2D city-building simulation game (ages 6–10) built with **Phaser 3**, **TypeScript**, and **Vite**. Runs entirely in the browser with localStorage persistence — no backend.

## Build / Dev / Test Commands

```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # Production build → dist/
npm run preview          # Preview production build locally
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run typecheck        # tsc --noEmit (type checking only)
npm test                 # Run all tests (Vitest)
npm test -- <file>       # Run a single test file
npm test -- -t "name"    # Run test by name pattern
```

> **Note**: `npm run lint` and `npm run typecheck` MUST pass before any commit. Run them after every non-trivial change.

## Tech Stack

| Layer        | Choice                          |
|--------------|---------------------------------|
| Engine       | Phaser 3 (v3.88+)              |
| Language     | TypeScript (strict mode)        |
| Build        | Vite                            |
| Tests        | Vitest                          |
| Linting      | ESLint v10 (flat config) + TypeScript |
| Formatting   | Prettier                        |
| Persistence  | localStorage (no backend)       |
| Assets       | Kenney.nl (CC0)                 |

## Project Structure

```
src/
├── main.ts              # Phaser game config, boot
├── config.ts            # Game constants (tile size, building defs, missions)
├── scenes/
│   ├── BootScene.ts     # Asset preloading
│   ├── MenuScene.ts     # Main menu
│   └── GameScene.ts     # Core gameplay
├── systems/
│   ├── GridSystem.ts    # Tile grid, placement logic
│   ├── BuildingSystem.ts
│   ├── ResourceSystem.ts
│   ├── NPCSystem.ts
│   ├── MissionSystem.ts
│   └── SaveSystem.ts
├── ui/
│   ├── HUD.ts
│   ├── BuildMenu.ts
│   ├── MissionPanel.ts
│   └── Toast.ts
└── types/
    └── index.ts         # All interfaces (BuildingType, Resource, Mission, SaveData)
```

## Code Style

### TypeScript

- **Strict mode** enabled in tsconfig — no `any`, no implicit `any`, no `@ts-ignore`
- Use `interface` for object shapes, `type` for unions/computed types
- Enums for finite sets: `enum BuildingType { House, Road, Sawmill, Quarry, Market, Park }`
- Prefer `readonly` for config constants
- No non-null assertions (`!`) — use explicit null checks

### Naming

- **Files**: PascalCase for classes (`GridSystem.ts`, `GameScene.ts`), camelCase for utilities
- **Classes**: PascalCase (`BuildingSystem`, `ResourceSystem`)
- **Variables/functions**: camelCase (`tileSize`, `placeBuilding()`)
- **Constants**: UPPER_SNAKE_CASE (`TILE_SIZE`, `MAX_NPCS`)
- **Interfaces**: PascalCase, no `I` prefix (`SaveData`, `BuildingConfig`)
- **Enums**: PascalCase members (`BuildingType.House`)

### Imports

- Use `import type` for type-only imports
- Group imports: (1) Phaser, (2) external libs, (3) internal modules
- Use path aliases if configured in tsconfig (`@/` for `src/`)

### Formatting

- Prettier with defaults (2-space indent, single quotes, trailing commas)
- Max line length: 100 chars
- One component/class per file
- ESLint uses v10 flat config (`eslint.config.js`) — not `.eslintrc`

### Phaser-Specific

- Extend `Phaser.Scene` for scenes — one scene per file in `scenes/`
- Use `Phaser.GameObjects.StaticGroup` for tile grids (not `Group`)
- Game config lives in `main.ts`, scene-level constants in `config.ts`
- Use `this.add.*` / `this.time.addEvent` — never reach into other scenes directly
- Clean up listeners in `shutdown()` or `destroy()` lifecycle

### Error Handling

- Validate resource costs before spending — never allow negative resources
- Guard localStorage operations with try/catch (private browsing, quota exceeded)
- Use `console.warn` for recoverable issues, throw for programmer errors
- Toast notifications for user-facing messages (not console)

### UI & Child-Friendly Design

- Minimum font size: **18px** for all text
- Tile size: **64×64px** for easy clicking
- Max 10 NPCs simultaneously (performance)
- Use "Fredoka One" or similar child-friendly font
- All UI text in **German** (target audience)

## Key Constraints

- **No backend** — everything runs client-side, localStorage for saves
- **Save key**: `baumeister_save` in localStorage
- **Vite config**: must have `optimizeDeps: { exclude: ['phaser'] }` to avoid bundle issues
- **Touch support**: Phaser handles touch natively — ensure placement works via tap
- **Auto-save**: every 30 seconds + on `beforeunload`
- **Asset license**: Kenney CC0 assets only — no attribution needed

## Adding a New Building Type

1. Add enum member to `BuildingType` in `types/index.ts`
2. Add config entry in `config.ts` (cost, size, production, sprite key)
3. Add sprite to `public/assets/buildings/`
4. Register in `BootScene.preload()` and `BuildingSystem`
5. Update `SaveData` if shape changes (bump `version`)

## Adding a New Scene

1. Create `src/scenes/YourScene.ts` extending `Phaser.Scene`
2. Register in `main.ts` scene array
3. Use `this.scene.start('NextScene')` for transitions

## Testing

- Tests live in `src/__tests__/` alongside the source
- Use `describe`/`it`/`expect` from Vitest
- Test pure logic (config validation, resource math) — skip Phaser rendering
