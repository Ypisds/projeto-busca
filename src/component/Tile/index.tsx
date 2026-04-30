import styles from './styles.module.css'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import type { ReactNode } from 'react'

interface TileProps{
    tipo: TerrainDifficulty,
    children?: ReactNode
};

//TODO: Mudar o Tile para retornar uma textura de terreno diferente com base em seu tipo de terreno
export function Tile({tipo, children}: TileProps){
    return(
        <div className={styles.tile_container}>
            {tipo}
            {children}
        </div>
    )
        
           
}