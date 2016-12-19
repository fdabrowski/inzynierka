    var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];

    updateData();
    $(document).ready(function(){

        setInterval(function(){
            updateData();
        }, 3000);
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
                temperatureNowAJAX = data.temperatureNow;

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

                $("#temperature").html("Aktualna temperatura: " +temperatureNowAJAX.value +"°C");

            }
        });
    }