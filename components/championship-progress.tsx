'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Drivers, RaceResult } from './formula-zero-championship'

type ChampionshipProgressProps = {
  raceData: RaceResult[]
  drivers: Drivers
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

type CustomLegendProps = {
  payload?: Array<{
    value: string
    color: string
    type?: string
    id?: string
  }>
}

export const ChampionshipProgress = ({ raceData, drivers }: ChampionshipProgressProps) => {
  const [focusedDriver, setFocusedDriver] = useState<string | null>(null)

  // Get min and max points for better Y-axis scaling
  const allPoints = raceData.flatMap(race => 
    Object.values(race.results)
  )
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

  return (
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
  )
} 