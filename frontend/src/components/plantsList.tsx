import { Link } from 'react-router'
import plantsData from '../plants.json'
import { Plants } from '../types'

export const PlantsList = () => {
  return (
    <div className="flex gap-10 flex-wrap justify-center items-center px-20">
      {plantsData.plants.length > 0 ? (
        plantsData.plants.map((plant: Plants) => (
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
