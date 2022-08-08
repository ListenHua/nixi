/* eslint-disable no-undef */
/**
 * 按模块导入路由映射表
 * @Date: 2021-11-09 18:02:32
 * @description: 自动化构建pages.json
 **/
const fs = require('fs')

const router = require('./template.pages.js')

const main = require('../src/config/router/main.route.js')

//自动配置pages
const setPagesJson = function (name, routeJson) {
    let json = {
        root: name,
        pages: [],
    }
    let pages = []
    for (let key in routeJson) {
        let _json = {
            path:
                name == 'pages'
                    ? routeJson[key].path.substring(
                          1,
                          routeJson[key].path.length
                      )
                    : routeJson[key].path.substring(
                          name.length + 2,
                          routeJson[key].path.length
                      ),
        }
        if(name == 'packageB'||name == 'packageC'){
            _json.path = routeJson[key].path.replace(`${name}/`,'')
        }
        _json.style = {
            navigationBarTitleText: routeJson[key].name,
        }
        if (routeJson[key].navigationBarBackgroundColor) {
            _json.style['navigationBarBackgroundColor'] = routeJson[key].navigationBarBackgroundColor
        }
        if (routeJson[key].navigationBarTextStyle) {
            _json.style['navigationBarTextStyle'] = routeJson[key].navigationBarTextStyle
        }
        if (routeJson[key].custom) {
            _json.style['navigationStyle'] = 'custom'
        }
        if (routeJson[key].enablePullDownRefresh) {
            _json.style['enablePullDownRefresh'] = true
        }
        if(routeJson[key].usingComponents) {
            _json.style['usingComponents'] = routeJson[key].usingComponents
        }

        //主包
        if (name == 'pages') {
            pages.push(_json)
        } else {
            //分包
            json.pages.push(_json)
        }
    }
    if (name == 'pages') {
        router.pages = pages
    } else {
        router.subPackages.push(json)
    }
}

setPagesJson('pages', main.routers)

fs.writeFile(
    process.cwd() + '/src/pages.json',
    JSON.stringify(router, null, '\t'),
    (e) => (e ? console.error(e) : console.log('pages.json 配置文件更新成功'))
)
