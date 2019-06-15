<template lang="pug" >
  .div(class="layout-padding")
    h5 Work Units Devices
    .row.full-width
      q-btn(flat :class="{activeTab: click_valid===false}"  style="background:#ddca43; margin-left:10px;" @click="()=>getTableData('valid', 1 )") View valid All
      <!--q-btn(flat :class="{activeTab: true}" @click="()=>getTableData('valid', 2  )") View Invalid-->
      q-btn(flat :class="{activeTab: click_invalid===false}" style="background:#ddca43; margin-left:10px;" @click="()=>getTableData('valid', 0 )") View Pending
    .row
      q-data-table( :data="table_data"
      :config="config"
      :columns="columns"
      @refresh="refresh"
      @selection="selection"
      @rowclick="rowClick"
      style="text-align:center; overflow-x:auto;"
      )
      template(slot="col-outcome" slot-scope="cell")
        div(v-if="cell.data === '3'" class="my-label text-white bg-primary") Audit
          q-tooltip Some data
        div(v-else class="my-label text-white bg-negative") {{cell.data}}
</template>
<script>
  import { openURL } from 'quasar'

  export default {
    name: 'index',
    components:{},
    data () {
      return {
        openURL,
        click_valid: false,
        click_invalid:false,
        click_pending: false,
        table_data:[],
        config: {
          title: '',
          refresh: false,
          noHeader: false,
          columnPicker: false,
          leftStickyColumns: 0,
          rightStickyColumns: 2,
          bodyStyle: {
            maxHeight: '500px',
            color:'blue'
          },
          rowHeight: '50px',
          responsive: true,
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30, 50, 100]
          },
          selection: null
        },
        columns: [
          {
            label: 'Name',
            field: 'name',
            width: '200px',
            filter: true,
            sort: true,
            type: 'string',
          },
          {
            label: 'Cpu Time',
            field: 'cpuTime',
            width: '200px',
            filter: true,
            sort (a, b) {
              return (new Date(a)) - (new Date(b))
            },
            format (value) {
              let dataDiff = new Date() - new Date(value);
              let hours = parseInt(dataDiff / 3600 );
              return hours.toString() + 'hours past';
            }
          },
          {
            label: 'Elapse Time',
            field: 'elapsedTime',
            width: '140px',
            format( value ) {
              if( value > 0 )
                return parseFloat(value).toFixed(8);
              else return value;
            },
            type: 'number',
          },
          {
            label: 'Out Come',
            field: 'outcome',
            width: '120px',
            sort: true,
            filter: true,
            format( value ) {
              switch (value) {
                case 1:
                  return 'success';
                case 3:
                  return 'error';
                case 4:
                  return 'no reply';
                case 6:
                  return 'validation';
                case 7:
                  return 'abandoned';
                default:
                  return 'incorrect reply';
              }
            },
            type: 'string'
          },
          {
            label: 'Power',
            field: 'power',
            filter: true,
            sort: true,
            type: 'number',
            width: '140px',
          },
          {
            label: 'Time State',
            field: 'sentTime',
            width: '140px',
            format (value) {
              let days = new Date().getDate() - new Date(value).getDate();
              if( days > 1 )
                return days.toString() + 'days ago';
              else if( days > 0 )
                return 'yesterday';
              else
                return 'today';
            }
          },
          {
            label: 'Server State',
            field: 'serverState',
            width: '120px',
            format (value) {
              if (value === 4)
                return 'in-progress';
              else if( value === 5 )
                return 'reported';
              else
                return 'unknown value';
            },
          },
          {
            label: 'Updated At',
            field: 'updatedAt',
            width: '200px',
            filter: true,
            sort: true,
            type: 'string',
          },
          {
            label: 'Validate State',
            field: 'validateState',
            sort: true,
            format(value){
              switch ( value ){
                case 0:
                  return 'pending validation';
                case 1:
                  return 'valid';
                case 2:
                  return 'invalid';
                case 4:
                  return 'pending verification';
                case 5:
                  return 'results failed to given deadline';
                default:
                  return 'unknown result';
              }
            },
            type: 'string',
            width: '200px'
          },
          {
            label: 'Weight',
            field: 'weight',
            sort: true,
            type: 'string',
            width: '120px'
          },
          {
            label: 'Work Unit Id',
            field: 'workUnitId',
            sort: true,
            type: 'string',
            width: '120px'
          }
        ],
      }
    },
    computed: {
    },
    methods: {
      openURL,
      getTableData: async function ( key, param ){
        if( key === 'valid' ){
          if( param === 0 ){
            this.click_valid   = false;
            this.click_invalid = true;
          }else if( param === 1 ){
            this.click_valid   = true;
            this.click_invalid = false;
          }
        }
        this.table_data   = await this.$api.getWorkUnits( {'valid': param });
      }
    },
    watch:{
      pagination (value) {
        if (!value) {
          this.oldPagination = clone(this.config.pagination);
          this.config.pagination = false;
          return
        }
        this.config.pagination = this.oldPagination
      },
      rowHeight (value) {
        this.config.rowHeight = value + 'px'
      },
      bodyHeight (value) {
        let style = {};
        if (this.bodyHeightProp !== 'auto') {
          style[this.bodyHeightProp] = value + 'px'
        }
        this.config.bodyStyle = style
      },
      bodyHeightProp (value) {
        let style = {};
        if (value !== 'auto') {
          style[value] = this.bodyHeight + 'px'
        }
        this.config.bodyStyle = style
      },
    },
    async created(){
      this.table_data   = await this.$api.getWorkUnits();
    },
    async mounted(){
      setTimeout(()=>{
        if(!this.$route.query.promo | !this.$q.platform.is.desktop) return
        window.scrollTo({
          top: 500,
          left: 0,
          behavior: 'smooth'
        })
      },500)
    },
    destroyed(){
      // this.$e.$off('user')
    },
    props:['thisUser','thatUser','api','authenticated'],
  }
</script>
<style lang="stylus">
  @import '~variables'
  .my-label
    padding 5px
    border-radius 3px
    display inline-block
  input.q-input-target
    padding-top 0 !important
  .q-if
    padding: 0;
    padding-top: 0;
    margin:0;
  .activeTab
    margin-left:10px;
    background-color: $green-7 !important;
    color: white

</style>
