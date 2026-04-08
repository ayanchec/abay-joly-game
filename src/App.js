import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [draggingId, setDraggingId] = useState(null);
  const [isDraggingFinish, setIsDraggingFinish] = useState(false);
  const mapRef = useRef(null);

  const [levels, setLevels] = useState([
    { id: 1, x: 46.5, y: 91.2, s: 1.0 },
    { id: 2, x: 58.5, y: 82.5, s: 0.9 },
    { id: 3, x: 53.8, y: 73.2, s: 0.85 },
    { id: 4, x: 41.2, y: 65.5, s: 0.8 },
    { id: 5, x: 60.5, y: 56.8, s: 0.75 },
    { id: 6, x: 53.2, y: 47.5, s: 0.7 },
    { id: 7, x: 40.8, y: 39.2, s: 0.65 },
    { id: 8, x: 56.2, y: 30.5, s: 0.6 },
    { id: 9, x: 48.5, y: 21.8, s: 0.55 },
    { id: 10, x: 42.5, y: 16.2, s: 0.5 },
  ]);

  const [finishPos, setFinishPos] = useState({ x: 42.5, y: 8.0, s: 0.7 });
  const mapUrl = process.env.PUBLIC_URL + '/img.png';

  const handleMouseMove = (e) => {
    if (draggingId === null && !isDraggingFinish) return;
    const rect = mapRef.current.getBoundingClientRect();
    let x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    let y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    if (draggingId !== null) {
      setLevels(prev => prev.map(l => l.id === draggingId ? { ...l, x, y } : l));
    } else if (isDraggingFinish) {
      setFinishPos(prev => ({ ...prev, x, y }));
    }
  };

  const handleWheel = (e, id, isFinish = false) => {
    if (!e.shiftKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    if (isFinish) {
      setFinishPos(prev => ({ ...prev, s: Math.max(0.2, Math.min(2, prev.s + delta)) }));
    } else {
      setLevels(prev => prev.map(l => l.id === id ? { ...l, s: Math.max(0.2, Math.min(2, l.s + delta)) } : l));
    }
  };

  return (
    <div className="game-viewport">
      {!gameStarted && (
        <div className="start-overlay">
          <div className="start-card">
            <h1>АБАЙ ЖОЛЫ</h1>
            <button className="big-play-btn" onClick={() => setGameStarted(true)}>ОЙНАУ</button>
          </div>
        </div>
      )}

      <div
        className={`map-container ${gameStarted ? 'game-active' : ''}`}
        ref={mapRef}
        style={{ backgroundImage: `url("${mapUrl}")` }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => {setDraggingId(null); setIsDraggingFinish(false);}}
      >
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            className={`coin-slot ${lvl.id <= currentLevel ? 'unlocked' : 'locked'}`}
            style={{ left: `${lvl.x}%`, top: `${lvl.y}%`, transform: `translate(-50%, -50%) scale(${lvl.s})` }}
            onMouseDown={(e) => { e.preventDefault(); setDraggingId(lvl.id); }}
            onWheel={(e) => handleWheel(e, lvl.id)}
          >
            <div className="thick-coin">
              <div className="coin-layer side-shadow"></div>
              <div className="coin-layer side-3"></div>
              <div className="coin-layer side-2"></div>
              <div className="coin-layer side-1"></div>
              <div className="coin-layer top-face">{lvl.id <= currentLevel ? lvl.id : '🔒'}</div>
            </div>
          </div>
        ))}

        <div className="finish-zone" style={{ left: `${finishPos.x}%`, top: `${finishPos.y}%`, transform: `translate(-50%, -50%) scale(${finishPos.s})` }}
          onMouseDown={(e) => { e.preventDefault(); setIsDraggingFinish(true); }}
          onWheel={(e) => handleWheel(e, null, true)}>
          <div className="waving-flag">🏁</div>
        </div>
      </div>

      <div className="admin-panel">
        <p>💡 Shift + Scroll: Өлшемді реттеу</p>
        <pre>{JSON.stringify(levels, null, 1)}</pre>
      </div>
    </div>
  );
}

export default App;