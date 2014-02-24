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
    var supportHtml5Upload = w.File && w.File.prototype.slice && w.XMLHttpRequest;

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

    if(typeof swfobject === 'undefined') {
/*  SWFObject v2.2 <http://code.google.com/p/swfobject/> 
    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){try{n.addRule(ac,Y)}catch(e){}}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();

    }

    var swfInject = function(swfPath, elemId, id, width, height, flashVars) {

        swfobject.embedSWF(swfPath, elemId, width, height, '11.2.0', null, flashVars, {
            allowscriptaccess: 'always',
            wmode: 'transparent'
        }, {
            id: id
        });

        // var flashVarsArr = [];

        // for(var i in flashVars) {
        //     flashVarsArr.push(escape(i) + '=' + escape(flashVars[i]));
        // }

        // var template = 
        //     '<object type="application/x-shockwave-flash" data="{$swfPath}" height="{$height}" width="{$width}" id="{$id}">' +
        //     '<param name="movie" value="{$swfPath}" />' +
        //     '<param name="flashvars" value="{$flashVars}" />' + 
        //     '<param name="swfversion" value="11.2.0" />' + 
        //     '<param name="allowScriptAccess" value="always"/>' + 
        //     '<param name="wmode" value="opaque"/>' +
        //     '<param name="allowNetworking" value="all"/>' + 
        //     '<param name="src" value="{$swfPath}"/>' + 
        //     '</object>';

        // var html = replaceTmpl(template, {
        //     'swfPath': swfPath,
        //     'width': width,
        //     'height': height,
        //     'flashVars': flashVarsArr.join('&'),
        //     'id': id
        // });
    
        // $('#' + elemId).replaceWith(html);

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
