import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import styled, { createGlobalStyle } from "styled-components";
import villageBackground from "./assets/village_background.jpg";

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    background-color: black; /* Ensures no white gaps */
    overflow: hidden; /* Prevents scrolling */
  }
`;

// Memoized Particle Background
const ParticleBackground = React.memo(() => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Loads only essential features for particles
    }).then(() => setInit(true));
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      number: { density: { enable: true }, value: 100 },
      color: { value: "#ffffff" },
      opacity: { value: 0.7, random: true },
      size: { value: { min: 1, max: 4 }, random: true },
      move: { enable: true, speed: 1.5, direction: "bottom", outModes: { default: "out" } },
      shape: { type: "circle" },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={particlesOptions}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
});

const App = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [borderState, setBorderState] = useState("normal");
  const [showRestart, setShowRestart] = useState(false);
  const [finalTime, setFinalTime] = useState(null); // To store timer value at success

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 || isSuccess) {
      setIsRunning(false);
      // Show restart button after 2 seconds
      setTimeout(() => setShowRestart(true), 2000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isSuccess]);

  useEffect(() => {
    const handleRefreshKey = (e) => {
      if (isRunning && (e.key === "F5" || (e.ctrlKey && e.key === "r"))) {
        e.preventDefault();
        alert("You cannot refresh the page while the timer is running.");
      }
    };

    window.addEventListener("keydown", handleRefreshKey);
    return () => window.removeEventListener("keydown", handleRefreshKey);
  }, [isRunning]);

  const handleStart = () => {
    setTimeLeft(90 * 60); // 1 hour 30 mins in seconds
    setIsRunning(true);
    setIsSuccess(false);
    setPassword("");
    setErrorMessage("");
    setBorderState("normal");
    setShowRestart(false);
    setFinalTime(null); // Reset final time
  };

  const handlePasswordSubmit = () => {
    if (password === "CMPY") {
      setIsSuccess(true);
      setFinalTime(timeLeft); // Save the timer value at success
      setBorderState("success");
    } else {
      setErrorMessage("Sorry, but you can't save Xmas with that password");
      setBorderState("failure");
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
    setBorderState("normal"); // Clear red hue on input change
  };

  const handleRestart = () => {
    window.location.reload(); // Reloads the page
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ParticleBackground />
        <Content $state={borderState}>
          {timeLeft === null ? (
            <>
              <Title>Escape Room App</Title>
              <Button onClick={handleStart}>Start Timer</Button>
            </>
          ) : (
            <>
              <FestiveTimer>
                {isSuccess ? formatTime(finalTime) : formatTime(timeLeft)}
              </FestiveTimer>
              {isSuccess && <SuccessMessage>Congratulations! You saved Xmas!!</SuccessMessage>}
              {timeLeft === 0 && !isSuccess && <h2>Time's up! You failed!</h2>}
              {timeLeft > 0 && !isSuccess && (
                <>
                  <Input
                    type="text"
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                  />
                  <Button onClick={handlePasswordSubmit}>Submit</Button>
                  {errorMessage && <Message>{errorMessage}</Message>}
                </>
              )}
              {showRestart && <RestartButton onClick={handleRestart}>Restart</RestartButton>}
            </>
          )}
        </Content>
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
  background: url(${villageBackground}) no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Content = styled.div`
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  padding: 20px 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;

  ${({ $state }) =>
    $state === "failure" &&
    `
    box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.8);
  `}

  ${({ $state }) =>
    $state === "success" &&
    `
    animation: greenGlow 2s infinite;
    @keyframes greenGlow {
      0%, 100% {
        box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.8);
      }
      50% {
        box-shadow: 0 0 25px 10px rgba(0, 255, 0, 0.5);
      }
    }
  `}
`;

const Title = styled.h1`
  color: #333;
  font-size: 1.8em;
`;

const FestiveTimer = styled.h1`
  font-size: 4em;
  color: #ffcc00;
  text-shadow: 0 0 15px red, 0 0 30px green;
`;

const Input = styled.input`
  font-size: 1em;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 24px);
`;

const Button = styled.button`
  font-size: 1em;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const RestartButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #1e7e34;
  }
`;

const Message = styled.p`
  font-size: 1.2em;
  color: red;
`;

const SuccessMessage = styled.h2`
  color: green;
  font-size: 1.5em;
`;

export default App;
