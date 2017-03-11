require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"bullet":[function(require,module,exports){
"use strict";
cc._RFpush(module, '568746vKitKsozIv+Lu1U0q', 'bullet');
// Script\bullet.js

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
        this.enemy_set = cc.find("UI_ROOT").getComponent("game_scene").enemy_set;
        this.speed_x = 0;
        this.speed_y = 500;
    },

    hit_enemy_test: function hit_enemy_test(w_b_box, enemy_com) {
        if (enemy_com.status_state !== 0) {
            return false;
        }

        var w_e_box = enemy_com.node.getBoundingBoxToWorld();
        return w_b_box.intersects(w_e_box);
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var dx = this.speed_x * dt;
        var dy = this.speed_y * dt;
        this.node.x += dx;
        this.node.y += dy;

        if (this.node.y >= 310) {
            this.node.removeFromParent();
            return;
        }

        var w_b_box = this.node.getBoundingBoxToWorld();

        for (var i = 0; i < this.enemy_set.length; i++) {
            var com = this.enemy_set[i].getComponent("enemy");
            if (this.hit_enemy_test(w_b_box, com)) {
                com.on_bullet_hit();
                this.node.removeFromParent();
                return;
            }
        }
    }
});

cc._RFpop();
},{}],"enemy":[function(require,module,exports){
"use strict";
cc._RFpush(module, '35e0aafFcRCPZEtGKVcpdwf', 'enemy');
// Script\enemy.js

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
        bomb_anim: {
            type: cc.SpriteFrame,
            "default": []
        },
        bomb_anim_duration: 0.1,
        enemy_skin: {
            type: cc.SpriteFrame,
            "default": []
        },
        player_path: "UI_ROOT/player"
    },
    //enemy.js负责控制敌机的行为，敌机的行为包括：（1）移动（2）爆炸
    //（3）控制敌机的外形[因为使用preflab资源制作敌机，那么久需要在脚本里面控制敌机的皮肤变化]
    // use this for initialization
    onLoad: function onLoad() {
        this.player = cc.find(this.player_path);
        this.anim = this.node.getChildByName("anim");
        this.anim_com = this.anim.addComponent("frame_anim");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");

        this.speed_x = 0;
        this.speed_y = -200;

        this.status_state = 0;
    },
    start: function start() {
        this._set_enemy_idle();
    },
    _set_enemy_idle: function _set_enemy_idle() {
        var skin_type = Math.random() * 9 + 1;
        skin_type = Math.floor(skin_type);
        if (skin_type >= 10) {
            skin_type = 9;
        }
        //this.anim.spriteFrame = this.enemy_skin[skin_type - 1];
        this.anim.getComponent(cc.Sprite).spriteFrame = this.enemy_skin[skin_type - 1];
    },
    _play_bomb_anim: function _play_bomb_anim() {
        this.anim_com.sprite_frames = this.bomb_anim;
        this.anim_com.duration = this.bomb_anim_duration;
        this.anim_com.play_once((function () {
            this.remove_enemy();
        }).bind(this));
    },

    on_bullet_hit: function on_bullet_hit() {
        if (this.status_state !== 0) {
            return;
        }
        this.game_scene.add_score();
        this.status_state = 1;
        this._play_bomb_anim();
    },
    remove_enemy: function remove_enemy() {
        this.game_scene.remove_enemy(this.node);
        this.node.removeFromParent();
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var dx = this.speed_x * dt;
        var dy = this.speed_y * dt;
        this.node.x += dx;
        this.node.y += dy;

        if (this.status_state === 1) {
            return;
        }

        var w_player_box = this.player.getBoundingBoxToWorld();
        var w_enemy_box = this.node.getBoundingBoxToWorld();
        if (w_enemy_box.intersects(w_player_box)) {
            var player_com = this.player.getComponent("player");
            player_com.on_hit_enemy();
        }

        var w_pos = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        if (w_pos.x < -100 || w_pos.x > 500 || w_pos.y < -100) {
            this.remove_enemy();
        }
    }
});

