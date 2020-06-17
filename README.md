# WEB前端埋点JS-SDK使用说明

> 参考： http://wiki.yqxiu.cn/pages/viewpage.action?pageId=13697069

分享平台
weixin_article 微信公众号点击阅读阅读打开的文章
qdesk QQ桌面
alipay 支付宝平台


字段说明：
rdt 上报数据的类型，为字符串类型
1 表示手动调用report接口上报数据 
2 表示搜索或推荐的样例被被点击后上报的element_click日志

manual: 手动打点上报的日志，这种日志，不做判断全部接收。(之后会被rdt代替)
rdt: report_data_type 日志上报类型.
100以内的数据，都是不用判断圈选配置，直接接收。
    1.  表示以前的manual字段内容，
    2.  表示PC搜索或推荐的样例被被点击后上报的element_click日志
    21. iOS 表示PC搜索或推荐的样例被被点击后上报的element_click日志
    22. Android 表示PC搜索或推荐的样例被被点击后上报的element_click日志
    3. 前端加的元素上报标识，如果rdt为3就直接上报，不再需要后续的圈选

tracker_view
字段解释
u_i 当前登录用户的id，tracker_view里没有什么用
scene_c_u 当前场景的创建者


tracker
字段解释
u_i 当前登录用户的id

tk_id

元素的自定义属性以data-开头
自定义的window属性值放在window.log对象里


2019年08月20日
用户的信息在cookie中的保存时间为80年
1. 正常情况下，从cookie中获取用户信息，也即_tracker_user_id_

2.1 如果1中获取不到，或者tracker_user_id值的长度小于8，
2.1.1 从window.localStorage中获取
2.1.2 如果window.localStorage没有，那么将_tracker_user_id_设置空字符串

2.2 如果1中取到相关信息，和window.localStorage中的用户信息比较
2.2.1 不一致
    2.2.1.1
    如果window.localStorage有用户信息，且不为空，长度大于8
    并且，cookie中的_tracker_user_id_为空字符串，
    那么调用report接口上报一条日志，标识登录前和登录后的用户id的关联关系
    日志中：product:max, b_t:user , cat:user, act:relate , u_i:xxx, e_d: old_u_i=old_d_i_xxx , u_i=用户的id
    
    将cookie中的_tracker_user_id_设置为window.localStorage的用户id

    2.2.1.2 否则
    用window.localStorage的用户信息覆盖_tracker_user_id_

2.2.2 一致
    不做处理





