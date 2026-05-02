import './App.css'
import { Grid } from './component/Grid'
import { useState } from 'react'

function App() {
  // estados de controle = pausa, qual algoritmo e velocidade
  const [isPaused, setIsPaused] = useState(false);
  const [algoritmo, setAlgoritmo] = useState("BFS");
  const [velocidade, setVelocidade] = useState(100);

  return (
    <div id="center">
      <h1>Algoritmos de Busca</h1>

      {/* controle dos botoes */}
      <div className="buttons_container">
        <button className="counter" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Retomar" : "Pausar"}
        </button>
        
        <button className="counter" onClick={() => window.location.reload()}>
          Resetar Mapa
        </button>

        <select
          className="counter"
          value={algoritmo}
          onChange={(e) => setAlgoritmo(e.target.value)}
        >
          <option value="BFS">BFS</option>
          <option value="DFS">DFS</option>
          <option value="Dijkstra">Dijkstra</option>
          <option value="A*">A*</option>
        </select>

        {/* dinamica da velocidade */}
        <input
          type="range"
          min="10"
          max="1000"
          value={velocidade}
          onChange={(e) => setVelocidade(Number(e.target.value))}
        />
      </div>

      <div className="hero">
        {/* variaveis de controle nas props da grid */}
        <Grid
          rows={10}
          columns={12}
          isPaused={isPaused}
          algoritmo={algoritmo}
          velocidade={velocidade}
        />
      </div>
    </div>
  )
}

export default App