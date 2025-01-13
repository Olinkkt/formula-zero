const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
} 