### jq.node - Become a shell hero, get super-power

[![Build Status](https://img.shields.io/circleci/project/FGRibreau/jq.node.svg)](https://circleci.com/gh/FGRibreau/jq.node/) ![deps](https://img.shields.io/david/fgribreau/jq.node.svg?style=flat) ![Version](https://img.shields.io/npm/v/jq.node.svg?style=flat) [![Docker hub](https://img.shields.io/docker/pulls/fgribreau/jq.node.svg)](https://hub.docker.com/r/fgribreau/jq.node/) [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq) ![extra](https://img.shields.io/badge/actively%20maintained-yes-ff69b4.svg) [![Twitter Follow](https://img.shields.io/twitter/follow/fgribreau.svg?style=flat)](https://twitter.com/FGRibreau) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/francois-guillaume-ribreau?utm_source=github&utm_medium=button&utm_term=francois-guillaume-ribreau&utm_campaign=github)  

jq.node is JavaScript and Lodash in your shell (along with the 300K+ npm modules). It's a powerful command-line JSON/string processor. It so easy it feels like cheating your inner-bearded-sysadmin.

## Rational

I'm a huge fan of [jq](https://github.com/stedolan/jq) **but** it was so many times inconsistent and irritating. It sometimes felt like JavaScript but it was not.
**jq.node** is what jq should be **in my opinion**. First version was written in 25 lines of JavaScript code and was already way more powerful than jq, backed from day one by more than 300 helpers from Lodash FP.

## Why jq.node? Why not jq?

- jq.node does not try to implement its own expression language, it's pure JavaScript
- no need to learn new operators or helpers, if you know [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide), you know jq.node helpers
- more powerful than jq **will ever be** `jqn 'filter(has("email")) | groupBy(u => u.email.split("@")[1]) | csv'`
- through `--require` command option, jq.node leverages **300K+ npm modules**. Hard to do more powerful than that!

## Why jq? Why not jq.node?

- performance matters more than feature set (in our current implementation jq is faster than jq.node, C vs JavaScript)
- some features of jq are not currently implemented in jq.node
- jq is a binary, jq.node is a NodeJS project (🌟 accessible through [a docker image](https://hub.docker.com/r/fgribreau/jq.node/))

## Install (NodeJS)

```
npm install jq.node -g
```

## Shameless plug

- [**Charts, simple as a URL**. No more server-side rendering pain, 1 url = 1 chart](https://image-charts.com)
- [Looking for a free **Redis GUI**?](https://www.redsmin.com) [Or for **real-time alerting** & monitoring for Redis?](http://redsmin.com)
- [**Mailpopin**](https://mailpop.in/) - **Stripe** payment emails you can actually use

## CLI Usage

```shell
# the 4 commands below do the same thing
cat users.json | jqn 'filter(has("email")) | groupBy(function(u){return u.email.split("@")[1]}) | csv'
cat users.json | jqn 'filter(has("email")) | groupBy(u => u.email.split("@")[1]) | csv'
cat users.json | jqn 'filter(has("email")) | groupBy(u => get(u.email.split("@"), 1)) | csv'
cat users.json | jqn 'filter(has("email")) | groupBy(flow(get("email"), split("@"), get(1))) | csv'
```

- [Complex and tricky JSON querying made easy with jq.node](https://asciinema.org/a/91627)
- [Editing string (to JSON) in clipboard with jq.node](https://asciinema.org/a/91472)

Note: the pipe ` | ` **must always** be surrounded by space to be understood by `jqn` as a pipe.

## Examples

### Be notified when a JSON value changed

```
while true; do curl -s http://10.10.0.5:9000/api/ce/task?id=AVhoYB1sNTnExzIJOq_k | jqn 'property("task.status"), thru(a => exit(a === "IN_PROGRESS" ? 0 : 1))' || osascript -e 'display notification "Task done"'; sleep 5; done
```

### Open every links from the clipboard

```
pbpaste | jqn -x -r opn 'split("\n") | forEach(opn)'
```

- pbpaste, echoes clipboard content, MacOS only ([use xclip or xsel in Linux](http://superuser.com/a/288333/215986))
- [opn](https://github.com/sindresorhus/opn) is "a better node-open. Opens stuff like websites, files, executables. Cross-platform."


## API Usage

`jq.node` exposes a node API for programmatic use. Require the `jq` function from the main module.

The arguments are `jq(input, transformation, options, callback)`

```js
const { jq } = require('jq.node')

jq('20111031', 'thru(a => moment.utc(a, "YYYYMMDD"))', { rawInput: true, require: 'moment' }, function (err, result) {
  console.log(result) // "2011-10-31T00:00:00.000Z"
})
```

or with promises and async/await, via the bluebird module:

```js
const { Promisify } = require('bluebird')
const { jq } = Promisify(require('jq.node'))

const result = await jq('20111031', 'thru(a => moment.utc(a, "YYYYMMDD"))', { rawInput: true, require: 'moment' })
console.log(result) // "2011-10-31T00:00:00.000Z"
```

## Options

| CLI Shorthand | CLI Longhand | API Option |  Type           | Purpose                                                                                                      |
| :---          | :---         | :---       | :---:           |                                                                                                         ---: |
| -h            | --help       | -          | -               | Display the help message and exit.                                                                           |
| -j            | --json       | json       | boolean         | Force the result to be output as JSON. Without this, `jqn` outputs strings verbatim and non-strings as JSON. |
| -x            | --raw-input  | rawInput   | boolean         |                                                                                                              |
| -c            | --color      | color      | boolean         | Colorize JSON (default true)                                                                                 |
| -r            | --require    | require    | array(string)   | * Require a NPM module `<npm-module-name>`.                                                                  |
| -v            | --version    | -          | -               | Display the version and exit.                                                                                |

* jq.node will automatically installs in a temporary folder it if its not available. The module will be available in the expression through its name (e.g. `lodash` for the `lodash` module). Module names that are invalid JavaScript variable names (e.g. `js-yaml`) will be exposed in camel-case format (e.g. `jsYaml`).

## Currently supported

- `templateSettings`, `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`, `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`, `compact`, `concat`, `cond`, `conforms`, `constant`, `countBy`, `create`, `curry`, `curryRight`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`, `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`, `filter`, `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`, `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`, `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`, `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`, `pickBy`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`, `pullAllWith`, `pullAt`, `range`, `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`, `slice`, `sortBy`, `sortedUniq`, `sortedUniqBy`, `split`, `spread`, `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`, `valuesIn`, `without`, `words`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`, `zipObjectDeep`, `zipWith`, `entries`, `entriesIn`, `extend`, `extendWith`, `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`, `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`, `defaultTo`, `divide`, `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `floor`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`, `isSafeInteger`, `isSet`, `isString`, `isSymbol`, `isTypedArray`, `isUndefined`, `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`, `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`, `min`, `minBy`, `stubArray`, `stubFalse`, `stubObject`, `stubString`, `stubTrue`, `multiply`, `nth`, `noConflict`, `noop`, `now`, `pad`, `padEnd`, `padStart`, `parseInt`, `random`, `reduce`, `reduceRight`, `repeat`, `replace`, `result`, `round`, `runInContext`, `sample`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedIndexOf`, `sortedLastIndex`, `sortedLastIndexBy`, `sortedLastIndexOf`, `startCase`, `startsWith`, `subtract`, `sum`, `sumBy`, `template`, `times`, `toFinite`, `toInteger`, `toLength`, `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`, `upperFirst`, `each`, `eachRight`, `first` are exposed from [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide).
- `csv` is exposed from [json2csv](https://github.com/zemirco/json2csv)
- any of 300 000+ [npm modules](https://www.npmjs.com/) through the `--require` option!


## Performance

- jq      `time sh -c "cat messages.json | jq '.[].type'"`              `2ms user 0.01s system 95% cpu 0.028 total`
- jq.node `time sh -c "cat messages.json | jqn 'map(\"type\")'"`         `170ms user 0.03s system 108% cpu 0.181 total`

## Roadmap

- [x] Tests
- [ ] Json-stream support
- [x] Optionally colorize output (while still JSON compatible)

I accept pull-requests!

## [Changelog](/CHANGELOG.md)


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

No maintainers yet! Will you be the first?

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="https://patreon.com/fgribreau" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/fgribreau" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/fgribreau" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://fgribreau.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://www.coinbase.com/fgribreau" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://bit.ly/2c7uFJq">Francois-Guillaume Ribreau</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=FGRibreau" title="View the GitHub contributions of Francois-Guillaume Ribreau on repository fgribreau/jq.node">view contributions</a></li>
<li><a href="https://github.com/chocolateboy">chocolateboy</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=chocolateboy" title="View the GitHub contributions of chocolateboy on repository fgribreau/jq.node">view contributions</a></li>
<li><a href="https://github.com/bronislav">Anton Ilin</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=bronislav" title="View the GitHub contributions of Anton Ilin on repository fgribreau/jq.node">view contributions</a></li>
<li><a href="http://delapouite.com">Bruno Heridet</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=Delapouite" title="View the GitHub contributions of Bruno Heridet on repository fgribreau/jq.node">view contributions</a></li>
<li><a href="https://github.com/thalesmello">Thales Mello</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=thalesmello" title="View the GitHub contributions of Thales Mello on repository fgribreau/jq.node">view contributions</a></li>
<li><a href="http://michael.mior.ca">Michael Mior</a> — <a href="https://github.com/fgribreau/jq.node/commits?author=michaelmior" title="View the GitHub contributions of Michael Mior on repository fgribreau/jq.node">view contributions</a></li></ul>

<a href="https://github.com/fgribreau/jq.node/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://fgribreau.com/">Francois-Guillaume Ribreau</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
