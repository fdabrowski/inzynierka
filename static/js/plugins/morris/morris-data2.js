
$(function() {

    var $kontaktron2MonthAJAX = $['$kontaktron2MonthAJAX'];
    var $kontaktron2MonthAJAX = $['$kontaktron2MonthAJAX'];
    var $moveMonthAJAX = $['$moveMonthAJAX'];
    var $smokeMonthAJAX = $['$smokeMonthAJAX'];
    var $waterMonthAJAX = $['$waterMonthAJAX'];
    var $highTemperatureMonthAJAX = $['$highTemperatureMonthAJAX'];

    var $kontaktron1DayAJAX = $['$kontaktron2DayAJAX'];
    var $kontaktron2DayAJAX = $['$kontaktron2DayAJAX'];
    var $moveDayAJAX = $['$moveDayAJAX'];
    var $smokeDayAJAX = $['$smokeDayAJAX'];
    var $waterDayAJAX = $['$waterDayAJAX'];
    var $highTemperatureDayAJAX = $['$highTemperatureDayAJAX'];
    var $daysOfMonth = $['daysOfMonth'];
    var days = [];

    updateData()
    setInterval(function(){
        updateData()
    }, 10000);

    // Line Chart
    lineChart = Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [],
        // The name of the data record attribute that contains x-visitss.
        xkey: 'd',
        // A list of names of data record attributes that contain y-visitss.
        ykeys: ['visits'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Alarms'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });

    function countData(list){
        for(var k=0;k<list.length; k++){
            days[k]= 0;
        }
        for(var i=0; i < daysOfMonth.length; i++){
            for(var j=0; j<list.length; j++){
                if(list[j].date[0] == daysOfMonth[i] ){
                    days[i] = days[i] + 1;
                }
            }
        }
        return days;
    }

    function matchData(){
        var graph_data = [{d: daysOfMonth[0], visits: days[0]}];
        for(var i=0; i<daysOfMonth.length; i++){
            graph_data.push({
                d: daysOfMonth[i],
                visits: days[i]
            });

        }
        lineChart.setData(graph_data);
        lineChart.redraw();
    }


    function updateData(){
        $.ajax({
            type: 'GET',
            url: '/background',
            success: function(data){
                kontaktron1MonthAJAX = data.kontaktron1MonthList;
                kontaktron2MonthAJAX = data.kontaktron2MonthList;
                moveMonthAJAX = data.moveMonthList;
                smokeMonthAJAX = data.smokeMonthList;
                waterMonthAJAX = data.waterMonthList;
                highTemperatureMonthAJAX = data.highTemperatureMonthList;

                kontaktron1DayAJAX = data.kontaktron1DayList;
                kontaktron2DayAJAX = data.kontaktron2DayList;
                moveDayAJAX = data.moveDayList;
                smokeDayAJAX = data.smokeDayList;
                waterDayAJAX = data.waterDayList;
                highTemperatureDayAJAX = data.highTemperatureDayList;
                daysOfMonth = data.daysFromMonth;

                //console.log("kontaktron1MonthAJAX", kontaktron1MonthAJAX)
                //console.log("kontaktron2MonthAJAX", kontaktron2MonthAJAX)
                //console.log("moveMonthAJAX", moveMonthAJAX)
                //console.log("smokeMonthAJAX", smokeMonthAJAX)
                //console.log("waterMonthAJAX", waterMonthAJAX)
                //console.log("highTemperatureMonthAJAX", highTemperatureMonthAJAX)
                //console.log("Days", daysOfMonth)

                countData(kontaktron1MonthAJAX);
                console.log("Days", days);
                matchData();
            }
        });
    }

});