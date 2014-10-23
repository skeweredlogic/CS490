<?php
class GetExam {
	
	public function post($data) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === true) {
			$data['role'] = $_SESSION['type'];

			$gotExam = getExam($data);

			if ($data['role'] === 'instructor') {
				$gotGrades = getGrades($data);
				unset($gotGrades['status']);
				$gotExam['students'] = $gotGrades;
				$gotExam['status'] = 1;

				die(json_encode($gotExam));
			}

			else {
				$data['uid'] = $_SESSION['uid'];
				$gotStudentExam = getStudentExam($data);
				foreach(array_keys($gotExam) as $key) {
					switch ($key) {
						case "eid":
						case "status":
						case "named":
						case "students":
						default:
							$gotExam[$key]['answered'] = $gotStudentExam[$key]['answered'];
					}
				}
				$gotExam['status'] = 1;
				die(json_encode($gotExam));
			}
		}

		else {
			http_response_code(401);
			header("Location: http://web.njit.edu/~cjr29/cs490/index.html");
			die(json_encode(array(
				"status" => -1)));
		}
	}

	private function getExam($data) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://web.njit.edu/~rdl4/app.php");
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$gotExam = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);

		$success = $gotExam['status'] === 1 && $return_code === "200";

		if (!$success) {
			die(json_encode(array(
				"status" => -1,
				"message" => "error getting exam from backend")));
		}
		elseif ($return_code === "500") {
			http_response_code(500);
			die(json_encode(array(
				"status" => -1,
				"message" => "server error")))
		}

		return $gotExam;
	}

	private function getGrades($data) {
		$data['cmd'] = "getGrades";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://web.njit.edu/~rdl4/app.php");
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$gotGrades = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);

		$success = $gotGrades['status'] === 1 && $return_code === "200";

		if (!$success) {
			die(json_encode(array(
				"status" => -1,
				"message" => "error getting student grades from backend")));
		}
		if ($success) {
			return $gotGrades;
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
				"message" => "Failed to retrieve exam")));
		}
	}

	private function getStudentExam($data) {
		$data['cmd'] = "getStudentExam";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://web.njit.edu/~rdl4/app.php");
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$gotStudentExam = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);

		$success = $gotStudentExam['status'] === 1 && $return_code === "200";

		if (!$success) {
			die(json_encode(array(
				"status" => -1,
				"message" => "error getting student exam from backend")));
		}
		if ($success) {
			return $gotStudentExam;
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
				"message" => "Failed to retrieve exam")));
		}
	}

}
?>