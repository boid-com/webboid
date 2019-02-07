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
              stacked: true,
              scaleLabel:{
                display:false,
                fontSize:20,
                lineHeight:0,
                padding:5
              },
              display:true,
              gridLines:{
                drawOnChartArea:true,
                drawBorder:false
              }
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
    console.log(data)
    this.chartData.datasets[0] = {
      label:"Boid Power",
      pointRadius:5,
      pointBackgroundColor:"#ffcc00",
      pointHoverRadius:5,
      pointColor:"#089cfc",
      borderColor:"#ffcc00",
      borderWidth:4,
      data
    }
    this.chartData.datasets[1] = {
      label:"Active Users",
      pointRadius:5,
      pointBackgroundColor:"rgb(16, 140, 242)",
      pointHoverRadius:5,
      pointColor:"rgb(16, 140, 242)",
      borderColor:"rgb(16, 140, 242)",
      borderWidth:4,
      data:data2
    }
    this.renderChart(this.chartData, this.options)

  },
  watch:{
    height(){
      this.renderChart(this.chartData, this.options)
    },
    chartData(data){
      console.log(data)
      if (!data) return
      var data = data.datasets[0].data
      console.log(data)
      return
      this.chartData.datasets[0] = {
        label:"Boid Power",
        pointRadius:5,
        pointBackgroundColor:"#ffcc00",
        pointHoverRadius:5,
        pointColor:"#089cfc",
        borderColor:"#ffcc00",
        borderWidth:8,
        data
      }
      this.renderChart(this.chartData, this.options)
    }
  }
}
</script>

<style>
</style>