<?php
class GetBank {

   public function post($conn, $data) {
        if (!isset($data)) {
            $result = mysqli_query($conn, "SELECT * FROM bank;");
        }
        else if (!isset($data['type'])) {
            $offset = $data['offset'];
            $num = $data['num'];
            $result = mysqli_query($conn, "SELECT * FROM bank LIMIT $offset,$num;");
        }
        else if (!isset($data['offset']) && !isset($data['num'])) {
            $type = $data['type'];
            $result = mysqli_query($conn, "SELECT * FROM bank WHERE type = ('$type');");
        }
        else if (isset($data['offset']) && isset($data['num']) && isset($data['type'])) {
            $type = $data['type'];
            $offset = $data['offset'];
            $num = $data['num'];
            $result = mysqli_query($conn, "SELECT * FROM bank WHERE type = ('$type') LIMIT $offset,$num;");
        }
        else {
           die(json_encode(array(
               "status" => -1,
               "message" => "unrecognized json"
           )));
        }
        if (!$result) {
            mysqli_close($conn);
            die(json_encode(array(
                "status" => -1,
                "message" => mysqli_connect_error())));
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