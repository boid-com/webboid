webpackJsonp([2],{

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_User_vue__ = __webpack_require__(291);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cafe790_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_User_vue__ = __webpack_require__(309);
function injectStyle (ssrContext) {
  __webpack_require__(307)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_User_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cafe790_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_User_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_quasar__ = __webpack_require__(10);




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'index',
  data: function data() {
    return {
      openURL: __WEBPACK_IMPORTED_MODULE_0_quasar__["openURL"]
    };
  },

  computed: {
    myProfile: function myProfile() {
      if (this.thisUser && this.thatUser) {
        return this.thisUser.id === this.thatUser.id;
      } else return false;
    }
  },
  methods: {},
  watch: {
    'thatUser': function thatUser() {
      console.log('thatUser', this.thatUser);
    },

    "thisUser": function thisUser(val, oldVal) {
      var _this = this;

      if (val.username != oldVal.username && this.myProfile && this.$route.params.username) {
        setTimeout(function () {
          _this.$router.push({ name: "User", params: { username: _this.thisUser.username } });
        }, 1000);
      }
    }

  },
  created: function created() {
    var _this2 = this;

    this.$e.$on('userUpdated', function () {
      console.log('userUpdated', _this2.myProfile, _this2.$route.params.username);
    });
  },

  props: ['thisUser', 'thatUser', 'api', 'authenticated']
});

/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(308);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(268)("4dccb50e", content, true, {});

/***/ }),

/***/ 308:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(267)(false);
// imports


// module
exports.push([module.i, ".q-card{padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)}.tokenimg{width:50px}", ""]);

// exports


/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.thatUser.id)?_c('div',{staticClass:"layout-padding"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding full-width",staticStyle:{}},[_c('div',{staticClass:"row justify-center gutter"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal',true)}}},[_vm._v("Join Boid")])],1)]):_vm._e(),_c('div',{staticClass:"row row-gutter"},[_c('div',{staticClass:"col"},[_c('q-card',{staticClass:"animate-scale relative-position",staticStyle:{"min-width":"300px"}},[_c('div',{staticClass:"layout-padding full-width relative-position",staticStyle:{"height":"140px"}},[(_vm.myProfile)?_c('img',{staticClass:"avatar absolute-center block",staticStyle:{"width":"120px","height":"120px"},attrs:{"src":_vm.thisUser.image}}):_c('img',{staticClass:"avatar absolute-center block",staticStyle:{"width":"120px","height":"120px"},attrs:{"src":_vm.thatUser.image}})]),(_vm.myProfile)?_c('h5',{staticClass:"text-center"},[_vm._v(_vm._s(_vm.thisUser.username))]):_c('h5',{staticClass:"text-center"},[_vm._v(_vm._s(_vm.thatUser.username))]),(!_vm.myProfile)?_c('div',[(_vm.thatUser.tagline)?_c('div',{staticClass:"tagline"},[_c('h6',{staticClass:"light-paragraph text-center"},[_vm._v(_vm._s(_vm.thatUser.tagline))])]):(_vm.myProfile)?_c('div',{staticClass:"tagline"},[_c('h6',{staticClass:"light-paragraph text-center"},[_vm._v("add a cool tagline here")])]):_vm._e()]):_c('div',[(_vm.thisUser.tagline)?_c('div',{staticClass:"tagline"},[_c('h6',{staticClass:"light-paragraph text-center"},[_vm._v(_vm._s(_vm.thisUser.tagline))])]):_vm._e()])]),(_vm.myProfile)?_c('div',{staticStyle:{"margin":"8px","margin-bottom":"0px"}},[_c('q-btn',{staticClass:"full-width",attrs:{"color":"blue"},on:{"click":function($event){_vm.$e.$emit('openProfileEditModal')}}},[_vm._v("Update Profile")])],1):_vm._e(),_c('div',{staticClass:"row"},[(_vm.thatUser.powerRatings)?_c('q-card',{staticClass:"animate-scale relative-position"},[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Power Rating")]),_c('div',{staticStyle:{"margin":"auto"}},[_c('p',{staticClass:"text-center"},[_vm._v(_vm._s(parseInt(_vm.thatUser.powerRatings[0].power))),_c('q-icon',{staticClass:"text-center",staticStyle:{"font-size":"50px"},attrs:{"color":"yellow","name":"flash_on"}})],1)])]):_vm._e(),(_vm.thatUser.powerRatings)?_c('q-card',{staticClass:"animate-scale relative-position"},[_c('p',{staticClass:"light-paragraph text-center"},[_vm._v("Social")]),_c('div',{staticStyle:{"margin":"auto"}},[_c('h5',{staticClass:"text-center light-paragraph"},[_vm._v(_vm._s(_vm.thatUser._invitedMeta.count))]),_c('p',{staticClass:"text-center"},[_vm._v("Invited Users")])]),(_vm.myProfile)?_c('q-btn',{staticClass:"full-width",attrs:{"color":"green"},on:{"click":function($event){_vm.$e.$emit('openSocialModal')}}},[_vm._v("Get Invite Link")]):_vm._e()],1):_vm._e(),(_vm.thatUser.team)?_c('q-card',{staticClass:"animate-scale relative-position"},[_c('div',{staticClass:"light-paragraph text-center"},[_vm._v("My Team")]),_c('table',{staticClass:"q-table",staticStyle:{"width":"100%"}},[_c('tbody',[_c('tr',[_c('td',[_c('img',{staticClass:"tokenimg",attrs:{"src":_vm.thatUser.team.image}})]),_c('td',[_vm._v(_vm._s(_vm.thatUser.team.name))])])])]),(_vm.thatUser.team.meta.social.telegram)?_c('q-btn',{staticClass:"full-width",attrs:{"color":"blue","outline":"outline"},on:{"click":function($event){_vm.openURL(_vm.thatUser.team.meta.social.telegram)}}},[_vm._v("Telegram Chat")]):_vm._e(),(_vm.thatUser.team.meta.social.facebook)?_c('q-btn',{staticClass:"full-width",attrs:{"color":"blue","outline":"outline"},on:{"click":function($event){_vm.openURL(_vm.thatUser.team.meta.social.facebook)}}},[_vm._v("Facebook Group")]):_vm._e()],1):_vm._e()],1)],1)]),_c('div',{staticClass:"row justify-center gutter"},[(!_vm.authenticated)?_c('div',{staticClass:"layout-padding"},[_c('div',{staticClass:"layout-padding"},[_c('q-btn',{staticStyle:{"font-size":"35px"},attrs:{"big":"big","rounded":"rounded","push":"push","glossy":"glossy","color":"green"},on:{"click":function($event){_vm.$e.$emit('openAuthModal')}}},[_vm._v("Join Boid")])],1)]):_vm._e()])]):_vm._e()}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});