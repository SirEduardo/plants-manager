import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PlantId } from './components/plantId.tsx'
import AddPlants from './components/addPlants.tsx'
import { Auth } from './components/auth/auth.tsx'
import { ProtectedRoute } from './components/auth/protectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/plantsList" element={<App />} />
        <Route path="/:id" element={<PlantId />} />
        <Route path="/add-plants" element={<AddPlants />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
