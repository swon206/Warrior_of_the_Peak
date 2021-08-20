class Goku{
    constructor(game, x, y, theName, roundCount, map, deathCount, opponent, cpuDeathCount){
        Object.assign(this, {game, x, y, theName, roundCount, map, deathCount, opponent, cpuDeathCount});
        this.game.Goku = this;

        //Character Details for HUD and game
        this.name = this.theName;
        console.log("Player: " + this.theName);
        this.CPU = false;
        this.deathCount = deathCount;
        this.cpuDeathCount = cpuDeathCount;
        this.elapsed = 0;
        this.blockElapsed = 0;
        this.kameCooldown = 5;
        this.coolDown = 3;
        this.block = false;
        this.time = 0;
        this.counter = 1;

        //This is the falling acceleration for gravity.
        this.fallAcc =100;

        //For the Health Bar
        this.maxHitPoints  = 100;
        //Total hit points taken
        this.hitPoints = 100;
        this.damage = 0.05;

        //Circle so the CPU can detect player
        this.VisRadius = 135;
        this.cX = 0, this.xY = 0;

        //All the goku's movements
        this.STATE = {
            WALK: 0,
            IDLE: 1,
            PUNCH: 2,
            KICK: 3,
            DUCK:  4,
            JUMP:  5,
            POWER: 6,
            BLOCK: 7,
            GHIT: 8,
            BLAST: 9,
            KAME: 10,
            CHARGEKAME: 11,
            DEAD: 12
        };

        //Decides if Facing left or right
        this.FACING = {
            RIGHT:  0,
            LEFT: 1
        };

        //Starting off Falling to the right
        this.facing = this.FACING.RIGHT;
        this.state = this.STATE.JUMP;
        this.changeElapsed = 0;

        //Goku's velocity for movements.
        this.velocity = {
            x:0, 
            y:0
        };

        this.updateBB();
        
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/goku_spritesheet.png");
        this.spritesheet2 = ASSET_MANAGER.getAsset("./sprites/goku_spritesheetmirror.png")
        
        this.animations = [];
        this.loadAnimations();
    };
    randomDamage(){
        var x = Math.floor(Math.random() * Math.floor(3));
        switch(x){
            case 0:
                this.damage = 0.04;
                break;
            case 1:
                this.damage = 0.06;
                break;
            case 2:
                this.damage = 0.08;
                break;
        }
    };

    loadAnimations(){
        //Loads all the animations
        for(var i = 0; i < 13; i++){
            this.animations.push([]);
            for(var j = 0; j < 2; j++){
                this.animations[i].push([]);
            }
        }
        //****** IDLE LEFT & RIGHT *********
        this.animations[this.STATE.IDLE][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RIDLE, 1, 0.175, false, true);
        this.animations[this.STATE.IDLE][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LIDLE, 1, 0.175, false, true);

        //******* WALK LEFT & RIGHT *********
        this.animations[this.STATE.WALK][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RWALK, 2, 0.5, false, true);
        this.animations[this.STATE.WALK][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LWALK, 2, 0.5, false, true);

         //******* Punch Right & LEFT ********
        this.animations[this.STATE.PUNCH][this.FACING.RIGHT] 
            = new Animator2(this.spritesheet, GokuState.RPUNCH, 2, 0.2, false, true);
        this.animations[this.STATE.PUNCH][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LPUNCH, 2, 0.2, false, true);
    
         //******* Kick Right & Left *******
        this.animations[this.STATE.KICK][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RKICK , 3, 0.25, false, true);
        this.animations[this.STATE.KICK][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LKICK, 3, 0.25, false, true);
    
         //****** Duck Left & Right ******
        this.animations[this.STATE.DUCK][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RDUCK, 1, 0.15, false, true);
        this.animations[this.STATE.DUCK][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LDUCK, 1, 0.15, false, true);
    
         //****** Jump Right & Left ******
        this.animations[this.STATE.JUMP][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RJUMP, 1, 0.15, false, true);
        this.animations[this.STATE.JUMP][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LJUMP, 1, 0.15, false, true);

        //****** Block Left & Right ******
        this.animations[this.STATE.BLOCK][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RBLOCK, 1, 0.25, false, true);
        this.animations[this.STATE.BLOCK][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LBLOCK, 1, 0.25, false, true);

        //****** Power Left & Right ******
        this.animations[this.STATE.POWER][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RPOWER, 3, 0.3, false, true);
        this.animations[this.STATE.POWER][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LPOWER, 3, 0.3, false, true);

        //****** Blast Left & Right ******
        this.animations[this.STATE.BLAST][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RBLAST, 2, 0.4, false, true);
        this.animations[this.STATE.BLAST][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LBLAST, 2, 0.4, true, true);

        //****** Kame Left & Right ******
        this.animations[this.STATE.KAME][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RKAME, 1, 1000, false, true);
        this.animations[this.STATE.KAME][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LKAME, 1, 1000, false, true);

        //****** Charge Kame Left & Right ******
        this.animations[this.STATE.CHARGEKAME][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RCHARGEKAME, 1, 1000, false, true);
        this.animations[this.STATE.CHARGEKAME][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LCHARGEKAME, 1, 1000, false, true);

        //****** Get Hit Left & Right ******
        this.animations[this.STATE.GHIT][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RGETHIT, 2, 0.2, false, false);
        this.animations[this.STATE.GHIT][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LGETHIT, 2, 0.2, false, false);

        //****** Dead ******
        this.animations[this.STATE.DEAD][this.FACING.RIGHT]
            = new Animator2(this.spritesheet, GokuState.RDEAD, 1, 0.5, false, true);
        this.animations[this.STATE.DEAD][this.FACING.LEFT]
            = new Animator2(this.spritesheet2, GokuState.LDEAD, 1, 0.5, false, true);
        
    };

    updateBB(){
        this.lastBB = this.BB;
        if(this.state === this.STATE.IDLE && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RIDLE[0].w * PARAMS.SCALE, GokuState.RIDLE[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.IDLE && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LIDLE[0].w * PARAMS.SCALE, GokuState.LIDLE[0].h * PARAMS.SCALE); 
        } else if(this.state === this.STATE.WALK && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RWALK[0].w * PARAMS.SCALE, GokuState.RWALK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.WALK && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LWALK[0].w * PARAMS.SCALE, GokuState.LWALK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.PUNCH && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RPUNCH[0].w * PARAMS.SCALE, GokuState.RPUNCH[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.PUNCH && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LPUNCH[0].w * PARAMS.SCALE, GokuState.LPUNCH[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.KICK && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RKICK[0].w * PARAMS.SCALE, GokuState.RKICK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.KICK && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LKICK[0].w * PARAMS.SCALE, GokuState.LKICK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.DUCK && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RDUCK[0].w * PARAMS.SCALE, GokuState.RDUCK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.DUCK && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LDUCK[0].w * PARAMS.SCALE, GokuState.LDUCK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.JUMP && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RJUMP[0].w * PARAMS.SCALE, GokuState.RJUMP[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.JUMP && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LJUMP[0].w * PARAMS.SCALE, GokuState.LJUMP[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.POWER && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RPOWER[0].w * PARAMS.SCALE, GokuState.RPOWER[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.POWER && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LPOWER[0].w * PARAMS.SCALE, GokuState.LPOWER[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.BLOCK && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RBLOCK[0].w * PARAMS.SCALE, GokuState.RBLOCK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.BLOCK && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LBLOCK[0].w * PARAMS.SCALE, GokuState.LBLOCK[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.GHIT && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RGETHIT[0].w * PARAMS.SCALE, GokuState.RGETHIT[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.GHIT && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LGETHIT[0].w * PARAMS.SCALE, GokuState.LGETHIT[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.BLAST && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RBLAST[0].w * PARAMS.SCALE, GokuState.RBLAST[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.BLAST && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x - 185, this.y, GokuState.LBLAST[0].w * PARAMS.SCALE, GokuState.LBLAST[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.KAME && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RKAME[0].w * PARAMS.SCALE, GokuState.RKAME[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.KAME && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x - 230, this.y, GokuState.LKAME[0].w * PARAMS.SCALE, GokuState.LKAME[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.CHARGEKAME && this.facing === this.FACING.RIGHT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.RCHARGEKAME[0].w * PARAMS.SCALE, GokuState.RCHARGEKAME[0].h * PARAMS.SCALE);
        } else if(this.state === this.STATE.CHARGEKAME && this.facing === this.FACING.LEFT){
            this.BB = new BoundingBox(this.x, this.y, GokuState.LCHARGEKAME[0].w * PARAMS.SCALE, GokuState.LCHARGEKAME[0].h * PARAMS.SCALE);
        }
    };
    
    update(){
        //Variables to manipulate the X and Y velocity
        const WALK = 75;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const DEAD_X = 50;
        const TICK = this.game.clockTick;
        this.coolDown += TICK;
        this.kameCooldown += TICK;
        this.block = false;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 2){
            this.randomDamage();
            this.changeElapsed = 0;
        }
        //Ground Physics
        if(this.state !== this.STATE.JUMP && this.state !== this.STATE.DEAD){
            //Walking
            if(this.game.D){
                ASSET_MANAGER.playAsset("./audio/gokurun.mp3");
                this.velocity.x = WALK;
                this.state = this.STATE.WALK;
                this.facing = this.FACING.RIGHT;
            } else if(this.game.A){
                ASSET_MANAGER.playAsset("./audio/gokurun.mp3");
                this.velocity.x = -WALK;
                this.facing = this.FACING.LEFT;
                this.state = this.STATE.WALK;
            } else {
                this.velocity.x = 0;
                this.state = this.STATE.IDLE;
            }
            //Duck
            if(this.game.S){ 
                this.state = this.STATE.DUCK;
            } 
            //Power
            if(this.game.Q){
                ASSET_MANAGER.playAsset("./audio/gokuaura.mp3");
                ASSET_MANAGER.playAsset("./audio/gokupower.mp3");
                this.state = this.STATE.POWER;
                if(this.hitPoints < 100){
                    this.hitPoints += 0.05;
                } else {
                    this.hitPoints += 0;
                }
            } else{
                ASSET_MANAGER.pauseAsset("./audio/gokuaura.mp3");
                ASSET_MANAGER.pauseAsset("./audio/gokupower.mp3");
            }
            //Punch, direction does not matter.
            if(this.game.C){
                this.state = this.STATE.PUNCH;
                ASSET_MANAGER.playAsset("./audio/gokufastpunches.mp3");
            }else{
                ASSET_MANAGER.pauseAsset("./audio/gokufastpunches.mp3");
            }
            //Kick
            if(this.game.P){
                this.state = this.STATE.KICK;
                ASSET_MANAGER.playAsset("./audio/gokuclash.mp3");
            }else{
                ASSET_MANAGER.pauseAsset("./audio/gokuclash.mp3");
            }
            //Kamehameha
            if(this.game.K){ 
                if(this.kameCooldown >= 5){
                    if(this.time < 8){
                        ASSET_MANAGER.playAsset("./audio/gokubestkame.mp3");
                        this.state = this.STATE.CHARGEKAME;
                        this.velocity.x = 0;
                        this.hitPoints -= 0.05;
                        this.time += TICK;
                            if(this.time >= 3){
                                this.state = this.STATE.KAME;
                            }    
                    } else{
                        this.kameCooldown = 0;
                        this.time = 0;
                        ASSET_MANAGER.pauseAsset("./audio/gokubestkame.mp3");
                    }
                }
            } else{
                this.time = 0;
                ASSET_MANAGER.pauseAsset("./audio/gokubestkame.mp3");
            }
            //Blast
            if(this.game.L){
                this.state = this.STATE.BLAST;
                ASSET_MANAGER.playAsset("./audio/gokukiblast.mp3");
            }else{
                ASSET_MANAGER.pauseAsset("./audio/gokukiblast.mp3");
            }
            //Blocking
            if(this.game.E){
                this.blockElapsed += TICK;
                if(this.coolDown >= 3){
                    if(this.blockElapsed < 3){
                        this.state = this.STATE.BLOCK;
                        this.block = true;
                    } else {
                        this.blockElapsed = 0;
                        this.coolDown = 0;
                    }
                }  
                this.velocity.x = 0;
            }
            //Implementing gravity.
            this.velocity.y += this.fallAcc * TICK;
            //Jump
            if(this.game.W){
                this.velocity.y = -JUMPING;
                this.state = this.STATE.JUMP;
                this.fallAcc = STOP_FALL;
                ASSET_MANAGER.playAsset("./audio/gokujump.mp3");
            }else{
                ASSET_MANAGER.pauseAsset("./audio/gokujump.mp3");
            }

         //air physics     
        } else if(this.state === this.STATE.JUMP && this.state !== this.STATE.DEAD) {
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.game.D && !this.game.A){
                this.facing = this.FACING.RIGHT;
                this.velocity.x += FALL_WALK;
            } else if(this.game.A && !this.game.D){
                this.facing = this.FACING.LEFT;
                this.velocity.x -= FALL_WALK;   
            } else {
            }               
        }

        //Dying
        if(this.hitPoints <= 0){
            if(this.counter === 1){
                ASSET_MANAGER.playAsset("./audio/gokuNO.mp3");
                this.counter++;
            }
            ASSET_MANAGER.pauseAsset("./audio/gokukiblast.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokujump.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokupower.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokubestkame.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokuclash.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokuaura.mp3");
            ASSET_MANAGER.pauseAsset("./audio/gokurun.mp3");
            this.state = this.STATE.DEAD;
            this.velocity.x = 0;
            this.velocity.y = -50;
            this.dead = true;
        } 
        //Round Change
        if(opponentDeath){
            if(this.roundCount <= 3 && this.cpuDeathCount <= 3){
                this.elapsed += TICK;
                if(this.elapsed > 2){
                    this.cpuDeathCount++; 
                    this.game.addEntity(new RoundManager(this.game, this.roundCount, this.theName, this.opponent, this.map, this.deathCount, this.cpuDeathCount));
                }
            } 
        }
        //Death Count
        if(this.state === this.STATE.DEAD){
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
                    if((entity instanceof KaratePlayerCPU || entity instanceof CatPlayerCPU || entity instanceof ChunLiCPU || entity instanceof BillyLeeCPU 
                        || entity instanceof GokuCPU)){
                            if(that.state === that.STATE.PUNCH/* && !opponentBlock*/){
                                opponentHitPoints -= that.damage;
                            } else if(that.state === that.STATE.KICK/* && !opponentBlock*/){
                                opponentHitPoints -= that.damage;
                            } else if(that.state === that.STATE.BLAST/* && !opponentBlock*/){
                                opponentHitPoints -= that.damage * 1.05;
                            } else if(that.state === that.STATE.KAME/* && !opponentBlock*/){
                                if(that.time >= 3){
                                opponentHitPoints -= that.damage * 2.5;
                                } 
                            }  
                        }
            }
        });

        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.updateCircle();
        this.updateBB();
        console.log("Velocity y: " + this.velocity.y);
        this.collisions();
    };

    updateCircle(){
        if(this.state === this.STATE.IDLE){
            this.cX = this.x + GokuState.RIDLE[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RIDLE[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.WALK){
            this.cX = this.x + GokuState.RWALK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RWALK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.ROLL){
            this.cX = this.x + GokuState.RROLL[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RROLL[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.PUNCH){
            this.cX = this.x + GokuState.RPUNCH[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RPUNCH[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.KICK){
            this.cX = this.x + GokuState.RKICK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RKICK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.JUMP){
            this.cX = this.x + GokuState.RJUMP[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RJUMP[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.DUCK){
            this.cX = this.x + GokuState.RDUCK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RDUCK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.BLOCK){
            this.cX = this.x + GokuState.RBLOCK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RBLOCK[0].h / 2 * PARAMS.SCALE;
        }else if(this.state === this.STATE.KAME){
            if(this.facing === this.FACING.LEFT){
                this.cX = this.x + GokuState.RKAME[0].w / 2 * PARAMS.SCALE - 230;
                this.cY = this.y + GokuState.RBLAST[0].h / 2 * PARAMS.SCALE;
            } else {
            this.cX = this.x + GokuState.RKAME[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RKAME[0].h / 2 * PARAMS.SCALE;
            }
        }else if(this.state === this.STATE.BLAST){
            if(this.facing === this.FACING.LEFT){
                this.cX = this.x + GokuState.RKAME[0].w / 2 * PARAMS.SCALE - 185;
                this.cY = this.y + GokuState.RBLAST[0].h / 2 * PARAMS.SCALE;
            } else {
            this.cX = this.x + GokuState.RBLAST[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RBLAST[0].h / 2 * PARAMS.SCALE;
            }
        }else if(this.state === this.STATE.CHARGEKAME){
            this.cX = this.x + GokuState.RCHARGEKAME[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RCHARGEKAME[0].h / 2 * PARAMS.SCALE;
        }else if(this.state === this.STATE.POWER){
            this.cX = this.x + GokuState.RPOWER[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + GokuState.RPOWER[0].h / 2 * PARAMS.SCALE; 
        }
    };


    collisions(){
        //collisions
        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    //Ground Collisions
                    if (that.velocity.y > 0) {
                        //Falling Logic - Level2  - Platform
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                            if(that.state === that.STATE.JUMP) that.state = that.STATE.IDLE;
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.top - GokuState.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.top - GokuState.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.top - GokuState.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.top - GokuState.RPUNCH[0].h * PARAMS.SCALE;  
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.top - GokuState.RKICK[0].h * PARAMS.SCALE;  
                            else if(that.state === that.STATE.POWER) that.y = entity.BB.top - GokuState.RPOWER[0].h * PARAMS.SCALE;     
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.top - GokuState.RBLOCK[0].h * PARAMS.SCALE;           
                            else if(that.state === that.STATE.BLAST) that.y = entity.BB.top - GokuState.RBLAST[0].h * PARAMS.SCALE;     
                            else if(that.state === that.STATE.KAME) that.y = entity.BB.top - GokuState.RKAME[0].h * PARAMS.SCALE;                                
                            else if(that.state === that.STATE.CHARGEKAME) that.y = entity.BB.top - GokuState.RCHARGEKAME[0].h * PARAMS.SCALE;                                
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Falling Logic - Level1 - Level2 - Ground
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && that.lastBB.bottom >= entity.BB.bottom){
                            if(that.state === that.STATE.JUMP) that.state = that.STATE.IDLE;
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.bottom - GokuState.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.bottom - GokuState.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.bottom - GokuState.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.bottom - GokuState.RPUNCH[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom - GokuState.RKICK[0].h * PARAMS.SCALE;   
                            else if(that.state === that.STATE.POWER) that.y = entity.BB.bottom - GokuState.RPOWER[0].h * PARAMS.SCALE;     
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.bottom - GokuState.RBLOCK[0].h * PARAMS.SCALE;           
                            else if(that.state === that.STATE.BLAST) that.y = entity.BB.bottom - GokuState.RBLAST[0].h * PARAMS.SCALE;     
                            else if(that.state === that.STATE.KAME) that.y = entity.BB.bottom - GokuState.RKAME[0].h * PARAMS.SCALE;     
                            else if(that.state === that.STATE.CHARGEKAME) that.y = entity.BB.bottom - GokuState.RCHARGEKAME[0].h * PARAMS.SCALE;     
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Walking to Right Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.right - GokuState.RWALK[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.right - GokuState.RPUNCH[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.JUMP) that.x = entity.BB.right - GokuState.RJUMP[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.right - GokuState.RKICK[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.POWER) that.x = entity.BB.right - GokuState.RPOWER[0].w * PARAMS.SCALE;     
                            else if(that.state === that.STATE.BLOCK) that.x = entity.BB.right - GokuState.RBLOCK[0].w * PARAMS.SCALE;           
                            else if(that.state === that.STATE.BLAST) that.x = entity.BB.right - GokuState.RBLAST[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.x = entity.BB.right - GokuState.RDUCK[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.KAME) that.x = entity.BB.right - GokuState.RKAME[0].w * PARAMS.SCALE;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                        //Walking to Left Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.left; 
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.left;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.left;
                            else if(that.state === that.STATE.POWER) that.x = entity.BB.left;     
                            else if(that.state === that.STATE.BLOCK) that.x = entity.BB.left;           
                            else if(that.state === that.STATE.BLAST) that.x = entity.BB.left;
                            else if(that.state === that.STATE.DUCK) that.x = entity.BB.left;
                            else if(that.state === that.STATE.KAME) that.x = entity.BB.left;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                    }
                    //Air Collisions
                    if(that.velocity.y < 0){
                        //Jumping logic - Level2 - Platform
                        if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                            if(that.state === that.STATE.JUMP) that.y = entity.BB.bottom + GokuState.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + GokuState.RKICK[0].h * PARAMS.SCALE;
                            that.updateBB();
                        }
                        if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                            if(that.state === that.STATE.JUMP) that.y = entity.BB.bottom + GokuState.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + GokuState.RKICK[0].h * PARAMS.SCALE;
                            that.hitPoints -= 2;
                            that.updateBB(); 
                        }
                        //Jumping & Kicking to Right - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.state === that.STATE.JUMP) that.x = entity.BB.right - GokuState.RJUMP[0].w * PARAMS.SCALE;
                            that.updateBB();
                        }
                        //Jumping & Kicking to Left - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.state === that.STATE.JUMP) that.x = entity.BB.left;
                            that.updateBB();
                        }
                    }
                } 
        });        
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual CIrcle
            ctx.beginPath();
            ctx.strokeStyle = "Blue";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        };
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
        if(this.state === this.STATE.BLAST && this.facing === this.FACING.LEFT){
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x-185, this.y, PARAMS.SCALE);
        } else if(this.state === this.STATE.KAME && this.facing === this.FACING.LEFT){
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x-230, this.y, PARAMS.SCALE);
        } else {
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.SCALE);
        }
    };
};