<?php
class Register {
	
	public function post($data, $url) {
		$success = false;

		$type = isset($data['type']) ? $data['type'] : 'student';
		$data['type'] = $type;
		$data['cmd'] = "register";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($ch);

		curl_close($ch);
		die($result);
	}

}
?>