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
    lines: number
    columns: number
}

export function Grid({lines, columns}: GridProps){
    const [grid, setGrid] = useState<TerrainDifficulty[][]>(generateGrid(lines, columns))
    const [agentPosition, setAgentPosition] = useState<Position>(generateAgentPosition(lines, columns, grid))
    const [foodPosition, setFoodPosition] = useState<Position>(generateFoodPosition(lines, columns, grid, agentPosition))

    useEffect(() => {
        const newGrid = generateGrid(lines, columns);

        const newAgentPosition = generateAgentPosition(lines, columns, newGrid);

        const newFoodPosition = generateFoodPosition(lines, columns, newGrid, newAgentPosition)

        setGrid(newGrid);
        setAgentPosition(newAgentPosition);
        setFoodPosition(newFoodPosition)
    }, [lines, columns]);

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
        "--rows": lines,
      } as React.CSSProperties}
        >
            {gridTile}
        </div>
        
    )
}