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
    
    var getFlash = function() {
        return document[id] || window[id] || document.getElementById(id);
    }

    this.upload = function() {        
        getFlash().upload();
    }

    this.abort = function() {
        getFlash().abort();
    }

    this.reset = function() {
        getFlash().reset();
    }

}
FlashUploader.prototype = EventDispatcher.prototype;
FlashUploader.prototype.constructor = FlashUploader;
