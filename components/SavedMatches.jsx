"use client";
import { useState } from 'react';
import { useScoreboard } from '../context/ScoreboardContext';

export default function SavedMatches() {
  const { state, dispatch } = useScoreboard();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSaveCurrentMatch = () => {
    dispatch({ type: 'SAVE_MATCH_RESULT', payload: { title: 'Nova Partida' } });
  };

  const startEdit = (match) => {
    setEditingId(match.id);
    setEditTitle(match.title);
  };

  const saveEdit = (id) => {
    dispatch({ type: 'EDIT_SAVED_MATCH', payload: { id, newTitle: editTitle } });
    setEditingId(null);
  };

  return (
    <div className="card shadow-sm border-secondary rounded-4 overflow-hidden h-100">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3 border-secondary">
        <h5 className="mb-0 fw-bold"><i className="bi bi-trophy-fill text-warning me-2"></i>Resultados Salvos</h5>
        <button className="btn btn-sm btn-light fw-bold" onClick={handleSaveCurrentMatch} disabled={!state.match.isEnded}>
          <i className="bi bi-save-fill me-1"></i> Salvar Placar
        </button>
      </div>
      
      <div className="card-body bg-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {state.savedMatches?.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            <p className="mb-0">Nenhuma partida salva.</p>
            <small>Encerre uma partida para poder salvar o resultado.</small>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {state.savedMatches?.map((match) => (
              <li key={match.id} className="list-group-item bg-transparent border-secondary p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {editingId === match.id ? (
                    <div className="input-group input-group-sm w-75">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                      />
                      <button className="btn btn-success" onClick={() => saveEdit(match.id)}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                    </div>
                  ) : (
                    <h6 className="mb-0 fw-bold">{match.title} <span className="text-muted fw-normal small ms-2">{match.date}</span></h6>
                  )}
                  
                  <div>
                    <button className="btn btn-sm btn-outline-secondary border-0 me-1" onClick={() => startEdit(match)}>
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => dispatch({ type: 'DELETE_SAVED_MATCH', payload: match.id })}>
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center bg-dark text-white p-2 rounded-3 border border-secondary">
                  <span className="fw-medium text-truncate" style={{ maxWidth: '35%' }}>{match.homeTeam}</span>
                  <span className="badge bg-secondary fs-6 px-3">{match.homeScore} <span className="mx-1 text-muted">x</span> {match.awayScore}</span>
                  <span className="fw-medium text-truncate text-end" style={{ maxWidth: '35%' }}>{match.awayTeam}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}