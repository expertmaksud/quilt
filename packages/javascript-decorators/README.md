# `@shopify/javascript-decorators`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fjavascript-decorators.svg)](https://badge.fury.io/js/%40shopify%2Fjavascript-decorators.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/javascript-decorators.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/javascript-decorators.svg)

A set of decorators to aid your javascript journey.

## Installation

```bash
$ yarn add @shopify/javascript-decorators
```

## Usage

### `memoize`

The memoize decorator creates a function that memoizes the result of function it is decorating.
The cache key for storing the result is based on the first argument provided to the memoized function.
If the memoization key is based on more than the first argument, a `resolver` should be passed in to ensure a uniuqe key.

#### memorizing a simple function

```js
@memoize()
function addOne(number: number) {
    return number + 1
}

addOne(1); // -> 2, addOne is executed
addOne(1); // -> 2, result is from cache
```

#### memorizing a function with object as argument

When memorizing a function with object as first argument, make sure the object is immutable.
If the object updates a lot, use a resolver to set up a unique key.

```js
@memoize()
function getValues(someObject: Object) {
    return Object.values(someObject)
}

const testObject1 = {id: 1, value: 2};
getValues(testObject1); // -> [1, 2], getValues is executed
getValues(testObject1); // -> [1, 2], result is from cache

testObject1.value = 3;
getValues(testObject1); // -> [1, 2], result is from cache

getValues({id: 1, value: 2}); // -> [1, 2], getValues is executed because the object is new
```

#### memorizing a function with resolver

The resolver takes in the same arguments as the funciton it is decorating.
Make sure the resolver return a unique identifer to ensure

```js
const resolver = (someObject: Object) => `${someObject.id}-${someObject.value}`;

@memoize(resolver)
function getValues(someObject: Object) {
    return Object.values(someObject)
}

const testObject1 = {id: 1, value: 2};
getValues(testObject1); // -> [1, 2], getValues is executed
getValues(testObject1); // -> [1, 2], result is from cache

testObject1.value = 3;
getValues(testObject1); // -> [1, 3], getValues is executed

getValues({id: 1, value: 2}); // -> [1, 2], result is from cache
```
