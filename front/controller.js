/**
 * Created by frosti on 10/17/2014.
 */
var request;
var resp;


function sendOver(command,data,callback){

    var sPackage;
    sPackage = {'cmd':command,'data':data};
    console.log("package");
    console.log(sPackage);
    sPackage = JSON.stringify(sPackage);
    console.log(sPackage);
    request = new XMLHttpRequest();
    request.open('POST', '../../~rj252/app_server/app.php', true);

    request.onreadystatechange = callback;

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
    var credentials = {'user':username,'pass':password};

    sendOver('login',credentials,function(){
            if (request.status == 200 && request.readyState == 4){
                resp = JSON.parse(request.responseText);
                console.log(resp);
                if (resp.backend==1){
                    document.getElementById("alertBar").style.display="none";
                    $('#loginModal').modal('hide');
                }
                else if (resp.backend==0){
                  var alertBar = document.getElementById("alertBar");
                    alertBar.className="alert alert-danger";
                    alertBar.style.display="";
                    alertBar.innerHTML="Invalid credentials";
                    document.getElementById("password").parentNode.parentNode.appendChild(alertBar);
                }

                else if (resp.backend==-1){
                    var alertBar = document.getElementById("alertBar")
                    alertBar.className="alert alert-warning"
                    alertBar.style.display="";
                    alertBar.innerHTML="Connection error";
                    document.getElementById("password").parentNode.parentNode.appendChild(alertBar);
                }
            }
    }
    );
}