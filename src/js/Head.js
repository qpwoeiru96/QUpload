/**
 * QUpload v0.1.2
 * 
 * @author qpwoeiru96 <qpwoeiru96@gmail.com>
 * @version  0.1.2 stable
 * @link  http://sou.la/blog
 */
(function($, w, undefined) {
    /**
     * 是否支持HTML5上传的判断
     * @type {boolean}
     */
    var supportHtml5Upload = w.File && w.File.prototype.slice && w.XMLHttpRequest;
    var isIE = !!w.ActiveXObject;

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
            (isIE ? 
                '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="{$height}" width="{$width}" name="{$id}" id="{$id}">' :
                '<object type="application/x-shockwave-flash" data="{$swfPath}" height="{$height}" width="{$width}" name="{$id}" id="{$id}">') +
            '<param name="Movie" value="{$swfPath}" />' +
            '<param name="FlashVars" value="{$flashVars}" />' + 
            '<param name="Swfversion" value="11.2.0" />' + 
            '<param name="AllowScriptAccess" value="always"/>' + 
            '<param name="Wmode" value="direct"/>' +
            '<param name="Loop" value="false"/>' +
            //'<param name="BgColor" value="$ffffff"/>' +
            '<param name="AllowNetworking" value="all"/>' + 
            '<param name="Src" value="{$swfPath}"/>' + 
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
