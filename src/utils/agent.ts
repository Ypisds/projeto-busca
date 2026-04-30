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
    }while(grid[position.y][position.x] === 'O') // Não permite que o agente spawne num obstáculo
    return position
}

/*
 Abaixo estão listadas quatro funções auxiliares de movimentação do agente
 Não é permitido que o agente saia do Grid
 Não é permitido que o agente ocupe um obstáculo('O')
*/
export function moveRight( columns: number, agentPosition: Position, grid: TerrainDifficulty[][]): Position
{
    const nextX = agentPosition.x + 1

    if(nextX >= columns) return agentPosition;
    if(grid[agentPosition.y][agentPosition.x + 1] === 'O') return agentPosition;
    return {
        x: nextX,
        y: agentPosition.y
    }
}

export function moveLeft(agentPosition: Position, grid: TerrainDifficulty[][]): Position 
{
    const nextX = agentPosition.x - 1;

    if (nextX < 0) return agentPosition;
    if (grid[agentPosition.y][nextX] === 'O') return agentPosition;

    return {
        x: nextX,
        y: agentPosition.y
    };
}

export function moveUp(agentPosition: Position, grid: TerrainDifficulty[][]): Position 
{
    const nextY = agentPosition.y - 1;

    if (nextY < 0) return agentPosition;
    if (grid[nextY][agentPosition.x] === 'O') return agentPosition;

    return {
        x: agentPosition.x,
        y: nextY
    };
}

export function moveDown(rows: number, agentPosition: Position, grid: TerrainDifficulty[][]): Position 
{
    const nextY = agentPosition.y + 1;

    if (nextY >= rows) return agentPosition;
    if (grid[nextY][agentPosition.x] === 'O') return agentPosition;

    return {
        x: agentPosition.x,
        y: nextY
    };
}