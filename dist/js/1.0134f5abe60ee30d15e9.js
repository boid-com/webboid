webpackJsonp([1],{246:function(t,e,i){"use strict";function n(t){i(252)}Object.defineProperty(e,"__esModule",{value:!0});var a=i(254),s=i(255),r=i(19),c=n,o=r(a.a,s.a,!1,c,"data-v-c4303a6e",null);e.default=o.exports},251:function(t,e,i){"use strict";e.a={icon:function(t){return"BROWSER"===t.type?"tab":"DESKTOP"===t.type?"flash_on":"MOBILE"===t.type?"phone_android":"add"},color:function(t){return"OFFLINE"===t.status?"grey":"ONLINE"===t.status?"blue":"ACTIVE"===t.status?"green":void 0}}},252:function(t,e,i){var n=i(253);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i(245)("4a2b2840",n,!0)},253:function(t,e,i){e=t.exports=i(244)(void 0),e.push([t.i,".layout-padding[data-v-c4303a6e]{max-width:700px}",""])},254:function(t,e,i){"use strict";var n=i(13),a=i.n(n),s=i(14),r=i.n(s),c=i(251);i(12);e.a={data:function(){return{parseDevice:c.a,thisDevice:{name:"",power:"",status:"",id:"",meta:{},icon:"",type:""},pending:!1,toggle:!1}},computed:{},methods:{},props:["thisUser","authenticated","api","deviceId","thisModal","ch"],mounted:function(){},watch:{deviceId:function(){function t(t){return e.apply(this,arguments)}var e=r()(a.a.mark(function t(e){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=8;break}return this.pending=!0,t.next=4,this.api.device.get(this.deviceId);case 4:this.thisDevice=t.sent,"ACTIVE"==this.thisDevice.status&&(this.toggle=!0),this.thisDevice.icon=c.a.icon(this.thisDevice),this.pending=!1;case 8:case"end":return t.stop()}},t,this)}));return t}(),toggle:function(){function t(t){return e.apply(this,arguments)}var e=r()(a.a.mark(function t(e){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:console.log(e),this.$e.$emit("ch.toggle",e);case 2:case"end":return t.stop()}},t,this)}));return t}()}}},255:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-transition",{attrs:{appear:"appear",enter:"fadeIn",leave:"fadeOut"}},[i("div",{staticClass:"layout-padding relative-position"},[i("h5",{staticClass:"text-center"},[t._v("Configure Device")]),i("p",{staticClass:"text-center inline"},[t._v(t._s(t.thisDevice.name)),i("q-icon",{staticClass:"on-right",attrs:{name:t.thisDevice.icon,color:t.parseDevice.color(t.thisDevice)}})],1),i("q-alert",{attrs:{color:"green",icon:"info",enter:"fadeIn",leave:"fadeOut",dismissible:"dismissible"}},[i("p",[t._v("You can manaully configure the secure applications which Boid will run on this device.")])]),i("p",{staticClass:"light-paragraph text-center"}),i("div",{staticClass:"text-center",staticStyle:{"margin-top":"10px"}},[i("q-btn",{attrs:{color:"blue"},on:{click:function(e){t.thisModal.close()}}},[t._v("finished")])],1),i("q-inner-loading",{attrs:{visible:t.pending}},[i("q-spinner-ball",{attrs:{size:"70px",color:"blue"}})],1)],1)])},a=[],s={render:n,staticRenderFns:a};e.a=s}});