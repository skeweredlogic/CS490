<?php
class GetGrades {

	public function post($data,$conn) {
		$curreid = $data['eid'];
		$grades = mysqli_query($conn,"SELECT * FROM grades;");
		$return = array();
		if ($grades != NULL) {
			while ($currgrade = mysqli_fetch_array($grades)) {
					$return[$currgrade['uid']] = $currgrade['grade'];
			}
		}
		die(json_encode($return));
	}

}
?>