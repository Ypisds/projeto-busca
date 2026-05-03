import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "../../types/SearchFrame";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { greedy } from "./greedy";
import { aStar } from "./aStar";
import { defaultBFS } from "../defaultPathfinder";

export type { SearchResult };

export function runSearch(
  algoritmo: string,
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position,
  rows: number,
  columns: number
): SearchResult {
  switch (algoritmo) {
    case 'BFS':      return defaultBFS(start, goal, grid, rows, columns);
    case 'DFS':      return dfs(grid, start, goal);
    case 'Dijkstra': return dijkstra(grid, start, goal);
    case 'Greedy':   return greedy(grid, start, goal);
    case 'A*':       return aStar(grid, start, goal);
    default:         return { path: null, frames: [], totalCost: 0 };
  }
}