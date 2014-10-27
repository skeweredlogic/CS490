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

			//if ($data['role'] === "student") {
				$data['uid'] = $_SESSION['uid'];
				$i = 1;
				foreach ($exam as $key => $value) {
					$return[$i] = $bank[$key];
					//$return[$i][$key]['answered'] = isset($grades[$data['uid']]) ? $grades[$data['uid']] : -1;
					$i++;
				}
			//}


			die(json_encode($return));
		}

		else {
			http_response_code(401);
			//header("Location: http://web.njit.edu/~cjr29/cs490/index.html");
			die(json_encode(array(
				"status" => -1)));
		}
	}
/*
	private function getExam($data,$url) {
		$data['cmd'] = "getExam";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$gotExam = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);

		if (isset($gotExam['status'])) {
			die(json_encode(array(
				"status" => -1)));
		}

		return $gotExam;
	}

	private function getQuestions($data,$url) {
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
		return $bank;
	}
/*
	private function getGrades($data,$url) {
		$data['cmd'] = "getGrades";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$gotGrades = json_decode(curl_exec($ch),true);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);
		if (isset($gotGrades['status'])) {
			die(json_encode(array(
				"status" => -1)));
		}
		return $gotGrades;
	}

	private function getStudentExam($data,$url) {
		$data['cmd'] = "getStudentExam";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
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
	}*/

}
?>