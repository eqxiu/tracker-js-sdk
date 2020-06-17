/*
 * Copyright © 2017 eqxiu.com. All rights reserved 北京中网易企秀科技有限公司
 *
 * author: Sun Xiaopeng 孙小朋
 * date: 2017/8/1
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
            return unescape(arr[2]);
        } else {
            return null;
        }
    };

    // 设置cookie值
    helper.setCookie = function (name, value, time) {
        var domain = document.domain;
        if (domain.endsWith('.com.cn')) {
            domain = domain.split('.').slice(-3).join('.')
        }else {
            domain = domain.split('.').slice(-2).join('.')
        }
        if (time) {
            var exp = new Date();
            exp.setTime(exp.getTime() + time);
            document.cookie = name + "=" + escape(value) + ";domain=" + domain + ";path=/;expires=" + exp.toUTCString();
        } else {
            document.cookie = name + "=" + escape(value) + ";domain=" + domain + ";path=/;";
        }
    };

    // 从url中获取参数值：
    helper.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
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

        delete obj.u_a; //删除u_a字段，在后端LogServer中也会把u_a删除掉

        var img = new Image(0, 0);
        img.src = protocol + server + "?" + helper.objectToQuery(obj);
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


    helper.objectToPlainQuery = function (jsonObj) {
        var args = '';
        for (var i in jsonObj) {
            if (args != '') {
                args += '&';
            }

            var value = jsonObj[i].toString().replace(/\s+/g, ",");
            if(value.length > 0 && value.endsWith(",")){
                value = value.substring(0,value.length - 1);
            }
            args += i + '=' + value;
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

    // 获取元素的埋点数据
    helper.getData = function (element) {
        if (element) {
            var data = element.getAttribute("_tracker_data_");
            try {
                // console.log(data);
                if (data) {
                    data = eval("(" + data + ")");
                    data = helper.objectToQuery(data);
                }

                if( data != "object")
                {
                    data = {};
                }

                if(data.text == undefined){
                    const text = element.innerText;
                    data.text = text;
                }

                const bg_image_url = element.style.backgroundImage.replace('url(','').replace(')','').replace(/"|'/g,'');
                if(bg_image_url){
                    data.bg_image_url = bg_image_url;
                }else{
                    data.bg_image_url = "unknown";
                }
                data = helper.objectToPlainQuery(data);

                return data;

            } catch (e) {
                return data;
            }
        }
        return "";
    };

    // 判断浏览器是否是微信
    helper.isWeixin = function () {
        return /micromessenger/i.test(navigator.userAgent);
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
        // 微信平台需要用unload:
        if (helper.isWeixin()) {
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('unload', callback, false);
            } else if (typeof document.addEventListener != 'undefined') {
                document.addEventListener('unload', callback, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onunload', callback);
            } else {
                var _callback = window.onunload;
                if (typeof window.onunload != 'function') {
                    window.onunload = callback;
                } else {
                    window.onunload = function () {
                        _callback();
                        callback();
                    };
                }
            }
        } else {
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
        }
    };

    // 获取网络类型：
    helper.getNetType = function () {

        // Mozilla/5.0 (Linux; Android 4.4.4; vivo Y23L Build/KTU84P; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043622 Safari/537.36 MicroMessenger/6.5.22.1160 NetType/WIFI Language/zh_CN
        var type = null;
        var ua = window.navigator.userAgent;
        if (/NetType/.test(ua)) {
            var types = ua.match(/NetType\/(\S*)/);
            if (types.length >= 1)
                type = types[1];
        }

        if (type == null) {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {type: 'unknown'};
            type = connection.type || connection.effectiveType || 'unknown';
        }

        return type.toLowerCase();
    };

    // 获取社交网络类型：
    helper.getSocialNetworkingSite = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            // 微信平台下细分出：单消息、群消息、朋友圈、公众号文章、其他几类
            var url = document.URL || '';
            var ref = document.referrer || '';
            if (ref.indexOf('http://mp.weixinbridge.com/mp/wapredirect?') == 0) {
                return 'weixin-article';
            } else if (url.indexOf('from=timeline') > 0) {
                return 'weixin-timeline';
            } else if (url.indexOf('from=singlemessage') > 0) {
                return 'weixin-singlemessage';
            } else if (url.indexOf('from=groupmessage') > 0) {
                return 'weixin-groupmessage';
            }
            return 'weixin-unknown';
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
        if (ua.match(/momoWebView\//i) == 'momowebview/') {
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
        // AlipayClient/10.1.2.091512
        if (ua.match(/AlipayClient\//i) == 'alipayclient/') {
            return 'alipay';
        }
        // com.laiwang.DingTalk/2697521
        if (ua.match(/DingTalk\//i) == 'dingtalk/') {
            return 'dingtalk';
        }
        // qdesk
        if (ua.match(/qdesk/i) == 'qdesk') {
            return 'qdesk';
        }
        // qqnews/5.3.0
        if (ua.match(/qqnews\//i) == 'qqnews/') {
            return 'qqnews';
        }
        // iqiyi
        if (ua.match(/iqiyi/i) == 'iqiyi') {
            return 'iqiyi';
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
        return helper.getTrackerData('b_v') || helper.getTrackerData('client_edition') || '0';
    };

    // 获取product，默认值为tracker_view
    helper.getProduct = function() {
        return helper.getTrackerData('product') || 'tracker_view';
    };

    helper.getField = function (fieldName) {
        return helper.getTrackerData(fieldName)  || '';
    };

    // 获取微信用户信息
    helper.getWxUserInfo = function () {
        if(window.eqxH5WxInfo){
            return window.eqxH5WxInfo;
        }else{
            return helper.getTrackerData('wx_user_info') || {};
        }
    };

    // 获取微信阅读来源：1. 在微信平台；2. 从url中解析from参数；3. 如果没有此参数，且ref非空，则来自于微信文章
    // http://23677939.scene.eqxiu.com/s/zv2pvEVH?share_level=5&from_user=7ecb9345-db08-4aca-96bc-aeb2faf600eb&from_id=90ad4d40-eb7d-4c54-b2be-0dcd2bde1480&share_time=1513061486169&from=singlemessage&isappinstalled=0
    helper.getWxReadFrom = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            // 微信平台下细分出：单消息、群消息、朋友圈、公众号文章、其他几类
            var url = document.URL || '';
            var ref = document.referrer || '';
            if (ref.indexOf('http://mp.weixinbridge.com/mp/wapredirect?') == 0) {
                return 'article';
            } else if (url.indexOf('from=timeline') > 0) {
                return 'timeline';
            } else if (url.indexOf('from=singlemessage') > 0) {
                return 'singlemessage';
            } else if (url.indexOf('from=groupmessage') > 0) {
                return 'groupmessage';
            }
            return 'unknown';
        }
        return '';
    };

    /*---------------------------------------------------*/

    var collect = {
        time: new Date().getTime(),
        server: '${log.server}',
        serverv2: '${quick.log.server}', //version 2
        pages: {time: 0, total: 1, curr: 0, depth: 1, ids:[], dur: [0]}, // 记录场景页的访问情况
        triggers: {total: 0, id_type:[], counts: []}, // 记录场景组件触发情况
        sdk: 'tracker-view.js',
        ver: '5.6'
    };

    // 收集参数
    collect.params = function () {
        var p = {};

        p.sdk = collect.sdk;
        p.ver = collect.ver;
        p.d_i = helper.getCookie("_tracker_distinct_id_") || window._tracker_distinct_id_ ;

        if (document) {
            p.url = document.URL || '';
            p.ref = document.referrer || '';
        }

        if (navigator) {
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
        p.s_i = getSessionIdV2();

        //c_i : cavous_id
        p.c_i = getCanvasId();

        // u_i : user_id
        p.u_i = helper.getUserId();

        // c_p : client_type
        p.c_p = helper.getClientType();

        // p_l : platform 只有如下取值PC, App, Applet, wap , All
        p.p_l = getPlatform() || '';

        // b_v : bussness_data_version
        p.b_v = helper.getClientEdition(); //业务线数据版本标识

        // product : 产品线标识
        p.product = helper.getProduct(); //主动上报，以后必须手动设置

        p.b_t = helper.getField('b_t'); //业务线标识

        // 微信信息 :
        var wxUserInfo = helper.getWxUserInfo();
        p.wx_o_i = wxUserInfo.openid || '';
        p.wx_n_n = wxUserInfo.nickname || '';
        p.wx_sex = wxUserInfo.sex || '';
        p.wx_pro = wxUserInfo.province || '';
        p.wx_cit = wxUserInfo.city || '';
        p.wx_cou = wxUserInfo.country || '';
        p.wx_hea = wxUserInfo.headimgurl || '';
        p.wx_u_i = wxUserInfo.unionid || '';
        p.wx_r_f = helper.getWxReadFrom(); // 微信阅读来源

        p.scene_member_type = window.scene && window.scene.memberType;
        p.scene_user_type = window.scene && window.scene.userType;

        return p;
    };


    // 元素添加点击事件监听
    collect.addElementClickListener = function () {
        var that = this;
        var nodeList = document.querySelectorAll("div, span, a, img, button, input[type='button'], input[type='submit'], input[type='reset'], *[_tracker_data_]");
        helper.each(nodeList, function (element, index) {

            // 如果是div，判断div的id是否有btn、button字符串，如果没有则不监听
            if ((element && element.tagName.toLowerCase() == 'div' || element.tagName.toLowerCase() == 'span')) {
                var id = element.getAttribute('id') || '';
                var clz = element.getAttribute('class') || '';
                var tid = element.getAttribute('tracking_id') || '';
                var rdt = element.getAttribute('rdt') || '';
                if ( id.indexOf('btn') < 0 && id.indexOf('button') < 0 && clz.indexOf('btn') < 0 && tid.length < 1 && rdt.length < 1 )
                    return;
            }

            if (!element.getAttribute('_tracker_click_')) {
                helper.on(element, 'click', function (event) {
                    var params = that.params();

                    params.e_t = 'element_click';
                    params.e_p = helper.getXPath(element);
                    params.e_d = helper.getData(element);

                    // 场景总页数和当前页数：
                    params.scene_page_total = that.pages.total;
                    params.scene_page_curr = that.pages.curr;

                    var cat = element.getAttribute("cat");
                    var act = element.getAttribute("act");
                    if(cat && act){
                        params = helper.extend(params, {"cat":cat,"act":act,"rdt":"3" } );
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
    };

    // 场景页面添加曝光事件监听：
    collect.addScenePageViewListener = function () {
        var that = this;
        var nodeList = document.querySelectorAll('section.main-page div.m-img');

        // 总页数
        that.pages.total = nodeList.length;

        // 计时器
        helper.each(nodeList, function (element, index) {
            if (!element.getAttribute('_tracker_view_')) {
                var pageId = 0;
                try{pageId = element.firstElementChild.getAttribute('data-scene-id');}catch(e){}
                if(pageId == '')
                    pageId = 0;

                if (index < that.pages.dur.length){
                    that.pages.dur[index] = 0;
                    that.pages.ids[index] = pageId;
                }
                else{
                    that.pages.dur.push(0);
                    that.pages.ids.push(pageId);
                }
                // 元素100%显示出来
                var visibility = VisSense(element, {fullyvisible: 1.00});
                var visibility_monitor = visibility.monitor({
                    fullyvisible: function (visibility_monitor) {
                        // 当前页
                        that.pages.curr = index;
                        // 最深页
                        if (that.pages.curr + 1 > that.pages.depth)
                            that.pages.depth = that.pages.curr + 1;
                        // 开始时间
                        that.pages.time = new Date().getTime();
                    },
                    hidden: function () {
                        if (that.pages.time > 0)
                            that.pages.dur[index] += new Date().getTime() - that.pages.time;
                    }
                }).start();
                element.setAttribute('_tracker_view_', '_tracker_view_');
            }
        });
    };

    // launch：
    collect.launch = function () {
        var that = this;

        var params = that.params();
        params.e_t = 'launch';
        params.rdt = '1';
        helper.send(that.server, params);
    };

    // page view
    collect.pageView = function () {
        var that = this;
        var params = that.params();
        // 总页数
        that.pages.total = document.querySelectorAll('section.main-page div.m-img').length;

        params.e_t = 'page_view';
        params.cat = 'page_view';
        params.rdt = '1';
        params.act = helper.getField("unm");
        if(params.act == ''){
            params.act = '作品浏览';
        }
        params.scene_page_total = that.pages.total;

        helper.send(that.server, params);
    };

    // page leave
    collect.pageLeave = function () {
        var that = this;

        if (that.pages.total == 0)
            return;

        // 修正此时所在页面的停留时长
        if (that.pages.time > 0)
            that.pages.dur[that.pages.curr] += new Date().getTime() - that.pages.time;

        var params = that.params();

        params.e_t = 'page_leave';
        params.rdt = "1";
        params.dur = new Date().getTime() - that.time;

        helper.send(that.server, params);

        delete this;
    };

    // 获取分享链接
    // 根据当前url，修改share_level、from_user、from_id、share_time参数
    collect.getShareUrl = function (e) {
        var that = this;
        var n = e;
        try {
            var t = "";
            if (e.indexOf("#") != -1) {
                t = e.split("#")[1];
                e = e.split("#")[0]
            }

        var share_level = parseInt(helper.getCookie('_tracker_share_level_'));
        if (e.indexOf('share_level=') != -1) {
            e = e.replace('share_level=' + share_level, 'share_level=' + (share_level + 1));
        } else {
            e = helper.addQueryString(e, 'share_level', 1);
        }

        var from_user = helper.getCookie('_tracker_from_user_');
        if (e.indexOf('from_user=') != -1) {
            e = e.replace('from_user=' + from_user, 'from_user=' + helper.getCookie("_tracker_distinct_id_"));
        } else {
            e = helper.addQueryString(e, 'from_user', helper.getCookie("_tracker_distinct_id_"));
        }

        var from_id = helper.getCookie('_tracker_from_id_');
        var share_id = uuidForShare();
        helper.setCookie('_tracker_share_id_', share_id);
        if (e.indexOf('from_id') != -1) {
            e = e.replace('from_id=' + from_id, 'from_id=' + share_id);
        } else {
            e = helper.addQueryString(e, 'from_id', share_id);
        }

        var share_time = new Date().getTime();
            helper.setCookie('_tracker_share_time_', share_time);
            if (e.indexOf('share_time=') != -1) {
                e = e.replace(/share_time=[a-zA-Z0-9-]{13}/, 'share_time=' + share_time);
            } else {
                e = helper.addQueryString(e, 'share_time', share_time);
            }

            if (t != "")
                e += "#" + t;
            return e
        } catch (i) {
            return n
        }
    };

    // 分享事件
    // to - 分享目标，取值为：message、timeline、qq、qzone
    // weibo - 指的是腾讯微博，干掉先
    collect.share = function (to) {
        var that = this;

        var params = that.params();

        if (to == 'weibo')
            to = 'unknown';

        params.rdt = "1";
        params.cat = "share";
        params.act = "share";
        params.e_t = 'share'; // event_type
        params.from_user = helper.getCookie('_tracker_from_user_') || ''; // from_user
        params.share_user = helper.getCookie('_tracker_distinct_id_') || ''; // share_user
        params.from_id = helper.getCookie('_tracker_from_id_') || '';
        params.share_id = helper.getCookie('_tracker_share_id_') || '';
        params.share_to = to || 'unknown'; // share_to
        params.share_level = (parseInt(helper.getCookie('_tracker_share_level_')) + 1) || 1; // share_level
        params.share_time = helper.getCookie('_tracker_share_time_') || ''; // share_time

        helper.send(that.server, params);
    };

    // 触发日志
    collect.trigger = function (id, type) {
        var that = this;

        if(!id || !type)
            return;

        // 总触发量+1
        that.triggers.total += 1;

        // 组件触发量+1
        var key = id + "," + type;
        var index = that.triggers.id_type.indexOf(key);
        if (index < 0) {
            that.triggers.id_type.push(key);
            that.triggers.counts.push(1);
        } else {
            that.triggers.counts[index] += 1;
        }

    };

    // 主动上报日志
    collect.report = function (customParams) {
        var that = this;
        that.time = new Date().getTime();

        var params = that.params();
        params.rdt = "1"; //表示调用report接口主动上报

        if(customParams){
            params = helper.extend(params, customParams)
        }

        if(params.e_t){
            helper.send(that.serverv2,params);
        }else{
            console.log("Please set argument e_t.")
        }
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

    /*---------------------------------------------------*/

    // 设置客户端launch标识：
    var _tracker_launch_ = getCookie("_tracker_launch_");
    if (_tracker_launch_ == null) {
        collect.launch();
        _tracker_launch_ = "1";
        // 如果是chrome，则设置cookie过期时间为1天；其他浏览器设置cookie过期时间为session；
        // 因为chrome对于session级别的cookie不自动清除
        setCookie("_tracker_launch_", _tracker_launch_, 24 * 60 * 60 * 1000); // 1天
    }

    // 触发page_view事件,无论window.scene是否有值，都需要等待1.5秒
    setTimeout(function () {
        collect.pageView();
    }, 1500);

    // 页面加载完成后，对_tracker_进行初始化，并触发发送事件
    helper.onload(function () {
        try {
            // 存储share_level、from_user、from_id到cookie
            var share_level = helper.getQueryString('share_level') || 0;
            try {
                share_level = parseInt(share_level);
            } catch (e) {
                share_level = 0;
            }
            helper.setCookie('_tracker_share_level_', share_level);

            const from_user = helper.getQueryString('from_user') || '';
            helper.setCookie('_tracker_from_user_', from_user);

            const from_id = helper.getQueryString('from_id') || '';
            helper.setCookie('_tracker_from_id_', from_id);

            // 初始化点击事件：
            collect.addElementClickListener();
            // 初始化场景页曝光事件：
            collect.addScenePageViewListener();

            //初始化页面元素曝光事件：
            beginObserve('[bigdata_view="0"]',function (element) {
                collect.elementView(element,"页面元素");
            });

        } catch (e) {
            console.error(e);
        }
    });

    // 页面跳出时，发送pageLeave事件
    helper.onunload(function () {
        try {
            collect.pageLeave();
        } catch (e) {
            console.error(e);
        }
    });

    // 监听页面dom变化：
    helper.on(document, 'DOMNodeInserted', function (e) {
        try {
            collect.addElementClickListener();
            collect.addScenePageViewListener();
        } catch (e) {
            console.error(e);
        }
    });

    // 暴漏全局对象：
    window._tracker_api_ = collect;

})(window);

