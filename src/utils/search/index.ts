import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "./types";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { greedy } from "./greedy";
import { aStar } from "./aStar";

export type { SearchResult };

export function runSearch(
  algoritmo: string,
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  switch (algoritmo) {
    case 'DFS':      return dfs(grid, start, goal);
    case 'Dijkstra': return dijkstra(grid, start, goal);
    case 'Greedy':   return greedy(grid, start, goal);
    case 'A*':       return aStar(grid, start, goal);
    default:         return { path: [], visited: [], cost: 0 };
  }
}