/**
 * @jest-environment node
 */

import memoize from '../memoize';

describe('memoize()', () => {
  describe('server', () => {
    const addOne = (number: number) => number + 1;
    it('recalculate the result when first argument changed', () => {
      const spy = jest.fn(addOne);
      const memoized = memoize()(spy);

      expect(memoized(1)).toEqual(2);
      expect(memoized(2)).toEqual(3);
      expect(spy).toBeCalledTimes(2);
    });

    it('recalculate the result when the first argument stay the same', () => {
      const spy = jest.fn(addOne);
      const memoized = memoize()(spy);

      expect(memoized(1)).toEqual(2);
      expect(memoized(1)).toEqual(2);
      expect(spy).toBeCalledTimes(2);
    });
  });
});
