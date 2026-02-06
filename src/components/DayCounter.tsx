import { useState, useEffect } from 'react'

interface DayCounterProps {
  startDate: string
}

function calcDays(start: string): number {
  const s = new Date(start + 'T00:00:00')
  const now = new Date()
  return Math.floor((now.getTime() - s.getTime()) / 86_400_000)
}

export default function DayCounter({ startDate }: DayCounterProps) {
  const [days, setDays] = useState(() => calcDays(startDate))

  useEffect(() => {
    // Actualizar una vez al día (o al minuto por si acaso)
    const id = setInterval(() => setDays(calcDays(startDate)), 60_000)
    return () => clearInterval(id)
  }, [startDate])

  return (
    <div className="day-counter">
      <span className="day-number">{days}</span>
      <span className="day-label">días juntos</span>
    </div>
  )
}
