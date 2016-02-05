/**
 * Created by wyang on 16/1/13.
 * 在这里配置中奖的掩码
 */

var Config = {};

Config.pShow = {};
//显示名字的列数和字体大小
Config.pShow[5] = [3,20];
Config.pShow[4] = [2,30];
Config.pShow[3] = [2,30];
Config.pShow[2] = [1,40];
Config.pShow[1] = [1,40];
Config.pShow[0] = [1,40];
Config.pShow[6] = [1,40];

Config.plogic = {};

/**
 * multi 是否一次多人中奖，mode/modes 中奖的掩码,1为中奖高亮,0为灰,-1为不可见
 * */
Config.plogic[5] = {multi: 1, mode: [1, 1, 1, 1, 1, 1, 1, 1, 1]};
Config.plogic[4] = {multi: 1, mode: [1, 1, 1, 1, 1, 1, 1, 1, 1]};
Config.plogic[3] = {multi: 1, mode: [1, 1, 1, 1, -1, 1, 1, 1, 1]};
Config.plogic[2] = {
    multi: 0, modes: []
};

Config.plogic[2].modes = [];

//二等奖随机mode
for(var i=0;i<9;i++){
    for (var j=i+1;j<9;j++){
        //同一列不中奖
        if(Math.floor(i%3) != Math.floor(j%3)){
            var marr = [0,0,0,0,0,0,0,0,0];
            marr[i] = 1;
            marr[j] = 1;

            Config.plogic[2].modes.push(marr);
        }
    }
}

Config.plogic[1] = {
    multi: 0, modes: [
        [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ],
        [
            0, 0, 0,
            1, 1, 1,
            0, 0, 0
        ],
        [
            0, 0, 1,
            0, 1, 0,
            1, 0, 0
        ]]
};

Config.plogic[0] = {
    multi: 0, modes: [
        [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ],
        [
            0, 0, 0,
            1, 1, 1,
            0, 0, 0
        ],
        [
            0, 0, 1,
            0, 1, 0,
            1, 0, 0
        ]]
};


Config.plogic[6] = Config.plogic[1];


//共抽取20次5等奖2次4等奖，6次2等奖，1次一等奖，1次特等奖
//id表示奖项，t,表示重试的次数
//do 1 为自动下一轮,0为不自动
Config.roundDatas = [
    {"id": 5, "do": 1, "name": "五等奖第1批"},
    {"id": 5, "do": 1, "name": "五等奖第2批"},
    {"id": 5, "do": 1, "name": "五等奖第3批"},
    {"id": 5, "do": 1, "name": "五等奖第4批"},
    {"id": 5, "do": 0, "name": "五等奖第5批"},

    {"id": 5, "do": 1, "name": "五等奖第6批"},
    {"id": 5, "do": 1, "name": "五等奖第7批"},
    {"id": 5, "do": 1, "name": "五等奖第8批"},
    {"id": 5, "do": 1, "name": "五等奖第9批"},
    {"id": 5, "do": 0, "name": "五等奖第10批"},

    {"id": 5, "do": 1, "name": "五等奖第11批"},
    {"id": 5, "do": 1, "name": "五等奖第12批"},
    {"id": 5, "do": 1, "name": "五等奖第13批"},
    {"id": 5, "do": 1, "name": "五等奖第14批"},
    {"id": 5, "do": 0, "name": "五等奖第15批"},

    {"id": 5, "do": 1, "name": "五等奖第16批"},
    {"id": 5, "do": 1, "name": "五等奖第17批"},
    {"id": 5, "do": 1, "name": "五等奖第18批"},
    {"id": 5, "do": 1, "name": "五等奖第19批"},
    {"id": 5, "do": 0, "name": "五等奖第20批"},

    {"id": 4, "do": 0, "name": "四等奖第1批"},
    {"id": 4, "do": 0, "name": "四等奖第2批"},

    {"id": 3, "do": 0, "name": "三等奖第1批"},
    {"id": 3, "do": 0, "name": "三等奖第2批"},

    {"id": 2, "do": 0, "name": "二等奖第1个", "t": 1},
    {"id": 2, "do": 0, "name": "二等奖第2个", "t": 3},
    {"id": 2, "do": 0, "name": "二等奖第3个", "t": 4},
    {"id": 2, "do": 0, "name": "二等奖第4个", "t": 2},
    {"id": 2, "do": 0, "name": "二等奖第5个", "t": 1},
    {"id": 2, "do": 0, "name": "二等奖第6个", "t": 4},
    {"id": 1, "do": 0, "name": "一等奖", "t": 2},
    {"id": 0, "do": 0, "name": "特等奖", "t": 3},

    //补抽
    {"id": 6, "do": 0, "name": "补抽1"},
    {"id": 6, "do": 0, "name": "补抽2"},
    {"id": 6, "do": 0, "name": "补抽3"},
    {"id": 6, "do": 0, "name": "补抽4"},
    {"id": 6, "do": 0, "name": "补抽5"},
    {"id": 6, "do": 0, "name": "补抽6"},
    {"id": 6, "do": 0, "name": "补抽7"},
    {"id": 6, "do": 0, "name": "补抽8"},
    {"id": 6, "do": 0, "name": "补抽9"},
    {"id": 6, "do": 2, "name": "补抽10"}
];

Config.mustPrize = {}
Config.mustPrize[3] = {}