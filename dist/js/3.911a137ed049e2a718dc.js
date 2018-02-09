webpackJsonp([3],{

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Teams_vue__ = __webpack_require__(290);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19d84254_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Teams_vue__ = __webpack_require__(306);
function injectStyle (ssrContext) {
  __webpack_require__(304)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Teams_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19d84254_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Teams_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'index',
  data: function data() {
    return {
      team: {}
    };
  },

  computed: {},
  methods: {},
  watch: {
    team: function team(val) {
      console.log('gotTeam', val);
    }
  },
  created: function created() {
    var _this = this;

    this.$e.$on('team', function (team) {
      _this.team = team;
    });
  },

  props: ['thisUser', 'api', 'authenticated']
});

/***/ }),

/***/ 304:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(305);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(268)("a0ef5366", content, true, {});

/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(267)(false);
// imports


// module
exports.push([module.i, ".q-card{padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)}.tokenimg{width:50px}", ""]);

// exports


/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"layout-padding"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding full-width",staticStyle:{}},[_c('div',{staticClass:"row justify-center gutter"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal',true)}}},[_vm._v("Join Boid")])],1)]):_vm._e(),_c('div',{staticClass:"row row-gutter"},[_c('div',{staticClass:"col"},[_c('q-card',{staticClass:"animate-scale relative-position",staticStyle:{"min-width":"300px"}},[_c('div',{staticClass:"layout-padding full-width relative-position",staticStyle:{"height":"140px"}},[_c('img',{staticClass:"absolute-center block",staticStyle:{"width":"120px","height":"120px"},attrs:{"src":_vm.team.image}})])])],1)]),_c('div',{staticClass:"row justify-center gutter"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding"},[_c('div',{staticClass:"layout-padding"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal')}}},[_vm._v("Join Boid")])],1)]):_vm._e()])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});