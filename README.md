# WEB前端埋点JS-SDK使用说明

 

### 分享平台
1. weixin_article 微信公众号点击阅读阅读打开的文章
2. qdesk QQ桌面
3. alipay 支付宝平台


### 一.概述
本文档主要面向前端同学进行页面埋点使用，通过本文档可以实现自助接入。本文档只适用于WEB埋点接入。
`埋点必知`：
> 1. p_l只有如下取值PC, App, Applet, wap
> 2. c_p只有如下取值PC, iOS, Android

### 二.名词解释
1. 作品打点：又称为站外打点。H5等可分享出去的作品。例如 https://u.eqxiu.com/s/eRne4P1C 页面就是作品页面。
2. 产品打点：又称为站内打点。除作品打点都是产品打点。
3. 自动打点：接入大数据打点SDK
4. 主动打点：调用大数据打点SDK(PC和WAP)的report接口或移动端(iOS, Android和小程序)上报日志。
5. 嵌入式埋点：WEB数据在元素上添加一些标识，大数据打点SDK会采集到这些标识，上报相关元素的日志数据。

### 三. 数据上报方式比较

方式| 适用平台| 优点 | 缺点 | 自定义字段 | 备注
---| --- | --- | --- | --- | --- 
自动上报| PC，WAP | 简单，不要开发人员参与 | 数据不全面 | 不可以 | 
主动上报| PC，WAP | 数据比较可控 | 容易漏打 | 可以 |  
嵌入式打点| PC，WAP | 按照规则，快速上线，数据收集及时 |  | 不可以 |  


### 四. JS SDK接入
环境| 数据类型 | 引入文件 
---| --- | --- 
测试环境| 作品 | <script type="text/javascript" src="//datalog.sample.cn/tracker-view.js" async></script>
测试环境| 产品 | <script type="text/javascript" src="//datalog.sample.cn/tracker.js" async></script>
正式环境| 作品 | <script type="text/javascript" src="//datalog.sample.com/tracker-view.js" async></script>
正式环境| 产品 | <script type="text/javascript" src="//datalog.sample.com/tracker.js" async></script>

### 五. 代码集成
a. 产品打点，使用tracker.js文件
```
<script>
// 设置客户端类型（取值见附表）
window._tracker_ = window._tracker_ || [];
window._tracker_.push(['product', '']); //填写产品名
window._tracker_.push(['b_v', '0']); //数据版本
window._tracker_.push(['b_t', 'def']); //业务类型
window._tracker_.push(['unm', '']); //页面名字
</script>
 ```

### 六. 数据上报
1. 自动上报
接入大数据JS SDK后，页面数据会自动上报，无需做其他设置。

