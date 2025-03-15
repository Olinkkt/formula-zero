'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Flag, Trophy, Users } from 'lucide-react'
import { useTheme } from 'next-themes'

// Importy nových komponent
import { ChampionshipProgress } from '@/components/championship-progress'
import { DriversStandings } from '@/components/drivers-standings'
import { TeamStandings } from '@/components/team-standings'
import { NextRace } from '@/components/next-race'

// Typy
export type Driver = {
  color: string
  team: string
  kart: string
}

export type Drivers = {
  [key: string]: Driver
}

export type RaceResult = {
  race: string
  results: Record<string, number> // body z daného závodu
}

export type Race = {
  name: string
  status: 'upcoming' | 'completed'
}

const nextRace: Race = {
  name: "Belgium Grand Prix",
  status: "upcoming"
}

const FormulaZeroChampionship = () => {
  const [selectedTab, setSelectedTab] = useState('progress')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const raceData: RaceResult[] = [
    {
      race: 'Brazílie',
      results: {
        Dominik: 11,
        Macim: 6,
        Kuba: 4,
        Olda: 8,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Imola',
      results: {
        Dominik: 11,
        Macim: 4,
        Kuba: 8,
        Olda: 6,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Monako',
      results: {
        Dominik: 11,
        Macim: 6,
        Kuba: 8,
        Olda: 4,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Katalánsko',
      results: {
        Dominik: 10,
        Macim: 8,
        Kuba: 7,
        Olda: 4,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Kanada',
      results: {
        Dominik: 5,
        Macim: 10,
        Kuba: 8,
        Olda: 6,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Great Britain',
      results: {
        Dominik: 11,
        Macim: 8,
        Kuba: 6,
        Olda: 4,
        Dan: 2,
        Míra: 1,
      }
    },
    {
      race: 'Hungary',
      results: {
        Dominik: 10,
        Macim: 8,
        Kuba: 7,
        Olda: 4,
        Dan: 2,
        Míra: 1,
      }
    }
  ]

  const drivers: Drivers = {
    Dominik: { color: '#FF1E1E', team: 'McLaren', kart: '🏎️' },
    Macim: { color: '#FF8700', team: 'McLaren', kart: '🏎️' },
    Kuba: { color: '#0075FF', team: 'Porsche', kart: '🏎️' },
    Olda: { color: '#00A3FF', team: 'Porsche', kart: '🏎️' },
    Dan: { color: '#DC0000', team: 'Scuderia Ferrari', kart: '🏎️' },
    Míra: { color: '#B80000', team: 'Scuderia Ferrari', kart: '🏎️' }
  }

  if (!mounted) return null

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary inline-block"
            >
              🏁 Sezóna 2024/25 🏁
            </motion.span>
          </CardTitle>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            <NextRace race={nextRace} />
          </motion.div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-accent/50 transition-colors"
            aria-label={theme === 'dark' ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="progress">
              <Flag className="w-4 h-4 mr-2" />
              Průběh
            </TabsTrigger>
            <TabsTrigger value="drivers">
              <Trophy className="w-4 h-4 mr-2" />
              Jezdci
            </TabsTrigger>
            <TabsTrigger value="constructors">
              <Users className="w-4 h-4 mr-2" />
              Týmy
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait" initial={false}>
            {selectedTab === "progress" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <TabsContent value="progress">
                  <ChampionshipProgress raceData={raceData} drivers={drivers} />
                </TabsContent>
              </motion.div>
            )}
            {selectedTab === "drivers" && (
              <motion.div
                key="drivers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <TabsContent value="drivers">
                  <DriversStandings raceData={raceData} drivers={drivers} />
                </TabsContent>
              </motion.div>
            )}
            {selectedTab === "constructors" && (
              <motion.div
                key="constructors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <TabsContent value="constructors">
                  <TeamStandings raceData={raceData} drivers={drivers} />
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default FormulaZeroChampionship