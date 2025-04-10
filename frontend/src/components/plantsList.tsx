import { Link } from 'react-router'
import { Plants } from '../types'
import { useEffect, useState } from 'react'

export const PlantsList = () => {
  const [plants, setPlants] = useState([])
  useEffect(() => {
    const fetchPlants = async () => {
      const response = await fetch('http://localhost:3000/plants')
      const res = await response.json()
      setPlants(res)
    }
    fetchPlants()
  }, [])
  return (
    <div className="flex gap-10 flex-wrap justify-center items-center px-20">
      {plants.length > 0 ? (
        plants.map((plant: Plants) => (
          <Link to={`/${plant.id}`}>
            <div
              className="flex flex-col justify-center items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
              key={plant.id}
            >
              <img
                className="w-50 h-50 rounded-xl"
                src={plant.image}
                alt={plant.name}
              ></img>
              <h2 className="text-green-400">{plant.name}</h2>
            </div>
          </Link>
        ))
      ) : (
        <p>No hay Plantas registradas</p>
      )}
    </div>
  )
}
