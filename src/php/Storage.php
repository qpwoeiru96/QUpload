<?php
namespace QUpload;

abstract class Storage extends Base
{

    /**
     * 配置数组
     * @var integer
     */
    protected $config = array(
        'clearInterval' => 86400, //实际保存时间是这个的1.5倍 在这个区间内的临时文件都会被保存
        'path' => '' //存储路径 必须为绝对路径
    );

    /**
     * 获取当前存储的路径
     * 
     * @return string
     */
    public function getDir()
    {
        return $this->path . DIRECTORY_SEPARATOR . floor(time() / $this->clearInterval);
    }

    /**
     * 获取上次的存储路径
     * 
     * @return string
     */
    public function getOldDir()
    {
        return $this->path . DIRECTORY_SEPARATOR . (floor(time() / $this->clearInterval) - 1);
    }

    /**
     * 获取过期的路径(只是获取最近的一个)
     * 
     * @return string
     */
    public function getExpireDir()
    {
        return $this->path . DIRECTORY_SEPARATOR . (floor(time() / $this->clearInterval) - 2);
    }

    /**
     * 初始化函数
     * 1、如果存储文件夹不存在那么创建文件夹
     * 2、有概率触发清除老文件
     * 
     * @return void
     */
    public function init()
    {
        if(!file_exists($this->getDir())) {
            mkdir($this->getDir());
        }

        if(mt_rand(0, 99) <= 10) @rmdir($this->getExpireDir());
    }

    /**
     * 获取/查找绝对的文件路径
     * 
     * @param  string $fileName 文件名称
     * @return boolean|string 如果成功返回绝对路径 如果失败返回false
     */
    public function getPath($fileName)
    {
        $filePath    = $this->getDir() . DIRECTORY_SEPARATOR . $fileName;
        $oldFilePath = $this->getOldDir() . DIRECTORY_SEPARATOR . $fileName;

        //判断文件是否存在于当前文件夹
        if(file_exists($filePath)) {
            return $filePath;
        //判断文件是否存在于老的的文件夹
        } elseif(file_exists($oldFilePath)) {
            return !@rename($oldFilePath, $filePath) ?: $filePath;
        } else {
            return false;
        }
    }

    /**
     * 获取文件内容
     * 
     * @param  string $fileName 文件名称
     * @return string|boolean 成功则返回文件内容 失败返回false
     */
    public function fetch($fileName)
    {
        $path = $this->getPath($fileName);
        return $path ? @file_get_contents($path) : false; 
    }

    /**
     * 存储文件
     * 
     * @param  string $fileName 文件名称
     * @param  string|resouce $mixed 存储的内容可以是一个stream或者一个string
     * @return boolean
     */
    public function store($fileName, $mixed)
    {

        $path = $this->getDir() . DIRECTORY_SEPARATOR . $fileName;

        if(!is_resource($mixed)) {
            return (boolean)file_put_contents($path, $mixed);
        } else {
            $fp = fopen($path, 'wb');
            flock($fp, LOCK_EX);
            stream_copy_to_stream($mixed, $fp);
            flock($fp, LOCK_UN);
            fclose($fp);
            return true;
        }

    }

    /**
     * 附加文件内容
     * 
     * @param  string $fileName 文件名称
     * @param  string|resouce $mixed 存储的内容可以是一个stream或者一个string
     * @param  integer $offset 对于文件的偏移量 如果不需要设置请设置为-1
     * -- @param  integer $length 需要附加的长度 如果不限制请设置为-1
     * @return boolean
     */
    public function append($fileName, $mixed, $offset = -1)
    {
        $path = $this->getPath($fileName);

        if($path && is_resource($mixed)) {

            if($offset !== -1) {
                $fp = fopen($path, 'r+b');
                fseek($fp, $offset, SEEK_SET);
            } else {
                $fp = fopen($path, 'a');
            }

            flock($fp, LOCK_EX);

            //while (!feof($mixed)) fwrite($fp, fread($mixed, 8192));
            stream_copy_to_stream($mixed, $fp);
            flock($fp, LOCK_UN);
            fclose($fp);
            return true;
        } elseif ($path) {
            return (boolean)file_put_contents($path, $mixed, FILE_APPEND);
        } else {
            return false;
        }
        
    }

    /**
     * 获取文件的大小（如果不存在则为0）
     * 
     * @param  string $fileName 文件名称
     * @return integer 文件大小
     */
    public function size($fileName)
    {
        clearstatcache();
        $path = $this->getPath($fileName);
        return $path ? (int)filesize($path) : 0;
    }

    /**
     * 判断文件是否存在
     * 
     * @param  [type] $fileName [description]
     * @return [type]           [description]
     */
    public function exists($fileName)
    {
        return (boolean)$this->getPath($fileName);
    }

    public function delete($fileName)
    {
        $path = $this->getPath($fileName);
        return $path ? (boolean)unlink($path) : true;
    }
}
