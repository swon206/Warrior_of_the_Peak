/**
 * Author: Austin Scott
 * Brick Tile Set: Self Drawn by me, and serves for the platform in the air
 * and the ground in level 2.   
 */
class Ground {
    constructor(game, x, y, w){
        Object.assign(this, {game, x, y, w});
        this.newy = 626;
        this.height = 64;
        this.BB = new BoundingBox(this.x, this.y - PARAMS.BLOCKWIDTH * 4, this.w, PARAMS.BLOCKWIDTH * 6);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tilesetsprite.png");
    };
    update(){
    };
    draw(ctx){
        //Debug
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        //First layer of brick
        ctx.drawImage(this.spritesheet, 0,32,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.x, this.y,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
        for(var i = PARAMS.BLOCKWIDTH * 2; i < this.w - PARAMS.BLOCKWIDTH*2; i+=PARAMS.BLOCKWIDTH * 2){
            ctx.drawImage(this.spritesheet, 16,32, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, i, this.y, PARAMS.BLOCKWIDTH*2,PARAMS.BLOCKWIDTH*2);        
        }
        ctx.drawImage(this.spritesheet, 32,32,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.w - PARAMS.BLOCKWIDTH * 2, this.y,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
        //Second Layer
        ctx.drawImage(this.spritesheet, 0,16,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.x, this.y - PARAMS.BLOCKWIDTH * 2,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
        for(var i = PARAMS.BLOCKWIDTH * 2 ; i < this.w - PARAMS.BLOCKWIDTH * 2; i+= PARAMS.BLOCKWIDTH * 2){
            ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH , i, this.y - PARAMS.BLOCKWIDTH * 2, PARAMS.BLOCKWIDTH*2,PARAMS.BLOCKWIDTH*2);        
        }
        ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH * 2,PARAMS.BLOCKWIDTH,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.w - PARAMS.BLOCKWIDTH * 2, this.y - PARAMS.BLOCKWIDTH * 2,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
        //Third Layer
        ctx.drawImage(this.spritesheet, 0,0,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.x, this.y - PARAMS.BLOCKWIDTH * 4,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
        for(var i = PARAMS.BLOCKWIDTH * 2 ; i < this.w - PARAMS.BLOCKWIDTH * 2; i+= PARAMS.BLOCKWIDTH * 2){
            ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH,this.x, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH , i, this.y - PARAMS.BLOCKWIDTH * 4, PARAMS.BLOCKWIDTH*2,PARAMS.BLOCKWIDTH*2);        
        }
        ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH * 2,0,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.w - PARAMS.BLOCKWIDTH * 2, this.y - PARAMS.BLOCKWIDTH * 4,PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH*2);
    };      
};
class Platform{
    constructor(game, x, y, w){
        Object.assign(this, {game, x, y, w});
        this.BB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH, this.y, this.w-PARAMS.BLOCKWIDTH*24.5, PARAMS.BLOCKWIDTH * 3);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tilesetsprite.png");  
        
    };
    update(){
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x, this.y, this.w-PARAMS.BLOCKWIDTH*22.5, PARAMS.BLOCKWIDTH * 3);
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        ctx.drawImage(this.spritesheet, 0,64,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.x, this.y,PARAMS.BLOCKWIDTH*3, PARAMS.BLOCKWIDTH*3);
        for(var i = this.x + PARAMS.BLOCKWIDTH * 3; i < this.w - PARAMS.BLOCKWIDTH*3; i += PARAMS.BLOCKWIDTH * 3){
            ctx.drawImage(this.spritesheet, 16,64,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, i, this.y,PARAMS.BLOCKWIDTH*3, PARAMS.BLOCKWIDTH*3);
        }
        ctx.drawImage(this.spritesheet, 32,64,PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,this.w - PARAMS.BLOCKWIDTH*3, this.y,PARAMS.BLOCKWIDTH*3, PARAMS.BLOCKWIDTH*3);
    };
};