cc._RFpop();
},{}],"frame_anim":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fc828ObMtVBaLSu7vjBu+6v', 'frame_anim');
// Script\frame_anim.js

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
        sprite_frames: {
            "default": [],
            type: cc.SpriteFrame
        },

        duration: 0.1, // 帧的时间间隔
        loop: false, // 是否循环播放
        play_onload: false },

    // 是否在组件加载的时候播放;
    // use this for initialization
    onLoad: function onLoad() {
        // 判断一下在组件所挂在的节点上面有没有cc.Sprite组件；
        var s_com = this.node.getComponent(cc.Sprite);
        if (!s_com) {
            // 没有cc.Sprite组件，要显示图片一定要有cc.Sprite组件,所以我们添加一个cc.Sprite组件;
            s_com = this.node.addComponent(cc.Sprite);
        }
        this.sprite = s_com; // 精灵组件
        // end
        this.is_playing = false; // 是否正在播放;
        this.play_time = 0;
        this.is_loop = false;
        this.end_func = null;

        // 显示第0个frame;
        if (this.play_onload) {
            this.sprite.spriteFrame = this.sprite_frames[0];
            if (!this.loop) {
                this.play_once(null);
            } else {
                this.play_loop();
            }
        }
    },

    // 实现播放一次,
    play_once: function play_once(end_func) {
        this.play_time = 0;
        this.is_playing = true;
        this.is_loop = false;
        this.end_func = end_func;
    },
    // end

    // 实现循环播放
    play_loop: function play_loop() {
        this.play_time = 0;
        this.is_playing = true;
        this.is_loop = true;
    },
    // end

    stop_anim: function stop_anim() {
        this.play_time = 0;
        this.is_playing = false;
        this.is_loop = false;
    },

    start: function start() {},

    // called every frame, uncomment this function to activate update callback
    // 每一次刷新的时候需要调用的函数，dt距离上一次刷新过去的时间;
    update: function update(dt) {
        if (this.is_playing === false) {
            // 没有启动播放，不做处理
            return;
        }

        this.play_time += dt; // 累积我们播放的时间;

        // 计算时间，应当播放第几帧，而不是随便的下一帧，
        // 否则的话，同样的动画1, 60帧，你在30FPS的机器上你会播放2秒，
        // 你在60FPS的机器上你会播放1秒，动画就不同步;

        var index = Math.floor(this.play_time / this.duration); // 向下取整数
        // index
        if (this.is_loop === false) {
            // 播放一次
            if (index >= this.sprite_frames.length) {
                // 非循环播放结束
                // 精灵显示的是最后一帧;
                this.sprite.spriteFrame = this.sprite_frames[this.sprite_frames.length - 1];
                // end
                this.is_playing = false;
                this.play_time = 0;
                if (this.end_func) {
                    // 调用回掉函数
                    this.end_func();
                }
                return;
            } else {
                this.sprite.spriteFrame = this.sprite_frames[index];
            }
        } else {
            // 循环播放;

            while (index >= this.sprite_frames.length) {
                index -= this.sprite_frames.length;
                this.play_time -= this.duration * this.sprite_frames.length;
            }

            //  在合法的范围之内
            this.sprite.spriteFrame = this.sprite_frames[index];
            // end
        }
    }
});

