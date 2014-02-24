package la.sou
{
    import flash.events.*;
    import flash.net.*;
    import flash.events.EventDispatcher;
    import flash.utils.ByteArray;

    import la.sou.QUpload;
    
	/**
	 * 文件加载类
     */	 
    public class File extends EventDispatcher
    {
        /**
         * 是否加载完成之后立即上传
         * 
         * @var Boolean
         */
        public var immediatelyUpload:Boolean = false;
        
        // 原始文件引用对象
        private var _fileReference:FileReference;
        
        // 文件是否在导入过程当中
        private var _fileOnLoading:Boolean = false;
        
        // 文件是否已经加载完成
        private var _fileLoaded:Boolean = false;
        
        // 文件已经加载到内存的大小
        private var _loadedSize:Number = 0;
        
        // 文件是否已经被选择
        private var _isSelected:Boolean = false;
        
        // 上次开始分割未知
        private var _lastSliceStart:Number = 0;
		
		// 是否已经退出
		private var _canceled:Boolean = false;
        
        public function get selected():Boolean
        {
            return this._isSelected;
        }
        
        public function get lastSliceStart():Number
        {
            return this._lastSliceStart;
        }
        
        /**
         * 文件名称
         * 
         * @return String
         */
        public function get name():String
        {
            return String(this._fileReference.name);
        }
        
        /**
         * 获取文件大小
         * 
         * @return Number
         */
        public function get size():Number
        {
            return Number(this._fileReference.size);
        }
        
        /**
         * 获取文件修改时间
         * 
         * @return Number
         */
        public function get time():Number
        {
            return Number(Math.ceil(this._fileReference.modificationDate.getTime() / 1000));
        }
        
        /**
         * 获取文件是否已经加载
         * 
         * @return Boolean
         */
        public function get loaded():Boolean
        {
            return this._fileLoaded;
        }
        
        /**
         * 获取文件加载的大小
         * 
         * @return Number
         */
        public function get loadedSize():Number
        {
            return this._loadedSize;
        }
        
        /**
         * 构造函数
         * 
         * @return void
         */
        public function File():void
        {
            this._fileReference = new FileReference();
            this._bindEvent(this._fileReference);
        }
        
        /**
         * 浏览文件
         * 
         * @return void
         */
        public function browse():void
        {
			QUpload.info('file.browse', '文件浏览开始.');
            this._fileReference.browse();
			
			
        }
        
        /**
         * 切割文件
         * 
         * @param start 开始位置
         * @param end 结束位置
         * @return ByteArray 二进制数组
         */
        public function slice(start:Number, end:Number):ByteArray
        {            
            var bytes:ByteArray = new ByteArray;
            this._lastSliceStart = start;
            this._fileReference.data.position = start;
            this._fileReference.data.readBytes(bytes, 0, end - start);
            return bytes;
        }
        
        /**
         * 开始加载文件
         * 
         * @return void
         */
        public function load():void
        {
            this._fileReference.load();
        }
        
        /**
         * 退出上传
         * 
         * @return void
         */
        public function cancel():void
        {
			this._canceled = true;
            try {
                this._fileReference.cancel();
            } catch (e) { }

        }
        
        /**
         * 选择完成之后的操作
         * 
         * @param Event event
         * @return void
         */
        private function _selectHandler(event:Event):void
        {			
            if (this._canceled) return ;
            
            this._isSelected = true;
            QUpload.info('file.select', this.name + ' 已经被选中.');
            
            //如果已经退出 那么不抛出事件            
            this.dispatchEvent(event);
        }

        /**
         * 加载完成之后的操作
         * 
         * @param Event event
         * @return void
         */
        private function _completeHandler(event:Event)
        {
            if (this._canceled) return ;
            QUpload.info('file.load', this.name + ' 已经加载完成.');
            
            this._loadedSize = this.size;
            this._fileLoaded = true;            
            this.dispatchEvent(event);
        }
        
        /**
         * 进度捕捉
         * 
         * @param ProgressEvent event
         * @return void
         */
        private function _progressHandler(event:ProgressEvent):void
        {
            if (this._canceled) return ;
            
            QUpload.info('file.progress', [QUpload.printByte(event.bytesLoaded), '/', QUpload.printByte(event.target.size)].join(' '));
            
            this._loadedSize = event.bytesLoaded;
            this.dispatchEvent(event);
        }
        
        /**
         * 退出事件
         * 
         * @param Event event
         * @return void
         */
        private function _cancelHandler(event:Event):void
        {
            this.dispatchEvent(event);
        }
        
        /**
         * 安全错误捕捉
         * 
         * @param SecurityErrorEvent event
         * @return void
         */
        private function _securityErrorHandler(event:SecurityErrorEvent):void
        {
            if (this._canceled) return ;
            
            this.dispatchEvent(event);
        }
        
        /**
         * IO错误捕捉
         * 
         * @param IOErrorEvent event
         * @return void
         */
        private function _IOErrorHandler(event:IOErrorEvent):void
        {
            if (this._canceled) return ;
            
            this.dispatchEvent(event);
        }
        
        /**
         * 绑定事件
         * 
         * @param IEventDispatcher dispatcher
         * @return void
         */
        private function _bindEvent(dispatcher:IEventDispatcher):void
        {
			QUpload.info('file.bindEvent', '绑定事件开始.');
			
			//添加选择完成的事件
            this._fileReference.addEventListener(Event.SELECT, this._selectHandler, false, 0, false);
			
            //添加文件加载完成的事件
            dispatcher.addEventListener(Event.COMPLETE, this._completeHandler, false, 0, true);
            
            //添加取消事件监听
            dispatcher.addEventListener(Event.CANCEL, this._cancelHandler, false, 0, true);
            //添加IO错误的处理
            dispatcher.addEventListener(IOErrorEvent.IO_ERROR, this._IOErrorHandler, false, 0, true);
            //添加文件导入进度的处理
            dispatcher.addEventListener(ProgressEvent.PROGRESS, this._progressHandler, false, 0, true);
            //添加安全错误的处理
            dispatcher.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this._securityErrorHandler, false, 0, true);
			
			QUpload.info('file.bindEvent', '绑定事件结束.');
        }        

    }
}