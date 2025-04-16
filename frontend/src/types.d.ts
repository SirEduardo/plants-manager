export interface Plants {
    id: string
    common_name: string
    image: string 
    last_watering_date: string
    watering: string
    last_fertilize_date: string
    fertilize_frequency: string
    min_temperature: number
    max_temperature: number
    edible: number
    cycle: string
    descritpion: string
    sunlight: string
    toxicity: string
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