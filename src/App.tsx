import './App.css'
import { Grid } from './component/Grid'
import { useState } from 'react'

function App() {
  // estados de controle = pausa, qual algoritmo e velocidade
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(12);
  const [isPaused, setIsPaused] = useState(true);
  const [algoritmo, setAlgoritmo] = useState("BFS");
  const [velocidade, setVelocidade] = useState(450);

  return (
    <div id="center">
      <h1>Algoritmos de Busca</h1>

      {/* controle dos botoes */}
      <div className="buttons_container">
        <div className='input-container'>
          <span className='input-label'>Rows: {rows}</span>
          <div className='buttons_container_inner'>
            <button className="counter" onClick={() => setRows(prev => {
              if(prev > 4) return prev - 1;
              else return prev
            })}>
              -
            </button>
            <button className="counter" onClick={() => setRows(prev => prev + 1)}>
              +
            </button>
          </div>
        </div>

        <div className='input-container'>
          <span className='input-label'>Columns: {columns}</span>
          <div className='buttons_container_inner'>
            <button className="counter" onClick={() => setColumns(prev => {
              if(prev > 4) return prev - 1;
              else return prev
            })}>
              -
            </button>
            <button className="counter" onClick={() => setColumns(prev => prev + 1)}>
              +
            </button>
          </div>
        </div>

        <div className='input-container'>
          <span className='input-label'>Ações</span>
          <div className='buttons_container_inner'>
            <button className="counter" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? "Retomar" : "Pausar"}
            </button>
            <button className="counter" onClick={() => window.location.reload()}>
              Resetar
            </button>
          </div>
        </div>

        <div className='input-container'>
          <span className='input-label'>Algoritmo</span>
          <select className="counter" value={algoritmo} onChange={(e) => setAlgoritmo(e.target.value)}>
            <option value="BFS">BFS</option>
            <option value="DFS">DFS</option>
            <option value="Dijkstra">Dijkstra</option>
            <option value="Greedy">Greedy</option>
            <option value="A*">A*</option>
          </select>
        </div>

        {/* dinamica da velocidade */}
        <div className="input-container">
          <span className='input-label'>Delay (ms)</span>
          <input
            type="range"
            min="50"
            max="2000"
            className="range-input" // Adicione uma classe para estilizar se necessário
            value={velocidade}
            onChange={(e) => setVelocidade(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="hero">
        {/* variaveis de controle nas props da grid */}
        <Grid
          key={`${rows}-${columns}-${algoritmo}`}
          rows={rows}
          columns={columns}
          isPaused={isPaused}
          algoritmo={algoritmo}
          velocidade={velocidade}
        />
      </div>
    </div>
  )
}

export default App