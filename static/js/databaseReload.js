    var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $kontaktron2AJAX = $['kontaktron2AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];
    var $highTemperatureAJAX = $['highTemperatureAJAX'];
    var table;

    updateData();
    $(document).ready(function(){
        sensorType = sensorTableValue.options[sensorTableValue.selectedIndex].text;
        table = $('#sensorTable').DataTable( {
        data: dataSet,
        "bProcessing": true,
        "bStateSave": true,
        columns: [
            { title: "Id" },
            { title: "Id z bazy danych" },
            { title: "Typ alarmu" },
            { title: "data alarmu" },
        ]
        });
        setInterval(function(){
            updateData();
        }, 3000);
    });

    var dataSet = [
        ["1","2","3","0"],["chuj","2","3","s"],["1","2","3","s"],["1","2","3","s"]
    ];

     var dataSets = [
        ["1","2","3","0"],["s","2","3","s"],["1","2","3","s"],["1","2","3","s"]
    ];

    function getTable(list){
        result = [];
        for(var i = 0; i<list.length; i++){
            result.push([i+1, list[i].id, list[i].type, list[i].date]);
        }
        return result;
    }

    function getSensor(type){
        result = [];
        if(type == "Kontaktron 1"){
            result = kontaktron1AJAX;
        }
        else if(type == "Kontaktron 2"){
            result = kontaktron2AJAX;
        }
        else if(type == "Pożar"){
            result = smokeAJAX;
        }
        else if(type == "Zalanie"){
            result = waterAJAX;
        }
        else if(type == "Ruch"){
            result = moveAJAX;
        }
        return result
    }

    /*
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
    */

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


                /*
                console.log('kontaktron2',kontaktron2AJAX);

                console.log('move1',moveAJAX);
                console.log('smoke',smokeAJAX);
                console.log('water',waterAJAX);
                console.log('highTemperature',highTemperatureAJAX);
                */


                $("#kontaktron1Length").html("Ilość alarmów: "+kontaktron1AJAX.length);
                $("#kontaktron1Date").html(
                     (kontaktron1AJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +kontaktron1AJAX[kontaktron1AJAX.length-1].date
                );

                $("#kontaktron2Length").html("Ilość alarmów: "+kontaktron2AJAX.length);
                $("#kontaktron2Date").html(
                     (kontaktron2AJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +kontaktron2AJAX[kontaktron2AJAX.length-1].date
                );

                $("#waterLength").html("Ilość alarmów: "+waterAJAX.length);
                $("#waterDate").html(
                     (waterAJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +waterAJAX[waterAJAX.length-1].date
                );

                $("#moveLength").html("Ilość alarmów: "+moveAJAX.length);
                $("#moveDate").html(
                     (moveAJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +moveAJAX[moveAJAX.length-1].date
                );

                $("#smokeLength").html("Ilość alarmów: "+smokeAJAX.length);
                $("#smokeDate").html(
                     (smokeAJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +smokeAJAX[smokeAJAX.length-1].date
                );

                sensorType = sensorTableValue.options[sensorTableValue.selectedIndex].text;
                console.log('kontaktron1',getSensor(sensorType));

                table.clear();
                table.rows.add(getTable(getSensor(sensorType)));
                table.draw();

            }
        });
    }