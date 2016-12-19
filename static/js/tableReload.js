 var $kontaktron1AJAX = $['kontaktron1AJAX'];
    var $moveAJAX = $['move1AJAX'];
    var $smokeAJAX = $['smokeAJAX'];
    var $waterAJAX = $['waterAJAX'];
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
        }, 2000);
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