<?php
class SetStudentAnswers {
	
	public function post($data,$conn) {
		unset($data['cmd']);
		$data=$data['data'];
		$eid = $data['eid'];
		unset($data['eid']);
		$uid = $data['uid'];
		unset($data['uid']);
		$result = mysqli_query($conn,"SELECT * FROM answers WHERE uid = '$uid' AND eid = '$eid'");
		$answers = mysqli_fetch_array($result);
		if ($answers != NULL) {
			die(json_encode(array(
				"status" => 0,
				"message" => "student already took this exam")));
		}
		foreach ($data as $key => $value) {
			$result = mysqli_query($conn,"INSERT INTO answers VALUES ('$uid','$eid','$key','$value');");
		}
		die(json_encode(array(
			"status" => 1)));
	}

}
?>