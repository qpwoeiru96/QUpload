QUploader
=========

一个可断点续传的上传客户端使用(HTML5跟Flash) PHP为服务端

客户端API接口:

/**
 * 注入某个id的元素 点击该id即可选择上传文件
 * @param String id 
 * @return void
 */
QUpload::inject(id:String):void

/**
 * 开始上传文件
 * @return void
 */
QUpload::upload():void


/**
 * 断开文件上传
 * @return void
 */
QUpload::abort():void


/**
 * 添加事件监听
 * @param String eventName
 * @param Function listener
 * @return void
 */
QUpload::addEventListener(eventName:String, listener:Function):void

/**
 * 移除事件监听
 * @param String eventName
 * @param Function listener
 * @return void
 */
QUpload::removeEventListener(eventName:String, listener:Function):void


客户端事件类型:

/**
 * 上传进度事件
 * @param Number loadedByte 已加载的字节数
 * @param Number totalByte 剩余未加载的字节数
 */
QUpload.PROGRESS

/**
 * 上传错误事件
 * @param String message 错误信息
 * @param Number code 错误代码
 */
QUpload.ERROR

/**
 * 上传完成事件
 * @param String token 上传文件令牌 根据此令牌可以去服务端获得指定的文件
 */
QUpload.COMPLETE
