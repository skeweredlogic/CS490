<?php
class GetExam {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === 1) {
			$data['role'] = $_SESSION['type'];
			$data['eid'] = $data['data'];
			$eid = $data['eid'];

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("cmd" => "bank")));
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

			$data['cmd'] = "getStudentAnswer";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$answers = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("cmd" => "eid_qid")));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$eid_qid = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

			$return = array();
			$return[0] = array("eid" => $data['data']);

			if ($data['role'] === "student") {
				$data['uid'] = $_SESSION['uid'];
				$i = 1;
				foreach ($exam as $key => $value) {
					$return[$i] = $bank[$key];
					$return[$i][$key]['answered'] = $answers[$_SESSION['uid']][$data['eid']][$key];
					$return[$i][$key]['weight'] = $eid_qid[$eid][$key];
					if ($bank[$key][$key]['type'] === "code") {
						$prefix = "./codeqs/".$data['uid']."_".$return[0]['eid']."_".$key."_";
						$code = file_get_contents($prefix."code.py");
						$code = str_replace("\n","<br>",$code);
						$code = str_replace(" ","&nbsp; ",$code);
						$stdout = file_get_contents($prefix."out.txt");
						$stderr = file_get_contents($prefix."err.txt");
						$return[$i][$key]['answered'] = $code;
						$return[$i][$key]['stdout'] = $stdout;
						$return[$i][$key]['stderr'] = $stderr;
					}
					$i++;
				}
				if(isset($grades[$data['uid']])) {

				}
			}
			if ($data['role'] === "instructor") {
				$i = 1;
				foreach ($exam as $key => $value) {
					$return[$i] = $bank[$key];
					$return[$i][$key]['answered'] = $return[$i][$key]['answer'];
					$return[$i][$key]['weight'] = $eid_qid[$eid][$key];
					$i++;
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