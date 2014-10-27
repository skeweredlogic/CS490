<?php
class ListExams {
	
	public function post($data, $conn) {
		if ($data['role'] === "instructor") {
			$return = array();
			$exams = mysqli_query($conn,"SELECT * FROM exams;");
			if (!$exams) {
				die(json_encode(array(
					"status" => -1,
					"message" => mysqli_error($conn))));
			}

			while ($currexam = mysqli_fetch_array($exams)) {
				$curreid = $currexam['eid'];
				$grades = mysqli_query($conn,"SELECT * FROM grades WHERE eid = '$curreid';");
				$grade = array("0" => -1);
				$return[$curreid] = array($curreid => array(
					"named" => $currexam['name'],
					"released" => "nr",
					"grade" => $grade));
				if ($grades != NULL) {
					while ($currgrade = mysqli_fetch_array($grades)) {
						$curruid = $currgrade['uid'];
						$grade[$curruid] = $currgrade['grade'];
					}
					$return[$curreid]['grade'] = $grade;
				}
			}
			$return['status'] = 1;
			die(json_encode($return));
		}
		else {
			$uid = $data['uid'];
			$return = array();
			$exams = mysqli_query($conn,"SELECT * FROM exams;");
			if (!$exams) {
				die(json_encode(array(
					"status" => -1,
					"message" => mysqli_error($conn))));
			}

			while ($currexam = mysqli_fetch_array($exams)) {
				$curreid = $currexam['eid'];
				$grades = mysqli_query($conn,"SELECT * FROM grades where eid = '$curreid';");
				$grade = -1;
				$return[$curreid] = array($curreid => array(
					"named" => $currexam['name'],
					"released" => "nr",
					"grade" => $grade));
				if ($grades != NULL) {
					while ($currgrade = mysqli_fetch_array($grades)) {
						if ($currgrade['uid'] === $uid) {
							$grade = $currgrade['grade'];
						}
					}
					$return[$curreid]['grade'] = $grade;
				}
			}
			$return['status'] = 1;
			die(json_encode($return));
		}
	}

}
?>