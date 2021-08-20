class Animator2 {
    constructor(spritesheet, array, frameCount, frameDuration, reverse, loop) {
        Object.assign(this, { spritesheet, array, frameCount, frameDuration, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
       
        ctx.drawImage(this.spritesheet,
            this.array[frame].x, this.array[frame].y, //source from sheet
            this.array[frame].w, this.array[frame].h,
            x, y,
            this.array[frame].w * scale,
            this.array[frame].h * scale);

       /* if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        } */
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};