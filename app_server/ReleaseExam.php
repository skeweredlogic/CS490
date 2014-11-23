<?php
class ReleaseExam {
	
	public function post($data,$url) {
		if (!isset($data['eid'])) {
			$data['eid'] = $data['data'];
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($ch);
		$return_code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);

		die($result);
	}

}