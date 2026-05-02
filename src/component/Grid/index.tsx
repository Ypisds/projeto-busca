import styles from './styles.module.css'
import { Tile } from '../Tile'
import { type TerrainDifficulty } from '../../types/TerrainDifficulty'
import { type Position } from '../../types/Position'
import { useState, useEffect } from 'react' 
import { generateGrid } from '../../utils/grid'
import { Agent } from '../Agent'
import { generateAgentPosition, moveDown, moveLeft, moveRight, moveUp } from '../../utils/agent'
import { Food } from '../Food'
import { generateFoodPosition } from '../../utils/food'

interface GridProps {
    rows: number
    columns: number
    isPaused: boolean    
    algoritmo: string    
    velocidade: number   
}

export function Grid({ rows, columns, isPaused, algoritmo, velocidade }: GridProps) {
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

    // o agente "come" a comida e gera uma nova
    useEffect(() => {
        if (agentPosition.x === foodPosition.x && agentPosition.y === foodPosition.y) {
            console.log(`Objetivo atingido com o algoritmo: ${algoritmo}`);
            
            // cria uma nova posicao para a comida
            const newFood = generateFoodPosition(rows, columns, grid, agentPosition);
            setFoodPosition(newFood);
        }
    }, [agentPosition, foodPosition, rows, columns, grid, algoritmo]);

    // automatizando o movimento do agente
    useEffect(() => {
        if (isPaused) return;
        if (agentPosition.x === foodPosition.x && agentPosition.y === foodPosition.y) return;

        const linhaAtual = grid[agentPosition.y];
        if (!linhaAtual) return;

        const valorCelula = linhaAtual[agentPosition.x];
        const custoTerreno = typeof valorCelula === 'number' ? valorCelula : 1;
        const delayReal = Number(velocidade) * (custoTerreno > 0 ? custoTerreno : 1);

        const timer = setInterval(() => {
            if (agentPosition.x < foodPosition.x) handleMoveRight();
            else if (agentPosition.x > foodPosition.x) handleMoveLeft();
            else if (agentPosition.y < foodPosition.y) handleMoveDown();
            else if (agentPosition.y > foodPosition.y) handleMoveUp();
        }, delayReal);

        return () => clearInterval(timer);
    }, [isPaused, agentPosition, foodPosition, velocidade, grid]);

    function handleMoveLeft() {
        setAgentPosition(prev => moveLeft(prev, grid))
    }

    function handleMoveRight() {
        setAgentPosition(prev => moveRight(columns, prev, grid))
    }

    function handleMoveUp() {
        setAgentPosition(prev => moveUp(prev, grid))
    }

    function handleMoveDown() {
        setAgentPosition(prev => moveDown(rows, prev, grid))
    }

    return (
        <> 
            <div className={styles.buttons_container}>
                <button className={styles.buttom} onClick={handleMoveLeft}> ← </button>
                <button className={styles.buttom} onClick={handleMoveRight}> → </button>
                <button className={styles.buttom} onClick={handleMoveUp}> ↑ </button>
                <button className={styles.buttom} onClick={handleMoveDown}> ↓ </button>
            </div>
            <div 
                className={styles.row}
                style={{ 
                    "--cols": columns,
                    "--rows": rows,
                } as React.CSSProperties}
            >
                {
                    grid.map((row, y) => (
                        row.map((cell, x) => (
                            <Tile tipo={cell} key={`cell-${x}-${y}`}>
                                {agentPosition.y === y && agentPosition.x === x && <Agent />}
                                {foodPosition.y === y && foodPosition.x === x && <Food />}
                            </Tile> 
                        ))
                    ))
                }
            </div>
        </>
    )
}