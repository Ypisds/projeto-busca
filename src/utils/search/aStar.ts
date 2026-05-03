import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "./types";
import { getNeighbors, reconstructPath, terrainCost, heuristic } from "./types";

export function aStar(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  type Node = { pos: Position; f: number; g: number };

  const queue: Node[] = [{ pos: start, f: heuristic(start, goal), g: 0 }];
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];

  gScore.set(`${start.x},${start.y}`, 0);

  while (queue.length > 0) {
    queue.sort((a, b) => a.f - b.f);
    const { pos: cur, g } = queue.shift()!;

    const curKey = `${cur.x},${cur.y}`;
    if (g > (gScore.get(curKey) ?? Infinity)) continue;

    visited.push(cur);

    if (cur.x === goal.x && cur.y === goal.y) {
      return { path: reconstructPath(cameFrom, goal), visited, cost: g };
    }

    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      const newG = g + terrainCost(grid[nb.y][nb.x]);
      if (newG < (gScore.get(key) ?? Infinity)) {
        gScore.set(key, newG);
        cameFrom.set(key, cur);
        queue.push({ pos: nb, f: newG + heuristic(nb, goal), g: newG });
      }
    }
  }

  return { path: [], visited, cost: 0 };
}