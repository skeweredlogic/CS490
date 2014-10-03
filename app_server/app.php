<?php

require 'Login.php';
require 'Register.php';

$data = json_decode(file_get_contents('php://input'),true);
$fun;

switch ($data['cmd']) {
	case "login":
		$fun = new Login;
		$fun->post($data);
		break;
	case "register":
		$fun = new Register;
		$fun->post($data);
		break;
}

?>