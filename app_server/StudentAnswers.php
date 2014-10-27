<?php
class StudentAnswers {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === 'student') {
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$result = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);

			$success = $result['status'] === 1 && $return_code === "200";
			if (!$success) {
				die(json_encode(array(
					"status" => -1,
					"message" => "error sending answers to backend")));
			}
			elseif ($return_code === "500") {
				die(json_encode(array(
					"status" => -1,
					"message" => "server error")));
			}

			$gradeIt = $data['data'];
			die(json_encode($gradeit));

		}

		elseif(isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === 'instructor') {
			http_response_code(403);
			die(json_encode(array(
				"status" => -1)));
		}
		else {
			http_response_code(401);
			//header("Location: http://web.njit.edu/~cjr29/cs490/index.html");
			die(json_encode(array(
				"status" => -1)));
		}
	}

}
?>