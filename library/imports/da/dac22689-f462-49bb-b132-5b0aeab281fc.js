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