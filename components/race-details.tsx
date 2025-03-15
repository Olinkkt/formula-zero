'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog'
import { Trophy, Flag, Users } from 'lucide-react'
import { Drivers, RaceResult } from './formula-zero-championship'

type RaceDetailsProps = {
  isOpen: boolean
  onClose: () => void
  race: RaceResult
  drivers: Drivers
}

export const RaceDetails = ({ 
  isOpen, 
  onClose, 
  race, 
  drivers 
}: RaceDetailsProps) => {
  // Seřazení výsledků závodu
  const sortedResults = Object.entries(race.results)
    .sort(([, a], [, b]) => b - a)
    .map(([driver, points]) => ({
      driver,
      points,
      team: drivers[driver].team,
      color: drivers[driver].color
    }))
  
  // Získání vítěze
  const winner = sortedResults[0]
  
  // Získání týmových výsledků
  const teamResults = Object.entries(
    sortedResults.reduce<Record<string, number>>((teams, { team, points }) => {
      teams[team] = (teams[team] || 0) + points
      return teams
    }, {})
  ).sort(([, a], [, b]) => b - a)
  
  // Nejlepší tým
  const bestTeam = teamResults[0][0]
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-primary" />
            <span>{race.race}</span>
          </DialogTitle>
          <DialogDescription>
            Výsledky závodu
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-accent/30 h-full"
          >
            <Trophy className="w-5 h-5 text-primary" />
            <div className="mt-3 flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: winner.color }}
              />
              <span className="text-lg font-bold">{winner.driver}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Vítěz • </span>
              <span className="text-sm font-medium">{winner.points} bodů</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-accent/30 h-full"
          >
            <Users className="w-5 h-5 text-primary" />
            <span className="mt-3 text-lg font-bold">{bestTeam}</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Nejlepší tým • </span>
              <span className="text-sm font-medium">{teamResults[0][1]} bodů</span>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">Výsledky jezdců</h4>
          <div className="space-y-2">
            {sortedResults.map(({ driver, points, team, color }, index) => (
              <motion.div 
                key={driver}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex justify-between items-center p-2 rounded-md bg-accent/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium w-5 text-center">{index + 1}.</span>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span>{driver}</span>
                  <span className="text-xs text-muted-foreground">({team})</span>
                </div>
                <span className="font-medium">{points} bodů</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Výsledky týmů</h4>
          <div className="space-y-2">
            {teamResults.map(([team, points], index) => (
              <motion.div 
                key={team}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex justify-between items-center p-2 rounded-md bg-accent/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium w-5 text-center">{index + 1}.</span>
                  <span>{team}</span>
                </div>
                <span className="font-medium">{points} bodů</span>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 