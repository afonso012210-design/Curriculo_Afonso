
import { useEffect, useRef, useState } from 'react';
import './PacmanGame.css';

export default function PacmanGame() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tile = 24;

    const MAP = [
      '########################',
      '#..........##..........#',
      '#.####.###.##.###.####.#',
      '#o####.###.##.###.####o#',
      '#......................#',
      '#.####.##.######.##.###.',
      '#......##....##....##..#',
      '#.####.#####.#####.#####',
      '#......................#',
      '########################'
    ];

    canvas.width = MAP[0].length * tile;
    canvas.height = MAP.length * tile;

    const dots = MAP.map(r => r.split(''));
    let score = 0;
    let lives = 3;
    let gameOver = false;

    const pac = { x: 1, y: 1, dx: 1, dy: 0 };
    const ghosts = [
      { x: 20, y: 1, color: '#ef4444' },
      { x: 20, y: 8, color: '#ec4899' },
      { x: 2, y: 8, color: '#06b6d4' }
    ];

    const keys = {};
    const kd = e => keys[e.key] = true;
    const ku = e => keys[e.key] = false;
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    const wall = (x, y) => MAP[y]?.[x] === '#';

    let lastPac = 0;
    let lastGhost = 0;

    function resetPositions() {
      pac.x = 1; pac.y = 1;
      ghosts[0].x = 20; ghosts[0].y = 1;
      ghosts[1].x = 20; ghosts[1].y = 8;
      ghosts[2].x = 2; ghosts[2].y = 8;
    }

    function movePac() {
      if (keys['ArrowUp']) { pac.dx = 0; pac.dy = -1; }
      if (keys['ArrowDown']) { pac.dx = 0; pac.dy = 1; }
      if (keys['ArrowLeft']) { pac.dx = -1; pac.dy = 0; }
      if (keys['ArrowRight']) { pac.dx = 1; pac.dy = 0; }

      const nx = pac.x + pac.dx;
      const ny = pac.y + pac.dy;
      if (!wall(nx, ny)) {
        pac.x = nx;
        pac.y = ny;
      }

      if (dots[pac.y]?.[pac.x] === '.') {
        dots[pac.y][pac.x] = ' ';
        score += 10;
      }
    }

    function moveGhosts() {
      ghosts.forEach(g => {
        const dirs = [
          [1,0],[-1,0],[0,1],[0,-1]
        ].filter(([dx,dy]) => !wall(g.x + dx, g.y + dy));

        dirs.sort((a,b) => {
          const da = Math.abs((g.x+a[0])-pac.x)+Math.abs((g.y+a[1])-pac.y);
          const db = Math.abs((g.x+b[0])-pac.x)+Math.abs((g.y+b[1])-pac.y);
          return da - db;
        });

        const move = Math.random() < 0.6 ? dirs[0] : dirs[Math.floor(Math.random()*dirs.length)];
        if (move) {
          g.x += move[0];
          g.y += move[1];
        }

        if (g.x === pac.x && g.y === pac.y) {
          lives--;
          resetPositions();
          if (lives <= 0) gameOver = true;
        }
      });
    }

    
        function drawGhost(ctx, g, tile, t) {
          const x = g.x * tile;
          const y = g.y * tile;
          const bob = Math.sin(t / 120 + g.x) * 2;

          ctx.fillStyle = g.color;
          ctx.beginPath();
          ctx.arc(x + tile/2, y + tile/2 - 2 + bob, tile/2.3, Math.PI, 0);
          ctx.lineTo(x + tile - 2, y + tile - 2 + bob);

          const wave = Math.sin(t / 100) * 2;
          ctx.lineTo(x + tile*0.80, y + tile - 6 + wave + bob);
          ctx.lineTo(x + tile*0.60, y + tile - 2 - wave + bob);
          ctx.lineTo(x + tile*0.40, y + tile - 6 + wave + bob);
          ctx.lineTo(x + tile*0.20, y + tile - 2 - wave + bob);
          ctx.lineTo(x + 2, y + tile - 6 + wave + bob);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x + tile*0.38, y + tile*0.45 + bob, 4, 0, Math.PI*2);
          ctx.arc(x + tile*0.62, y + tile*0.45 + bob, 4, 0, Math.PI*2);
          ctx.fill();

          ctx.fillStyle = '#2563eb';
          const pupil = Math.sin(t / 200) * 1.5;
          ctx.beginPath();
          ctx.arc(x + tile*0.38 + pupil, y + tile*0.45 + bob, 2, 0, Math.PI*2);
          ctx.arc(x + tile*0.62 + pupil, y + tile*0.45 + bob, 2, 0, Math.PI*2);
          ctx.fill();
        }
        

        function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      MAP.forEach((row,y)=>{
        row.split('').forEach((c,x)=>{
          if (c === '#') {
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(x*tile,y*tile,tile,tile);
          }
          if (dots[y]?.[x] === '.') {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x*tile+tile/2,y*tile+tile/2,3,0,Math.PI*2);
            ctx.fill();
          }
        });
      });

      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(pac.x*tile+tile/2,pac.y*tile+tile/2,tile/2.3,0.2*Math.PI,1.8*Math.PI);
      ctx.lineTo(pac.x*tile+tile/2,pac.y*tile+tile/2);
      ctx.fill();

      ghosts.forEach(g=>{
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x*tile+tile/2,g.y*tile+tile/2,tile/2.3,0,Math.PI*2);
        ctx.fill();
      });

      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Pontos: ${score}   Vidas: ${lives}`,10,20);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,.7)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px sans-serif';
        ctx.fillText('GAME OVER', canvas.width/2-100, canvas.height/2);
        ctx.font = '18px sans-serif';
        ctx.fillText(`Pontuação: ${score}`, canvas.width/2-60, canvas.height/2+40);
      }
    }

    let anim;
    function loop(t) {
      if (!gameOver) {
        if (t - lastPac > 140) {
          movePac();
          lastPac = t;
        }
        if (t - lastGhost > 320) {
          moveGhosts();
          lastGhost = t;
        }
      }
      draw();
      anim = requestAnimationFrame(loop);
    }
    anim = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [open]);

  return (
    <>
      <button className="pacman-btn" onClick={() => setOpen(true)}>🎮 Jogar Pac‑Man</button>
      {open && (
        <div className="pacman-modal">
          <div className="pacman-box">
            <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      )}
    </>
  );
}
