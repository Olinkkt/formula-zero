'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Award, Users, TrendingUp, BarChart, ChevronDown, ChevronUp } from 'lucide-react'
import { Drivers, RaceResult } from './formula-zero-championship'

type TeamProfileProps = {
  isOpen: boolean
  onClose: () => void
  teamName: string
  drivers: Drivers
  raceData: RaceResult[]
}

export const TeamProfile = ({ 
  isOpen, 
  onClose, 
  teamName, 
  drivers, 
  raceData 
}: TeamProfileProps) => {
  const [showAllRaces, setShowAllRaces] = useState(false)
  
  // Získání jezdců týmu
  const teamDrivers = Object.entries(drivers)
    .filter(([_, driver]) => driver.team === teamName)
    .map(([name]) => name)
  
  // Výpočet celkových bodů týmu
  const totalPoints = teamDrivers.reduce((sum, driver) => 
    sum + raceData.reduce((driverSum, race) => 
      driverSum + race.results[driver], 0
    ), 0
  )
  
  // Výpočet bodů týmu v jednotlivých závodech
  const racePoints = raceData.map(race => {
    const points = teamDrivers.reduce((sum, driver) => 
      sum + race.results[driver], 0
    )
    
    return {
      race: race.race,
      points
    }
  })
  
  // Nejlepší závod týmu
  const bestRace = [...racePoints].sort((a, b) => b.points - a.points)[0]
  
  // Průměrné body na závod
  const averagePoints = totalPoints / raceData.length
  
  // Pozice týmu v jednotlivých závodech
  const positions = raceData.map(race => {
    // Spočítáme body všech týmů v tomto závodě
    const teamResults = Object.entries(drivers).reduce<Record<string, number>>((teams, [driver, { team }]) => {
      teams[team] = (teams[team] || 0) + race.results[driver]
      return teams
    }, {})
    
    // Seřadíme týmy podle bodů
    const sortedTeams = Object.entries(teamResults)
      .sort(([, a], [, b]) => b - a)
      .map(([team]) => team)
    
    return {
      race: race.race,
      position: sortedTeams.indexOf(teamName) + 1,
      points: teamResults[teamName]
    }
  })
  
  // Seřazení závodů od nejnovějších
  const sortedPositions = [...positions].reverse()
  
  // Zobrazení pouze posledních 5 závodů nebo všech
  const displayPositions = showAllRaces 
    ? sortedPositions 
    : sortedPositions.slice(0, 5)
  
  // Nejlepší umístění týmu
  const bestPosition = Math.min(...positions.map(p => p.position))
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{teamName}</span>
          </DialogTitle>
          <DialogDescription>
            Statistiky týmu v aktuální sezóně
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <h4 className="text-sm font-medium mb-2">Jezdci</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {teamDrivers.map((driver, index) => (
              <motion.div 
                key={driver}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-2 p-2 rounded-md bg-accent/20"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: drivers[driver].color }}
                />
                <span>{driver}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/30"
          >
            <TrendingUp className="w-5 h-5 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Celkem bodů</span>
            <span className="text-2xl font-bold">{totalPoints}</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/30"
          >
            <Award className="w-5 h-5 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Nejlepší umístění</span>
            <span className="text-2xl font-bold">{bestPosition}.</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/30"
          >
            <BarChart className="w-5 h-5 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Nejlepší závod</span>
            <span className="text-xl font-bold">{bestRace.race}</span>
            <span className="text-sm text-muted-foreground">({bestRace.points} bodů)</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/30"
          >
            <Users className="w-5 h-5 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Průměr na závod</span>
            <span className="text-2xl font-bold">{averagePoints.toFixed(1)}</span>
          </motion.div>
        </div>
        
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">
            {showAllRaces ? 'Všechny závody' : 'Posledních 5 závodů'}
          </h4>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {displayPositions.map((position, index) => (
                <motion.div 
                  key={position.race}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex justify-between items-center p-2 rounded-md bg-accent/20"
                >
                  <span>{position.race}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{position.position}. místo</span>
                    <span className="font-medium">{position.points} bodů</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {positions.length > 5 && (
            <motion.button
              onClick={() => setShowAllRaces(!showAllRaces)}
              className="w-full mt-3 p-2 flex items-center justify-center gap-1 text-sm rounded-md bg-accent/30 hover:bg-accent/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAllRaces ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Zobrazit méně</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Zobrazit všechny závody ({positions.length})</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 