# install

using [npm](https://npmjs.org)

```
npm i pacing-events-redis --save
```

# usage

``` coffeescript
Pacing = require 'pacing-events-redis'
pacing = new Pacing()

pacing.add {event:'search_impressionx'}, ->
  pacing.query {hours:24,event:'search_impressionx'}, (e,r) ->
    log e
    log r
```

```javascript
{ result:
   { '3/23@2PM': 4,
     '3/23@1PM': 0,
     '3/23@12AM': 0,
     '3/23@11AM': 0,
     '3/23@10AM': 0,
     '3/23@9AM': 0,
     '3/23@8AM': 0,
     '3/23@7AM': 0,
     '3/23@6AM': 0,
     '3/23@5AM': 0,
     '3/23@4AM': 0,
     '3/23@3AM': 0,
     '3/23@2AM': 0,
     '3/23@1AM': 0,
     '3/22@12PM': 0,
     '3/22@11PM': 0,
     '3/22@10PM': 0,
     '3/22@9PM': 0,
     '3/22@8PM': 0,
     '3/22@7PM': 0,
     '3/22@6PM': 0,
     '3/22@5PM': 0,
     '3/22@4PM': 0,
     '3/22@3PM': 0 },
  meta:
   { elapsed: '5ms',
     keys:
      [ 'pacing:all:search_impressionx:1490288400',
        'pacing:all:search_impressionx:1490284800',
        'pacing:all:search_impressionx:1490281200',
        'pacing:all:search_impressionx:1490277600',
        'pacing:all:search_impressionx:1490274000',
        'pacing:all:search_impressionx:1490270400',
        'pacing:all:search_impressionx:1490266800',
        'pacing:all:search_impressionx:1490263200',
        'pacing:all:search_impressionx:1490259600',
        'pacing:all:search_impressionx:1490256000',
        'pacing:all:search_impressionx:1490252400',
        'pacing:all:search_impressionx:1490248800',
        'pacing:all:search_impressionx:1490245200',
        'pacing:all:search_impressionx:1490241600',
        'pacing:all:search_impressionx:1490238000',
        'pacing:all:search_impressionx:1490234400',
        'pacing:all:search_impressionx:1490230800',
        'pacing:all:search_impressionx:1490227200',
        'pacing:all:search_impressionx:1490223600',
        'pacing:all:search_impressionx:1490220000',
        'pacing:all:search_impressionx:1490216400',
        'pacing:all:search_impressionx:1490212800',
        'pacing:all:search_impressionx:1490209200',
        'pacing:all:search_impressionx:1490205600' ],
     hours: 24,
     prefix: 'pacing',
     namespace: 'all',
     event: 'search_impressionx' } }
```

---

### License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
