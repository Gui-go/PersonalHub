"use client";

import { useEffect, useRef, useState } from "react";

interface Score {
  name: string;
  score: number;
  distance: number;
  date: string;
}

type Building = {
  x: number;
  topHeight: number;
  width: number;
  bottomHeight: number;
};

const FlappyPlanePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedPlane, setSelectedPlane] = useState("/data/plane1.png");
  const [scores, setScores] = useState<Score[]>([]);

  const planeOptions = [
    { src: "/data/plane1.png", label: "Blue Plane" },
    { src: "/data/plane2.png", label: "Red Plane" },
    { src: "/data/plane3.png", label: "Green Plane" },
  ];

  const fetchScores = async () => {
    try {
      const response = await fetch("/api/highScores");
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      setScores(data.scores);
    } catch (error: any) {
      console.error("Error fetching scores:", error.message);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // ======= Preview Menu Animation =======
  useEffect(() => {
    if (gameStarted) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const planeImg = new Image();
    planeImg.src = selectedPlane;

    let x = 50;
    let y = 40;
    let dx = 1.5;

    const resizeCanvas = () => {
      canvas.width = 300;
      canvas.height = 100;
    };
    resizeCanvas();

    const drawSkyGradient = () => {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "#9ad0ff");
      g.addColorStop(1, "#87CEEB");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawClouds = () => {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(60, 30, 20, 0, Math.PI * 2);
      ctx.arc(90, 30, 25, 0, Math.PI * 2);
      ctx.arc(75, 40, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(200, 20, 15, 0, Math.PI * 2);
      ctx.arc(220, 25, 20, 0, Math.PI * 2);
      ctx.arc(210, 35, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSkyGradient();
      drawClouds();

      ctx.fillStyle = "#87a96b";
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

      if (planeImg.complete) {
        ctx.drawImage(planeImg, x, y - 20, 60, 40);
      }

      x += dx;
      if (x > canvas.width - 60 || x < 0) dx *= -1;

      requestAnimationFrame(animate);
    };

    animate();
  }, [selectedPlane, gameStarted]);

  // ======= Helper: Buildings =======
  const drawBuildingBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: { roof?: "flat" | "triangle"; windows?: boolean; direction?: "up" | "down" }
  ) => {
    const roof = options?.roof ?? "flat";
    const windows = options?.windows ?? true;

    ctx.fillStyle = "#3a3f4b";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#2f333c";
    ctx.fillRect(x + w - Math.max(4, Math.floor(w * 0.1)), y, Math.max(4, Math.floor(w * 0.1)), h);

    if (roof === "triangle") {
      ctx.fillStyle = "#2b2f37";
      ctx.beginPath();
      if (options?.direction === "down") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y - Math.min(12, w * 0.3));
        ctx.lineTo(x + w, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y - Math.min(12, w * 0.3));
        ctx.lineTo(x + w, y);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = "#2b2f37";
      ctx.fillRect(x, y - 2, w, 2);
    }

    // Antenna
    if (w >= 40 && h >= 80 && options?.direction !== "down") {
      ctx.fillStyle = "#2b2f37";
      const ax = x + w * 0.2;
      const ah = Math.min(15, h * 0.15);
      ctx.fillRect(ax, y - ah - 2, 2, ah);
      ctx.fillRect(ax - 3, y - ah - 2, 8, 2);
    }

    // Static windows
    if (windows) {
      const marginX = 6;
      const marginY = 8;
      const winW = 6;
      const winH = 8;
      const cols = Math.max(1, Math.floor((w - marginX * 2) / (winW + 4)));
      const rows = Math.max(1, Math.floor((h - marginY * 2) / (winH + 6)));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = (r + c) % 2 === 0;
          ctx.fillStyle = lit ? "#ffd76a" : "#1f232b";
          const wx = x + marginX + c * (winW + 4);
          const wy = y + marginY + r * (winH + 6);
          ctx.fillRect(wx, wy, winW, winH);
        }
      }
    }
  };

  const drawDistantSkyline = (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => {
    ctx.save();
    ctx.globalAlpha = 0.35;
    const baseY1 = height * 0.65;
    for (let x = -200 + (offset % 200); x < width + 200; x += 200) {
      const w = 140;
      const h = 120 + (x % 3) * 15;
      ctx.fillStyle = "#6e7a8a";
      ctx.fillRect(x, baseY1 - h, w, h);
    }
    ctx.globalAlpha = 0.5;
    const baseY2 = height * 0.72;
    for (let x = -150 + (offset % 150); x < width + 150; x += 150) {
      const w = 110;
      const h = 100 + (x % 2) * 20;
      ctx.fillStyle = "#5a6473";
      ctx.fillRect(x, baseY2 - h, w, h);
    }
    ctx.restore();
  };

  // ======= Game Loop =======
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const planeImg = new Image();
    planeImg.src = selectedPlane;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.style.margin = "0";
      document.body.style.overflow = "hidden";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let gravity = 0.25;
    let jump = -8;
    let buildingBaseWidth = 64;
    let gap = 300;
    let scrollSpeed = 1.5;
    let spawnEvery = 200;
    let currentScore = 0;
    let currentDistance = 0;

    const planeX = 80;
    const planeWidth = 60;
    const planeHeight = 40;

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let buildings: Building[] = [];
    let frame = 0;
    let gameOver = false;
    let difficulty = "Easy";
    let scoreSaved = false;
    let parallaxOffset = 0;

    const saveScore = async () => {
      if (!playerName.trim() || scoreSaved) return;
      scoreSaved = true;

      try {
        const response = await fetch("/api/highScores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: playerName,
            score: currentScore,
            distance: Math.floor(currentDistance),
            date: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        await fetchScores();
      } catch (error: any) {
        console.error("Error saving score:", error.message);
      }
    };

    const flap = () => {
      if (!gameOver) birdVelocity = jump;
    };

    const returnToMenu = () => {
      if (gameOver) {
        setGameStarted(false);
        setNameInput("");
        setPlayerName("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (gameOver) returnToMenu();
        else flap();
      } else if (e.code === "Escape") {
        if (gameOver) returnToMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", flap);

    const drawSkyWithClouds = () => {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "#9ad0ff");
      g.addColorStop(1, "#87CEEB");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(100, 80, 30, 0, Math.PI * 2);
      ctx.arc(140, 80, 35, 0, Math.PI * 2);
      ctx.arc(120, 100, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(500, 50, 20, 0, Math.PI * 2);
      ctx.arc(520, 60, 25, 0, Math.PI * 2);
      ctx.arc(510, 70, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const spawnBuildings = () => {
      const minMargin = 50;
      const maxTop = canvas.height - gap - minMargin;
      const topHeight = Math.random() * (maxTop - minMargin) + minMargin;
      const width = Math.max(50, Math.min(100, buildingBaseWidth + Math.floor(Math.random() * 30) - 15));
      const bottomHeight = canvas.height - (topHeight + gap);
      buildings.push({ x: canvas.width, topHeight, width, bottomHeight });
    };

    const drawGround = () => {
      ctx.fillStyle = "#6b8e23";
      ctx.fillRect(0, canvas.height - 18, canvas.width, 18);
      ctx.fillStyle = "#556b2f";
      ctx.fillRect(0, canvas.height - 22, canvas.width, 4);
    };

    const drawBuildings = () => {
      buildings.forEach((b) => {
        drawBuildingBlock(ctx, b.x, 0, b.width, b.topHeight, { roof: "triangle", windows: true, direction: "down" });
        drawBuildingBlock(ctx, b.x, canvas.height - b.bottomHeight, b.width, b.bottomHeight, {
          roof: "flat",
          windows: true,
          direction: "up",
        });
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSkyWithClouds();

      parallaxOffset += scrollSpeed * 0.4;
      drawDistantSkyline(ctx, canvas.width, canvas.height, parallaxOffset);

      if (frame % spawnEvery === 0) spawnBuildings();
      drawBuildings();
      buildings.forEach((b) => (b.x -= scrollSpeed));

      buildings = buildings.filter((b) => {
        if (b.x + b.width < 0) {
          currentScore++;
          return false;
        }
        return true;
      });

      if (planeImg.complete) {
        ctx.drawImage(planeImg, planeX - planeWidth / 2, birdY - planeHeight / 2, planeWidth, planeHeight);
      } else {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(planeX, birdY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      birdVelocity += gravity;
      birdY += birdVelocity;

      if (birdY + planeHeight / 2 >= canvas.height || birdY - planeHeight / 2 <= 0) gameOver = true;

      buildings.forEach((b) => {
        const planeRight = planeX + planeWidth / 2;
        const planeLeft = planeX - planeWidth / 2;
        const hitsHorizontally = planeRight > b.x && planeLeft < b.x + b.width;
        if (hitsHorizontally) {
          const gapTop = b.topHeight;
          const gapBottom = canvas.height - b.bottomHeight;
          const planeTop = birdY - planeHeight / 2;
          const planeBottom = birdY + planeHeight / 2;
          if (planeTop < gapTop || planeBottom > gapBottom) gameOver = true;
        }
      });

      if (frame % 300 === 0 && frame !== 0) {
        if (currentScore < 10) {
          difficulty = "Easy";
          gap = Math.max(250, gap - 5);
          scrollSpeed = Math.min(2.5, scrollSpeed + 0.05);
          gravity = Math.min(0.35, gravity + 0.005);
          spawnEvery = Math.max(120, spawnEvery - 2);
        } else if (currentScore < 20) {
          difficulty = "Medium";
          gap = Math.max(200, gap - 5);
          scrollSpeed = Math.min(3.5, scrollSpeed + 0.1);
          gravity = Math.min(0.45, gravity + 0.01);
          spawnEvery = Math.max(120, spawnEvery - 2);
        } else {
          difficulty = "Hard";
          gap = Math.max(150, gap - 5);
          scrollSpeed = Math.min(5, scrollSpeed + 0.1);
          gravity = Math.min(0.6, gravity + 0.01);
          spawnEvery = Math.max(120, spawnEvery - 2);
        }
      }

      ctx.fillStyle = "#fff";
      ctx.font = "28px Arial";
      ctx.fillText(`Score: ${currentScore}`, 20, 40);
      ctx.fillText(`Difficulty: ${difficulty}`, 20, 80);
      ctx.fillText(`Player: ${playerName || "Guest"}`, 20, 120);
      ctx.textAlign = "right";
      ctx.fillText(`Distance: ${Math.floor(currentDistance)}m`, canvas.width - 20, 40);
      ctx.textAlign = "left";

      drawGround();

      if (gameOver) {
        saveScore();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2 - 20);
        ctx.font = "24px Arial";
        ctx.fillText("Space/Esc to return to menu", canvas.width / 2 - 180, canvas.height / 2 + 30);
      } else {
        currentDistance += scrollSpeed / 2;
        frame++;
        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("click", flap);
    };
  }, [gameStarted, selectedPlane, playerName]);

  const handleStartGame = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setGameStarted(true);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white">
          <h1 className="text-4xl mb-6">Flappy Plane</h1>

          <div className="mb-4">
            <label htmlFor="playerName" className="block text-lg mb-2">
              Enter Your Name:
            </label>
            <input
              id="playerName"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="p-2 text-black rounded w-64"
              placeholder="Your name"
            />
          </div>

          <div className="mb-6 flex flex-col items-center">
            <p className="text-lg mb-2">Preview:</p>
            <canvas ref={previewCanvasRef} className="border border-gray-500 rounded" />
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">Choose Your Plane:</p>
            <div className="flex gap-4">
              {planeOptions.map((plane) => (
                <button
                  key={plane.src}
                  onClick={() => setSelectedPlane(plane.src)}
                  className={`p-2 rounded ${
                    selectedPlane === plane.src ? "bg-blue-500" : "bg-gray-500"
                  } hover:bg-blue-400 transition`}
                >
                  {plane.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">High Scores:</p>
            <div className="bg-gray-700 p-4 rounded w-96">
              {scores.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="pr-2">Name</th>
                      <th className="pr-2">Score</th>
                      <th className="pr-2">Distance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, index) => (
                      <tr key={index}>
                        <td className="pr-2">{score.name}</td>
                        <td className="pr-2">{score.score}</td>
                        <td className="pr-2">{score.distance}m</td>
                        <td>{new Date(score.date).toLocaleDateString("en-GB")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No scores yet</p>
              )}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!nameInput.trim()}
            className="px-6 py-3 bg-green-500 text-white rounded disabled:bg-gray-400 hover:bg-green-600 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      )}
    </div>
  );
};

export default FlappyPlanePage;
