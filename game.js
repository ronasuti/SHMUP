var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//shooting characteristics
var fireTimer;
var fireDelay = 25; //milliseconds
var canFire = true;
var player;
var platforms;
var cursors;
var KeyShift;
var speed;
var game = new Phaser.Game(config);
var bullets;
function preload ()
{
    this.load.image('bg', 'assets/bg.png');
    this.load.spritesheet('jiki', 'assets/jiki.png', { frameWidth: 12, frameHeight: 28 });
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('teki', 'assets/teki.png');
}

function create ()
{
    this.add.image(295,350, 'bg');
    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(100, 450, 'jiki');
    enemy1=this.physics.add.sprite(75, 150, 'teki');
    enemy2=this.physics.add.sprite(475, 150, 'teki');
    player.setCollideWorldBounds(true);
    var Bullet = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:
        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;

            if (this.y < -50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });
    bullets = this.add.group({
        classType: Bullet,
        maxSize: 120,
        runChildUpdate: true
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('jiki', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
   this.anims.create({
        key: 'turn',
        frames: [ { key: 'jiki', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('jiki', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    cursors = this.input.keyboard.createCursorKeys();
    shootBullets = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    useBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    //player params. This is half the real speed.
    speed = 200;
    this.physics.add.overlap(player, enemy1);
    this.physics.add.overlap(bullets,enemy1);
    this.physics.add.overlap(enemy2, bullets);
}

function update ()
{
    let xVel = 0; yVel = 0;
    //movement inputs, handles diagonal velocity mostly correctly
    //using a simplified heuristic (*0.707) for speed
    if (cursors.left.isDown) {  xVel-=speed;}
    if (cursors.right.isDown) { xVel+=speed;}
    if (cursors.up.isDown) {    yVel-=speed;}
    if (cursors.down.isDown) {  yVel=speed;}
    if (xVel!==0 && yVel!==0) { player.setVelocity(xVel*0.707, yVel*0.707);}
    else {                      player.setVelocity(xVel, yVel);}

    //action inputs
    if (shootBullets.isDown) {
        var bullet = bullets.get();
        if (bullet) {
            if (canFire) {
                bullet.fire(player.x, player.y);
                canFire = false;
                fireTimer = this.time.delayedCall(fireDelay, fireEvent,[], this);
            }
        }
    }
}

function fireEvent () {
    canFire = true;
}
function destroyenemy(enemy1,enemy2){
  enemy1.destroy();
  enemy2.destroy();
}
