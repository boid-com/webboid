<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data(){
    return{
      options:{
        devicePixelRatio:1,
        responsive: true,
        maintainAspectRatio: false,
        tooltips:{
          titleFontSize:20,
          bodyFontSize:20,
          bodySpacing:4,
          xPadding:10
        },
        legend:{position:"bottom", display:true,labels:{
          fontSize:18,
          boxWidth:40,
          onClick(data){
            this.$emit('legend-clicked',data)
          }
          }},
        scales:{
          xAxes:[
            { scaleLabel:{
              display:true,
              fontSize:20,
              lineHeight:0,
              padding:15
            },
              display:true,
              weight:1,
              gridLines:{
                drawOnChartArea:true,
                drawBorder:false
              }
            }
          ],
          yAxes:[
            {
              display: true,
              position: 'left',
              type: 'linear',
              id: 'y-axis-1',
              ticks: {
                fontColor:"rgb(244, 178, 56)",
                fontSize:16,
                stepSize: 50000,
                padding: 10
              }
            }, {
              ticks: {
                stepSize: 5,
                padding: 10,
                fontSize:16,
                fontColor:"#089cfc"
              },
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-axis-2',
              gridLines: {
                drawOnChartArea: false
              },
            }
          ]
        }
      }
    }
  },
  props: ['chartData'],
  mounted () {
    var data = this.chartData.datasets[0].data
    var data2 = this.chartData.datasets[1].data
    // console.log(data)
    this.chartData.datasets[0] = {
      label:"Boid Power",
      pointRadius:3,
      pointBackgroundColor:"rgb(244, 178, 56)",
      pointHoverRadius:5,
      borderColor:"rgb(244, 178, 56)",
      borderWidth:4,
      fill:false,
      yAxisID:'y-axis-1',
      data
    }
    this.chartData.datasets[1] = {
      label:"Active Users",
      pointRadius:3,
      pointBackgroundColor:"rgb(16, 140, 242)",
      pointHoverRadius:5,
      pointColor:"rgb(16, 140, 242)",
      borderColor:"rgb(16, 140, 242)",
      borderWidth:4,
      fill:false,
      yAxisID:'y-axis-2',
      data:data2
    }
    // console.log(data2)
    this.renderChart(this.chartData, this.options)

  },
  watch:{
    height(){
      this.renderChart(this.chartData, this.options)
    },
    chartData(data){
      // // console.log(data)
      // if (!data) return
      // var data = data.datasets[0].data
      // // console.log(data)
      // return
      // this.chartData.datasets[0] = {
      //   label:"Boid Power",
      //   pointRadius:5,
      //   pointBackgroundColor:"#ffcc00",
      //   pointHoverRadius:5,
      //   pointColor:"#089cfc",
      //   borderColor:"#ffcc00",
      //   borderWidth:8,
      //   data
      // }
      // this.renderChart(this.chartData, this.options)
    }
  }
}
</script>

<style>
</style>