/**
 * Created by frosti on 10/17/2014.
 */
var outerBoarder;
var submitButtonContainer;
var userRole;
var userLoggedIn;
var checkedQuestions={};

window.onload= function() {
    outerBoarder = document.getElementById("outerBoarder");
    submitButtonContainer=document.getElementById("submitButtonContainer");
    createIndex();
    // testAddAllButtons();
};

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
            $('#addMultiModal').modal('hide');
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
        'expectedOutput':document.getElementById("codeAnswer").value,
        'choice1':document.getElementById("codeChoice1").value,
        'choice2':document.getElementById("codeChoice2").value,
        'feedback':document.getElementById("codeAnswerFeedback").value
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
            $('#addCodeModal').modal('hide');
            alertz("success","question added successfully","yes");
        }
        else{
            alertz("danger",resp.message,subButton);
        }
        console.log(resp);
    });
}

function createFill(subButton){
    var question ={
        'type':'fill',
        'question':document.getElementById("fillQuestion").value,
        'answer':document.getElementById("fillAnswer").value,
        'feedback':document.getElementById("fillFeedback").value
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
            $('#addFillModal').modal('hide');
            alertz("success","question added successfully","yes");
        }
        else{
            alertz("danger",resp.message,subButton);
        }
        console.log(resp);
    });
}

function pullBank(filter,index){
    var questionsPerPage=5;
    var data={};
    var pageNumber=1;
    if (filter){
        data['type']=filter;
    }
    if (index) {
        data['low'] = Number(index);
    }
    else{
        data['low'] = 0;
    }
    data['num']=questionsPerPage;
    sendOver('bank',data,function(resp){
        if(index || filter){
            partialClear();
            var nextButton=document.getElementById("nextFilter");
            if (index) {
                nextButton.name = Number(index) + Number(questionsPerPage);
                pageNumber= Math.floor((Number(nextButton.name) + 1) / 5);
            }
            else{
                nextButton.name = Number(questionsPerPage);
            }
            var prevButton=document.getElementById("prevFilter");
            if (index>0) {
                prevButton.name = Number(index) - Number(questionsPerPage);

            }
            else{
                prevButton.name=0;
                pageNumber= 1;
            }
            if (filter){
                var index0=document.getElementById("index0Filter");
                index0.name=filter; //this makes no sense. pretty sleepy atm.
            }
        }
        else{
            pageClear();
            dummyAdder("createIndexDummy");
            dummyAdder("createExamButtonDummy");

            var filterDiv=document.createElement('div');
            filterDiv.className='container';
            filterDiv.id='filterDiv';
            submitButtonContainer.insertBefore(filterDiv,submitButtonContainer.childNodes[0]);

            dummyAdder("multiFilterDummy","filterDiv");
            dummyAdder("tfFilterDummy","filterDiv");
            dummyAdder("codeFilterDummy","filterDiv");
            dummyAdder("fillFilterDummy","filterDiv");
            dummyAdder("allFilterDummy","filterDiv");

            var directionDiv=document.createElement('div');
            directionDiv.className='container';
            directionDiv.id='directionDiv';
            submitButtonContainer.insertBefore(directionDiv,submitButtonContainer.childNodes[0]);

            dummyAdder("index0FilterDummy","directionDiv");
            dummyAdder("prevFilterDummy","directionDiv");
            dummyAdder("pageNumberDummy","directionDiv");
            dummyAdder("nextFilterDummy","directionDiv");

            var nextButton2=document.getElementById("nextFilter");
            nextButton2.name=Number(questionsPerPage);


        }
        var pageNumberButton=document.getElementById("pageNumber");
        pageNumberButton.innerHTML=pageNumber;

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

        for (var i in resp) {

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
                        case 'fill':
                            bankLines[0].innerHTML = attrVal.answer;
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            break;
                        case 'code':



                            bankLines[0].innerHTML = "<strong> var 1:</strong> <br>"+ attrVal.choice1;
                            bankLines[1].innerHTML = "<strong> var 2:</strong> <br>"+ attrVal.choice2;
                            bankLines[2].innerHTML = "<strong> Expected Output:</strong> <br>"+ attrVal.answer;
                            break;
                    }
                    bankHolder.appendChild(bankQuestionClone);
                    collapseCounter++;
                }
            }
        }
        //var barbs=$("input[name*='spinner']").spinner();
        //barbs=$("span[class*='triangle']").addClass("pull-right");
        //barbs[0].spinner();
        // console.log(barbs);
        var checkboxes = document.getElementsByTagName("input");
       // delete checkboxes[0];
        for (var x in checkboxes){
            var xName = checkboxes[x].name;
            if (xName in checkedQuestions){
                var inputs=document.getElementsByName(xName);
                inputs[0].checked=true;
            }
        }
    });


}

