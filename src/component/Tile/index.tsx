import styles from './styles.module.css'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'

interface TileProps{
    tipo: TerrainDifficulty
};

export function Tile({tipo}: TileProps){
    return(
        <div className={styles.tile_container}>
            {tipo}
        </div>
    )
        
           
}