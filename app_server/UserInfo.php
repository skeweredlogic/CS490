<?php
class UserInfo {
	
	public function post() {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === 1) {
			die(json_encode(array(
				"user" => $_SESSION['uid'],
				"role" => $_SESSION['type'],
				"login" => $_SESSION['login'])));
		}
		else {
			http_response_code(401);
			die(json_encode(array(
				"login" => 0,
				"message" => "no active session")));
		}
	}

}
?>