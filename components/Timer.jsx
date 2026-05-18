"use client";
import { useScoreboard } from '../context/ScoreboardContext';

export default function Timer() {
  const { state, dispatch } = useScoreboard();
  const { period, timeRemaining, isRunning, isEnded } = state.match;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="card text-center mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-muted">CRONÔMETRO DO PERÍODO {period}/4</h5>
        <h1 className="display-3 fw-bold">{formatTime(timeRemaining)}</h1>
<div className="d-flex justify-content-center gap-3 mt-4">
          <button 
            className={`btn btn-lg fw-bold px-5 rounded-pill ${isRunning ? 'btn-warning' : 'btn-success'}`}
            onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
            disabled={isEnded || timeRemaining === 0}
          >
            {isRunning ? <><i className="bi bi-pause-fill"></i> Pausar</> : <><i className="bi bi-play-fill"></i> Iniciar</>}
          </button>
          
          <button 
            className="btn btn-lg btn-outline-light fw-bold px-4 rounded-pill"
            onClick={() => dispatch({ type: 'ADVANCE_PERIOD' })}
            disabled={period === 4 || isEnded}
          >
            <i className="bi bi-skip-forward-fill"></i> Próximo
          </button>
          
          <button 
            className="btn btn-lg btn-danger fw-bold px-4 rounded-pill shadow"
            onClick={() => dispatch({ type: 'END_MATCH' })}
            disabled={isEnded}
          >
            <i className="bi bi-stop-fill"></i> Encerrar
          </button>
        </div>
      </div>
    </div>
  );
}