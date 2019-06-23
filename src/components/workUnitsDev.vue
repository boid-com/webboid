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
  import align from "../../test/quasar-framework/src/mixins/align";

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
          rightStickyColumns: 0,
          bodyStyle: {
            maxHeight: '800px',
            color:'black',
            textAlign:'left'
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
            type: 'string',
          },
          {
            label: 'Cpu Time',
            field: 'cpuTime',
            width: '200px',
            filter: true,
            format (value) {
              if( value >= 0 )
                return ( value === 0 )? 0 : parseFloat(value).toFixed(8);
              else
                return '';
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
                  return '';
              }
            },
            type: 'string'
          },
          {
            label: 'Power',
            field: 'power',
            filter: true,
            format( value ) {
              if( value > 0 )
                return parseFloat(value).toFixed(8);
              else if( value !== 0 )return '<p style="font-size:24px;color:blue;">'+ value +'</p>';
              else return value;
            },
            type: 'string',
            width: '140px',
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
                return '';
            },
          },
          {
            label: 'Validate State',
            field: 'validateState',
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
                  return '';
              }
            },
            type: 'string',
            width: '200px'
          },
          {
            label: 'Weight',
            field: 'weight',
            type: 'string',
            format( value ) {
              if( value > 0 )
                return parseFloat(value).toFixed(8);
              else return value;
            },
            width: '120px'
          },
          {
            label: 'Work Unit Id',
            field: 'workUnitId',
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
      // the function to sort data
      sortData: function (arrayData) {
        function compare(a, b) {
          if (a.sentTime > b.sentTime)
            return -1;
          if (a.sentTime < b.sentTime)
            return 1;
          return 0;
        }
        arrayData.sort( compare );
      },

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
        //get data from backend
        let data   = await this.$api.getWorkUnits( {'valid': param });
        this.sortData( data );
        // make the data to be displayed
        this.table_data = [];
        let current_time = new Date().getDate();
        let data_sent = 0;
        let prev_data = 0;
        data.forEach((item)=>{
          data_sent = new Date( item.sentTime ).getDate();
          if( data_sent !== prev_data )
          {
            let display_text = 'today';
            if( current_time - data_sent > 1 )
              display_text = (current_time - data_sent) + ' days ago';
            else if( current_time - data_sent > 0 )
              display_text = 'yesterday';
            else
              display_text = 'today';
            this.table_data.push({
              appName:'',
              cupTime:'',
              elapsedTime:'',
              grantedCredit:'',
              id:'',
              name:'',
              outcome:'',
              power:display_text,
              receivedTime:'',
              sentTime:'',
              serverState:'',
              validateState:'',
              weight:'',
              workUnitId:''
            });
            this.table_data.push(item);
          }else{
            this.table_data.push(item);
          }
          prev_data = data_sent;
        });
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
      this.getTableData();
    },
    async mounted(){
      setTimeout(()=>{
        if(!this.$route.query.promo || !this.$q.platform.is.desktop) return;
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
    margin:0;
  .activeTab
    margin-left:10px;
    background-color: $green-7 !important;
    color: white
</style>
