<template lang="pug">
.row.justify-center(style="height:45px; overflow:hidden" ref="hi")
  q-icon(:name="thisDevice.icon")
  div( v-if="!$parent.editName" style="padding:13px;").text-black {{thisDevice.name}}
  div(v-else)
    q-input(ref="nameBox" @keyup.enter="editDeviceName(newDeviceName)" style="width:210px; height:10px; padding:5px; margin:5px; padding-bottom:15px; " placeholder="new device name" v-model="newDeviceName")
  div(v-if="!$parent.editName")
    q-btn.infobtn(small round flat @click="enterEditMode()" style="height:25px; width:30px; margin-top:3px" )
      q-icon(name="edit" size="20px")
      q-tooltip Edit device name
  div(v-else).on-right
    q-btn.infobtn(small round color="green" @click="editDeviceName(newDeviceName)" style="height:25px; width:30px; margin-top:0px")
      q-icon(name="check" color="white" size="20px")
      q-tooltip Confirm name edit
    q-btn.infobtn.on-right(small round flat color="amber" @click="newDeviceName = '', $parent.editName = false" style="height:25px; width:30px; margin-top:5px")
      q-icon(name="close" color="red-5" size="20px")
      q-tooltip Cancel name edit 
</template>
<script>
export default {
  data(){
    return {
      newDeviceName:null,
    }
  },
  props:['thisDevice'],
  methods:{
    enterEditMode(){
      this.$parent.editName = true
      this.$nextTick( () => this.$refs.nameBox.focus())
    },
    editDeviceName: async function(name){
      try {
        this.newDeviceName = ""
        this.$parent.editName = false
        this.$parent.thisDevice.name = name
        const result = await this.$api.modifyDevice({id:this.thisDevice.id,newName:name})
        console.log(result)
        if (!result) alert('problem updating device name')
        if (result.error) alert(result.error)
        this.$parent.thisDevice = await this.$api.getDevice({id:this.thisDevice.id})
      }
      catch(error){
        alert(error)
      }
    },
  }
}
</script>
