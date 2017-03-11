"use strict";
cc._RFpush(module, '781c7NcKqFHJ7PgHO1sLnbp', 'game_scene');
// Script\game_scene.js

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
        groups_prefabs: {
            type: cc.Prefab,
            "default": []
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.enemy_set = [];
        this._gen_random_groups();

        this.score_value = 0;
        this.score = this.node.getChildByName("score").getComponent(cc.Label);
        this.score.string = "" + this.score_value;
    },
    add_score: function add_score() {
        this.score_value++;
        this.score.string = "" + this.score_value;
    },
    remove_enemy: function remove_enemy(e) {
        var index = this.enemy_set.indexOf(e);
        if (index >= 0) {
            this.enemy_set.splice(index, 1);
        }
    },
    _gen_random_groups: function _gen_random_groups() {
        var g_type = Math.random() * this.groups_prefabs.length + 1;
        g_type = Math.floor(g_type);

        if (g_type >= this.groups_prefabs.length) {
            g_type = this.groups_prefabs.length;
        }
        var g = cc.instantiate(this.groups_prefabs[g_type - 1]);
        this.node.addChild(g);
        for (var i = 0; i < g.children.length; i++) {
            this.enemy_set.push(g.children[i]);
        }

        g.x = (Math.random() - 0.5) * 200;
        g.y = Math.random() * 100 + 500;
        this.scheduleOnce(this._gen_random_groups.bind(this), Math.random() * 3 + 2);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();