<?php
class GetExam {
	
	public function post($data,$conn) {
		$eid = $data['data'];
		$return = array();
		$exams = mysqli_query($conn, "SELECT * FROM eid_qid WHERE eid = '$eid';");
		if (!$exams) {
			die(json_encode(array(
				"status" => -1,
				"message" => mysqli_error($conn))));
		}
		while($exam = mysqli_fetch_array($exams)) {
			$return[$exam['qid']] = $exam['qid'];
		}
		die(json_encode($return));
	}

}