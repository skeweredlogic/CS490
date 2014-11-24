<?php

/** app.php
 * 
 * central middleware hub - routes all requests from frontend based
 * on a command field
 *
 */

require 'Login.php';
require 'Logout.php';
require 'Register.php';
require 'CreateQuestion.php';
require 'GetBank.php';
require 'CreateExam.php';
require 'ListExams.php';
require 'GetExam.php';
require 'StudentAnswers.php';
require 'UserInfo.php';
require 'ReleaseExam.php';

session_start();
$data = json_decode(file_get_contents('php://input'),true);
$fun;
$backend = "http://osl82.njit.edu/~rdl4/app.php";

if (!isset($data['cmd'])) {
	http_response_code(501);
	die (json_encode(array(
		"message" => "command field not set")));
}

switch ($data['cmd']) {
	case "login":
		$fun = new Login;
		$fun->post($data['data'],$backend);
		break;
	case "logout":
		$fun = new Logout;
		$fun->post();
		break;
	case "register":
		$fun = new Register;
		$fun->post($data['data'],$backend);
		break;
	case "createquestion":
		$fun = new CreateQuestion;
		$fun->post($data,$backend);
		break;
	case "bank":
		$fun = new GetBank;
		$fun->post($data,$backend);
		break;
	case "createExam":
		$fun = new CreateExam;
		$fun->post($data,$backend);
		break;
	case "exams":
		$fun = new ListExams;
		$fun->post($backend);
		break;
	case "getExam":
		$fun = new GetExam;
		$fun->post($data,$backend);
		break;
	case "answered":
		$fun = new StudentAnswers;
		$fun->post($data,$backend);
		break;
	case "userinfo":
		$fun = new UserInfo;
		$fun->post();
		break;
	case "release":
		$fun = new ReleaseExam;
		$fun->post($data,$backend);
}

http_response_code(501);
die (json_encode(array(
	"message" => "invalid command or not yet implemented")));

?>