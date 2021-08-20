class KaratePlayerCPU extends KaratePlayer{
    constructor(game, x, y, player, blue, theName){
        super(game,x,y, blue);
        this.CPUSTATE ={
            ATTACK: false,
            TRAVEL: false,
            DEATH: false,
            AIR: true
        };
        Object.assign(this,{game,x,y, theName});
        this.other = player;
        opponentBlock = false;

        //Setting up Character
        this.name = theName;
        this.facing = this.FACING.LEFT;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 300;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;
        this.travel = 0;
        this.damage;

        this.updateBBCPU();
        this.loadAnimations();
    };
    updateBBCPU(){
        this.lastBB = this.BB;
        //if(this.CPUSTATE.TRAVEL){
            if(this.state === this.STATE.IDLE && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RIDLE[0].w * PARAMS.SCALE, KPstate.RIDLE[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.IDLE && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LIDLE[1].w * PARAMS.SCALE, KPstate.LIDLE[0].h * PARAMS.SCALE); 
            } else if(this.state === this.STATE.WALK && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RWALK[0].w * PARAMS.SCALE, KPstate.RWALK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.WALK && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LWALK[0].w * PARAMS.SCALE, KPstate.LWALK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.ROLL && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RROLL[0].w * PARAMS.SCALE, KPstate.RROLL[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.ROLL && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LROLL[0].w * PARAMS.SCALE, KPstate.LROLL[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.PUNCH && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RPUNCH[0].w * PARAMS.SCALE -20, KPstate.RPUNCH[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.PUNCH && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x+20, this.y, KPstate.LPUNCH[0].w * PARAMS.SCALE-20, KPstate.LPUNCH[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.KICK && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RKICK[1].w * PARAMS.SCALE-20, KPstate.RKICK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.KICK && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x+20, this.y, KPstate.LKICK[0].w * PARAMS.SCALE-20, KPstate.LKICK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.DUCK && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RDUCK[0].w * PARAMS.SCALE, KPstate.RDUCK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.DUCK && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LDUCK[0].w * PARAMS.SCALE, KPstate.LDUCK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.JUMP && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RJUMP[0].w * PARAMS.SCALE, KPstate.RJUMP[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.JUMP && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LJUMP[0].w * PARAMS.SCALE, KPstate.LJUMP[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.BLOCK && this.facing === this.FACING.RIGHT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.RBLOCK[0].w * PARAMS.SCALE, KPstate.RBLOCK[0].h * PARAMS.SCALE);
            } else if(this.state === this.STATE.BLOCK && this.facing === this.FACING.LEFT){
                this.BB = new BoundingBox(this.x, this.y, KPstate.LBLOCK[0].w * PARAMS.SCALE, KPstate.LBLOCK[0].h * PARAMS.SCALE);
            }
        //}
    };
    randomAttackGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    randomTravelGen(){
        this.travel = Math.floor(Math.random() * Math.floor(2));
    }
    randomDamage(){
        var x = Math.floor(Math.random() * Math.floor(3));
        switch(x){
            case 0:
                this.damage = .04;
                break;
            case 1:
                this.damage = .06;
                break;
            case 2:
                this.damage = .08;
                break;
        }
    };
    update(){
        opponentBlock = false;
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const BLIND_WALK = 50;
        const WALK = 75;
        const FALL_WALK = 1;
        const ROLL = 100;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomAttackGen(); 
            this.randomTravelGen();
            this.randomDamage();
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.CPUSTATE.AIR === false  && this.CPUSTATE.DEATH !== true){
            this.midpoint = this.x + (KPstate.RIDLE[0].w / 2 * PARAMS.SCALE);
            this.otherMidpoint = this.other.cX;
            this.position = this.otherMidpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);
            //This takes what side he is on and makes him go after opponent.
            this.travelInit();

            //Implementing gravity.
            this.velocity.y += this.fallAcc * TICK;
            if(this.jumpDist > 100 && this.VisCircle()){
                this.CPUSTATE.AIR = true;
                this.velocity.y = -JUMPING;
                this.state = this.STATE.JUMP;
                this.fallAcc = STOP_FALL;
                this.CPUSTATE.WALK =false;
            }
        //air physics     
        } else if(this.CPUSTATE.AIR === true && this.CPUSTATE.DEATH !== true) { 
            this.state = this.STATE.JUMP;
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }

        if(this.hitPoints <= 0){
            this.CPUSTATE.DEATH = true;
            this.velocity.y = -100;
            this.velocity.x = 0;
            opponentDeath = true;
        } 
        if(this.CPUSTATE.DEATH === true){
            this.state = this.STATE.DEAD;
        }
        if(this.other.hitPoints === 0){
            this.velocity.x = 0;
            this.state = this.STATE.IDLE;
            this.CPUSTATE.ATTACK = false;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){

                            if(that.other.velocity.x > 0 || that.other.velocity.x < 0){
                                that.travelInit();
                                that.x = entity.BB.right;
                            } else {
                                // if(that.CPUSTATE.TRAVEL) that.x = entity.BB.right;
                                // if(that.CPUSTATE.ATTACK)that.x = entity.BB.right-20;//-20
                                that.x = entity.BB.right-20;
                                that.CPUSTATE.ATTACK = true;
                                if(that.CPUSTATE.ATTACK === true){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        if(!that.other.block){
                                            that.other.hitPoints -= that.damage;
                                        }
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        if(!that.other.block){
                                            that.other.hitPoints -= that.damage;
                                        }
                                    }
                                }
                            }
                            that.updateBBCPU();
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.other.velocity.x > 0 || that.other.velocity.x < 0){
                                that.travelInit();
                                if(that.state === that.STATE.WALK)that.x = entity.BB.left - KPstate.RWALK[0].w * PARAMS.SCALE;
                                if(that.state === that.STATE.ROLL) that.x = entity.BB.left - KPstate.RROLL[0].w * PARAMS.SCALE;
                            } else {
                                // if(that.state === that.STATE.KICK) that.x = entity.BB.left - KPstate.RKICK[0].w * PARAMS.SCALE-20;//-20
                                // if(that.state === that.STATE.PUNCH) that.x = entity.BB.left - KPstate.RPUNCH[0].w * PARAMS.SCALE-20;   
                                that.CPUSTATE.ATTACK = true;
                                if(that.CPUSTATE.ATTACK){
                                        if(that.attack === 0){
                                            that.state = that.STATE.PUNCH;
                                            that.x = entity.BB.left - KPstate.RPUNCH[0].w * PARAMS.SCALE+20; 
                                            if(!that.other.block){
                                                that.other.hitPoints -= that.damage;
                                            } 
                                        } else if(that.attack === 1){
                                            that.state = that.STATE.KICK;
                                            that.x = entity.BB.left - KPstate.RKICK[0].w * PARAMS.SCALE+20;
                                            if(!that.other.block){
                                                that.other.hitPoints -= that.damage;
                                            }
                                        } 
                                    
                                }
                                that.updateBBCPU();
                            }
                    }
                }
        });

        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.updateCircleCPU();
        this.updateBBCPU();
        this.collisionsCPU();
    };
    travelInit(){
        const BLIND_WALK = 50;
        const WALK = 75;
        const ROLL = 100;
        if(this.position < 0){
            this.facing = this.FACING.LEFT;
            this.CPUSTATE.TRAVEL = true;
            if(this.travel === 0){
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.travel === 1){
                this.state = this.STATE.ROLL;
                this.velocity.x = -ROLL;
            }
        } else if(this.position > 0){
            this.facing = this.FACING.RIGHT;
            this.CPUSTATE.TRAVEL = true;
            if(this.travel === 0){
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            } else if(this.travel === 1){
                this.state = this.STATE.ROLL;
                this.velocity.x = ROLL;
            }
        }
    };
    updateCircleCPU(){
        if(this.state === this.STATE.IDLE){
            this.cX = this.x + KPstate.RIDLE[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RIDLE[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.WALK){
            this.cX = this.x + KPstate.RWALK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RWALK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.ROLL){
            this.cX = this.x + KPstate.RROLL[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RROLL[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.PUNCH){
            this.cX = this.x + KPstate.RPUNCH[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RPUNCH[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.KICK){
            this.cX = this.x + KPstate.RKICK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RKICK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.JUMP){
            this.cX = this.x + KPstate.RJUMP[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RJUMP[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.DUCK){
            this.cX = this.x + KPstate.RDUCK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RDUCK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === this.STATE.BLOCK){
            this.cX = this.x + KPstate.RBLOCK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RBLOCK[0].h / 2 * PARAMS.SCALE;
        }
    };
    collisionsCPU(){
        //collisions
        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    //Ground Collisions
                    if (that.velocity.y > 0) {
                        //Falling Logic - Level1 - Level2 - Ground
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && that.lastBB.bottom >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR === true){
                                that.state = that.STATE.IDLE; 
                                that.CPUSTATE.AIR = false;
                            } 
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.bottom - KPstate.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.bottom - KPstate.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.ROLL) that.y = entity.BB.bottom - KPstate.RROLL[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.bottom - KPstate.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.bottom - KPstate.RPUNCH[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom - KPstate.RKICK[0].h * PARAMS.SCALE; 
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.bottom - KPstate.RBLOCK[0].h * PARAMS.SCALE;                           
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Falling Logic - Level2  - Platform
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                            if(that.CPUSTATE.AIR === true){
                                that.state = that.STATE.IDLE; 
                                that.CPUSTATE.AIR = false;
                            } 
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.top - KPstate.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.top - KPstate.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.ROLL) that.y = entity.BB.top - KPstate.RROLL[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.top - KPstate.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.top - KPstate.RPUNCH[0].h * PARAMS.SCALE;  
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.top - KPstate.RKICK[0].h * PARAMS.SCALE; 
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.top - KPstate.RBLOCK[0].h * PARAMS.SCALE;            
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Walking to Right Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.right - KPstate.RWALK[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.ROLL) that.x = entity.BB.right - KPstate.RROLL[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.right - KPstate.RPUNCH[0].w * PARAMS.SCALE;
                            else if(that.CPUSTATE.AIR) that.x = entity.BB.right - KPstate.RJUMP[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.right - KPstate.RKICK[0].w * PARAMS.SCALE;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                        //Walking to Left Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.left; 
                            else if(that.state === that.STATE.ROLL) that.x = entity.BB.left;
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.left;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.left;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                    }
                    //Air Collisions
                    if(that.velocity.y < 0){
                        //Jumping logic - Level2 - Platform
                        if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + KPstate.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + KPstate.RKICK[0].h * PARAMS.SCALE;
                            that.velocity.y = 0;
                            that.updateBB();
                        }
                        if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + KPstate.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + KPstate.RKICK[0].h * PARAMS.SCALE;
                            opponentHitPoints -= 2;
                            that.velocity.y = 0;
                            that.updateBB(); 
                        }
                        //Jumping & Kicking to Right - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.CPUSTATE.AIR) that.x = (entity.BB.right - (KPstate.RJUMP[0].w * PARAMS.SCALE));
                            that.updateBB();
                        }
                        //Jumping & Kicking to Left - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.CPUSTATE.AIR) that.x = entity.BB.left;
                            that.updateBB();
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.right >= entity.BB.left){
                            if(that.CPUSTATE.AIR)that.state = that.STATE.JUMP;
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.left <= entity.BB.right){
                                if(that.CPUSTATE.AIR)that.state = that.STATE.JUMP;
                        }
                    }
                } 
        });        
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual Circle
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Bounding Box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
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
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.SCALE);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};



/*
Cat Player is removed when Player collides with right side.
Animations are phasing.
He doesnt fall when loaded into map.
he floats for first half. 
*/
class CatPlayerCPU extends catplayer{
    constructor(game, x, y, player, theName){
        super(game,x,y);
        this.CPUSTATE ={
            ATTACK: false,
            WALKING: false,
            DEATH: false,
            AIR: true
        };
        Object.assign(this,{game,x,y, theName});
        this.other = player;

        //Setting up Character
        this.name = this.theName;
        this.facing = 1;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 100;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;
        this.damage;

        this.updateBB();
        this.loadAnimations();
    };
    randomGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    randomDamage(){
        var x = Math.floor(Math.random() * Math.floor(3));
        switch(x){
            case 0:
                this.damage = .04;
                break;
            case 1:
                this.damage = .06;
                break;
            case 2:
                this.damage = .08;
                break;
        }
    };
    update(){
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const BLIND_WALK = 50;
        const WALK = 75;
        const FALL_WALK = 1;
        const ROLL = 100;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomGen(); 
            this.randomDamage();
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.CPUSTATE.AIR !== true && this.CPUSTATE.DEATH !== true){
            this.midpoint = this.x + (KPstate.RIDLE[0].w / 2 * PARAMS.SCALE);
            this.otherMidpoint = this.other.cX;
            this.position = this.otherMidpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);
            //console.log("Position " + Math.abs(this.position));
            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = 1;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.position > 0){
                this.facing = 0;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            } 

        //Implementing gravity.
        this.velocity.y += this.fallAcc * TICK;
        if(this.jumpDist > 100 && this.VisCircle()){
            this.CPUSTATE.AIR = true;
            this.velocity.y = -JUMPING;
            this.state = 6;
            this.fallAcc = STOP_FALL;
            this.CPUSTATE.WALK =false;
        }
        //air physics     
        } else if(this.CPUSTATE.AIR === true && this.CPUSTATE.DEATH !== true) { 
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }
        if(this.hitPoints <= 0){
            this.CPUSTATE.DEATH = true;
            this.state = 7;
            this.velocity.x = 0;
            opponentDeath = true;
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE; //gravity 
        } 
        if(this.CPUSTATE.DEATH === true){
            this.state = 7;
        }
        if(this.other.hitPoints === 0){
            this.velocity.x = 0;
            this.state = 0;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            if(that.CPUSTATE.WALKING) that.x = entity.BB.right;
                            if(that.CPUSTATE.ATTACK)that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.attack === 0){
                                    that.state = 4;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                } else if(that.attack === 1){
                                    that.state = 5;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                }
                            }
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.state === 1)that.x = entity.BB.left - (19 * PARAMS.SCALE);
                            if(that.CPUSTATE.ATTACK){
                                //console.log("Does cat player CPU enter this branch?");
                                if(that.state === 5) that.x = entity.BB.left - that.other.width1 * PARAMS.SCALE;
                                if(that.state === 4) that.x = entity.BB.left - that.other.width1 * PARAMS.SCALE;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                    if(that.attack === 0){
                                        that.state = 4;
                                        if(!that.other.block){
                                            that.other.hitPoints -= that.damage;
                                        }
                                    } else if(that.attack === 1){
                                        that.state = 5;
                                        if(!that.other.block){
                                            that.other.hitPoints -= that.damage;
                                        }
                                    }
                            }
                    }
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.updateCircleCPU();
        this.updateBB();
        this.collisionsCPU();
    };
    updateCircleCPU(){
        if(this.state === 0){
            this.cX = this.x + KPstate.RIDLE[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RIDLE[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === 1){
            this.cX = this.x + KPstate.RWALK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RWALK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === 4){
            this.cX = this.x + KPstate.RPUNCH[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RPUNCH[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === 5){
            this.cX = this.x + KPstate.RKICK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RKICK[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === 6){
            this.cX = this.x + KPstate.RJUMP[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RJUMP[0].h / 2 * PARAMS.SCALE; 
        }else if(this.state === 3){
            this.cX = this.x + KPstate.RBLOCK[0].w / 2 * PARAMS.SCALE;
            this.cY = this.y + KPstate.RBLOCK[0].h / 2 * PARAMS.SCALE;
        }
    };
    collisionsCPU(){
        //Collisions 
        let that = this;
        this.game.entities.forEach(function (entity){
            if (that !== entity && entity.BB && that.BB.collide(entity.BB)){
                //Ground Collisions
                if(that.velocity.y > 0){
                    if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && that.lastBB.bottom >=entity.BB.bottom){
                        
                        if(that.CPUSTATE.AIR === true){
                            that.state = 0; 
                            that.CPUSTATE.AIR = false;
                        } 
                        if(that.state === 0) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.colAdj1);
                        else if(that.state === 1) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.walkAdjust);
                        else if(that.state === 3) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.blockAdjust);
                        else if(that.state === 4) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.punchAdjust);
                        else if(that.state === 5) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.kickAdjust); 
                        else if(that.state === 7 && that.facing === 1) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.deathAdj);      
                        else if(that.state === 7 && that.facing === 0) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.deathAdj2);                           
                        that.velocity.y = 0;
                        that.updateBB(); 
                    }

                    //Falling logic for Platform Level 2 and Properller platform Level 3
                    if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                        
                        if(that.CPUSTATE.AIR === true){
                            that.state = 0; 
                            that.CPUSTATE.AIR = false;
                        } 
                        if(that.state === 0) that.y = entity.BB.top - ((that.height2 - 1) * PARAMS.SCALE);
                        else if(that.state === 1) that.y = entity.BB.top - (that.height2 * PARAMS.SCALE);
                        else if(that.state === 3) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);
                        else if(that.state === 4) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);  
                        else if(that.state === 5) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);             
                        that.velocity.y = 0;
                        that.updateBB();                         
                    }
                    //Walking to Right Logic - Level1 - Level2
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky ) && that.BB.right >= entity.BB.right){
                        
                        if(that.state == 1) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        else if(that.state === 4) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        else if(that.state === 6) that.x = entity.BB.right - (that.width2 * PARAMS.SCALE); //+5
                        else if(that.state === 5) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        else if(that.state === 3) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        that.velocity.x = 0;
                        that.updateBB();
                    }
                    //Walking to Left Logic - Level1 - Level2
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                        
                        if(that.state === 1) that.x = entity.BB.left; 
                        else if(that.state === 4) that.x = entity.BB.left;
                        else if(that.state === 5) that.x = entity.BB.left;
                        else if(that.state === 3) that.x = entity.BB.left;
                        that.velocity.x = 0;
                        that.updateBB();
                    }
                }

                //AirCollisons
                if(that.velocity.y < 0){
                    //Jumping logic - Level2 - Platform
                    if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                        if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + (that.height1 * PARAMS.SCALE);
                        else if(that.state == 5) that.y = entity.BB.bottom + (that.height1 * PARAMS.SCALE);
                        that.velocity.y = 0;
                        that.updateBB();
                    }
                    //Jumping & Kicking to Right - Level2 - Level1
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                        if(that.CPUSTATE.AIR) that.x = entity.BB.right - (that.width2 * PARAMS.SCALE);
                        that.updateBB();
                    }
                    //Jumping & Kicking to Left - Level2 - Level1
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                        if(that.CPUSTATE.AIR) that.x = entity.BB.left;
                        that.updateBB();
                    }

                    if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                        if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + (that.height2 * PARAMS.SCALE);
                        else if(that.state === 5) that.y = entity.BB.bottom + (that.height2 * PARAMS.SCALE);
                        that.hitPoints -= 2;
                        that.velocity.y = 0;
                        that.updateBB(); 
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right/* && that.position < 0*/){
                            if(that.CPUSTATE.AIR) that.state = 6;
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left/* && that.position > 0*/){
                            if(that.CPUSTATE.AIR)that.state = 6;

                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.bottom >= entity.BB.top/* && that.position > 0*/){
                            if(that.CPUSTATE.AIR)that.state = 6;

                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.top <= entity.BB.bottom/* && that.position > 0*/){
                            if(that.CPUSTATE.AIR)that.state = 6;

                    }
                }
            }
        });
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual Circle
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Bounding Box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
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
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx ,this.x,this.y, 3);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};


