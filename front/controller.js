/**
 * Created by frosti on 10/17/2014.
 */
var outerBoarder;
var submitButtonContainer;
var userRole;
var userLoggedIn;

window.onload= function() {
    outerBoarder = document.getElementById("outerBoarder");
    submitButtonContainer=document.getElementById("submitButtonContainer");
    createIndex();
   // testAddAllButtons();
};

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
        'answer': 'true',
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

var junkExamReview = [
    {"eid":"restinpepperonis"},
    {"3434":
    {
        "type": "multi",
        "question": "jpifsjdfpi?",
        "answer": "fsdfasdfs",
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf',
        'answered': 'g4534dfgdf'
    }

    },
    {'gg45':
    {
        'type': 'tf',
        'question': 'moeb8pi?',
        'answer': 'true',
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf',
        'answered': 'true'
    }

    },
    {'r4r4': {
        'type': 'code',
        'question': 'pokp23kpi?',
        'answer': 'fsdfasdfs',
        'feedback': 'asfdasd',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf',
        'answered': 'g4534dfgdf'
    }
    },
    {'454rte':
    {
        'type': 'multi',
        'question': 'pokp23kpi?',
        'answer': 'fsdfasdfs',
        'feedback': 'finally done!',
        'choice1': 'gdfgdf',
        'choice2': 'gdfgd6756f',
        'choice3': 'g4534dfgdf',
        'answered': 'fsdfasdfs'
    }
    }
];
/*junkBank =JSON.stringify(junkBank);
 console.log(junkBank);
 junkBank =JSON.parse(junkBank);
 console.log(junkBank);*/

var junkExams =[
    {'545':
    {
        'named':'exam1',
        'released':'nr',
        'grade': '85'

    }
    },
    {'123':
    {
        'named':'exam2',
        'released':'nr',
        'grade': '44'

    }
    },
    {'783':
    {
        'named':'exam3',
        'released':'nr',
        'grade': '85'

    }
    },
    {'234':
    {
        'named':'exam4',
        'released':'nr',
        'grade': '-1'

    }
    }
];

