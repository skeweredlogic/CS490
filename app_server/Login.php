<?php
class Login {

	public function post($data, $url) {
		$user = $data['user'];
		$pass = $data['pass'];

		if ($user === "" || !isset($data['user'])) {
			die(json_encode(array(
				"backend" => 0,
				"uid" => "",
				"message" => "credentials are blank")));
		}

		$ch = curl_init();
		$senddata = json_encode(array(
			"uid" => $user,
			"pass" => $pass,
			"cmd" => "login"));
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $senddata);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$success = $return_code === "200";
		curl_close($ch);
		if ($success) {
			$success = 1;
			$_SESSION['login'] = 1;
			$_SESSION['type'] = $result['role'];
			$_SESSION['uid'] = $user;
			$message = "success";
		}
		elseif ($return_code === "500") {
			$success = -1;
			$message = "server error";
		}
		else {
			$success = 0;
			$message = "Invalid credentials";
		}

		die(json_encode(array(
			"backend" => $success,
			"njit" => 0,
			"role" => isset($_SESSION['type']) ? $_SESSION['type'] : "",
			"uid" => $user)));
	}

}

?>