<template lang="pug" >
  .div(class="layout-padding")
    .row
      h5 Work Units Devices
      q-data-table( :data="table_workunits"
      :config="config1"
      :columns="columns"
      @refresh="refresh"
      @selection="selection"
      @rowclick="rowClick"
      style="text-align:center"
      )

    .row
      h5 Pendding Devices
      q-data-table( :data="table_pending"
      :config="config2"
      :columns="columns"
      @refresh="refresh"
      @selection="selection"
      @rowclick="rowClick"
      style="text-align:center"
      )
</template>
<script>
  import { openURL } from 'quasar'

  export default {
    name: 'index',
    components:{},
    data () {
      return {
        openURL,
        table_pending:[],
        table_workunits:[],
        config1: {
          title: '',
          refresh: true,
          noHeader: false,
          columnPicker: true,
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
          selection: 'multiple'
        },
        config2: {
          title: '',
          refresh: true,
          noHeader: false,
          columnPicker: true,
          leftStickyColumns: 0,
          rightStickyColumns: 2,
          bodyStyle: {
            maxHeight: '500px',
          },
          rowHeight: '50px',
          responsive: true,
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30, 50, 100]
          },
          selection: 'multiple'
        },
        columns: [
          {
            label: 'Id',
            field: 'id',
            width: '140px',
            filter: true,
            sort (a, b) {
              return (a) - (b)
            },
          },
          {
            label: 'Name',
            field: 'name',
            width: '140px',
            filter: true,
            sort: true,
            type: 'string',
            // width: '500px'
          },
          {
            label: 'Device Id',
            field: 'deviceId',
            width: '140px',
            filter: true,
            sort (a, b) {
              return (a) - (b)
            },
          },
          {
            label: 'Cpu Time',
            field: 'cpuTime',
            width: '140px',
            // classes: 'bg-orange-2',
            filter: true,
            sort (a, b) {
              return (new Date(a)) - (new Date(b))
            },
            format (value) {
              return new Date(value).toLocaleString()
            }
          },
          {
            label: 'Elapse Time',
            field: 'elapsedTime',
            width: '140px',
            // classes: 'bg-orange-2',
            type: 'number',
          },
          {
            label: 'Granted Credit',
            width: '140px',
            field: 'grantedCredit',
          },
          {
            label: 'Out Come',
            field: 'outcome',
            width: '120px',
            sort: true,
            type: 'string'
          },
          {
            label: 'Power',
            field: 'power',
            filter: true,
            sort: true,
            type: 'number',
          },
          {
            label: 'Sent Time',
            field: 'sentTime',
            width: '140px',
            format (value) {
              return new Date(value).toLocaleString()
            }
          },
          {
            label: 'Receiver Time',
            field: 'receivedTime',
            width: '140px',
            format (value) {
              return new Date(value).toLocaleString()
            }
          },
          {
            label: 'Server State',
            field: 'serverState',
            width: '120px',
            format (value) {
              if (value === 'Informational') {
                return '<i class="material-icons text-positive" style="font-size: 22px">info</i>'
              }
              return value
            },
          },
          {
            label: 'Updated At',
            field: 'updatedAt',
            width: '120px',
            filter: true,
            sort: true,
            type: 'string',
          },
          {
            label: 'Validate State',
            field: 'validateState',
            sort: true,
            type: 'string',
            width: '140px'
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
      }
    },
    async created(){
      this.table_pending   = await this.$api.getWorkUnits({skip:2,valid:'WU'});
      console.log("TABLE_PENDDING>>>>", this.table_pending);
      this.table_workunits = await this.$api.getWorkUnits({skip:2});
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
<style lang="stylus" scoped>
  @import '~variables'
  .my-label
    padding 5px
    border-radius 3px
    display inline-block
</style>
