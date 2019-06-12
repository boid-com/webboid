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
          legend:{position:"bottom", display:false,labels:{
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
                  // stepSize: 50000,
                  padding: 10
                }
              }, {
                ticks: {
                  // stepSize: 5,
                  padding: 10,
                  fontSize:16,
                  fontColor:"#089cfc"
                },
                type: 'linear',
                display: false,
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
      var data = this.chartData.datasets[0].data;
      var userName = this.chartData.datasets[0].userName;
      var userPower = this.chartData.datasets[0].userPower;
      this.chartData.datasets[0] = {
        label:"User Name:   " + userName +"   /  Current Total Power:  " + userPower,
        pointRadius:3,
        pointBackgroundColor:"rgb(244, 178, 56)",
        pointHoverRadius:5,
        borderColor:"rgb(244, 178, 56)",
        borderWidth:4,
        fill:false,
        yAxisID:'y-axis-1',
        data
      };
      this.renderChart(this.chartData, this.options)

    },
    watch:{
      height(){
        this.renderChart(this.chartData, this.options)
      },
      chartData(data){ }
    }
  }
</script>

<style>
</style>
