"use strict";
cc._RFpush(module, '3ab59vJ4QZNZJ61YSzIKvWa', 'home_scene');
// Script\home_scene.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.started = false;
    },
    on_start_click: function on_start_click() {
        if (this.startd === true) {
            return;
        }
        this.started = true;
        cc.director.loadScene("game_scene");
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();