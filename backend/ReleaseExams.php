<?php
    Class ReleaseExams
    {
        public function post($conn, $data) {
            $eid = $data['eid'];
            $result = mysqli_query($conn,
                "SELECT users.uid, grades.eid, grades.grade FROM users LEFT OUTER JOIN grades
                 ON users.uid = grades.uid && grades.eid = $eid
                 WHERE users.role = 'student';");

            if (!$result) {
                mysqli_close($conn);
                die(json_encode(array(
                    "status" => -1,
                    "message" => "query failed")));
            }
			
			$release = mysqli_query($conn,"UPDATE exams SET released = 'r' WHERE eid = $eid;");
			if (!$release) {
                mysqli_close($conn);
                die(json_encode(array(
                    "status" => -1,
                    "message" => "query failed")));
            }

            $return = array();
            while ($row = mysqli_fetch_array($result)) {
                if ($row['grade'] == null) {
                    $uid = $row['uid'];
                    $insert = mysqli_query($conn,
                        "INSERT INTO grades(uid, eid, grade) VALUES( ('$uid'), $eid, 0);");
                    $return[$row['uid']] = array($row['uid'] => $row);
                }
                else {
                    $return[$row['uid']] = array($row['uid'] => $row);
                }
            }
            $return['status'] = 1;

            mysqli_close($conn);
            die(json_encode($return));
        }
    }
?>