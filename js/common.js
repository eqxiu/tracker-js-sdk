/*
 * Copyright © 2018 eqxiu.com. All rights reserved 北京中网易企秀科技有限公司
 *
 * author: Wang Junbo
 * date: 2018/12/29
 * description:
 */

window.bigdataLogs = [];
window.log = {};
//页面开始时间,单位为秒
window.log.page_start_time = new Date().getTime();
window.log.page_url = window.location.href;

var canvasId = getCookie("canvasId");
if(canvasId){
}else{
    setTimeout(function () {
        if(navigator.cookieEnabled) {
            setCookie("canvasId", uuidx(), 315360000000);
        }
    }, 2000)
}

//格式化日期
Date.prototype.format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds()             //毫秒
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
            if(k == "y+"){
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if(k=="S+"){
                var lens = RegExp.$1.length;
                lens = lens==1?3:lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
            }
            else{
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
}

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+ c;
        hash = hash & hash; // Convert to 32bit integer
    }
    hash = Math.abs(hash)
    return hash;
}

function doSupportNaviType() {
    if(performance && performance.navigation && performance.navigation.type != undefined ){
        return true
    }else{
        return false
    }
}

// 判断浏览器是否是chrome
function isChrome() {
    return window.navigator.userAgent.indexOf("Chrome") !== -1;
}

//unit is millisecond
function setCookie(name, value, time) {
    var domain = document.domain.split('.').slice(-2).join('.');
    if (isChrome()) {
        var exp = new Date();
        exp.setTime(exp.getTime() + time);
        document.cookie = name + "=" + encodeURIComponent(value) + ";domain=" + domain + ";path=/;expires=" + exp.toUTCString();
    } else {
        document.cookie = name + "=" + encodeURIComponent(value) + ";domain=" + domain + ";path=/;";
    }
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    } else {
        return null;
    }
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function uuidx() {
    var idx = uuid();
    return new Date().format("yyyyMMdd") + idx.substr(0,8);
}

function uuidl() {
    var idx = uuid();
    return new Date().format("yyyyMMdd") + idx.substr(0,8);
}

function uuidForShare() {
    var idx = uuid();
    return idx.substr(0,10);
}

function getSessionIdV2(){ // 只在本页面内有效, 因为场景都是在同一个页面内的

    var session_id = window.getCookie("log_session_id");

    if(session_id && session_id !='' ){
        return session_id;
    }else{
        var session_id = "v3x"+uuidx();
        setCookie("log_session_id", session_id, 2 * 60 * 1000); // 5分钟
        return session_id;
    }
}

function getCanvasId(){
    var d_i = getCookie("_tracker_distinct_id_");
    var canvasId = getCookie("canvasId");
    if(canvasId){
        return canvasId;
    }else if(window.canvasId){
        return window.canvasId;
    }else if(d_i && d_i != 'null'){
        return d_i;
    }else{
        canvasId = uuidx();
        if(navigator.cookieEnabled){
            setCookie("canvasId",canvasId,315360000000)
        }else{
            canvasId = "cookieDisabled"+canvasId.substring(0,19)
        }
        window.canvasId = canvasId;
    }
    return canvasId;
}

function getArgFromStr(str_line,name){
    // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg = new RegExp("(^|&|[?])" + name + "=([^&#]*)(#|&|$)", "i");
    var r = str_line.match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

function getTerminal(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //alert(navigator.userAgent);
        return 'iOS';
    } else if (/(Android)/i.test(navigator.userAgent)) {
        //alert(navigator.userAgent);
       return 'Android';
    } else if( navigator.platform.indexOf("Win") == 0 || navigator.platform.indexOf("Mac") == 0  ){
        return 'PC';
    }else {
        return 'unknown';
    }
}

function getPlatform(){
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        //alert(navigator.userAgent);
        return 'wap';
    } else if( navigator.platform.indexOf("Win") == 0 || navigator.platform.indexOf("Mac") == 0  ){
        return 'PC';
    }else {
        return 'unknown';
    }
}

