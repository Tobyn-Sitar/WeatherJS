import Image from 'next/image'

interface WeatherData {
  city: string
  country: string
  tempF: number
  feelsLikeF: number
  description: string
  icon: string
  humidity: number
  windMph: number
}

interface CityInfoProps {
  data: WeatherData | null
}

const CityInfo = ({ data }: CityInfoProps) => {
  if (!data) return null
  const { city, country, tempF, feelsLikeF, description, icon, humidity, windMph } = data

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Current Weather</h2>
      <h3 className="mt-1 text-2xl font-bold">{city}{country ? `, ${country}` : ''}</h3>
      <div className="mt-3 flex items-center justify-center gap-4">
        <Image src={icon} alt={description} width={56} height={56} />
        <div>
          <div className="text-4xl font-bold">{tempF}°F</div>
          <div className="capitalize text-muted-foreground">{description}</div>
          <div className="text-sm mt-1">Feels like {feelsLikeF}°F</div>
          <div className="text-sm mt-1">Humidity {humidity}% • Wind {windMph} mph</div>
        </div>
      </div>
    </div>
  )
}

export default CityInfo