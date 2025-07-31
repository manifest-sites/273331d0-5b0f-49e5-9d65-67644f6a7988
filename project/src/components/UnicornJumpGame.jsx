import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Card } from 'antd'

const UnicornJumpGame = () => {
  const [unicornY, setUnicornY] = useState(100) // Starting position higher up
  const [velocityY, setVelocityY] = useState(0)
  const [isOnGround, setIsOnGround] = useState(true)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('unicornHighScore') || '0')
  })
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  
  const animationRef = useRef()
  const groundLevel = 350
  const gravity = 0.2
  const jumpPower = -15

  const startGame = () => {
    setUnicornY(100) // Start much higher up for more gameplay time
    setVelocityY(0)
    setIsOnGround(false) // Start in air so player can click to jump
    setScore(0)
    setGameActive(true)
    setGameOver(false)
  }

  const jumpUnicorn = useCallback(() => {
    if (!gameActive || gameOver) return
    
    setVelocityY(jumpPower)
    setIsOnGround(false)
    setScore(prev => prev + 1)
  }, [gameActive, gameOver])

  useEffect(() => {
    if (!gameActive || gameOver) return

    const gameLoop = () => {
      setUnicornY(prevY => {
        const newY = prevY + velocityY
        
        // Check if unicorn hits the ground
        if (newY >= groundLevel) {
          setIsOnGround(true)
          setGameActive(false)
          setGameOver(true)
          
          // Update high score
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('unicornHighScore', score.toString())
          }
          
          return groundLevel
        }
        
        return newY
      })

      setVelocityY(prevVelocity => prevVelocity + gravity)
      
      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameActive, gameOver, velocityY, score, highScore])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-green-400 p-4">
      <Card className="w-full max-w-4xl">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">🦄 Unicorn Jump Game</h1>
          <p className="text-gray-600 mb-4">Click the unicorn to make it jump! Get as many jumps as possible before it hits the ground!</p>
          
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-500">Current Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{highScore}</div>
              <div className="text-sm text-gray-500">High Score</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-green-200 border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-12 bg-green-500 border-t-2 border-green-600"></div>
          
          {/* Clouds */}
          <div className="absolute top-4 left-10 text-4xl">☁️</div>
          <div className="absolute top-8 right-20 text-3xl">☁️</div>
          <div className="absolute top-2 left-1/2 text-2xl">☁️</div>
          
          {/* Unicorn */}
          <div
            className={`absolute cursor-pointer transform transition-transform duration-100 ${!isOnGround ? 'scale-110' : 'scale-100'}`}
            style={{
              left: '50%',
              top: `${unicornY}px`,
              transform: 'translateX(-50%)',
              fontSize: '3rem',
              userSelect: 'none'
            }}
            onClick={jumpUnicorn}
          >
            🦄
          </div>
          
          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
                <p className="text-lg mb-2">Final Score: {score}</p>
                {score === highScore && score > 0 && (
                  <p className="text-lg font-bold text-purple-600 mb-4">🎉 New High Score! 🎉</p>
                )}
                <Button type="primary" size="large" onClick={startGame}>
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="text-center">
          {!gameActive && !gameOver && (
            <Button type="primary" size="large" onClick={startGame} className="mb-4">
              Start Game
            </Button>
          )}
          
          {gameActive && (
            <div className="text-sm text-gray-600">
              Click the unicorn to jump! Each click in the air gives you a point.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default UnicornJumpGame