function createExam(){
    /*var examName=document.getElementById("examName").value;
     var checkBoxes=document.getElementsByTagName("input");
     var questions={};
     for (var x=0; x<checkBoxes.length;x++){
     if (checkBoxes[x].checked && checkBoxes[x].name!="checkboxDummy"){
     var checkboxName=checkBoxes[x].name;
     var weight;
     weight=document.getElementById(checkboxName+"spinner").value;
     if (isNaN(weight) || weight<0 || weight=="") {
     weight = 1;
     }
     else if(weight>5){
     weight=5;
     }
     questions[checkboxName]= weight;

     //  console.log(checkBoxes[x].name);
     }
     }
     questions['name']=examName;
     console.log(questions);
     if (questions['name']==""){
     alertz('warn','Please enter an exam name', "yes");
     return;
     }
     if (Object.keys(questions).length<2){
     alertz('warning',"Please select at least one question","yes");
     return;
     }*/
    /*
     sendOver('createExam',questions,function(resp){
     if (resp.status==1){
     pageClear();
     createIndex();
     alertz("success","exam creation success","yes");
     }
     });
     */

// new
    var examName=document.getElementById("examName").value;
    checkedQuestions['name']=examName;
    //console.log(questions);
    if (checkedQuestions['name']==""){
        alertz('warn','Please enter an exam name', "yes");
        return;
    }
    if (Object.keys(checkedQuestions).length<2){
        alertz('warning',"Please select at least one question","yes");
        return;
    }
    //console.log(checkedQuestions);
    sendOver('createExam',checkedQuestions,function(resp){
     if (resp.status==1){
     pageClear();
     createIndex();
     checkedQuestions={};
     alertz("success","exam creation success","yes");
     }
     });
}

