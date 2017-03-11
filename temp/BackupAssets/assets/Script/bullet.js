cc.Class({
    extends: cc.Component,

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
    onLoad: function () {
        this.enemy_set = cc.find("UI_ROOT").getComponent("game_scene").enemy_set;
        this.speed_x = 0;
        this.speed_y = 500;
    },
    
    hit_enemy_test: function(w_b_box, enemy_com) {
        if(enemy_com.status_state !== 0 ){
            return false;
        }
        
        var w_e_box = enemy_com.node.getBoundingBoxToWorld();
        return w_b_box.intersects(w_e_box);
    },
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
        var dx = this.speed_x * dt;
        var dy = this.speed_y * dt;
        this.node.x += dx;
        this.node.y += dy;
        
        
        if(this.node.y >= 310){
            this.node.removeFromParent();
            return;
        }
        
        var w_b_box = this.node.getBoundingBoxToWorld();
        
        for(var i = 0;i < this.enemy_set.length; i ++){
            var com = this.enemy_set[i].getComponent("enemy");
            if(this.hit_enemy_test(w_b_box,com)){
                com.on_bullet_hit();
                this.node.removeFromParent();
                return;
            }
        }
     },
});
