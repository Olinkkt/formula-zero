import FormulaZeroChampionship from '@/components/formula-zero-championship'
import { ThemeProvider } from '@/components/theme-provider'

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="container">
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">
          Šampionát Formula Zero
        </h1>
        <div className="flex justify-center">
          <FormulaZeroChampionship />
        </div>
        <footer className="text-center text-muted-foreground mt-8">
          <p>Poháněno vysokooktanovým palivem a duchem soutěže! 🏎️💨</p>
        </footer>
      </div>
    </main>
  )
}