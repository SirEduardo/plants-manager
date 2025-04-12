import { Header } from './components/Header'
import { PlantsList } from './components/plantsList'

function App() {
  return (
    <body className="min-h-svh bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <Header />
      <header>
        <h1 className="flex justify-center items-center text-5xl pt-20">
          Listado de Plantas
        </h1>
      </header>
      <main className="flex flex-col items-center pt-20">
        <div className="flex flex-col gap-2">
          <PlantsList />
        </div>
      </main>
    </body>
  )
}

export default App
