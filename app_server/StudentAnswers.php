<?php

class StudentAnswers {
	
	public function post($data, $url) {
		if(isset($_SESSION['uid']) && $_SESSION['login'] === 1 && $_SESSION['type'] === 'student') {
			$data['data']['uid'] = $_SESSION['uid'];

			$gradeIt = $data['data'];
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

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("cmd" => "eid_qid")));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

			$eid_qid = json_decode(curl_exec($ch),true);
			$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);

			unset($bank['status']);
			unset($gradeIt['cmd']);
			$eid = $gradeIt['eid'];
			unset($gradeIt['eid']);
			$uid = $gradeIt['uid'];
			unset($gradeIt['uid']);
			$grade = 0;
			$qcount = 0;
			foreach ($gradeIt as $key => $value) {
				if ($bank[$key][$key]['type'] === "code") {
					$prefix = "./codeqs/".$uid."_".$eid."_".$key."_";
					$newfile = $prefix."code.py";
					$outfile = $prefix."out.txt";
					$errfile = $prefix."err.txt";
					$var1 = $bank[$key][$key]['choice1'];
					$var2 = $bank[$key][$key]['choice2'];
					$code = str_replace("<div>","\n",$value);
					$code = str_replace(array("&nbsp;","</div>"),"",$code);
					preg_match('/(.*)?def (.*)?\((.*)?\):/',$value,$fname);
					$fname = $fname[2];
					$codestring = "import sys\n".$code."\n".$fname."(";
					if($var1 === "" && $var2 === "") {
						$codestring = $codestring.")";
					}
					elseif($var1 === "") {
						$codestring = $codestring.$var2.")";
					}
					elseif($var2 === "") {
						$codestring = $codestring.$var1.")";
					}
					else {
						$codestring = $codestring.$var1.",".$var2.")";
					}
					file_put_contents($newfile,$codestring);
					chmod($newfile,0777);
					$cmd = "/usr/local/bin/python3.4.0a1 ".$newfile." > ".$outfile." 2> ".$errfile;
					$ch = curl_init();
					curl_setopt($ch, CURLOPT_URL, "http://osl83.njit.edu/~rj252/app_server/MyExec.php");
					curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("cmd" => $cmd)));
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
					curl_exec($ch);
					curl_close($ch);
					//exec($cmd);
					/*$cmd = "/usr/local/bin/python3.4.0a1 ".$newfile;
					$proc = proc_open($cmd,array(
						1 => array('pipe','w'),
						2 => array('pipe','w'),
					),$pipes);
					$stdout = stream_get_contents($pipes[1]);
					file_put_contents($outfile,$stdout);
					fclose($pipes[1]);
					$stderr = stream_get_contents($pipes[2]);
					file_put_contents($errfile,$stderr);
					fclose($pipes[2]);*/
					// unfortunately this doesn't work on afs
					$stdout = file_get_contents($outfile);
					$stderr = file_get_contents($errfile);

					$data['data'][$key] = $stdout;

					if ($stderr != "") {}
					else {
						$stdout = str_replace(array("\n"," ","\t","\r"),"",$stdout);
						$correct = str_replace(array("\n"," ","\t","\r"),"",$bank[$key][$key]['answer']);
						if (strcasecmp($stdout,$correct) == 0) {
							$grade = $grade + $eid_qid[$eid][$key];
						}
					}
				}
				elseif ($bank[$key][$key]['type'] === "fill") {
					$correct = str_replace(array("\n"," ","\t"),"",$bank[$key][$key]['answer']);
					$answered = str_replace(array("\n"," ","\t"),"",$value);
					if (strcasecmp($correct,$answered) == 0) {
						$grade = $grade + $eid_qid[$eid][$key];
						$data['data'][$key] = $bank[$key][$key]['answer'];
					}
				}
				elseif ($bank[$key][$key]['answer'] === $value) {
					$grade = $grade + $eid_qid[$eid][$key];
				}
				$qcount = $qcount + $eid_qid[$eid][$key];
			}
			$finalgrade = (float)$grade/(float)$qcount;
			$finalgrade = $finalgrade*100;

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

		elseif(isset($_SESSION['uid']) && $_SESSION['login'] === 1 && $_SESSION['type'] === 'instructor') {
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