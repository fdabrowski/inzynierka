// Morris.js Charts sample data for SB Admin template

$(function() {

    var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];
    var $highTemperatureAJAX = $['highTemperatureAJAX'];

    updateData()
    setInterval(function(){
        updateData()
    }, 3000);

    // Donut Chart
    donutChart = Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
                        label: "kontaktron",
                        value: 5
                    }, {
                        label: "zalanie",
                        value: 5
                    }, {
                        label: "pożar",
                        value: 5
                    }, {
                        label: "ruch",
                        value: 5
                    }],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
    function updateData(){
        $.ajax({
            type: 'GET',
            url: '/background',
            success: function(data){
                kontaktron1AJAX = data.kontaktron1List;
                moveAJAX = data.moveList;
                smokeAJAX = data.smokeList;
                waterAJAX = data.waterList;
                highTemperatureAJAX = data.highTemperatureList

                console.log('dlugosc', kontaktron1AJAX.length);
                donutChart.setData([{
                        label: "kontaktron",
                        value: kontaktron1AJAX.length
                    }, {
                        label: "zalanie",
                        value: waterAJAX.length
                    }, {
                        label: "pożar",
                        value: smokeAJAX.length
                    }, {
                        label: "ruch",
                        value: moveAJAX.length
                    }])
            }
        });
    }

});

