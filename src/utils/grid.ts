import { type TerrainDifficulty } from "../types/TerrainDifficulty";

function getRandomTerrainDifficulty(): TerrainDifficulty
{
    const options: TerrainDifficulty[] = ['A', 'B', 'M', 'O']
    const randomIndex = Math.floor(Math.random() * options.length)
    return options[randomIndex]
}

function generateColumns(columns: number): TerrainDifficulty[]
{
    return Array.from({length: columns}, () => {
        return getRandomTerrainDifficulty()
    })
}

export function generateGrid(rows: number, columns: number): TerrainDifficulty[][]
{
    return Array.from({length: rows}, () =>{
        return generateColumns(columns)
    })
}