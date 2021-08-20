/**
 * Authors: Austin Scott
 *          Paras Sharma
 *          Suk Won
 *          Tyler Phippen
 * This class launches the start screen, controls round transitions,
 * and it launches winner / game over screens.
 **/
class SceneManager{
	constructor(game){
		this.game = game;
        this.game.camera = this;
        this.title = true;
        this.titleName = "Warrior of the Peak";
        this.edition = "Frantic Coder Edition";
        this.clicked = false;
        this.clickX;
        this.clickY;
        this.pclickX;
        this.pclickY;
        this.mclickX;
        this.mclickY;
        this.clickCounter = 0;
        this.roundCount = 1;
        this.deathCount=0;
        this.cpuDeathCount = 0;
        this.DLspritesheet = ASSET_MANAGER.getAsset("./sprites/spritesheet.png");
        this.JLspritesheet = ASSET_MANAGER.getAsset("./sprites/spritesheet1.png");
        this.CPspritesheet = ASSET_MANAGER.getAsset("./sprites/fighterLR.png");
        this.Gokuspritesheet = ASSET_MANAGER.getAsset("./sprites/goku_spritesheet.png");
        this.CLspritesheet = ASSET_MANAGER.getAsset("./sprites/ChunLi.png");
        this.BLspritesheet = ASSET_MANAGER.getAsset("./sprites/BillyLee.png");
        this.animations = [];
        this.animations[0] = (new Animator2(this.DLspritesheet, KPstate.RIDLE, 2, .75, false, true));
        this.animations[1] = (new Animator2(this.JLspritesheet, KPstate.RIDLE, 2, .75, false, true));
        this.animations[2] = new Animator(this.CPspritesheet, 60, 60, 40, 40, 2, 0.33, 10, false, true );
        this.animations[3] = new Animator2(this.CLspritesheet, ChunLiState.IDLE, 4, .35, false, true );
        this.animations[4] = new Animator2(this.BLspritesheet, BillyLeeState.WALK, 4, .75, false, true );
        this.animations[5] = new Animator2(this.Gokuspritesheet, GokuState.RWALK, 2, .75, false, true );


        this.PlayersChoice = {
            PLAYER: null,
            OPPONENT: null
        }
        this.Level = {
            MAP: null
        }
        this.Players = {
            CHARACTERS: ["Daniel Larusso", "Johnny Lawrence",
                        "Yodha", "Chun Li", "Billy Lee", "Goku"]
        }
        this.LevelChoice = {
            LEVEL: ["Falls", "Welcome to The Jungle", "Olympus Oil Rig"]
        }
	};

