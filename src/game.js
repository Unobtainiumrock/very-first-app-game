
const game = new Phaser.Game(640, 520, Phaser.AUTO, '', { preload: preload, create: create, update: update });

let border, player, obs, obstacle;
let timer = 0;
let speed = -300;
let score = 0;
let currentGameScore = 0;
let highScore = 0;

function preload() {
	game.load.image('obstacle', 'assets/obstacle.png', 100, 40);
	game.load.image('border', 'assets/border.png');
	game.load.spritesheet('hero', 'assets/hero2.png', 40, 40, 4);
}


function create() {

	music = game.add.audio('music');
	music.volume = 0.1;

	music.play();
	// Adding physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.mouse.capture = true;
	//game.physics.arcade.gravity.y = 150;

	// A simple background for our game
	this.stage.backgroundColor = '#c0c0c0';

	// The border group contains the top and bottom borders of the game world
	border = game.add.group();

	// Enabled physics for any object that is created in this group
	border.enableBody = true;



	// Here we create the ground
	let ground = border.create(0, 0, 'border');

	// This stops it from falling away when you jump on it
	ground.body.immovable = true;

	 ground = border.create(0, game.world.height - 40, 'border');

	game.physics.enable(ground, Phaser.Physics.ARCADE);
	// This stops the character from leaving world bounds
	ground.body.collideWorldBounds = true;
	
	ground.body.immovable = true;

	player = game.add.sprite(30, 260, 'hero');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.immovable = true;
	player.body.velocity.y = 300;
	player.body.collideWorldBounds = true;
	var playing = player.animations.add('playing');
    player.animations.play('playing', 10, true);
	

	game.time.events.repeat(Phaser.Timer.SECOND, 10000, createObstacle, this);

	game.time.events.repeat(Phaser.Timer.SECOND * 5, 10000, function() {timer += 5; speed -= 50; score += 7; console.log(timer, speed)}, this);
	
}

function createObstacle() {
	// var speed = -300;
		var ground = border.create(740, game.rnd.integerInRange(60, 340), 'obstacle');
		ground.body.immovable = true;
		ground.body.velocity.x = speed;
}

function update() {
	// Stops player from phasing through border
	game.physics.arcade.collide(player, border);
	// Stops player from phasing through obstacles
	game.physics.arcade.collide(player, obs);
	player.body.acceleration = 0;

	let enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    let spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	if (enter.isDown) {
		game.state.start(game.state.current);
		music.stop();
		timer = 0;
		speed = -300;
		score = 0;
	}

 	if (game.input.mousePointer.isDown || spacebar.isDown) {
		player.body.velocity.y -= 30;
	} else {
		player.body.velocity.y += 25;
		// player.body.acceleration -= 200;
	}

// this.acceleration = new Phaser.Point();

	game.physics.arcade.overlap(player, border, collision, null, this);
	//is this supposed to stop the game? collisionHandler? overlapHandler?
	// collision (3rd arg) is calling the function below <- ah okay
}


function collision (player, border) {
	// something happens
	// change player animation? spritesheet
	scoreText = game.add.text(230, 270, 'Game Over', { fontSize: '32px'});
	scoreText = game.add.text(130, 300, 'Press Enter To Play Again', { fontSize: '32px'});
	player.kill();
	scoreText = game.add.text(40, 40, 'Score: ' + 5 * score);
	if (score*5 > highScore) {
		highScore = score*5;
	}
	highScoreText = game.add.text(40, 80, 'High-Score: ' + highScore);
}
