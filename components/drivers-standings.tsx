'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Drivers, RaceResult } from './formula-zero-championship'
import { DriverProfile } from './driver-profile'

type DriversStandingsProps = {
  raceData: RaceResult[]
  drivers: Drivers
}

type DriverStanding = {
  driver: string
  points: number
  gap: number
}

export const DriversStandings = ({ raceData, drivers }: DriversStandingsProps) => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  
  // Výpočet bodů jezdců
  const driverStandings: DriverStanding[] = Object.entries(drivers).map(([driver]) => {
    // Spočítáme celkové body pro každého jezdce ze všech závodů
    const totalPoints = raceData.reduce((sum, race) => 
      sum + race.results[driver], 0
    )
    
    // Najdeme nejvyšší počet bodů pro výpočet rozdílu
    const maxTotalPoints = Math.max(
      ...Object.keys(drivers).map(d => 
        raceData.reduce((sum, race) => sum + race.results[d], 0)
      )
    )

    return {
      driver,
      points: totalPoints,
      gap: totalPoints === maxTotalPoints ? 0 : maxTotalPoints - totalPoints
    }
  }).sort((a, b) => b.points - a.points)

  return (
    <>
      <div className="h-[400px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {driverStandings.map(({ driver, points, gap }, index) => (
            <motion.div
              key={driver}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer"
              onClick={() => setSelectedDriver(driver)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: drivers[driver].color }}
                />
                <div>
                  <span className="font-bold">{driver}</span>
                  <span className="text-sm text-muted-foreground ml-2">({drivers[driver].team})</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <span className="font-bold">{points}</span>
                {gap > 0 && <span className="text-muted-foreground">-{gap}</span>}
                <span>{drivers[driver].kart}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {selectedDriver && (
        <DriverProfile
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          driverName={selectedDriver}
          driver={drivers[selectedDriver]}
          raceData={raceData}
        />
      )}
    </>
  )
} 