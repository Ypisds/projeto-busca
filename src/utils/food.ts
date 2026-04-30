import type { Position } from "../types/Position";
import type { TerrainDifficulty } from "../types/TerrainDifficulty";

function generatePosition(rows:number, columns: number): Position
{
    return {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
    }
}

export function generateFoodPosition(rows: number, columns: number, grid: TerrainDifficulty[][], agentPosition: Position): Position
{
    let position: Position
    do{
        position = generatePosition(rows, columns)
    }while(grid[position.y][position.x] === 'O' || agentPosition === position) // Não permite que a comida spawne em um obstáculo e nem na posição do spawn do agente
    return position
}