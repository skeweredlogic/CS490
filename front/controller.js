/**
 * Created by frosti on 10/17/2014.
 */

var junkBank = [
    {"eid":"restinpepperonis"},
    {"3434":
    {
        "type": "multi",
        "question": "jpifsjdfpi?",
        "answer": "fsdfasdfs",
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf'
    }

    },
    {'gg45':
    {
        'type': 'tf',
        'question': 'moeb8pi?',
        'answer': 'fsdfasdfs',
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf'
    }

    },
    {'r4r4':
    {
        'type': 'code',
        'question': 'pokp23kpi?',
        'answer': 'fsdfasdfs',
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf'
    }

    }
];

junkBank =JSON.stringify(junkBank);
console.log(junkBank);
junkBank =JSON.parse(junkBank);
console.log(junkBank);


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
            var resp = JSON.parse(request.responseText);
            callback(resp);
        }
        if (request.status == 401 && request.readyState == 4){
            var noSession = JSON.parse(request.responseText);
            console.log("no session", noSession);
        }
        if (request.status == 500 && request.readyState ==4){
            var servedError = JSON.parse(request.responseText)
            console.log("server error", servedError)
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
        'expectedOutput':document.getElementById("multiChoiceAnswer").value,
        'feedback':document.getElementById("multiChoiceAnswerFeedback").value
    };

    sendOver('createQuestion',question,function(resp){
        console.log(resp);
    });
}

console.log(junkBank.type);

function pullBank(){

    /*sendOver('bank', null , function(resp){
     for (var i=0;i<junkBank.length;i++){
     console.log(junkBank[i]);
     };
     });*/
}

function createExam(){

}

function currentExams(){

}

function getExam(){
   // sendOver('getExam', 'some eid would go here',function(resp){

        console.log(junkBank.length);
        for (var i = 0; i < 20; i++) {
            //console.log('why...');

            var obj = junkBank[i];
            for (var key in obj) {

                var attrName = key;
                var attrVal = obj[key];
                /*console.log(attrName," :  ",attrVal);
                console.log(attrName);*/
               if (attrName=="eid"){
                   var eidSetter =document.getElementById("submitExam");
                      eidSetter.dataset.eid=attrVal;
               }
                switch (attrVal.type) {
                    case 'multi':
                        var multiDummy = document.getElementById("multiDummy");
                        var multiCloned = multiDummy.cloneNode(true);
                        multiCloned.setAttribute("id", key);
                        var theRadios;
                        theRadios = multiCloned.getElementsByTagName("input");
                        for (var w = 0; w < theRadios.length; w++) {
                            var radioNamer = theRadios[w];
                            radioNamer.setAttribute("name", key);
                        }
                        theRadios = multiCloned.getElementsByTagName("label");
                        theRadios[1].innerHTML += attrVal.choice2;
                        theRadios[1].setAttribute("data-choice",attrVal.choice2);
                        theRadios[2].innerHTML += attrVal.choice3;
                        theRadios[2].setAttribute("data-choice",attrVal.choice3);

                        if (attrVal.choice4) {
                            theRadios[3].innerHTML += attrVal.choice4;
                            theRadios[3].setAttribute("data-choice",attrVal.choice4);
                            theRadios[0].innerHTML += attrVal.choice1;
                            theRadios[0].setAttribute("data-choice",attrVal.choice1);

                        }
                        else if (attrVal.answer) {
                            theRadios[0].innerHTML += attrVal.answer;
                            theRadios[0].setAttribute("data-choice",attrVal.answer);

                            theRadios[3].innerHTML += attrVal.choice1;
                            theRadios[3].setAttribute("data-choice",attrVal.choice1);

                        }

                        theRadios = multiCloned.getElementsByTagName("h3");
                        theRadios[0].innerHTML=attrVal.question;


                        document.getElementById('outerBoarder').appendChild(multiCloned);
                        break;
                    case 'tf':
                        var tfDummy = document.getElementById("tfDummy");
                        var tfCloned = tfDummy.cloneNode(true);
                        tfCloned.setAttribute("id", key);
                        var tfRadios;
                        tfRadios = tfCloned.getElementsByTagName("input");
                        for (var tfRadioCounter = 0; tfRadioCounter < tfRadios.length; tfRadioCounter++) {
                            var tfRadioNamer = tfRadios[tfRadioCounter];
                            tfRadioNamer.setAttribute("name", key);
                        }
                        tfRadios = tfCloned.getElementsByTagName("h3");
                        tfRadios[0].innerHTML=attrVal.question;

                        document.getElementById('outerBoarder').appendChild(tfCloned);
                        break;
                    case 'code':
                        var codeDummy = document.getElementById("codeDummy");
                        var codeCloned = codeDummy.cloneNode(true);
                        codeCloned.setAttribute("id", key);
                        var codeTextArea;
                        codeTextArea = codeCloned.getElementsByTagName("p");
                        codeTextArea[0].setAttribute("name", key);

                        var codeQuestion= codeCloned.getElementsByTagName("h3");
                        codeQuestion[0].innerHTML=attrVal.question;

                        document.getElementById('outerBoarder').appendChild(codeCloned);
                        break;
                }

            }
        }


 //   });

}

function postExam(){
    var eid=document.getElementById('submitExam').dataset.eid;
    var answers={};
    answers['cmd']='answered';
    var radios = document.getElementsByTagName("input");
    for (i=0; i<radios.length;i++){
        if (radios[i].checked){
            // have to get name and save with pair
            var radioName= radios[i].getAttribute("name");
            var radioID= radios[i].getAttribute("id");
            var radioDataChoice=radios[i].parentNode.getAttribute("data-choice");
            if (radioID=="falsetrue"){
                answers[radioName]='true';
            }
            else if (radioID=="falsefalse"){
                answers[radioName]='false';
            }
            else{
                answers[radioName]=radioDataChoice;
            }
        }
    }
    var codeAreas = document.getElementsByTagName("p");
    for (x=0; x<=codeAreas; x++){
        var codeAreaName=codeAreas[x].getAttribute("name");
        console.log("step1");
        if (codeAreaName!="codeDummy"){
            console.log('step 2');
            answers[codeAreaName]=codeAreas[x].innerhtml;
        }
    }

    console.log(answers);
    answers=JSON.stringify(answers);
    console.log(answers);
}