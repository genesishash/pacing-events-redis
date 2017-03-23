(function() {
  var Pacing, iced, log, pacing, _, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  log = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      return console.log.apply(console, x);
    } catch (_error) {}
  };

  _ = require('wegweg')({
    globals: true,
    shelljs: true
  });

  module.exports = Pacing = (function() {
    function Pacing(redis, prefix) {
      this.redis = redis;
      this.prefix = prefix != null ? prefix : 'pacing';
      if (!this.redis) {
        this.redis = _.redis();
      }
    }

    Pacing.prototype.add = function(obj, cb) {
      var amount, key, ns, _ref, _ref1, _ref2;
      if (!cb) {
        cb = (function() {
          return null;
        });
      }
      if (!(obj != null ? obj.event : void 0)) {
        return cb(new Error('You must provide an event'));
      }
      amount = (_ref = obj.amount) != null ? _ref : 1;
      ns = (_ref1 = (_ref2 = obj.namespace) != null ? _ref2 : obj.ns) != null ? _ref1 : 'all';
      key = [this.prefix, ns, obj.event, _.hour()].join(':');
      return this.redis.incrby(key, amount, cb);
    };

    Pacing.prototype.query = function(obj, cb) {
      var e, hours, i, key, keys, ns, r, result, ret, start, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref, _ref1, _ref2;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (!obj.event) {
        return cb(new Error('You must provide an event'));
      }
      ns = (_ref = (_ref1 = obj.namespace) != null ? _ref1 : obj.ns) != null ? _ref : 'all';
      hours = (_ref2 = obj.hours) != null ? _ref2 : 12;
      start = new Date;
      ret = {};
      keys = (function() {
        var _i, _ref3, _results;
        _results = [];
        for (x = _i = 0, _ref3 = hours - 1; 0 <= _ref3 ? _i <= _ref3 : _i >= _ref3; x = 0 <= _ref3 ? ++_i : --_i) {
          _results.push(key = [this.prefix, ns, obj.event, _.hour() - (x * _.secs('1 hour'))].join(':'));
        }
        return _results;
      }).call(this);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/pacing-events-memcached/src/module.iced",
            funcname: "Pacing.query"
          });
          _this.redis.mget(keys, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                e = arguments[0];
                return r = arguments[1];
              };
            })(),
            lineno: 50
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _i, _len;
          if (e) {
            return cb(e);
          }
          i = 0;
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            x = keys[_i];
            if (ret[x] == null) {
              ret[x] = 0;
            }
            if (r[i]) {
              ret[x] = +r[i];
            }
            ++i;
          }
          result = {
            result: {},
            meta: {
              elapsed: new Date - start + 'ms',
              keys: keys,
              hours: keys.length,
              prefix: _this.prefix,
              namespace: ns,
              event: obj.event
            }
          };
          result.result = _.reduce(ret, function(res, v, k) {
            var ampm, date, hour, label;
            date = new Date(+(k.split(':').pop()) * 1000);
            label = (date.getMonth() + 1) + '/' + date.getDate();
            hour = date.getHours() + 1;
            ampm = 'AM';
            if (hour > 12) {
              ampm = 'PM';
              hour -= 12;
            }
            label += "@" + hour + ampm;
            res[label] = v;
            return res;
          }, {});
          return cb(null, result);
        };
      })(this));
    };

    return Pacing;

  })();

  if (!module.parent) {
    pacing = new Pacing;
    pacing.add({
      event: 'search_impressionx'
    }, function() {
      return pacing.query({
        hours: 24,
        event: 'search_impressionx'
      }, function(e, r) {
        log(e);
        log(r);
        return exit(1);
      });
    });
  }


  /*
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
   */

}).call(this);
