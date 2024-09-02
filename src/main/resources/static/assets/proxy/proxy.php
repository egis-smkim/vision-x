<?php

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');

	$url = $_REQUEST['url'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);

	$headers = array();
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	try {

		$response = curl_exec($ch);
		// if ($type == 'wms'){
		// 	header('Content-Type: image/png');
		// } else if ($type == 'wfs') {
		// 	header('Content-type: application/xml');
		// } else {
		// 	echo '[Type Error] '.$type;
		// 	return;
		// };

		header('Content-type: application/octet-stream');
		//header('Content-Type: image/jpg');

		//echo $response;
		//$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		//header('Content-type:'.$contentType);
		//echo 'content-type:'.$contentType;
		echo $response;

	} catch(Exception $e) {
		echo e;
	}
	curl_close ($ch);

?>
