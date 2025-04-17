export function shouldWater(plant) {
  const wateringDays = {
    '2-3': 2,
    media: 5,
    minima: 10
  }

  const dias = wateringDays[plant.watering] || 7
  const lastDate = new Date(plant.last_watering_date)
  const today = new Date()

  if (isNaN(lastDate)) {
    console.warn(
      `⚠️ Fecha inválida para la planta ${plant.common_name}: ${plant.last_watering_date}`
    )
    return { needsWatering: false }
  }

  const diffInDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
  console.log(
    `🌿 ${plant.common_name}: ${diffInDays} días desde último riego, necesita cada ${dias} días.`
  )

  return {
    needsWatering: diffInDays >= dias
  }
}
