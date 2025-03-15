'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts'
import { Drivers, RaceResult } from './formula-zero-championship'
import { RaceDetails } from './race-details'

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

type CustomDotProps = {
  cx: number
  cy: number
  stroke: string
  strokeWidth: number
  index: number
  dataKey: string
  value: number
  payload: any
}

export const ChampionshipProgress = ({ raceData, drivers }: ChampionshipProgressProps) => {
  const [focusedDriver, setFocusedDriver] = useState<string | null>(null)
  const [selectedRaceIndex, setSelectedRaceIndex] = useState<number | null>(null)
  
  // Příprava dat pro graf
  const chartData = raceData.map((race, index) => {
    // Spočítáme kumulativní body pro každého jezdce
    const driverPoints = Object.entries(drivers).reduce<Record<string, number>>((acc, [driver]) => {
      // Sečteme body ze všech předchozích závodů včetně aktuálního
      acc[driver] = raceData
        .slice(0, index + 1)
        .reduce((sum, r) => sum + r.results[driver], 0)
      return acc
    }, {})
    
    return {
      name: race.race,
      index,
      ...driverPoints
    }
  })
  
  // Vlastní tooltip pro graf
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null
    
    return (
      <div className="bg-background/90 backdrop-blur-sm border border-border/40 rounded-md p-3 shadow-sm">
        <p className="font-medium text-sm mb-1">{label}</p>
        <div className="space-y-2 mt-2">
          {payload
            .sort((a, b) => (b.value || 0) - (a.value || 0))
            .slice(0, 3) // Zobrazíme jen první 3 jezdce pro minimalistický vzhled
            .map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">{entry.name}</span>
                <span className="text-sm font-medium ml-auto">{entry.value}</span>
              </div>
            ))
          }
        </div>
        {payload.length > 3 && (
          <p className="text-xs text-muted-foreground mt-2">+{payload.length - 3} dalších</p>
        )}
      </div>
    )
  }
  
  // Vlastní legenda pro graf
  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {Object.entries(drivers).map(([driver, { color }]) => (
          <div 
            key={driver}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs cursor-pointer transition-all ${
              focusedDriver === driver ? 'bg-accent/70' : 'hover:bg-accent/30'
            }`}
            onClick={() => setFocusedDriver(focusedDriver === driver ? null : driver)}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span>{driver}</span>
          </div>
        ))}
      </div>
    )
  }
  
  // Vlastní bod pro graf s možností kliknutí
  const CustomDot = (props: CustomDotProps) => {
    const { cx, cy, stroke, index, payload } = props
    
    const isHovered = payload.index === selectedRaceIndex
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 4 : 2}
        stroke={isHovered ? stroke : 'transparent'}
        strokeWidth={isHovered ? 1 : 0}
        fill={stroke}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedRaceIndex(payload.index)}
      />
    )
  }
  
  // Vlastní aktivní bod pro graf
  const CustomActiveDot = (props: any) => {
    const { cx, cy, stroke, payload } = props
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        stroke={stroke}
        strokeWidth={1}
        fill={stroke}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedRaceIndex(payload.index)}
      />
    )
  }
  
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onClick={(data) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setSelectedRaceIndex(data.activeTooltipIndex)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            tickMargin={8}
            axisLine={{ strokeOpacity: 0.3 }}
            tickLine={{ strokeOpacity: 0.3 }}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            tickMargin={8}
            tickCount={8}
            axisLine={{ strokeOpacity: 0.3 }}
            tickLine={{ strokeOpacity: 0.3 }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ strokeOpacity: 0.3, strokeDasharray: '4 4' }}
          />
          <Legend content={<CustomLegend />} />
          {Object.entries(drivers).map(([driver, { color }]) => (
            <Line
              key={driver}
              type="monotone"
              dataKey={driver}
              stroke={color}
              strokeWidth={focusedDriver === driver ? 2 : 1.5}
              dot={<CustomDot />}
              activeDot={<CustomActiveDot />}
              opacity={focusedDriver ? (focusedDriver === driver ? 1 : 0.15) : 1}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {selectedRaceIndex !== null && (
        <RaceDetails
          isOpen={selectedRaceIndex !== null}
          onClose={() => setSelectedRaceIndex(null)}
          race={raceData[selectedRaceIndex]}
          drivers={drivers}
        />
      )}
    </div>
  )
} 