<?php
class CreateExam {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === 1 && $_SESSION['type'] === 'instructor') {
			if(isset($data['data']['inlineRadioOptions'])) {
				unset($data['data']['inlineRadioOptions']);
			}
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$result = curl_exec($ch);

			curl_close($ch);

			die($result);
		}
		elseif(isset($_SESSION['uid']) && $_SESSION['login'] === 1 && $_SESSION['type'] === 'student') {
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