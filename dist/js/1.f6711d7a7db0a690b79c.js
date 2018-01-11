webpackJsonp([1],{

/***/ 266:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Device_vue__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c4303a6e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Device_vue__ = __webpack_require__(275);
function injectStyle (ssrContext) {
  __webpack_require__(272)
}
var normalizeComponent = __webpack_require__(19)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c4303a6e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Device_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c4303a6e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_Device_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  icon: function icon(device) {
    if (device.type === 'BROWSER') return 'tab';else if (device.type === 'DESKTOP') return 'flash_on';else if (device.type === 'MOBILE') return 'phone_android';else return 'add';
  },
  color: function color(device) {
    if (device.status === 'OFFLINE') return 'grey';else if (device.status === 'ONLINE') return 'blue';else if (device.status === 'ACTIVE') return 'green';
  }
});

/***/ }),

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(273);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(265)("4a2b2840", content, true);

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(264)(undefined);
// imports


// module
exports.push([module.i, ".layout-padding[data-v-c4303a6e]{max-width:700px}", ""]);

// exports


/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_src_lib_parseDevice__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_quasar__ = __webpack_require__(12);







/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            parseDevice: __WEBPACK_IMPORTED_MODULE_2_src_lib_parseDevice__["a" /* default */],
            thisDevice: {
                name: "",
                power: "",
                status: "",
                id: "",
                meta: {},
                icon: "",
                type: ""

            },
            pending: false,
            toggle: false
        };
    },

    computed: {},
    methods: {},
    props: ["thisUser", "authenticated", "api", "deviceId", "thisModal", "ch"],
    mounted: function mounted() {},

    watch: {
        deviceId: function () {
            var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(value) {
                return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!value) {
                                    _context.next = 8;
                                    break;
                                }

                                this.pending = true;
                                _context.next = 4;
                                return this.api.device.get(this.deviceId);

                            case 4:
                                this.thisDevice = _context.sent;

                                if (this.thisDevice.status == "ACTIVE") this.toggle = true;
                                this.thisDevice.icon = __WEBPACK_IMPORTED_MODULE_2_src_lib_parseDevice__["a" /* default */].icon(this.thisDevice);
                                this.pending = false;

                            case 8:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function deviceId(_x) {
                return _ref.apply(this, arguments);
            }

            return deviceId;
        }(),
        toggle: function () {
            var _ref2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(value) {
                return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.log(value);
                                this.$e.$emit('ch.toggle', value);

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function toggle(_x2) {
                return _ref2.apply(this, arguments);
            }

            return toggle;
        }()
    }
});

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-transition',{attrs:{"appear":"appear","enter":"fadeIn","leave":"fadeOut"}},[_c('div',{staticClass:"layout-padding relative-position"},[_c('h5',{staticClass:"text-center"},[_vm._v("Configure Device")]),_c('p',{staticClass:"text-center inline"},[_vm._v(_vm._s(_vm.thisDevice.name)),_c('q-icon',{staticClass:"on-right",attrs:{"name":_vm.thisDevice.icon,"color":_vm.parseDevice.color(_vm.thisDevice)}})],1),_c('q-alert',{attrs:{"color":"green","icon":"info","enter":"fadeIn","leave":"fadeOut","dismissible":"dismissible"}},[_c('p',[_vm._v("You can manaully configure the secure applications which Boid will run on this device.")])]),_c('p',{staticClass:"light-paragraph text-center"}),_c('div',{staticClass:"text-center",staticStyle:{"margin-top":"10px"}},[_c('q-btn',{attrs:{"color":"blue"},on:{"click":function($event){_vm.thisModal.close()}}},[_vm._v("finished")])],1),_c('q-inner-loading',{attrs:{"visible":_vm.pending}},[_c('q-spinner-ball',{attrs:{"size":"70px","color":"blue"}})],1)],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});