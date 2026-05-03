import styles from './styles.module.css'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import type { ReactNode } from 'react'

export type TileState = 'normal' | 'visited' | 'frontier' | 'path' | 'current'

interface TileProps {
  tipo: TerrainDifficulty
  state?: TileState
  children?: ReactNode
}

export function Tile({ tipo, state = 'normal', children }: TileProps) {
  return (
    <div className={`${styles.tile} ${styles[`terrain_${tipo}`]}`}>
      {state !== 'normal' && <div className={styles[`overlay_${state}`]} />}
      {children}
    </div>
  )
}
