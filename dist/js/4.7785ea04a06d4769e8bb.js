webpackJsonp([4],{274:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e(300),i=e(301);var r=function(t){e(298)},n=e(19)(s.a,i.a,!1,r,null,null);a.default=n.exports},298:function(t,a,e){var s=e(299);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);e(268)("4d7216e3",s,!0)},299:function(t,a,e){(t.exports=e(267)(void 0)).push([t.i,".q-card{padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)}.tokenimg{width:50px}.user:hover{background-color:#f5f5f5}",""])},300:function(t,a,e){"use strict";var s=e(13),i=e.n(s),r=e(14),n=e.n(r);a.a={name:"index",data:function(){return{team:{_membersMeta:{count:0},owner:{image:"",username:"placeholder",tagline:"",powerRatings:[{power:0}]}},leaderboard:[]}},computed:{},methods:{setupLeaderboard:function(){var t=n()(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.api.leaderboard.global(this.team.id);case 2:this.leaderboard=t.sent,console.log("Team Leaderboard:",this.leaderboard);case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()},watch:{team:function(t){console.log("gotTeam",t)}},created:function(){var t=this;this.$e.$on("team",function(a){t.team=a,t.setupLeaderboard()})},props:["thisUser","api","authenticated"]}},301:function(t,a,e){"use strict";var s={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"layout-padding"},[t.authenticated?t._e():e("div",{staticClass:"layout-padding full-width",staticStyle:{}},[e("div",{staticClass:"row justify-center gutter"},[e("q-btn",{staticStyle:{"font-size":"35px"},attrs:{big:"big",rounded:"rounded",push:"push",glossy:"glossy",color:"green"},on:{click:function(a){t.$e.$emit("openAuthModal",!0)}}},[t._v("Join Boid")])],1)]),e("div",{staticClass:"row row-gutter"},[e("div",{staticClass:"col"},[e("q-card",{staticClass:"animate-scale relative-position",staticStyle:{"min-width":"300px"}},[e("div",{staticClass:"layout-padding full-width relative-position",staticStyle:{height:"140px"}},[e("img",{staticClass:"absolute-center block",staticStyle:{width:"120px",height:"120px"},attrs:{src:t.team.image}})]),e("h5",{staticClass:"text-center"},[t._v(t._s(t._f("removeDash")(t.team.name)))]),e("h6",{staticClass:"light-paragraph text-center"},[t._v(t._s(t.team.tagline))]),e("br")])],1)]),e("div",{staticClass:"row items-stretch"},[e("q-card",{staticClass:"animate-scale",staticStyle:{"min-width":"70px"}},[e("div",{staticClass:"relative-position",staticStyle:{margin:"auto","margin-top":"30px"}},[e("p",{staticClass:"text-center",staticStyle:{"z-index":"5"}},[t._v(t._s(parseInt(t.team.power))),e("q-icon",{staticClass:"text-center absolute-center",staticStyle:{"font-size":"70px","z-index":"-4"},attrs:{color:"yellow-3",name:"flash_on"}})],1)])]),e("q-card",{staticClass:"animate-scale",staticStyle:{"min-width":"70px"}},[e("div",{staticClass:"relative-position",staticStyle:{margin:"auto","margin-top":"30px"}},[e("p",{staticClass:"text-center",staticStyle:{"z-index":"5"}},[t._v(t._s(parseInt(t.team._membersMeta.count))),e("q-icon",{staticClass:"text-center absolute-center",staticStyle:{"font-size":"50px","z-index":"-4"},attrs:{color:"grey-2",name:"fa-users"}})],1)])]),e("q-card",[e("p",{staticClass:"light-paragraph text-center"},[t._v("Manager")]),e("q-item",{attrs:{highlight:"highlight",to:{name:"User",params:{username:t.team.owner.username}}}},[e("q-item-side",{attrs:{avatar:t.team.owner.image}}),e("q-item-main",[e("q-item-tile",{attrs:{label:"label"}},[t._v(t._s(t.team.owner.username))]),e("q-item-tile",{attrs:{sublabel:"sublabel"}},[t._v(t._s(t.team.owner.tagline))])],1),e("q-item-side",{attrs:{right:"right",icon:"flash_on",stamp:""}},[e("small",{staticClass:"text-center"},[t._v(t._s(parseInt(t.team.owner.powerRatings[0].power)))])])],1)],1)],1),e("div",{staticClass:"row"},[e("div",{staticClass:"col"},[e("q-card",{staticClass:"animate-scale"},[e("p",{staticClass:"light-paragraph text-center"},[t._v("Top Users on "+t._s(t._f("removeDash")(t.team.name)))]),e("table",{staticClass:"q-table horizontal-separator",staticStyle:{width:"100%"}},[e("thead",[e("tr",[e("th"),e("th",[t._v("Username")]),e("th",[t._v("Power"),e("q-icon",{attrs:{name:"flash_on",color:"yellow"}})],1),e("th",[t._v("Rank")])])]),t._l(t.leaderboard,function(a,s){return e("tbody",{key:a.id},[e("tr",{staticClass:"user cursor-pointer",on:{click:function(e){t.$router.push({name:"User",params:{username:a.username}})}}},[e("td",[e("img",{staticClass:"avatar",attrs:{src:a.image}})]),e("td",{staticClass:"ellipsis",staticStyle:{"max-width":"20px"},attrs:{"data-th":"Username"}},[t._v(t._s(a.username)),e("small",{staticClass:"block light-paragraph"},[t._v(t._s(a.tagline))])]),e("td",{attrs:{"data-th":"Power"}},[t._v(t._s(parseInt(a.power)))]),e("td",[t._v(t._s(s+1))])])])})],2)])],1),e("div",{staticClass:"row justify-center gutter"},[t.authenticated?t._e():e("div",{staticClass:"layout-padding"},[e("div",{staticClass:"layout-padding"},[e("q-btn",{staticStyle:{"font-size":"35px"},attrs:{big:"big",rounded:"rounded",push:"push",glossy:"glossy",color:"green"},on:{click:function(a){t.$e.$emit("openAuthModal")}}},[t._v("Join Boid")])],1)])])])])},staticRenderFns:[]};a.a=s}});