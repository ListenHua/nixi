/**
 * 主题类
 * @Date: 2021-11-08 15:55:17
 * @Description: 路由映射表
 * 格式：{
        path: PATH + '', //路径
        name: '', //页面名称
        custom: false,//是否自定义导航栏
    }
 **/
const PATH = '/pages/'

const routers = {

	home: {
		path: PATH + 'index/index',
		name: '首页',
		custom: true,
	},
	articleDetail: {
		path: PATH + "detail/viewDetail",
		name: "",
		custom: false
	},
	record: {
		path: PATH + "record/record",
		name: "刷题记录",
		custom: false
	},
	search: {
		path: PATH + "search/search",
		name: "搜索",
		custom: false
	},
	login: {
		path: PATH + "login/login",
		name: "登录",
		custom: false
	},
	version: {
		path: PATH + "public/version",
		name: "版本描述",
		custom: false
	},
	about: {
		path: PATH + "public/about",
		name: "关于我们",
		custom: false
	},
	exam: {
		path: PATH + "topic/exam",
		name: "",
		custom: false
	}

}

module.exports = {
	routers,
}
