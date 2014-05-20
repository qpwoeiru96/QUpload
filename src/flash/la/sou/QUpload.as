package la.sou
{
    import flash.net.*;
    import flash.events.*;
    import flash.display.DisplayObject;
    import flash.external.ExternalInterface;
    import flash.utils.ByteArray;
    import flash.system.Security;

    import la.sou.File;
    
    /**
     * 
     */
    public class QUpload 
    {
        // 文件上传以及分割类
        private var _file:File;
        
        // 根显示对象
        private var _root:DisplayObject;
        
        // 配置信息
        private var _config:Object;
        
        // 文件上传的URLLoader
        private var _urlLoader:URLLoader;
        
        // 文件是否是在上传中
        private var _onUploading:Boolean = false;
        
        /**
         * 获取配置
         *
         * @return  Object
         */
        public function get config():Object
        {
            return this._config;
        }
       
        /**
         * 构造函数
         * @param root
         */
        public function QUpload(root:DisplayObject):void
        {
            
            this._root = root;
            
            // 允许上传文件到任意域名
            Security.allowDomain("*");
            
            //分析外部的环境配置
            this._parseConfig();            
          
            this._root.stage.addEventListener(MouseEvent.CLICK, this._rootStageClickHandler);
			
			//添加外部接口
			root.addEventListener(Event.ENTER_FRAME, registerExternalCallbacks);
        }
		
		protected function registerExternalCallbacks(event:Event):void {

			this._root.removeEventListener(Event.ENTER_FRAME, registerExternalCallbacks);
     		ExternalInterface.addCallback('upload', this.upload);
            ExternalInterface.addCallback('getFileInfo', this.getFileInfo);
            ExternalInterface.addCallback('abort', this.abort);
            ExternalInterface.addCallback('reset', this.reset);
		}
        
        /**
         * 开始上传文件
         */
        public function upload():void
        {
            // 如果文件没有进行选择  
            if (!this._file || !this._file.selected) {
				this._throwError('', 301);
                
              
			// 如果文件正在上传中 或者加载中而且标志了加载后立即上传 那么无需处理
            } else if (this._onUploading || (!this._file.loaded && this._file.immediatelyUpload)) {
                //抛出信息
                info('upload.info', '不需要进行任何操作。上传中:' 
                     + this._onUploading 
                     + ',加载完成:' 
                     + this._file.loaded
                     + ',需要立即上传:' + this._file.immediatelyUpload
                );
                
                
            // 如果文件没有加载完成
            } else if (!this._file.loaded) {
                
                //抛出信息
                info('upload.info', '未加载完成需要加载完成立即上传');
                
                //设置标识位为true 代表加载完成之后立即上传
                this._file.immediatelyUpload = true;

                //同时抛出一个进度条事件
                this._emitEvent('progress', [0, this._file.size]);
                
            } else {
                this._getToken();
            }
        }
        
        /**
         * 重置上传环境
         */
        public function reset():void
        {
        	if(this._file) this._file.cancel();
			this._file = null;
            this.abort();            
        }
        
        /**
         * 退出上传
         */
        public function abort():void
        {
            try {
                this._urlLoader.close();
            } catch (e) { }

            if(this._file) this._file.immediatelyUpload = false;
            this._onUploading = false;
        }

        /**
         * 获取当前上传文件的信息
         * 
         * @return Object
         */
        public function getFileInfo():Object
        {
            if (this._file.selected) {
                return  {
                    name: this._file.name,
                    time: this._file.time,
                    size: this._file.size
                }
            } else {
                return {};
            }
        }
        
        /**
         * 弹出事件到外部空间
         * 
         * @param String eventName
         * @param Array args
         */
        private function _emitEvent(eventName:String, args:Array):void
        {
            var funcName:String = [
                'QUpload.FlashProxy',
                this.config.flashProxyId,
                'emit'
            ].join('.');
            
            ExternalInterface.call(funcName, eventName, args);
        }
              
        /**
         * 绑定文件事件
         * 
         * @param File file
         * @return void
         */
        private function _bindFileEvent(file:File):void
        {
            file.addEventListener(Event.COMPLETE, this._fileLoadComplete, false, 0, true);
            file.addEventListener(IOErrorEvent.IO_ERROR, this._IOErrorHandler, false, 0, true);
            file.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this._securityErrorHandler, false, 0, true);
        }
        
        /**
         * 文件加载完成事件
         * 
         * @param Event event
         * @return void
         */
        private function _fileLoadComplete(event:Event):void
        {     
            //判断标志位 再者判断是否是属于当前文件
            if(this._file === event.target && this._file.immediatelyUpload) {
                info('file load complete', '文件加载完成开始立即上传');
                this._getToken();
            }                
        }
        
        /**
         * 文件选择完成之后的操作
         */
        private function _fileSelectHandler(event:Event):void
        {
            var file = event.target,
                ext:String = file.name.split('.').pop();
				
			trace(file);
            
			//判断文件是否超过最大大小
            if (file.size > this.config.maxFileSize) {
                this._emitEvent('error', [[printByte(this.config.maxFileSize), printByte(file.size)].join('|'), 102]);
                this.reset();
				
			//判断文件是否符合类型
            } else if (this.config.allowedExt.indexOf(ext.toLowerCase()) === -1) {
                this._emitEvent('error', [[this.config.allowedExt.join('/'), ext].join('|'), 101]);
                this.reset();
				
			//正常的文件
            } else {
				

                //重置上传环境 因为用户已经选择新的文件
                this.reset();                
                this._bindFileEvent(file);
                this._file = file;
                file.load();
				
				this._emitEvent('select', [{
                    name: file.name,
                    size: file.size,
                    time: file.time
                }]);
				
                
            }            
        }
        
        private function _getUploadLoader():URLLoader
        {
            try {
                this._urlLoader.close();
            } catch (e)  {}
            
            this._urlLoader = new URLLoader();
            //不在需要绑定进度事件 反正又没用
            //this._urlLoader.addEventListener(ProgressEvent.PROGRESS, this._progressHandler, false, 0, true); 
            this._urlLoader.addEventListener(Event.COMPLETE, this._chunkUploadCompelete, false, 0, true);
            this._urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this._securityErrorHandler, false, 0, true);
            this._urlLoader.addEventListener(IOErrorEvent.IO_ERROR, this._IOErrorHandler, false, 0, true);
            return this._urlLoader;
        }
        
        private function _uploadComplete(token:String)
        {
            this._emitEvent('progress', [this._file.size, this._file.size]);
            this._emitEvent('complete', [token]);
            this.reset();
        }
        
        private function _uploadChunk(token:String, start:Number, end:Number)
        {
            var bytes:ByteArray,
                params:String,
                url:String,
                urlRequest:URLRequest,
                urlLoader:URLLoader; 
            
			this._onUploading = true;
			
            bytes = this._file.slice(start, end);
            
            params = [
                'token=' + token, 
                'client=flash',
                'start=' + start,
                'end=' + end
            ].join('&');
                
            url = this.config.uploadUrl + '?' + params;
            
            urlRequest                = new URLRequest(url);
            urlRequest.method         = URLRequestMethod.POST;
            urlRequest.data           = bytes;
            urlRequest.contentType    = "application/octet-stream";
            
            urlLoader = this._getUploadLoader();
            
            urlLoader.load(urlRequest);
        }
        
        private function _chunkUploadCompelete(event:Event)
        {
            var responseText:String,
                data:Object,
                status:Number,
                range:Array,
                start:Number,
                end:Number,
                token:String;
                
            try {
                
                responseText = event.target.data;
                data   = JSON.parse(responseText);
                status = Number(data.status);
                range  = data.range.split('-');
                start  = Number(range[0]);
                end    = Number(range[1]);
                token  = data.token;
                
                this._emitEvent('progress', [start, this._file.size]);
                
                if (1 === status || 0 === status) {
                    this._uploadChunk(token, start, end);
                } else if (2 === status) {
                    this._uploadComplete(token);
                } else {
                    this.abort();
                    this._throwError('', 201);
                }
                
            } catch (e) {
                
                //throw e;
                this.abort();
                this._throwError(e.toString(), 201);
                
            } finally {
                
            }
            
        }
        
        /**
         * 令牌获取完成之后的操作 就是切割并且上传文件啦
         * 
         * @param event
         */
        private function _tokenCompleteHandler(event:Event):void
        {
            
            var responseText:String,
                data:Object,
                status:Number,
                range:Array,
                start:Number,
                end:Number,
                token:String;
                
            try {                
                
                responseText = event.target.data;
                data   = JSON.parse(responseText);
                status = Number(data.status);
                range  = data.range.split('-');
                start  = Number(range[0]);
                end    = Number(range[1]);
                token  = data.token;
                
                if (1 === status || 0 === status) {
                    this._uploadChunk(token, start, end);
                } else if (2 === status) {
                    this._uploadComplete(token);
                } else {
                    this.abort();
                    this._throwError('', 201);
                }
               
            } catch (e) {
                
                //throw e;
                this.abort();
                this._throwError(e.toString(), 201);
                
            } finally {
                
            }
        }
        
        private function _throwError(message:String, code:Number):void
        {
            this._emitEvent('error', [message, code]);
        }
        
        private function _getToken():void
        {
            var request:URLRequest     = new URLRequest(this.config.tokenUrl);
            var variables:URLVariables = new URLVariables();
            var loader:URLLoader       = new URLLoader();
            
            variables.name             = this._file.name;
            variables.size             = this._file.size;
            variables.time             = this._file.time;
            variables.antiCache        = (new Date()).getTime();
            variables.client           = 'flash';
            request.method             = URLRequestMethod.GET;
            request.data               = variables;

            loader.addEventListener(Event.COMPLETE, this._tokenCompleteHandler, false, 0, true);            
            loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this._securityErrorHandler, false, 0, true);
            loader.addEventListener(IOErrorEvent.IO_ERROR, this._IOErrorHandler, false, 0, true);
            
            //同时抛出一个进度条事件
            this._emitEvent('progress', [0, this._file.size]);
			this._onUploading = true;
            
            loader.load(request);
        }
        
        private function _getNewFile():File
        {
            var file = new File();
            file.addEventListener(Event.SELECT, this._fileSelectHandler);
            return file;
        }
        
        /**
         * 根元素点击事件处理
         *
         * @param event
         */
        private function _rootStageClickHandler(event:MouseEvent):void
        {
            this._getNewFile().browse();
        }
        
        /**
         * 分析外部给定的配置
         * 
         */
        private function _parseConfig():void
        {
            this._config = new Object();
            
            var paramObj:Object = this._root.stage.loaderInfo.parameters;
               
            this._config['flashProxyId'] = fetchKey(paramObj, 'flashProxyId');
            this._config['tokenUrl']     = fetchKey(paramObj, 'tokenUrl');                
            this._config['uploadUrl']    = fetchKey(paramObj, 'uploadUrl');                
            this._config['maxFileSize']  = Number(fetchKey(paramObj, 'maxFileSize'));                
            this._config['allowedExt']   = fetchKey(paramObj, 'allowedExt').toLowerCase().split('|');
            this._config['debug']        = fetchKey(paramObj, 'debug');
            
            info('QUpload.Config.Detail', JSON.stringify(this._config));
            
        }
        
        private function _IOErrorHandler(event:IOErrorEvent):void
        {
            QUpload.error('File.IOError', event.toString());
            this._emitEvent('error', [event.toString(), 201]);
        }
        
		/**
		 * 作废
		 */
        private function _progressHandler(event:ProgressEvent)
        {
            
            //QUpload.info('file.upload.progress', [(this._file.lastSliceStart + event.bytesLoaded) / 1048576, 'MB'].join(''));
            //this._emitEvent('progress', [this._file.lastSliceStart + event.bytesLoaded, this._file.size]);
        }
        
        private function _securityErrorHandler(event:SecurityErrorEvent)
        {
            QUpload.error('file.securityError', event.toString());
            this._emitEvent('error', [event.toString(), 201]);
        }
        
        /**
         * 获取指定的键值
         * 
         * @param obj
         * @param key
         * @return 如果有返回 指定的值 如果没有返回空字符串
         */
        public static function fetchKey(obj:Object, key:String):String
        {
            return typeof obj[key] !== "undefined" ? obj[key] : '';
        }
        
        /**
         * 显示友好的文件大小格式
         * 
         * @param Number byte
         * @return String
         */
        public static function printByte(byte:Number):String
        {
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
        
        /**
         * 记录日志信息
         * 
         * @param category
         * @param level
         * @param message
         */
        public static function log(level:Number, category:String, message:String):void
        {
            //正常模式中请使用
            return;
            
            var date:Date = new Date();
            
            var str:String = [
                'QUpload Flash Client ' + ['Info', 'Debug', 'Warning', 'Error'][level],
                'time: ' + date.toLocaleString(),
                'cateogry: ' + category,
                'message: ' + message
            ].join('\n');
            
            trace(str);
            
            ExternalInterface.call('console.log', str);
        }
        
        public static function info(category:String, message:String):void
        {
            log(0, category, message);
        }
        
        public static function debug(category:String, message:String):void
        {
            log(1, category, message);
        }
        
        public static function warn(category:String, message:String):void
        {
            log(2, category, message);
        }
        
        public static function error(category:String, message:String):void
        {
            log(3, category, message);
        }
        
    }
}