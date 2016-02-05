/**
 * Created by wyang on 16/1/12.
 */

var MainScene = cc.Scene.extend({
    onEnter: function(){
        this._super();

        var sys = cc.sys;
        if(sys.os === sys.OS_IOS || sys.os === sys.OS_OSX){
            cc.view.enableRetina(true);
        }else{
            cc.view.enableRetina(false);
        }

        //var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(75, 115, 200, 255));
        //this.addChild(bgLayer);

        var bg = new cc.Sprite(res.bg);
        bg.setAnchorPoint(0,0.5);
        bg.setScale(cc.winSize.height/bg.height);
        bg.y = cc.winSize.height * 0.5;

        this.addChild(bg);

        var game = new Game();

        game.setScale(0.8);
        game.x = 100;
        game.y = 80;
        this.addChild(game);

        var gameCtrl = new GameCtrl(game);

        SoundCtrl.playMusic();
    },

    initGame: function(){

    }
})