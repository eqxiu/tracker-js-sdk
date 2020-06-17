/*
 * Copyright © 2020 eqxiu.com. All rights reserved 北京中网易企秀科技有限公司
 *
 * author: Peace
 * date: 2020-04-29
 * description:
 */


(function (root) {
    'use strict';

    //扩展帮助方法
    var helper = {};

    // 生成唯一标示 uuid
    helper.uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // 获取cookie值
    helper.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    };

    // 设置cookie值
    helper.setCookie = function (name, value, time) {
        var domain = document.domain.split('.').slice(-2).join('.')
        if (time) {
            var exp = new Date();
            exp.setTime(exp.getTime() + time);
            document.cookie = name + "=" + encodeURIComponent(value) + ";domain=" + domain + ";path=/;expires=" + exp.toUTCString();
        } else {
            document.cookie = name + "=" + encodeURIComponent(value) + ";domain=" + domain + ";path=/;";
        }
    };

    // 从url中获取参数值：
    helper.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    };

    // 往url中添加参数值：
    helper.addQueryString = function (e, n, t) {
        if (t == undefined || t == null) {
            t = ""
        }
        if (e.indexOf("?") != -1 || e.indexOf("=") != -1) {
            return e + "&" + n + "=" + t
        } else {
            return e + "?" + n + "=" + t
        }
    };

    /**
     * @method each
     * @parame loopable 要遍历的对象
     * @parame callback 回调函数
     * @parame self 上下文
     **/
    helper.each = function (loopable, callback, self) {
        var additionalArgs = Array.prototype.slice.call(arguments, 3);
        if (loopable) {
            if (loopable.length === +loopable.length) {
                for (var i = 0; i < loopable.length; i++) {
                    callback.apply(self, [loopable[i], i].concat(additionalArgs));
                }
            } else {
                for (var item in loopable) {
                    callback.apply(self, [loopable[item], item].concat(additionalArgs));
                }
            }
        }
    };

    /**
     *@method extend
     *@parame base 要扩展的对象
     *@return base  返回扩展后的对象
     **/
    helper.extend = function (base) {
        helper.each(Array.prototype.slice.call(arguments, 1), function (extensionObject) {
            helper.each(extensionObject, function (value, key) {
                if (extensionObject.hasOwnProperty(key)) {
                    base[key] = value;
                }
            });
        });
        return base;
    };

    /**
     *@method indexOf
     *@parame arrayToSearch 查找的对象
     *@parame item 查找的元素
     *@return args  返回位置
     **/
    helper.indexOf = function (arrayToSearch, item) {
        if (Array.prototype.indexOf) {
            return arrayToSearch.indexOf(item);
        } else {
            for (var i = 0; i < arrayToSearch.length; i++) {
                if (arrayToSearch[i] === item) return i;
            }
            return -1;
        }
    };

    // 请求，保存数据
    helper.send = function (server, obj) {
        var protocol = window.location.protocol;
        obj.c_t = new Date().getTime();

        // 精简参数：
        obj.u_a = '';

        if(obj.rdt && obj.rdt == "1" ){
            var img = new Image(0, 0);
            img.src = protocol + server + "?" + helper.objectToQuery(obj);
        }else if(navigator.sendBeacon){
            window.bigdataLogs.push({"url":protocol + server,"log":obj});
        }else{
            var img = new Image(0, 0);
            img.src = protocol + server + "?" + helper.objectToQuery(obj);
        }
    };

    // JSON转为查询字符串
    helper.objectToQuery = function (jsonObj) {
        var args = '';
        for (var i in jsonObj) {
            if (args != '') {
                args += '&';
            }
            args += i + '=' + encodeURIComponent(jsonObj[i]);
        }
        return args;
    };

    // 获取元素的xpath
    helper.getXPath = function (element) {
        // if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        //     return '//*[@id=\"' + element.id + '\"]';
        // }
        //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
        if (element == document.body) {//递归到body处，结束递归
            return '/html/' + element.tagName.toLowerCase();
        }

        if (!element.parentNode) {
            return '';
        }

        var ix = 1,//在nodelist中的位置，且每次点击初始化
            siblings = element.parentNode.childNodes;//同级的子元素

        for (var i = 0, l = siblings.length; i < l; i++) {
            var sibling = siblings[i];
            //如果这个元素是siblings数组中的元素，则执行递归操作
            if (sibling == element) {
                return helper.getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
                //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
            } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
                ix++;
            }
        }
    };

    const removeKeyArr=['product','unm','b_t','b_v','client_type','client_edition']

    // 获取元素的埋点数据
    helper.getData = function (element) {

        var data = {}

        if(window._tracker_){
            for(i in window._tracker_){
                // console.log(i);
                // console.log(window._tracker_[i]);
                const k = window._tracker_[i][0];
                const v = window._tracker_[i][1];
                // console.log(k);
                // console.log(v);
                if(removeKeyArr.indexOf(k) == -1 ){
                    // console.log(k.length + "  length");
                    const klen = k.length;
                    if(klen > 2 && klen < 25){
                        data[k] = v;
                    }
                }
                // console.log(data);
            }
        }

        if (element) {
            var tdata = element.getAttribute("_tracker_data_");
            // console.log(data);
            if (tdata) {
                try {
                    tdata = eval("(" + tdata + ")");

                    for(var te in tdata){
                        data[te] = tdata[te];
                    }


                } catch (e) {
                    // nothing to do
                }
            }

            if (!data.text) {
                try {
                    data.text = element.childNodes[0].nodeValue.trim();
                } catch (e) {
                    data.text = element.innerText.split('\n')[0].trim();
                }
                if(data.text){
                    if(data.text.length > 20){
                        data.text = "";
                    }
                }
            }
        }

        // data拼成字符串
        var args = '';
        for (var i in data) {
            if (args != '') {
                args += '&';
            }
            args += i + '=' + data[i];
        }
        return args;
    };

    // 绑定事件
    helper.on = function (target, type, handler) {
        if (target.addEventListener) {
            target.addEventListener(type, handler, false);
        } else {
            target.attachEvent("on" + type,
                function (event) {
                    return handler.call(target, setEvent);
                }, false);
        }
    };

    // 页面加载事件：
    helper.onload = function (callback) {
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('load', callback, false);
        } else if (typeof document.addEventListener != 'undefined') {
            document.addEventListener('load', callback, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onload', callback);
        } else {
            var _callback = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = callback;
            } else {
                window.onload = function () {
                    _callback();
                    callback();
                };
            }
        }
    };

    // 页面卸载事件：
    helper.onunload = function (callback) {
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('beforeunload', callback, false);
        } else if (typeof document.addEventListener != 'undefined') {
            document.addEventListener('beforeunload', callback, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onbeforeunload', callback);
        } else {
            var _callback = window.onbeforeunload;
            if (typeof window.onbeforeunload != 'function') {
                window.onbeforeunload = callback;
            } else {
                window.onbeforeunload = function () {
                    _callback();
                    callback();
                };
            }
        }
    };

    // 获取网络类型：
    helper.getNetType = function () {
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {type: 'unknown'};
        var type = connection.type || connection.effectiveType || 'unknown';
        return type;
    };

    // 获取社交网络类型：
    helper.getSocialNetworkingSite = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return 'weixin';
        }
        if (ua.match(/Weibo/i) == "weibo") {
            return 'weibo';
        }
        // QQ/7.2.0.3270
        if (ua.match(/QQ\//i) == "qq/") {
            return 'qq';
        }
        // Qzone/V1_AND_QZ_7.4.3_288_CZ_A
        if (ua.match(/qzone\//i) == 'qzone/') {
            return 'qzone';
        }
        // tieba/8.8.8.6
        if (ua.match(/tieba\//i) == 'tieba/') {
            return 'tieba';
        }
        // momoWebView/8.2
        if (ua.match(/momoWebView\//i) == 'momoWebView/') {
            return 'momo';
        }
        // com.douban.frodo/5.7.0(110) DoubanApp
        if (ua.match(/douban/i) == 'douban') {
            return 'douban';
        }
        // com.zhihu.android/Futureve/5.2.3
        if (ua.match(/zhihu/i) == 'zhihu') {
            return 'zhihu';
        }
        return 'unknown'
    };

    // 获取全局变量值
    helper.getTrackerData = function (key) {
        var tracker = window._tracker_ || []
        for (var i = 0; i < tracker.length; i++) {
            var row = tracker[i];
            if (row && row.length && row.length >= 2) {
                if (key == row[0]) {
                    return row[1];
                }
            }
        }
        return null;
    };

    // 获取session_id
    helper.getSessionId = function () {
        return helper.getTrackerData('session_id') || helper.getCookie('_tracker_session_id_');
    };

    // 获取user_id
    helper.getUserId = function () {
        return helper.getTrackerData('user_id') || helper.getCookie('_tracker_user_id_');
    };

    // 获取client_type
    helper.getClientType = function () {
        // return helper.getTrackerData('c_p') || helper.getTrackerData('client_type') || '';
        return getTerminal() || '';
    };

    // 获取client_edition
    helper.getClientEdition = function () {
        return helper.getTrackerData('b_v') || helper.getTrackerData('client_edition') || '';
    };

    helper.getField = function (fieldName) {
        return helper.getTrackerData(fieldName)  || '';
    };

    // 获取微信用户信息
    helper.getWxUserInfo = function () {
        return helper.getTrackerData('wx_user_info') || {};
    };


    /*---------------------------------------------------*/

    var collect = {
        server: '${log.server}',
        sdk: 'tracker.js',
        ver: '5.4'
    };

    // 收集参数
    collect.params = function () {
        var p = {};

        p.sdk = collect.sdk;
        p.ver = collect.ver;

        p.d_i = helper.getCookie("_tracker_distinct_id_") || window._tracker_distinct_id_ ;

        if (document) {
            // p.dom = document.domain || '';
            p.url = document.URL || '';
            p.tit = document.title || '';
            p.ref = document.referrer || '';
        }

        if (navigator) {
            // p.lan = navigator.language || '';
            p.u_a = navigator.userAgent || '';
        }

        // device
        var device = tracker_ua_device(p.u_a);
        if (device && device.browser) {
            // browser name
            p.bro = device.browser.name || '';
        }
        if (device && device.os) {
            // os name
            p.os = device.os.name || '';
            if (device.os.version)
                p.o_v = device.os.version.original || '';
        }
        if (device && device.engine) {
            // engine name
            p.eng = device.engine.name || '';
        }
        if (device && device.device) {
            // manufacturer
            p.man = device.device.manufacturer || '';
            // model
            p.mod = device.device.model || '';
        }

        // 社交平台：
        p.sns = helper.getSocialNetworkingSite();

        // n_t : net_type
        p.n_t = helper.getNetType();

        // s_id : session_id
        p.s_i = helper.getSessionId();

        //c_i : cavous_id
        p.c_i = getCanvasId();

        // u_i : user_id
        p.u_i = helper.getUserId();

        // c_p : client_type
        p.c_p = helper.getClientType();

        // p_l : platform 只有如下取值PC, App, Applet, wap
        p.p_l = getPlatform() || '';

        // b_v : bussness_data_version
        p.b_v = helper.getClientEdition();

        // c_e : client_edition
        p.c_e = helper.getClientEdition();

        // b_t : business_type
        p.b_t = helper.getField("b_t");

        // product : product
        p.product = helper.getField("product");

        //追踪标记
        p.tk_id = window.tracking_id || '';

        p.scene_id = window.scene && window.scene.id || ''; // scene_id
        p.scene_c_u = window.scene && window.scene.userId || ''; // scene_c_u
        p.scene_code = window.scene && window.scene.code || ''; // scene_code
        p.scene_bizType = window.scene && window.scene.bizType || '';//biz_type

        if(window.log && window.log.page_start_time){
            var dur = new Date().getTime() - window.log.page_start_time ;
            p.dur = dur ;
        }else{
            p.dur = 1 ;
        }

        p.e_d = helper.getData(null);

        return p;
    };

    // 元素添加点击事件监听
    collect.addElementClickListener = function () {
        var that = this;

        // 用原生js实现事件绑定：定时扫描页面元素
        window.setInterval(function () {
            var nodeList = document.querySelectorAll("div, span, i, a, img, button, li, input[type='button'], input[type='submit'], input[type='reset'], *[ng-click]");
            helper.each(nodeList, function (element, index) {

                // 如果是div，判断div的id是否有btn、button字符串，如果没有则不监听
                if (element && (element.tagName.toLowerCase() == 'div' || element.tagName.toLowerCase() == 'span' || element.tagName.toLowerCase() == 'i') && !element.getAttribute('ng-click')) {
                    var id = element.getAttribute('id') || '';
                    var clz = element.getAttribute('class') || '';
                    if (id.indexOf('btn') < 0 && id.indexOf('button') < 0 && clz.indexOf('btn') < 0 )
                        return;
                }

                if (!element.getAttribute('_tracker_click_')) {
                    helper.on(element, 'click', function (event) {

                        var params = that.params();

                        params.e_t = 'element_click';
                        params.e_p = helper.getXPath(element);
                        params.e_d = helper.getData(element);

                        var cat = element.getAttribute("cat");
                        var act = element.getAttribute("act");

                        if(cat && act){
                            params = helper.extend(params, {"cat":cat,"act":act ,"rdt":"3"} );
                        }

                        //获取搜索或推荐的批次id
                        var tracking_id_value = getTrackID(element);
                        if(tracking_id_value && tracking_id_value.length > 1 ){
                            //开始追踪
                            helper.setCookie("tracking"+window.location.href.hashCode(),tracking_id_value,300000);
                            window.tracking_id = tracking_id_value;
                            params = helper.extend(params, {"tk_id":tracking_id_value,"rdt":"2"});
                        }else if(window.tracking_id){ //从window里获取追踪标记
                            helper.setCookie("tracking"+window.location.href.hashCode(),window.tracking_id ,300000);
                        }

                        var rdtValue = element.getAttribute("rdt");
                        if( rdtValue == 3 ) {
                            params = helper.extend(params, {"rdt":"3"} );
                        }

                        helper.send(that.server, params);
                        return false;
                    });
                    element.setAttribute('_tracker_click_', '_tracker_click_');
                }
            });
        }, 1000);
        // }

    };


    // 启动事件：
    collect.launch = function () {
        var that = this;

        var params = that.params();
        params.e_t = 'launch';
        params.rdt = "3";

        helper.send(that.server, params);
    };

    // page view
    collect.pageView = function (customParams) {
        var that = this;

        var params = that.params();
        params.e_t = 'page_view';
        params.cat = 'page_view';
        params.rdt = '3';
        params.act = helper.getField("unm");

        if (customParams) {
            params = helper.extend(params, customParams);
        }
        helper.send(that.server, params);
    };

    // page leave
    collect.pageLeave = function () {
        var that = this;

        var params = that.params();
        params.e_t = 'page_leave';

        if(window.log && window.log.page_start_time){
            params.dur = new Date().getTime() - window.log.page_start_time;
        }

        helper.send(that.server, params);
        delete this;
    };

    // element view
    collect.elementView = function (element,b_t) {
        var that = this;

        var params = that.params();

        params.e_t = 'element_view';
        params.e_p = helper.getXPath(element);
        params.e_d = helper.getData(element);
        var cat = element.getAttribute("cat");
        var act = element.getAttribute("act");

        if(cat && act){
            //nothing to do
        }else{
            cat = "";
            act = "";
        }
        params = helper.extend(params, {"cat":cat,"act":act } );

        const tracking_id_value = getTrackID(element);
        params = helper.extend(params, {"tk_id":tracking_id_value});
        params = helper.extend(params, {"rdt":"3"} );
        if(b_t){
            //nothing to do
        }else{
            b_t = "";
        }
        params=helper.extend(params,{"b_t":b_t});
        helper.send(that.server,params);
    };

    // element click
    collect.elementClick = function (element) {
        var that = this;

        var params = that.params();

        params.e_t = 'element_click';
        params.e_p = helper.getXPath(element);
        params.e_d = helper.getData(element);
        helper.send(that.server, params);
    };


    // 主动上报日志 version 2
    collect.report = function (customParams) {
        var that = this;
        that.time = new Date().getTime();

        var params = that.params();
        params.rdt = "1"; //表示调用report接口主动上报
        if(customParams){
            params = helper.extend(params, customParams);
        }

        if(params.e_t && params.product && params.b_t ){
            helper.send(that.server,params);
        }else{
            console.log("Argument e_t or product or b_t has not set.");
        }
    };

    // 设置客户端launch标识：
    var _tracker_launch_ = helper.getCookie("_tracker_launch_");
    if (_tracker_launch_ == null) {
        collect.launch();
        _tracker_launch_ = "1";
        // 如果是chrome，则设置cookie过期时间为1天；其他浏览器设置cookie过期时间为session；
        // 因为chrome对于session级别的cookie不自动清除
        setCookie("_tracker_launch_", _tracker_launch_, 24 * 60 * 60 * 1000); // 1天
    }

    // 初始化数据，并触发page_view事件：延迟1.5秒发送
    setTimeout(function () {
        //上报页面page_view事件
        collect.pageView();
    }, 1500);

    // 页面加载完成后
    helper.onload(function () {

        // 初始化点击事件：
        collect.addElementClickListener();

        // 给元素添加曝光监听
        beginObserve('[tracking_id|="search"],[tracking_id|="re"]',function (element) {
            collect.elementView(element,"search_rec");
        });

    });

    // 页面跳出时，发送pageLeave事件
    helper.onunload(function () {
        collect.pageLeave();
        sendBigdataLogs();
    });

    // 暴漏全局对象：
    window._tracker_api_ = collect;

})(window);

//链路追踪，每个页面打开的时候就设置追踪标记
var trackingCookieKey = "tracking"+document.referrer.hashCode();
var tracking_id_value1 = getCookie(trackingCookieKey);

if(tracking_id_value1){
    if(self == top) {
        setCookie(trackingCookieKey, "0", 1000);//after 1s , will clear this cookie
    }
    window.tracking_id = tracking_id_value1;
}


sendBigdataLogs();
checkShouldSendPageView();



