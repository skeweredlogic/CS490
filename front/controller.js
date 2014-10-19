/**
 * Created by frosti on 10/17/2014.
 */
function sendOver(command,data){

    var sPackage = {'command':command,'data':data};
    console.log("package");
    console.log(sPackage);
    sPackage = JSON.stringify(sPackage);
    console.log(sPackage);
    console.log("why?")
    var request = new XMLHttpRequest();
    request.open('POST', '../../~rj252/app_server/app.php', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400){
            resp = JSON.parse(request.responseText);
            console.log(resp);
        }
        else {
            //connection error
            console.log("request status error");
        }
    };

    request.onerror = function() {
        console.log("request error");
        // There was a connection error of some sort
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(sPackage);
    //console.log(JSON.parse(request.responseText);
}


function loginSend(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var credentials = {'username':username,'password':password};

    sendOver('login',credentials);
}