import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { Position } from '../types/Position'
import type { TerrainDifficulty } from '../types/TerrainDifficulty'
import type { SearchResult, AnimationPhase } from '../types/SearchFrame'
import { TERRAIN_SPEED_MULTIPLIER } from '../utils/terrain'

interface UseSearchAnimationParams {
  initialAgentPosition: Position
  grid: TerrainDifficulty[][]
  isPaused: boolean
  velocidade: number
  onPathComplete: (finalPosition: Position) => void
}

export function useSearchAnimation({
  initialAgentPosition,
  grid,
  isPaused,
  velocidade,
  onPathComplete,
}: UseSearchAnimationParams) {
  const [agentPosition, setAgentPosition] = useState<Position>(initialAgentPosition)
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [frameIndex, setFrameIndex] = useState(0)
  const [pathStep, setPathStep] = useState(0)

  // Ref para evitar stale closure no callback de fim de caminho
  const onPathCompleteRef = useRef(onPathComplete)
  useEffect(() => { onPathCompleteRef.current = onPathComplete }, [onPathComplete])

  // --- Animação frame a frame da busca ---
  useEffect(() => {
    if (phase !== 'searching' || !searchResult || isPaused) return

    if (frameIndex >= searchResult.frames.length) {
      setPhase(searchResult.path ? 'found' : 'no_path')
      return
    }

    const timer = setTimeout(() => setFrameIndex(i => i + 1), velocidade)
    return () => clearTimeout(timer)
  }, [phase, frameIndex, searchResult, isPaused, velocidade])

  // --- Transição automática found → moving após breve pausa ---
  useEffect(() => {
    if (phase !== 'found') return
    const timer = setTimeout(() => {
      setPathStep(1) // índice 0 é a posição atual do agente
      setPhase('moving')
    }, 600)
    return () => clearTimeout(timer)
  }, [phase])

  // --- Movimento do agente ao longo do caminho ---
  // Move o agente IMEDIATAMENTE (a transição CSS faz a travessia visível,
  // com duração proporcional ao custo do terreno-destino). Só avança o
  // próximo passo quando a travessia visualmente termina. Assim a "demora"
  // acontece ENQUANTO o agente cruza a água, não antes de entrar nela.
  useEffect(() => {
    if (phase !== 'moving' || !searchResult?.path || isPaused) return
    const path = searchResult.path

    if (pathStep >= path.length) {
      const finalPos = path[path.length - 1]
      onPathCompleteRef.current(finalPos)
      setPhase('idle')
      setSearchResult(null)
      setFrameIndex(0)
      setPathStep(0)
      return
    }

    const nextPos = path[pathStep]
    const terrain = grid[nextPos.y][nextPos.x]
    const stepTime = velocidade * TERRAIN_SPEED_MULTIPLIER[terrain]

    setAgentPosition(nextPos)

    const timer = setTimeout(() => {
      setPathStep(s => s + 1)
    }, stepTime)
    return () => clearTimeout(timer)
  }, [phase, pathStep, searchResult, isPaused, velocidade, grid])

  // Funções estáveis para o Grid chamar sem causar re-renders desnecessários
  const startAnimation = useCallback((result: SearchResult) => {
    setSearchResult(result)
    setFrameIndex(0)
    setPathStep(0)
    setPhase('searching')
  }, [])

  const resetAnimation = useCallback((newPosition: Position) => {
    setPhase('idle')
    setSearchResult(null)
    setFrameIndex(0)
    setPathStep(0)
    setAgentPosition(newPosition)
  }, [])

  // --- Conjuntos de visualização calculados a partir do frame atual ---
  const { visitedSet, frontierSet, pathSet } = useMemo(() => {
    if (!searchResult) {
      return {
        visitedSet: new Set<string>(),
        frontierSet: new Set<string>(),
        pathSet: new Set<string>(),
      }
    }

    const frame = frameIndex > 0 ? searchResult.frames[frameIndex - 1] : undefined
    const visitedSet = new Set(frame?.visited ?? [])
    const frontierSet = new Set(frame?.frontier ?? [])

    const showPath = phase === 'found' || phase === 'moving'
    const path = searchResult.path ?? []
    const pathSet = showPath
      ? new Set(path.map(p => `${p.x},${p.y}`))
      : new Set<string>()

    return { visitedSet, frontierSet, pathSet }
  }, [searchResult, frameIndex, phase])

  return {
    agentPosition,
    phase,
    visitedSet,
    frontierSet,
    pathSet,
    frameIndex,
    totalFrames: searchResult?.frames.length ?? 0,
    pathStep,
    totalPathSteps: searchResult?.path?.length ?? 0,
    totalCost: searchResult?.totalCost ?? 0,
    startAnimation,
    resetAnimation,
  }
}
