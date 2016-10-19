// Morris.js Charts sample data for SB Admin template

$(function() {

    var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $kontaktron2AJAX = $['kontaktron2AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];
    var $highTemperatureAJAX = $['highTemperatureAJAX'];

    updateData()
    setInterval(function(){
        updateData()
    }, 10000);

    // Donut Chart
    chart = Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
                        label: "kontaktron1",
                        value: 5
                    }, {
                        label: "kontaktron2",
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
                kontaktron2AJAX = data.kontaktron2List;
                moveAJAX = data.moveList;
                smokeAJAX = data.smokeList;
                waterAJAX = data.waterList;
                highTemperatureAJAX = data.highTemperatureList

                console.log('dlugosc', kontaktron1AJAX.length);
                chart.setData([{
                        label: "kontaktron1",
                        value: kontaktron1AJAX.length
                    }, {
                        label: "kontaktron2",
                        value: kontaktron2AJAX.length
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
