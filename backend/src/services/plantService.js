export function shouldWater(plant) {
  const wateringDays = {
    frecuente: 2,
    media: 5,
    minima: 10
  }

  const dias = wateringDays[plant.watering] || 7
  const lastDate = new Date(plant.last_watering_date)
  const today = new Date()

  const diffInDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))

  return {
    needsWatering: diffInDays >= dias
  }
}
