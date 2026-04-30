import styles from './styles.module.css'
import { Tile } from '../Tile'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import { type Position } from '../../types/Position'
import { useState } from 'react'
import { generateGrid } from '../../utils/grid'
import { useEffect } from 'react'
import { Agent } from '../Agent'
import { generateAgentPosition } from '../../utils/agent'
import { Food } from '../Food'
import { generateFoodPosition } from '../../utils/food'

interface GridProps{
    rows: number
    columns: number
}

export function Grid({rows, columns}: GridProps){
    const [grid, setGrid] = useState<TerrainDifficulty[][]>(generateGrid(rows, columns))
    const [agentPosition, setAgentPosition] = useState<Position>(generateAgentPosition(rows, columns, grid))
    const [foodPosition, setFoodPosition] = useState<Position>(generateFoodPosition(rows, columns, grid, agentPosition))

    useEffect(() => {
        const newGrid = generateGrid(rows, columns);

        const newAgentPosition = generateAgentPosition(rows, columns, newGrid);

        const newFoodPosition = generateFoodPosition(rows, columns, newGrid, newAgentPosition)

        setGrid(newGrid);
        setAgentPosition(newAgentPosition);
        setFoodPosition(newFoodPosition)
    }, [rows, columns]);

    const gridTile = grid.map((row, y)=>(
        row.map((cell, x) => (
            <>
                <Tile tipo={cell} key={`cell-${x}-${y}`}>
                    {agentPosition.y === y && agentPosition.x === x && <Agent />}
                    {foodPosition.y === y && foodPosition.x === x && <Food />}
                </Tile>
            </>
        ))
    ))

    return (
        <div 
        className={styles.row}
        style={{ 
        "--cols": columns,
        "--rows": rows,
      } as React.CSSProperties}
        >
            {gridTile}
        </div>
        
    )
}