/**
 * Created by wyang on 16/1/13.
 */

var GameCtrl = cc.Class.extend({

    _game: null,

    /**
     * 当前是否中奖
     */
    _isPrize: false,

    /**
     * 正在运行,包括连抽
     */
    _running: false,

    /**
     * 当前回合数
     */
    roundIndex: 0,

    /**
     * 当前重试次数
     * */
    timeIndex: 0,

    /**
     * 所有的数据字典
     */
    allDatas:null,

    /**
     * 当前回合的结果
     */
    roundResult: null,

    /**
     * 中奖名单,显示在右边的列表 of id
     */
    prizeList: null,

    /**
     * 最后一屏的数据 of id
     */
    _lastNineIds: null,

    /**
     * 已经刷新过
     */
    _hasRefresh: false,

    ctor: function(game){

        this._game = game;

        var self = this;
        this._game.btnSlot.setCallback(function(){

            if (self._game.getIsLock()){

                self._game.showStatus("请先投币!");
                return false;
            }else{

                self._running = true;
                self._game.setLock(true);
                self.pullGame(self._hasRefresh);

                self.checkResetPrizeList();
                return true;
            }
        })

        //投币
        game.insertCoin.addTouchListener(function(name){
            if (name == "began"){

                if (self._running){
                    game.showStatus("正在抽奖,先不要投币!");
                }else{

                    SoundCtrl.playBet();
                    game.setLock(false);
                    game.showStatus("投币成功!");
                }
            }
        });

        this.allDatas = this.getAllDatas();
        this.startRound();

    },

    pullGame: function(isKeepLast){

        var self = this;

        if (!isKeepLast){
            this.showTry();
        }

        this._hasRefresh = false;

        SoundCtrl.playRoll();
        this._game.pull(function(){
            //抽奖完成
            self.onTryOver();
        });

        this._game.showStatus("你会中奖吗",true);
    },

    startRound: function(){

        //回合数据,1 为自动到下一次抽奖，0为暂停，1为抽奖结束
        this.roundIndex = GameData.data.roundIndex;
        this.showTry();
    },

    /**
     * 一次抽奖的尝试
     */
    showTry: function(){
        var roundData = Config.roundDatas[this.roundIndex];
        if (!roundData["t"]){
            roundData["t"] = 1;
        }
        this._game.showTitle(roundData["name"]);

        var isPrize = this.timeIndex >= roundData["t"]-1;
        var result = this.getRewardResultDataByPre(roundData["id"],isPrize,this._lastNineIds);

        this._lastNineIds = result[3];


        this.roundResult = result;
        this._game.showGame(result[0],result[1],isPrize?result[4]:null,this._lastMode);
        this._lastMode = isPrize?result[4]:null;

        this._hasRefresh = true;
    },


    /**一次结束 */
    onTryOver: function(){

        var roundData = Config.roundDatas[this.roundIndex];

        if (!roundData["t"]){
            roundData["t"] = 1;
        }

        this.timeIndex ++;

        //是有效的抽奖
        if (this.timeIndex >= roundData["t"]){

            //中奖结果放到结果列表
            this.prizeList = this.prizeList.concat(this.roundResult[2]);

            // 结束一回合
            this.roundIndex ++;
            this.timeIndex = 0;

            this.saveResult(roundData,this.roundResult);

            var mdo = roundData["do"];
            if (mdo == 1){  //自动继续
                this.refreshRoundResult(roundData["id"]);

                var self = this;
                //2秒后自动抽
                cc.director.getScheduler().schedule(function(){
                    self.pullGame();
                }, this, 2, 0, 0, false, "autoPull");

            }else if (mdo == 0){ //手动继续
                this.refreshRoundResult(roundData["id"]);
                this._running = false;

                this._game.showStatus("领奖人上台后请继续",true);

            }else if (mdo == 2){
                this.refreshRoundResult(roundData["id"]);
                this._game.showTitle("所有奖项已抽完");
                this._running = false;

                this.reset();
            }

        }else{
            this._game.showStatus("抽奖失败，自动重新尝试");

            var self = this;

            //2秒后自动抽
            cc.director.getScheduler().schedule(function(){
                self.pullGame();
            }, this, 2, 0, 0, false, "failpull");
        }
    },

    /**
     * 重新开始抽奖
     */
    reset: function(){
        GameData.init();
        this.roundIndex = 0;
    },

    /**
     * 开始手动抽奖之前重置记录的中奖列表
     */
    checkResetPrizeList: function(){

        var roundData = Config.roundDatas[this.roundIndex];
        var preRoundData = Config.roundDatas[this.roundIndex-1];

        //5等奖的每一轮或者其他奖的最后一轮刷新中奖列表
        if (roundData["id"] == 5 || !preRoundData || preRoundData["id"] != roundData["id"]){
            this.prizeList = [];
        }

        if(!this.prizeList){
            this.prizeList = [];
        }

        cc.log("--------------");

        this.refreshRoundResult(roundData["id"]);

    },

    /**
     * 刷新一轮的结果,把当前的中奖结果压入一个数组,传到 game 显示出来
     */
    refreshRoundResult: function(prizeId){

        var names = [];
        var ids = this.prizeList;
        for(var i in ids){
            var name = this.allDatas[ids[i]]["name"];
            names.push(name);
        }

        this._game.showList(names,Config.pShow[prizeId][0],Config.pShow[prizeId][1]);
    },

    saveResult: function(roundData,result){
        GameData.data.roundIndex = this.roundIndex;
        GameData.addData(roundData["id"],result[2]);
        GameData.saveData();
    },

    /**
     * 获得结果数据
     * @param rewardId
     * @param isPrize 这一次是否中奖
     *
     * @return 【datas,ids,rewardIds】
     */
    getRewardResultDataByPre: function(rewardId,isPrize,lastNineIds) {
        rewardId = parseInt(rewardId);

        var mask = Config.plogic[rewardId];
        var mode;

        var numPrize = 0;

        if (mask.multi){
            mode = mask.mode;
            numPrize = this.getArraySum(mode);
        }else{
            var length = mask.modes.length;
            var index = Math.floor(Math.random() * length);
            mode = mask.modes[index];

            numPrize = 1;
        }

        var resultids;

        var candidates = this.getMuniusArray(GameData.data.prePrizeIds[rewardId],GameData.data.prizeIds[rewardId]);
        resultids = this.getArrayRandom(candidates,numPrize);

        var roundids = this.getKeys(this.allDatas);

        //之前已中奖id
        var prizedIds = this.getPrizedIds();
        this.minusArray(roundids, prizedIds);

        //最终的9个
        var nineids = this.getNineByMask(roundids,resultids,mode,isPrize);
        var ids = this.getIdsByNineIds(roundids,nineids,lastNineIds);

        //所有人员的字典,所有显示的id,中奖的id,最后一屏幕的id,中奖的掩码
        return [this.allDatas,ids,resultids,nineids,mode];
    },

    getNineByMask: function(roundids,resultids,mode,isPrize){

        var ids = [];

        var nineids;

        //最后一屏幕的列
        var lasts = [];

        //除最后一屏幕外的列
        var others = [];

        if (resultids.length == 9){
            nineids = resultids;
        }else if(resultids.length == 8){
            this.minusArray(roundids,resultids);
            nineids = [];
            var randomId = this.getArrayRandom(roundids,1)[0];
            for (var i=0;i<resultids.length;i++){
                nineids[i] = resultids[i];
            }
            nineids.splice(4,0,randomId);
        }else{
            //是会中奖的有效抽奖
            if (isPrize){

                this.minusArray(roundids,resultids);
                var needNum = 9 - this.getArraySum(mode);
                var needIds = this.getArrayRandom(roundids,needNum);

                nineids = Array(9);
                var cell = 0;
                for(var i=0;i<9;i++){
                    cell = mode[i];
                    if (cell == 1){
                        nineids[i] = resultids[0];
                    }else{
                        nineids[i] = needIds.pop();
                    }
                }

            }else{
                nineids = this.getArrayRandom(roundids,9);
            }
        }

        return nineids;
    },

    getArraySum: function(arr){
        var sum = 0;
        for(var i in arr){
            if (arr[i] == 1){
                sum += arr[i];
            }
        }
        return sum;
    },

    /**
     * 根据得到的9个最后一屏，和之前的最后一屏幕,三列数组
     * @param roundIds
     * @param lasNineIds
     * @param firstNineIds 第一屏的数据
     * @returns {Array}
     */
    getIdsByNineIds: function(roundIds,lastNineIds,firstNineIds){

        var ids = [];
        var lastids = [];//最后一屏的数据
        var otherids = [];

        lastids[0] = [lastNineIds[6],lastNineIds[3],lastNineIds[0]];
        lastids[1] = [lastNineIds[7],lastNineIds[4],lastNineIds[1]];
        lastids[2] = [lastNineIds[8],lastNineIds[5],lastNineIds[2]];

        for(var i=0;i<3;i++){
            //TODO: 调试这个语句
            //var otherArray = this.getMuniusArray(roundIds,lastids[i]);
            var otherArray = roundIds;
            otherids[i] = otherArray;
            otherids[i].sort(function(a,b){return Math.random()<0.5?1:-1});

            ids[i] = otherids[i].concat(lastids[i]);
        }

        var firstIds;//第一屏的数据 二维数组

        if(firstNineIds){
            firstIds = [];

            firstIds[0] = [firstNineIds[6],firstNineIds[3],firstNineIds[0]];
            firstIds[1] = [firstNineIds[7],firstNineIds[4],firstNineIds[1]];
            firstIds[2] = [firstNineIds[8],firstNineIds[5],firstNineIds[2]];

            for(var i=0;i<3;i++){
                ids[i] = firstIds[i].concat(ids[i]);
            }
        }

        return ids;
    },

    getArrayByIds: function(ids){
        var result = [];
        var child;
        for(var i in ids){
            child = this.allDatas[ids[i]];
            if(child){
                result.push(child);
            }
        }

        return result;
    },

    /**
     * 两个数组相减
     * @param arra
     * @param arrb
     */
    minusArray: function(arra,arrb){
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
    getMuniusArray: function(arra,arrb){

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
    getArrayRandom: function(arr,num,result){

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
    },

    /**
     * 获得已经中奖的ids的一维数组
     */
    getPrizedIds: function(){

        var result = [];
        //分奖项的数据
        var prizedIds = GameData.data.prizeIds;

        for(var i in prizedIds){
            var arr = prizedIds[i];
            result = result.concat(arr);
        }

        return result;
    },

    /**
     * 获得所有数据
     */
    getAllDatas: function(){
        return photoDatas;
    },

    /**
     * 获得字典的所有key的数组
     * @param dict
     * @param result
     * @param filters
     * @returns {*|Array}
     */
    getKeys: function(dict,result,filters){
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

})