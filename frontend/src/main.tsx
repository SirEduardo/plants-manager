import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PlantId } from './components/plantId.tsx'
import AddPlants from './components/addPlants.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:id" element={<PlantId />} />
      <Route path="/add-plants" element={<AddPlants />} />
    </Routes>
  </BrowserRouter>
)
