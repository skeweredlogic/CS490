<?php

class CreateQuestion {
	
	public function post($data,$conn) {
		$qid = mysqli_query($conn, "SELECT COUNT(*) FROM bank;");
		$qid = mysqli_fetch_array($qid);

		$question = mysqli_real_escape_string($conn,$data['question']);
		$feedback = mysqli_real_escape_string($conn,$data['feedback']);
		$newqid = $qid[0];
		$type = $data['type'];
		
		switch ($data['type']) {
			case "tf":
				$answer = mysqli_real_escape_string($conn,$data['answer']);
				$choice1 = NULL;
				$choice2 = NULL;
				$choice3 = NULL;
				break;
			case "multi":
				$answer = mysqli_real_escape_string($conn,$data['answer']);
				$choice1 = mysqli_real_escape_string($conn,$data['choice1']);
				$choice2 = mysqli_real_escape_string($conn,$data['choice2']);
				$choice3 = mysqli_real_escape_string($conn,$data['choice3']);
				break;
			case "code":
				$answer = mysqli_real_escape_string($conn,$data['expectedOutput']);
				$choice1 = NULL;
				$choice2 = NULL;
				$choice3 = NULL;
				break;
		}

		$result = mysqli_query($conn, "INSERT INTO bank VALUES ('$newqid','$type','$question','$answer','$feedback','$choice1','$choice2','$choice3');");
		if (!$result) {
			$status = -1;
			$message = mysqli_error($conn);
		}
		else {
			$status = 1;
			$message = "Question successfully created";
		}

		mysqli_close($conn);
		die(json_encode(array(
			"status" => $status,
			"message" => $message)));
	}

}
?>