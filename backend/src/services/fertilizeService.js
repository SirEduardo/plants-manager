export function shouldFertilize(plant) {
  const now = new Date()
  const month = now.getMonth() + 1
  const isSpringOrSummer = month >= 3 && month <= 9

  if (!isSpringOrSummer) {
    return { needFertilizing: false }
  }

  const lastFertilizeDate = new Date(plant.lastFertilizeDate)

  const diffInDays = Math.floor(
    (now - lastFertilizeDate) / (1000 * 60 * 60 * 24)
  )
  const frequencyDays = parseFertilizeFrequency(plant.fertilize)

  console.log(
    `🌸 ${plant.common_name}: ${diffInDays} días desde última fertilización. Frecuencia: cada ${frequencyDays} días.`
  )

  return {
    needsFertilizing: diffInDays >= frequencyDays
  }

  function parseFertilizeFrequency(text) {
    if (!text) return 30

    text = text.toLowerCase()

    if (text.includes('mensual')) return 30
    if (text.includes('bimensual')) return 60
    if (text.includes('trimestral')) return 90

    return 30
  }
}
