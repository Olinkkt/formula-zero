import React from 'react'
import { Race } from './formula-zero-championship'

type NextRaceProps = {
  race: Race
}

export const NextRace = ({ race }: NextRaceProps) => {
  return (
    <>
      Příští závod: <span className="font-medium">{race.name}</span>
    </>
  )
} 