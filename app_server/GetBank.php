<?php
class GetBank {
	
	public function post() {
		if (isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === "instructor") {
			$q1 = array(
				"type" => "multi",
				"question" => "yes?",
				"answer" => "yes",
				"feedback" => "obviously yes is the right answer",
				"choice1" => "thing",
				"choice2" => "stuff",
				"choice3" => "asdf");
			$q2 = array(
				"type" => "tf",
				"question" => "yes?",
				"answer" => "true",
				"feedback" => "obviously true");
			$q3 = array(
				"type" => "code",
				"question" => "write some code yo",
				"answer" => "1 2 3 4",
				"feedback" => "you could do this with a simple for loop");
			$data = array(
				"0" => array("0" => $q1),
				"1" => array("1" => $q2),
				"2" => array("2" => $q3));
			die(json_encode($data));
		}
		elseif(isset($_SESSION['uid']) && $_SESSION['login'] === true && $_SESSION['type'] === "student") {
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