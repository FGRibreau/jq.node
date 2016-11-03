### jq.node - Powerful Command-line JSON processor

![deps](https://img.shields.io/david/fgribreau/jq.node.svg?style=flat) ![Version](https://img.shields.io/npm/v/jq.node.svg?style=flat) [![Docker hub](https://img.shields.io/docker/pulls/fgribreau/jq.node.svg)](https://hub.docker.com/r/fgribreau/jq.node/) [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq) ![extra](https://img.shields.io/badge/actively%20maintained-yes-ff69b4.svg) [![Twitter Follow](https://img.shields.io/twitter/follow/fgribreau.svg?style=flat)](https://twitter.com/FGRibreau)

## Rational

I'm a huge fan of [jq](https://github.com/stedolan/jq) **but** it was so many times inconsistent and irritating. It sometimes felt like JavaScript but it was not.
**jq.node** is what jq should be **in my opinion**. First version was written in 25 lines of JavaScript code and was already way more powerful than jq, backed from day one by more than 300 helpers from Lodash FP.

## Why jq.node? Why not jq?

- jq.node does not try to implement its own expression language, it's pure JavaScript
- no need to learn new operators or helpers, if you know [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide), you know jq.node helpers
- more powerful than jq **will ever be** `jq 'filter(has("email")) | groupBy(u => u.email.split("@")[1]) | csv'`

## Why jq? Why not jq.node?

- performance matters more than feature set (in our current implementation jq is faster than jq.node, C vs JavaScript)
- some features of jq are not currently implemented in jq.node
- jq is a binary, jq.node is a NodeJS project (🌟 soon accessible through [a docker image](https://hub.docker.com/r/fgribreau/jq.node/))

## Install (NodeJS)

```
npm install jq.node -g
```

## Shameless plug

- [**Charts, simple as a URL**. No more server-side rendering pain, 1 url = 1 chart](https://image-charts.com)
- [Looking for a free **Redis GUI**?](http://redsmin.com) [Or for **real-time alerting** & monitoring for Redis?](http://redsmin.com)

## Usage

```shell
# the 4 commands below do the same thing
cat users.json | jq 'filter(has("email")) | groupBy(function(u){return u.email.split("@")[1]}) | csv'
cat users.json | jq 'filter(has("email")) | groupBy(u => u.email.split("@")[1]) | csv'
cat users.json | jq 'filter(has("email")) | groupBy(u => get(u.email.split("@"), 1)) | csv'
cat users.json | jq 'filter(has("email")) | groupBy(flow(get("email"), split("@"), get(1))) | csv'
```

- [Demo on asciinema](https://asciinema.org/a/dk9n2gruh4mp4br0n06gw121i)

Note: the pipe ` | ` **must always** be surrounded by space to be understood by `jq` as a pipe.


## Options

### -h, --help

Display the help message and exit.

### -j, --json

Force the result to be output as JSON. Without this, `jq` outputs strings verbatim and non-strings as JSON.

### -x, --raw-input

Read input as a string.

### -v, --version

Display the version and exit.

## Commands

### help

Display the help message and exit.

## Currently supported

- `templateSettings`, `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`, `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`, `compact`, `concat`, `cond`, `conforms`, `constant`, `countBy`, `create`, `curry`, `curryRight`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`, `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`, `filter`, `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`, `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`, `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`, `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`, `pickBy`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`, `pullAllWith`, `pullAt`, `range`, `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`, `slice`, `sortBy`, `sortedUniq`, `sortedUniqBy`, `split`, `spread`, `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`, `valuesIn`, `without`, `words`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`, `zipObjectDeep`, `zipWith`, `entries`, `entriesIn`, `extend`, `extendWith`, `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`, `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`, `defaultTo`, `divide`, `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `floor`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`, `isSafeInteger`, `isSet`, `isString`, `isSymbol`, `isTypedArray`, `isUndefined`, `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`, `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`, `min`, `minBy`, `stubArray`, `stubFalse`, `stubObject`, `stubString`, `stubTrue`, `multiply`, `nth`, `noConflict`, `noop`, `now`, `pad`, `padEnd`, `padStart`, `parseInt`, `random`, `reduce`, `reduceRight`, `repeat`, `replace`, `result`, `round`, `runInContext`, `sample`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedIndexOf`, `sortedLastIndex`, `sortedLastIndexBy`, `sortedLastIndexOf`, `startCase`, `startsWith`, `subtract`, `sum`, `sumBy`, `template`, `times`, `toFinite`, `toInteger`, `toLength`, `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`, `upperFirst`, `each`, `eachRight`, `first` are exposed from [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide).
- `csv` is exposed from [json2csv](https://github.com/zemirco/json2csv)


## Performance

- jq      `time sh -c "cat messages.json | jq '.[].type'"`              `2ms user 0.01s system 95% cpu 0.028 total`
- jq.node `time sh -c "cat messages.json | jq 'map(\"type\")'"`         `170ms user 0.03s system 108% cpu 0.181 total`

## Roadmap

- [ ] Tests
- [ ] Json-stream support
- [ ] Optionally colorize output (while still JSON compatible)

I accept pull-requests!


## [Changelog](/CHANGELOG.md)
