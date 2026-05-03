import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "./types";
import { getNeighbors, reconstructPath, heuristic } from "./types";

export function greedy(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  type Node = { pos: Position; h: number };

  const queue: Node[] = [{ pos: start, h: heuristic(start, goal) }];
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];
  const seen = new Set<string>();
  seen.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    queue.sort((a, b) => a.h - b.h);
    const { pos: cur } = queue.shift()!;
    visited.push(cur);

    if (cur.x === goal.x && cur.y === goal.y) {
      const path = reconstructPath(cameFrom, goal);
      return { path, visited, cost: path.length };
    }

    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      if (!seen.has(key)) {
        seen.add(key);
        cameFrom.set(key, cur);
        queue.push({ pos: nb, h: heuristic(nb, goal) });
      }
    }
  }

  return { path: [], visited, cost: 0 };
}