cc._RFpop();
},{}],"game_scene":[function(require,module,exports){
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
},{}],"home_scene":[function(require,module,exports){
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
},{}],"player":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9fa1a1YT+xLW7Vgv8RYizWq', 'player');
// Script\player.js

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
        bomb_anim: {
            type: cc.SpriteFrame,
            "default": []
        },
        bomb_anim_duration: 0.1,

        plane_idle: {
            type: cc.SpriteFrame,
            "default": null
        },
        bullet_prefab: {
            type: cc.Prefab,
            "default": null
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.anim_com = this.anim.addComponent("frame_anim");

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (function (t) {
            var offset = t.getDelta();
            this.node.x += offset.x;
            this.node.y += offset.y;
        }).bind(this), this.node);
        //test
        //this._play_bomb_anim();
        //end
        this.status_state = 0;

        this.schedule(this.shoot_bullet.bind(this), 0.2);
    },
    shoot_bullet: function shoot_bullet() {
        if (this.status_state === 1) {
            return;
        }

        var bullet = cc.instantiate(this.bullet_prefab);
        this.node.parent.addChild(bullet);
        bullet.x = this.node.x;
        bullet.y = this.node.y;

        bullet.setLocalZOrder(-1000);
    },
    _play_bomb_anim: function _play_bomb_anim() {
        this.anim_com.sprite_frames = this.bomb_anim;
        this.anim_com.duraion = this.bomb_anim_duration;
        this.anim_com.play_once(this.new_life.bind(this));
    },
    on_hit_enemy: function on_hit_enemy() {
        if (this.status_state !== 0) {
            return;
        }
        this.status_state = 1;
        this._play_bomb_anim();
    },

    new_life: function new_life() {
        this.anim.scale = 0;
        this.scheduleOnce((function () {
            this.anim.scale = 1;
            this.status_state = 2;
            this.anim.getComponent(cc.Sprite).spriteFrame = this.plane_idle;
            var seq = cc.sequence([cc.fadeTo(0.1, 128), cc.fadeTo(0.1, 255)]);
            var rf = cc.repeatForever(seq);
            this.anim.runAction(rf);
        }).bind(this), 1);

        this.scheduleOnce((function () {
            this.status_state = 0;
            this.anim.opacity = 255;
            this.anim.stopAllActions();
        }).bind(this), 3);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"star_sky":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dac22aJ9GJJu7EyWwrqsoH8', 'star_sky');
// Script\star_sky.js

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
        this.bg_1 = this.node.getChildByName("bg_1");
        this.bg_2 = this.node.getChildByName("bg_2");

        this.speed = -100;

        this.bottom_bg = this.bg_1;
        this.node.setLocalZOrder(-2000);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var s = dt * this.speed;
        this.bg_1.y += s;
        this.bg_2.y += s;

        if (this.bottom_bg.y <= -1699) {
            if (this.bottom_bg == this.bg_1) {
                this.bg_1.y = this.bg_2.y + 1369;
                this.bottom_bg = this.bg_2;
            } else {
                this.bg_2.y = this.bg_1.y + 1369;
                this.bottom_bg = this.bg_1;
            }
        }
    }
});

