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
import { Award, Flag, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Driver, RaceResult } from './formula-zero-championship'

type DriverProfileProps = {
  isOpen: boolean
  onClose: () => void
  driverName: string
  driver: Driver
  raceData: RaceResult[]
}

export const DriverProfile = ({ 
  isOpen, 
  onClose, 
  driverName, 
  driver, 
  raceData 
}: DriverProfileProps) => {
  const [showAllRaces, setShowAllRaces] = useState(false)
  
  // Výpočet statistik jezdce
  const totalPoints = raceData.reduce((sum, race) => 
    sum + race.results[driverName], 0
  )
  
  const bestResult = Math.max(...raceData.map(race => race.results[driverName]))
  
  const bestRace = raceData.find(race => 
    race.results[driverName] === bestResult
  )?.race || ''
  
  const averagePoints = totalPoints / raceData.length
  
  // Získání pozic v jednotlivých závodech
  const positions = raceData.map(race => {
    const results = Object.entries(race.results)
      .sort(([, a], [, b]) => b - a)
      .map(([driver]) => driver)
    
    return {
      race: race.race,
      position: results.indexOf(driverName) + 1
    }
  })
  
  // Seřazení závodů od nejnovějších
  const sortedPositions = [...positions].reverse()
  
  // Zobrazení pouze posledních 5 závodů nebo všech
  const displayPositions = showAllRaces 
    ? sortedPositions 
    : sortedPositions.slice(0, 5)
  
  const bestPosition = Math.min(...positions.map(p => p.position))
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-5 h-5 rounded-full" 
              style={{ backgroundColor: driver.color }}
            />
            <div className="flex items-center">
              <span className="font-semibold">{driverName}</span>
              <span className="text-sm text-muted-foreground ml-2 self-center">({driver.team})</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Statistiky jezdce v aktuální sezóně
          </DialogDescription>
        </DialogHeader>
        
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
            <Flag className="w-5 h-5 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Nejlepší závod</span>
            <span className="text-xl font-bold">{bestRace}</span>
            <span className="text-sm text-muted-foreground">({bestResult} bodů)</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/30"
          >
            <Clock className="w-5 h-5 mb-2 text-primary" />
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
              {displayPositions.map((position, index) => {
                const raceIndex = showAllRaces 
                  ? raceData.length - 1 - index 
                  : raceData.length - 1 - index
                
                return (
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
                      <span className="font-medium">{raceData[raceIndex].results[driverName]} bodů</span>
                    </div>
                  </motion.div>
                )
              })}
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