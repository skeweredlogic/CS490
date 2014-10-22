<?php
class Logout {

	public function post() {
		session_destroy();
		header("location: http://web.njit.edu/~cjr29/cs490/index.html");
		exit();
	}

}