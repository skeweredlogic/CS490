<?php
class ListExams {
	public function post($url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === true) {

			$data['role'] = $_SESSION['type'];
			$data['uid'] = $_SESSION['uid'];
			$data['cmd'] = "exams";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$result = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);

			$success = $result['status'] === 1 && $return_code === "200";
			if ($success) {
				unset($result['status']);
				die(json_encode($result));
			}
			elseif ($return_code === "500") {
				http_response_code(500);
				die(json_encode(array(
					"status" => -1,
					"message" => "server error")));
			}
			else {
				die(json_encode(array(
					"status" => 0,
					"message" => "Failed to retrieve exam list",
					"code" => $return_code)));
			}
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