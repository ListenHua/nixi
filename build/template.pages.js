/**
 *
 * @Date: 2021-11-09 18:17:06
 * @description: page.json模板 
 */
module.exports = {
	easycom: {
		"^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
	},
	//主包
	pages: [

	],
	//分包
	subPackages: [

	],
	globalStyle: {
		navigationBarTextStyle: 'black',
		navigationBarTitleText: '匿习',
		navigationBarBackgroundColor: '#FFFFFF',
		backgroundColor: '#FFFFFF',
	},
	// tabBar: {
	//     color: '#999999',
	//     selectedColor: '#00C8C5',
	//     borderStyle: 'white',
	//     backgroundColor: '#fff',
	//     list: [
	//         {
	//             pagePath: 'pages/index/index',
	//             iconPath: 'static/tabbar/tabbar1-off.png',
	//             selectedIconPath: 'static/tabbar/tabbar1-on.png',
	//             text: '首页',
	//         },
	//         {
	//             pagePath: 'pages/mine/index',
	//             iconPath: 'static/tabbar/tabbar2-off.png',
	//             selectedIconPath: 'static/tabbar/tabbar2-on.png',
	//             text: '我的',
	//         },
	//     ],
	// },
}
