import type { Position } from "../types/Position";
import type { TerrainDifficulty } from "../types/TerrainDifficulty";

function generatePosition(rows:number, columns: number): Position
{
    return {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
    }
}

export function generateAgentPosition(rows: number, columns: number, grid: TerrainDifficulty[][]): Position
{
    let position: Position
    do{
        position = generatePosition(rows, columns)
    }while(grid[position.y][position.x] === 'O')
    return position
}