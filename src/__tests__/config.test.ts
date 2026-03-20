import { describe, it, expect } from 'vitest';
import { BUILDINGS, MISSIONS, TILE_SIZE, GRID_COLS, GRID_ROWS } from '../config';
import { BuildingType } from '../types';

describe('config', () => {
  it('has correct tile size', () => {
    expect(TILE_SIZE).toBe(64);
  });

  it('has correct grid dimensions', () => {
    expect(GRID_COLS).toBe(20);
    expect(GRID_ROWS).toBe(15);
  });

  it('defines all building types', () => {
    const types = Object.values(BuildingType);
    for (const type of types) {
      expect(BUILDINGS[type]).toBeDefined();
      expect(BUILDINGS[type].label).toBeTruthy();
    }
  });

  it('has 7 missions', () => {
    expect(MISSIONS).toHaveLength(7);
  });
});
