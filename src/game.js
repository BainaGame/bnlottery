/**
 * Created by wyang on 16/1/12.
 *
 * 元素 anchorpoint 在中心点
 * 元素宽高为 100,每个格子宽高为 100 横向间距72 竖向间距 32 ,元素显示在中间
 */

var Game = cc.Node.extend({
    gapw: 72,
    gaph: 32,
    numSlot: 3,
    datas: null,
    ids: null,

    /**帧事件监听*/
    enterFrameListener: null,

    /**倒计时*/
    scheduleHandler: null,

    /** 老虎机裁剪显示区域*/
    clippingNode: null,

    /**老虎机的三条槽*/
    slots: null,

    /**
     * 所有Item的二维数组
     */
    items: null,

    /**开始按钮*/
    btnSlot: null,

    /**左边投币按钮*/
    insertCoin: null,

    /**上部状态文字*/
    labelTop: null,

    /**底部状态文字*/
    labelBottom: null,

    /** 右边中奖列表*/
    listContainer: null,

    /**
     * 是否被锁住不能抽奖,投币后解锁
     */
    _lock: true,

    ctor: function(){

        this._super();
        this.initUI();
        this.initSlot();
    },

    initSlot: function(){

        this.slots = [];
        for (var i=0;i<this.numSlot;i++){
            var slot = new cc.Node();

            slot.x = (HumanItem.sizew + this.gapw) * (i + 0.5);

            this.clippingNode.addChild(slot);
            this.slots.push(slot);
        }

        this.items = [];
    },

    /**
     * 初始化界面
     */
    initUI: function(){

        //背景
        this.bg = new cc.Sprite(res.roll_slot);
        this.bg.x = this.bg.width/2;
        this.bg.y = cc.winSize.height/2;
        this.addChild(this.bg);

        //裁剪区域
        var clippingNode = this.clippingNode =  new cc.ClippingNode();
        clippingNode.width = (HumanItem.sizew + this.gapw)*3;
        clippingNode.height = (HumanItem.sizeh + this.gaph)*3;

        var stencil = new cc.DrawNode();
        var rectangle = [cc.p(0,0),
            cc.p(clippingNode.width,0),
            cc.p(clippingNode.width,clippingNode.height),
            cc.p(0,clippingNode.height)]
        var white = cc.color(255,255,255,255);
        stencil.drawPoly(rectangle,white,1,white);

        clippingNode.stencil = stencil;

        this.clippingNode.anchorX = 0;
        this.clippingNode.anchorY = 0;

        //50,71,为图片中量出来的偏移值
        this.clippingNode.x = 50;
        this.clippingNode.y = 71 + (this.bg.y-this.bg.height/2);//cc.winSize.height * 0.5 - clippingNode.height * 0.5;

        this.addChild(this.clippingNode,1);

        var self = this;

        //开始按钮
        this.btnSlot = new BtnSlot();
        this.btnSlot.x = this.bg.width * 0.5 + this.bg.x - 40;
        this.btnSlot.y = this.bg.y;

        this.addChild(this.btnSlot);

        //投币按钮,是误点的保险
        this.insertCoin = new cc.Sprite(res.insertCoin);
        this.insertCoin.anchorX = 0;
        this.insertCoin.anchorY = 0;
        this.insertCoin.y = 78 + (this.bg.y-this.bg.height/2);

        this.addChild(this.insertCoin);

        //顶部状态文字 不超过15个字
        this.labelTop = new cc.LabelTTF("","黑体",30);
        this.labelTop.x = this.bg.x;
        this.labelTop.y = this.bg.y + 240;

        this.addChild(this.labelTop);

        //底部状态文字 不超过15个字
        this.labelBottom = new cc.LabelTTF("","黑体",30);
        this.labelBottom.x = this.bg.x;
        this.labelBottom.y = this.bg.y - 248;

        this.addChild(this.labelBottom);

        //中奖列表容器
        this.listContainer = new cc.Node();
        this.listContainer.x = this.bg.x + this.bg.width * 0.5 + 50;
        this.listContainer.y = this.bg.y + this.bg.height * 0.5 - 50;

        this.addChild(this.listContainer);

        this.startEnterFrame();
    },

    getIsLock: function(){
        return this._lock;
    },

    setLock: function(isLock){
        this._lock = isLock;
    },

    /**
     * @param nineStatus Array 9个状态
     * 显示最后一个界面,高亮,变灰色,或者不显示 1,0,-1
     */
    showLastScreen: function(nineStatus){

        if (!nineStatus || nineStatus.length != 9){
            return;
        }else{
            var length;
            var item;
            for(var i=0;i<nineStatus.length;i++){
                length = this.items[0].length;
                item = this.items[Math.floor(i%3)][length-1-Math.floor(i/3)];
                if (item){
                    item.showStatus(nineStatus[i]);
                }else{
                    cc.log("item不对")
                }
            }
        }
    },

    /**
     *
     * @param nineStatus Array 9个状态
     * 显示第一个界面,高亮,变灰色,或者不显示 2,1,-1
     */
    showFirstScreen: function(nineStatus){
        if (!nineStatus || nineStatus.length != 9){
            return;
        }else{
            var length;
            var item;
            for(var i=0;i<nineStatus.length;i++){
                length = this.items[0].length;
                item = this.items[Math.floor(i%3)][2-Math.floor(i/3)];
                if (item){
                    item.showStatus(nineStatus[i]);
                }else{
                    cc.log("item不对")
                }
            }
        }
    },

    /**
     * 显示中奖列表
     * @param lists
     */
    showList: function(lists,numColumn,fontSize){

        numColumn = numColumn || 3;
        fontSize = fontSize || 20;

        var gapw = Math.floor(110*3/numColumn);
        var gaph = Math.max(fontSize,30);

        this.listContainer.removeAllChildren();

        if (!lists || !lists.length){
            return;
        }

        var titleLabel = new cc.LabelTTF("请上台领奖:","黑体",30);
        titleLabel.setColor(cc.color(0,0,0));
        titleLabel.anchorX = 0;
        titleLabel.anchorY = 0;

        this.listContainer.addChild(titleLabel);



        for(var i=0;i<lists.length;i++){

            var label = new cc.LabelTTF(lists[i],"Arial",fontSize,cc.size(gapw,gaph));
            label.setColor(cc.color(0,0,0));
            label.anchorX = 0;
            label.anchorY = 1;

            label.x = gapw * Math.floor(i%numColumn);
            label.y = gaph * - Math.floor(i/numColumn) - 40;

            this.listContainer.addChild(label);
        }
    },

    showStatus: function(status,isForce){

        if (status.length > 15){
            status = "此处文本不能超过15个字";
        }
        this.labelBottom.setString(status);

        var self = this;
        if (!isForce) {
            if (this.scheduleHandler) {
                this.unschedule(this.scheduleFunc);
            }
            this.scheduleHandler = this.scheduleOnce(this.scheduleFunc, 3);
        }
    },

    scheduleFunc: function(){
        this.labelBottom.setString("猜猜谁会中奖");
    },

    showTitle: function(title){
        if (title.length > 15){
            title = "此处文本不能超过15个字";
        }
        this.labelTop.setString(title);
    },

    /**清除游戏的人*/
    clearGame: function(){
        for (var i=0;i<this.slots.length;i++){
            var slot = this.slots[i];
            slot.removeAllChildren();
        }
    },

    /**
     * 根据数据初始化游戏的显示,显示就知道结果,是为了不会因为结果的变换,出现第一屏和最后一屏相悖的情况
     * @param datas 所有人的数据
     * @param ids 从左到右，从下到上，一个二维数组
     * @param modeLast 最后一屏幕的显示
     * @param modeFirst 第一屏的显示
     */
    showGame: function(datas,ids,modeLast,modeFirst){

        //清除残余
        this.clearGame();
        this.datas = datas;
        this.ids = ids;

        var slotIds;

        this.items = [];

        for (var i=0;i<this.slots.length;i++){

            var slot = this.slots[i];
            slot.y = 0;
            slotIds = ids[i];

            this.items[i] = [];

            for(var j=0;j<slotIds.length;j++){
                var humanitem = new HumanItem(datas[slotIds[j]]);
                humanitem.y = (HumanItem.sizeh + this.gaph) * (j + 0.5);
                this.items[i][j] = humanitem;
                slot.addChild(humanitem);
            }
        }

        this.showLastScreen(modeLast);
        this.showFirstScreen(modeFirst);
        this.resetVisible();
    },

    sortArray: function(arr){
        arr.sort(function(a,b){
            var random = Math.random();
            return random < 0.5 ? 1 : -1;
        })
    },

    /**
     * 每一帧的处理函数
     *
     */
    onEnterFrame: function(){
        this.resetVisible();
    },

    resetVisible: function(){
        var halfCellHeight = (HumanItem.sizeh+this.gaph)*0.5;

        for (var i=0;i<this.numSlot;i++){
            var slot = this.slots[i];

            var children = slot.getChildren();
            var length = children.length;
            for(var j=0;j<length;j++){
                var child = children[j];

                var worldPoint = slot.convertToWorldSpace(cc.p(child.x,child.y));
                var nodePoint = this.clippingNode.convertToNodeSpace(worldPoint);

                // 被剪切掉的区域不渲染 75 = (HumanItem.sizeh+this.gaph)*0.5
                if (nodePoint.y > this.clippingNode.height + halfCellHeight || nodePoint.y < -halfCellHeight){
                    child.resetVisible(false);
                }else{
                    child.resetVisible(true);
                }
            }
        }
    },

    getNumHuman: function(){
        return this.ids[0].length;
    },

    startEnterFrame: function(){
        var self = this;
        if (!this.enterframeListener){
            this.enterframeListener = cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_UPDATE,function(){
                self.onEnterFrame();
            })
        }
    },

    stopEnterFrame: function(){
        this.enterframeListener = null;
        cc.eventManager.removeListener(this.enterframeListener);
    },

    /**
     * 拉杆
     */
    pull: function(endCallback){

        for (var j=0;j<this.numSlot;j++){

            var slot = this.slots[j];
            slot.y = 0;
        }

        var self = this;
        var overCallback = function(){

            for(var k=0;k<this.numSlot;k++){
                var tempSlot = this.slots[k];
                tempSlot.y = 0;
            }

            //self.stopEnterFrame();
            if (endCallback){
                endCallback();
            }
        }

        for (var i=0;i<this.numSlot;i++){

            var slot = this.slots[i];
            var moveAction = cc.moveBy(2.2,0,50-this.getNumHuman() * (HumanItem.sizeh+this.gaph)+this.clippingNode.height);
            var delayAction = cc.delayTime(i*0.6);

            var bounce = cc.moveBy(0.2,0,-50).easing(cc.easeBackOut());

            slot.stopAllActions();
            if (this.numSlot - 1 == i){
                slot.runAction(cc.sequence([delayAction,moveAction,bounce,cc.callFunc(overCallback)]));
            }else{
                slot.runAction(cc.sequence([delayAction,moveAction,bounce]));
            }
        }
    }
})