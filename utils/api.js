// const host = "http://192.168.62.171:8080";
const host = "https://www.linkworker.cn/JZ";
const api = {
	carouselList:host+'/api/param/carouselList',//轮播图
	carouselInfo:host+'/api/param/carouselInfo',//轮播图详情
	categoryList:host+'/api/param/categoryList',//首页类别
	categoryInfo:host+'/api/param/categoryInfo',//首页类别详情
	recommendClassifyList:host+'/api/param/recommendClassifyList',//首页分类推荐列表
	classifyInfo:host+'/api/param/classifyInfo',//分类详情
	classifyListByCategory:host+'/api/param/classifyListByCategory',//根据一级分类获取二级分类
	addOrder:host+'/api/order/addOrder',//创建订单
	upload_file:host+'/common/upload',//
	sendMessage:host+'/api/param/sendMessage',//发送短信验证码
	userInfo:host+'/api/user/userInfo',//用户信息
	updateUserInfo:host+'/api/user/updateUserInfo',//用户信息
	userOrderList:host+'/api/order/userOrderList',//订单列表
	orderInfo:host+'/api/order/orderInfo',//订单详情
	appealBidding:host+'/api/order/appealBidding',//订单申诉列表
	updateOrder:host+'/api/order/updateOrder',//修改订单
	cancelOrder:host+'/api/order/cancelOrder',//取消订单
	orderBiddingList:host+'/api/order/orderBiddingList',//订单投标人
	userTaotaiBidding:host+'/api/order/userTaotaiBidding',//用户淘汰竞标
	userSelectBidding:host+'/api/order/userSelectBidding',//用户选择竞标
	biddingInfo:host+'/api/order/biddingInfo',//投标详情
	jzMessageList:host+'/api/jzMessage/list',//消息查询
	jzMessageInfo:host+'/api/jzMessage/info',//消息详情
	ruleInfo:host+'/api/param/ruleInfo',//获取规则协议信息
	userPayBidding:host+'/api/userPay/userPayBidding',//用户订单支付
	commentList:host+'/api/order/commentList',//订单评论列表
	addComment:host+'/api/order/addComment',//订单评论
	completelOrder:host+'/api/order/completelOrder',//完成订单
	evaluateOrder:host+'/api/order/evaluateOrder',//订单评价
	orderBiddingUserList:host+'/api/order/orderBiddingUserList',//投诉选择工人列表
	complaintOrder:host+'/api/order/complaintOrder',//订单投诉-撤销投诉
	customerServiceInfo:host+'/api/param/customerServiceInfo',//客服中心
	appLogin:host+'/api/user/appLogin',//用户登录
	wechatLogin:host+'/api/user/wechatLogin',//用户登录
	videoCall:host+'/api/user/videoCall',//视频通话
	houseId:host+'/api/user/houseId',//视频通话房间号

};
module.exports = api;
