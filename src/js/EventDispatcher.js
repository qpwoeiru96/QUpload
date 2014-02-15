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
