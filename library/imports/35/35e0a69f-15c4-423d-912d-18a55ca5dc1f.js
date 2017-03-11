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