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
