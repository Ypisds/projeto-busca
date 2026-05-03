import type { Position } from "../../types/Position";
import type { TerrainDifficulty } from "../../types/TerrainDifficulty";

export function terrainCost(cell: TerrainDifficulty): number {
  switch (cell) {
    case 'B': return 1;
    case 'M': return 3;
    case 'A': return 7;
    case 'O': return Infinity;
    default:  return 1;
  }
}

export function heuristic(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getNeighbors(
  pos: Position,
  grid: TerrainDifficulty[][]
): Position[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y:  1 },
    { x: -1, y: 0 },
    { x:  1, y: 0 },
  ];
  return dirs
    .map(d => ({ x: pos.x + d.x, y: pos.y + d.y }))
    .filter(p =>
      p.x >= 0 && p.x < cols &&
      p.y >= 0 && p.y < rows &&
      grid[p.y][p.x] !== 'O'
    );
}

export function reconstructPath(
  cameFrom: Map<string, Position>,
  goal: Position
): Position[] {
  const path: Position[] = [];
  let cur: Position | undefined = goal;
  while (cur) {
    path.unshift(cur);
    const key = `${cur.x},${cur.y}`;
    cur = cameFrom.get(key);
  }
  return path.slice(1);
}