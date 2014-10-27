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
				$grade = (float)0;
				$studentGrades = array();
				$return[$curreid] = array($curreid => array(
					"named" => $currexam['name'],
					"released" => "nr",
					"grade" => $grade));
				$accum = 0;
				while ($currgrade = mysqli_fetch_array($grades)) {
					$studentGrades[$currgrade['uid']] = $currgrade['grade'];
					$grade = $grade + $currgrade['grade'];
					$accum++;
				}
				$return[$curreid][$curreid]['grade'] = $grade ? (float)$grade/$accum : -1;
				$return[$curreid][$curreid]['grades'] = $studentGrades;
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
				$grades = mysqli_query($conn,"SELECT * FROM grades WHERE uid = '$uid' AND eid = '$curreid';");
				$grade = -1;
				$return[$curreid] = array($curreid => array(
					"named" => $currexam['name'],
					"released" => "nr",
					"grade" => -1));

				while ($currgrade = mysqli_fetch_array($grades)) {
					if (isset($currgrade['grade']) && $curreid === $currgrade['eid']) {
						$grade = $currgrade['grade'];
					}
					else {
						$grade = -1;
					}
				}

				$return[$curreid][$curreid]['grade'] = $grade;
			}
			$return['status'] = 1;
			die(json_encode($return));
		}
	}

}
?>