export interface WeatherPayload {
  temperature: number
  humidity: number
  conditions: string
  windSpeed: number
  windDirection: string
  source: "openweathermap" | "cache"
}
export type BaseData = Omit<WeatherPayload, "source">
