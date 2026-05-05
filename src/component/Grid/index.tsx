import styles from './styles.module.css'
import { Tile } from '../Tile'
import type { TileState } from '../Tile'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import { type Position } from '../../types/Position'
import { useState, useEffect, type CSSProperties } from 'react'
import { generateGrid } from '../../utils/grid'
import { Agent } from '../Agent'
import { generateAgentPosition } from '../../utils/agent'
import { Food } from '../Food'
import { generateFoodPosition } from '../../utils/food'
import { useSearchAnimation } from '../../hooks/useSearchAnimation'
import { runSearch } from '../../utils/search'
import { TERRAIN_SPEED_MULTIPLIER } from '../../utils/terrain'

interface GridProps {
  rows: number
  columns: number
  isPaused: boolean
  algoritmo: string
  velocidade: number
}

export function Grid({ rows, columns, isPaused, algoritmo: _algoritmo, velocidade }: GridProps) {
  // Inicialização encadeada: grid → agente → comida, tudo consistente no primeiro render.
  // Quando rows/columns mudam, o App.tsx remonta o Grid via key, então não precisamos
  // de useEffect aqui para isso.
  const [grid] = useState<TerrainDifficulty[][]>(() => generateGrid(rows, columns))
  const [agentStartPos] = useState<Position>(() => generateAgentPosition(rows, columns, grid))
  const [foodPosition, setFoodPosition] = useState<Position>(() =>
    generateFoodPosition(rows, columns, grid, agentStartPos)
  )

  const animation = useSearchAnimation({
    initialAgentPosition: agentStartPos,
    grid,
    isPaused,
    velocidade,
    onPathComplete: (finalPos: Position) => {
      const newFood = generateFoodPosition(rows, columns, grid, finalPos)
      setFoodPosition(newFood)
    },
  })

  // Inicia uma nova busca sempre que a fase voltar a 'idle' (início ou após coleta)
  useEffect(() => {
    if (animation.phase !== 'idle') return
    const result = runSearch(_algoritmo, grid, animation.agentPosition, foodPosition, rows, columns);
    animation.startAnimation(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation.phase, foodPosition])

  // Quando não há caminho, gera nova comida após breve pausa e retoma
  useEffect(() => {
    if (animation.phase !== 'no_path') return
    const timer = setTimeout(() => {
      const newFood = generateFoodPosition(rows, columns, grid, animation.agentPosition)
      setFoodPosition(newFood)
      animation.resetAnimation(animation.agentPosition)
    }, 1500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation.phase])

  function getTileState(x: number, y: number): TileState {
    const key = `${x},${y}`
    if (animation.pathSet.has(key)) return 'path'
    if (animation.frontierSet.has(key)) return 'frontier'
    if (animation.visitedSet.has(key)) return 'visited'
    return 'normal'
  }

  // Esmaecer todas as células que NÃO são caminho, assim que o caminho
  // é descoberto. Põe a "rota encontrada" em destaque visual.
  const dimNonPath = animation.phase === 'found' || animation.phase === 'moving'

  // Duração da transição CSS do agente: proporcional ao custo do terreno
  // onde ele está entrando. Areia → rápido; água → bem lento. Assim a
  // travessia visual reflete o custo real, em vez de pausar antes.
  const agentTerrain = grid[animation.agentPosition.y]?.[animation.agentPosition.x]
  const agentTransitionMs =
    animation.phase === 'moving' && agentTerrain
      ? Math.round(velocidade * TERRAIN_SPEED_MULTIPLIER[agentTerrain])
      : 0

  function renderStatus() {
    switch (animation.phase) {
      case 'searching':
        return (
          <p className={`${styles.status} ${styles.status_searching}`}>
            Buscando... ({animation.frameIndex} / {animation.totalFrames} passos)
          </p>
        )
      case 'found':
        return (
          <p className={`${styles.status} ${styles.status_found}`}>
            Caminho encontrado! Custo: {animation.totalCost} · {animation.totalPathSteps} passos
          </p>
        )
      case 'moving':
        return (
          <p className={`${styles.status} ${styles.status_moving}`}>
            Percorrendo... passo {Math.min(animation.pathStep, animation.totalPathSteps)} / {animation.totalPathSteps}
          </p>
        )
      case 'no_path':
        return (
          <p className={`${styles.status} ${styles.status_no_path}`}>
            Sem caminho! Gerando nova comida...
          </p>
        )
      default:
        return <p className={styles.status}></p>
    }
  }

  return (
    <div className={styles.gridContainer}>
      <div
        className={styles.row}
        style={{
          '--cols': columns,
          '--rows': rows,
        } as CSSProperties}
      >
        {grid.map((row: TerrainDifficulty[], y: number) =>
          row.map((cell: TerrainDifficulty, x: number) => {
            const tileState = getTileState(x, y)
            return (
              <Tile
                tipo={cell}
                state={tileState}
                dimmed={dimNonPath && tileState !== 'path'}
                key={`cell-${x}-${y}`}
              >
                {foodPosition.y === y && foodPosition.x === x && <Food />}
              </Tile>
            )
          })
        )}

        {/* Agent como overlay absoluto — permite CSS transition suave entre células */}
        <div
          className={`${styles.agentMarker} ${animation.phase === 'moving' ? styles.agentMoving : ''}`}
          style={{
            left: animation.agentPosition.x * 50,
            top: animation.agentPosition.y * 50,
            transitionDuration: `${agentTransitionMs}ms`,
          }}
        >
          <Agent />
        </div>
      </div>

      {renderStatus()}

      <div className={styles.legend}>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_B}`}/> Areia (1)</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_M}`}/> Atoleiro (5)</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_A}`}/> Água (10)</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_O}`}/> Obstáculo</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_visited}`}/> Visitado</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_frontier}`}/> Fronteira</span>
        <span className={styles.legend_item}><span className={`${styles.legend_box} ${styles.lb_path}`}/> Caminho</span>
      </div>
    </div>
  )
}
