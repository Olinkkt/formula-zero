"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Save, Trash2, LogOut } from 'lucide-react'

type AdminPanelProps = {
  drivers: Record<string, { color: string; team: string; kart: string }>
  raceData: Array<{ race: string } & Record<string, number | string>>
  onLogout: () => void
}

export function AdminPanel({ drivers, raceData, onLogout }: AdminPanelProps) {
  const [selectedTab, setSelectedTab] = useState('races')

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Admin Panel</CardTitle>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Odhlásit
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="races">Závody</TabsTrigger>
            <TabsTrigger value="drivers">Jezdci</TabsTrigger>
            <TabsTrigger value="teams">Týmy</TabsTrigger>
          </TabsList>

          <TabsContent value="races" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Správa závodů</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Přidat závod
              </Button>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
              {raceData.map((race, index) => (
                <div key={index} className="grid grid-cols-[1fr,auto] gap-4 p-4 border rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input 
                        value={race.race as string} 
                        className="w-48"
                        placeholder="Název závodu"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(drivers).map(([driver]) => (
                        <div key={driver} className="flex items-center gap-2">
                          <span className="text-sm font-medium min-w-[80px]">{driver}</span>
                          <Input 
                            type="number"
                            value={race[driver] as number}
                            className="w-20"
                            placeholder="Body"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="destructive" size="icon" className="h-10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Správa jezdců</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Přidat jezdce
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(drivers).map(([name, data]) => (
                <div key={name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Input value={name} className="w-48" placeholder="Jméno" />
                  <Input value={data.team} className="w-48" placeholder="Tým" />
                  <Input value={data.color} type="color" className="w-20" />
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Správa týmů</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Přidat tým
              </Button>
            </div>
            <div className="space-y-4">
              {Array.from(new Set(Object.values(drivers).map(d => d.team))).map((team) => (
                <div key={team} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Input value={team} className="w-48" placeholder="Název týmu" />
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Uložit změny
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 