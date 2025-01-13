"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function AdminAuthDialog({ 
  open, 
  onOpenChange,
  onAuthenticated 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthenticated: () => void 
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password })
    })

    if (res.ok) {
      onAuthenticated()
    } else {
      setError('Nesprávné heslo')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin přihlášení</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Přihlásit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 