<?php
require(__DIR__ . DIRECTORY_SEPARATOR . 'base.php');
$token = $u->genToken($_GET['name'], $_GET['size'], $_GET['time']);

if($token) echo json_encode(array(
    'token' => $token,
    'range' => implode('-', $u->getRange($token)),
    'status' => $u->getStatus($token)
));
