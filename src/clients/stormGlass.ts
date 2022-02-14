export class StormGlass {
  public async fetchPoints(
    lat: number,
    lng: number
  ): Promise<Record<string, never>> {
    return Promise.resolve({});
  }
}