/*
junkExams=JSON.stringify(junkExams);
 console.log(junkExams);
junkExams =JSON.parse(junkExams);
 console.log(junkExams);
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
            var resp = JSON.parse(request.responseText);
            console.log("resp in sendover: ",resp);
            callback(resp);
        }
        else if (request.status == 401 && request.readyState == 4){
            var noSession = JSON.parse(request.responseText);
            $('#addCodeModal').modal('hide');
            $('#addMultiModal').modal('hide');
            $('#addTfModal').modal('hide');
            $('#loginModal').modal('show');
            console.log("no session", noSession);
        }
        else if (request.status == 500){
            var servedError = JSON.parse(request.responseText);
            console.log("server error", servedError);
            alertz("danger","server error","yes");
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

function loginSend(subButton){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var credentials = {'user':username,'pass':password};

    sendOver('login',credentials,function(resp){
            console.log("resp in login: ", resp);
            userLoggedIn=resp.uid;
            if (resp.role=="instructor"){
                userRole="instructor";
            }
            if (resp.backend==1){
                alertz("off");
                $('#loginModal').modal('hide');
            }
            else if (resp.backend==0){

                alertz("danger","Invalid credentials",subButton);

            }

            else if (resp.backend==-1){

                alertz("warning","Connection error",subButton);
            }
            createIndex();
        }
    );
}

function createMultipleChoice(subButton){

    var question = {
        'type':'multi',
        'question':document.getElementById("multiChoiceQuestion").value,
        'answer':document.getElementById("multiChoiceAnswer").value,
        'feedback':document.getElementById("multiAnswerFeedback").value,
        'choice1':document.getElementById("multiChoice1").value,
        'choice2':document.getElementById("multiChoice2").value,
        'choice3':document.getElementById("multiChoice3").value
    };

    for (var key in question) {

        var attrName = key;
        var attrVal = question[key];
        if (attrVal=="")
        {
            alertz('warning','Please fill out all fields',subButton);
            return;
        }
    }
   // console.log(question);
    sendOver('createquestion',question,function(resp){
        if (resp.status==1){
            $('addMultiModal').modal('hide');
            alertz("success","question added successfully","yes");
        }
        else{
            alertz("danger",resp.message,subButton);
        }
        console.log(resp);
    });
}

function createTrueFalse(subButton){
    var tfAnswer;
    if (document.getElementById("inlineRadio1").checked){
        tfAnswer='true'
    }
    else if(document.getElementById("inlineRadio2").checked){
        tfAnswer='false'
    }
    var question = {
        'type':'tf',
        'question':document.getElementById("tfQuestion").value,
        'answer':tfAnswer,
        'feedback':document.getElementById("tfFeedback").value

    };

    for (var key in question) {

        var attrName = key;
        var attrVal = question[key];
        if (attrVal=="" || !question['answer'])
        {
            alertz('warning','Please fill out all fields',subButton);
            return;
        }
    }

    sendOver('createquestion',question,function(resp){

        if (resp.status==1){
            $('#addTfModal').modal('hide');
            alertz("success","question added successfully","yes");
        }
        else{
            alertz("danger",resp.message,subButton);
        }
        console.log(resp);
    });
}

function createCoding(subButton){
    var question ={
        'type':'code',
        'question':document.getElementById("codeQuestion").value,
        'expectedOutput':document.getElementById("codeAnswer").value
    };

    for (var key in question) {

        var attrName = key;
        var attrVal = question[key];
        if (attrVal=="")
        {
            alertz('warning','Please fill out all fields',subButton);
            return;
        }
    }

   // console.log(question);
    sendOver('createquestion',question,function(resp){
        if (resp.status==1){
            $('addCodeModal').modal('hide');
            alertz("success","question added successfully","yes");
        }
        else{
            alertz("danger",resp.message,subButton);
        }
        console.log(resp);
    });
}


function pullBank(){
    sendOver('bank',null,function(resp){
    pageClear();

    addButton("createIndexDummy");
    addButton("createExamButtonDummy");


   var examName=document.getElementById("examName").parentNode;
    var examNameClone=examName.cloneNode(true);
    //examNameClone.removeAttribute("style");
    examNameClone.style.paddingBottom="5px";
    outerBoarder.appendChild(examNameClone);
   var bankHolder=document.getElementById("accordion");
   var bankQuestion=bankHolder.getElementsByClassName("panel-default");
    bankQuestion=bankQuestion[0];
    bankHolder=bankHolder.cloneNode(true);
    //bankHolder.removeAttribute("style");
    bankHolder.id="clonedBankHolder";
    bankHolder.innerHTML="";
    outerBoarder.appendChild(bankHolder);
    var collapseCounter;
    collapseCounter=4;

    for (var i = 0; i < resp.length; i++) {

        var obj = resp[i];
        for (var key in obj) {

            var attrName = key;
            var attrVal = obj[key];
            //console.log(attrName," :  ",attrVal);
            // console.log(attrName);
                if (attrName!="eid") {
                    var bankQuestionClone = bankQuestion.cloneNode(true);
                    var bankCheckbox = bankQuestionClone.getElementsByTagName("input");
                    var spinner = bankCheckbox[1];
                    bankCheckbox = bankCheckbox[0];
                    bankCheckbox.name = key;
                    var bankLines = bankQuestionClone.getElementsByTagName("li");

                    var bankAnchor = bankQuestionClone.getElementsByTagName("a");
                    bankAnchor[0].href = "#collapser" + collapseCounter;
                    bankAnchor[0].innerHTML=attrVal.question;
                    var collapsingArea=bankQuestionClone.getElementsByClassName("panel-collapse");
                    collapsingArea[0].id= ("collapser"+ collapseCounter);
                   // console.log("this is the result      ",("collapser"+ collapseCounter));

                    spinner.id=key+"spinner";
                    spinner.name=key+"spinner";
                   // spinner = $(spinner).spinner();


                    switch (attrVal.type) {
                        case 'multi':
                            bankLines[0].innerHTML = attrVal.answer;
                            bankLines[0].className += " list-group-item-success";
                            bankLines[1].innerHTML = attrVal.choice1;
                            bankLines[2].innerHTML = attrVal.choice2;
                            bankLines[3].innerHTML = attrVal.choice3;
                            break;
                        case 'tf':
                            bankLines[2].parentNode.removeChild(bankLines[2]);
                            bankLines[2].parentNode.removeChild(bankLines[2]);
                            if (attrVal.answer === "true") {
                                bankLines[0].className += " list-group-item-success";
                            }
                            else if (attrVal.answer === "false") {
                                bankLines[1].className += " list-group-item-success";
                            }
                            break;
                        case 'code':
                            bankLines[0].innerHTML = attrVal.answer;
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            break;
                    }
                    bankHolder.appendChild(bankQuestionClone);
                    collapseCounter++;
                }
        }
    }
        var barbs=$("input[name*='spinner']").spinner();
        barbs=$("span[class*='triangle']").addClass("pull-right");
        //barbs[0].spinner();
        console.log(barbs);
    });


}

function createExam(){
    var examName=document.getElementById("examName").value;
    var checkBoxes=document.getElementsByTagName("input");
    var questions={};
    for (var x=0; x<checkBoxes.length;x++){
        if (checkBoxes[x].checked && checkBoxes[x].name!="checkboxDummy"){
            var checkboxName=checkBoxes[x].name;
            var weight=1;
            questions[checkboxName]= weight;
          //  console.log(checkBoxes[x].name);
        }
    }
    questions['name']=examName;

    if (questions['name']==""){
        alertz('warn','Please enter an exam name', "yes");
        return;
    }
    if (Object.keys(questions).length<2){
        alertz('warning',"Please select at least one question","yes");
        return;
    }
    /*
    sendOver('createExam',questions,function(resp){
        if (resp.staus==1){
            pageClear();
            createIndex();
            alertz("success","exam creation success","yes");
        }
    });
    */
}

