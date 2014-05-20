var FlashProxy = {
    register: function(id, obj) {
        this[id] = obj;
    }
};

function QUpload(options) {

    var self = this;

    this.options = $.extend({

        /**
         * 获取令牌的地址
         * method: GET
         * params: time name size
         * dataType: JSON
         */
        tokenUrl: 'token.php',

        /**
         * 上传文件地址
         * method: POST
         * params: token start end
         * dataType: JSON
         */
        uploadUrl: 'upload.php',

        /**
         * Flash文件地址
         */
        swfPath: 'qupload.swf',

        /**
         * 文件上传的最大大小
         * default: 128MB
         */
        maxFileSize: 134217728,
        
        /**
         * 允许上传的文件名称
         * 以|为间隔
         */
        allowedExt: 'gif|jpg|png|zip|rar',

        /**
         * 语言区域 暂不支持
         * @type {String}
         */
        locale: 'zh-cn'
    }, options);

    this.id = getRandomId();

    /**
     * 移动小点的大小
     */
    var size = 3, offset = 1;

    if(supportHtml5Upload) {
        var inputId = 'QUpload_input_' + this.id;
        //如果是html5的话必须是那个file input上传啊
        var $input = $('<form/>').attr('id', inputId).hide().appendTo(document.body).html('<input type="file" style="pointer: cursor;"/>');

        $input.find('input').on('change', function() {
            if(this.files.length > 0) {
                var file = this.files.item(0);                
                var ext = file.name.split('.').pop();

                if(self.options.allowedExt.split('|').indexOf(ext.toLowerCase()) === -1) {
                    self.uploader.emit('error', [[self.options.allowedExt.split('|').join('/'), ext].join('|'), 101]);
                    self.reset();
                } else if (file.size > self.options.maxFileSize) {
                    self.uploader.emit('error', [[printByte(self.options.maxFileSize), printByte(file.size)].join('|'), 102]);
                    self.reset();
                } else {
                    self.uploader.setFile(file);
                    self.uploader.emit('select', [{
                        name: file.name,
                        size: file.size,
                        time: Math.round(file.lastModifiedDate.getTime() / 1000)
                    }]);                    
                }
            }
        });

        this.uploader = new Html5Uploader(this.options, this.id);

    } else {

        var flashId = 'QUpload_flash_' + this.id;
        var $div = $('<div/>').attr('id', flashId).css({
            height: size,
            width: size,
            display: 'block',
            opacity: 1,
            background: '#000',
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            lineHeight: 0,
            fontSize: 0
        }).appendTo(document.body);

        swfInject(this.options.swfPath, flashId, this.id, size, size, {
            flashProxyId: this.id,
            uploadUrl: this.options.uploadUrl,
            tokenUrl: this.options.tokenUrl,
            maxFileSize: this.options.maxFileSize,
            allowedExt: this.options.allowedExt
        });

        this.uploader = new FlashUploader(this.options, this.id);

        FlashProxy.register(this.id, this.uploader);
    };


    /**
     * 注入某个元素 点击该元素即可选择上传文件
     * @param String elem 
     * @return void
     */
    this.inject = function(elem) {

        var $move = supportHtml5Upload ? $input : $div,
            $elem = $(elem);

        if(!supportHtml5Upload) {
            $elem.on('mousemove', function(event) {
                $move.css({ top: event.pageY - offset, left: event.pageX - offset });
            });
        } else {
            $elem.on('click', function() {
                $input.find('input').get(0).click();
            });
        }
            
            
    };

    /**
     * 开始上传文件
     * @return void
     */
    this.upload = function() {

        if(supportHtml5Upload) {
            this.uploader.getTokenInfo();
        } else {
            this.uploader.upload();
        }
    
    };

    /**
     * 重置上传
     * @return void
     */
    this.reset = function() {
        if(supportHtml5Upload) document.getElementById('QUpload_input_' + this.id).reset();
        this.uploader.reset();
    }

    /**
     * 断开文件上传
     * @return void
     */
    this.abort = function() {
        this.uploader.abort();
    };

    /**
     * 添加事件监听
     * @param String eventName
     * @param Function listener
     * @return void
     */
    this.addEventListener= function(eventName, listener) {
        if('progress|error|complete|select'.indexOf(eventName) !== -1) {
            return self.uploader.addEventListener(eventName, listener);
        }
    };

    /**
     * 移除事件监听
     * @param String eventName
     * @param Function listener
     * @return void
     */
    this.removeEventListener = function(eventName, listener) {
        if('progress|error|complete|select'.indexOf(eventName) !== -1) {
            return self.uploader.removeEventListener(eventName, listener);
        }
    };
}

QUpload.prototype = {

    constructor : QUpload,

    PROGRESS : 'progress',

    ERROR : 'error',

    COMPLETE : 'complete',

    SELECT: 'select'
}

QUpload.FlashProxy = FlashProxy;

//因为Flash的关系必须暴露到全局空间
w.QUpload = QUpload;

