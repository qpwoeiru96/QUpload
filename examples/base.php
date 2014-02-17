<?php
require __DIR__ . '/../dist/qupload.php';

$u = new QUpload\Uploader();

$u->initConfig(array(
    'path' => __DIR__ . DIRECTORY_SEPARATOR . 'storage',
    'blockSize' => 4 * 1024 * 1024,
    'flashBlockSize' => 256 * 1024,
    'isFlash' => isset($_GET['client']) && $_GET['client'] === 'flash'
));
$u->init();