<?php

class Register {
	
	public function post($data) {
		$success = false;

		$user = $data['user'];
		$pass = $data['pass'];
		$type = isset($data['type']) ? $data['type'] : 'student';

		$send = json_encode(array(
			"user" => $user,
			"pass" => $pass,
			"type" => $type,
			"cmd" => "register"));
		$code = 0;
		$result = json_decode(QueryDB($send, $code),true);
		$success = $result['status'] === 'success';
		if ($success){
			die(json_encode(array(
				"message" => "success")));
		}else{
			die(json_encode(array(
				"message" => "failure")));
		}

	}
}

?>