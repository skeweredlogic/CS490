<?php

class Register {
	
	public function post($data, $conn) {
		$user = $data['uid'];
		$pass = $data['pass'];
		$role = $data['role'];
		$result = mysqli_query($conn, "SELECT uid FROM users WHERE uid = '$user';");
		if (!$result) {
			mysqli_close($conn);
			die(json_encode(array(
				"status" => -1,
				"message" => mysql_error())));
		}
		$row = mysqli_fetch_array($result);

		if ($row == NULL) {
			$result = mysqli_query($conn, "INSERT INTO users VALUES ('$user','$pass','$role');");
			if (!$result) {
				$status = -1;
				$message = mysql_error();
			}
			else {
				$status = 1;
				$message = "User created successfully";
			}
		}
		else {
			$status = 0;
			$message = "User already exists";
		}
		mysqli_close($conn);
		die(json_encode(array(
			"status" => $status,
			"message" => $message,
			"user" => $data['user'])));
	}

}

?>