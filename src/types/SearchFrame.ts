import type { Position } from './Position'

// Contrato de dados que os algoritmos de busca (tasks C/D/E) devem retornar
export interface SearchFrame {
  visited: string[]   // posições já expandidas, no formato "x,y"
  frontier: string[]  // posições na fronteira aguardando expansão, formato "x,y"
}

export interface SearchResult {
  frames: SearchFrame[]     // sequência de frames para animação passo a passo
  path: Position[] | null   // caminho final do start ao goal (null se não existe)
  totalCost: number         // custo total acumulado do caminho
}

export type AnimationPhase =
  | 'idle'       // aguardando início
  | 'searching'  // animando a expansão da busca frame a frame
  | 'found'      // busca concluída, mostrando caminho antes de mover
  | 'moving'     // agente percorrendo o caminho
  | 'no_path'    // nenhum caminho encontrado
