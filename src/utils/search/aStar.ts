import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchFrame, SearchResult } from "../../types/SearchFrame";
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
  const frames: SearchFrame[] = [];
  const visitedKeys: string[] = [];

  gScore.set(`${start.x},${start.y}`, 0);

  while (queue.length > 0) {
    // Ordena para garantir que o nó com menor 'f' seja o próximo (comportamento de Priority Queue)
    queue.sort((a, b) => a.f - b.f);
    const { pos: cur, g } = queue.shift()!;

    const curKey = `${cur.x},${cur.y}`;
    
    // Se já encontramos um caminho melhor para este nó antes de ele sair da fila, ignoramos
    if (g > (gScore.get(curKey) ?? Infinity)) continue;

    // Registra a expansão do nó
    visitedKeys.push(curKey);

    // ADICIONA FRAME: Captura o estado antes de expandir os vizinhos
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
        totalCost: g // No A*, 'g' já representa o custo total acumulado
      };
    }

    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      const newG = g + terrainCost(grid[nb.y][nb.x]);

      if (newG < (gScore.get(key) ?? Infinity)) {
        gScore.set(key, newG);
        cameFrom.set(key, cur);
        queue.push({ 
          pos: nb, 
          f: newG + heuristic(nb, goal), 
          g: newG 
        });
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