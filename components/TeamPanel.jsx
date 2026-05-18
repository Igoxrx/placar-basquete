"use client";
import { useState } from 'react';
import { useScoreboard } from '../context/ScoreboardContext';

export default function TeamPanel({ teamId }) {
  const { state, dispatch } = useScoreboard();
  const [playerName, setPlayerName] = useState('');
  
  const team = state.teams[teamId];
  const players = state.players
    .filter(p => p.team === teamId)
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_PLAYER', payload: { name: playerName, teamId } });
    setPlayerName('');
  };

  const isHome = teamId === 'home';
  const themeColor = isHome ? 'primary' : 'danger';
  const headerBg = isHome ? 'bg-primary' : 'bg-danger';

  return (
    <div className="col-md-6 mb-4">
      <div className={`card shadow-lg h-100 border-${themeColor} rounded-4 overflow-hidden`}>
        <div className={`card-header ${headerBg} text-white d-flex justify-content-between align-items-center p-3 border-0`}>
          <input 
            type="text" 
            className="form-control form-control-sm w-50 fw-bold bg-transparent text-white border-light shadow-none" 
            value={team.name}
            onChange={(e) => dispatch({ type: 'UPDATE_TEAM_NAME', payload: { teamId, newName: e.target.value }})}
            style={{ fontSize: '1.5rem' }}
          />
          <h2 className="mb-0 display-4 fw-bolder">{team.score}</h2>
        </div>
        
        <div className="card-body p-4 bg-dark">
          <form onSubmit={handleAddPlayer} className="d-flex gap-2 mb-4">
            <input 
              type="text" 
              className="form-control bg-dark border-secondary text-light" 
              placeholder="Nome do jogador" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button type="submit" className={`btn btn-${themeColor} fw-bold`} disabled={state.match.isEnded}>
              <i className="bi bi-plus-lg"></i> Add
            </button>
          </form>

          <ul className="list-group list-group-flush rounded-3">
            {players.map(player => (
              <li key={player.id} className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center px-2 py-3">
                <span className="fw-medium fs-5">{player.name}</span>
                <div className="d-flex align-items-center gap-3">
                  <div className="btn-group btn-group-sm shadow-sm">
                    {[1, 2, 3].map(pts => (
                      <button 
                        key={pts} 
                        className={`btn btn-outline-${themeColor} fw-bold`}
                        onClick={() => dispatch({ type: 'ADD_POINTS', payload: { playerId: player.id, points: pts, teamId } })}
                        disabled={state.match.isEnded}
                      >
                        +{pts}
                      </button>
                    ))}
                  </div>
                  <span className={`badge bg-${themeColor} rounded-pill fs-5 px-3`}>{player.totalPoints}</span>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => dispatch({ type: 'REMOVE_PLAYER', payload: player.id })}
                    disabled={state.match.isEnded}
                    title="Remover Jogador"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}