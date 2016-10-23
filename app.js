/*
 * Get the Lime (Stone)!
 *
 * Click on the map to move your game piece and touch the blocks to collect
 * them.  It's rather simple so there is no loading screen, no win state, etc.
 *
 * Copyright 2016 Jeffrey Kyllo
 */

/*
 * Click coordinate translation from http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element#5932203
 */
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function rungame(target) {
    var Vector2 = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.distance = function(other) {
            return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
        };
    }
    var Person = function(pos) {
        this.pos = pos || new Vector2();
        this.color = "#00f";
        this.clickx = this.pos.x;
        this.clicky = this.pos.y;

        this.update = function(game) {
            dx = this.clickx - this.pos.x - 10;
            dy = this.clicky - this.pos.y - 10;
            if(dx != 0) dx /= Math.abs(dx);
            if(dy != 0) dy /= Math.abs(dy);
            this.pos.x += dx;
            this.pos.y += dy;

            var o = this;
            game.entities.forEach(function(other) {
                if(other != o &&o.pos.distance(other.pos) < 10) {
                    game.collect(other);
                }
            });
        };

        this.draw = function(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
            ctx.fill();
        };
    };

    var LimeStone = function(pos) {
        this.pos = pos || new Vector2();
        this.color = "#990";
        this.size = new Vector2(16,4);

        this.update = function() {
        };

        this.draw = function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
        };
    };

    var canvas = document.getElementById(target);

    canvas.onclick = function(e) {
        coords = canvas.relMouseCoords(e);
        game.click(coords.x, coords.y);
    };

    var ctx = canvas.getContext("2d");

    var Game = function(ctx) {
        this.ctx = ctx;

        this.entities = Array();
        this.collected = Array();
        this.add = function(e) {
            this.entities.push(e);
        };

        this.remove = function(e) {
            var f = this.entities.filter(function(el) {
                return el != e;
            });
            this.entities = f;
        };

        this.collect = function(e) {
            game.remove(e);
            game.collected.push(e);
        };

        this.p = new Person(new Vector2(20, 20));
        this.add(this.p);

        for(var i = 0; i < 100; i++) {
            this.add(new LimeStone(new Vector2(Math.random() * 800, Math.random() * 600)));
        }

        this.update = function() {
            var o = this;
            this.entities.forEach(function(e) { 
                e.update(o);
            });
        };

        this.draw = function() {
            var o = this;
            o.ctx.fillStyle = "#555";
            o.ctx.fillRect(0, 0, 800, 600);
            this.entities.forEach(function(e) { 
                e.draw(o.ctx);
            });

            var i = 600;
            this.collected.forEach(function(e) {
                e.pos.x = 390;
                e.pos.y = i;
                i -= 5;

                e.draw(o.ctx);
            });
        };

        this.click = function(x, y) {
            this.p.clickx = x;
            this.p.clicky = y;
        };
    };

    var game = new Game(ctx);

    var animate = function() {
        game.update();
        game.draw();
        window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
}
