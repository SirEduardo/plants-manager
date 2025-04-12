
export function Form (formData: any, plantDetails: any) {
    const form = new FormData()
    form.append('commonName', formData.commonName)
    form.append(
      'last_watering_date',
      formData.last_watering_date || new Date().toISOString()
    )
    form.append('watering_frequency', formData.watering_frequency)
    form.append(
      'last_fertilize_date',
      formData.last_fertilize_date || new Date().toISOString()
    )
    form.append('fertilize_frequency', formData.fertilize_frequency)
    form.append('min_temperature', formData.min_temperature)
    form.append('max_temperature', formData.max_temperature)

    if (formData.image) {
      form.append('image', formData.image)
    }

    form.append('watering', plantDetails.watering)
    form.append('sunlight', plantDetails.sunlight)
    form.append('cycle', plantDetails.cycle)
    form.append('edible', String(plantDetails.edible_fruit))
    form.append('indoor', plantDetails.indoor)
    form.append('toxicity', plantDetails.poisonous_to_humans)
    form.append('description', plantDetails.description)

    
    console.log('DETALLES COMPLETOS DE LA PLANTA', plantDetails)

    return form
}