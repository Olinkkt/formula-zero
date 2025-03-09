'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Flag, Trophy, Users, Activity } from 'lucide-react'
import { useTheme } from 'next-themes'

type Driver = {
  color: string
  team: string
  kart: string
}

type Drivers = {
  [key: string]: Driver
}

type RaceData = {
  race: string
  [key: string]: number | string
}

type DriverStanding = {
  driver: string
  points: number
  gap: number
}

type TeamStanding = {
  team: string
  points: number
  gap: number
}

type Standings = {
  drivers: DriverStanding[]
  constructors: TeamStanding[]
}

type Race = {
  name: string
  status: 'upcoming' | 'completed'
}

type RaceResult = {
  race: string
  results: Record<string, number> // body z daného závodu
}

const nextRace: Race = {
  name: "Hungarian Grand Prix",
  status: "upcoming"
}

const FormulaZeroChampionship = () => {
  const [focusedDriver, setFocusedDriver] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('progress')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [timeLeft, setTimeLeft] = useState<string>('')

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

  const currentPoints: Standings = {
    drivers: Object.entries(drivers).map(([driver]) => {
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
    }).sort((a, b) => b.points - a.points),
    
    constructors: Object.entries(
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
  }

  type CustomTooltipProps = {
    active?: boolean
    payload?: Array<{
      name: string
      value: number
      color: string
    }>
    label?: string
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-background border rounded p-2 shadow-lg"
        >
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </motion.div>
      )
    }
    return null
  }

  type CustomLegendProps = {
    payload?: Array<{
      value: string
      color: string
      type?: string
      id?: string
    }>
  }

  const CustomLegend = ({ payload }: CustomLegendProps) => {
    if (!payload) return null
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {payload.map((entry, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all
              ${focusedDriver === entry.value ? 'bg-accent' : 'hover:bg-accent/50'}`}
            onMouseEnter={() => setFocusedDriver(entry.value)}
            onMouseLeave={() => setFocusedDriver(null)}
          >
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: drivers[entry.value]?.color }}
            />
            <div>
              <div className="font-medium">{entry.value}</div>
              <div className="text-xs text-muted-foreground">
                {drivers[entry.value]?.team}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Get min and max points for better Y-axis scaling
  const allPoints = raceData.flatMap(race => 
    Object.values(race.results)
  )
  const minPoints = Math.floor(Math.min(...allPoints))
  const maxPoints = Math.ceil(Math.max(...allPoints) * 1.1) // Add 10% padding at the top

  // Funkce pro výpočet kumulativních bodů
  const calculateTotalPoints = (races: RaceResult[], upToIndex: number) => {
    const totals: Record<string, number> = {}
    
    for (let i = 0; i <= upToIndex; i++) {
      const race = races[i]
      Object.entries(race.results).forEach(([driver, points]) => {
        totals[driver] = (totals[driver] || 0) + points
      })
    }
    
    return totals
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
            Příští závod: <span className="font-medium">{nextRace.name}</span>
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
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={raceData.map((race, index) => ({
                          race: race.race,
                          ...calculateTotalPoints(raceData, index)
                        }))}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="race" 
                          tick={{ fill: 'currentColor' }}
                          tickLine={{ stroke: 'currentColor' }}
                          padding={{ left: 20, right: 20 }}
                        />
                        <YAxis 
                          domain={[0, maxPoints]}
                          tick={{ fill: 'currentColor' }}
                          tickLine={{ stroke: 'currentColor' }}
                          label={{ value: 'Body', angle: -90, position: 'insideLeft', fill: 'currentColor', offset: -5 }}
                          padding={{ top: 20, bottom: 20 }}
                          tickCount={10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        {Object.entries(drivers).map(([driver, { color }]) => (
                          <Line
                            key={driver}
                            type="monotone"
                            dataKey={driver}
                            stroke={color}
                            strokeWidth={focusedDriver === driver ? 4 : 2}
                            dot={{ r: 4, fill: color }}
                            activeDot={{ r: 8 }}
                            opacity={focusedDriver ? (focusedDriver === driver ? 1 : 0.2) : 1}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
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
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {currentPoints.drivers.map(({ driver, points, gap }, index) => (
                        <motion.div
                          key={driver}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
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
                  </ScrollArea>
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
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {currentPoints.constructors.map(({ team, points, gap }, index) => (
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

