"use client";
import { ScoreboardProvider } from '../context/ScoreboardContext';
import Timer from '../components/Timer';
import TeamPanel from '../components/TeamPanel';
import ActionHistory from '../components/ActionHistory';
import ThemeToggle from '../components/ThemeToggle';
import Statistics from '../components/Statistics';
import SavedMatches from '../components/SavedMatches'; 

export default function Page() {
  return (
    <ScoreboardProvider>
      {/* Usando container-fluid para usar a tela toda*/}
      <div className="container-fluid px-4 py-4">
        
        <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 bg-body p-3 rounded-4 shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
              <i className="bi bi-dribbble fs-2"></i>
            </div>
            <div>
              <h2 className="fw-bolder mb-0">Placar de Basquete</h2>
              <p className="text-muted mb-0 small">Dashboard de Gestão de Partida</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <Timer />
            <div className="row g-3">
              <TeamPanel teamId="home" />
              <TeamPanel teamId="away" />
            </div>
            <ActionHistory />
          </div>

          <div className="col-12 col-xl-4 d-flex flex-column gap-4">
            <Statistics />
            <SavedMatches />
          </div>
        </div>

      </div>
    </ScoreboardProvider>
  );
}