class ChunLiCPU extends ChunLi{
    constructor(game, x, y, player, theName){
        super(game, x, y);
        this.CPUSTATE = {
            ATTACK: false,
            WALKING: false,
            DEATH: false,
            AIR: true
        };
        Object.assign(this,{game, x, y, theName});
        this.other = player;

        //Setting up Character
        this.name = this.theName;
        this.facing = 1;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 562.5;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;

        this.updateBB();
        this.loadAnimations();
    };
    randomGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    update(){
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const WALK = 200;
        const BLIND_WALK = 150;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const JUMP_KICK = 100;
        const BIRD_KICK = 50;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomGen(); 
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.CPUSTATE.AIR === false  && this.CPUSTATE.DEATH !== true){
            this.CPUSTATE.AIR = false;
            this.midpoint = this.x + (this.idle[this.animations[0][0].currentFrame()].w / 2 * PARAMS.CHUNLI);
            this.otherMidpoint = this.other.cX;
            this.position = this.otherMidpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);

            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = 1;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.position > 0){
                this.facing = 0;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            }
            
        //Implementing gravity.
        this.velocity.y += this.fallAcc * TICK * PARAMS.CHUNLI;
        if(this.jumpDist > 100 && this.VisCircle()){
            this.CPUSTATE.AIR = true;
            this.velocity.y = -JUMPING;
            this.state = 2;
            this.fallAcc = STOP_FALL;
            this.CPUSTATE.WALK =false;
        }
        //air physics     
        } else if(this.CPUSTATE.AIR === true && this.CPUSTATE.DEATH !== true) { 
            this.velocity.y += this.fallAcc * TICK * PARAMS.CHUNLI;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }
        if(this.hitPoints <= 0){
            this.CPUSTATE.DEATH = true;
            this.velocity.y = -100;
            this.velocity.x = 0;
            opponentDeath = true;
        } 
        if(this.CPUSTATE.DEATH === true){
            this.state = 11;
            this.velocity.y = 0;
        }
        if(this.other.dead === true){
            this.velocity.x = 0;
            this.state = 0;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if(that.velocity.y > 0){
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && (that.lastBB.bottom) >= entity.BB.bottom){
                            //console.log("IS she colliding with ground?");
                            that.CPUSTATE.AIR = false;
                        }
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                            that.CPUSTATE.AIR = false;
                        }
                    }

                    // CPU facing left
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.attack === 0){
                                    that.state = 3;
                                    if(!that.other.block){
                                        that.other.hitPoints -= .04;
                                    }
                                } else if(that.attack === 1){
                                    that.state = 6;
                                    if(!that.other.block){
                                        that.other.hitPoints -= .04;
                                    }
                                }
                                }
                                that.updateBB();
                            }
                    
                    // CPU facing right
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.CPUSTATE.WALKING === true) that.x = entity.BB.left - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.CHUNLI;
                            if(that.CPUSTATE.ATTACK){
                                if(that.state === 3) that.x = entity.BB.left - that.punch[that.animations[3][0].currentFrame()].w * PARAMS.CHUNLI;
                                if(that.state === 4) that.x = entity.BB.left - that.kick[that.animations[4][0].currentFrame()].w * PARAMS.CHUNLI;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                if(that.attack === 0){
                                    that.state = 3;
                                    if(!that.other.block){
                                        that.other.hitPoints -= .04;
                                    }
                                } else if(that.attack === 1){
                                    that.state = 4;
                                    if(!that.other.block){
                                        that.other.hitPoints -= .04;
                                    }
                                }
                            }
                            that.updateBB();
                        }

                    
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.CHUNLI;
        this.y += this.velocity.y * TICK * PARAMS.CHUNLI;
        this.cX = this.x + this.walk[this.animations[1][0].currentFrame()].w / 2 * PARAMS.CHUNLI;
        this.cY = this.y + this.walk[this.animations[1][0].currentFrame()].h / 2 * PARAMS.CHUNLI;
        this.updateBB();
        this.collisionsCPU();
    };

    collisionsCPU(){
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

                           //Side Logic - Level2/3  - Platform/Propeller
                         /*  if((entity instanceof Platform || entity instanceof Propeller) && that.BB.collide(entity.topBB) && that.BB.collide(entity.bottomBB)){
                                if (that.BB.collide(entity.leftBB)) {
                                    if(that.state === 2) that.x = entity.BB.left - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI; 
                                that.velocity.x = 0;                      
                            } else {
                                if(that.state === 2) that.x = entity.BB.right;  
                                that.velocity.x = 0;
                            }
                            that.updateBB();
                    } */

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
                         /*   if(that.state === 0) that.x = entity.BB.left;
                            else if(that.state === 1) that.x = entity.BB.left;
                            else if(that.state === 2) that.x = entity.BB.left;
                            else if(that.state === 3) that.x = entity.BB.left;  
                            else if(that.state === 4) that.x = entity.BB.left;
                            else if(that.state === 5) that.x = entity.BB.left;
                            else if(that.state === 6) that.x = entity.BB.left;
                            else if(that.state === 7) that.x = entity.BB.left;  
                            else if(that.state === 8) that.x = entity.BB.left; 
                            else if(that.state === 9) that.x = entity.BB.left;
                            else if(that.state === 10) that.x = entity.BB.left;
                          //  if(that.state === 2) that.state = 0;    */
                            that.velocity.x = 0;
                            that.updateBB(); 
                        }
                        
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
                                that.velocity.y = 0;
                                that.updateBB();
                        }
                            //Jumping & Kicking to Left - any level
                            if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky || entity instanceof Propeller) && that.lastBB.left <= entity.BB.left){
                                if(that.state === 2) that.x = entity.BB.left;
                                else if(that.state === 6) that.x = entity.BB.left;
                                else if(that.state === 5) that.x = entity.BB.left;
                                else if(that.state === 7) that.x = entity.BB.left;                               
                                that.velocity.y = 0;
                                that.updateBB();
                        }
                           
                    } 
                }
            })
        };
    draw(ctx){
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
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }

    if (this.facing === 0) {
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
       // this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.CHUNLI);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};

class BillyLeeCPU extends BillyLee{
    constructor(game, x, y, player, theName){
        super(game, x, y);
        this.CPUSTATE = {
            ATTACK: false,
            WALKING: false,
            DEATH: false,
            AIR: true
        };
        Object.assign(this,{game, x, y, theName});
        this.other = player;

        //Setting up Character
        this.name = this.theName;
        this.facing = 1;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 562.5;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;
        this.damage;

        this.updateBB();
        this.loadAnimations();
    };
    randomGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    randomDamage(){
        var x = Math.floor(Math.random() * Math.floor(3));
        switch(x){
            case 0:
                this.damage = .04;
                break;
            case 1:
                this.damage = .06;
                break;
            case 2:
                this.damage = .08;
                break;
        }
    };
    update(){
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const WALK = 200;
        const BLIND_WALK = 150;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const JUMP_KICK = 100;
        const BIRD_KICK = 50;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomGen(); 
            this.randomDamage();
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.CPUSTATE.AIR === false  && this.CPUSTATE.DEATH !== true){
            this.CPUSTATE.AIR = false;
            this.midpoint = this.x + (this.idle[this.animations[0][0].currentFrame()].w / 2 * PARAMS.BL);
            this.otherMidpoint = this.other.cX;
            this.position = this.otherMidpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);

            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = 1;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.position > 0){
                this.facing = 0;
                this.CPUSTATE.WALKING = true;
                this.state = 1;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            }
            
        //Implementing gravity.
        this.velocity.y += this.fallAcc * TICK * PARAMS.BL;
        if(this.jumpDist > 100 && this.VisCircle()){
            this.CPUSTATE.AIR = true;
            this.velocity.y = -JUMPING;
            this.state = 2;
            this.fallAcc = STOP_FALL;
            this.CPUSTATE.WALK =false;
        }
        //air physics     
        } else if(this.CPUSTATE.AIR === true && this.CPUSTATE.DEATH !== true) { 
            this.velocity.y += this.fallAcc * TICK * PARAMS.BL;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }
        if(this.hitPoints <= 0){
            this.CPUSTATE.DEATH = true;
            this.velocity.y = -100;
            this.velocity.x = 0;
            opponentDeath = true;
        } 
        if(this.CPUSTATE.DEATH === true){
            this.state = 11;
            this.velocity.y = 0;
        }
        if(this.other.dead === true){
            this.velocity.x = 0;
            this.state = 0;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if(that.velocity.y > 0){
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && (that.lastBB.bottom) >= entity.BB.bottom){
                            that.CPUSTATE.AIR = false;
                        }
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                            that.CPUSTATE.AIR = false;
                        }
                    }


                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.attack === 0){
                                    that.state = 3;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                } else if(that.attack === 1){
                                    that.state = 5;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                }
                                }
                            }
                    
                    // player facing right
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.CPUSTATE.WALKING === true) that.x = entity.BB.left - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.BL;
                            if(that.CPUSTATE.ATTACK){
                                if(that.state === 3) that.x = entity.BB.left - that.lPunch[that.animations[3][0].currentFrame()].w * PARAMS.BL;
                                if(that.state === 5) that.x = entity.BB.left - that.kick[that.animations[5][0].currentFrame()].w * PARAMS.BL;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                if(that.attack === 0){
                                    that.state = 3;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                } else if(that.attack === 1){
                                    that.state = 5;
                                    if(!that.other.block){
                                        that.other.hitPoints -= that.damage;
                                    }
                                }
                            }
                        }

                    
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.BL;
        this.y += this.velocity.y * TICK * PARAMS.BL;
        this.cX = this.x + this.walk[this.animations[1][0].currentFrame()].w / 2 * PARAMS.BL;
        this.cY = this.y + this.walk[this.animations[1][0].currentFrame()].h / 2 * PARAMS.BL;
        this.updateBB();
        this.collisionsCPU();
    };    
    collisionsCPU(){
        //collisions
        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    //Ground Collisions
                    if (that.velocity.y > 0) {
                        //Falling Logic - Level1 - Level2 - Ground
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && (that.lastBB.bottom) >= entity.BB.bottom){
                            if(that.state === 0) that.y = entity.BB.bottom - that.idle[that.animations[0][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 1) that.y = entity.BB.bottom - that.walk[that.animations[1][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 2) that.y = entity.BB.bottom - that.rPunch[that.animations[2][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 3) that.y = entity.BB.bottom - that.lPunch[that.animations[3][0].currentFrame()].h * PARAMS.BL;  
                            else if(that.state === 4) that.y = entity.BB.bottom - that.sPunch[that.animations[4][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 5) that.y = entity.BB.bottom - that.kick[that.animations[5][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 6) that.y = entity.BB.bottom - that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 7) that.y = entity.BB.bottom - that.gHit[that.animations[7][0].currentFrame()].h * PARAMS.BL;  
                            else if(that.state === 8) that.y = entity.BB.bottom - that.jump[that.animations[8][0].currentFrame()].h * PARAMS.BL; 
                            else if(that.state === 9) that.y = entity.BB.bottom - that.duck[that.animations[9][0].currentFrame()].h * PARAMS.BL;
                            else if(that.state === 10) that.y = entity.BB.bottom - that.blocked[that.animations[10][0].currentFrame()].h * PARAMS.BL;
                            if(that.state === 8) that.state = 0;           
                            that.velocity.y = 0;
                            that.updateBB();   

                        }

                         //Falling Logic - Level2  - Platform
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                          //  if(that.state === 2) that.state = 0;
                        if(that.state === 8) that.state = 0;
                          if(that.state === 0) that.y = entity.BB.top - that.idle[that.animations[0][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 1) that.y = entity.BB.top - that.walk[that.animations[1][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 2) that.y = entity.BB.top - that.rPunch[that.animations[2][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 3) that.y = entity.BB.top - that.lPunch[that.animations[3][0].currentFrame()].h * PARAMS.BL;  
                          else if(that.state === 4) that.y = entity.BB.top - that.sPunch[that.animations[4][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 5) that.y = entity.BB.top - that.kick[that.animations[5][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 6) that.y = entity.BB.top - that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 7) that.y = entity.BB.top - that.gHit[that.animations[7][0].currentFrame()].h * PARAMS.BL;  
                          else if(that.state === 8) that.y = entity.BB.top - that.jump[that.animations[8][0].currentFrame()].h * PARAMS.BL; 
                          else if(that.state === 9) that.y = entity.BB.top - that.duck[that.animations[9][0].currentFrame()].h * PARAMS.BL;
                          else if(that.state === 10) that.y = entity.BB.top - that.blocked[that.animations[10][0].currentFrame()].h * PARAMS.BL;
                      // if(that.state === 8) that.state = 0;           
                        that.velocity.y = 0;
                        that.updateBB();                        
                        }

                           //Side Logic - Level2/3  - Platform/Propeller
                         /*  if((entity instanceof Platform || entity instanceof Propeller) && that.BB.collide(entity.topBB) && that.BB.collide(entity.bottomBB)){
                                if (that.BB.collide(entity.leftBB)) {
                                    if(that.state === 2) that.x = entity.BB.left - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.CHUNLI; 
                                that.velocity.x = 0;                      
                            } else {
                                if(that.state === 2) that.x = entity.BB.right;  
                                that.velocity.x = 0;
                            }
                            that.updateBB();
                    } */

                         //Walking to Right Logic - any level
                         if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.state === 0) that.x = entity.BB.right - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 1) that.x = entity.BB.right - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 2) that.x = entity.BB.right - that.rPunch[that.animations[2][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 3) that.x = entity.BB.right - that.lPunch[that.animations[3][0].currentFrame()].w * PARAMS.BL;  
                            else if(that.state === 4) that.x = entity.BB.right - that.sPunch[that.animations[4][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 5) that.x = entity.BB.right - that.kick[that.animations[5][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 6) that.x = entity.BB.right - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 7) that.x = entity.BB.right - that.gHit[that.animations[7][0].currentFrame()].w * PARAMS.BL;  
                            else if(that.state === 8) that.x = entity.BB.right - that.jump[that.animations[8][0].currentFrame()].w * PARAMS.BL; 
                            else if(that.state === 9) that.x = entity.BB.right - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.BL;
                            else if(that.state === 10) that.x = entity.BB.right - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.BL;
                        //  if(that.state === 8) that.state = 0;           
                            that.velocity.x = 0;
                            that.updateBB(); 

                        }
                        //Walking to Left Logic - any level
                         if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                             that.x = entity.BB.left;
                         /*   if(that.state === 0) that.x = entity.BB.left;
                            else if(that.state === 1) that.x = entity.BB.left;
                            else if(that.state === 2) that.x = entity.BB.left;
                            else if(that.state === 3) that.x = entity.BB.left;  
                            else if(that.state === 4) that.x = entity.BB.left;
                            else if(that.state === 5) that.x = entity.BB.left;
                            else if(that.state === 6) that.x = entity.BB.left;
                            else if(that.state === 7) that.x = entity.BB.left;  
                            else if(that.state === 8) that.x = entity.BB.left; 
                            else if(that.state === 9) that.x = entity.BB.left;
                            else if(that.state === 10) that.x = entity.BB.left;
                          //  if(that.state === 2) that.state = 0;    */
                            that.velocity.x = 0;
                            that.updateBB(); 
                        }
                        
                    }

                         //Air Collisions
                        if(that.velocity.y < 0){
                            //Jumping logic - Level1 - Background
                            if((entity instanceof BackGround) && that.lastBB.bottom <= entity.BB.top){
                                if(that.state === 8) that.y = entity.BB.bottom - that.jump[that.animations[2][0].currentFrame()].w * PARAMS.BL;
                                that.velocity.y = 0;                              
                                that.updateBB();
                            }
                            //jumping logic - level 2 platform
                          /*  if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                                if(that.state === 8) that.y = entity.BB.bottom;// + that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;                              
                                else if (that.state === 3) that.y = entity.BB.bottom;
                                else if (that.state === 5) that.y = entity.BB.bottom;
                                that.velocity.y = 0;
                                that.updateBB();
                            } */

                            if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                                if(that.CPUSTATE.AIR) that.y = entity.BB.bottom; /*+ that.jump[that.animations[8][0].currentFrame()].h * PARAMS.BL;*/
                                else if(that.state === 5) that.y = entity.BB.bottom; /*+ that.kick[that.animations[5][0].currentFrame()].h * PARAMS.BL;*/
                                that.velocity.y = 0;
                                that.updateBB();
                            }

                            // jumping on propeller oil rig
                           /* if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                                if(that.state === 8) that.y = entity.BB.bottom;// + that.jump[that.animations[2][0].currentFrame()].h * PARAMS.CHUNLI;
                                else if(that.state === 6) that.y = entity.BB.bottom; // + that.sKick[that.animations[6][0].currentFrame()].h * PARAMS.CHUNLI;
                                that.hitPoints -= 2;
                                that.velocity.y = 0;
                                that.updateBB(); 
                            }*/

                            if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                                if(that.CPUSTATE.AIR) that.y = entity.BB.bottom;
                                else if(that.state === 5) that.y = entity.BB.bottom;
                                opponentHitPoints -= 2;
                                that.velocity.y = 0;
                                that.updateBB(); 
                            }

                            //Jumping & Kicking to Right - any level
                            if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky || entity instanceof Propeller) && that.lastBB.right >= entity.BB.right){
                                if(that.state === 0) that.x = entity.BB.right - that.idle[that.animations[0][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 1) that.x = entity.BB.right - that.walk[that.animations[1][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 2) that.x = entity.BB.right - that.rPunch[that.animations[2][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 3) that.x = entity.BB.right - that.lPunch[that.animations[3][0].currentFrame()].w * PARAMS.BL;  
                                else if(that.state === 4) that.x = entity.BB.right - that.sPunch[that.animations[4][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 5) that.x = entity.BB.right - that.kick[that.animations[5][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 6) that.x = entity.BB.right - that.sKick[that.animations[6][0].currentFrame()].w * PARAMS.BL;
                                else if(that.state === 7) that.x = entity.BB.right - that.gHit[that.animations[7][0].currentFrame()].w * PARAMS.BL;  
                                else if(that.state === 8) that.x = entity.BB.right - that.jump[that.animations[8][0].currentFrame()].w * PARAMS.BL; 
                                else if(that.state === 9) that.x = entity.BB.right - that.duck[that.animations[9][0].currentFrame()].w * PARAMS.BL;
                                that.velocity.y = 0;
                                that.updateBB();
                        }
                            //Jumping & Kicking to Left - any level
                            if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky || entity instanceof Propeller) && that.lastBB.left <= entity.BB.left){
                                if(that.state === 8) that.x = entity.BB.left;
                                that.velocity.y = 0;
                                that.updateBB();
                        }
                
                    } 
                }
            })
        };
    draw(ctx){
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
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }

    if (this.facing === 0) {
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.BL);
        this.healthbar.draw(ctx);


    } else {
        ctx.save();
        ctx.scale(-1, 1);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, -(this.x) - this.animations[this.state][this.facing].array[this.animations[this.state][this.facing].currentFrame()].w, this.y, PARAMS.BL);
        this.healthbar.draw(ctx);
        ctx.restore();
        this.healthbar.draw(ctx);
       

    } 
       // this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.CHUNLI);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};

