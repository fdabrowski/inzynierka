    var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];
    var $highTemperatureAJAX = $['highTemperatureAJAX'];
    var table;
    var checkType = " ";

    updateData();
    $(document).ready(function(){
        sensorType = sensorTableValue.options[sensorTableValue.selectedIndex].text;
        table = $('#sensorTable').DataTable( {
        "bProcessing": true,
        "bStateSave": true,
        "bServerSide": false,
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

    function getTable(list){
        result = [];
        for(var i = 0; i<list.length; i++){
            result.push([i+1, list[i].id, list[i].type, list[i].date]);
        }
        return result;
    }

    function getSensor(type){
        result = [];
        if(type == "Kontaktron"){
            result = kontaktron1AJAX;
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

    function updateData(){
        $.ajax({
            type: 'GET',
            url: '/background',
            success: function(data){
                kontaktron1AJAX = data.kontaktron1List;
                moveAJAX = data.moveList;
                smokeAJAX = data.smokeList;
                waterAJAX = data.waterList;
                temperatureNow = data.temperatureNow;

                $("#kontaktron1Length").html("Ilość alarmów: "+kontaktron1AJAX.length);
                $("#kontaktron1Date").html(
                     (kontaktron1AJAX.length == 0) ? "Ostatni alarm: -" : "Ostatni alarm: " +kontaktron1AJAX[kontaktron1AJAX.length-1].date
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

                $("#temperature").html("Aktualna temperatura: " +temperatureNow.value +"°C");


                sensorType = sensorTableValue.options[sensorTableValue.selectedIndex].text;

                table.clear();
                table.rows.add(getTable(getSensor(sensorType)));

                $("#tableTitle").html("<h2>" +sensorType +"</h2>");

                if(checkType == sensorType){
                    table.draw(false);
                }else{
                    table.draw();
                }
                checkType = sensorType;

            }
        });
    }