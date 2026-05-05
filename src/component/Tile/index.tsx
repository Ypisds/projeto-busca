import styles from './styles.module.css'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import type { ReactNode } from 'react'

export type TileState = 'normal' | 'visited' | 'frontier' | 'path'

interface TileProps {
  tipo: TerrainDifficulty
  state?: TileState
  dimmed?: boolean
  children?: ReactNode
}

export function Tile({ tipo, state = 'normal', dimmed = false, children }: TileProps) {
  const className = [
    styles.tile,
    styles[`terrain_${tipo}`],
    dimmed ? styles.dimmed : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      {state !== 'normal' && <div className={styles[`overlay_${state}`]} />}
      {children}
    </div>
  )
}