    clearEntities(){
        this.game.entities.forEach(function (entity){
            entity.removeFromWorld = true;
        });
    };
    loadgame(transition, title, roundTransition, roundCount, gameOver, winner){
        this.clearEntities();
        opponentDeath = false;

        switch(this.PlayersChoice.PLAYER){
            //Daniel Larusso
            case this.Players.CHARACTERS[0]:
                this.player = new KaratePlayer(this.game, 50, 0, false, this.Players.CHARACTERS[0], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT, this.cpuDeathCount);
                break;
            //Johnny Lawrence
            case this.Players.CHARACTERS[1]:
                this.player = new KaratePlayer(this.game, 50, 0, true, this.Players.CHARACTERS[1], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT, this.cpuDeathCount);
                break;
            //Yodha
            case this.Players.CHARACTERS[2]:
                this.player = new catplayer(this.game, 0, 0, this.Players.CHARACTERS[2], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT,this.cpuDeathCount);
                break;
            //Chun Li
            case this.Players.CHARACTERS[3]:
                this.player = new ChunLi(this.game, 0, 0, this.Players.CHARACTERS[3], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT,this.cpuDeathCount);
                break;
            //Billy Lee
            case this.Players.CHARACTERS[4]:
                this.player = new BillyLee(this.game, 0, 0, this.Players.CHARACTERS[4], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT,this.cpuDeathCount);
                break;
            //Goku
            case this.Players.CHARACTERS[5]:
                this.player = new Goku(this.game, 0, 0, this.Players.CHARACTERS[5], this.roundCount, this.Level.MAP, this.deathCount, this.PlayersChoice.OPPONENT,this.cpuDeathCount);
                break;
        }
        switch(this.PlayersChoice.OPPONENT){
            //Daniel Larusso (white Gi)
            case this.Players.CHARACTERS[0]:
                this.opponent = new KaratePlayerCPU(this.game, 960, 0, this.player, false, this.Players.CHARACTERS[0]);
                break;
            //Daniel Larusso (Blue Gi)
            case this.Players.CHARACTERS[1]:
                this.opponent = new KaratePlayerCPU(this.game, 960, 0, this.player, true, this.Players.CHARACTERS[1]);
                break;
            //Yodha
            case this.Players.CHARACTERS[2]:
                this.opponent = new CatPlayerCPU(this.game, 960, 0, this.player, this.Players.CHARACTERS[2]);
                break;
            //Chun Li
            case this.Players.CHARACTERS[3]:
                this.opponent = new ChunLiCPU(this.game, 960, 0,  this.player, this.Players.CHARACTERS[3]);
                break;
            //Billy Lee
            case this.Players.CHARACTERS[4]:
                this.opponent = new BillyLeeCPU(this.game, 960, 0, this.player, this.Players.CHARACTERS[4]);
                break;
              //Goku
            case this.Players.CHARACTERS[5]:
                this.opponent = new GokuCPU(this.game, 960, 0, this.player, this.Players.CHARACTERS[5]);
                break;
        }
        this.title = title;
        if(transition){
            ASSET_MANAGER.pauseBackgroundMusic();
            this.game.addEntity(new TransitionScreen(this.game, this.Level.MAP));
            ASSET_MANAGER.playAsset("./audio/roundone.mp3");
        } else if(roundTransition){
            ASSET_MANAGER.pauseBackgroundMusic();
            this.game.addEntity(new roundTransitionScreen(this.game, roundCount));
            if(this.roundCount === 1){
                ASSET_MANAGER.playAsset("./audio/roundone.mp3");
            } else if(this.roundCount === 2){
                ASSET_MANAGER.playAsset("./audio/roundtwo.mp3");
            } else if(this.roundCount === 3){
                ASSET_MANAGER.playAsset("./audio/finalround.mp3");
            }
        } else if (gameOver){    
            this.game.addEntity(new GameOver(this.game));
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset("./audio/gameover.mp3");
        } else if(winner){
            this.game.addEntity(new Winner(this.game));
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset("./audio/perfectwinner.mp3");
        } else {
            switch(this.Level.MAP){
                //Water falls
                case this.LevelChoice.LEVEL[0]:
                    this.loadLevel1();
                    break;
                    //Jungle
                case this.LevelChoice.LEVEL[1]:
                    this.loadLevel2();
                    break;
                //Oil Rig
                case this.LevelChoice.LEVEL[2]:
                    //this.title = false;
                    this.loadlevel3();
                    break;
            }
        }

    };
    loadLevel1(){
        this.music = "./music/Dr. Wily's Castle.mp3";
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset(this.music);

        this.bkground = new BackGround(this.game, 0, 0);
        this.game.addEntity(this.bkground);

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);

        this.game.addEntity(new VS(this.game, this.player, this.opponent));

        this.game.addEntity(this.opponent);
                
