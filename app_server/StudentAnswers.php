<?php
class StudentAnswers {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === 'student') {
			$data['data']['uid'] = $_SESSION['uid'];
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$result = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			curl_close($ch);

			$success = $result['status'] === 1 && $return_code === "200";
			if (!$success) {
				die(json_encode($result));
			}
			elseif ($return_code === "500") {
				die(json_encode(array(
					"status" => -1,
					"message" => "server error")));
			}

			$gradeIt = $data['data'];
			$gradeIt['cmd'] = "bank";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($gradeIt));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$bank = json_decode(curl_exec($ch),true);
			curl_close($ch);
			if ($bank['status'] === -1) {
				die(json_encode(array(
					"status" => -1)));
			}
			unset($bank['status']);
			unset($gradeIt['cmd']);
			$eid = $gradeIt['eid'];
			unset($gradeIt['eid']);
			$uid = $gradeIt['uid'];
			unset($gradeIt['uid']);
			$grade = 0;
			$qcount = 0;
			foreach ($gradeIt as $key => $value) {
				if ($bank[$key][$key]['answer'] === $value) {
					$grade++;
				}
				$qcount++;
			}
			$finalgrade = (float)$grade/(float)$qcount;
			$finalgrade = $finalgrade*100;
			$send = json_encode(array(
				"uid" => $uid,
				"eid" => $eid,
				"grade" => $finalgrade,
				"cmd" => "setStudentGrade"));

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $send);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$return = json_decode(curl_exec($ch),true);
			curl_close($ch);
			die(json_encode($return));

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