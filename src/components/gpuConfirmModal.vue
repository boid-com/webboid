<template lang="pug">
  div
    div(style="padding-left:20px; padding-right:20px; height:600px; overflow:hidden;").relative-position
      h4.text-red.text-center(style="padding:20px; margin-bottom:0px;") Please Read
      div(style="padding:10px;") 
        p Boid makes it very simple for you to contribute your GPU towards POW blockchains and earn rewards.
        p To enable this, we need to download GPU mining executables to your computer.
        p These executables are the only aspect of Boid that is not open-source. That means we can't guarantee to you that they are not malicious.
        p.no-margin For AMD GPUs Boid will download and run #[a(@click="ipcRenderer.send('openURL','https://bitcointalk.org/index.php?topic=5023676.0')") Wildrig]. 
        p For Nvidia GPUs Boid will download and run #[a(@click="ipcRenderer.send('openURL','https://bitcointalk.org/index.php?topic=4432704.0')") T-Rex].
        p While these GPU mining executables are widely used, there is always risks involved in operating software that is not open-sourced. 
        p Please make sure you understand the risks involved before proceeding. 
    .row.gutter.justify-center.absolute-bottom(style="bottom:50px;")
      q-btn( outline @click="$parent.close()") < Back
      q-btn.on-right( outline color="blue" @click="$root.$emit('confirmGPU',true),$parent.close()") Activate GPU
</template>
<script >
export default {
  data(){
    return {
      ipcRenderer:window.local.ipcRenderer
    }
  }
}
</script>