        this.game.addEntity(this.player);
    };
    loadLevel2(){
        this.music = "./music/Welcome to the Jungle.mp3";
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset(this.music);

        //Loading Background image
        this.backscene = new BackScene(this.game,0,0, 1024, 672);
        this.game.addEntity(this.backscene);
        //Loading Platform to jump on
        this.platform = new Platform(this.game, 360,390, 744);
        this.game.addEntity(this.platform);

        let ground = new Ground(this.game, 0, 736, 1024);
        this.game.addEntity(ground);

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);

        this.game.addEntity(new VS(this.game, this.player, this.opponent));

        this.game.addEntity(this.opponent);
        
        this.game.addEntity(this.player);
    };
    loadlevel3(){
        this.music = "./music/KenStage.mp3";
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset(this.music);

        this.sky = new Sky(this.game, 0,0);
        this.game.addEntity(this.sky);

        this.propeller = new Propeller(this.game, 75, 50);
        this.game.addEntity(this.propeller);

        this.crane = new Crane(this.game, 620, 159);
        this.game.addEntity(this.crane);

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);

        this.game.addEntity(new VS(this.game, this.player, this.opponent));

        this.game.addEntity(this.opponent);
        
        this.game.addEntity(this.player);

        this.oilrig = new OilRig(this.game, 0, 446);
        this.game.addEntity(this.oilrig);

        this.ocean = new Ocean(this.game, 0, 719);
        this.game.addEntity(this.ocean);
    };

    // add audio
    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    update(){
        PARAMS.DEBUG = document.getElementById("debug").checked;
        this.updateAudio();

        if(this.game.click){
            this.clicked = true;
        }
        if(this.game.click){
            if(((this.game.click.y >= 400-12) && (this.game.click.y <= 400 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[0].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                ASSET_MANAGER.playAsset("./audio/KarateSoundEffect.mp3");
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[0];
            } else if(((this.game.click.y >= 450-12) && (this.game.click.y <= 450 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[1].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                ASSET_MANAGER.playAsset("./audio/KarateSoundEffect.mp3");
            } else if(((this.game.click.y >= 450-12) && (this.game.click.y <= 450 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[1].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[1];
                ASSET_MANAGER.playAsset("./audio/KarateSoundEffect.mp3");
            } else if(((this.game.click.y >= 500-12) && (this.game.click.y <= 500 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[2].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[2];
                ASSET_MANAGER.playAsset("./audio/CatMeow.mp3");
            } else if(((this.game.click.y >= 550-12) && (this.game.click.y <= 550 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[3].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[3];
                ASSET_MANAGER.playAsset("./music/ChunLi.mp3"); 
            } else if(((this.game.click.y >= 600-12) && (this.game.click.y <= 600 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[4].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[4]; 
                ASSET_MANAGER.playAsset("./music/Damn.mp4");
            } else if(((this.game.click.y >= 650-12) && (this.game.click.y <= 650 +3) && (this.game.click.x > 0) && (this.game.click.x < this.Players.CHARACTERS[4].length * 12))){
                ASSET_MANAGER.pauseBackgroundMusic();
                this.pclickX = this.game.click.x;
                this.pclickY = this.game.click.y;
                this.PlayersChoice.PLAYER = this.Players.CHARACTERS[5];
                ASSET_MANAGER.playAsset("./music/gokutheme.mp3");
            }

            if(((this.game.click.y >= 400-12) && (this.game.click.y <= 400 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[0].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./audio/KarateSoundEffect.mp3");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[0];  
            } else if(((this.game.click.y >= 450-12) && (this.game.click.y <= 450 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[1].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./audio/KarateSoundEffect.mp3");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[1]; 
            } else if(((this.game.click.y >= 500-12) && (this.game.click.y <= 500 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[2].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./audio/CatMeow.mp3");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[2]; 
            } else if(((this.game.click.y >= 550-12) && (this.game.click.y <= 550 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[3].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./music/ChunLi.mp3");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[3]; 
            } else if(((this.game.click.y >= 600-12) && (this.game.click.y <= 600 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[4].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./music/Damn.mp4");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[4]; 
            } else if(((this.game.click.y >= 650-12) && (this.game.click.y <= 650 +3) && (this.game.click.x > 400) && (this.game.click.x < 400 + this.Players.CHARACTERS[4].length * 12))){
                // ASSET_MANAGER.pauseBackgroundMusic();
                // ASSET_MANAGER.playAsset("./music/gokutheme.mp3");
                this.oclickX = this.game.click.x;
                this.oclickY = this.game.click.y;
                this.PlayersChoice.OPPONENT = this.Players.CHARACTERS[5];
            }

            if(((this.game.click.y >= 400-12) && (this.game.click.y <= 400 +3) && (this.game.click.x > 750) && (this.game.click.x < 750 + this.LevelChoice.LEVEL[0].length * 12))){
                this.mclickX = this.game.click.x;
                this.mclickY = this.game.click.y;
                this.Level.MAP = this.LevelChoice.LEVEL[0];  
            } else if(((this.game.click.y >= 450-12) && (this.game.click.y <= 450 +3) && (this.game.click.x > 750) && (this.game.click.x < 750 + this.LevelChoice.LEVEL[1].length * 12))){
                this.mclickX = this.game.click.x;
                this.mclickY = this.game.click.y;
                this.Level.MAP = this.LevelChoice.LEVEL[1]; 
            } else if(((this.game.click.y >= 500-12) && (this.game.click.y <= 500 +3) && (this.game.click.x > 750) && (this.game.click.x < 750 + this.LevelChoice.LEVEL[2].length * 12))){
                this.mclickX = this.game.click.x;
                this.mclickY = this.game.click.y;
                this.Level.MAP = this.LevelChoice.LEVEL[2]; 
            }
    
            if(((this.game.click.y > 690) && (this.game.click.y <= 725) && (this.game.click.x > 300) && (this.game.click.x < 300 + "--- FIGHT! ---".length * 30))){
                if((this.PlayersChoice.PLAYER === null) || (this.PlayersChoice.OPPONENT === null) || (this.Level.MAP === null) || (this.Level.MAP === null)){

                } else {
                    this.loadgame(true, false, false, 1, false, false);
                }
            }
        }
    };
    draw(ctx){
        if(PARAMS.DEBUG){
        }
        if(!this.title){
            
        } else if(this.title) {
            ctx.fillStyle = "Black";
            ctx.strokeStyle = "Black";
            ctx.fillRect(0,0,1024, 768);
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '90px  "Press Start 2P:';
            ctx.fillStyle = rgb(183, 3, 3);
            ctx.fillText(this.titleName, 150, 100);
            ctx.strokeText(this.titleName, 150, 100);
            ctx.font = '20px "Press Start 2P"';
            ctx.fillText(this.edition, 300, 150);
            ctx.strokeText(this.edition, 300, 150);
    
            this.animations[0].drawFrame(this.game.clockTick, ctx, 85, 200, PARAMS.SCALE);
            this.animations[1].drawFrame(this.game.clockTick, ctx, 235, 200, PARAMS.SCALE);
            this.animations[2].drawFrame(this.game.clockTick, ctx, 385, 200, 3);
            this.animations[3].drawFrame(this.game.clockTick, ctx, 535, 200, 1.20);
            this.animations[4].drawFrame(this.game.clockTick, ctx, 685, 200, 1.55);
            this.animations[5].drawFrame(this.game.clockTick, ctx, 835, 200, 3.5);
            
            //ctx.font = '20px "Press Start 2P"';
            ctx.fillStyle = rgb(183, 3, 3);
            ctx.fillText("---Players---", 0, 350);
            ctx.strokeText("---Players---", 0, 350);
            var counter = 350;
            ctx.font = '12px "Press Start 2P"';
            for(var i = 0; i < 6; i++){
                counter += 50;
                if(this.clicked && (this.pclickY >= counter-12) && (this.pclickY <= counter +3) && (this.pclickX > 0) && (this.pclickX < this.Players.CHARACTERS[i].length * 12)){
                    ctx.fillStyle = "White";
                } else if(this.game.mouse && (this.game.mouse.y >= counter-12) && (this.game.mouse.y <= counter +3) && (this.game.mouse.x > 0) && (this.game.mouse.x < this.Players.CHARACTERS[i].length * 12)){
                    ctx.fillStyle = "White";
                } else {
                    ctx.fillStyle = rgb(183, 3, 3);
                }
                ctx.fillText(this.Players.CHARACTERS[i], 0, counter);
                ctx.strokeText(this.Players.CHARACTERS[i], 0, counter);
            }
            ctx.font = '20px "Press Start 2P"';
            ctx.fillStyle = rgb(183, 3, 3);
            ctx.fillText("---CPU---", 400, 350);
            ctx.strokeText("---CPU---", 400, 350);
            ctx.font = '12px "Press Start 2P"';
            var counter = 350;
            for(var i = 0; i < 6; i++){
                counter += 50;
                if(this.clicked && (this.oclickY >= counter-12) && (this.oclickY <= counter +3) && (this.oclickX > 400) && (this.oclickX < 400 + this.Players.CHARACTERS[i].length * 12)){
                    ctx.fillStyle = "White";
                } else if(this.game.mouse && (this.game.mouse.y >= counter-12) && (this.game.mouse.y <= counter +3) && (this.game.mouse.x > 400) && (this.game.mouse.x < 400 + this.Players.CHARACTERS[i].length * 12)){
                    ctx.fillStyle = "White";
                } else {
                    ctx.fillStyle = rgb(183, 3, 3);
                }
                ctx.fillText(this.Players.CHARACTERS[i], 400, counter);
                ctx.strokeText(this.Players.CHARACTERS[i], 400, counter);
            }
            ctx.font = '20px "Press Start 2P"';
            ctx.fillStyle = rgb(183, 3, 3);
            ctx.fillText("---Level---", 750, 350);
            ctx.strokeText("---Level---", 750, 350);
            ctx.font = '12px "Press Start 2P"';
            var counter = 350;
            for(var i = 0; i < 3; i++){
                counter += 50;
                if(this.clicked && (this.mclickY >= counter-12) && (this.mclickY <= counter +3) && (this.mclickX > 750) && (this.mclickX < 750 + this.LevelChoice.LEVEL[i].length * 12)){
                    ctx.fillStyle = "White";
                } else if(this.game.mouse && (this.game.mouse.y >= counter-12) && (this.game.mouse.y <= counter +3) && (this.game.mouse.x > 750) && (this.game.mouse.x < 750 + this.LevelChoice.LEVEL[i].length * 12)){
                    ctx.fillStyle = "White";
                } else {
                    ctx.fillStyle = rgb(183, 3, 3);
                }
                ctx.fillText(this.LevelChoice.LEVEL[i], 750, counter);
                ctx.strokeText(this.LevelChoice.LEVEL[i], 750, counter);
            }
            ctx.font = '30px "Press Start 2P"';
            ctx.fillStyle = this.game.mouse && (this.game.mouse.y > 690) && (this.game.mouse.y <= 725) && (this.game.mouse.x > 300) && (this.game.mouse.x < 300 + "--- FIGHT! ---".length * 30)? "White" : rgb(183, 3, 3);
            ctx.fillText("--- FIGHT! ---", 300, 725);
            ctx.strokeText("--- FIGHT! ---", 300, 725);
        }
    };
};
function rgb(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
};
class TransitionScreen{
    constructor(game, level){
        Object.assign(this,{game, level});
        this.midpoint = 1024 / 2;

        this.elapsed = 0;
    };
    update(){
        this.elapsed += this.game.clockTick;
        if(this.elapsed > 2) this.game.camera.loadgame(false, false);
    };
    draw(ctx){
        ctx.fillStyle = "Black";
        ctx.strokeStyle = "Black";
        ctx.fillRect(0,0,1024, 768);
        ctx.strokeStyle = "DarkOrange";
        ctx.font = '90px  "Press Start 2P:';
        ctx.fillStyle = rgb(183, 3, 3);
        if(this.level === "Falls"){
            ctx.fillText(this.level, this.midpoint - ((this.level.length * 45) / 2), 400);
            ctx.strokeText(this.level, this.midpoint - ((this.level.length * 45) / 2), 400); 
        } else if (this.level === "Welcome to The Jungle"){
            ctx.fillText(this.level, this.midpoint - ((this.level.length * 40) / 2), 400);
            ctx.strokeText(this.level, this.midpoint - ((this.level.length * 40) / 2), 400);
        } else {
            ctx.fillText(this.level, this.midpoint - ((this.level.length * 45) / 2), 400);
            ctx.strokeText(this.level, this.midpoint - ((this.level.length * 45) / 2), 400);
        }
        ctx.fillText("Round 1", this.midpoint - (("Round 1".length * 45) / 2), 550);
        ctx.strokeText("Round 1", this.midpoint - (("Round 1".length * 45) / 2), 550);
    };
};

class VS{
    constructor(game, player, opponent){
        Object.assign(this, {game, player, opponent});
    };
    update(){
    };
    draw(ctx){
        var playerNameCount = this.player.name.length; 
        var cpuNameCount = this.opponent.name.length;
        var totalCount = playerNameCount + cpuNameCount;
        var middle = 524;
        var vStart = 250 + ((middle - totalCount) / 2);
        ctx.strokeStyle = "Black";
        ctx.font = '20px "Press Start 2P"';
        ctx.fillStyle = "Red";
        ctx.fillText("VS.", vStart - ("VS.".length * 15)/2, 60);
        ctx.strokeText("VS.", vStart - ("VS.".length * 15)/2, 60);
    };
};

class RoundManager extends SceneManager{
    constructor(game, roundCount, player, opponent, map, deathCount, cpuDeathCount){
        super(game);
        Object.assign(this, {game});
        this.deathCount = deathCount;
        this.cpuDeathCount = cpuDeathCount;
        this.roundCount = roundCount;
        //True if won, and false if lost.
        this.result;
        console.log("CPU death t/f: " + opponentDeath);
        console.log("Player Death: " + this.deathCount + "VS. Opponent Death count: " + this.cpuDeathCount);
        if(this.deathCount < this.cpuDeathCount) this.result = true;
        if(this.deathCount > this.cpuDeathCount) this.result = false;
        this.roundCount+=1;
        if(this.roundCount === 4){
            if(this.result)this.loadgame(false, false, false, this.roundCount, false, true);
            if(!this.result)this.loadgame(false, false, false, this.roundCount, true, false);
        } else {
            console.log("Player: " + player);
            this.PlayersChoice = {PLAYER: player, OPPONENT: opponent};
            this.Level = {MAP: map};
            this.title = false;
            this.loadgame(false, false, true, this.roundCount, false, false);
        }
    };
    update(){
    };
    draw(ctx){
    };
};

class roundTransitionScreen{
    constructor(game, roundCount){
        Object.assign(this, {game});
        this.roundCount = roundCount;
        this.elapsed = 0;
        this.midpoint = 1024 / 2;
        if(this.roundCount === 1){
            this.round = "Round 1";
        } else if(this.roundCount === 2){
            this.round = "Round 2";
        } else if (this.roundCount === 3) {
            this.round = "Final Round";
        }
    };
    update(){
        this.elapsed += this.game.clockTick;
        if(this.elapsed > 2) this.game.camera.loadgame(false, false, false, this.roundCount);
    };
    draw(ctx){
        ctx.fillStyle = "Black";
        ctx.strokeStyle = "Black";
        ctx.fillRect(0,0,1024, 768);
        ctx.strokeStyle = "DarkOrange";
        ctx.font = '90px  "Press Start 2P:';
        ctx.fillStyle = rgb(183, 3, 3);
        ctx.fillText(this.round, this.midpoint - ((this.round.length * 45) / 2), 400);
        ctx.strokeText(this.round, this.midpoint - ((this.round.length * 45) / 2), 400);

    };
};

class GameOver{
    constructor(game){
        Object.assign(this, {game});
        this.midpoint = 1024 / 2;
        this.elapsed = 0;
        
    };
    update(){
        this.elapsed += this.game.clockTick;
        if(this.elapsed > 2){
            this.clearEntities();
            
            this.game.addEntity(new SceneManager(this.game));
        }
    };
    clearEntities(){
        this.game.entities.forEach(function (entity){
            entity.removeFromWorld = true;
        });
    };
    draw(ctx){
        ctx.fillStyle = "Black";
        ctx.strokeStyle = "Black";
        ctx.fillRect(0,0,1024, 768);
        ctx.strokeStyle = "DarkOrange";
        ctx.font = '90px  "Press Start 2P:';
        ctx.fillStyle = rgb(183, 3, 3);
        ctx.fillText("GAME OVER", this.midpoint - (("GAME OVER".length * 60) / 2), 400);
        ctx.strokeText("GAME OVER", this.midpoint - (("GAME OVER".length * 60) / 2), 400);

    };
};

class Winner{
    constructor(game){
        Object.assign(this, {game});
        this.midpoint = 1024 / 2;
        this.elapsed = 0;

    };
    update(){
        this.elapsed += this.game.clockTick;
        if(this.elapsed > 2){
            this.clearEntities();
            this.game.addEntity(new SceneManager(this.game));
        }

    };
    clearEntities(){
        this.game.entities.forEach(function (entity){
            entity.removeFromWorld = true;
        });
    };
    draw(ctx){
        ctx.fillStyle = "Black";
        ctx.strokeStyle = "Black";
        ctx.fillRect(0,0,1024, 768);
        ctx.strokeStyle = "DarkOrange";
        ctx.font = '90px  "Press Start 2P:';
        ctx.fillStyle = rgb(183, 3, 3);
        ctx.fillText("Winner!", this.midpoint - (("Winner!".length * 60) / 2), 400);
        ctx.strokeText("Winner!", this.midpoint - (("Winner!".length * 60) / 2), 400);

    };
};