class GokuCPU extends Goku{
    constructor(game, x, y, player, theName){
        super(game,x,y);
        this.CPUSTATE ={
            ATTACK: false,
            TRAVEL: false,
            DEATH: false,
            AIR: true
        };
        Object.assign(this,{game,x,y, theName});
        this.other = player;
        opponentBlock = false;

        //Setting up Character
        this.name = theName;
        this.facing = this.FACING.LEFT;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 300;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;
        this.travel = 0;
        this.damage;

        this.updateBB();
        this.loadAnimations();
    };
    randomAttackGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    randomDamage(){
        var x = Math.floor(Math.random() * Math.floor(3));
        switch(x){
            case 0:
                this.damage = .04;
                break;
            case 1:
                this.damage = .06;
                break;
            case 2:
                this.damage = .08;
                break;
        }
    };
    randomTravelGen(){
        this.travel = Math.floor(Math.random() * Math.floor(2));
    }
    update(){
        opponentBlock = false;
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const BLIND_WALK = 50;
        const WALK = 75;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomAttackGen(); 
            this.randomTravelGen();
            this.randomDamage();
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.CPUSTATE.AIR === false  && this.CPUSTATE.DEATH !== true){
            this.midpoint = this.x + (GokuState.RIDLE[0].w / 2 * PARAMS.SCALE);
            this.otherMidpoint = this.other.cX;
            this.position = this.otherMidpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);
            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = this.FACING.LEFT;
                this.CPUSTATE.TRAVEL = true;
                if(this.travel === 0){
                    this.state = this.STATE.WALK;
                    if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                    if(this.VisCircle())this.velocity.x = -WALK;
                }} else if(this.position > 0){
                this.facing = this.FACING.RIGHT;
                this.CPUSTATE.TRAVEL = true;
                if(this.travel === 0){
                    this.state = this.STATE.WALK;
                    if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                    if(this.VisCircle())this.velocity.x = WALK;
                }} 

            //Implementing gravity.
            this.velocity.y += this.fallAcc * TICK;
            if(this.jumpDist > 100 && this.VisCircle()){
                this.CPUSTATE.AIR = true;
                this.velocity.y = -JUMPING;
                this.state = this.STATE.JUMP;
                this.fallAcc = STOP_FALL;
                this.CPUSTATE.WALK =false;
            }
        //air physics     
        } else if(this.CPUSTATE.AIR === true && this.CPUSTATE.DEATH !== true) { 
            this.state = this.STATE.JUMP;
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }

        if(this.hitPoints <= 0){
            this.CPUSTATE.DEATH = true;
            this.velocity.y = -50;
            this.velocity.x = 0;
            opponentDeath = true;
        } 
        if(this.CPUSTATE.DEATH === true){
            this.state = this.STATE.DEAD;
        }
        if(this.other.dead === true){
            this.velocity.x = 0;
            this.state = this.STATE.IDLE;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            if(that.CPUSTATE.TRAVEL) that.x = entity.BB.right;
                            if(that.CPUSTATE.ATTACK)that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.attack === 0){
                                    that.state = that.STATE.PUNCH;
                                    if(!that.other.block){
                                        console.log("Goku Damage: " + that.damage);
                                        that.other.hitPoints -= that.damage;
                                    }
                                } else if(that.attack === 1){
                                    that.state = that.STATE.KICK;
                                    if(!that.other.block){
                                        console.log("Goku Damage: " + that.damage);
                                        that.other.hitPoints -= that.damage;
                                    }
                                }
                            }
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.CPUSTATE.TRAVEL){
                                if(that.state === that.STATE.WALK)that.x = entity.BB.left - GokuState.RWALK[0].w * PARAMS.SCALE;
                            } 
                            if(that.CPUSTATE.ATTACK){
                                if(that.state === that.STATE.KICK) that.x = entity.BB.left - GokuState.RKICK[0].w * PARAMS.SCALE;
                                if(that.state === that.STATE.PUNCH) that.x = entity.BB.left - GokuState.RPUNCH[0].w * PARAMS.SCALE;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        if(!that.other.block){
                                            console.log("Goku Damage: " + that.damage);
                                            that.other.hitPoints -= that.damage;
                                        } 
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        if(!that.other.block){
                                            console.log("Goku Damage: " + that.damage);
                                            that.other.hitPoints -= that.damage;
                                        }
                                    }
                                
                            }
                    }
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.cX = this.x + GokuState.RWALK[0].w / 2 * PARAMS.SCALE;
        this.cY = this.y + GokuState.RWALK[0].h / 2 * PARAMS.SCALE;
        this.updateBB();
        this.collisionsCPU();
    };
    
    collisionsCPU(){
        //collisions
        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    //Ground Collisions
                    if (that.velocity.y > 0) {
                        //Falling Logic - Level2  - Platform
                        if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                            if(that.CPUSTATE.AIR === true){
                                that.state = that.STATE.IDLE; 
                                that.CPUSTATE.AIR = false;
                            } 
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.top - GokuState.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.top - GokuState.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.top - GokuState.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.top - GokuState.RPUNCH[0].h * PARAMS.SCALE;  
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.top - GokuState.RKICK[0].h * PARAMS.SCALE; 
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.top - GokuState.RBLOCK[0].h * PARAMS.SCALE;            
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Falling Logic - Level1 - Level2 - Ground
                        if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && that.lastBB.bottom >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR === true){
                                that.state = that.STATE.IDLE; 
                                that.CPUSTATE.AIR = false;
                            } 
                            if(that.state === that.STATE.IDLE) that.y = entity.BB.bottom - GokuState.RIDLE[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.WALK) that.y = entity.BB.bottom - GokuState.RWALK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.DUCK) that.y = entity.BB.bottom - GokuState.RDUCK[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.y = entity.BB.bottom - GokuState.RPUNCH[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom - GokuState.RKICK[0].h * PARAMS.SCALE; 
                            else if(that.state === that.STATE.BLOCK) that.y = entity.BB.bottom - GokuState.RBLOCK[0].h * PARAMS.SCALE;                           
                            that.velocity.y = 0;
                            that.updateBB();                         
                        }
                        //Walking to Right Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.right - GokuState.RWALK[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.right - GokuState.RPUNCH[0].w * PARAMS.SCALE;
                            else if(that.CPUSTATE.AIR) that.x = entity.BB.right - GokuState.RJUMP[0].w * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.right - GokuState.RKICK[0].w * PARAMS.SCALE;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                        //Walking to Left Logic - Level1 - Level2
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.left; 
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.left;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.left;
                            that.velocity.x = 0;
                            that.updateBB();
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.right >= entity.BB.left){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.left - GokuState.RWALK[0].w * PARAMS.SCALE;
                            if(that.state === that.STATE.KICK) that.x = entity.BB.left - GokuState.RKICK[0].w * PARAMS.SCALE;
                            if(that.state === that.STATE.PUNCH) that.x = entity.BB.left - GokuState.RPUNCH[0].w * PARAMS.SCALE;
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.left <= entity.BB.right){
                            if(that.state === that.STATE.WALK) that.x = entity.BB.right;
                            if(that.state === that.STATE.KICK) that.x = entity.BB.right;
                            if(that.state === that.STATE.PUNCH) that.x = entity.BB.right;
                        }
                    }
                    //Air Collisions
                    if(that.velocity.y < 0){
                        //Jumping logic - Level2 - Platform
                        if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + GokuState.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + GokuState.RKICK[0].h * PARAMS.SCALE;
                            that.velocity.y = 0;
                            that.updateBB();
                        }
                        if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                            if(that.CPUSTATE.AIR) that.y = entity.BB.bottom + GokuState.RJUMP[0].h * PARAMS.SCALE;
                            else if(that.state === that.STATE.KICK) that.y = entity.BB.bottom + GokuState.RKICK[0].h * PARAMS.SCALE;
                            opponentHitPoints -= 2;
                            that.velocity.y = 0;
                            that.updateBB(); 
                        }
                        //Jumping & Kicking to Right - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.right >= entity.BB.right){
                            if(that.CPUSTATE.AIR) that.x = (entity.BB.right - (GokuState.RJUMP[0].w * PARAMS.SCALE));
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.right - (GokuState.RPUNCH[0].w * PARAMS.SCALE);
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.right - (GokuState.RKICK[0].w * PARAMS.SCALE);
                            that.updateBB();
                        }
                        //Jumping & Kicking to Left - Level2 - Level1
                        if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                            if(that.CPUSTATE.AIR) that.x = entity.BB.left;
                            else if(that.state === that.STATE.PUNCH) that.x = entity.BB.left;
                            else if(that.state === that.STATE.KICK) that.x = entity.BB.left;
                            that.updateBB();
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.right >= entity.BB.left){
                            if(that.CPUSTATE.AIR)that.state = that.STATE.JUMP;
                        }
                        if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee
                            || entity instanceof Goku) && that.lastBB.left <= entity.BB.right){
                                if(that.CPUSTATE.AIR)that.state = that.STATE.JUMP;
                        }
                    }
                } 
        });        
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual Circle
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Bounding Box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
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
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.SCALE);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};
