var LightTestIdx = -1;

var LightTestDemo = cc.Layer.extend({
    _title:"",
    _subtitle:"",

    ctor:function () {
        this._super();
    },

    //
    // Menu
    //
    onEnter:function () {
        this._super();

        var label = new cc.LabelTTF(this._title, "Arial", 28);
        this.addChild(label, 100, BASE_TEST_TITLE_TAG);
        label.x = winSize.width / 2;
        label.y = winSize.height - 50;

        var label2 = new cc.LabelTTF(this._subtitle, "Thonburi", 16);
        this.addChild(label2, 101, BASE_TEST_SUBTITLE_TAG);
        label2.x = winSize.width / 2;
        label2.y = winSize.height - 80;

        var item1 = new cc.MenuItemImage(s_pathB1, s_pathB2, this.onBackCallback, this);
        var item2 = new cc.MenuItemImage(s_pathR1, s_pathR2, this.onRestartCallback, this);
        var item3 = new cc.MenuItemImage(s_pathF1, s_pathF2, this.onNextCallback, this);

        item1.tag = BASE_TEST_MENUITEM_PREV_TAG;
        item2.tag = BASE_TEST_MENUITEM_RESET_TAG;
        item3.tag = BASE_TEST_MENUITEM_NEXT_TAG;

        var menu = new cc.Menu(item1, item2, item3);

        menu.x = 0;
        menu.y = 0;
        var width = item2.width, height = item2.height;
        item1.x =  winSize.width/2 - width*2;
        item1.y = height/2 ;
        item2.x =  winSize.width/2;
        item2.y = height/2 ;
        item3.x =  winSize.width/2 + width*2;
        item3.y = height/2 ;

        this.addChild(menu, 102, BASE_TEST_MENU_TAG);
    },

    onRestartCallback:function (sender) {
        var s = new LightTestScene();
        s.addChild(restartLightTest());
        director.runScene(s);
    },

    onNextCallback:function (sender) {
        var s = new LightTestScene();
        s.addChild(nextLightTest());
        director.runScene(s);
    },

    onBackCallback:function (sender) {
        var s = new LightTestScene();
        s.addChild(previousLightTest());
        director.runScene(s);
    },
});

var LightTestScene = TestScene.extend({
    runThisTest:function (num) {
        LightTestIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextLightTest();
        this.addChild(layer);

        director.runScene(this);
    }
});

