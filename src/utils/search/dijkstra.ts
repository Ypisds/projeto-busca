import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchFrame, SearchResult } from "../../types/SearchFrame";
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
  const frames: SearchFrame[] = [];
  const visitedKeys: string[] = [];

  dist.set(`${start.x},${start.y}`, 0);

  while (queue.length > 0) {
    // Ordena pelo custo acumulado para garantir a expansão do caminho mais barato
    queue.sort((a, b) => a.cost - b.cost);
    const { pos: cur, cost } = queue.shift()!;

    const curKey = `${cur.x},${cur.y}`;
    
    // Optimization: se já encontramos um custo menor para esse nó, ignora esta entrada
    if (cost > (dist.get(curKey) ?? Infinity)) continue;

    // Registra o nó atual como expandido
    visitedKeys.push(curKey);

    // ADICIONA FRAME: Estado da busca para a animação
    frames.push({
      visited: [...visitedKeys],
      frontier: queue.map(node => `${node.pos.x},${node.pos.y}`)
    });

    // Verificação de objetivo
    if (cur.x === goal.x && cur.y === goal.y) {
      const path = reconstructPath(cameFrom, goal);
      return { 
        frames, 
        path, 
        totalCost: cost 
      };
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

  // Caso nenhum caminho seja encontrado
  return { 
    frames, 
    path: null, 
    totalCost: 0 
  };
}