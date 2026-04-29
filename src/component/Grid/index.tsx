import styles from './styles.module.css'
import { Tile } from '../Tile'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import { useState } from 'react'
import { generateGrid } from '../../utils/grid'
import { useEffect } from 'react'

interface GridProps{
    lines: number
    columns: number
}

export function Grid({lines, columns}: GridProps){
    const [grid, setGrid] = useState<TerrainDifficulty[][]>(generateGrid(lines, columns))

    useEffect(() => {
        setGrid(generateGrid(lines, columns));
    }, [lines, columns]);

    const gridTile = grid.map((row, y)=>(
        row.map((cell, x) => (
            <Tile tipo={cell} key={`cell-${x}-${y}`} />
        ))
    ))

    return (
        <div 
        className={styles.row}
        style={{ 
        "--cols": columns,
        "--rows": lines,
      } as React.CSSProperties}
        >
            {gridTile}
        </div>
        
    )
}