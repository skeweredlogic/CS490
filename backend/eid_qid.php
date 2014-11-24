<?php
class eid_qid {

    public function post($conn) {
        $result = mysqli_query($conn, "SELECT * FROM eid_qid;");
        if (!$result) {
            mysqli_close($conn);
            die(json_encode(array(
                "status" => -1,
                "message" => mysqli_connect_error())));
        }

        $return = array();
        while ($row = mysqli_fetch_array($result)) {
            $return[$row['eid']][$row['qid']] = $row['weight'];
        }
        $return['status'] = 1;

        mysqli_close($conn);
        die(json_encode($return));
    }
}
?>