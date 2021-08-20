class ChunLi {
    constructor(game, x, y, theName, roundCount, map, deathCount, opponent, cpuDeathCount) {
        Object.assign(this, { game, x, y, theName, roundCount, map, deathCount, opponent, cpuDeathCount});

      //  this.game.ChunLi = this;
        
      //  this.name = "Chun Li";

        //Character Details for HUD and game
        this.name = this.theName;
        this.dead = false;
        this.CPU = false;
        this.deathCount = deathCount;
        this.cpuDeathCount = cpuDeathCount;
        this.elapsed = 0;
        this.block = false;

        //For the Health Bar
        this.maxHitPoints  = 100;

        //Total hit points taken
        this.hitPoints = 100;

        //Circle so the CPU can detect player
        this.VisRadius = 135;
        //this.AtkRadius = 35;
        this.cX = 0, this.xY = 0;

        //Only for block
     /*   this.STATE = {
            BLOCK: 10
        };

        //only for block
        this.FACING = {
            RIGHT:  0,
            LEFT: 1
        }; */


        // spritesheet
        this.updateBB();
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ChunLi.png");

        // ChunLi state variables
        this.state = 0; // 0 = idle, 1 = walking, 2 = jump, 3 = punch, 4 = kick, 5 = jump kick, 6 = super kick, 7 = bird kick, 8 = get hit, 9 = duck, 10 = block
        this.facing = 0; // 0 = right, 1 = left
       // this.dead = false;

         //Her velocity for movements.
        this.velocity = {
            x:0, 
            y:0
        };
        

        //Creating the Health Bar
        this.healthbar = new HealthBar(this);
        //This is the falling acceleration for gravity.
        this.fallAcc = 562.5;

        // Idle
        // facing right
        this.idle = [{x: 0, y: 1, w: 42, h: 76}, {x: 50, y: 1, w: 42, h: 76}, {x: 100, y: 0, w: 42, h: 77}, {x: 100, y: 0, w: 42, h: 77}];
        
        // facing left

        // walk
        // facing right
        this.walk = [{x: 210, y: 4, w: 46, h: 74}, {x: 260, y: 1, w: 42, h: 77}, {x: 310, y: 0, w: 37, h: 78}, {x: 360, y: 1, w: 43, h: 77}, 
            {x: 410, y: 3, w: 48, h: 75}, {x: 460, y: 1, w: 42, h: 77}, {x: 510, y: 0, w: 37, h: 78}, {x: 560, y: 1, w: 42, h: 77}];

        // jump
        // facing right
        this.jump = [{x: 620, y: 28, w: 43, h: 65}, {x: 670, y: 0, w: 29, h: 95}, {x: 720, y: 0, w: 35, h: 60}, {x: 770, y: 0, w: 29, h: 95}]; 

        // punch
        // facing right
        this.punch = [{x: 830, y: 0, w: 60, h: 74}, {x: 910, y: 9, w: 76, h: 67}, {x: 990, y: 0, w: 60, h: 74}];

        // kick
        // facing right
        this.kick = [{x: 1100, y: 5, w: 42, h: 80}, {x: 1200, y: 0, w: 73, h: 86}, {x: 1300, y: 11, w: 60, h: 75}, {x: 1400, y: 13, w: 41, h: 73}];

        // jump kick
        // facing right
        this.jKick = [{x: 0, y: 142, w: 43, h: 83}, {x: 80, y: 144, w: 51, h: 81}, {x: 160, y: 134, w: 65, h: 64}, {x: 240, y: 130, w: 31, h: 93}, 
            {x: 320, y: 140, w: 64, h: 80}, {x: 400, y: 150, w: 52, h: 75}];

        // super kick
        // facing right
        this.sKick = [{x: 500, y: 139, w: 63, h: 88}, {x: 590, y: 138, w: 71, h: 90}, {x: 680, y: 143, w: 69, h: 84}, {x: 770, y: 143, w: 78, h: 84}, 
            {x: 860, y: 145, w: 72, h: 83}, {x: 950, y: 143, w: 80, h: 83}, {x: 1040, y: 145, w: 61, h: 83}];

        // bird kick
        // facing right
        this.bKick = [{x: 0, y: 317, w: 39, h: 52}, {x: 90, y: 274, w: 30, h: 96}, {x: 180, y: 284, w: 52, h: 75}, {x: 270, y: 259, w: 64, h: 78},
            {x: 360, y: 250, w: 31, h: 93}, {x: 450, y: 268, w: 32, h: 102}, {x: 540, y: 250, w: 32, h: 93}, {x: 630, y: 266, w: 32, h: 63}, {x: 720, y: 268, w: 85, h: 62},
            {x: 810, y: 268, w: 28, h: 62}, {x: 900, y: 268, w: 85, h: 63}, {x: 990, y: 269, w: 32, h: 102}, {x: 1080, y: 251, w: 31, h: 93}, {x: 1170, y: 260, w: 64, h: 78}, 
            {x: 1260, y: 285, w: 52, h: 75}, {x: 1350, y: 275, w: 29, h: 96}];

        // dead
        // facing right
        this.die = [{x: 0, y: 400, w: 71, h: 64}, {x: 84, y: 400, w: 55, h: 61}, {x: 169, y: 436, w: 81, h: 33}];

        // get hit
        // facing right
        this.gHit = [{x: 320, y: 399, w: 42, h: 76}, {x: 396, y: 393, w: 44, h: 82}, {x: 462, y: 400, w: 60, h: 75}];

        // duck
        // facing right
        this.duck = [{x: 600, y: 398, w: 42, h: 76}, {x: 650, y: 422, w: 38, h: 52}];

        // block
        // facing right
        this.blocked = [{x: 0, y: 481, w: 49, h: 75}, {x: 57, y: 496, w: 45, h: 60}];

        
        // player animations
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
    
    };

        loadAnimations() {
            for (var i = 0; i < 13; i++) { // eleven states
                this.animations.push([]);
                for (var j = 0; j < 2; j++) { // two directions
                    this.animations[i].push([]);
                }
            }



        this.animations[0][0] = new Animator2(this.spritesheet, this.idle, 4, .1, false, true);
        this.animations[0][1] = new Animator2(this.spritesheet, this.idle, 4, .1, false, true);
        this.animations[1][0] = new Animator2(this.spritesheet, this.walk, 8, .1, false, true);
        this.animations[1][1] = new Animator2(this.spritesheet, this.walk, 8, .1, false, true);
        this.animations[2][0] = new Animator2(this.spritesheet, this.jump, 4, .7, false, true);
        this.animations[2][1] = new Animator2(this.spritesheet, this.jump, 4, .7, false, true);
        this.animations[3][0] = new Animator2(this.spritesheet, this.punch, 3, .1, false, true);
        this.animations[3][1] = new Animator2(this.spritesheet, this.punch, 3, .1, false, true);
        this.animations[4][0] = new Animator2(this.spritesheet, this.kick, 4, .2, false, true);
        this.animations[4][1] = new Animator2(this.spritesheet, this.kick, 4, .2, false, true);
        this.animations[5][0] = new Animator2(this.spritesheet, this.jKick, 6, .1, false, true);
        this.animations[5][1] = new Animator2(this.spritesheet, this.jKick, 6, .1, false, true);
        this.animations[6][0] = new Animator2(this.spritesheet, this.sKick, 7, .1, false, true);
        this.animations[6][1] = new Animator2(this.spritesheet, this.sKick, 7, .1, false, true);
        this.animations[7][0] = new Animator2(this.spritesheet, this.bKick, 16, .1, false, true);
        this.animations[7][1] = new Animator2(this.spritesheet, this.bKick, 16, .1, false, true);
        this.animations[8][0] = new Animator2(this.spritesheet, this.gHit, 2, .1, false, true);
        this.animations[8][1] = new Animator2(this.spritesheet, this.gHit, 2, .1, false, true);
        this.animations[9][0] = new Animator2(this.spritesheet, this.duck, 2, .2, false, true);
        this.animations[9][1] = new Animator2(this.spritesheet, this.duck, 2, .2, false, true);
        this.animations[10][0] = new Animator2(this.spritesheet, this.blocked, 2, 1, false, true);
        this.animations[10][1] = new Animator2(this.spritesheet, this.blocked, 2, 1, false, true);
        this.animations[11][0] = new Animator2(this.spritesheet, this.die, 3, 1, false, true);
        this.animations[11][1] = new Animator2(this.spritesheet, this.die, 3, 1, false, true);
        
        this.deadScene = new Animator2(this.spritesheet, this.die, 3, 1, false, true);
        };




    

    updateBB(){
        this.lastBB = this.BB;

        if (this.facing === 0) {
            if (this.state === 0) {
                this.BB = new BoundingBox (this.x, this.y, this.idle[this.animations[0][0].currentFrame()].w * PARAMS.CHUNLI, this.idle[this.animations[0][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 1) {
                this.BB = new BoundingBox (this.x, this.y, this.walk[this.animations[1][0].currentFrame()].w * PARAMS.CHUNLI, this.walk[this.animations[1][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 2) {
                this.BB = new BoundingBox(this.x, this.y, this.jump[this.animations[2][0].currentFrame()].w * PARAMS.CHUNLI, this.jump[this.animations[2][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 3) {
                this.BB = new BoundingBox(this.x, this.y, this.punch[this.animations[3][0].currentFrame()].w * PARAMS.CHUNLI, this.punch[this.animations[3][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 4) {
                this.BB = new BoundingBox(this.x, this.y, this.kick[this.animations[4][0].currentFrame()].w * PARAMS.CHUNLI, this.kick[this.animations[4][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 5) {
                this.BB = new BoundingBox(this.x, this.y, this.jKick[this.animations[5][0].currentFrame()].w * PARAMS.CHUNLI, this.jKick[this.animations[5][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 6) {
                this.BB = new BoundingBox(this.x, this.y, this.sKick[this.animations[6][0].currentFrame()].w * PARAMS.CHUNLI, this.sKick[this.animations[6][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 7) {
                this.BB = new BoundingBox(this.x, this.y, this.bKick[this.animations[7][0].currentFrame()].w * PARAMS.CHUNLI, this.bKick[this.animations[7][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 8) {
                this.BB = new BoundingBox(this.x, this.y, this.gHit[this.animations[8][0].currentFrame()].w * PARAMS.CHUNLI, this.gHit[this.animations[8][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 9) {
                this.BB = new BoundingBox(this.x, this.y, this.duck[this.animations[9][0].currentFrame()].w * PARAMS.CHUNLI, this.duck[this.animations[9][0].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 10) {
                this.BB = new BoundingBox(this.x, this.y, this.blocked[this.animations[10][0].currentFrame()].w * PARAMS.CHUNLI, this.blocked[this.animations[10][0].currentFrame()].h * PARAMS.CHUNLI);
            } 
        } else {
                if (this.state === 0){
                this.BB = new BoundingBox (this.x, this.y, this.idle[this.animations[0][1].currentFrame()].w * PARAMS.CHUNLI, this.idle[this.animations[0][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 1) {
                this.BB = new BoundingBox (this.x, this.y, this.walk[this.animations[1][1].currentFrame()].w * PARAMS.CHUNLI, this.walk[this.animations[1][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 2) {
                this.BB = new BoundingBox(this.x, this.y, this.jump[this.animations[2][1].currentFrame()].w * PARAMS.CHUNLI, this.jump[this.animations[2][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 3) {
                this.BB = new BoundingBox(this.x, this.y, this.punch[this.animations[3][1].currentFrame()].w * PARAMS.CHUNLI, this.punch[this.animations[3][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 4) {
                this.BB = new BoundingBox(this.x, this.y, this.kick[this.animations[4][1].currentFrame()].w * PARAMS.CHUNLI, this.kick[this.animations[4][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 5) {
                this.BB = new BoundingBox(this.x, this.y, this.jKick[this.animations[5][1].currentFrame()].w * PARAMS.CHUNLI, this.jKick[this.animations[5][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 6) {
                this.BB = new BoundingBox(this.x, this.y, this.sKick[this.animations[6][1].currentFrame()].w * PARAMS.CHUNLI, this.sKick[this.animations[6][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 7) {
                this.BB = new BoundingBox(this.x, this.y, this.bKick[this.animations[7][1].currentFrame()].w * PARAMS.CHUNLI, this.bKick[this.animations[7][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 8) {
                this.BB = new BoundingBox(this.x, this.y, this.gHit[this.animations[8][1].currentFrame()].w * PARAMS.CHUNLI, this.gHit[this.animations[8][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 9) {
                this.BB = new BoundingBox(this.x, this.y, this.duck[this.animations[9][1].currentFrame()].w * PARAMS.CHUNLI, this.duck[this.animations[9][1].currentFrame()].h * PARAMS.CHUNLI);
            } else if (this.state === 10) {
                this.BB = new BoundingBox(this.x, this.y, this.blocked[this.animations[10][1].currentFrame()].w * PARAMS.CHUNLI, this.blocked[this.animations[10][1].currentFrame()].h * PARAMS.CHUNLI);
            } 
        }
        
    
    };

    die(){
        if (this.hitPoints === 0){
            this.dead === true;
        }

    };

    update(){

        const TICK = this.game.clockTick;

        //Variables to manipulate the X and Y velocity
        const WALK = 200;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const JUMP_KICK = 100;
        const BIRD_KICK = 50;
        this.block = false;

        //Ground Physics
        if(this.state !== 2){
            //Walking
            if(this.game.D){
                this.velocity.x = WALK;
                this.state = 1;
                this.facing = 0;
            } else if(this.game.A){

                this.velocity.x = -WALK;
                this.facing = 1;
                this.state = 1;
            } else {
                this.velocity.x = 0;
                this.state = 0;
            }
            //Punch, direction does not matter.
            if(this.game.C){
                ASSET_MANAGER.playAsset("./audio/yap.mp3");
                this.state = 3;
                this.velocity.x = 0;
                ASSET_MANAGER.playAsset("./audio/yap.mp3");
                
            }
            //Duck
            if(this.game.S){
                this.state = 9;
                this.velocity.x = 0; 
            }

             //Kick
            if(this.game.P){
                ASSET_MANAGER.playAsset("./audio/burstkick.wav");
                this.state = 6; 
                this.velocity.x = 0;  
            }

            // block
            if(this.game.B){
                this.state = 10;
                this.velocity.x = 0;
                this.block = true;
            }

               // bird kick
            if(this.game.K){
                ASSET_MANAGER.playAsset("./audio/birdKick.mp3");
                this.velocity.y = -BIRD_KICK;
                this.state = 7;
                this.fallAcc = STOP_FALL;
                this.velocity.y = 0;
                this.velocity.x = 0;
            }

            // jump kick
            if(this.game.L){
                this.velocity.y = -JUMP_KICK;
                this.state = 5;
                this.fallAcc = STOP_FALL;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }

            
            //Implementing gravity.
            this.velocity.y += this.fallAcc * TICK;

            //Jump
            if(this.game.W ){
                this.velocity.y = -JUMPING;
                this.state = 2;
                this.fallAcc = STOP_FALL;
            }

               // bird kick
           /* if(this.game.K){
                ASSET_MANAGER.playAsset("./audio/birdKick.mp3");
                this.velocity.y = -BIRD_KICK;
                this.state = 7;
                this.fallAcc = STOP_FALL;
                this.velocity.y = 0;
            }*/

            // jump kick
          /*  if(this.game.L){
                this.velocity.y = -JUMP_KICK;
                this.state = 5;
                this.fallAcc = STOP_FALL;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }*/
            
    

         //air physics     
        } else if(this.state === 2 || this.state === 5) {
            this.velocity.y += this.fallAcc * TICK * PARAMS.CHUNLI;

            //horizontal air physics
            if(this.game.D && !this.game.A){
                this.facing = 0;
                this.velocity.x += FALL_WALK;
            } else if(this.game.A && !this.game.D){
                this.facing = 1;
                this.velocity.x -= FALL_WALK;   
            } else {
            }               
        
      /*  } else if(this.state === 5) {
            this.velocity.y += this.fallAcc * TICK;

            //horizontal air physics
            if(this.game.D && !this.game.A){
                this.facing = 0;
                this.velocity.x += FALL_WALK;
            } else if(this.game.A && !this.game.D){
                this.facing = 1;
                this.velocity.x -= FALL_WALK;   
            } else {
            }     */          
        
        } 

        if(this.hitPoints <= 0){
            this.dead = true;
        } 

        if(opponentDeath){
            if(this.roundCount <= 3 && this.cpuDeathCount <= 3){
                this.elapsed += TICK;
                if(this.elapsed > 2){
                    this.cpuDeathCount++;
                    console.log("Death count for opponent" + this.cpuDeathCount);
                    this.game.addEntity(new RoundManager(this.game, this.roundCount, this.theName, this.opponent, this.map, this.deathCount, this.cpuDeathCount));
                }
            } 
        }
        if(this.dead){
            if(this.roundCount <= 3 && this.deathCount <= 3){
                this.elapsed += TICK;
                if(this.elapsed > 2){
                    this.deathCount++;
                    this.game.addEntity(new RoundManager(this.game, this.roundCount, this.theName, this.opponent, this.map, this.deathCount, this.cpuDeathCount));
                }
            } 
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayerCPU || entity instanceof CatPlayerCPU || entity instanceof ChunLiCPU || entity instanceof BillyLeeCPU)){
                            if(that.state === 3/* && !opponentBlock*/){
                                opponentHitPoints -= .05;
                            } else if(that.state === 6/* && !opponentBlock*/){
                                opponentHitPoints -= .09;
                            } else if (that.state === 7){
                                opponentHitPoints -= .1;
                            } else if (that.state === 5){
                                opponentHitPoints -= .15;
                            }
                        }
            }
        });

        //updating
      //  this.x += this.velocity.x * TICK * PARAMS.CHUNLI;
      //  this.y += this.velocity.y * TICK * PARAMS.CHUNLI;
      //  this.updateBB();
      //  this.collisions();

      //updating
        this.x += this.velocity.x * TICK * PARAMS.CHUNLI;
        this.y += this.velocity.y * TICK * PARAMS.CHUNLI;
        if(this.state === 10){
            this.cX = this.x + this.blocked[this.animations[10][1].currentFrame()].w / 2 * PARAMS.CHUNLI;
            this.cY = this.y + this.blocked[this.animations[10][0].currentFrame()].h / 2 * PARAMS.CHUNLI;
        } else {
            this.cX = this.x + this.walk[this.animations[1][0].currentFrame()].w / 2 * PARAMS.CHUNLI;
            this.cY = this.y + this.walk[this.animations[1][0].currentFrame()].h / 2 * PARAMS.CHUNLI; 
        }
        this.updateBB();
        this.collisions();
        

    };



    collisions(){
        //collisions
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                //Ground Collisions
                if (that.velocity.y > 0) {
                    //Falling Logic - Level1 - Level2 - Ground
                    if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && (that.lastBB.bottom) >= entity.BB.bottom){
                        if(that.state === 0) that.y = entity.BB.bottom - that.idle[that.animations[0][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 1) that.y = entity.BB.bottom - that.walk[that.animations[1][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 2) that.y = entity.BB.bottom - that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 3) that.y = entity.BB.bottom - that.punch[that.animations[3][0].currentFrame()].h * PARAMS.CHUNLI;  
                        else if(that.state === 4) that.y = entity.BB.bottom - that.kick[that.animations[4][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 5) that.y = entity.BB.bottom - that.jKick[that.animations[5][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 6) that.y = entity.BB.bottom - that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 7) that.y = entity.BB.bottom - that.bKick[that.animations[7][0].currentFrame()].h * PARAMS.CHUNLI;  
                        else if(that.state === 8) that.y = entity.BB.bottom - that.gHit[that.animations[8][0].currentFrame()].h * PARAMS.CHUNLI; 
                        else if(that.state === 9) that.y = entity.BB.bottom - that.duck[that.animations[9][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 10) that.y = entity.BB.bottom  - that.blocked[that.animations[10][0].currentFrame()].h * PARAMS.CHUNLI;
                        if(that.state === 2) that.state = 0;  
                        that.velocity.y = 0;
                        that.updateBB();   

                    }

                    //Falling Logic - Level2  - Platform
                    if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                        //  if(that.state === 2) that.state = 0;
                        if(that.state === 0) that.y = entity.BB.top - that.walk[that.animations[0][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 1) that.y = entity.BB.top - that.walk[that.animations[1][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 2) that.y = entity.BB.top - that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 3) that.y = entity.BB.top - that.punch[that.animations[3][0].currentFrame()].h * PARAMS.CHUNLI;  
                        else if(that.state === 4) that.y = entity.BB.top - that.kick[that.animations[4][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 5) that.y = entity.BB.top - that.jKick[that.animations[5][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 6) that.y = entity.BB.top - that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 7) that.y = entity.BB.top - that.bKick[that.animations[7][0].currentFrame()].h * PARAMS.CHUNLI;  
                        else if(that.state === 8) that.y = entity.BB.top - that.gHit[that.animations[8][0].currentFrame()].h * PARAMS.CHUNLI; 
                        else if(that.state === 9) that.y = entity.BB.top - that.duck[that.animations[9][0].currentFrame()].h * PARAMS.CHUNLI;
                        else if(that.state === 10) that.y = entity.BB.top  - that.blocked[that.animations[10][0].currentFrame()].h * PARAMS.CHUNLI;
                        if(that.state === 2) that.state = 0;    
                        that.velocity.y = 0;
                        that.updateBB();                         
                    }


                    //Walking to Right Logic - any level
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                        if(that.state === 0) that.x = entity.BB.right - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 1) that.x = entity.BB.right - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 2) that.x = entity.BB.right - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 3) that.x = entity.BB.right - that.punch[that.animations[3][0].currentFrame()].w * PARAMS.CHUNLI;  
                            else if(that.state === 4) that.x = entity.BB.right - that.kick[that.animations[4][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 5) that.x = entity.BB.right - that.jKick[that.animations[5][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 6) that.x = entity.BB.right - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 7) that.x = entity.BB.right - that.bKick[that.animations[7][0].currentFrame()].w * PARAMS.CHUNLI;  
                            else if(that.state === 8) that.x = entity.BB.right - that.gHit[that.animations[8][0].currentFrame()].w * PARAMS.CHUNLI; 
                            else if(that.state === 9) that.x = entity.BB.right - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.CHUNLI;
                            else if(that.state === 10) that.x = entity.BB.right  - that.blocked[that.animations[10][0].currentFrame()].w * PARAMS.CHUNLI;
                            
                          //  if(that.state === 2) that.state = 0;    
                            that.velocity.x = 0;
                            that.updateBB(); 

                    }
                        //Walking to Left Logic - any level
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                        that.x = entity.BB.left;
                        that.velocity.x = 0;
                        that.updateBB(); 
                    }
                  /*  if((entity instanceof KaratePlayerCPU || entity instanceof CatPlayerCPU || entity instanceof ChunLiCPU || entity instanceof BillyLeeCPU) && that.lastBB.right >= entity.BB.left){
                        if(that.state === 0) that.x = entity.BB.left - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 1) that.x = entity.BB.left - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 2) that.x = entity.BB.left - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 3) that.x = entity.BB.left - that.punch[that.animations[3][0].currentFrame()].w * PARAMS.CHUNLI;  
                        else if(that.state === 4) that.x = entity.BB.left - that.kick[that.animations[4][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 5) that.x = entity.BB.left - that.jKick[that.animations[5][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 6) that.x = entity.BB.left - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 7) that.x = entity.BB.left - that.bKick[that.animations[7][0].currentFrame()].w * PARAMS.CHUNLI;  
                        else if(that.state === 8) that.x = entity.BB.left - that.gHit[that.animations[8][0].currentFrame()].w * PARAMS.CHUNLI; 
                        else if(that.state === 9) that.x = entity.BB.left - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.CHUNLI;
                        else if(that.state === 10) that.x = entity.BB.left  - that.blocked[that.animations[10][0].currentFrame()].w * PARAMS.CHUNLI;

                        that.updateBB();
                    }*/
                  /*  if((entity instanceof KaratePlayerCPU || entity instanceof CatPlayerCPU || entity instanceof ChunLiCPU || entity instanceof BillyLeeCPU) && that.lastBB.left <= entity.BB.right){
                        that.x = entity.BB.right;
                        that.updateBB();
                    }*/
                        
                    }

                         //Air Collisions
                        if(that.velocity.y < 0){
                            //Jumping logic - Level1 - Background
                            if((entity instanceof BackGround) && that.lastBB.bottom <= entity.BB.top){
                                if(that.state === 2) that.y = entity.BB.bottom - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                                that.velocity.y = 0;                              
                                that.updateBB();
                            }
                            //jumping logic - level 2 platform
                            if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                                if(that.state === 2) that.y = entity.BB.bottom;// + that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;
                                else if(that.state === 6) that.y = entity.BB.bottom;// + that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.CHUNLI;
                                else if(that.state === 5) that.y = entity.BB.bottom;
                                else if(that.state === 7) that.y = entity.BB.bottom;                               
                                that.velocity.y = 0;
                                that.updateBB();
                            }

                            // jumping on propeller oil rig
                            if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                                if(that.state === 2) that.y = entity.BB.bottom;// + that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;
                                else if(that.state === 6) that.y = entity.BB.bottom; // + that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.CHUNLI;
                                that.hitPoints -= 2;
                                that.velocity.y = 0;
                                that.updateBB(); 
                            }
                            
                            // side collisions
                            if(entity instanceof Platform && entity.type && that.BB.collide(entity.topBB) && that.BB.collide(entity.bottomBB)){
                                if (that.BB.collide(entity.leftBB)){
                                    
                                    if(that.state === 0) that.x = entity.BB.left - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 1) that.x = entity.BB.left - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 2) that.x = entity.BB.left - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 3) that.x = entity.BB.left - that.punch[that.animations[3][0].currentFrame()].w * PARAMS.CHUNLI;  
                                    else if(that.state === 4) that.x = entity.BB.left - that.kick[that.animations[4][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 5) that.x = entity.BB.left - that.jKick[that.animations[5][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 6) that.x = entity.BB.left - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 7) that.x = entity.BB.left - that.bKick[that.animations[7][0].currentFrame()].w * PARAMS.CHUNLI;  
                                    else if(that.state === 8) that.x = entity.BB.left - that.gHit[that.animations[8][0].currentFrame()].w * PARAMS.CHUNLI; 
                                    else if(that.state === 9) that.x = entity.BB.left - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.CHUNLI;
                                    else if(that.state === 10) that.x = entity.BB.left  - that.blocked[that.animations[10][0].currentFrame()].w * PARAMS.CHUNLI;
                                } 
                            }
                        

                            //Jumping & Kicking to Right - any level
                            if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky || entity instanceof Propeller) && that.lastBB.right >= entity.BB.right){
                                if(that.state === 0) that.x = entity.BB.right - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 1) that.x = entity.BB.right - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 2) that.x = entity.BB.right - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 3) that.x = entity.BB.right - that.punch[that.animations[3][0].currentFrame()].w * PARAMS.CHUNLI;  
                                else if(that.state === 4) that.x = entity.BB.right - that.kick[that.animations[4][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 5) that.x = entity.BB.right - that.jKick[that.animations[5][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 6) that.x = entity.BB.right - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 7) that.x = entity.BB.right - that.bKick[that.animations[7][0].currentFrame()].w * PARAMS.CHUNLI;  
                                else if(that.state === 8) that.x = entity.BB.right - that.gHit[that.animations[8][0].currentFrame()].w * PARAMS.CHUNLI; 
                                else if(that.state === 9) that.x = entity.BB.right - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.CHUNLI;
                                else if(that.state === 10) that.x = entity.BB.right  - that.blocked[that.animations[10][0].currentFrame()].w * PARAMS.CHUNLI;
                               // if(that.state === 2) that.x = entity.BB.right - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI;
                               // that.velocity.y = 0;
                                that.updateBB();
                        }
                            //Jumping & Kicking to Left - any level
                            if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky || entity instanceof Propeller) && that.lastBB.left <= entity.BB.left){
                                if(that.state === 2) that.x = entity.BB.left;
                                else if(that.state === 6) that.x = entity.BB.left;
                                else if(that.state === 5) that.x = entity.BB.left;
                                else if(that.state === 7) that.x = entity.BB.left;                               
                               // that.velocity.y = 0;
                                that.updateBB();
                        }
                    
                    } 
                }
            })
        };

    
    draw(ctx) {

        if(!this.CPU){
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 255 , 60);
            ctx.strokeText(this.name, 255 , 60);
        } else if (this.CPU){
            this.cpuNameCount = this.name.length;
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 759 - (cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (cpuNameCount * 14), 60);
        }


        if(PARAMS.DEBUG && this.facing === 0){
            //Visual CIrcle
            ctx.beginPath();
            ctx.strokeStyle = "Blue";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        } else if (PARAMS.DEBUG && this.facing === 1) {
            ctx.beginPath();
            ctx.save();
            ctx.scale(-1, 1);
            ctx.strokeStyle = "Blue";
            ctx.arc(-this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = "Red";
            ctx.strokeRect(-this.BB.x - this.animations[this.state][this.facing].array[this.animations[this.state][this.facing].currentFrame()].w, this.BB.y, (this.BB.width), this.BB.height);
            ctx.restore();
        } else {

        };

        




        if (this.dead && this.facing === 0) {
            this.deadScene.drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.CHUNLI);
            } else if (this.dead && this.facing === 1){
                ctx.save();
                ctx.scale(-1, 1);
                this.deadScene.drawFrame(this.game.clockTick,ctx, -(this.x) - 70, this.y, PARAMS.CHUNLI);
                ctx.restore();

            }
        else if (this.facing === 0) {
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.CHUNLI);
            this.healthbar.draw(ctx);
    

        } else {
            ctx.save();
            ctx.scale(-1, 1);
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, -(this.x) - this.animations[this.state][this.facing].array[this.animations[this.state][this.facing].currentFrame()].w, this.y, PARAMS.CHUNLI);
            this.healthbar.draw(ctx);
            ctx.restore();
            this.healthbar.draw(ctx);


        }
    
    };
        

    
};