function checkFertilizing(plants) {
  const now = new Date()
  const month = now.getMonth() + 1
  const isSpringOrSummer = month >= 3 && month <= 9

  const plantsToFertilize = []

  for (const plant of plants) {
    if (!isSpringOrSummer) continue

    const lastFertilizeDate = new Date(plant.lastFertilizeDate)
    if (isNaN(lastFertilizeDate)) continue // Skip if invalid date

    const diffInDays = Math.floor(
      (now - lastFertilizeDate) / (1000 * 60 * 60 * 24)
    )
    const frequencyDays = parseFertilizeFrequency(plant.fertilize)

    if (diffInDays >= frequencyDays) {
      console.log(`🔔 ${plant.common_name} needs fertilizing today!`)
      plantsToFertilize.push(plant)
    }
  }

  return plantsToFertilize

  function parseFertilizeFrequency(text) {
    if (!text) return 30

    text = text.toLowerCase()

    if (text.includes('mensual')) return 30
    if (text.includes('bimensual')) return 60
    if (text.includes('trimestral')) return 90

    return 30
  }
}

export default checkFertilizing
