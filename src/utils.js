/**
 * Created by wyang on 16/1/14.
 */

var utils = {};

utils.distance = function(fromPoint,toPoint){
    return Math.sqrt(Math.pow(toPoint.x-fromPoint.x,2)+Math.pow(toPoint.y-fromPoint.y,2))
}

utils.hitTest = function(node,pt){
    var rect = node.getBoundingBox();
    var parent = node.getParent()
    if (!parent){
        parent = node;
    }
    return cc.rectContainsPoint(rect, parent.convertToNodeSpace(pt));
}

cc.Node.prototype.getCascadeBoundingBox = function () {
    // 检查所有子节点的boundingbox，获得最大的box
    var arr = this.getChildren();
    var e;
    var rect = cc.rect();
    for(var i in arr){
        e = arr[i];
        if (e.isVisible()) {
            var boundingBox = e.getBoundingBox();
            if(boundingBox.width == 0 && boundingBox.height == 0){
                boundingBox = e.getCascadeBoundingBox();
            }

            if (boundingBox.width != 0 && boundingBox.height != 0){
                rect = cc.rectUnion(rect,boundingBox)
            }

        }
    }

    return rect;
}

cc.Node.prototype.hitTest = function(pt){
    var rect = this.getBoundingBox();
    var parent = this.getParent();
    if (!parent){
        parent = this;
    }
    return cc.rectContainsPoint(rect, parent.convertToNodeSpace(pt));
}

/**
 * @param object 添加点击事件的对象
 * */
cc.Node.prototype.addTouchListener = function(callback,priority,isSwallow){
    var self = this;
    var beganTarget;
    if (true/*cc.sys.capabilities.hasOwnProperty('touches')*/){
        cc.eventManager.addListener({
            swallowTouches: isSwallow,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touches, event) {
                cc.log("addTouchListener:touchBegan");
                var touch = touches;
                if (self.hitTest(touch.getLocation())){
                    beganTarget = event.getCurrentTarget();
                    callback("began",touch.getLocation(),beganTarget)
                    return true;
                }
                return false;
            },
            onTouchMoved:function (touches, event) {
                var touch = touches;
                if (beganTarget && self.hitTest(touch.getLocation())){
                    callback("moved",touch.getLocation(),beganTarget)
                }
            },
            onTouchEnded: function(touches,event){
                var touch = touches;
                var pos = touch.getLocation();
                if (beganTarget && self.hitTest(pos)){
                    callback("ended",pos,beganTarget)

                    if (beganTarget == event.getCurrentTarget()){
                        callback("click",pos,beganTarget)
                    }
                }
            }
        }, priority || this);
    }
}