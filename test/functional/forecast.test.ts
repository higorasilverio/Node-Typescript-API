import { Beach } from '@src/models/beach';
import {
  defaultBeach,
  defaultForecastResponse,
  stormGlassWeather,
} from '@test/fixtures';
import nock from 'nock';

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});

    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        params:
          'swellHeight%2CswellDirection%2CswellPeriod%2CwaveHeight%2CwaveDirection%2CwindDirection%2CwindSpeed',
        source: 'noaa',
        end: '1592113802',
        lat: '-33.792726',
        lng: '151.289824',
      })
      .reply(200, stormGlassWeather);

    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(defaultForecastResponse);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        params:
          'swellHeight%2CswellDirection%2CswellPeriod%2CwaveHeight%2CwaveDirection%2CwindDirection%2CwindSpeed',
        source: 'noaa',
        end: '1592113802',
        lat: '-33.792726',
        lng: '151.289824',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');
    expect(status).toBe(500);
  });
});
