import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";
import type { SearchFrame, SearchResult } from "../../types/SearchFrame"; 
import { getNeighbors, reconstructPath } from "./types";

export function dfs(
  grid: TerrainDifficulty[][],
  start: Position,
  goal: Position
): SearchResult {
  const stack: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const seen = new Set<string>();
  const frames: SearchFrame[] = [];
  const visitedKeys: string[] = [];

  seen.add(`${start.x},${start.y}`);

  while (stack.length > 0) {
    const cur = stack.pop()!;
    const curKey = `${cur.x},${cur.y}`;
    
    // Adiciona aos expandidos
    visitedKeys.push(curKey);

    // Registra o frame ANTES de processar os vizinhos para a animação mostrar o passo atual
    frames.push({
      visited: [...visitedKeys],
      frontier: stack.map(p => `${p.x},${p.y}`)
    });

    // Verificação de objetivo
    if (cur.x === goal.x && cur.y === goal.y) {
      const path = reconstructPath(cameFrom, goal);
      
      // Calcula o custo total (soma das dificuldades das células no caminho)
      const totalCost = path.reduce((acc, pos) => {
        const difficulty = grid[pos.y][pos.x] as unknown as number;
        return acc + difficulty;
      }, 0);

      return { 
        frames, 
        path, 
        totalCost 
      };
    }

    // Expansão dos vizinhos
    for (const nb of getNeighbors(cur, grid)) {
      const key = `${nb.x},${nb.y}`;
      if (!seen.has(key)) {
        seen.add(key);
        cameFrom.set(key, cur);
        stack.push(nb);
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