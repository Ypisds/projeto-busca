import type { TerrainDifficulty } from '../types/TerrainDifficulty'

// Custo de energia para atravessar cada tipo de terreno
export const TERRAIN_COST: Record<TerrainDifficulty, number> = {
  B: 1,
  M: 5,
  A: 10,
  O: Infinity,
}

// Multiplicador aplicado sobre a velocidade base para o movimento do agente.
// Terreno mais caro = multiplicador maior = agente mais lento.
export const TERRAIN_SPEED_MULTIPLIER: Record<TerrainDifficulty, number> = {
  B: 1,
  M: 3,
  A: 8,
  O: 1,
}
