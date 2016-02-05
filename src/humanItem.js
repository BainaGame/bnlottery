/**
 * Created by wyang on 16/1/12.
 */

var HumanItem = cc.Node.extend({

    sprite: null,
    label: null,
    _greyLayer: null,
    _glowLayer: null,
    _lockVisible: false,
    ctor: function(data){
        this._super();

        this.sprite = new cc.Sprite("res/img/"+data["img"]);
        this.sprite.setScale(10/24);
        this.addChild(this.sprite);

        this.label = new cc.LabelTTF(data["name"],"黑体");
        this.label.setPosition(0,-40);
        this.label.enableShadow(cc.color.BLACK,cc.size(1,1));
        this.label.enableStroke(cc.color.BLACK,3);
        this.addChild(this.label);
    },

    showStatus: function(status){

        if (status == 1){
            this.makeGlow();
        }else if (status == 0){
            this.makeGrey();
        }else if (status == -1){
            this.visible = false;
            this._lockVisible = true;
        }
    },

    resetVisible: function(visible){
        if (!this._lockVisible){
            this.visible = visible;
        }
    },

    /**
     * 突出显示
     */
    makeGlow: function(){

        this.reset();

        this._glowLayer = new cc.Sprite(res.glow);
        this._glowLayer.setScale(10/24);
        this.addChild(this._glowLayer);
    },

    /**
     * 使变灰
     */
    makeGrey: function(){

        this.reset();
        var greyNode = new cc.DrawNode();
        var rectangle = [cc.p(0,0),
            cc.p(100,0),
            cc.p(100,100),
            cc.p(0,100)]
        var color = cc.color(0,0,0,120);
        greyNode.drawPoly(rectangle,color,1,color);

        this._greyLayer = greyNode;
        this._greyLayer.x = -50;
        this._greyLayer.y = -50;
        this.addChild(this._greyLayer);
        this.sprite.setOpacity(125);
    },

    /**
     * 重置
     */
    reset: function(){
        if (this._glowLayer && this._glowLayer.getParent()){
            this.removeChild(this._glowLayer);
        }

        if (this._greyLayer && this._greyLayer.getParent()){
            this.removeChild(this._greyLayer);
        }
    }
})

HumanItem.sizew = 100;
HumanItem.sizeh = 100;