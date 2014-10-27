<?php
class GetBank {
	
	public function post($conn) {
		$result = mysqli_query($conn, "SELECT * FROM bank;");
		if (!$result) {
			mysqli_close($conn);
			die(json_encode(array(
				"status" => -1,
				"message" => mysql_error())));
		}

		$return = array();
		while ($row = mysqli_fetch_array($result)) {
			$return[$row['qid']] = array($row['qid'] => $row);
		}
		$return['status'] = 1;

		mysqli_close($conn);

		die(json_encode($return));
	}

}
?>