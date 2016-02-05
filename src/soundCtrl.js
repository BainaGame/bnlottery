/**
 * Created by wyang on 16/1/14.
 * 声音控制
 */

var SoundCtrl = {};

SoundCtrl.playBet = function(){

    cc.audioEngine.playEffect(res.sound_rollslot_bet,false);
}

SoundCtrl.playRoll = function(){

    cc.audioEngine.playEffect(res.sound_rollslot_roll,false);
}

SoundCtrl.playMusic = function(){
    cc.audioEngine.playMusic(res.sound_music_main,true);
}
