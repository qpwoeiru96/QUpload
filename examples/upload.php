<?php
set_time_limit(0);
ignore_user_abort(true);


require(__DIR__ . DIRECTORY_SEPARATOR . 'base.php');
$token = isset($_GET['token']) ? $_GET['token'] : null;
$start = isset($_GET['start']) ? (int)$_GET['start'] : null;

if($info = $u->getTokenInfo($token)) {

    $fp = fopen('php://input', 'r');
    $size = $u->size($token);

    //如果上传起始位置大于文件位置 肯定失败
    if($start > $size) exit(0);

    //如果文件已经存在 那么肯定是添加
    if($size > 0) {
        $u->append($token, $fp, $start);
    } else {
        $u->store($token, $fp);
    }

    $status = $u->getStatus($token);
    if($status === 3) {
        $u->delete($token);
        $status = 0;
    }

    echo json_encode(array(
        'range' => implode('-', $u->getRange($token)),
        'status' => $status,
        'token' => $token
    ));
}
