# vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2
log = (x...) -> try console.log x...

_ = require('wegweg')({
  globals: true
  shelljs: true
})

module.exports = class Pacing

  constructor: (@redis,@prefix='pacing') ->
    if !@redis then @redis = _.redis()

  add: (obj,cb) ->
    if !cb then cb = (-> null)

    if !obj?.event
      return cb new Error 'You must provide an event'

    amount = obj.amount ? 1
    ns = obj.namespace ? obj.ns ? 'all'

    key = [
      @prefix
      ns
      obj.event
      _.hour()
    ].join ':'

    @redis.incrby key, amount, cb

  query: (obj,cb) ->
    if !obj.event
      return cb new Error 'You must provide an event'

    ns = obj.namespace ? obj.ns ? 'all'
    hours = obj.hours ? 12

    start = new Date

    ret = {}

    keys = for x in [0..(hours - 1)]
      key = [
        @prefix
        ns
        obj.event
        _.hour() - (x * _.secs('1 hour'))
      ].join ':'

    await @redis.mget keys, defer e,r
    if e then return cb e

    i = 0
    for x in keys
      ret[x] ?= 0
      ret[x] = +(r[i]) if r[i]
      ++ i

    result =
      result: {}
      meta:
        elapsed: new Date - start + 'ms'
        keys: keys
        hours: keys.length
        prefix: @prefix
        namespace: ns
        event: obj.event

    result.result = _.reduce ret, (res,v,k) ->
      date = new Date +(k.split(':').pop()) * 1000

      label = (date.getMonth() + 1) + '/' + date.getDate()

      hour = date.getHours() + 1
      ampm = 'AM'

      if hour > 12
        ampm = 'PM'
        hour -= 12

      label += "@#{hour}#{ampm}"

      res[label] = v
      res
    , {}

    return cb null, result

if !module.parent
  pacing = new Pacing

  pacing.add {event:'search_impressionx'}, ->
    pacing.query {hours:24,event:'search_impressionx'}, (e,r) ->
      log e
      log r
      exit 1

###
null
{ result:
   { '8/14 @3am': 3,
     '8/14 @2am': 0,
     '8/14 @1am': 0,
     '8/13 @12pm': 0,
     '8/13 @11pm': 0,
     '8/13 @10pm': 0,
     '8/13 @9pm': 0,
     '8/13 @8pm': 0,
     '8/13 @7pm': 0,
     '8/13 @6pm': 0,
     '8/13 @5pm': 0,
     '8/13 @4pm': 0,
     '8/13 @3pm': 0,
     '8/13 @2pm': 0,
     '8/13 @1pm': 0,
     '8/13 @12am': 0,
     '8/13 @11am': 0,
     '8/13 @10am': 0,
     '8/13 @9am': 0,
     '8/13 @8am': 0,
     '8/13 @7am': 0,
     '8/13 @6am': 0,
     '8/13 @5am': 0,
     '8/13 @4am': 0 },
  meta:
   { elapsed: '4ms',
     keys:
      [ 'pacing:all:search_impressionx:1407909600',
        'pacing:all:search_impressionx:1407906000',
        'pacing:all:search_impressionx:1407902400',
        'pacing:all:search_impressionx:1407898800',
        'pacing:all:search_impressionx:1407895200',
        'pacing:all:search_impressionx:1407891600',
        'pacing:all:search_impressionx:1407888000',
        'pacing:all:search_impressionx:1407884400',
        'pacing:all:search_impressionx:1407880800',
        'pacing:all:search_impressionx:1407877200',
        'pacing:all:search_impressionx:1407873600',
        'pacing:all:search_impressionx:1407870000',
        'pacing:all:search_impressionx:1407866400',
        'pacing:all:search_impressionx:1407862800',
        'pacing:all:search_impressionx:1407859200',
        'pacing:all:search_impressionx:1407855600',
        'pacing:all:search_impressionx:1407852000',
        'pacing:all:search_impressionx:1407848400',
        'pacing:all:search_impressionx:1407844800',
        'pacing:all:search_impressionx:1407841200',
        'pacing:all:search_impressionx:1407837600',
        'pacing:all:search_impressionx:1407834000',
        'pacing:all:search_impressionx:1407830400',
        'pacing:all:search_impressionx:1407826800' ],
     hours: 24,
     prefix: 'pacing',
     namespace: 'all',
     event: 'search_impressionx' } }
###

