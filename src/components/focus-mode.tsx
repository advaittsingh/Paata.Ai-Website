"use client";

import { useState, useEffect, useRef } from 'react';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';

interface FocusModeProps {
  initialDuration?: number;
}

export function FocusMode({ initialDuration = 25 }: FocusModeProps) {
  const { user } = useUser();
  const [duration, setDuration] = useState(initialDuration);
  const [remaining, setRemaining] = useState(initialDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);
    setRemaining(duration * 60);

    if (user) {
      try {
        const response = await fetch('/api/focus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration,
            mode: 'focus',
            userId: user.id
          })
        });
        const data = await response.json();
        if (data.success && data.session) {
          setSessionId(data.session.id);
        }
      } catch (error) {
        console.error('Error creating focus session:', error);
      }
    }
  };

  const handleComplete = async () => {
    if (user && sessionId) {
      try {
        await fetch('/api/focus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sessionId,
            status: 'completed'
          })
        });
      } catch (error) {
        console.error('Error completing focus session:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardBody className="text-center">
        <Typography variant="h4" className="mb-4" color="blue-gray">
          Focus Mode
        </Typography>
        {!isActive && (
          <div className="mb-4">
            <Typography variant="h6" className="mb-2" color="gray">
              Set Focus Duration
            </Typography>
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant={duration === 15 ? 'filled' : 'outlined'}
                onClick={() => setDuration(15)}
                className={duration === 15 ? 'bg-[#612A74]' : ''}
                size="sm"
              >
                15 min
              </Button>
              <Button
                variant={duration === 25 ? 'filled' : 'outlined'}
                onClick={() => setDuration(25)}
                className={duration === 25 ? 'bg-[#612A74]' : ''}
                size="sm"
              >
                25 min
              </Button>
              <Button
                variant={duration === 45 ? 'filled' : 'outlined'}
                onClick={() => setDuration(45)}
                className={duration === 45 ? 'bg-[#612A74]' : ''}
                size="sm"
              >
                45 min
              </Button>
            </div>
          </div>
        )}
        <div className="mb-6">
          <Typography variant="h1" className="text-7xl font-bold text-[#612A74]">
            {formatTime(remaining)}
          </Typography>
        </div>
        <div className="flex gap-2 justify-center">
          {!isActive && (
            <Button onClick={handleStart} className="bg-[#612A74] px-8" size="lg">
              <i className="fa-solid fa-play mr-2"></i>
              Start Focus Session
            </Button>
          )}
          {isActive && (
            <>
              <Button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-[#612A74] px-6"
                size="lg"
              >
                <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => {
                  setIsActive(false);
                  setRemaining(duration * 60);
                  setIsPaused(false);
                }}
                variant="outlined"
                size="lg"
              >
                <i className="fa-solid fa-stop mr-2"></i>
                Stop
              </Button>
            </>
          )}
        </div>
        {isActive && !isPaused && (
          <Typography className="text-sm text-green-600 mt-4">
            Focus session in progress
          </Typography>
        )}
        {isPaused && (
          <Typography className="text-sm text-yellow-600 mt-4">
            Session paused
          </Typography>
        )}
      </CardBody>
    </Card>
  );
}
