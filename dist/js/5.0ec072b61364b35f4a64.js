webpackJsonp([5],{

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Leaderboards_vue__ = __webpack_require__(278);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_70a94978_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Leaderboards_vue__ = __webpack_require__(285);
function injectStyle (ssrContext) {
  __webpack_require__(283)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Leaderboards_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_70a94978_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Leaderboards_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 278:
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

  props: ['thisUser', 'api', 'authenticated', 'leaderboard', 'teamLeaderboard']
});

/***/ }),

/***/ 283:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(284);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(268)("04091242", content, true, {});

/***/ }),

/***/ 284:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(267)(false);
// imports


// module
exports.push([module.i, ".q-card{padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)}.tokenimg{width:50px}.user:hover{background-color:#f5f5f5}", ""]);

// exports


/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"row justify-center"},[_c('q-card',{staticClass:"animate-scale"},[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Top Users")]),_c('table',{staticClass:"q-table horizontal-separator",staticStyle:{"width":"100%"}},[_c('thead',[_c('tr',[_c('th'),_c('th',[_vm._v("Username")]),_c('th',[_vm._v("Power"),_c('q-icon',{attrs:{"name":"flash_on","color":"yellow"}})],1),_c('th',[_vm._v("Rank")])])]),_vm._l((_vm.leaderboard),function(user,index){return _c('tbody',{key:user.id},[_c('tr',{staticClass:"user cursor-pointer",on:{"click":function($event){_vm.$router.push({name:'User',params:{username:user.username}})}}},[_c('td',[_c('img',{staticClass:"avatar",attrs:{"src":user.image}})]),_c('td',{staticClass:"ellipsis",staticStyle:{"max-width":"20px"},attrs:{"data-th":"Username"}},[_vm._v(_vm._s(user.username)),_c('small',{staticClass:"block light-paragraph"},[_vm._v(_vm._s(user.tagline))])]),_c('td',{attrs:{"data-th":"Power"}},[_vm._v(_vm._s(parseInt(user.power)))]),_c('td',[_vm._v(_vm._s(index + 1))])])])})],2)]),_c('q-card',{staticClass:"animate-scale"},[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Top Teams")]),_c('table',{staticClass:"q-table horizontal-separator",staticStyle:{"width":"100%"}},[_c('thead',[_c('tr',[_c('th'),_c('th'),_c('th',[_vm._v("Power"),_c('q-icon',{attrs:{"name":"flash_on","color":"yellow"}})],1),_c('th',[_vm._v("Rank")])])]),_vm._l((_vm.teamLeaderboard),function(team,index){return _c('tbody',{key:team.id},[_c('tr',{staticClass:"user cursor-pointer",on:{"click":function($event){_vm.$router.push({name:'Team',params:{teamname:team.name}})}}},[_c('td',[_c('img',{staticClass:"tokenimg",attrs:{"src":team.image}})]),_c('td',{staticClass:"ellipsis",staticStyle:{"max-width":"120px"}},[_vm._v(_vm._s(_vm._f("removeDash")(team.name)))]),_c('td',{attrs:{"data-th":"Power"}},[_vm._v(_vm._s(parseInt(team.power)))]),_c('td',[_vm._v(_vm._s(index + 1))])])])})],2)])],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});