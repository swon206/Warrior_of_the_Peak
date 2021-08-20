class OilRig{
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/OILRIG.png");
        this.animations =[];
        this.animations.push(new Animator(this.spritesheet, 0,446, 1024,321,5,.1,10,false, true));
        this.BB = new BoundingBox(0, 463, 1024, 304);
    };
    update(){
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    };
};

class Crane{
    constructor(game, x, y){
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/CRANE.png");
        this.animations =[];
        this.animations.push(new Animator(this.spritesheet, 97,10, 402,309,4,.25,98,false, true));
        this.BB = new BoundingBox(this.x, this.y, 402, 309);

    };
    update(){
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    };
};

class Propeller{
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        this.STATE = {
            IDLE: 0,
            ACTIVE: 1
        }
        this.velocity = {x: 0, y: 0};
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Propeller.png");
        this.animations = [];
        this.animations[this.STATE.IDLE] = (new Animator(this.spritesheet, 143,223, 515,112,1,.1,1,false, true));
        this.animations[this.STATE.ACTIVE] = (new Animator(this.spritesheet, 143,223, 515,112,2,.1,1,false, true));
        this.state = this.STATE.IDLE;
        this.fallAcc =100;
        this.BB = new BoundingBox(this.x +15, this.y, 485, 96);
        this.updateBB();

    }
    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+15, this.y, 485, 96);
    };
    update(){
        const TICK = this.game.clockTick;
        if(this.state !== this.STATE.ACTIVE){
            this.velocity.y += this.fallAcc * TICK;
            if(this.y >= 300){
                this.state = this.STATE.ACTIVE;
                this.velocity.y -= 120;
            }
        } else if (this.state === this.STATE.ACTIVE){
            if(this.y <=110){
                this.state = this.STATE.IDLE;
                //this.velocity.y += this.fallAcc * TICK;
            }
        }

        var that = this;
        this.game.entities.forEach(function(entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof BillyLee 
                    || entity instanceof ChunLi || entity instanceof Goku) && that.lastBB.bottom <= entity.BB.top){
                        entity.hitPoints -= 20;
                }
                if((entity instanceof KaratePlayerCPU || entity instanceof CatPlayerCPU || entity instanceof ChunLiCPU || 
                    entity instanceof BillyLeeCPU || entity instanceof GokuCPU) && that.lastBB.bottom <= entity.BB.top){
                    opponentHitPoints -= 20;
                }
            }
        });
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.updateBB();
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    };
};
class Ocean{
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/OCEAN.png");
        this.w = 1024;
        this.animations = [];
        this.animations.push(new Animator(this.spritesheet, 48,48, PARAMS.BLOCKWIDTH * 3,PARAMS.BLOCKWIDTH,3,3,PARAMS.BLOCKWIDTH,true, true));
    };
    update(){
    };
    draw(ctx){
        if(PARAMS.DEBUG){
        }
        for(var i = 0; i < this.w - PARAMS.BLOCKWIDTH; i += PARAMS.BLOCKWIDTH * 3){
            this.animations[0].drawFrame(this.game.clockTick, ctx, i, this.y, 3);
        }
    };
};
class Sky{
    constructor(game, x, y){
        Object.assign(this, {game,x,y});
  
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/sky.png");
        this.BB = new BoundingBox(this.x, this.y, 1024, 463);
        
    };
    update(){
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        ctx.drawImage(this.spritesheet, this.x, this.y, 1024,719, this.x, this.y, 1024,720);

    };
};