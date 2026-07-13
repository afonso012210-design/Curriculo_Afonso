
import { useEffect, useState } from 'react';
import './GTAGame.css';

export default function GTAGame() {
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState({x:300,y:220,money:0,life:100,wanted:0});

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      setPlayer(p => {
        const s = 15;
        let x = p.x, y = p.y;
        if (e.key === 'ArrowUp') y -= s;
        if (e.key === 'ArrowDown') y += s;
        if (e.key === 'ArrowLeft') x -= s;
        if (e.key === 'ArrowRight') x += s;
        if (e.key.toLowerCase() === 'e') return {...p, money:p.money+100};
        if (e.key.toLowerCase() === 'p') return {...p, wanted:Math.min(5,p.wanted+1)};
        return {...p, x:Math.max(0,Math.min(760,x)), y:Math.max(0,Math.min(460,y))};
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button className="gta-btn" onClick={() => setOpen(true)}>🚓 GTA City</button>
      {open && (
        <div className="gta-modal">
          <div className="gta-box">
            <button className="close-btn" onClick={() => setOpen(false)}>✕</button>

            <div className="hud">
              ❤️ {player.life} | 💰 ${player.money} | ⭐ {player.wanted}
            </div>

            <div className="gta-map">
              <div className="road h1"></div>
              <div className="road h2"></div>
              <div className="road v1"></div>
              <div className="road v2"></div>

              <div className="building b1"></div>
              <div className="building b2"></div>
              <div className="building b3"></div>

              <div className="mission">🎯</div>
              <div className="cash">💵</div>
              <div className="police">🚓</div>

              <div className="player" style={{left:player.x, top:player.y}}>🚗</div>
            </div>

            <p className="help">
              Setas = mover | E = ganhar dinheiro | P = aumentar nível de polícia
            </p>
          </div>
        </div>
      )}
    </>
  );
}