function currentExams(){

    sendOver('exams',null,function(resp){
    pageClear();
        addButton("createIndexDummy");
    var examLister=document.getElementById("examLister");
    var listClone=examLister.cloneNode(true);
    outerBoarder.appendChild(listClone);
    listClone=listClone.getElementsByClassName("table");
    listClone=listClone[0];
   // console.log(examLister);

    var examTakeButton=document.getElementById("examTakeButton");
    var examReviewButton=document.getElementById("examReviewButton");
    var examReleasebutton=document.getElementById("examReleaseButton");

    for (var i = 0; i < resp.length; i++) {

        var obj = resp[i];
        for (var key in obj) {

            var attrName = key;
            var attrVal = obj[key];
            // console.log(attrName," :  ",attrVal);
            // console.log(attrName);
            var newRow=listClone.insertRow();
            var nameCell=newRow.insertCell();
            var gradesCell=newRow.insertCell();
            var releasedCell=newRow.insertCell();



            if (attrVal.grade=="-1"){
                var buttonClone=examTakeButton.cloneNode(true);
              //  buttonClone.removeAttribute("style");
                buttonClone.setAttribute("name",attrName);
                nameCell.appendChild(buttonClone);

                gradesCell.innerHTML="Not yet taken";
            }
            else{
                var reviewButtonClone=examReviewButton.cloneNode(true);
                reviewButtonClone.setAttribute("name",attrName);
                nameCell.appendChild(reviewButtonClone);

                gradesCell.innerHTML=attrVal.grade;
            }

            nameCell.innerHTML+=("  "+ attrVal.named);
            if (attrVal.released=="nr"){

                if(userRole=='instructor'){
                    var releaseClone=examReleasebutton.cloneNode(true);
                    releaseClone.setAttribute("name",attrName);
                    releasedCell.appendChild(releaseClone);
                    releasedCell.innerHTML+=" No";
                }
                else{
                    releasedCell.innerHTML="No";
                }
            }
            else{
                releasedCell.innerHTML="Yes";
            }
        }
    }
    });
}

function getExam(fetchThis){
    //change junkBanks to resp and uncomment the sendover and it's ending curly brace

     sendOver('getExam', fetchThis,function(resp){
        //console.log(junkBank.length);
       // sleep(5000,pageClear());
        pageClear();
        addButton("createIndexDummy");
        addButton("postExamDummy");
        for (var i = 0; i < resp.length; i++) {
            //console.log('why...');

            var obj = resp[i];
            for (var key in obj) {

                var attrName = key;
                var attrVal = obj[key];
                /*console.log(attrName," :  ",attrVal);
                console.log(attrName);*/
               if (attrName=="eid"){
                   // exam id is saved to postExam button
                   var eidSetter =document.getElementById("postExam");
                      eidSetter.name=attrVal;
               }
                switch (attrVal.type) {
                    case 'multi':
                        var multiDummy = document.getElementById("multiDummy");
                        var multiCloned = multiDummy.cloneNode(true);
                        //multiCloned.removeAttribute("style");
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


                       outerBoarder.appendChild(multiCloned);
                        break;
                    case 'tf':
                        var tfDummy = document.getElementById("tfDummy");
                        var tfCloned = tfDummy.cloneNode(true);
                       // tfCloned.removeAttribute("style");
                        tfCloned.setAttribute("id", key);
                        var tfRadios;
                        tfRadios = tfCloned.getElementsByTagName("input");
                        for (var tfRadioCounter = 0; tfRadioCounter < tfRadios.length; tfRadioCounter++) {
                            var tfRadioNamer = tfRadios[tfRadioCounter];
                            tfRadioNamer.setAttribute("name", key);
                        }
                        tfRadios = tfCloned.getElementsByTagName("h3");
                        tfRadios[0].innerHTML=attrVal.question;

                        outerBoarder.appendChild(tfCloned);
                        break;
                    case 'code':
                        var codeDummy = document.getElementById("codeDummy");
                        var codeCloned = codeDummy.cloneNode(true);
                       // codeCloned.removeAttribute("style");
                        codeCloned.setAttribute("id", key);
                        var codeTextArea;
                        codeTextArea = codeCloned.getElementsByTagName("p");
                        codeTextArea[0].setAttribute("name", key);

                        var codeQuestion= codeCloned.getElementsByTagName("h3");
                        codeQuestion[0].innerHTML=attrVal.question;

                        outerBoarder.appendChild(codeCloned);
                        break;
                }
            }
        }
  });
}

