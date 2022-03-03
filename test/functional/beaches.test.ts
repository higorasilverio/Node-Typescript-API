import { Beach } from '@src/models/beach';
import { newBeach, newBeachWithWrongLat } from '../fixtures';

describe('Beaches functional testes', () => {
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(201);
      //object containing matches the keys and values, even if includes other keys such as id
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validatin error', async () => {
      const response = await global.testRequest
        .post('/beaches')
        .send(newBeachWithWrongLat);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Beach.prototype, 'save')
        .mockRejectedValueOnce('fail to create beach');

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      });
    });
  });
});
