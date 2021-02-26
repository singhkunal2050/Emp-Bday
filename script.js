"use strict";
class Firework {
    constructor(app) {
        this.app = app;
        this.rnd = app.rnd;
        this.bursts = [];
        this.reset();
    }
    reset() {
        this.color = `hsl(${this.rnd.int(360)},90%,50%)`;
        this.alive = true;
        this.bursting = false;
        this.pos = new Vec(this.rnd.int(0, this.app.w), this.app.h + 40);
        this.vel = new Vec(0, -this.rnd.real(16.0, this.app.h / 40));
        this.acc = new Vec(0, 0);
        this.size = this.rnd.real(0.5, 2.5);
        this.emoji = this.rnd.pick(this.app.emojis);
    }
    applyForce(f) {
        this.vel.add(f);
    }
    update() {
        this.applyForce(this.app.forces.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if (this.vel.y > 1) {
            this.bursting = true;
            const maxBursts = 35;
            const numBursts = this.rnd.chance(5) ? this.rnd.int(10, maxBursts) : this.rnd.int(20, 30);
            for (let i = 1; i < numBursts; i++) {
                this.bursts.push(new Burst(this.pos, this));
            }
        }
    }
    draw() {
        const ctx = this.app.ctx;
        if (!this.bursting) {
            this.update();
            ctx.save();
            ctx.font = "3em Montserrat red";
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.fillText("Happy Birthday",document.getElementById('cnv').width/2, document.getElementById('cnv').height/2);
            ctx.font = "1em Arial red";
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.fillText("Wishing You Lots Of Success this Year!",document.getElementById('cnv').width/2, document.getElementById('cnv').height/2+40);
            
            
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}em sans-serif`;
            ctx.fillText(this.emoji, this.pos.x, this.pos.y);
            //ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
            ctx.restore();
        }
        else {
            this.bursts.forEach(burst => {
                if (!burst.alive) {
                    without(this.bursts, burst);
                    if (this.bursts.length === 0) {
                        this.alive = false;
                    }
                }
                burst.draw();
            });
        }
    }
}
class Burst {
    constructor(origin, firework) {
        this.firework = firework;
        this.app = firework.app;
        this.pos = origin.clone();
        this.rnd = firework.rnd;
        this.lifespan = this.rnd.int(5, 50);
        this.vel = new Vec(this.rnd.real(-8.0, 8.0), this.rnd.real(-8.0, 8.0));
        this.acc = new Vec(0, 0);
        this.color = this.firework.color;
        this.size = this.rnd.real(0.5, 15.0);
        const sparkle = this.rnd.chance(20) ? 2 : 1;
        this.sizeStep = this.size / (this.lifespan / sparkle);
        this.alive = true;
        this.rotate = this.rnd.real(0, Math.PI * 2);
    }
    applyForce(f) {
        this.vel.add(f);
    }
    update() {
        this.applyForce(this.app.forces.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        //this.size -= this.sizeStep;
        //this.rotate += 0.1;
    }
    draw() {
        const ctx = this.app.ctx;
        this.update();
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotate);
        ctx.font = `${this.firework.size / 2}em sans-serif`;
        ctx.fillText(this.firework.emoji, 0, 0);
        ctx.restore();
        this.lifespan--;
        if (this.lifespan <= 0) {
            this.alive = false;
        }
    }
}
class App {
    constructor() {
        this.ctx = document.getElementById('cnv').getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        this.rnd = new Random();
        this.fireworks = [];
        this.forces = {
            gravity: new Vec(0, .25)
        };
        this.emojis = ['🎺', '🎁', '👻', '😍', '👀', '🤪', '💥', '⚡️', '🎉', '🎈', '🥳'];
        window.requestAnimationFrame((t) => { this.draw(t); });
        log(this);
    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    }
    clearIt() {
        //this.ctx.clearRect(0,0,this.w,this.h);
        this.ctx.save();
        this.ctx.fillStyle = 'hsla(220,60%,10%,0.12)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.restore();
    }
    draw(t) {
        this.clearIt();
        window.requestAnimationFrame((t) => { this.draw(t); });
        if (this.rnd.chance(this.w / 200)) {
            this.fireworks.push(new Firework(this));
        }
        this.fireworks.forEach(f => {
            if (!f.alive) {
                without(this.fireworks, f);
            }
            //log(this.fireworks.length)
            f.draw();
        });
    }
    initEvents() {
        window.onresize = (e) => { this.sizeCanvas(e); };
    }
}
const foo = 'dsdsa';
const log = console.log.bind(console);
const Vec = TinyVector;
document.addEventListener('DOMContentLoaded', function () {
    const app = new App();
});
function without(arr, el) {
    arr.splice(arr.indexOf(el), 1);
}
