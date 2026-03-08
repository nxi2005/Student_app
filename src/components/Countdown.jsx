import { useState, useEffect } from 'react';

export default function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!deadline) return;
      
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate - now;

      if (diff <= 0) {
        return 'Rok je istekao';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);

      return parts.length > 0 ? parts.join(' ') : '< 1m';
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline || !timeLeft) return null;

  return <small className="countdown">Vrijeme do roka: {timeLeft}</small>;
}
