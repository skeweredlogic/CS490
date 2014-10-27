<?php
class CreateExam {
	
	public function post($data,$conn) {
		$eid = mysqli_query($conn, "SELECT COUNT(*) FROM exams;");
		$eid = mysqli_fetch_array($eid);
		$neweid = $eid[0];
		$name = mysqli_real_escape_string($conn,$data['name']);
		$result = mysqli_query($conn, "INSERT INTO exams VALUES ('$neweid','$name');");
		if (!$result) {
			die(json_encode(array(
				"status" => -1,
				"message" => mysqli_error($conn))));
		}
		unset($data['name']);
		foreach($data as $key => $value) {
			$result = mysqli_query($conn, "INSERT INTO eid_qid VALUES ('$neweid','$key');");
			if (!$result) {
				die(json_encode(array(
					"status" => -1,
					"message" => mysqli_error($conn))));
			}
		}
		die(json_encode(array(
			"status" => 1,
			"message" => "Exam successfully created")));
	}

}
?>