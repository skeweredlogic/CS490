/**
 * Created by frosti on 10/13/2014.
 */
function aCall (command,data,options){
    var callJSON = {};
        callJSON['command'] = command;
        callJSON['data'] = data;
        callJSON = JSON.stringify(callJSON);

    var request = new XMLHttpRequest();
    request.open('POST','../../~rj252/app_server/app.php',true);

    request.onload = function(){
        if (request.status >= 200 && request.status <400){
           var response = JSON.parse(request.responseText);
        }
        else{
            //connection error
        }
    };
    request.onerror = function (){
        console.log('connection error!');
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(callJSON);
}