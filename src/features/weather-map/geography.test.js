import { loadGeography } from './geography'
beforeEach(() => { global.fetch = jest.fn() })
test('loads bundled boundaries without depending on external tile servers', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ features: [{ properties: { code: '02' } }] }) })
  const result = await loadGeography('country')
  expect(fetch.mock.calls[0][0]).toBe('/maps/communities.geojson')
  expect(result.features[0].properties.code).toBe('02')
})
test('requests only one province and maps municipality INE fields', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ features: [{ properties: { CODIGOINE: '44001', NAMEUNIT: 'Ababuj' } }] }) })
  const result = await loadGeography('province', '44')
  expect(new URL(fetch.mock.calls[0][0]).searchParams.get('where')).toBe("CODIGOINE LIKE '44%'")
  expect(result.features[0].properties).toEqual({ code: '44001', name: 'Ababuj' })
})
test('rejects incomplete or malformed geometry instead of silently showing a partial province', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ features: [{}], exceededTransferLimit: true }) })
  await expect(loadGeography('province', '09')).rejects.toThrow('mapError')
  await expect(loadGeography('province', "44' OR 1=1")).rejects.toThrow('mapError')
})
