import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWether3HoursFixtures from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixtures from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    axios.get = jest.fn().mockResolvedValue(stormGlassWether3HoursFixtures);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixtures);
  });
});
