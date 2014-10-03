<?php
class Login {

	public function post($data) {
		$user = str_replace("@njit.edu", "", $data['user']);
		$pass = $data['pass'];

		$success_njit = $this->njitlogin($user, $pass);
		$success_backend = $this->backendlogin($user, $pass);

		die(json_encode(array(
			"njit" => $success_njit,
			"backend" => $success_backend,
			"uid" => $user)));
	}

	private function njitlogin($user, $pass) {
		$lc = @ldap_connect("ldap://ldap.njit.edu");
		if (!$lc) {
			return -1;
		}
		$b = @ldap_bind ($lc, ("uid=" . $user . ", ou=people, O=NJIT, C=US"), $pass);
		if ($b === -1) {}
		elseif ($b == FALSE) {
			$b = 0;
		}
		else {
			$b = 1;
		}
		return $b;
	}

	private function backendlogin($user, $pass) {
		$ch = curl_init();
		$url = "http://web.njit.edu/~rdl4/Login.php";
		$senddata = json_encode(array(
			"uid" => $user,
			"pass" => $pass,
			"cmd" => "login"));
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $senddata);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($ch);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		$success = $return_code === "200";
		if ($success) {
			$success = 1;
		}
		else {
			$success = 0;
		}
		return $success;
	}
	
}

?>