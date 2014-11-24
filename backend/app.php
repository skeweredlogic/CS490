<?php

/** app.php
 *
 * central backend hub - routes all requests from middleware based
 * on a command field
 *
 */

require 'Login.php';
require 'Register.php';
require 'CreateQuestion.php';
require 'GetBank.php';
require 'CreateExam.php';
require 'ListExams.php';
require 'GetExam.php';
require 'GetGrades.php';
require 'SetStudentAnswers.php';
require 'SetStudentGrade.php';
require 'GetStudentAnswer.php';
require 'ReleaseExams.php';
require 'eid_qid.php';

$data = json_decode(file_get_contents('php://input'),true);
$fun;

if (!isset($data['cmd'])) {
	http_response_code(501);
	die(json_encode(array(
		"message" => "command field not set")));
}

$conn=mysqli_connect("sql2.njit.edu","rdl4","aBcsy1jL","rdl4");
if (mysqli_connect_errno()) {
	http_response_code(500);
	die(json_encode(array(
		"status" => -1,
		"message" => mysqli_connect_error())));
}

switch ($data['cmd']) {
	case "login":
		$fun = new Login;
		$fun->post($data,$conn);
		break;
	case "register":
		$fun = new Register;
		$fun->post($data['data'],$conn);
		break;
	case "createquestion":
		$fun = new CreateQuestion;
		$fun->post($data['data'],$conn);
		break;
	case "bank":
		$fun = new GetBank;
		$fun->post($conn, $data['data']);
		break;
	case "createExam":
		$fun = new CreateExam;
		$fun->post($data['data'],$conn);
		break;
	case "exams":
		$fun = new ListExams;
		$fun->post($data,$conn);
		break;
	case "getExam":
		$fun = new GetExam;
		$fun->post($data,$conn);
		break;
	case "getGrades":
		$fun = new GetGrades;
		$fun->post($data,$conn);
		break;
	case "answered":
		$fun = new SetStudentAnswers;
		$fun->post($data,$conn);
		break;
	case "setStudentGrade":
		$fun = new SetStudentGrade;
		$fun->post($data,$conn);
		break;
	case "getStudentAnswer":
		$fun = new GetStudentAnswer;
		$fun->post($conn);
		break;
    case "release":
		$fun = new ReleaseExams;
		$fun->post($conn, $data['data']);
		break;
    case "eid_qid":
        $fun = new eid_qid;
        $fun->post($conn);
        break;
}

http_response_code(501);
mysqli_close($conn);
die(json_encode(array(
	"message" => "invalid command or not yet implemented")));

?>