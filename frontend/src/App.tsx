import { Header } from './components/Header'
import { Home } from './home'

function App() {
  return (
    <body className="min-h-svh bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <Header />
      <main className="flex flex-col items-center pt-20">
        <div className="flex flex-col gap-2">
          <Home />
        </div>
      </main>
    </body>
  )
}

export default App
