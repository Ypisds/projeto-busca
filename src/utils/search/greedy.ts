import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchFrame, SearchResult } from "../../types/SearchFrame";
import { getNeighbors, reconstructPath, heuristic, terrainCost } from "./types";

export function greedy(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  type Node = { pos: Position; h: number };

  const queue: Node[] = [{ pos: start, h: heuristic(start, goal) }];
  const cameFrom = new Map<string, Position>();
  const frames: SearchFrame[] = [];
  const visitedKeys: string[] = [];
  const seen = new Set<string>();

  seen.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    // Ordena apenas pela heurística (o quão perto parece estar do objetivo)
    queue.sort((a, b) => a.h - b.h);
    const { pos: cur } = queue.shift()!;
    const curKey = `${cur.x},${cur.y}`;

    visitedKeys.push(curKey);

    // ADICIONA FRAME: Estado da animação
    frames.push({
      visited: [...visitedKeys],
      frontier: queue.map(node => `${node.pos.x},${node.pos.y}`)
    });

    if (cur.x === goal.x && cur.y === goal.y) {
      const path = reconstructPath(cameFrom, goal);
      
      // Calcula o custo real somando os terrenos do caminho encontrado
      const totalCost = path.reduce((acc, pos) => {
        return acc + terrainCost(grid[pos.y][pos.x]);
      }, 0);

      return { 
        frames, 
        path, 
        totalCost 
      };
    }

    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      if (!seen.has(key)) {
        seen.add(key);
        cameFrom.set(key, cur);
        queue.push({ 
          pos: nb, 
          h: heuristic(nb, goal) 
        });
      }
    }
  }

  return { 
    frames, 
    path: null, 
    totalCost: 0 
  };
}