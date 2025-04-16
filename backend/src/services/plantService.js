export function shouldWater(plant) {
  const wateringDays = {
    frecuente: 0,
    media: 0,
    minima: 0
  }

  const dias = wateringDays[plant.watering] || 7
  const lastDate = new Date(plant.last_watering_date)
  const today = new Date()

  const diffInDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))

  return {
    needsWatering: diffInDays >= dias
  }
}