2. 嵌入式打点
适用于PC和WAP
如果需要对页面元素进行统计，在相关元素(先通过chrome的Element检查器查看这个元素，确保有_tracker_click_属性，_tracker_click是大数据JS加的，其他人一定不要在元素上加_tracker_click属性，如果没有_tracker_click属性，那么给元素添加个btn的class，例如：
![image.png](https://wt-box.worktile.com/public/c4301e1f-1916-41d5-9fcd-d7b075270c11)
然后加上`rdt`,`cat`,`act`三个字段，格式如下：
```
<li class="members" _tracker_click_="_tracker_click_" rdt="3" cat="pc_print" act="编辑器_升级"><i class="eqf-vipdiamond-f"></i>&nbsp;升级 </li>
```
rdt的取值只有字符串"3".
cat为事件的分类，由2部分构成，”平台_产品名”,比如”pc_print”为PC上的轻设计编辑器。其中平台取值只有pc和wap。在查看报表，根据分类过滤的时候会用到。
act为事件名，由2部分构成，"页面名_组件名",比如"编辑器_升级"为编辑器页面的升级按钮。在查看报表，根据事件过滤的时候会用到。


### 七. 字段表
其中最后一列标记为y的，表示为必填字段。
`如果没有特殊说明，所有字段均为字符串。`
`字段的长度在(2,25]范围内，否则就认为是非法参数。此定义对e_d中的参数同样有效。`

字段名| 解释| 备注 | 是否主动传值
---| --- | --- | ---| ---
product |  product | 产品英文名字 例如 H5场景PC端站外暂时为0宽度字符串或者tracker_view，站内为h5; 长页面：ls; 互动h5为h5i ; 轻设计为print； 视频为video，易表单为form | y 
unm |  url name | 页面的名字，比如‘长页面浏览’ | y 
b_t| business_type| 业务线类型，用来区分数据目录。比如秀推用"xiutui",如果用于多个业务,则用逗号分隔，例如此日志数据用于秀推和打点"xiutui,point"。取值有：def(默认)，point(积分), view(所有场景浏览), consume(购买样例), charge(秀点充值) , app_sr_vip_conv(app搜索推荐会员转化)，buy_svip(超级会员购买成功) 等 | y
b_v| business_version| 业务线数据版本，用来区分同一个业务线不同版本的数据。b_v 和 client_edition 是一样的，设置b_v 就行了，每次升级的时候，改一下这个值 | y
c_p|terminal 程序所属终端|只有如下取值：PC, iOS, Android。| y
p_l |platform  程序所属平台|只有如下取值 , PC, App, Applet, wap| y
e_t| event_type| 可取值为 page_view/page_leave/ share/element_view/ element_click/submit等，分别表示 页面展示事件、页面离开事件、分享事件、元素展示事件、元素点击事件、表单提交事件。 需要在mysql配置表中进行配置。 其他 page_view_outer：嵌入页面展示事件。比如轻松豆，有些场景是H5做的，但是又加了一些轻松豆的逻辑，这个页面的数据又要算成轻松豆的数据。| y
sns|社交平台| 如果是在WEB页面中，大数据js sdk脚本可以采集到，如果是微信小程序，则使用weixin-applet
d_t| data_type| 数据类型：0 未定，1流量域名数据。这里值是二进制转成10进制的结果 |
point_need| point_need|是否积分统计需要的打点，值为字符串1。对于积分统计来说，这个字段必须传值。| 
c_p| client_type| 客户端类型 与 client_edition可组合成客户端唯一标识|  
os| os| 操作系统| 
d_i| distinct_id| 客户端登录与非登录状态下标识 例如H5存储在cookie中，用户不主动清空cookie时该值是不变的。Android为设备的IMEI，iOS为IDFA |
u_i| user_id| 若不知，则为空|  
s_i| session_id| |
ref| referer| referer| 
url| url当前页面的url| | 
e_p| element_path,页面元素的路径，如xpath。 |如果调用report接口上报数据，不需要这个字段 | 
n_t| net_type| 网络类型 取值范围 ：wifi、2g、3g、4g、5g、unknown|
man| manufacturer| 设备厂商 注意：并不是所有设备厂商都能正确解析，若解析不到，默认值为unknown|
mod| mobile_model| 设备型号 如 iPhone 8。注意：并不是所有的设备型号都可以正确解析，若解析不到，默认值为unknown|
scene_id| 场景id|已有业务暂时保持不变，比如积分业务，还使用scene_id。在页面window对象中设置场景相关的信息，使用window.scene对象，设置window.scene.id为作品的id。| 
works_id | 作品id| | 
w_u| works_user作品创建者|代替之前的scene_c_u | 
scene_c_u| 场景创建者| 已有业务暂时保持不变，之后新的产品和业务使用w_u | 
rdt| report_data_type 日志上报类型| 1 表示调用report接口上报的日志 ，2 PC和WAP端搜索推荐点击，21 iOS端搜索推荐点击，22 Android端搜索推荐点击，3 自助埋点，在元素上加标识，51 秀点消耗(eqs_pay_order表) 52 创意云会员购买成功(eqs_order表) , 53 秀推会员购买成功, 54 秀点充值成功，55 超级会员购买成功，61 用户行为积分 | 
tk_id|tracking id 链路追踪标记 | | 
url|页面路径 |PC和WAP会自动采集，APP和小程序端必传 | 
loc|位置信息|比如广告位，图片下载的位置，视频下载的位置等|
os|操作系统 |取值为"Android","iOS","Windows","Mac OS X" ,如果还有其他OS，请联系大数据添加 | 
f_p|from_platform |来源端，比如在小程序上扫描PC上的二维码，那么小程序在上报这个日志的时候，其为f_p="PC" | 
utm_id| 付费推广的标识| | 
debugMode| 是否为调试数据| "1"表示调试，"0"表示关闭调试模式(默认)| 
其它|| | 
wx_o_i|weixin open id| | 
window.scene.ext.yqc.ad|日志中为scene_ext_yqc_ad|广告标识，据此判断是否有广告 | 
ver|iOS和Android上用到的SDK版本|之前iOS都是1.0.0，Android为空，2019年07月24日规定之后不再上报，改用b_v, 每次发版，这个值都会跟着变化 | 


URL中部分参数名解释

参数名| 解释| 示例| 备注 
---| --- | --- | ---
bd_ptid |  bigdata point task id  | bd_ptid=001 | 积分任务的id 
bd_ptst |  bigdata point task stay time | bd_ptst=10 | 在打开的页面停留10s后，开始上报积分日志 



### 九.微信分享事件埋点
1. 调用_tracker_api_.getShareUrl(share_url)，获取含要分享出去的url，该方法会在为当前URL拼接上分享相关的参数，如share_level、share_user、share_time等；
2. 分享成功回调函数中调用_tracker_api_.share('to')，发送分享成功日志，参数to为分享去向，取值为timeline、message、qq、weibo、qzone，分别表示 朋友圈、朋友、QQ、微博、QQ空间 

![image.png](https://wt-box.worktile.com/public/472a1034-9a04-4c96-92d2-639ebdafa9b2)

 





