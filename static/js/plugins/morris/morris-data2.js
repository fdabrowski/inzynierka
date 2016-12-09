
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
    var $daysOfWeek = $['hoursOfTheDay'];


    var days = [];

    var sensorList = document.getElementById("sensor");
    var chartSensor ;

    var timeList = document.getElementById("time");
    var chartTime ;

    updateData()
    setInterval(function(){
        updateData()
    }, 2000);

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
        resize: true,
        parseTime: false
    });

    function countData(list,time){
        days = [];
        for(var k=0;k<time.length; k++){
            days[k]= 0;
        }

        for(var i=0; i < time.length; i++){
            for(var j=0; j< list.length; j++){
                if(list[j].date[0] == time[i] ){
                    days[i] = days[i] + 1;
                }
            }
        }
        return days;
    }


    function matchData(time){
        var graph_data = [{d: time[0], visits: days[0]}];
        for(var i=1; i<time.length; i++){
            graph_data.push({
                d: time[i],
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

                kontaktron1WeekAJAX = data.kontaktron1WeekList;
                kontaktron2WeekAJAX = data.kontaktron2WeekList;
                moveWeekAJAX = data.moveWeekList;
                smokeWeekAJAX = data.smokeWeekList;
                waterWeekAJAX = data.waterWeekList;
                highTemperatureWeekAJAX = data.highTemperatureWeekList;
                daysOfMonth = data.daysFromMonth;
                daysOfWeek = data.daysFromWeek;

                chartSensor = sensorList.options[sensorList.selectedIndex].text;
                chartTime = timeList.options[timeList.selectedIndex].text;
                console.log("chartTime", chartTime)

                if(chartSensor == "Kontaktron 1"){
                    if(chartTime == "Ostatni Miesiąc"){
                        countData(kontaktron1MonthAJAX, daysOfMonth);
                        matchData(daysOfMonth);
                    }
                    else if(chartTime == "Ostatni Tydzień"){
                        countData(kontaktron1WeekAJAX, daysOfWeek);
                        matchData(daysOfWeek);
                    }

                }
                else if(chartSensor == "Kontaktron 2"){
                    if(chartTime == "Ostatni Miesiąc"){
                        countData(kontaktron2MonthAJAX, daysOfMonth);
                        matchData(daysOfMonth);
                    }
                    else if(chartTime == "Ostatni Tydzień"){
                        countData(kontaktron2WeekAJAX, daysOfWeek);
                        matchData(daysOfWeek);
                    }
                }
                else if(chartSensor == "Pożar"){
                    if(chartTime == "Ostatni Miesiąc"){
                        countData(smokeMonthAJAX, daysOfMonth);
                        matchData(daysOfMonth);
                    }
                    else if(chartTime == "Ostatni Tydzień"){
                        countData(smokeWeekAJAX, daysOfWeek);
                        matchData(daysOfWeek);
                    }
                }
                else if(chartSensor == "Ruch"){
                    if(chartTime == "Ostatni Miesiąc"){
                        countData(moveMonthAJAX, daysOfMonth);
                        matchData(daysOfMonth);
                    }
                    else if(chartTime == "Ostatni Tydzień"){
                        countData(moveWeekAJAX, daysOfWeek);
                        matchData(daysOfWeek);
                    }
                }
                else if(chartSensor == "Zalanie"){
                    if(chartTime == "Ostatni Miesiąc"){
                        countData(waterMonthAJAX, daysOfMonth);
                        matchData(daysOfMonth);
                    }
                    else if(chartTime == "Ostatni Tydzień"){
                        countData(waterWeekAJAX, daysOfWeek);
                        matchData(daysOfWeek);
                    }
                }
            }
        });
    }

});