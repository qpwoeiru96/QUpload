<?php
$classMap = array(
    'Base.php',
    'Exception.php',
    'Storage.php',
    'Uploader.php'
);

$content = '';
foreach($classMap as $val) {
    $content .= file_get_contents( __DIR__ . DIRECTORY_SEPARATOR . $val );
}
file_put_contents( realpath(__DIR__ . '/../../dist/qupload.php'), "<?php \nnamespace QUpload;" . str_replace(array('<?php', 'namespace QUpload;', "\n\n\n"), array('', '', "\n\n"), $content));
