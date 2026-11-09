import { associatedTowns, visibleWarnings } from './model'
const warning = { id: 'one', start: 10, end: 30, level: 3, area: 'Campiña gaditana', municipalityCodes: ['11020', '28079'] }
test('unavailable and expired data never become a current warning', () => {
 expect(visibleWarnings({ status: 'unavailable', warnings: [warning] }, 20, 'any')).toEqual([])
 expect(visibleWarnings({ status: 'ok', warnings: [warning] }, 30, 'any')).toEqual([])
 expect(visibleWarnings({ status: 'ok', warnings: [warning] }, 5, 'future')).toEqual([warning])
 expect(visibleWarnings({ status: 'ok', warnings: [warning] }, 5, 'active')).toEqual([])
})
test('municipalities are deduplicated and searched with province and accent handling', () => {
 const rows = associatedTowns([warning, { ...warning, id: 'two', level: 4 }], 'jerez', '11')
 expect(rows).toHaveLength(1); expect(rows[0].code).toBe('11020'); expect(rows[0].level).toBe(4)
 expect(associatedTowns([warning], '', '28')[0].town.NAME).toBe('Madrid')
})
