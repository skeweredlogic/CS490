<?php
class Register {
	
	public function post($data) {
		$success = false;

		$type = isset($data['type']) ? $data['type'] : 'student';
		$data['type'] = $type;
		$data['cmd'] = "register";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://web.njit.edu/~rdl4/app.php");
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$result = json_decode(curl_exec($ch),true);

		curl_close($ch);
		$success = $result['status'] === 1;
		if ($success){
			die(json_encode(array(
				"status" => 1)));
		}else{
			die(json_encode(array(
				"status" => 0)));
		}

	}

}
?>