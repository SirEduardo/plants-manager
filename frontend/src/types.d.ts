export interface Plants {
    id: string
    common_name: string
    image: string 
    last_watering_date: string
    summer_watering: string
    winter_watering: string
    last_fertilize_date: string
    fertilize: string
    min_temperature: number
    max_temperature: number
    edible: boolean
    description: string
    sunlight: string
    human_toxicity: boolean
    animal_toxicity: boolean
    location_id: string
    localization: string
    location: string
}

export type AuthTab = 'login' | 'register'

export interface Notification {
    id: number
    title: string
    message: string
    status: boolean
    created_at: string
}

export interface Localizations {
    id: string,
    name: string,
    image: string
}