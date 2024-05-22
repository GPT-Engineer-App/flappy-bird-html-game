import { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";
import { FaPlay, FaRedo } from "react-icons/fa";

const BIRD_SIZE = 20;
const GRAVITY = 2;
const JUMP_HEIGHT = 50;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(300);
  const [obstacleLeft, setObstacleLeft] = useState(window.innerWidth);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleStart = () => {
    setGameHasStarted(true);
    setIsGameOver(false);
    setBirdPosition(250);
    setObstacleLeft(window.innerWidth);
    setScore(0);
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleJump = () => {
    if (!gameHasStarted) return;
    setBirdPosition((prev) => Math.max(prev - JUMP_HEIGHT, 0));
  };

  useEffect(() => {
    let timeId;
    if (gameHasStarted && !isGameOver) {
      timeId = setInterval(() => {
        setBirdPosition((prev) => Math.min(prev + GRAVITY, window.innerHeight - BIRD_SIZE));
        setObstacleLeft((prev) => {
          if (prev >= -OBSTACLE_WIDTH) {
            return prev - 5;
          } else {
            setObstacleHeight(Math.floor(Math.random() * (window.innerHeight - OBSTACLE_GAP)));
            setScore((prev) => prev + 1);
            return window.innerWidth;
          }
        });
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [gameHasStarted, isGameOver]);

  useEffect(() => {
    const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle = birdPosition <= window.innerHeight && birdPosition >= window.innerHeight - (window.innerHeight - OBSTACLE_GAP - obstacleHeight);
    const hasCollidedWithObstacle = obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle);

    if (hasCollidedWithObstacle || birdPosition >= window.innerHeight - BIRD_SIZE) {
      setIsGameOver(true);
      setGameHasStarted(false);
    }
  }, [birdPosition, obstacleHeight, obstacleLeft]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Ñañi Ñird</Text>
        <Box position="relative" width="100%" height="500px" bg="pink.100" overflow="hidden" onClick={handleJump}>
          <Box position="absolute" top={`${birdPosition}px`} left="50px" width={`${BIRD_SIZE}px`} height={`${BIRD_SIZE}px`} bg="purple.400" borderRadius="50%" />
          <Box position="absolute" top="0" left={`${obstacleLeft}px`} width={`${OBSTACLE_WIDTH}px`} height={`${obstacleHeight}px`} bg="green.500" />
          <Box position="absolute" top={`${obstacleHeight + OBSTACLE_GAP}px`} left={`${obstacleLeft}px`} width={`${OBSTACLE_WIDTH}px`} height={`${window.innerHeight - obstacleHeight - OBSTACLE_GAP}px`} bg="green.500" />
        </Box>
        <Text fontSize="xl">Score: {score}</Text>
        {!gameHasStarted && !isGameOver && (
          <Button leftIcon={<FaPlay />} colorScheme="teal" onClick={handleStart}>
            Start
          </Button>
        )}
        {isGameOver && (
          <Button leftIcon={<FaRedo />} colorScheme="red" onClick={handleRestart}>
            Restart
          </Button>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
