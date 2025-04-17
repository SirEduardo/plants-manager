export function shouldWater(plant) {
  const now = new Date()
  const month = now.getMonth() + 1
  const isSummer = month >= 5 && month <= 9

  const rawFrequency = isSummer
    ? plant.summer_watering?.toloweCase()
    : plant.winter_watering?.toloweCase()

  const daysBetweenWatering = parseWateringFrequency(rawFrequency)

  const lastDate = new Date(plant.last_watering_date)
  const diffInDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
  return {
    needsWatering: diffInDays >= daysBetweenWatering
  }

  function parseWateringFrequency(text) {
    if (!text) return 7

    //extraemos numeros del string
    const match = text.match(/(\d+)(?:-(\d+))?\s*(días|semanas)?/)
    if (!match) return 7

    let [, min, max, unit] = match
    min = parseInt(min)
    max = max ? parseInt(max) : min

    let avg = (min + max) / 2

    if (unit?.includes('semana')) {
      avg *= 7
    }

    return Math.round(avg)
  }
}
