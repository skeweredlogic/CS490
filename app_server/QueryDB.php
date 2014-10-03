<?php

function QueryDB($data, $code) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	$result = curl_exec($ch);

	$code = (string)curl_getinfo($ch, CURLINFO_HTTP_CODE);

	curl_close($ch);

	return $result;
}

?>