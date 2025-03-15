'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity } from 'lucide-react'
import { Drivers, RaceResult } from './formula-zero-championship'

type TeamStandingsProps = {
  raceData: RaceResult[]
  drivers: Drivers
}

type TeamStanding = {
  team: string
  points: number
  gap: number
}

export const TeamStandings = ({ raceData, drivers }: TeamStandingsProps) => {
  // Výpočet bodů týmů
  const teamStandings: TeamStanding[] = Object.entries(
    // Spočítáme body pro každý tým
    Object.entries(drivers).reduce<Record<string, number>>((teams, [driver, { team }]) => {
      // Sečteme body jezdce ze všech závodů
      const driverPoints = raceData.reduce((sum, race) => 
        sum + race.results[driver], 0
      )
      teams[team] = (teams[team] || 0) + driverPoints
      return teams
    }, {})
  )
  .sort(([, a], [, b]) => b - a)
  .map(([team, points], index, array) => ({
    team,
    points,
    gap: index === 0 ? 0 : array[0][1] - points
  }))

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {teamStandings.map(({ team, points, gap }, index) => (
          <motion.div
            key={team}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
          >
            <div className="flex items-center gap-3">
              <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </Badge>
              <span className="font-bold">{team}</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="font-bold">{points}</span>
              {gap > 0 && <span className="text-muted-foreground">-{gap}</span>}
              <Activity className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
} 