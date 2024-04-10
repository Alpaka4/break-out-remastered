const gameState = {};

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('bg', './image/bg.png')
    }

    create() {
        gameState.bg = this.add.image(0, 0, 'bg').setOrigin(0);

        this.input.on('pointerup', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene{
    constructor() {
        super({key: 'GameScene'});
    }
    preload(){
        this.load.image('ball', './image/ball.png')
        this.load.image('blueBrick' , './image/blueBrick.png')
        this.load.image('greenBrick' , './image/greenBrick.png')
        this.load.image('redBrick' , './image/redBrick.png')
        this.load.image('yellowBrick' , './image/yellowBrick.png')
        this.load.image('rocket', './image/rocket.png')

    }
    create() {
        gameState.player = this.physics.add.sprite(405, 450, 'rocket');
        gameState.border = this.add.rectangle(910, 0, 5, 1024, 0xFFFFFF)
        gameState.keys = {}
        gameState.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        gameState.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        gameState.colors = ['blueBrick', 'greenBrick', 'redBrick', 'yellowBrick']
        gameState.bricks = []
        gameState.bricksCount = 0
        for(let x = 50; x < 900; x += 101) {
            for(let y = 20; y < 200; y += 41) {
                gameState.randColor = gameState.colors[Math.floor(Math.random() * 4)]
                gameState.brick = this.physics.add.sprite(x, y, gameState.randColor)
                gameState.brick.body.immovable = true
                gameState.bricks.push(gameState.brick)
                gameState.bricksCount++
            }
        }
        gameState.lives = 3
        gameState.livesText = this.add.text(915, 60, 'Lives: 3', { fontSize: '30px', fill: '#FFFFFF' })
        gameState.ball = this.physics.add.sprite(450, 400, 'ball')
        gameState.ball.setScale(0.05)
        gameState.speed = 320
        gameState.ball.setVelocity(gameState.speed, gameState.speed);
        gameState.ball.setBounce(1);
        gameState.player.body.immovable = true
        gameState.score = 0
        gameState.scoreText = this.add.text(915, 0, 'Score: 0', { fontSize: '30px', fill: '#FFFFFF' })
        this.physics.add.collider(gameState.ball, gameState.player, () => gameState.ball.setVelocityY(-gameState.speed))
        this.physics.add.collider(gameState.ball, gameState.bricks, (ball, brick) => {
            ball.setVelocityY(gameState.speed)
            brick.destroy()
            gameState.bricksCount--
            if(gameState.randColor === 'blueBrick'){
                gameState.score += 2
            } else if (gameState.randColor === 'greenBrick') {
                gameState.score += 5
            } else if (gameState.randColor === 'redBrick') {
                gameState.score += 9
            } else if (gameState.randColor === 'yellowBrick') {
                gameState.score += 13
            }
            gameState.scoreText.setText(`Score: ${gameState.score}`)
        })
        
        
    }

    update(){
        if(gameState.keys.A.isDown) {
            gameState.player.setVelocityX(-650)
        } else if(gameState.keys.D.isDown) {
            gameState.player.setVelocityX(650);
        } else {
        gameState.player.setVelocityX(0);
        }

        if(gameState.player.x <= 80 ) {
            gameState.player.x = 80
        }
        if(gameState.player.x >= 820) {
            gameState.player.x = 820
        }

        if(gameState.ball.y > 507) {
            gameState.lives--
            gameState.livesText.setText(`Lives: ${gameState.lives}`)
            gameState.ball.setVelocity(0,0);
            gameState.ball.y = 400;
            gameState.ball.x = 450;
            this.input.on('pointerup', () => gameState.ball.setVelocity(gameState.speed, gameState.speed));
        } else if (gameState.ball.x < 5) {
            gameState.ball.setVelocityX(gameState.speed)
        } else if (gameState.ball.y < 5) {
            gameState.ball.setVelocityY(gameState.speed)
        } else if (gameState.ball.x > 895) {
            gameState.ball.setVelocityX(-gameState.speed)
        }
        
        if(gameState.bricksCount <= 0){
            gameState.end = 'You Win'
            this.physics.pause();
            this.scene.stop('GameScene');
            this.scene.start('EndScene');
        }
         
        if(gameState.lives <= 0){
            gameState.end = 'You Lose'
            this.physics.pause();
            this.scene.stop('GameScene');
            this.scene.start('EndScene');
        }
    }

}

class EndScene extends Phaser.Scene{
    constructor() {
        super({key: 'EndScene'});
    }

    create(){
        gameState.endText = this.add.text(400, 150, `${gameState.end}`, { fontSize: '45px', fill: '#FFFFFF' })
        gameState.return = this.add.text(350, 250, 'Press to play again', { fontSize: '45px', fill: '#FFFFFF' })
        this.input.on('pointerup', () => {
            this.scene.stop('EndScene');
            this.scene.start('StartScene');
        });
    }
}
const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 512,
    physics: {
        default: "arcade",
        arcade: {
            gravity: false,
        },
    },
    scene: [StartScene,GameScene, EndScene],
};

const game = new Phaser.Game(config);