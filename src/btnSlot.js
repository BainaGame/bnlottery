/**
 * Created by wyang on 16/1/14.
 * 老虎机抽奖的按钮
 */

var BtnSlot = cc.Node.extend({

    bottom: null,
    stick: null,
    button: null,

    _callback: null,

    /**
     *
     * @param callback callback 返回值为 true 时会播放按钮动画
     */
    ctor: function(){

        this._super();
        this.initUI();

    },

    /**
     * 设置按下的检查函数，如果函数返回true，则按钮可以按下，有按下效果
     * @param callback
     */
    setCallback: function(callback){
        this._callback = callback;
    },

    initUI: function(){
        this.bottom = new cc.Sprite(res.stick_bottom);
        this.bottom.anchorX = 0;
        this.bottom.anchorY = 0.5;

        this.addChild(this.bottom);

        this.stick = new cc.Sprite(res.stick);
        this.stick.anchorX = 0.5;
        this.stick.anchorY = 0;
        this.stick.x = 30;
        this.stick.y = 25;

        this.addChild(this.stick);

        this.button = new cc.Sprite(res.roll_button);
        this.button.x = 30;
        this.button.y = 90;
        this.addChild(this.button);

        var self = this;
        this.button.addTouchListener(function(name){
            if (name == "began"){
                if (self._callback){
                    if (self._callback()){
                        self.pullDown();
                    }
                }
            }
        })
    },

    pullDown: function(){

        this.button.stopAllActions();
        this.stick.stopAllActions();

        this.button.y = 90;
        this.stick.scaleY = 1;

        var moveAction = cc.moveBy(0.3,0,-40);
        this.button.runAction(cc.sequence([moveAction,moveAction.clone().reverse()]))

        var scaleAction = cc.scaleBy(0.3,1,0.4);
        this.stick.runAction(cc.sequence([scaleAction,scaleAction.clone().reverse()]))
}
})
