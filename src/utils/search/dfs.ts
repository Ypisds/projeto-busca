import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchResult } from "./types";
import { getNeighbors, reconstructPath } from "./types";

export function dfs(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  const stack: Position[] = [start];
  const visited: Position[] = [];
  const cameFrom = new Map<string, Position>();
  const seen = new Set<string>();
  seen.add(`${start.x},${start.y}`);

  while (stack.length > 0) {
    const cur = stack.pop()!;
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
        stack.push(nb);
      }
    }
  }

  return { path: [], visited, cost: 0 };
}