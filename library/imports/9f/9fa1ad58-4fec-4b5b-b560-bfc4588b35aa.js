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