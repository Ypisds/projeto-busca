import styles from './styles.module.css'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import type { ReactNode } from 'react'

interface TileProps{
    tipo: TerrainDifficulty,
    children?: ReactNode
};

export function Tile({tipo, children}: TileProps){
    return(
        <div className={styles.tile_container}>
            {tipo}
            {children}
        </div>
    )
        
           
}