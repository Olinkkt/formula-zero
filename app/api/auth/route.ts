import { verifyAdminPassword } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  
  if (await verifyAdminPassword(password)) {
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Nesprávné heslo' },
    { status: 401 }
  )
} 