function getTrackID(element){

    try{
        return element.getAttribute("tracking_id");
    }catch(err){
        return null;
    }
}

function sendBigdataLogs()
{
    if (navigator.sendBeacon) {
        var tmpLogs = window.bigdataLogs.splice(-20);

        if(tmpLogs.length > 0){

            var logsMap = {};

            tmpLogs.forEach(function(obj) {
                if(obj){
                    var u = obj["url"];
                    var log0 = logsMap[u];
                    if(log0){
                        log0.push(obj["log"]);
                    }else{
                        log0 = [];
                        log0.push(obj["log"]);
                        logsMap[u] = log0;
                    }
                }
            });

            for(var url in logsMap){
                var logLine = JSON.stringify(logsMap[url]);
                navigator.sendBeacon(url,logLine);
            }
        }
    }
    setTimeout("sendBigdataLogs()",2000);
}

function checkShouldSendPageView()
{
    if (window.log && window.log.page_url && window.log.page_url != window.location.href) {
        window.log.page_url = window.location.href;
        if(window._tracker_api_){
            window._tracker_api_.pageView();
        }
    }
    setTimeout("checkShouldSendPageView()",2000);
}

function beginObserve(arg,callback){
    var arr = document.querySelectorAll(arg);
    var observer = new IntersectionObserver(
        function(objs){
            for(i = 0; i < objs.length ; i++ ){
                const entry1 = objs[i];
                try {
                    if(entry1.target){
                        var element1 = entry1.target
                        const attr1 = element1.getAttribute("bigdata_view");
                        if(attr1 && attr1 != "2"){
                            element1.setAttribute("bigdata_view", "2");
                            callback(element1);
                        }
                    }
                }
                catch(err) {
                    console.log(err)
                }
            }
        }, { threshold: 0.95 } );

    for (i = 0; i < arr.length; i++) {
        const entry = arr[i];
        const attr = entry.getAttribute("bigdata_view");
        if(attr == null || attr == '0'){
            observer.observe(entry);
            entry.setAttribute("bigdata_view", "1");
        }
    }
    setTimeout(function() {
        beginObserve(arg, callback)
    },2000);
}



function getUserIdFromLocalStorage() {
    var userId = null;
    try{
        var userInfo = window.localStorage.getItem("eqxiu_user");
        if (userInfo) {
            if (typeof(userInfo) == "string") {
                var user = JSON.parse(userInfo);
                if(user && user.id){
                    userId = user.id ;
                }
            }
        }
    }catch (e) {
        console.log("bigdata: error when get user info 1.");
    }

    return userId;
}

// 将用户信息设置到cookie
function setUserIdToCookie(userId) {
    setCookie("_tracker_user_id_", userId, 100 * 365 * 24 * 60 * 60 * 1000);
}

//////页面参数初始化开始

try{
    // 设置客户端ID：
    var _tracker_distinct_id_ = getCookie("_tracker_distinct_id_");
    if (_tracker_distinct_id_ == null) {
        _tracker_distinct_id_ = uuidl();
        window._tracker_distinct_id_ = _tracker_distinct_id_;
        setCookie("_tracker_distinct_id_", _tracker_distinct_id_, 100 * 365 * 24 * 60 * 60 * 1000); // 100年
    }

    // 设置session_id
    var _tracker_session_id_ = getCookie("JSESSIONID") || getCookie("_tracker_session_id_") || uuid();
    setCookie("_tracker_session_id_", _tracker_session_id_, 24 * 60 * 60 * 1000); // 1天

    // 设置_tracker_user_id_
    var _tracker_user_id_ = getCookie("_tracker_user_id_");
    var userId = getUserIdFromLocalStorage();

    if( _tracker_user_id_ == null || _tracker_user_id_.length < 8 ){
        if( userId != null){
            _tracker_user_id_ = userId;
            setUserIdToCookie(_tracker_user_id_);
        }
    }else if( userId != null && userId.length > 8 && _tracker_user_id_ !=  userId ){
        setUserIdToCookie(userId);
    }
}catch(err){
    console.log(err)
}

//////页面参数初始化结束






