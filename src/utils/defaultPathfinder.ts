import type { Position } from '../types/Position'
import type { TerrainDifficulty } from '../types/TerrainDifficulty'
import type { SearchResult, SearchFrame } from '../types/SearchFrame'
import { TERRAIN_COST } from './terrain'

// BFS simples usado como placeholder até os algoritmos das tasks C/D/E estarem prontos.
// O Grid chama esta função; basta substituir pela função real quando disponível.

function posKey(p: Position): string {
  return `${p.x},${p.y}`
}

function keyToPos(key: string): Position {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

function getNeighbors(
  p: Position,
  rows: number,
  cols: number,
  grid: TerrainDifficulty[][]
): Position[] {
  return [
    { x: p.x, y: p.y - 1 },
    { x: p.x, y: p.y + 1 },
    { x: p.x - 1, y: p.y },
    { x: p.x + 1, y: p.y },
  ].filter(
    n =>
      n.x >= 0 &&
      n.x < cols &&
      n.y >= 0 &&
      n.y < rows &&
      grid[n.y][n.x] !== 'O'
  )
}

export function defaultBFS(
  start: Position,
  goal: Position,
  grid: TerrainDifficulty[][],
  rows: number,
  cols: number
): SearchResult {
  const frames: SearchFrame[] = []
  const closed = new Set<string>()
  const inOpen = new Set<string>()
  const parent = new Map<string, string | null>()

  const startKey = posKey(start)
  inOpen.add(startKey)
  parent.set(startKey, null)
  const queue: Position[] = [start]

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentKey = posKey(current)

    inOpen.delete(currentKey)
    if (closed.has(currentKey)) continue
    closed.add(currentKey)

    for (const neighbor of getNeighbors(current, rows, cols, grid)) {
      const nKey = posKey(neighbor)
      if (!closed.has(nKey) && !inOpen.has(nKey)) {
        inOpen.add(nKey)
        parent.set(nKey, currentKey)
        queue.push(neighbor)
      }
    }

    frames.push({ visited: [...closed], frontier: [...inOpen] })

    if (currentKey === posKey(goal)) break
  }

  if (!parent.has(posKey(goal))) {
    return { frames, path: null, totalCost: 0 }
  }

  // Reconstrói o caminho do goal até o start
  const path: Position[] = []
  let curr: string | null | undefined = posKey(goal)
  while (curr != null) {
    path.unshift(keyToPos(curr))
    curr = parent.get(curr)
  }

  let totalCost = 0
  for (let i = 1; i < path.length; i++) {
    totalCost += TERRAIN_COST[grid[path[i].y][path[i].x]]
  }

  return { frames, path, totalCost }
}
