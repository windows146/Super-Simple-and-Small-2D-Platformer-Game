/*
 * Super Simple and Small 2D Platformer Game
 */
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "phaser", { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('block', 'assets/placeholder.png'); // will use for the player object
        this.game.load.image('logo', 'assets/pantsuweb2.png');
        // loading tilemap stuff
        this.game.load.tilemap("tilemap", "assets/levels/level1.json", null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet("tiles", "assets/levels/spritesheet.png", 32, 32); // tile spritesheet 
        // load sprites for the onscreen controller
        this.game.load.image("aButton", "assets/controls/abutton.png");
        this.game.load.image("leftButton", "assets/controls/leftarrow.png");
        this.game.load.image("rightButton", "assets/controls/rightarrow.png");
    };
    SimpleGame.prototype.create = function () {
        var _this = this;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // will set it to RESIZE later for responsiveness
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // add red block to represent player
        this.block = this.game.add.sprite(0, 0, "block");
        this.block.width = 32;
        this.block.height = 32;
        this.game.physics.arcade.enable(this.block);
        this.block.body.bounce.y = 0.2;
        this.block.body.gravity.y = SimpleGame.GRAVITY;
        this.block.body.collideWorldBounds = true;
        this.game.camera.follow(this.block);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.map = this.game.add.tilemap("tilemap");
        this.map.addTilesetImage("blocks", "tiles");
        this.platformLayer = this.map.createLayer("platform");
        this.map.setCollisionBetween(1, 10000, true, this.platformLayer);
        this.platformLayer.resizeWorld();
        // add collectibles to the game
        this.collectibles = this.game.add.group();
        this.collectibles.enableBody = true;
        // create sprites for all objects in collectibles group layer
        this.map.createFromObjects("collectibles", 1, "tiles", 0, true, false, this.collectibles);
        // add controls to the screen (should add code for determining if player is on desktop or mobile)
        this.aButton = this.game.add.button(525, 430, "aButton", null, this);
        this.aButton.fixedToCamera = true; // stay in one place like a UI button
        this.aButton.events.onInputDown.add(function () {
            _this.isAButtonPressed = true;
        });
        this.aButton.events.onInputUp.add(function () {
            _this.isAButtonPressed = false;
        });
        this.leftButton = this.game.add.button(40, 380, "leftButton", null, this);
        this.leftButton.fixedToCamera = true;
        this.leftButton.events.onInputDown.add(function () {
            _this.isLeftButtonPressed = true;
        });
        this.leftButton.events.onInputUp.add(function () {
            _this.isLeftButtonPressed = false;
        });
        this.rightButton = this.game.add.button(180, 380, "rightButton", null, this);
        this.rightButton.fixedToCamera = true;
        this.rightButton.events.onInputDown.add(function () {
            _this.isRightButtonPressed = true;
        });
        this.rightButton.events.onInputUp.add(function () {
            _this.isRightButtonPressed = false;
        });
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.block, this.platformLayer);
        this.game.physics.arcade.overlap(this.block, this.collectibles, function (player, collectible) {
            collectible.kill();
        }, null, this);
        this.block.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.isLeftButtonPressed) {
            this.block.body.velocity.x = -SimpleGame.MOVE_VELOCITY;
        }
        else if (this.cursors.right.isDown || this.isRightButtonPressed) {
            this.block.body.velocity.x = SimpleGame.MOVE_VELOCITY;
        }
        if ((this.cursors.up.isDown || this.isAButtonPressed) && this.block.body.onFloor()) {
            this.block.body.velocity.y = -SimpleGame.JUMP_VELOCITY;
        }
    };
    SimpleGame.prototype.render = function () {
    };
    return SimpleGame;
}());
// CONSTANTS
SimpleGame.GRAVITY = 1000;
SimpleGame.MOVE_VELOCITY = 400;
SimpleGame.JUMP_VELOCITY = SimpleGame.MOVE_VELOCITY + SimpleGame.MOVE_VELOCITY * 0.55;
window.onload = function () {
    var game = new SimpleGame();
};
