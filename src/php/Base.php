<?php
namespace QUpload;

abstract class Base
{
    /**
     * 配置数组
     * @var integer
     */
    protected $config = array();

    /**
     * 加载配置
     * 
     * @param  array  $params 外部配置数组
     * @return void
     */
    public function initConfig(array $params = array())
    {
        foreach($params as $key => $val) {
            if(isset($this->config[$key])) {
                $this->config[$key] = $val;
            }
        }
    }

    public function __get($name)
    {
        return isset($this->config[$name]) ? $this->config[$name] : NULL;
    }
}