cc._RFpop();
},{}]},{},["bullet","enemy","frame_anim","game_scene","home_scene","player","star_sky"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9TY3JpcHQvYnVsbGV0LmpzIiwiYXNzZXRzL1NjcmlwdC9lbmVteS5qcyIsImFzc2V0cy9TY3JpcHQvZnJhbWVfYW5pbS5qcyIsImFzc2V0cy9TY3JpcHQvZ2FtZV9zY2VuZS5qcyIsImFzc2V0cy9TY3JpcHQvaG9tZV9zY2VuZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxheWVyLmpzIiwiYXNzZXRzL1NjcmlwdC9zdGFyX3NreS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ1o7QUFDQTtBQUNRO0FBQ0E7QUFDUjtBQUNBO0FBQ0s7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBRVE7QUFDSTtBQUNBO0FBQVo7QUFDQTtBQUVRO0FBQVI7QUFFUTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ1E7QUFDQTtBQUNSO0FBQ1E7QUFDUjtBQUVJO0FBQ0k7QUFBUjtBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFBWjtBQUNBO0FBRVE7QUFBUjtBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFBWjtBQUNBO0FBQ0E7QUFFSTtBQUNFO0FBQ0k7QUFBVjtBQUVNO0FBQ0E7QUFDQTtBQUFOO0FBRUk7QUFDSTtBQUNBO0FBQVI7QUFDQTtBQUdJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFEUjtBQUdRO0FBQ0k7QUFEWjtBQUNBO0FBR1E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQURaO0FBQ0E7QUFHUTtBQUNBO0FBQ0k7QUFEWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ1E7QUFDQTtBQUNBO0FBQ1I7QUFDQTtBQUNBO0FBQ0k7QUFDSjtBQUNRO0FBQ0E7QUFDUjtBQUFZO0FBRVo7QUFBUTtBQUVSO0FBQVE7QUFDQTtBQUNBO0FBQ0E7QUFFUjtBQUNBO0FBQVE7QUFDSztBQUNEO0FBQ0k7QUFFaEI7QUFDZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ1I7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSjtBQUNBO0FBQ0E7QUFHSTtBQUNJO0FBRFI7QUFFWTtBQUFaO0FBQ0E7QUFJUTtBQUZSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJUTtBQUZSO0FBSVE7QUFGUjtBQUdZO0FBRFo7QUFDQTtBQUVnQjtBQUFoQjtBQUVnQjtBQUNBO0FBQ0E7QUFBaEI7QUFDb0I7QUFDcEI7QUFDZ0I7QUFDaEI7QUFFZ0I7QUFBaEI7QUFDQTtBQUNBO0FBQ0E7QUFFWTtBQUNJO0FBQ0E7QUFBaEI7QUFDQTtBQUNBO0FBRVk7QUFBWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDUTtBQUNBO0FBQ0E7QUFDUjtBQUNJO0FBQ0k7QUFDQTtBQUNSO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDWjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDUTtBQUNJO0FBQ1o7QUFDUTtBQUNBO0FBQ0E7QUFDSTtBQUNaO0FBQ0E7QUFDUTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0k7QUFDWjtBQUNRO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ1I7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDUTtBQUNJO0FBQ0E7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFFSTtBQUNJO0FBQ0k7QUFBWjtBQUNBO0FBRVE7QUFDQTtBQUNBO0FBQ0E7QUFBUjtBQUVRO0FBQVI7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUFSO0FBRUk7QUFDSTtBQUNJO0FBQVo7QUFFUTtBQUNBO0FBQVI7QUFDQTtBQUVJO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFaO0FBQ0E7QUFFUTtBQUNJO0FBQ0E7QUFDQTtBQUFaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDUTtBQUNSO0FBQ1E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNLO0FBQ0c7QUFDQTtBQUNBO0FBQ1I7QUFDUTtBQUNJO0FBQ0k7QUFDQTtBQUNoQjtBQUVnQjtBQUNBO0FBQWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW5lbXlfc2V0ID0gY2MuZmluZChcIlVJX1JPT1RcIikuZ2V0Q29tcG9uZW50KFwiZ2FtZV9zY2VuZVwiKS5lbmVteV9zZXQ7XHJcbiAgICAgICAgdGhpcy5zcGVlZF94ID0gMDtcclxuICAgICAgICB0aGlzLnNwZWVkX3kgPSA1MDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBoaXRfZW5lbXlfdGVzdDogZnVuY3Rpb24od19iX2JveCwgZW5lbXlfY29tKSB7XHJcbiAgICAgICAgaWYoZW5lbXlfY29tLnN0YXR1c19zdGF0ZSAhPT0gMCApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3X2VfYm94ID0gZW5lbXlfY29tLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XHJcbiAgICAgICAgcmV0dXJuIHdfYl9ib3guaW50ZXJzZWN0cyh3X2VfYm94KTtcclxuICAgIH0sXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdmFyIGR4ID0gdGhpcy5zcGVlZF94ICogZHQ7XHJcbiAgICAgICAgdmFyIGR5ID0gdGhpcy5zcGVlZF95ICogZHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggKz0gZHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gZHk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5ub2RlLnkgPj0gMzEwKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgd19iX2JveCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCB0aGlzLmVuZW15X3NldC5sZW5ndGg7IGkgKyspe1xyXG4gICAgICAgICAgICB2YXIgY29tID0gdGhpcy5lbmVteV9zZXRbaV0uZ2V0Q29tcG9uZW50KFwiZW5lbXlcIik7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaGl0X2VuZW15X3Rlc3Qod19iX2JveCxjb20pKXtcclxuICAgICAgICAgICAgICAgIGNvbS5vbl9idWxsZXRfaGl0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgYm9tYl9hbmltOntcclxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICAgICAgZGVmYXVsdDpbXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvbWJfYW5pbV9kdXJhdGlvbjowLjEsXHJcbiAgICAgICAgZW5lbXlfc2tpbjp7XHJcbiAgICAgICAgICAgIHR5cGU6Y2MuU3ByaXRlRnJhbWUsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbGF5ZXJfcGF0aDpcIlVJX1JPT1QvcGxheWVyXCIsXHJcbiAgICB9LFxyXG4gICAgLy9lbmVteS5qc+i0n+i0o+aOp+WItuaVjOacuueahOihjOS4uu+8jOaVjOacuueahOihjOS4uuWMheaLrO+8mu+8iDHvvInnp7vliqjvvIgy77yJ54iG54K4XHJcbiAgICAvL++8iDPvvInmjqfliLbmlYzmnLrnmoTlpJblvaJb5Zug5Li65L2/55SocHJlZmxhYui1hOa6kOWItuS9nOaVjOacuu+8jOmCo+S5iOS5hemcgOimgeWcqOiEmuacrOmHjOmdouaOp+WItuaVjOacuueahOearuiCpOWPmOWMll1cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBjYy5maW5kKHRoaXMucGxheWVyX3BhdGgpO1xyXG4gICAgICAgIHRoaXMuYW5pbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImFuaW1cIik7XHJcbiAgICAgICAgdGhpcy5hbmltX2NvbSA9IHRoaXMuYW5pbS5hZGRDb21wb25lbnQoXCJmcmFtZV9hbmltXCIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZV9zY2VuZSA9IGNjLmZpbmQoXCJVSV9ST09UXCIpLmdldENvbXBvbmVudChcImdhbWVfc2NlbmVcIik7XHJcbiAgICAgIFxyXG4gICAgICAgIHRoaXMuc3BlZWRfeCA9IDA7XHJcbiAgICAgICAgdGhpcy5zcGVlZF95ID0gLTIwMDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXR1c19zdGF0ZSA9IDA7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgc3RhcnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLl9zZXRfZW5lbXlfaWRsZSgpO1xyXG4gICAgfSxcclxuICAgIF9zZXRfZW5lbXlfaWRsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBza2luX3R5cGUgPSBNYXRoLnJhbmRvbSgpICogOSArIDE7XHJcbiAgICAgICAgc2tpbl90eXBlID0gTWF0aC5mbG9vcihza2luX3R5cGUpO1xyXG4gICAgICAgIGlmKHNraW5fdHlwZSA+PSAxMCApe1xyXG4gICAgICAgICAgICBza2luX3R5cGUgPSA5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3RoaXMuYW5pbS5zcHJpdGVGcmFtZSA9IHRoaXMuZW5lbXlfc2tpbltza2luX3R5cGUgLSAxXTtcclxuICAgICAgICB0aGlzLmFuaW0uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmVuZW15X3NraW5bc2tpbl90eXBlIC0gMV07XHJcbiAgICB9LFxyXG4gICAgX3BsYXlfYm9tYl9hbmltOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hbmltX2NvbS5zcHJpdGVfZnJhbWVzID0gdGhpcy5ib21iX2FuaW07XHJcbiAgICAgICAgdGhpcy5hbmltX2NvbS5kdXJhdGlvbiA9IHRoaXMuYm9tYl9hbmltX2R1cmF0aW9uO1xyXG4gICAgICAgIHRoaXMuYW5pbV9jb20ucGxheV9vbmNlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlX2VuZW15KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uX2J1bGxldF9oaXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcy5zdGF0dXNfc3RhdGUgIT09MCApe1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9ICBcclxuICAgICAgdGhpcy5nYW1lX3NjZW5lLmFkZF9zY29yZSgpO1xyXG4gICAgICB0aGlzLnN0YXR1c19zdGF0ZSA9IDE7XHJcbiAgICAgIHRoaXMuX3BsYXlfYm9tYl9hbmltKCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlX2VuZW15OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5nYW1lX3NjZW5lLnJlbW92ZV9lbmVteSh0aGlzLm5vZGUpO1xyXG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdmFyIGR4ID0gdGhpcy5zcGVlZF94ICogZHQ7XHJcbiAgICAgICAgdmFyIGR5ID0gdGhpcy5zcGVlZF95ICogZHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggKz0gZHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gZHk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5zdGF0dXNfc3RhdGUgPT09MSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3X3BsYXllcl9ib3ggPSB0aGlzLnBsYXllci5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcclxuICAgICAgICB2YXIgd19lbmVteV9ib3ggPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XHJcbiAgICAgICAgaWYod19lbmVteV9ib3guaW50ZXJzZWN0cyh3X3BsYXllcl9ib3gpKXtcclxuICAgICAgICAgICAgdmFyIHBsYXllcl9jb20gPSB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgICAgIHBsYXllcl9jb20ub25faGl0X2VuZW15KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3X3BvcyA9IHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MucCgwLDApKTtcclxuICAgICAgICBpZih3X3Bvcy54IDwgLTEwMCB8fCB3X3Bvcy54ID4gNTAwIHx8IHdfcG9zLnkgPCAtMTAwKXtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVfZW5lbXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG59KTtcclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgICAgIHNwcml0ZV9mcmFtZXMgOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjEsIC8vIOW4p+eahOaXtumXtOmXtOmalFxyXG4gICAgICAgIGxvb3A6IGZhbHNlLCAvLyDmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAgICBwbGF5X29ubG9hZDogZmFsc2UsIC8vIOaYr+WQpuWcqOe7hOS7tuWKoOi9veeahOaXtuWAmeaSreaUvjtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDliKTmlq3kuIDkuIvlnKjnu4Tku7bmiYDmjILlnKjnmoToioLngrnkuIrpnaLmnInmsqHmnIljYy5TcHJpdGXnu4Tku7bvvJtcclxuICAgICAgICB2YXIgc19jb20gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XHJcbiAgICAgICAgaWYgKCFzX2NvbSkgeyAvLyDmsqHmnIljYy5TcHJpdGXnu4Tku7bvvIzopoHmmL7npLrlm77niYfkuIDlrpropoHmnIljYy5TcHJpdGXnu4Tku7Ys5omA5Lul5oiR5Lus5re75Yqg5LiA5LiqY2MuU3ByaXRl57uE5Lu2O1xyXG4gICAgICAgICAgICBzX2NvbSA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzX2NvbTsgLy8g57K+54G157uE5Lu2XHJcbiAgICAgICAgLy8gZW5kIFxyXG4gICAgICAgIHRoaXMuaXNfcGxheWluZyA9IGZhbHNlOyAvLyDmmK/lkKbmraPlnKjmkq3mlL47XHJcbiAgICAgICAgdGhpcy5wbGF5X3RpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNfbG9vcCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZW5kX2Z1bmMgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOaYvuekuuesrDDkuKpmcmFtZTtcclxuICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZCkge1xyXG4gICAgICAgICAgICAgdGhpcy5zcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLnNwcml0ZV9mcmFtZXNbMF07XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlfb25jZShudWxsKTsgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlfbG9vcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8g5a6e546w5pKt5pS+5LiA5qyhLFxyXG4gICAgcGxheV9vbmNlOiBmdW5jdGlvbihlbmRfZnVuYykge1xyXG4gICAgICAgIHRoaXMucGxheV90aW1lID0gMDtcclxuICAgICAgICB0aGlzLmlzX3BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNfbG9vcCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZW5kX2Z1bmMgPSBlbmRfZnVuYztcclxuICAgIH0sIFxyXG4gICAgLy8gZW5kIFxyXG4gICAgXHJcbiAgICAvLyDlrp7njrDlvqrnjq/mkq3mlL5cclxuICAgIHBsYXlfbG9vcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5X3RpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNfcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc19sb29wID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICAvLyBlbmQgXHJcbiAgICBcclxuICAgIHN0b3BfYW5pbTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5X3RpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNfbG9vcCA9IGZhbHNlO1xyXG4gICAgfSwgXHJcbiAgICBcclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyDmr4/kuIDmrKHliLfmlrDnmoTml7blgJnpnIDopoHosIPnlKjnmoTlh73mlbDvvIxkdOi3neemu+S4iuS4gOasoeWIt+aWsOi/h+WOu+eahOaXtumXtDtcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNfcGxheWluZyA9PT0gZmFsc2UpIHsgLy8g5rKh5pyJ5ZCv5Yqo5pKt5pS+77yM5LiN5YGa5aSE55CGXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5X3RpbWUgKz0gZHQ7IC8vIOe0r+enr+aIkeS7rOaSreaUvueahOaXtumXtDtcclxuICAgICAgICBcclxuICAgICAgIC8vIOiuoeeul+aXtumXtO+8jOW6lOW9k+aSreaUvuesrOWHoOW4p++8jOiAjOS4jeaYr+maj+S+v+eahOS4i+S4gOW4p++8jFxyXG4gICAgICAgLy8g5ZCm5YiZ55qE6K+d77yM5ZCM5qC355qE5Yqo55S7MSwgNjDluKfvvIzkvaDlnKgzMEZQU+eahOacuuWZqOS4iuS9oOS8muaSreaUvjLnp5LvvIxcclxuICAgICAgIC8vIOS9oOWcqDYwRlBT55qE5py65Zmo5LiK5L2g5Lya5pKt5pS+Meenku+8jOWKqOeUu+WwseS4jeWQjOatpTtcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IodGhpcy5wbGF5X3RpbWUgLyB0aGlzLmR1cmF0aW9uKTsgLy8g5ZCR5LiL5Y+W5pW05pWwXHJcbiAgICAgICAgLy8gaW5kZXhcclxuICAgICAgICBpZiAodGhpcy5pc19sb29wID09PSBmYWxzZSkgeyAvLyDmkq3mlL7kuIDmrKFcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuc3ByaXRlX2ZyYW1lcy5sZW5ndGgpIHsgLy8g6Z2e5b6q546v5pKt5pS+57uT5p2fXHJcbiAgICAgICAgICAgICAgICAvLyDnsr7ngbXmmL7npLrnmoTmmK/mnIDlkI7kuIDluKc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlX2ZyYW1lc1t0aGlzLnNwcml0ZV9mcmFtZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAvLyBlbmQgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzX3BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheV90aW1lID0gMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuZF9mdW5jKSB7IC8vIOiwg+eUqOWbnuaOieWHveaVsFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kX2Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5zcHJpdGVfZnJhbWVzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgLy8g5b6q546v5pKt5pS+O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IHRoaXMuc3ByaXRlX2ZyYW1lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4IC09IHRoaXMuc3ByaXRlX2ZyYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlfdGltZSAtPSAodGhpcy5kdXJhdGlvbiAqIHRoaXMuc3ByaXRlX2ZyYW1lcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyAg5Zyo5ZCI5rOV55qE6IyD5Zu05LmL5YaFXHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5zcHJpdGVfZnJhbWVzW2luZGV4XTtcclxuICAgICAgICAgICAgLy8gZW5kIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgZ3JvdXBzX3ByZWZhYnM6e1xyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICAgICAgZGVmYXVsdDpbXSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW5lbXlfc2V0ID0gW107XHJcbiAgICAgICAgdGhpcy5fZ2VuX3JhbmRvbV9ncm91cHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNjb3JlX3ZhbHVlID0gMDtcclxuICAgICAgICB0aGlzLnNjb3JlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwic2NvcmVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcclxuICAgICAgICB0aGlzLnNjb3JlLnN0cmluZyA9IFwiXCIgKyB0aGlzLnNjb3JlX3ZhbHVlO1xyXG4gICAgfSxcclxuICAgIGFkZF9zY29yZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuc2NvcmVfdmFsdWUgKys7XHJcbiAgICAgICAgdGhpcy5zY29yZS5zdHJpbmcgPSBcIlwiICsgdGhpcy5zY29yZV92YWx1ZTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVfZW5lbXk6ZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbmVteV9zZXQuaW5kZXhPZihlKTtcclxuICAgICAgICBpZihpbmRleCA+PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5lbmVteV9zZXQuc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfZ2VuX3JhbmRvbV9ncm91cHM6ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgZ190eXBlID0gTWF0aC5yYW5kb20oKSAqIHRoaXMuZ3JvdXBzX3ByZWZhYnMubGVuZ3RoICsgMTtcclxuICAgICAgICBnX3R5cGUgPSBNYXRoLmZsb29yKGdfdHlwZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZ190eXBlID49IHRoaXMuZ3JvdXBzX3ByZWZhYnMubGVuZ3RoKXtcclxuICAgICAgICAgICAgZ190eXBlID0gdGhpcy5ncm91cHNfcHJlZmFicy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnID0gY2MuaW5zdGFudGlhdGUodGhpcy5ncm91cHNfcHJlZmFic1tnX3R5cGUgLSAxXSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGcpO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBnLmNoaWxkcmVuLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICB0aGlzLmVuZW15X3NldC5wdXNoKGcuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnLnggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyMDA7XHJcbiAgICAgICAgZy55ID0gKE1hdGgucmFuZG9tKCkpICogMTAwICsgNTAwO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX2dlbl9yYW5kb21fZ3JvdXBzLmJpbmQodGhpcyksTWF0aC5yYW5kb20oKSAqIDMgKyAyKTtcclxuICAgIH1cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgb25fc3RhcnRfY2xpY2s6ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZih0aGlzLnN0YXJ0ZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lX3NjZW5lXCIpO1xyXG4gICAgfVxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBib21iX2FuaW06e1xyXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZUZyYW1lLFxyXG4gICAgICAgICAgICBkZWZhdWx0OltdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9tYl9hbmltX2R1cmF0aW9uOjAuMSxcclxuICAgICAgICBcclxuICAgICAgICBwbGFuZV9pZGxlOntcclxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYnVsbGV0X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmFuaW0gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJhbmltXCIpO1xyXG4gICAgICAgIHRoaXMuYW5pbV9jb20gPSB0aGlzLmFuaW0uYWRkQ29tcG9uZW50KFwiZnJhbWVfYW5pbVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSxmdW5jdGlvbih0KXtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHQuZ2V0RGVsdGEoKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggKz0gb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55ICs9IG9mZnNldC55O1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSx0aGlzLm5vZGUpO1xyXG4gICAgICAgIC8vdGVzdFxyXG4gICAgICAgIC8vdGhpcy5fcGxheV9ib21iX2FuaW0oKTtcclxuICAgICAgICAvL2VuZFxyXG4gICAgICAgIHRoaXMuc3RhdHVzX3N0YXRlID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuc2hvb3RfYnVsbGV0LmJpbmQodGhpcyksMC4yKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBzaG9vdF9idWxsZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZih0aGlzLnN0YXR1c19zdGF0ZSA9PT0gMSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGJ1bGxldCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYnVsbGV0X3ByZWZhYik7XHJcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5hZGRDaGlsZChidWxsZXQpO1xyXG4gICAgICAgIGJ1bGxldC54ID0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgYnVsbGV0LnkgPSB0aGlzLm5vZGUueTtcclxuICAgICAgICBcclxuICAgICAgICBidWxsZXQuc2V0TG9jYWxaT3JkZXIoLTEwMDApO1xyXG4gICAgfSxcclxuICAgIF9wbGF5X2JvbWJfYW5pbTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuYW5pbV9jb20uc3ByaXRlX2ZyYW1lcyA9IHRoaXMuYm9tYl9hbmltO1xyXG4gICAgICAgIHRoaXMuYW5pbV9jb20uZHVyYWlvbiA9IHRoaXMuYm9tYl9hbmltX2R1cmF0aW9uO1xyXG4gICAgICAgIHRoaXMuYW5pbV9jb20ucGxheV9vbmNlKHRoaXMubmV3X2xpZmUuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG4gICAgb25faGl0X2VuZW15OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0dXNfc3RhdGUgIT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdHVzX3N0YXRlID0gMTtcclxuICAgICAgICB0aGlzLl9wbGF5X2JvbWJfYW5pbSgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgbmV3X2xpZmU6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmFuaW0uc2NhbGUgPSAwO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW0uc2NhbGUgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1c19zdGF0ZSA9IDI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMucGxhbmVfaWRsZTtcclxuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtjYy5mYWRlVG8oMC4xLDEyOCksY2MuZmFkZVRvKDAuMSwgMjU1KV0pO1xyXG4gICAgICAgICAgICB2YXIgcmYgPSBjYy5yZXBlYXRGb3JldmVyKHNlcSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbS5ydW5BY3Rpb24ocmYpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSwxKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1c19zdGF0ZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbS5vcGFjaXR5ID0gMjU1O1xyXG4gICAgICAgICAgICB0aGlzLmFuaW0uc3RvcEFsbEFjdGlvbnMoKTtcclxuICAgICAgICB9LmJpbmQodGhpcyksMyk7XHJcbiAgICB9LFxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmJnXzEgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJiZ18xXCIpO1xyXG4gICAgICAgIHRoaXMuYmdfMiA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJnXzJcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IC0xMDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ib3R0b21fYmcgPSB0aGlzLmJnXzE7XHJcbiAgICAgICAgdGhpcy5ub2RlLnNldExvY2FsWk9yZGVyKC0yMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBzID0gZHQgKiB0aGlzLnNwZWVkO1xyXG4gICAgICAgIHRoaXMuYmdfMS55ICs9IHM7XHJcbiAgICAgICAgdGhpcy5iZ18yLnkgKz0gcztcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmJvdHRvbV9iZy55IDw9IC0xNjk5KXtcclxuICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fYmcgPT0gdGhpcy5iZ18xKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmdfMS55ID0gdGhpcy5iZ18yLnkgKyAxMzY5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3R0b21fYmcgPSB0aGlzLmJnXzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmdfMi55ID0gdGhpcy5iZ18xLnkgKyAxMzY5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3R0b21fYmcgPSB0aGlzLmJnXzE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgfSxcclxufSk7XHJcbiJdfQ==