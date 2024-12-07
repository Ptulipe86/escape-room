import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 50px;
  font-family: Arial, sans-serif;
  background: linear-gradient(to bottom, #e0f7fa, #b2ebf2);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
`;

const TimeDisplay = styled.h2`
  font-size: 2em;
  margin: 20px 0;
`;

const Input = styled.input`
  font-size: 1em;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

const Message = styled.p`
  font-size: 1.2em;
  color: red;
`;

const SuccessMessage = styled.h2`
  color: green;
  font-size: 1.5em;
`;

const snowflakeAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
`;

const Snowflake = styled.div`
  position: fixed;
  top: ${(Math.random() * 100).toFixed(2)}%;
  left: ${(Math.random() * 100).toFixed(2)}%;
  width: 10px;
  height: 10px;
  background: url('https://upload.wikimedia.org/wikipedia/commons/d/d6/Snowflake_sample_2.png') no-repeat center center;
  background-size: contain;
  animation: ${snowflakeAnimation} ${(Math.random() * 5 + 2).toFixed(2)}s infinite;
  z-index: 1; /* Ensures snowflakes appear on top of other elements */
`;

const App = () => {
  const [timeLeft, setTimeLeft] = useState(null); // Time left in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [password, setPassword] = useState(""); // Input value
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

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
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(90 * 60); // 1 hour 30 mins in seconds
    setIsRunning(true);
    setIsSuccess(false); // Reset success state
    setPassword(""); // Clear the input field
    setErrorMessage(""); // Clear error message
  };

  const handlePasswordSubmit = () => {
    if (password === "CMPY") {
      setIsSuccess(true);
      setIsRunning(false);
    } else {
      setErrorMessage("Sorry, but you can't save Xmas with that password");
    }
  };

  return (
    <Container>
      <Title>Escape Room App</Title>
      {timeLeft === null ? (
        <Button onClick={handleStart}>Start Timer</Button>
      ) : (
        <>
          <TimeDisplay>Time Left: {formatTime(timeLeft)}</TimeDisplay>
          {timeLeft > 0 && !isSuccess && (
            <>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <Button onClick={handlePasswordSubmit}>Submit</Button>
              {errorMessage && <Message>{errorMessage}</Message>}
            </>
          )}
        </>
      )}
      {timeLeft === 0 && !isSuccess && <h2>Time's up! You failed!</h2>}
      {isSuccess && <SuccessMessage>Congratulations! You saved Xmas!!</SuccessMessage>}
      {isSuccess &&
        Array.from({ length: 30 }).map((_, i) => (
          <Snowflake key={i} />
        ))}
    </Container>
  );
};

export default App;