var LightTest = LightTestDemo.extend({
    _title:"Light Test",
    _subtitle:"",
    _ambientLight:null,
    _directionalLight:null,
    _pointLight:null,
    _spotLight:null,
    _ambientLightLabel:null,
    _directionalLightLabel:null,
    _pointLightLabel:null,
    _spotLightLabel:null,
    _angle:0,

    ctor:function(){
        this._super();

        this.addSprite();
        this.addLights();
        this.scheduleUpdate();

        var s = cc.winSize;
        var camera = cc.Camera.createPerspective(60, s.width/s.height, 1, 1000);
        camera.setCameraFlag(cc.CameraFlag.USER1);
        camera.setPosition3D({x:0, y:100, z:100});
        camera.lookAt({x:0, y:0, z:0}, {x:0, y:1, z:0});
        this.addChild(camera);

        this._ambientLightLabel = new cc.LabelTTF("Ambient Light ON", "Arial", 15);
        var item1 = new cc.MenuItemLabel(this._ambientLightLabel, this.switchLight, this);
        item1.setPosition(cc.p(100, 100 + item1.getContentSize().height * 8));
        item1.setUserData(cc.LightType.AMBIENT);

        this._directionalLightLabel = new cc.LabelTTF("Directional Light OFF", "Arial", 15);
        var item2 = new cc.MenuItemLabel(this._directionalLightLabel, this.switchLight, this);
        item2.setPosition(cc.p(100, 100 + item2.getContentSize().height * 6));
        item2.setUserData(cc.LightType.DIRECTIONAL);

        this._pointLightLabel = new cc.LabelTTF("Point Light OFF", "Arial", 15);
        var item3 = new cc.MenuItemLabel(this._pointLightLabel, this.switchLight, this);
        item3.setPosition(cc.p(100, 100 + item3.getContentSize().height * 4));
        item3.setUserData(cc.LightType.POINT);

        this._spotLightLabel = new cc.LabelTTF("Spot Light OFF", "Arial", 15);
        var item4 = new cc.MenuItemLabel(this._spotLightLabel, this.switchLight, this);
        item4.setPosition(cc.p(100, 100 + item4.getContentSize().height * 2));
        item4.setUserData(cc.LightType.SPOT);

        var menu = new cc.Menu(item1, item2, item3, item4);
        this.addChild(menu);
        menu.setPosition(cc.p(0, 0));

    },

    onExit:function(){
        this._super();
    },

    addSprite:function(){
        var s = cc.winSize;

        var orc = cc.Sprite3D.create("Sprite3DTest/orc.c3b");
        orc.setRotation3D({x:0, y:180, z:0});
        orc.setPosition(cc.p(0, 0));
        orc.setScale(2.0);
        var axe = cc.Sprite3D.create("Sprite3DTest/axe.c3b");
        orc.getAttachNode("Bip001 R Hand").addChild(axe);
        var animation = cc.Animation3D.create("Sprite3DTest/orc.c3b");
        if(animation){
            var animate = cc.Animate3D.create(animation);
            orc.runAction(cc.repeatForever(animate));
        }
        this.addChild(orc);
        orc.setCameraMask(2);

        var sphere1 = cc.Sprite3D.create("Sprite3DTest/sphere.c3b");
        sphere1.setPosition(cc.p(30, 0));
        this.addChild(sphere1);
        sphere1.setCameraMask(2);

        var sphere2 = cc.Sprite3D.create("Sprite3DTest/sphere.c3b");
        sphere2.setPosition(cc.p(-50, 0));
        sphere2.setScale(0.5);
        this.addChild(sphere2);
        sphere2.setCameraMask(2);

        var sphere3 = cc.Sprite3D.create("Sprite3DTest/sphere.c3b");
        sphere3.setPosition(cc.p(-30, 0));
        sphere3.setScale(0.5);
        this.addChild(sphere3);
        sphere3.setCameraMask(2);
    },

    addLights:function(){
        this._ambientLight = cc.AmbientLight.create(cc.color(200, 200, 200));
        this._ambientLight.retain();
        this._ambientLight.setEnabled(true);
        this.addChild(this._ambientLight);
        this._ambientLight.setCameraMask(2);

        this._directionalLight = cc.DirectionLight.create({x:-1, y:-1, z:0}, cc.color(200, 200, 200));
        this._directionalLight.retain();
        this._directionalLight.setEnabled(false);
        this.addChild(this._directionalLight);
        this._directionalLight.setCameraMask(2);

        this._pointLight = cc.PointLight.create({x:0, y:0, z:0}, cc.color(200, 200, 200), 10000);
        this._pointLight.retain();
        this._pointLight.setEnabled(false);
        this.addChild(this._pointLight);
        this._pointLight.setCameraMask(2);

        this._spotLight = cc.SpotLight.create({x:-1, y:-1, z:0}, {x:0, y:0, z:0}, cc.color(200, 200, 200), 0, 0.5, 10000);
        this._spotLight.retain();
        this._spotLight.setEnabled(false);
        this.addChild(this._spotLight);
        this._spotLight.setCameraMask(2);

        var seq1 = cc.sequence(cc.tintTo(4, 0, 0, 255), cc.tintTo(4, 0, 255, 0), cc.tintTo(4, 255, 0, 0), cc.tintTo(4, 255, 255, 255));
        this._ambientLight.runAction(seq1.repeatForever());

        var seq2 = cc.sequence(cc.tintTo(4, 255, 0, 0), cc.tintTo(4, 0, 255, 0), cc.tintTo(4, 0, 0, 255), cc.tintTo(4, 255, 255, 255));
        this._directionalLight.runAction(seq2.repeatForever());

        var seq3 = cc.sequence(cc.tintTo(4, 255, 0, 0), cc.tintTo(4, 0, 255, 0), cc.tintTo(4, 0, 0, 255), cc.tintTo(4, 255, 255, 255));
        this._pointLight.runAction(seq3.repeatForever());

        var seq4 = cc.sequence(cc.tintTo(4, 255, 0, 0), cc.tintTo(4, 0, 255, 0), cc.tintTo(4, 0, 0, 255), cc.tintTo(4, 255, 255, 255));
        this._spotLight.runAction(seq4.repeatForever());
    },

    update:function(dt){
        if(this._directionalLight)
            this._directionalLight.setRotation3D({x:-45, y:-cc.radiansToDegrees(this._angle), z:0});

        if(this._pointLight)
            this._pointLight.setPosition3D({x:100*Math.cos(this._angle+2*dt), y:100, z:100*Math.sin(this._angle+2*dt)});
        
        if(this._spotLight){
            this._spotLight.setPosition3D({x:100*Math.cos(this._angle+4*dt), y:100, z:100*Math.sin(this._angle+4*dt)});
            this._spotLight.setDirection({x:-Math.cos(this._angle + 4 * dt), y:-1, z:-Math.sin(this._angle + 4*dt)});
        }
    },

    switchLight:function(sender){
        var lightType = sender.getUserData();
        switch(lightType){
            case cc.LightType.AMBIENT:
                var isAmbientOn = !this._ambientLight.isEnabled();
                this._ambientLight.setEnabled(isAmbientOn);
                this._ambientLightLabel.setString("Ambient Light " + (isAmbientOn ? "ON" : "OFF"));
                break;

            case cc.LightType.DIRECTIONAL:
                var isDirectionalOn = !this._directionalLight.isEnabled();
                this._directionalLight.setEnabled(isDirectionalOn);
                this._directionalLightLabel.setString("Directional Light " + (isDirectionalOn ? "ON" : "OFF"));
                break;

            case cc.LightType.POINT:
                var isPointOn = !this._pointLight.isEnabled();
                this._pointLight.setEnabled(isPointOn);
                this._pointLightLabel.setString("Point Light " + (isPointOn ? "ON" : "OFF"));
                break;

            case cc.LightType.SPOT:
                var isSpotOn = !this._spotLight.isEnabled();
                this._spotLight.setEnabled(isSpotOn);
                this._spotLightLabel.setString("Spot Light " + (isSpotOn ? "ON" : "OFF"));
                break;

            default:
                break;
        }
    }
});

//
// Flow control
//
var arrayOfLightTest = [
    LightTest
];

var nextLightTest = function () {
    LightTestIdx++;
    LightTestIdx = LightTestIdx % arrayOfLightTest.length;

    if(window.sideIndexBar){
        LightTestIdx = window.sideIndexBar.changeTest(LightTestIdx, 36);
    }

    return new arrayOfLightTest[LightTestIdx ]();
};
var previousLightTest = function () {
    LightTestIdx--;
    if (LightTestIdx < 0)
        LightTestIdx += arrayOfLightTest.length;

    if(window.sideIndexBar){
        LightTestIdx = window.sideIndexBar.changeTest(LightTestIdx, 36);
    }

    return new arrayOfLightTest[LightTestIdx ]();
};
var restartLightTest = function () {
    return new arrayOfLightTest[LightTestIdx ]();
};
