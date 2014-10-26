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

session_start();
$data = json_decode(file_get_contents('php://input'),true);
$fun;

if (!isset($data['cmd'])) {
	die (json_encode(array(
		"message" => "command field not set")));
}

switch ($data['cmd']) {
	case "login":
		$fun = new Login;
		$fun->post($data['data']);
		break;
	case "logout":
		$fun = new Logout;
		$fun->post();
		break;
	case "register":
		$fun = new Register;
		$fun->post($data['data']);
		break;
	case "createquestion":
		$fun = new CreateQuestion;
		$fun->post($data);
		break;
	case "bank":
		$fun = new GetBank;
		$fun->post();
		break;
	case "createExam":
		$fun = new CreateExam;
		$fun->post($data);
		break;
	case "exams":
		$fun = new ListExams;
		$fun->post();
		break;
	case "getExam":
		$fun = new GetExam;
		$fun->post($data);
		break;
	case "answered":
		$fun = new StudentAnswers;
		$fun->post($data);
		break;
}

http_response_code(501);
die (json_encode(array(
	"message" => "invalid command or not yet implemented")));

?>