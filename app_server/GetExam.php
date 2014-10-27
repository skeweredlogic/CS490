<?php
class GetExam {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === true) {
			$data['role'] = $_SESSION['type'];
			$data['eid'] = $data['data'];

			$data['cmd'] = "bank";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$bank = json_decode(curl_exec($ch),true);
			curl_close($ch);
			if ($bank['status'] === -1) {
				die(json_encode(array(
					"status" => -1)));
			}
			unset($bank['status']);

			$data['cmd'] = "getExam";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$exam = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);

			if (isset($exam['status'])) {
				die(json_encode(array(
					"status" => -1)));
			}

			$data['cmd'] = "getGrades";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$grades = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);
			if (isset($grades['status'])) {
				die(json_encode(array(
					"status" => -1)));
			}

			$return = array();
			$return[0] = array("eid" => $data['data']);

			if ($data['role'] === "student") {
				$data['uid'] = $_SESSION['uid'];
				$i = 1;
				foreach ($exam as $key => $value) {
					$return[$i] = $bank[$key];
					$i++;
				}
				if(isset($grades[$data['uid']])) {

				}
			}


			die(json_encode($return));
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