var xlsx = require("node-xlsx");
var fs = require("fs");
var path = require("path")

function excel2js(xlsxpath,jspath,codeheader) {

    var resultObj = {}

    var list = xlsx.parse(xlsxpath);

    var datas = list[0].data;

    //表头
    var titles = datas[0];

    //字段名
    var names = datas[1];

    for (var i = 2; i < datas.length; i++) {
        var item = datas[i];

        var itemObj = {};
        for(var index in names){
            itemObj[names[index]] = item[index];
        }

        resultObj[itemObj[names[0]]] = itemObj;
    }

    fs.writeFileSync(jspath,codeheader + JSON.stringify(resultObj,null," "));
}

var dirname = __dirname;
excel2js(path.join(dirname,"../res/datas.xlsx"),path.join(dirname,"../res/datas.js"),"var photoDatas = ");
