什么是QUpload？
===========

QUpload是一个使用PHP + HTML5、Flash的断点续传解决方案。可以说他不仅仅是一个软件而是一套软件。

PS:基本上跟 百度FEX这个项目 https://github.com/fex-team/webuploader 异曲同工 不过人家侧重前端 我侧重工程 除了图片压缩 预览 以及分片上传没有之外 其他差不多 代码实现上 人家比较可扩展  我比较原始（注重 能用就行）当然也确实放在我们一个学习管理系统项目上 作为视频文件传输的控件 经过了用户的验证

QUpload有什么特点？
===========

 1. 服务端纯php实现无需安装其他的扩展（PHP_VERSION >= 5.3.0）。
 2. 文件上传大小不受 upload_max_filesize 和 post_max_size 这两个配置的限制（因为使用了分块上传技术）。不过需要注意的是web容器比如IIS跟Nginx的最大支持请求主体的设置：确认 applicationhost.config 或 web.config 文件中的 configuration/system.webServer/security/requestFiltering/requestLimits@maxAllowedContentLength 设置。
 3. 兼容性好（支持IE6+ Chrome Firefox ...) 反正HTML5跟Flash至少有一项么。
 4. 支持断点续传（妈妈再也不需要担心上传进度丢失啦）。
 5. 自带过期内容清除机制（妈妈再也不需要担心碎片文件占用空间的问题）。
 6. 上传大文件服务端占用内存小。
 7. 最大支持目前测试过的1G是没问题的（使用HTML5）,Flash勉强500MB吧，当然不支持断点续传的话 Flash也能支持1GB的水准。（PS:因为Flash目前暂不开放本地文件分割的API导致，所需文件需要导入到内存才能进行分割然后进行上传，所以1GB的文件需要1GB的内存，O! My God！原谅我把，实在是迫不得已。）
 8. 半实时的进度显示。(因为as3中URLLoader的ProgressEvent无法支持上传进度的显示，所以Flash的上传都是每次分块完成之后才能显示的，表现为隔一段时间进度条涨一次。而HTML5则无此问题。)

   
客户端如何使用?
===========

引入脚本
----

    //jQuery.js(1.9以上2.0以下的版本都可以吧) 和 QUpload.js
    <script src="http://libs.baidu.com/jquery/1.10.2/jquery.min.js"></script>
    <script src="qupload.js"></script>
    

实例化QUpload
----------

    var u = new QUpload({
        tokenUrl: '/QUpload/token',
        uploadUrl: '/QUpload/upload',
        swfPath: 'qupload.swf',
        maxFileSize: 134217728,
        allowedExt: 'gif|jpg|png|zip|rar'
    });

配置项说明
-----

    tokenUrl: 获取令牌的地址
    uploadUrl: 上传文件地址
    swfPath: Flash文件地址
    maxFileSize: 文件上传的最大大小
    allowedExt: 允许上传的文件扩展名称 以|为间隔

接口说明
----

    /**
     * 注入某个元素 点击该元素即可选择上传文件（就是在此元素上面覆盖了一透明层）
     * @param ElementNode elem 
     * @return void
     */
    QUpload::inject(elem:ElementNode):void
     
    /**
     * 开始上传文件
     * @return void
     */
    QUpload::upload():void
     
    /**
     * 重置上传环境
     */
    QUplpad::reset():void
     
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

客户端事件
-----

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

    /**
     * 文件选择完成事件
     * @param Object file 选择的文件信息 包含name（文件名称） size（文件大小） time（文件修改时间）
     */
    QUpload.SELECT

客户端错误
-----

声明：错误分两种错误一种是本地错误，一般是网络错误，本地错误一般是文件不符合需求会重置上传，错误号以1开头，网络错误是2开头，会中断上传。其他错误以3开头代表逻辑错误，比如未选文件就开始上传。

    101: '文件类型不符合需求, 所需: %s, 实际: %s。'
    102: '文件大小超过限制，最大大小: %s，实际大小: %s。'
    201: '服务器出错，上传失败，请重试。'
    301: '请先选择文件再进行上传。'

目前造成网络错误的原因比较多，为了不给使用者造成困扰，所以统一为201。（PS: 特别是Flash上传的时候请注意如果swf文件地址跟上传地址不在一个地方的时候请注意你的crossdomain.xml是否已经存在并且设置正确。否则会触发安全错误。）


服务端如何使用?
===========

尚待补上 可参加DEMO。
