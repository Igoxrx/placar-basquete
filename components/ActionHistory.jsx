"use client";
import { useScoreboard } from '../context/ScoreboardContext';

export default function ActionHistory() {
  const { state, dispatch } = useScoreboard();

  return (
    <div className="card shadow-sm mt-4 border-secondary rounded-4 overflow-hidden">
      <div className="card-header d-flex justify-content-between align-items-center p-3 border-secondary">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-clock-history me-2"></i>Histórico e Controle
        </h5>
        <div className="gap-2 d-flex">
          <button 
            className="btn btn-sm btn-outline-warning fw-bold" 
            onClick={() => dispatch({ type: 'UNDO_ACTION' })}
            disabled={state.pastStates.length === 0}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> Desfazer
          </button>
          <button 
            className="btn btn-sm btn-outline-danger fw-bold" 
            onClick={() => dispatch({ type: 'RESET_MATCH' })}
          >
            <i className="bi bi-arrow-repeat me-1"></i> Nova Partida
          </button>
        </div>
      </div>
      
      <div className="card-body p-0" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <ul className="list-group list-group-flush">
          {state.actionLog.map((log, index) => (
            <li key={index} className="list-group-item bg-transparent border-secondary text-muted small p-3">
              <strong className="text-body">{log.time}</strong> - {log.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}