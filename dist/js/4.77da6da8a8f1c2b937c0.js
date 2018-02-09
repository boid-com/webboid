webpackJsonp([4],{

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Team_vue__ = __webpack_require__(289);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4aeff4c5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Team_vue__ = __webpack_require__(303);
function injectStyle (ssrContext) {
  __webpack_require__(301)
}
var normalizeComponent = __webpack_require__(20)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Team_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4aeff4c5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Team_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'index',
  data: function data() {
    return {
      team: {
        _membersMeta: {
          count: 0
        },
        owner: {
          image: '',
          username: 'placeholder',
          tagline: '',
          powerRatings: [{
            power: 0
          }]
        }
      },
      leaderboard: []
    };
  },

  computed: {},
  methods: {
    setupLeaderboard: function () {
      var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.api.leaderboard.global(this.team.id);

              case 2:
                this.leaderboard = _context.sent;

                console.log('Team Leaderboard:', this.leaderboard);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setupLeaderboard() {
        return _ref.apply(this, arguments);
      }

      return setupLeaderboard;
    }()
  },
  watch: {
    team: function team(val) {
      console.log('gotTeam', val);
    }
  },
  created: function created() {
    var _this = this;

    this.$e.$on('team', function (team) {
      _this.team = team;
      _this.setupLeaderboard();
    });
  },

  props: ['thisUser', 'api', 'authenticated']
});

/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(302);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(268)("b2f9d4f8", content, true, {});

/***/ }),

/***/ 302:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(267)(false);
// imports


// module
exports.push([module.i, ".q-card{padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)}.tokenimg{width:50px}.user:hover{background-color:#f5f5f5}", ""]);

// exports


/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"layout-padding"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding full-width",staticStyle:{}},[_c('div',{staticClass:"row justify-center gutter"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal',true)}}},[_vm._v("Join US")])],1)]):_vm._e(),_c('div',{staticClass:"row gutter justify-center"},[_c('div',{staticClass:"col"},[_c('q-card',{staticClass:"animate-scale relative-position",staticStyle:{"min-width":"300px"}},[_c('div',{staticClass:"layout-padding full-width relative-position",staticStyle:{"height":"140px"}},[_c('img',{staticClass:"absolute-center block",staticStyle:{"width":"120px","height":"120px"},attrs:{"src":_vm.team.image}})]),_c('h5',{staticClass:"text-center"},[_vm._v(_vm._s(_vm._f("removeDash")(_vm.team.name)))]),_c('h6',{staticClass:"light-paragraph text-center"},[_vm._v(_vm._s(_vm.team.tagline))]),_c('br')])],1)]),_c('div',{staticClass:"row gutter justify-center items-stretch"},[_c('q-card',{staticClass:"animate-scale",staticStyle:{"min-width":"70px"}},[_c('div',{staticClass:"relative-position",staticStyle:{"margin":"auto","margin-top":"30px"}},[_c('p',{staticClass:"text-center",staticStyle:{"z-index":"5"}},[_vm._v(_vm._s(parseInt(_vm.team.power))),_c('q-icon',{staticClass:"text-center absolute-center",staticStyle:{"font-size":"70px","z-index":"-4"},attrs:{"color":"yellow-3","name":"flash_on"}})],1)])]),_c('q-card',{staticClass:"animate-scale",staticStyle:{"min-width":"70px"}},[_c('div',{staticClass:"relative-position",staticStyle:{"margin":"auto","margin-top":"30px"}},[_c('p',{staticClass:"text-center",staticStyle:{"z-index":"5"}},[_vm._v(_vm._s(parseInt(_vm.team._membersMeta.count))),_c('q-icon',{staticClass:"text-center absolute-center",staticStyle:{"font-size":"50px","z-index":"-4"},attrs:{"color":"green-1","name":"fa-users"}})],1)])]),(_vm.team.owner)?_c('q-card',[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Manager")]),_c('q-item',{attrs:{"highlight":"highlight","to":{name:'User',params:{username:_vm.team.owner.username}}}},[_c('q-item-side',{attrs:{"avatar":_vm.team.owner.image}}),_c('q-item-main',[_c('q-item-tile',{attrs:{"label":"label"}},[_vm._v(_vm._s(_vm.team.owner.username))]),_c('q-item-tile',{attrs:{"sublabel":"sublabel"}},[_vm._v(_vm._s(_vm.team.owner.tagline))])],1),_c('q-item-side',{attrs:{"right":"right","icon":"flash_on","stamp":""}},[_c('small',{staticClass:"text-center"},[_vm._v(_vm._s(parseInt(_vm.team.owner.powerRatings[0].power)))])])],1)],1):_vm._e()],1),_c('div',{staticClass:"row gutter justify-center"},[_c('div',{staticClass:"col"},[_c('q-card',{staticClass:"animate-scale"},[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Top Users on "+_vm._s(_vm._f("removeDash")(_vm.team.name)))]),_c('table',{staticClass:"q-table horizontal-separator",staticStyle:{"width":"100%"}},[_c('thead',[_c('tr',[_c('th'),_c('th',[_vm._v("Username")]),_c('th',[_vm._v("Power"),_c('q-icon',{attrs:{"name":"flash_on","color":"yellow"}})],1),_c('th',[_vm._v("Rank")])])]),_vm._l((_vm.leaderboard),function(user,index){return _c('tbody',{key:user.id},[_c('tr',{staticClass:"user cursor-pointer",on:{"click":function($event){_vm.$router.push({name:'User',params:{username:user.username}})}}},[_c('td',[_c('img',{staticClass:"avatar",attrs:{"src":user.image}})]),_c('td',{staticClass:"ellipsis",staticStyle:{"max-width":"20px"},attrs:{"data-th":"Username"}},[_vm._v(_vm._s(user.username)),_c('small',{staticClass:"block light-paragraph"},[_vm._v(_vm._s(user.tagline))])]),_c('td',{attrs:{"data-th":"Power"}},[_vm._v(_vm._s(parseInt(user.power)))]),_c('td',[_vm._v(_vm._s(index + 1))])])])})],2)])],1)]),_c('div',{staticClass:"row justify-center gutter"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding"},[_c('div',{staticClass:"layout-padding"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal')}}},[_vm._v("Join US")])],1)]):_vm._e()])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});