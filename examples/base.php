<?php
require __DIR__ . '/../dist/qupload.php';

$u = new QUpload\Uploader();

$u->initConfig(array('path' => __DIR__ . DIRECTORY_SEPARATOR . 'storage'));
$u->init();