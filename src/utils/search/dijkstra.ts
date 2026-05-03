import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "./types";
import { getNeighbors, reconstructPath, terrainCost } from "./types";

export function dijkstra(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  type Node = { pos: Position; cost: number };

  const queue: Node[] = [{ pos: start, cost: 0 }];
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];

  dist.set(`${start.x},${start.y}`, 0);

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { pos: cur, cost } = queue.shift()!;

    const curKey = `${cur.x},${cur.y}`;
    if (cost > (dist.get(curKey) ?? Infinity)) continue;

    visited.push(cur);

    if (cur.x === goal.x && cur.y === goal.y) {
      return { path: reconstructPath(cameFrom, goal), visited, cost };
    }

    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      const newCost = cost + terrainCost(grid[nb.y][nb.x]);
      if (newCost < (dist.get(key) ?? Infinity)) {
        dist.set(key, newCost);
        cameFrom.set(key, cur);
        queue.push({ pos: nb, cost: newCost });
      }
    }
  }

  return { path: [], visited, cost: 0 };
}