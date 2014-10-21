/**
 * Created by frosti on 10/17/2014.
 */
function sendOver(command,data,callback){

    var sPackage;
    sPackage = {'cmd':command,'data':data};
    console.log("package");
    console.log(sPackage);
    sPackage = JSON.stringify(sPackage);
    console.log(sPackage);
    request = new XMLHttpRequest();
    request.open('POST', '../../~rj252/app_server/app.php', true);

    request.onreadystatechange = function() {
        if (request.status == 200 && request.readyState == 4){
            resp = JSON.parse(request.responseText);
            callback(resp);
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
    var credentials = {'user':username,'pass':password};

    sendOver('login',credentials,function(resp){
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
                var alertBar = document.getElementById("alertBar");
                alertBar.className="alert alert-warning";
                alertBar.style.display="";
                alertBar.innerHTML="Connection error";
                document.getElementById("password").parentNode.parentNode.appendChild(alertBar);
            }
        }
    );
}

function createMultipleChoice(){

    var question = {
        'type':'multi',
        'question':document.getElementById("multiChoiceQuestion").value,
        'answer':document.getElementById("multiChoiceAnswer").value,
        'feedback':document.getElementById("multiChoiceAnswerFeedback").value,
        'choice1':document.getElementById("multiChoice1").value,
        'choice2':document.getElementById("multiChoice2").value,
        'choice3':document.getElementById("multiChoice3".value)
    };

    sendOver('CreateQuestion',question,function(resp){
            console.log(resp);
    });
}

function createTrueFalse(){
    var question = {
        'type':'tf',
        'question':document.getElementById("multiChoiceQuestion").value,
        'answer':document.getElementById("multiChoiceAnswer").value,
        'feedback':document.getElementById("multiChoiceAnswerFeedback").value

    };
    sendOver('CreateQuestion',question,function(resp){
        console.log(resp);
    });
}

function createCoding(){
    var question ={
        'type':'code',
        'question':document.getElementById("multiChoiceQuestion").value,
        'answer':document.getElementById("multiChoiceAnswer").value,
        'feedback':document.getElementById("multiChoiceAnswerFeedback").value
    };

    sendOver('CreateQuestion',question,function(resp){
        console.log(resp);
    });
}