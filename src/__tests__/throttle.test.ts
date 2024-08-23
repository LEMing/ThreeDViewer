import { throttle } from '../utils'; // Assume the file is named throttle.ts

jest.useFakeTimers(); // Use fake timers for tests

describe('throttle', () => {
  it('should call the function immediately on the first call', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again if less than the limit time has passed', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function again after the limit time has passed', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    jest.advanceTimersByTime(1000); // Advance timer by 1000 milliseconds
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the original function', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc(1, 2, 3);

    expect(func).toHaveBeenCalledWith(1, 2, 3);
  });

  it('should call the function only once if called multiple times within the limit time', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000); // Advance timer by 1000 milliseconds

    throttledFunc();

    expect(func).toHaveBeenCalledTimes(2);
  });
});
