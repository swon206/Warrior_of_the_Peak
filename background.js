class BackGround {
    constructor(gameEngine, x, y) {
        Object.assign(this, {gameEngine, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/falls.png");
        this.spritesheet1 = ASSET_MANAGER.getAsset("./sprites/round1.png");
        this.animation = new Animator(this.spritesheet, 0, 0, 1024, 576, 8, 0.15, 0, false, true);
        this.animation1 = new Animator(this.spritesheet1, 5, 5, 583, 360, 1, 0.50, 0, false, true);
        this.BB = new BoundingBox(this.x, this.y+191, 1024, 386);
    };
    draw(ctx) {
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        this.animation.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, 1);
        //this.animation1.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, 0.35);
    };
    update() {
    };
};
/**
 * Author: Austin Scott
 * Back Scene: Serves as the background for level 2
 */
class BackScene{
    constructor(game, x, y, w, h){
        Object.assign(this,{game, x, y, w, h});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/waterfallsprite.png");
        this.BB = new BoundingBox(this.x, this.y, this.w,this.h);
    };
    update(){
    };
    draw(ctx){
        ctx.drawImage(this.spritesheet,this.x, this.y, this.w, this.h,this.x, this.y, this.w, this.h);
        //Debug
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width,this.BB.height);
            // ctx.strokeRect(this.rightBB.x, this.rightBB.y, this.rightBB.width,this.rightBB.height);
        }
    };
};

/********************************************
 * Author: Austin Scott                     *
 * Health Bar: Visualizes the Player Health * 
 *******************************************/
class HealthBar{
    constructor(player){
        Object.assign(this,{player});
        this.pX = 50;
        this.pY = 50;
        this.cpuX = 764;
        this.cpuY = 50;
    };
    update(){

    };
    draw(ctx){
        if(!this.player.CPU){
            if(this.player.hitPoints === 0 || this.player.hitPoints < 0){
                this.player.hitPoints = 0;
            }
            var ratio = Math.abs(this.player.hitPoints / this.player.maxHitPoints);
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < .25 ? "Red" : ratio < .75 ? "Yellow" : "Green";
            //Makes it so healthbar depltes fro right to left. 
            ctx.fillRect(this.pX, this.pY, this.pX * 4 * ratio, 10);
            ctx.strokeStyle = rgb(183,3,3);
            ctx.strokeRect(this.pX, this.pY, this.pX * 4, 10);
            
        } else {
            if(opponentHitPoints === 0 || opponentHitPoints < 0){
                opponentHitPoints = 0;
            }
            var ratio = opponentHitPoints / this.player.maxHitPoints;
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < .25 ? "Red" : ratio < .75 ? "Yellow" : "Green";
            //Makes it so Health Bar depletes from left to right
            ctx.fillRect(this.cpuX + ((this.pX * 4) - (this.pX * 4 * ratio)), this.cpuY, this.pX * 4 * ratio, 10);
            ctx.strokeStyle = rgb(183,3,3);
            ctx.strokeRect(this.cpuX, this.cpuY, this.pX * 4, 10);
        }
    };
}


