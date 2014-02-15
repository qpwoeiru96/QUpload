<?php
namespace QUpload;

class Uploader extends Storage
{        
    const TOKEN_FILE_EXT = '.json';

    protected $tokenFileCache = array();

    /**
     * 配置数组
     * @var integer
     */
    protected $config = array(
        'clearInterval' => 86400, //实际保存时间是这个的1.5倍 在这个区间内的临时文件都会被保存
        'path' => '', //存储路径 必须为绝对路径
        'blockSize' => 4194304,
        'hash' => array(__CLASS__, 'hash')
    );

    public function genToken()
    {

        $token = call_user_func_array($this->hash, func_get_args());
        $tokenFile = $token . self::TOKEN_FILE_EXT;

        if($this->exists($tokenFile)) {

            $info = $this->fetch($tokenFile);
            $info = json_decode($info, true);
            $this->tokenFileCache[$token] = $info;

        } else {
            list($fileName, $fileSize, $fileTime) = func_get_args();
            $info = array(
                'name'   => $fileName,
                'size'   => (int)$fileSize,
                'time'   => (int)$fileTime
            );
            if( !$this->store($tokenFile, json_encode($info)) ) return false;
            $this->tokenFileCache[$token] = $info;
        }

        return $token;

    }

    /**
     * [getRange description]
     * @param  [type] $token [description]
     * @return [type]        [description]
     */
    public function getRange($token)
    {
        $info      = $this->getTokenInfo($token);
        $size      = $this->size($token);
        $totalSize = $info['size'];

        $start = $size > $totalSize ? $totalSize : $size;
        $end   = $start + $this->blockSize > $totalSize ? $totalSize : $start + $this->blockSize;
        return  array($start, $end);
    }

    public function getTokenInfo($token)
    {
        if(isset($this->tokenFileCache[$token])) return $this->tokenFileCache[$token];
        $tokenFile = $token . self::TOKEN_FILE_EXT;

        $info = $this->fetch($tokenFile);

        if($info && $data = json_decode($info, true)) {
            $this->tokenFileCache[$token] = $data;
            return $data;          
        } else {
            return false;
        }
    }

    /**
     * 根据Token获取上传文件状态
     * 
     * @param  [type] $token [description]
     * @return [type]        [description]
     */
    public function getStatus($token)
    {
        $size = $this->size($token);

        if($size === 0) return 0;

        $info = $this->getTokenInfo($token);
        $totalSize = $info['size'];

        if($size > $totalSize) return 3;
        if($size == $totalSize) return 2;
        if($size < $totalSize) return 1;
        
    }

    public static function hash()
    {
        return call_user_func('sha1', implode('_', func_get_args()));
    }

    public function init()
    {
        parent::init();
    }

}
