var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var KeyShift;
var game = new Phaser.Game(config);
var bullets;

function preload ()
{
    this.load.image('bg', 'assets/bg.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('tate', 'assets/tate.png');
    this.load.spritesheet('jiki', 'assets/jiki.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('bullet', 'assets/bullet.png'
}

function create ()
{
    this.add.image(295,350, 'bg');

    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(100, 450, 'jiki');
   platforms.create(400, 731, 'ground').setScale(2).refreshBody();
   platforms.create(0.0001, 300, 'tate').setScale(2).refreshBody();
   platforms.create(615, 300, 'tate').setScale(2).refreshBody();
    player.setBounce(0.2);
    player.setDrag(0.99);
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

    bullets = this.add.group({
           classType: Bullet,
           maxSize: 10,
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

    this.physics.add.collider(player,platforms);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);


    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);


    }
    else
    {
        player.setVelocityX(0);


    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-160);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
    }
    else{
      player.setVelocityY(0);
    }
}