function currentExams(){

    sendOver('exams',null,function(resp){
        pageClear();
        dummyAdder("createIndexDummy");
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

                if (userRole=='instructor'){
                    var reviewButtonClone2=examReviewButton.cloneNode(true);
                    reviewButtonClone2.setAttribute("name",attrName);
                    nameCell.appendChild(reviewButtonClone2);

                    if (attrVal.grade=="-1"){
                        gradesCell.innerHTML="Not yet taken";
                    }
                    else{
                        gradesCell.innerHTML=attrVal.grade;
                    }

                    if (attrVal.released=="nr"){
                        var releaseClone=examReleasebutton.cloneNode(true);
                        releaseClone.setAttribute("name",attrName);
                        releasedCell.appendChild(releaseClone);
                        releasedCell.innerHTML+=" No";
                    }
                    else{
                        releasedCell.innerHTML="Yes";
                    }
                }

                if (userRole=='student'){
                    if (attrVal.grade=="-1"){
                        if(attrVal.released=="nr") {
                            var buttonClone = examTakeButton.cloneNode(true);
                            //  buttonClone.removeAttribute("style");
                            buttonClone.setAttribute("name", attrName);
                            nameCell.appendChild(buttonClone);
                        }
                        gradesCell.innerHTML="Not yet taken";
                    }
                    else if (attrVal.released=="nr"){
                        releasedCell.innerHTML="No";
                        gradesCell.innerHTML="Not yet released";
                    }
                    else{
                        var reviewButtonClone=examReviewButton.cloneNode(true);
                        reviewButtonClone.setAttribute("name",attrName);
                        nameCell.appendChild(reviewButtonClone);
                        gradesCell.innerHTML=attrVal.grade;
                        releasedCell.innerHTML="Yes";

                    }
                }
                nameCell.innerHTML+=("  "+ attrVal.named);
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
        dummyAdder("createIndexDummy");
        dummyAdder("postExamDummy");
        var questionNumber=0;
        for (var i in resp) {
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
                else {
                    questionNumber++;
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
                            var orderArray = [0,1,2,3];
                            multiMixer(orderArray);
                            theRadios = multiCloned.getElementsByTagName("label");
                            theRadios[orderArray[1]].innerHTML += attrVal.choice2;
                            theRadios[orderArray[1]].setAttribute("data-choice", attrVal.choice2);
                            theRadios[orderArray[2]].innerHTML += attrVal.choice3;
                            theRadios[orderArray[2]].setAttribute("data-choice", attrVal.choice3);

                            if (attrVal.choice4) {
                                theRadios[orderArray[3]].innerHTML += attrVal.choice4;
                                theRadios[orderArray[3]].setAttribute("data-choice", attrVal.choice4);
                                theRadios[orderArray[0]].innerHTML += attrVal.choice1;
                                theRadios[orderArray[0]].setAttribute("data-choice", attrVal.choice1);

                            }
                            else if (attrVal.answer) {
                                theRadios[orderArray[0]].innerHTML += attrVal.answer;
                                theRadios[orderArray[0]].setAttribute("data-choice", attrVal.answer);

                                theRadios[orderArray[3]].innerHTML += attrVal.choice1;
                                theRadios[orderArray[3]].setAttribute("data-choice", attrVal.choice1);

                            }

                            theRadios = multiCloned.getElementsByTagName("h3");
                            theRadios[0].innerHTML += questionNumber+". "+ attrVal.question;
                            theRadios[0].firstElementChild.innerHTML += attrVal.weight;


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
                            tfRadios[0].innerHTML += questionNumber+". "+ attrVal.question;
                            tfRadios[0].firstElementChild.innerHTML += attrVal.weight;

                            outerBoarder.appendChild(tfCloned);
                            break;

                        case 'fill':
                        case 'code':
                            var fillDummy = document.getElementById("fillDummy");
                            var fillCloned = fillDummy.cloneNode(true);
                            // codeCloned.removeAttribute("style");
                            fillCloned.setAttribute("id", key);
                            var fillTextArea;
                            fillTextArea = fillCloned.getElementsByTagName("p");
                            fillTextArea[0].setAttribute("name", key);

                            var fillQuestion = fillCloned.getElementsByTagName("h3");
                            fillQuestion[0].innerHTML += questionNumber+". "+ attrVal.question;
                            fillQuestion[0].firstElementChild.innerHTML += attrVal.weight;


                            outerBoarder.appendChild(fillCloned);
                            break;
                    }
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
    var fillAreas = document.getElementsByTagName("p");
    for (var x=0; x<fillAreas.length; x++){
        var fillArea=fillAreas[x];
        var fillAreaName=fillArea.getAttribute("name");
        if (fillAreaName!="fillDummy"){
                answers[fillAreaName] = fillAreas[x].innerHTML;
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

function partialClear(){
    while (outerBoarder.hasChildNodes()){
        outerBoarder.removeChild(outerBoarder.lastChild);
    }
}

function createIndex(){
    pageClear();
    dummyAdder("createIndexDummy");
    dummyAdder("examsButtonDummy");
    checkedQuestions={};
    if (!userLoggedIn ||!userRole) {
        userInfo();
    }
    else{
        if (userRole=="instructor"){
            dummyAdder("addMultiModBtnDummy");
            dummyAdder("addTfModBtnDummy");
            dummyAdder("addCodeModBtnDummy");
            dummyAdder("addFillModBtnDummy");
            dummyAdder("testBankButtonDummy");
        }

        if(userLoggedIn!='' && userLoggedIn) {
            dummyAdder("logoutButtonDummy");
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

function dummyAdder(button,id){
    var dummy;
    dummy=document.getElementById(button);
    dummy=dummy.cloneNode(true);
    dummy.id=button.slice(0,-5); //slices the "dummy" off of buttons
    if (id && id!="") {
        var victim = document.getElementById(id);
        victim.appendChild(dummy);
    }
    else{
        submitButtonContainer.appendChild(dummy);
    }
}

function testAddAllButtons(){
    dummyAdder("createIndexDummy");
    dummyAdder("examsButtonDummy");
    dummyAdder("addMultiModBtnDummy");
    dummyAdder("addTfModBtnDummy");
    dummyAdder("addCodeModBtnDummy");
    dummyAdder("testBankButtonDummy");
    dummyAdder("logoutButtonDummy");
    dummyAdder("postExamDummy");
    dummyAdder("getExamDummy");
    dummyAdder("loginDummy")
}

function reviewExam(fetchThis){

    sendOver('getExam',fetchThis,function(resp){
        pageClear();

        dummyAdder("createIndexDummy");


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

        for (var i in resp) {

            var obj = resp[i];
            for (var key in obj) {

                var attrName = key;
                var attrVal = obj[key];
                //console.log(attrName," :  ",attrVal);
                // console.log(attrName);
                if (attrName!="eid") {
                    var bankQuestionClone = bankQuestion.cloneNode(true);
                    var bankCheckbox = bankQuestionClone.getElementsByTagName("input");
                    var weightField = bankCheckbox[1];
                    bankCheckbox = bankCheckbox[0];
                    bankCheckbox.parentNode.removeChild(bankCheckbox);
                    weightField.value=attrVal.weight;
                    weightField.type="text";
                    weightField.disabled="disabled";
                    var bankLines = bankQuestionClone.getElementsByTagName("li");

                    var bankAnchor = bankQuestionClone.getElementsByTagName("a");
                    bankAnchor[0].href = "#collapser" + collapseCounter;
                    bankAnchor[0].innerHTML=attrVal.question;
                    var collapsingArea=bankQuestionClone.getElementsByClassName("panel-collapse");
                    collapsingArea[0].id= ("collapser"+ collapseCounter);
                    // console.log("this is the result      ",("collapser"+ collapseCounter));


                    switch (attrVal.type) {
                        case 'multi':


                            bankLines[0].innerHTML = attrVal.answer;
                            bankLines[1].innerHTML = attrVal.choice1;
                            bankLines[2].innerHTML = attrVal.choice2;
                            bankLines[3].innerHTML = attrVal.choice3;



                                var x;
                               switch(attrVal.answered){
                                   case attrVal.answer:
                                       x=0;
                                       break;
                                   case attrVal.choice1:
                                       x=1;
                                       break;
                                   case attrVal.choice2:
                                       x=2;
                                       break;
                                   case attrVal.choice3:
                                       x=3;
                                       break;
                                   case "":

                                       break;
                               }
                                if (x=="0"){
                                    bankLines[0].className += " list-group-item-success";
                                }
                                else if(x!=""){
                                    bankLines[x].className += " list-group-item-danger";
                                }
                                bankLines[4].innerHTML="<strong> Feedback: </strong> <br>"+ attrVal.feedback;
                                bankLines[4].removeAttribute("style");
                                bankLines[4].className += " list-group-item-info";


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
                                bankLines[2].innerHTML="<strong> Feedback: </strong> <br>"+ attrVal.feedback;
                                bankLines[2].removeAttribute("style");
                            }
                            else{
                                bankLines[1].className += " list-group-item-danger";
                                bankLines[2].innerHTML="<strong> Feedback: </strong> <br>"+ attrVal.feedback;
                                bankLines[2].removeAttribute("style");
                            }
                            break;
                        case 'fill':
                            if(attrVal.answered != attrVal.answer){
                                bankLines[0].className+=" list-group-item-danger";
                            }
                            else{
                                bankLines[0].className += " list-group-item-success";
                            }
                            bankLines[0].innerHTML = attrVal.answered;
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].parentNode.removeChild(bankLines[1]);
                            bankLines[1].innerHTML = attrVal.answer;
                            break;
                        case 'code':

                            bankLines[0].innerHTML = "<strong> var 1:</strong> <br>"+ attrVal.choice1;
                            bankLines[1].innerHTML = "<strong> var 2:</strong> <br>"+ attrVal.choice2;
                            bankLines[2].innerHTML = "<strong> Expected Output:</strong> <br>"+ attrVal.answer;
                            bankLines[3].innerHTML = "<strong> Your Output:</strong> <br>"+ attrVal.stdout;
                            bankLines[4].innerHTML = "<strong> Errors:</strong> <br>"+ attrVal.stderr;
                            bankLines[5].innerHTML = "<strong> Your Code:</strong> <br>"+ attrVal.answered;

                            bankLines[4].removeAttribute("style");
                            bankLines[5].removeAttribute("style");
                            if(attrVal.correct=="yes"){
                                bankLines[3].className += " list-group-item-success";
                            }
                            else{
                                bankLines[3].className+=" list-group-item-danger";
                                bankLines[6].removeAttribute("style");
                                bankLines[6].innerHTML = "<strong> Feedback: </strong> <br>"+ attrVal.feedback;
                                bankLines[6].className+=" list-group-item-info";

                            }
                            break;
                    }
                    bankHolder.appendChild(bankQuestionClone);
                    collapseCounter++;
                }
            }
        }


    });

}

function userInfo(){
    sendOver('userinfo',null,function(resp){
        if (resp.login==1){
            userLoggedIn=resp.user;
            userRole=resp.role;
            buttonAdder();
        }
    });

    function buttonAdder(){
        if (userRole=="instructor"){
            dummyAdder("addMultiModBtnDummy");
            dummyAdder("addTfModBtnDummy");
            dummyAdder("addCodeModBtnDummy");
            dummyAdder("testBankButtonDummy");
        }

        if(userLoggedIn!='' && userLoggedIn) {
            dummyAdder("logoutButtonDummy");
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

function checkboxMagic(checkbox){
    if (checkbox.checked){
        console.log("checking");
        var weight=document.getElementById(checkbox.name+"spinner").value;
        if (isNaN(weight) || weight<0 || weight=="") {
            weight = 1;
        }
        else if(weight>5){
            weight=5;
        }
        checkedQuestions[checkbox.name]=weight;
    }
    else
    {
        console.log("unchecking");
        delete checkedQuestions[checkbox.name];
    }
    console.log(checkedQuestions);
}

function tomato(){
    $(function() {
        var body = $('body');
        var backgrounds =['url(bd/1.png)',
            'url(bd/2.jpeg)',
            'url(bd/3.jpg)',
            'url(bd/4.jpg)',
            'url(bd/5.jpg)',
            'url(bd/6.jpg)',
            'url(bd/7.jpg)',
            'url(bd/8.jpg)',
            'url(bd/9.png)',
            'url(bd/10.jpg)',
            'url(bd/11.jpg)',
            'url(bd/12.jpg)',
            'url(bd/13.jpg)'];

        var current = 0;

        function nextBackground() {
            body.css(
                'background',
                backgrounds[current = ++current % backgrounds.length]
            );

            setTimeout(nextBackground, 5000);
        }
        setTimeout(nextBackground, 5000);
        body.css('background', backgrounds[0]);
    });
}

function multiMixer(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}