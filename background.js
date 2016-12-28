var WillowRoute = [];
var typeMap = {
    "txt"   : "text/plain",
    "html"  : "text/html",
    "css"   : "text/css",
    "js"    : "text/javascript",
    "json"  : "text/json",
    "xml"   : "text/xml",
    "jpg"   : "image/jpeg",
    "gif"   : "image/gif",
    "png"   : "image/png",
    "webp"  : "image/webp"
}

function getLocalStorage() {
    WillowRoute = window.localStorage.WillowRoute ? JSON.parse(window.localStorage.WillowRoute) : WillowRoute;
}

function getLocalFileUrl(url) {
    var arr = url.split('.');
    var type = arr[arr.length-1];
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, false);
    xhr.send(null);
    var content = xhr.responseText || xhr.responseXML;
    if (!content) {
        return false;
    }
    content = encodeURIComponent(
        type === 'js' ?
        content.replace(/[\u0080-\uffff]/g, function($0) {
            var str = $0.charCodeAt(0).toString(16);
            return "\\u" + '00000'.substr(0, 4 - str.length) + str;
        }) : content
    );
    return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content);
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
        var url = details.url;
        for (var i = 0, len = WillowRoute.length; i < len; i++) {
            var reg = new RegExp(WillowRoute[i].req, 'gi');
            if (WillowRoute[i].checked && WillowRoute[i].res && reg.test(url)) {
                if (!/^file:\/\//.test(WillowRoute[i].res)) {
                    return {redirectUrl: url.replace(reg, WillowRoute[i].res)};
                } else {
                    return {redirectUrl: getLocalFileUrl(url.replace(reg, WillowRoute[i].res))};
                }
            }
        }
        return true;
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

getLocalStorage();
window.addEventListener('storage', getLocalStorage, false);

