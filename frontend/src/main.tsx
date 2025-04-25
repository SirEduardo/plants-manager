import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PlantId } from './components/plants/plantId.tsx'
import AddPlants from './components/plants/addPlants.tsx'
import { Auth } from './components/auth/auth.tsx'
import { ProtectedRoute } from './components/auth/protectedRoute.tsx'
import AddLocalizations from './components/plants/addLocalization.tsx'
import { PlantsList } from './components/plants/plantsList.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<App />} />
        <Route path="/:id" element={<PlantsList />} />
        <Route path="/:id/:id" element={<PlantId />} />
        <Route path="/:id/add-plants" element={<AddPlants />} />
        <Route path="/añadir-localización" element={<AddLocalizations />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
