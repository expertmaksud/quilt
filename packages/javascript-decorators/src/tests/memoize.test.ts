/**
 * @jest-environment jsdom
 */

import memoize, {MAX_MAP_ENTIRES} from '../memoize';

describe('memoize()', () => {
  describe('client', () => {
    const addOne = (number: number) => number + 1;

    it('recalculate the result when first argument changed', () => {
      const spy = jest.fn(addOne);
      const memoized = memoize()(spy);

      expect(memoized(1)).toEqual(2);
      expect(memoized(2)).toEqual(3);
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
      const spy = jest.fn(addOne);
      const memoized = memoize()(spy);

      expect(memoized(1)).toEqual(2);
      expect(memoized(1)).toEqual(2);
      expect(spy).toBeCalledTimes(1);
    });

    it('does not put the result into map cache, if map cache is over its max limit', () => {
      const spy = jest.fn(addOne);
      const memoized = memoize()(spy);

      for (let i = 0; i < MAX_MAP_ENTIRES; i++) {
        expect(memoized(i)).toEqual(i + 1);
      }

      expect(memoized(MAX_MAP_ENTIRES + 1)).toEqual(MAX_MAP_ENTIRES + 2);
      expect(spy).toBeCalledTimes(MAX_MAP_ENTIRES + 1);

      expect(memoized(MAX_MAP_ENTIRES + 1)).toEqual(MAX_MAP_ENTIRES + 2);
      expect(spy).toBeCalledTimes(MAX_MAP_ENTIRES + 2);
    });
  });

  describe('only argument is object', () => {
    const getValues = (someObject: Object) => Object.values(someObject);
    it('recalculate the result when the first argument changed', () => {
      const spy = jest.fn(getValues);
      const memoized = memoize()(spy);

      expect(memoized({one: 1, two: 2})).toEqual([1, 2]);
      expect(memoized({one: 3, four: 4})).toEqual([3, 4]);
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
      const spy = jest.fn(getValues);
      const memoized = memoize()(spy);

      const testObject1 = {one: 1, two: 2};
      expect(memoized(testObject1)).toEqual([1, 2]);
      expect(memoized(testObject1)).toEqual([1, 2]);
      expect(spy).toBeCalledTimes(1);
    });

    it('does not change the result when the argument was changed in value only', () => {
      const spy = jest.fn(getValues);
      const memoized = memoize()(spy);

      const testObject1 = {one: 1, two: 2};
      expect(memoized(testObject1)).toEqual([1, 2]);

      testObject1.one = 2;
      expect(memoized(testObject1)).toEqual([1, 2]);

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('customized resolver', () => {
    const getValues = (someObject: Object) => Object.values(someObject);
    const resolver = (someObject: Object) =>
      `${Object.keys(someObject)[0]}-${Object.keys(someObject)[1]}`;

    it('recalculate the result when the resolver result was changed', () => {
      const spy = jest.fn(getValues);
      const memoizedValues = memoize(resolver)(spy);

      expect(memoizedValues({one: 1, two: 2})).toEqual([1, 2]);
      expect(memoizedValues({three: 1, four: 2})).toEqual([1, 2]);
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the resolver result was not changed', () => {
      const spy = jest.fn(getValues);
      const memoizedValues = memoize(resolver)(spy);

      expect(memoizedValues({one: 1, two: 2})).toEqual([1, 2]);
      expect(memoizedValues({one: 3, two: 4})).toEqual([1, 2]);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
