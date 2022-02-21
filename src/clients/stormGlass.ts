import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  readonly STORM_GLASS_API_PARAMS =
    'swellHeight,swellDirection,swellPeriod,waveHeight,waveDirection,windDirection,windSpeed';
  readonly STORM_GLASS_API_SOURCE = 'noaa';

  constructor(protected request: AxiosStatic) {}

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.STORM_GLASS_API_SOURCE],
      swellHeight: point.swellHeight[this.STORM_GLASS_API_SOURCE],
      swellPeriod: point.swellPeriod[this.STORM_GLASS_API_SOURCE],
      waveDirection: point.waveDirection[this.STORM_GLASS_API_SOURCE],
      waveHeight: point.waveHeight[this.STORM_GLASS_API_SOURCE],
      windDirection: point.windDirection[this.STORM_GLASS_API_SOURCE],
      windSpeed: point.windSpeed[this.STORM_GLASS_API_SOURCE],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.STORM_GLASS_API_SOURCE] &&
      point.swellHeight?.[this.STORM_GLASS_API_SOURCE] &&
      point.swellPeriod?.[this.STORM_GLASS_API_SOURCE] &&
      point.waveDirection?.[this.STORM_GLASS_API_SOURCE] &&
      point.waveHeight?.[this.STORM_GLASS_API_SOURCE] &&
      point.windDirection?.[this.STORM_GLASS_API_SOURCE] &&
      point.windSpeed?.[this.STORM_GLASS_API_SOURCE]
    );
  }

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.STORM_GLASS_API_PARAMS}&source=${this.STORM_GLASS_API_SOURCE}&end=1592113802&lat=${lat}&lng=${lng}`
    );
    return this.normalizeResponse(response.data);
  }
}
