/**
 * Created by wyang on 16/1/14.
 * 游戏数据管理
 * 内存和 localstorage 同步,注意只能存 4095 个字节的数据
 */

var GameData = {};

GameData.saveData = function(){
    cc.log("saveData");
    cc.sys.localStorage.setItem("data",JSON.stringify(GameData.data));
}

GameData.readData = function(){
    var mstr = cc.sys.localStorage.getItem("data");
    return JSON.parse(mstr);
}


/**
 * 测试关键函数
 */
GameData.test = function(){
    for(var i=0;i<100;i++){
        var temp = this.generateList();
        this.checkResultDict(temp);
    }
}

GameData.init = function(){

    var tempData = GameData.readData();

    //抽完后所有数据重置
    if (tempData && tempData.roundIndex < Config.roundDatas.length){
        GameData.data = tempData;
    }else{
        var data = GameData.data = {};
        data.prizeIds = {};
        for(var i=0;i<=6;i++){
            data.prizeIds[i] = [];
        }

        data.prePrizeIds = this.generateList();
        //抽奖回合
        data.roundIndex = 0;
    }
}

GameData.addData = function(prizeId,ids) {
    var data = GameData.data;
    if (!data.prizeIds){
        data.prizeIds = {};
    }
    if (!data.prizeIds[prizeId]) {
        data.prizeIds[prizeId] = [];
    }

    //去重
    var tempArr = data.prizeIds[prizeId];
    for(var i=0;i<ids.length;i++){
        if(tempArr.indexOf(ids[i]) == -1){
            tempArr.push(ids[i]);
        }
    }
}

//生成中奖列表
GameData.generateList = function(){
    var resultDict = {};

    var allData = this.getAllDatas();
    var allids = this.getKeys(allData);

    resultDict[5] = this.getByRatio(180,allids);
    resultDict[4] = this.getByRatio(18,allids);
    resultDict[3] = this.getByRatio(16,allids);
    resultDict[2] = this.getByRatio(6,allids);
    resultDict[1] = this.getByRatio(1,allids);
    resultDict[0] = this.getByRatio(1,allids);
    resultDict[6] = this.getByRatio(10,allids);

    return resultDict;
}

/**
 * 固定个数,平均从各个数组中抽取
 * @param num
 */
GameData.getByRatio = function(num){

    var resultArr = [];
    var arrs = Array.prototype.splice.call(arguments,1);
    var numPrize = num;
    var numTotal = 0;

    for(var i=0;i<arrs.length;i++){
        numTotal += arrs[i].length;
    }

    var numTempPrize = 0;
    var tempArray;
    for(var j=0;j<arrs.length-1;j++){
        numTempPrize = Math.floor(arrs[j].length/numTotal*numPrize);
        tempArray = this.getArrayRandom(arrs[j],numTempPrize);

        this.minusArray(arrs[j],tempArray);
        resultArr = resultArr.concat(tempArray);
    }

    var numLast = numPrize - resultArr.length;
    tempArray = this.getArrayRandom(arrs[arrs.length-1],numLast);
    this.minusArray(arrs[arrs.length-1],tempArray);

    resultArr = resultArr.concat(tempArray);

    return resultArr;
}

/**
 * 检查重复
 * @param resultDict
 */
GameData.checkResultDict = function(resultDict){
    var flatArray = [];
    for(var i in resultDict){
        for(var j=0;j<resultDict[i].length;j++){
            if (flatArray.indexOf(resultDict[i][j]) == -1){
                flatArray.push(resultDict[i][j]);
            }else{
                throw new Error("=====");
            }
        }
    }
}

/**
 * 获得所有数据
 */
GameData.getAllDatas = function(){
    return photoDatas;
}

/**
 * 获得字典的所有key的数组
 * @param dict
 * @param result
 * @param filters
 * @returns {*|Array}
 */
GameData.getKeys = function(dict,result,filters){
    result = result || [];
    for(var i in dict){
        if (filters){
            if (filters.indexOf(i) == -1){
                result.push(i);
            }
        }else{
            result.push(i);
        }
    }

    return result;
}


/**
 * 两个数组相减
 * @param arra
 * @param arrb
 */
GameData.minusArray = function(arra,arrb){
    var index = -1;
    for(var i=0;i<arrb.length;i++){
        index = arra.indexOf(arrb[i]);
        if(index != -1) {
            arra.splice(index, 1);
        }
    }
},

/**
 * 两个数组相减,返回新的数组
 * @param arra
 * @param arrb
 */
GameData.getMuniusArray = function(arra,arrb){

    var result = [];
    for(var i=0;i<arra.length;i++){
        if (arrb.indexOf(arra[i]) == -1){
            result.push(arra[i]);
        }else{
            cc.log("no")
        }
    }

    return result;
},

/**
 * 数组中随机一些元素作为数组返回
 * @param arr
 * @param num
 * @param result
 * @returns {*|Array}
 */
GameData.getArrayRandom = function(arr,num,result){

    result = result || []
    arr.sort(function(a,b) {
            var random = Math.random();
            return random < 0.5 ? 1 : -1;
        }
    )

    var length = Math.min(num,arr.length);
    for(var i=0;i<length;i++){
        result.push(arr[i])
    }

    return result;
}

//加载此文件时初始化数据
GameData.init();




