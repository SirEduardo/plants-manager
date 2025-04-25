export async function temperature(localization) {
  const lat = localization.latitude
  const lon = localization.longitude

  const response = await fetch(
    `https://my.meteoblue.com/packages/basic-day?lat=${lat}&lon=${lon}&apikey=RA0SZmHDO5dwB1Ik`
  )
  if (!response.ok) {
    throw new Error('No se pudo obtener el clima')
  }
  const data = await response.json()
  const minTomorrow = data.data_day.temperature_min[1]

  return {
    warningTemperature: minTomorrow <= 2
  }
}
