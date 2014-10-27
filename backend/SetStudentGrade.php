<?php
class SetStudentGrade {
	
	public function post($data,$conn) {
		$eid = $data['eid'];
		$uid = $data['uid'];
		$grade = $data['grade'];
		$result = mysqli_query($conn,"INSERT INTO grades VALUES ('$uid','$eid','$grade');");
		die(json_encode(array(
			"status" => 1)));
	}

}
?>