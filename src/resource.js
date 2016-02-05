var res = {
    roll_slot: "res/ui/roll_slot.png",
    stick_bottom: "res/ui/stick_bottom.png",
    stick: "res/ui/stick.png",
    insertCoin: "res/ui/insertcoin.png",
    roll_button: "res/ui/roll_button.png",
    bg: "res/ui/bg.png",
    glow: "res/ui/glow.png",
    sound_rollslot_bet:"res/sound/rollslot_bet.ogg",
    sound_rollslot_roll:"res/sound/rollslot_roll.ogg",
    sound_music_main:"res/sound/music_main.ogg",
};

//加载显示文字
var lang = {};
lang.loadTexts = [
    "正在努力赚钱...",
    "正在大量采购奖品...",
    "正在来百纳年会的路上..."
];

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}


//增加所有图片到加载列表
for(var i in photoDatas){
    var filepath = "res/img/"+photoDatas[i]["img"];
    if (g_resources.indexOf(filepath) == -1){
        g_resources.push(filepath);
    }
}
