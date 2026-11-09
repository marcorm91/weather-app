import { scheduleProduct } from './requestScheduler'
test('spaces two-stage products by three seconds across consumers', async () => {
  jest.useFakeTimers()
  const first = jest.fn(), second = jest.fn()
  scheduleProduct().then(first); scheduleProduct().then(second)
  jest.advanceTimersByTime(0); await Promise.resolve()
  expect(first).toHaveBeenCalledTimes(1); expect(second).not.toHaveBeenCalled()
  jest.advanceTimersByTime(2999); await Promise.resolve(); expect(second).not.toHaveBeenCalled()
  jest.advanceTimersByTime(1); await Promise.resolve(); expect(second).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})