function postExam(){
    var eid=document.getElementById('postExam').name;
   // console.log(eid);
    if(eid=="undefined"){
        alertz("warning","eid not found, please retry","yes")
    }
    var answers={};
    answers['eid']=eid;
    var radios = document.getElementsByTagName("input");
    for (var i=0; i<radios.length;i++){
        if (radios[i].checked && (radios[i].getAttribute("name")!=("tfDummy"||"multiDummy"))){
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
    for (var x=0; x<codeAreas.length; x++){
        var codeAreaName=codeAreas[x].getAttribute("name");
        if (codeAreaName!="codeDummy"){
            answers[codeAreaName]=codeAreas[x].innerHTML;
        }
    }
    sendOver('answered',answers,function(resp){
        if (resp.status==1){
            createIndex();
            alertz('success',"exam successfully submitted","yes");
        }
    });
}

function alertz(level,message,onPage){
    var alertBar=document.getElementById("alertBar");
    alertBar.innerHTML=message;
    alertBar.removeAttribute("style");
    switch(level){
        case ('warning'||'warn'):
            alertBar.className="alert alert-warning";
            break;
        case ('danger'||'red'):
            alertBar.className="alert alert-danger";
            break;
        case ('info'||'blue'):
            alertBar.className="alert alert-info";
            break;
        case ('success'||'green'):
            alertBar.className="alert alert-success";
            break;
        case 'off':
            alertBar.setAttribute("style","display: none");
            return;
    }
    if (onPage==("yes"||"y")) {

        outerBoarder.insertBefore(alertBar, outerBoarder.childNodes[0]);
    }
    else{
        onPage.parentNode.insertBefore(alertBar,onPage.parentNode.childNodes[0]);
    }
}

function pageClear(){

   while (outerBoarder.hasChildNodes()){
        outerBoarder.removeChild(outerBoarder.lastChild);
    }


    while(submitButtonContainer.hasChildNodes()){
        submitButtonContainer.removeChild(submitButtonContainer.lastChild);
    }

}

function createIndex(){
    pageClear();
    addButton("createIndexDummy");
    addButton("examsButtonDummy");
    if (!userLoggedIn ||!userRole) {
        userInfo();
    }
    else{
        if (userRole=="instructor"){
            addButton("addMultiModBtnDummy");
            addButton("addTfModBtnDummy");
            addButton("addCodeModBtnDummy");
            addButton("testBankButtonDummy");
        }

        if(userLoggedIn!='' && userLoggedIn) {
            addButton("logoutButtonDummy");
            var logoutButton=document.getElementById('logoutButton');
            logoutButton.innerHTML=userLoggedIn+", logout";
        }
    }

}

function logout(){
    sendOver('logout',null,function(resp){
        if (resp.status==1){
            //userLoggedIn='';
            //userRole='student';
           // createIndex();
            window.location.reload(true);//if submitted successfully will reload page

        }
    });
}


function addButton(button){
    var addButtons;
    addButtons=document.getElementById(button);
    addButtons=addButtons.cloneNode(true);
    addButtons.id=button.slice(0,-5); //slices the "dummy" off of buttons
    submitButtonContainer.appendChild(addButtons);
}

function testAddAllButtons(){
    addButton("createIndexDummy");
    addButton("examsButtonDummy");
        addButton("addMultiModBtnDummy");
        addButton("addTfModBtnDummy");
        addButton("addCodeModBtnDummy");
        addButton("testBankButtonDummy");
    addButton("logoutButtonDummy");
    addButton("postExamDummy");
    addButton("getExamDummy");
    addButton("loginDummy")
}

function reviewExam(fetchThis){

    sendOver('getExam',fetchThis,function(resp){
    pageClear();

    addButton("createIndexDummy");


    var examName=document.getElementById("examName").parentNode;
    var examNameClone=examName.cloneNode(true);
    //examNameClone.removeAttribute("style");
    examNameClone.style.paddingBottom="5px";
    outerBoarder.appendChild(examNameClone);
    var bankHolder=document.getElementById("accordion");
    var bankQuestion=bankHolder.getElementsByClassName("panel-default");
    bankQuestion=bankQuestion[0];
    bankHolder=bankHolder.cloneNode(true);
    //bankHolder.removeAttribute("style");
    bankHolder.id="clonedBankHolder";
    bankHolder.innerHTML="";
    outerBoarder.appendChild(bankHolder);
    var collapseCounter;
    collapseCounter=4;

    for (var i = 0; i < resp.length; i++) {

        var obj = resp[i];
        for (var key in obj) {

            var attrName = key;
            var attrVal = obj[key];
            //console.log(attrName," :  ",attrVal);
            // console.log(attrName);
            if (attrName!="eid") {
                var bankQuestionClone = bankQuestion.cloneNode(true);
                var bankCheckbox = bankQuestionClone.getElementsByTagName("input");
                bankCheckbox = bankCheckbox[0];
                bankCheckbox.name = key;
                var bankLines = bankQuestionClone.getElementsByTagName("li");

                var bankAnchor = bankQuestionClone.getElementsByTagName("a");
                bankAnchor[0].href = "#collapser" + collapseCounter;
                bankAnchor[0].innerHTML=attrVal.question;
                var collapsingArea=bankQuestionClone.getElementsByClassName("panel-collapse");
                collapsingArea[0].id= ("collapser"+ collapseCounter);
                // console.log("this is the result      ",("collapser"+ collapseCounter));


                switch (attrVal.type) {
                    case 'multi':
                        bankLines[0].innerHTML = attrVal.answered;
                        if (attrVal.answer==attrVal.answered){
                            bankLines[0].className += " list-group-item-success";
                        }
                        else{
                            bankLines[0].className += " list-group-item-danger";
                            bankLines[4].innerHTML=attrVal.feedback;
                            bankLines[4].removeAttribute("style");
                        }
                        bankLines[1].innerHTML = attrVal.choice1;
                        bankLines[2].innerHTML = attrVal.choice2;
                        bankLines[3].innerHTML = attrVal.choice3;
                        break;
                    case 'tf':
                        bankLines[2].parentNode.removeChild(bankLines[2]);
                        bankLines[2].parentNode.removeChild(bankLines[2]);
                        if ((attrVal.answered === attrVal.answer)&&(attrVal.answer === "true")) {
                            bankLines[0].className += " list-group-item-success";
                        }
                        else if ((attrVal.answered === attrVal.answer)&&(attrVal.answer === "false")) {
                            bankLines[1].className += " list-group-item-success";
                        }
                        else if ((attrVal.answered ==="true") && (attrVal.answer==="false")){
                            bankLines[0].className += " list-group-item-danger";
                            bankLines[2].innerHTML=attrVal.feedback;
                            bankLines[2].removeAttribute("style");
                        }
                        else{
                            bankLines[1].className += " list-group-item-danger";
                            bankLines[2].innerHTML=attrVal.feedback;
                            bankLines[2].removeAttribute("style");
                        }
                        break;
                    case 'code':
                        if(attrVal.answered != attrVal.answer){
                            bankLines[0].className+="list-group-item-danger";
                        }
                        else{
                            bankLines[0].className += " list-group-item-success";
                        }
                        bankLines[0].innerHTML = attrVal.answered;
                        bankLines[1].parentNode.removeChild(bankLines[1]);
                        bankLines[1].parentNode.removeChild(bankLines[1]);
                        bankLines[1].innerHTML = attrVal.answer;


                        break;
                }
                bankHolder.appendChild(bankQuestionClone);
                collapseCounter++;
            }
        }
    }


    });

};

function userInfo(){
    sendOver('userinfo',null,function(resp){
        if (resp.login==1){
            userLoggedIn=resp.user;
            userRole=resp.role;
            buttonAdder();
        }
    })

    function buttonAdder(){
        if (userRole=="instructor"){
            addButton("addMultiModBtnDummy");
            addButton("addTfModBtnDummy");
            addButton("addCodeModBtnDummy");
            addButton("testBankButtonDummy");
        }

        if(userLoggedIn!='' && userLoggedIn) {
            addButton("logoutButtonDummy");
            var logoutButton=document.getElementById('logoutButton');
            logoutButton.innerHTML=userLoggedIn+", logout";
        }
    }
}

function releaseExam(releaseThis){
    sendOver('release',releaseThis,function(resp){
       if(resp.status===1){
           currentExams();
       }
    });
}
