# 老虎机式的抽奖程序

## 环境

程序基于 cocos2d-html5 开发.

检出程序后执行:

    bower install 
    
即可安装依赖.

工具依赖 nodejs npm bower. 请自行安装.


## 数据配置

在 `res/datas.xlsx`,配置序号,姓名,头像,类型,序号不能重复

## 数据使用

使用 node 运行 `tool/convert.js` 即可将 `datas.xlsx` 转换为最终需要的 `datas.js`,并且放在对应的目录,可以直接使用

