/**
 * QUpload v0.1.1
 * 
 * @author qpwoeiru96 <qpwoeiru96@gmail.com>
 * @version  0.1.1 stable
 * @link  http://sou.la/blog
 */
(function($, w, undefined) {
    /**
     * 是否支持HTML5上传的判断
     * @type {boolean}
     */
    var supportHtml5Upload = false;w.File && w.File.prototype.slice && w.XMLHttpRequest;

    var getRandomId = function() {
        return 'QU' + Math.round((Math.random() * 0x7fffffff) + 0x10000000).toString(16);
    }

    var replaceTmpl = function(tmpl, data) {
        return tmpl.replace(/\{\$([\w]+)\}/ig, function(a, b) {
            return typeof data[b] !== 'undefined' ? data[b] : a;
        })

    }

    var printByte = function (byte) {
        if(byte < 1024) {
            return byte.toString() + 'B';
        } else if(byte < 1048576) {
            return (byte / 1024).toFixed(2).toString() + 'KB';
        } else if(byte < 1073741824) {
            return (byte / 1048576).toFixed(2).toString() + 'MB';
        } else {
            return (byte / 1073741824).toFixed(2).toString() + 'GB';
        }
    }

    var swfInject = function(swfPath, elemId, id, width, height, flashVars) {

        var flashVarsArr = [];

        for(var i in flashVars) {
            flashVarsArr.push(escape(i) + '=' + escape(flashVars[i]));
        }

        var template = 
            '<object type="application/x-shockwave-flash" data="{$swfPath}" height="{$height}" width="{$width}" id="{$id}">' +
            '<param name="movie" value="{$swfPath}" />' +
            '<param name="flashvars" value="{$flashVars}" />' + 
            '<param name="swfversion" value="11.2.0" />' + 
            '<param name="allowScriptAccess" value="always"/>' + 
            '<param name="wmode" value="opaque"/>' +
            '<param name="allowNetworking" value="all"/>' + 
            '<param name="src" value="{$swfPath}"/>' + 
            '</object>';

        var html = replaceTmpl(template, {
            'swfPath': swfPath,
            'width': width,
            'height': height,
            'flashVars': flashVarsArr.join('&'),
            'id': id
        });
    
        $('#' + elemId).replaceWith(html);

    }
var Language = (function() {

    var locale = 'zh-cn';

    var Lang = {
            'zh-cn': {
                101: '文件类型不符合需求, 所需: %s, 实际: %s。',
                102: '文件大小超过限制，最大大小: %s，实际大小: %s。',
                201: '服务器出错，上传失败，请重试。',
                301: '请先选择文件再进行上传。',
                302: '请等待初始化完成，已完成 %s%。'
            }
    };

    var r = function(s, l) {
        var i = 0;
        return s.replace(/%s/ig, function() {
            return l[i++];
        });
    }

    var t = function(message, code) {
        var list = message.split('|');
        return r(Lang[locale][code], list);
    }

    return {t: t};
})();
/**
 * 事件分发与绑定处理器
 */
function EventDispatcher() {};

/**
 * 获取事件列表
 * @return {object}
 */
EventDispatcher.prototype.getEvents = function() {

    if( typeof this.events === 'undefined' ) {
        this.events = {};            
    }
    return this.events;
}

/**
 * 添加事件处理
 * @param {string} eventName 事件名称
 * @param {function} func 事件处理的函数
 */
EventDispatcher.prototype.addEventListener = function(eventName, func) {

    if(typeof this.getEvents()[eventName] === 'undefined') {
        this.getEvents()[eventName] = [func];
    } else {
        this.getEvents()[eventName].push(func);
    }
    
}

/**
 * 抛出事件
 * @param  {string} eventName 事件名称
 * @param  {array} args 事件参数
 * @return {void}
 */
EventDispatcher.prototype.emit = function(eventName, args) {

    if(typeof this.getEvents()[eventName] === 'undefined') return false;
    var events = this.getEvents()[eventName];

    //如果是错误
    if('error' === eventName.toLowerCase()) {
        args[0] = Language.t(args[0], args[1]);
    }

    for(var i = 0; i < events.length; i++) {
        events[i].apply(this, args);
    }

}

/**
 * 移除事件处理
 * @param  {string} eventName 事件名称
 * @param  {string} func 事件处理的函数（传入匿名函数一定会失败的）
 * @return {boolean} 移除成功与否
 */
EventDispatcher.prototype.removeEventListener = function(eventName, func) {

    if(typeof this.getEvents()[eventName] === 'undefined') return true;

    var events = this.getEvents()[eventName];

    for(var i = 0; i < events.length; i++) {
        if(events[i] === func) {
            events[i] = events[events.length - 1];
            events.pop();
            return true;
        }
    }
    return false;        
}
/**
 * HTML5的上传处理类
 * @param {Object} options 配置
 */
function Html5Uploader (options) {

    var self   = this,

        /**
         * 上传文件对象
         * @type {Object}
         */
        _file  = null,

        /** 
         * Uploader状态
         * @type {Number}
         */
        status = 0,

        /**
         * XMLHttpRequest 
         * @type {XMLHttpRequest}
         */
        xhr    = null,

        /**
         * 文件信息
         * @type {Object}
         */
        info   = {
            name: null,
            size: null,
            time: null, 
            start: null,
            end: null,
            token: null
        };

    /**
     * 配置信息
     * @type {Object}
     */
    this.options = options;

    /**
     * 设置文件 相当于初始化
     * @param {File} file 上传文件
     */
    this.setFile = function(file) {

        self.abort();
        status = 0;
        _file  = file;
        info   = {
            name: _file.name,
            size: _file.size,
            time: Math.ceil(_file.lastModifiedDate.getTime() / 1000), 
            start: null,
            end: null,
            token: null
        };
    }

    /**
     * 获取文件对象
     * @return {File|Bool} 文件信息
     */
    this.getFile = function() {

        if(_file === null || !(_file instanceof File)) {
            self.emit('error', ['', 301]);
            return false;
        } else return _file;
    }

    /**
     * 设置文件信息
     * @param {String} name 键
     * @param {String|Number} val 值
     */
    this.setInfo = function(name, val) {
        info[name] = val;
    }

    /**
     * 获取文件信息
     * @param  {String} name 所需键
     * @return {String|Number} 返回值
     */
    this.getInfo = function(name) {
        if(typeof name === 'undefined') return info;
        else return info[name];
    }       

    /**
     * 设置XMLHttpRequest对象
     * @param {XMLHttpRequest} x
     */
    this.setXHR = function(x) {
        xhr = x;
    }

    /**
     * 获取XMLHttpRequest对象
     * @return {XMLHttpRequest}
     */
    this.getXHR = function() {
        return xhr;
    }

    /**
     * 获取状态
     * @return {Number} 状态值
     */
    this.getStatus = function() {
        return +status;
    }

    this.getTokenInfo = function() {

        if(self.getInfo('name') === null) {
            self.emit('error', ['', 301]);
            return false;
        }

        var data = {
            name: self.getInfo('name'),
            size: self.getInfo('size'),
            time: self.getInfo('time')
        };
        
        $.ajax({
            url: self.options.tokenUrl,
            type: 'GET',
            data: data,
            dataType: 'json',
            cache: false
        }).fail(function(jqXHR, textStatus, errorThrown) {
            self.emit('error', ['', 201]);
        }).done(function(data, textStatus, jqXHR) {
            self.emit('fetchTokenComplete', [data]);
        });
    }

    this.upload = function() {

        var token = self.getInfo('token'),
            file  = self.getFile();

        if($.trim(token) === '') {
            self.emit('error', ['', 201]);
            return false;
        }

        var xhr = $.ajaxSettings.xhr();

        $(xhr.upload).bind('progress', function(e) {
            self.emit('progress', [e.originalEvent.loaded, +self.getInfo('size')]);
        });

        var param = $.param({
            token: token,
            start: 0,
            end: self.getInfo('size')
        });

        self.setXHR(xhr);

        $.ajax({
            url: [self.options.uploadUrl, param].join('?'),
            type: 'POST',
            dataType: 'json',
            data: file,
            processData: false,
            contentType: file.type,
            xhr: function() {  
                return xhr;
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            self.emit('error', ['', 201]);
        }).done(function(data, textStatus, jqXHR) {
            self.emit('complete', [self.getInfo('token')]);
        });

        file = undefined;

    }
    
    this.multiChunkUpload = function() {

        if(self.getStatus() === 2) {
            self.emit('progress', [+self.getInfo('size'), +self.getInfo('size')]);
            self.emit('complete', [self.getInfo('token')]);
            return;
        }

        var start = self.getInfo('start'),
            end   = self.getInfo('end'),
            token = self.getInfo('token'),
            file  = self.getFile();

        if($.trim(token) === '') {
            self.emit('error', ['', 201]);
            return false;
        }

        var slice = file.slice || file.webkitSlice || file.mozSlice,
            blob  = slice.call(file, start, end, file.type),
            xhr   = $.ajaxSettings.xhr();

        $(xhr.upload).bind('progress', function(e) {
            self.emit('progress', [ +start + e.originalEvent.loaded, +self.getInfo('size')]);
        });

        var param = $.param({
            token: token,
            start: start,
            end: end
        });

        self.setXHR(xhr);

        $.ajax({
            url: [self.options.uploadUrl, param].join('?'),
            type: 'POST',
            dataType: 'json',
            data: blob,
            processData: false,
            contentType: blob.type,
            xhr: function() {  
                return xhr;
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            self.emit('error', ['', 201]);
        }).done(function(data, textStatus, jqXHR) {
            self.emit('uploadChunkFinished', [data]);
        });

        blob = undefined;
    }

    this.addEventListener('fetchTokenComplete', function(data) {

        var range = data.range.split('-');

        status = data.status;

        self.setInfo('token', data.token);
        self.setInfo('start', range[0]);
        self.setInfo('end', range[1]);

        this.multiChunkUpload();
    });

    this.addEventListener('uploadChunkFinished', function(data) {

        status = data.status;
        var range = data.range.split('-');
        self.setInfo('start', range[0]);
        self.setInfo('end', range[1]);

        if(self.getStatus() === 2) {
            self.emit('complete', [self.getInfo('token')]);
        } else {
            self.multiChunkUpload();
        }

    });

    this.abort = function() {
        var xhr = self.getXHR();
        if(xhr) xhr.abort();
    }

    this.reset = function() {
        this.abort();
        _file  = null,
        status = 0,
        xhr    = null,
        info   = {
            name: null,
            size: null,
            time: null, 
            start: null,
            end: null,
            token: null
        };
    }

}

Html5Uploader.prototype = EventDispatcher.prototype;
Html5Uploader.prototype.constructor = Html5Uploader;


function FlashUploader(options, id) {

    this.upload = function() {
        var flash = document.getElementById(id);
        flash.upload();
    }

    this.abort = function() {
        var flash = document.getElementById(id);
        flash.abort();
    }

    this.reset = function() {
        var flash = document.getElementById(id);
        flash.reset();
    }

}
FlashUploader.prototype = EventDispatcher.prototype;
FlashUploader.prototype.constructor = FlashUploader;
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
    var size = 11, offset = 5;

    if(supportHtml5Upload) {
        var inputId = 'QUpload_input_' + this.id;
        //如果是html5的话必须是那个file input上传啊
        var $input = $('<form/>').attr('id', inputId).css({
            height: size,
            width: size,
            display: 'block',
            opacity: 0,
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            value: '',
            overflow: 'hidden'
        }).appendTo(document.body).html('<input type="file" style="pointer: cursor;"/>');

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

        var divId = 'QUpload_div_' + this.id,
            flashId = 'QUpload_flash_' + this.id;
        var $div = $('<div/>').html('<div id="' + flashId + '"></div>').attr('id', divId).css({
            height: size,
            width: size,
            display: 'block',
            opacity: 0,
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
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

        $elem.on('mousemove', function(event) {
            $move.css({ top: event.pageY - offset, left: event.pageX - offset });
        });
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

})(jQuery, window);
