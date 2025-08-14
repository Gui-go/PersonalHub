"use client";

import { useEffect, useRef, useState } from "react";

interface Score {
  name: string;
  score: number;
  distance: number;
  date: string;
}

const FlappyPlanePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedPlane, setSelectedPlane] = useState("/data/plane1.png");
  const [scores, setScores] = useState<Score[]>([]);

  // Fetch top scores from Firestore
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

  const planeOptions = [
    { src: "/data/plane1.png", label: "Blue Plane" },
    { src: "/data/plane2.png", label: "Red Plane" },
    { src: "/data/plane3.png", label: "Green Plane" },
  ];

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
    let pipeWidth = 60;
    let pipeGap = 300;
    let pipeSpeed = 1.5;
    let pipeFrequency = 200;
    let currentScore = 0;
    let currentDistance = 0;

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let pipes: { x: number; height: number }[] = [];
    let frame = 0;
    let gameOver = false;
    let difficulty = "Easy";
    let scoreSaved = false;

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
        if (gameOver) {
          returnToMenu();
        } else {
          flap();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", flap);

    const gameLoop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add pipes
      if (frame % pipeFrequency === 0) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, height: pipeHeight });
      }

      // Draw pipes
      ctx.fillStyle = "#228B22";
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height - pipe.height - pipeGap);
        pipe.x -= pipeSpeed;
      });

      // Remove passed pipes & increase score
      pipes = pipes.filter((pipe) => {
        if (pipe.x + pipeWidth < 0) {
          currentScore++;
          return false;
        }
        return true;
      });

      // Draw plane
      const planeWidth = 60;
      const planeHeight = 40;
      if (planeImg.complete) {
        ctx.drawImage(planeImg, 80 - planeWidth / 2, birdY - planeHeight / 2, planeWidth, planeHeight);
      } else {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(80, birdY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Physics
      birdVelocity += gravity;
      birdY += birdVelocity;

      // Collision
      if (birdY + planeHeight / 2 >= canvas.height || birdY - planeHeight / 2 <= 0) gameOver = true;
      pipes.forEach((pipe) => {
        if (
          80 + planeWidth / 2 > pipe.x &&
          80 - planeWidth / 2 < pipe.x + pipeWidth &&
          (birdY - planeHeight / 2 < pipe.height || birdY + planeHeight / 2 > pipe.height + pipeGap)
        ) {
          gameOver = true;
        }
      });

      // Difficulty scaling
      if (frame % 300 === 0 && frame !== 0) {
        if (currentScore < 10) {
          difficulty = "Easy";
          pipeGap = Math.max(250, pipeGap - 5);
          pipeSpeed = Math.min(2.5, pipeSpeed + 0.05);
          gravity = Math.min(0.35, gravity + 0.005);
          pipeFrequency = Math.max(120, pipeFrequency - 2);
        } else if (currentScore < 20) {
          difficulty = "Medium";
          pipeGap = Math.max(200, pipeGap - 5);
          pipeSpeed = Math.min(3.5, pipeSpeed + 0.1);
          gravity = Math.min(0.45, gravity + 0.01);
          pipeFrequency = Math.max(120, pipeFrequency - 2);
        } else {
          difficulty = "Hard";
          pipeGap = Math.max(150, pipeGap - 5);
          pipeSpeed = Math.min(5, pipeSpeed + 0.1);
          gravity = Math.min(0.6, gravity + 0.01);
          pipeFrequency = Math.max(120, pipeFrequency - 2);
        }
      }

      // HUD
      ctx.fillStyle = "#fff";
      ctx.font = "28px Arial";
      ctx.fillText(`Score: ${currentScore}`, 20, 40);
      ctx.fillText(`Difficulty: ${difficulty}`, 20, 80);
      ctx.fillText(`Player: ${playerName || "Guest"}`, 20, 120);
      ctx.textAlign = "right";
      ctx.fillText(`Distance: ${Math.floor(currentDistance)}m`, canvas.width - 20, 40);
      ctx.textAlign = "left";

      // Game over screen
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
        currentDistance += pipeSpeed / 2;
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
