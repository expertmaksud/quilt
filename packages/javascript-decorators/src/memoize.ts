export interface MemoizeMap<T, U> {
  get(key: T): U;
  has(key: T): boolean;
  set(key: T, value: U): MemoizeMap<T, U>;
}

export const MAX_MAP_ENTIRES = 50;

export default function Memoize(resolver?: Function) {
  return function(...args: any[]) {
    return Memoized(args[0], resolver);
  };
}

function Memoized(func: Function, resolver?: Function) {
  const weakMapCache = new WeakMap();
  const mapCache = new Map();

  return function(...args: any[]) {
    if (typeof window === 'undefined') {
      return func.apply(this, args);
    }

    const useWeakMap =
      args.length === 0 && typeof args[0] === 'object' && !resolver;

    let key;
    if (useWeakMap) {
      key = args[0];
    } else if (resolver) {
      key = resolver.apply(this, args);
    } else {
      key = args[0];
    }

    const cache: MemoizeMap<any, any> = useWeakMap ? weakMapCache : mapCache;
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);

    if (useWeakMap) {
      weakMapCache.set(key, result);
    } else if (mapCache.size < MAX_MAP_ENTIRES) {
      mapCache.set(key, result);
    }

    return result;
  };
}
