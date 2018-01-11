webpackJsonp([3],{

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Error404_vue__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7d05ee75_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Error404_vue__ = __webpack_require__(283);
function injectStyle (ssrContext) {
  __webpack_require__(280)
}
var normalizeComponent = __webpack_require__(19)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Error404_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7d05ee75_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Error404_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(281);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(265)("4f3a736c", content, true);

/***/ }),

/***/ 281:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(264)(undefined);
// imports


// module
exports.push([module.i, ".error-page .error-code{height:50vh;width:100%;padding-top:15vh;color:hsla(0,0%,100%,.2);overflow:hidden}@media (orientation:landscape){.error-page .error-code{font-size:30vw}}@media (orientation:portrait){.error-page .error-code{font-size:30vh}}.error-page .error-card{border-radius:2px;margin-top:-50px;width:80vw;max-width:600px;padding:25px}.error-page .error-card>i{font-size:5rem}", ""]);

// exports


/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_quasar__ = __webpack_require__(12);




/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    QBtn: __WEBPACK_IMPORTED_MODULE_0_quasar__["QBtn"],
    QIcon: __WEBPACK_IMPORTED_MODULE_0_quasar__["QIcon"]
  },
  data: function data() {
    return {
      canGoBack: window.history.length > 1
    };
  },

  methods: {
    goBack: function goBack() {
      window.history.go(-1);
    }
  }
});

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"error-page window-height window-width bg-light column items-center no-wrap"},[_c('div',{staticClass:"error-code bg-primary flex items-center content-center justify-center"},[_vm._v("\n    404\n  ")]),_vm._v(" "),_c('div',[_c('div',{staticClass:"error-card shadow-4 bg-white column items-center justify-center no-wrap"},[_c('q-icon',{attrs:{"name":"error_outline","color":"grey-5"}}),_vm._v(" "),_c('p',{staticClass:"caption text-center"},[_vm._v("Oops. Nothing here...")]),_vm._v(" "),_c('p',{staticClass:"text-center group"},[(_vm.canGoBack)?_c('q-btn',{attrs:{"color":"primary","push":"","icon":"keyboard_arrow_left"},on:{"click":_vm.goBack}},[_vm._v("\n          Go back\n        ")]):_vm._e(),_vm._v(" "),_c('q-btn',{attrs:{"color":"primary","push":"","icon-right":"home"},on:{"click":function($event){_vm.$router.replace('/')}}},[_vm._v("\n          Go home\n        ")])],1)],1)])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});