"use client";
import { createContext, useReducer, useEffect, useContext } from 'react';

const initialState = {
  teams: {
    home: { id: 'home', name: 'Ceará', score: 0 },
    away: { id: 'away', name: 'Fortaleza', score: 0 }
  },
  players: [], 
  match: { period: 1, timeRemaining: 600, isRunning: false, isEnded: false },
  actionLog: [],
  pastStates: [],
  savedMatches: []
};

const ScoreboardContext = createContext();

function scoreboardReducer(state, action) {
  const saveState = (newState) => ({
    ...newState,
    pastStates: [...state.pastStates, { ...state, pastStates: [] }] 
  });

  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return action.payload;

    case 'ADD_PLAYER': {
      const { name, teamId } = action.payload;
      if (!name.trim()) return state;
      if (state.players.some(p => p.name === name && p.team === teamId)) return state;
      
      const newPlayer = { id: Date.now(), name, team: teamId, totalPoints: 0, pointsByPeriod: {1:0, 2:0, 3:0, 4:0}, stats: { pt1: 0, pt2: 0, pt3: 0 } };
      return saveState({
        ...state,
        players: [...state.players, newPlayer],
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `Jogador ${name} adicionado ao time ${state.teams[teamId].name}` }, ...state.actionLog]
      });
    }

    case 'REMOVE_PLAYER': {
      const player = state.players.find(p => p.id === action.payload);
      return saveState({
        ...state,
        players: state.players.filter(p => p.id !== action.payload),
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `Jogador ${player.name} removido` }, ...state.actionLog]
      });
    }

    case 'UPDATE_TEAM_NAME': {
      const { teamId, newName } = action.payload;
      return saveState({
        ...state,
        teams: { ...state.teams, [teamId]: { ...state.teams[teamId], name: newName } },
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `Nome do time alterado para ${newName}` }, ...state.actionLog]
      });
    }

    case 'ADD_POINTS': {
      if (state.match.isEnded) return state;
      const { playerId, points, teamId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      const period = state.match.period;

      return saveState({
        ...state,
        teams: { ...state.teams, [teamId]: { ...state.teams[teamId], score: state.teams[teamId].score + points } },
        players: state.players.map(p => {
          if (p.id === playerId) {
            return {
              ...p,
              totalPoints: p.totalPoints + points,
              pointsByPeriod: { ...p.pointsByPeriod, [period]: p.pointsByPeriod[period] + points },
              stats: { ...p.stats, [`pt${points}`]: p.stats[`pt${points}`] + 1 }
            };
          }
          return p;
        }),
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `${player.name} marcou ${points} pontos (Período ${period})` }, ...state.actionLog]
      });
    }

    case 'TOGGLE_TIMER':
      return { ...state, match: { ...state.match, isRunning: !state.match.isRunning } };

    case 'TICK_TIMER':
      if (state.match.timeRemaining > 0 && state.match.isRunning) {
        return { ...state, match: { ...state.match, timeRemaining: state.match.timeRemaining - 1 } };
      }
      return state;

    case 'ADVANCE_PERIOD':
      if (state.match.period < 4) {
        return saveState({
          ...state,
          match: { ...state.match, period: state.match.period + 1, timeRemaining: 600, isRunning: false },
          actionLog: [{ time: new Date().toLocaleTimeString(), text: `Avançou para o período ${state.match.period + 1}` }, ...state.actionLog]
        });
      }
      return state;

    case 'END_MATCH':
      return saveState({
        ...state,
        match: { ...state.match, isEnded: true, isRunning: false },
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `Partida encerrada` }, ...state.actionLog]
      });

    case 'UNDO_ACTION':
      if (state.pastStates.length === 0) return state;
      return state.pastStates[state.pastStates.length - 1];

    case 'RESET_MATCH':
      // Mantém os jogos salvos no banco de dados quando iniciar uma nova partida
      return { 
        ...initialState, 
        savedMatches: state.savedMatches, 
        actionLog: [{ time: new Date().toLocaleTimeString(), text: `Nova partida iniciada` }] 
      };


    case 'SAVE_MATCH_RESULT': {
      const newMatch = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: action.payload.title || 'Partida Amistosa',
        homeTeam: state.teams.home.name,
        homeScore: state.teams.home.score,
        awayTeam: state.teams.away.name,
        awayScore: state.teams.away.score,
      };
      return { ...state, savedMatches: [newMatch, ...state.savedMatches] };
    }

    case 'DELETE_SAVED_MATCH': {
      return { 
        ...state, 
        savedMatches: state.savedMatches.filter(m => m.id !== action.payload) 
      };
    }

    case 'EDIT_SAVED_MATCH': {
      const { id, newTitle } = action.payload;
      return {
        ...state,
        savedMatches: state.savedMatches.map(m => 
          m.id === id ? { ...m, title: newTitle } : m
        )
      };
    }

    default:
      return state;
  }
}

export function ScoreboardProvider({ children }) {
  const [state, dispatch] = useReducer(scoreboardReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('basketballScoreboard');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Garante que o array savedMatches exista caso esteja puxando um save antigo
      if (!parsedData.savedMatches) parsedData.savedMatches = [];
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedData });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('basketballScoreboard', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let timer;
    if (state.match.isRunning && state.match.timeRemaining > 0) {
      timer = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    } else if (state.match.timeRemaining === 0 && state.match.isRunning) {
      dispatch({ type: 'TOGGLE_TIMER' });
    }
    return () => clearInterval(timer);
  }, [state.match.isRunning, state.match.timeRemaining]);

  return (
    <ScoreboardContext.Provider value={{ state, dispatch }}>
      {children}
    </ScoreboardContext.Provider>
  );
}

export const useScoreboard = () => useContext(ScoreboardContext);