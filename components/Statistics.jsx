"use client";
import { useScoreboard } from '../context/ScoreboardContext';

export default function Statistics() {
  const { state } = useScoreboard();
  const { players, teams, match } = state;

  // Transformação de dados: encontrando o Cestinha
  const cestinha = players.length > 0 
    ? [...players].sort((a, b) => b.totalPoints - a.totalPoints)[0] 
    : null;

  // Agrupando totais de cestas da partida
  const totalStats = players.reduce((acc, p) => {
    acc.pt1 += p.stats.pt1;
    acc.pt2 += p.stats.pt2;
    acc.pt3 += p.stats.pt3;
    return acc;
  }, { pt1: 0, pt2: 0, pt3: 0 });

  // Determinando o vencedor
  let winnerText = "Empate";
  let winnerColor = "text-muted";
  if (teams.home.score > teams.away.score) {
    winnerText = teams.home.name;
    winnerColor = "text-primary";
  } else if (teams.away.score > teams.home.score) {
    winnerText = teams.away.name;
    winnerColor = "text-danger";
  }

  return (
    <div className="card shadow-sm border-secondary rounded-4 overflow-hidden h-100">
      <div className="card-header bg-dark text-white p-3 border-secondary">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-bar-chart-fill me-2"></i>Estatísticas da Partida
        </h5>
      </div>
      
      <div className="card-body bg-body p-4 d-flex flex-column gap-4">

        <div className="d-flex align-items-center p-3 bg-body-tertiary rounded-3 border border-secondary">
          <i className="bi bi-trophy-fill text-warning fs-1 me-3"></i>
          <div>
            <h6 className="text-muted mb-1 text-uppercase small fw-bold">Cestinha da Partida</h6>
            {cestinha && cestinha.totalPoints > 0 ? (
              <h4 className="mb-0 fw-bolder">
                {cestinha.name} <span className="text-primary">({cestinha.totalPoints} pts)</span>
              </h4>
            ) : (
              <h5 className="mb-0 text-body-secondary">Nenhum ponto registrado</h5>
            )}
          </div>
        </div>

        {/* Resumo de Cestas */}
        <div>
          <h6 className="text-muted text-uppercase small fw-bold mb-3">Total de Cestas (Ambos os times)</h6>
          <ul className="list-group list-group-flush rounded border border-secondary">
            <li className="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              Lances Livres (1 pt)
              <span className="badge bg-secondary rounded-pill px-3">{totalStats.pt1}</span>
            </li>
            <li className="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              Cestas de 2 Pontos
              <span className="badge bg-secondary rounded-pill px-3">{totalStats.pt2}</span>
            </li>
            <li className="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              Cestas de 3 Pontos
              <span className="badge bg-secondary rounded-pill px-3">{totalStats.pt3}</span>
            </li>
          </ul>
        </div>

        {/* Placar Final e Vencedor */}
        <div className="mt-auto pt-3 border-top border-secondary">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <h6 className="text-muted text-uppercase small fw-bold mb-0">Status Final</h6>
            {match.isEnded ? (
              <span className="badge bg-danger">Encerrada</span>
            ) : (
              <span className="badge bg-success">Em andamento</span>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center bg-body-tertiary p-3 rounded-3 mt-2 border border-secondary">
            <span className="fs-5 fw-medium">Vencedor Atual:</span>
            <span className={`fs-4 fw-bolder ${winnerColor}`}>{winnerText}</span>
          </div>
        </div>

      </div>
    </div>
  );
}