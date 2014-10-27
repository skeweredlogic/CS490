<?php
class GetBank {
	
	public function post($url) {
		if (isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === "instructor") {
			/*$q1 = array(
				"type" => "multi",
				"question" => "yes?",
				"answer" => "yes",
				"feedback" => "obviously yes is the right answer",
				"choice1" => "thing",
				"choice2" => "stuff",
				"choice3" => "asdf");
			$q2 = array(
				"type" => "tf",
				"question" => "yes?",
				"answer" => "true",
				"feedback" => "obviously true");
			$q3 = array(
				"type" => "code",
				"question" => "write some code yo",
				"answer" => "1 2 3 4",
				"feedback" => "you could do this with a simple for loop");
			$data = array(
				"0" => array("0" => $q1),
				"1" => array("1" => $q2),
				"2" => array("2" => $q3));
			die(json_encode($data));*/

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("cmd" => "bank")));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$result = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);

			$success = $result['status'] === 1 && $return_code === "200";

			if($success) {
				unset($result['status']);
				die(json_encode($result));
			}
			elseif($return_code === "500") {
				http_response_code(500);
				die(json_encode(array(
					"status" => -1,
					"message" => "server error")));
			}
			else {
				die(json_encode(array(
					"status" => 0,
					"message" => "failed to retrieve question bank")));
			}
		}
		elseif(isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === "student") {
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