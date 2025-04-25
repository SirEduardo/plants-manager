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
    text = text.replace(/riego constante/gi, '').replace(/\(.*?\)/g, '')
    const regex1 = /(\d+)(?:-(\d+))?\s*(días|semanas)?/
    const regex2 = /(\d+)\s*veces?\s*por\s*(día|semana)/
    let match = text.match(regex1)
    if (match) {
      let [, min, max, unit] = match
      min = parseInt(min)
      max = max ? parseInt(max) : min
      let avg = (min + max) / 2
      if (unit?.includes('semana')) avg *= 7
      return Math.round(avg)
    }

    match = text.match(regex2)
    if (match) {
      const [, times, unit] = match
      const timesNum = parseInt(times)
      return unit === 'día'
        ? Math.round(1 / timesNum)
        : Math.round(7 / timesNum)
    }

    return Math.round(avg)
  }
}
