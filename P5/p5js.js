//
var b;
var ballList = [];
function setup()
{
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block')
    background(0)
    for(i = 0; i < 20; i++)
        ballList.push(new Ball())
}

function draw()
{
    background("#21dbde")
    ballList.forEach(ball => update(ball));
}

function update(b)
{
    b.show()
    b.move()
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight); 
}

class Ball
{

    constructor()
    {
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.xspeed = random(2, 6);
        this.yspeed = random(2, 6)
        this.diameter = random(100, 500);
        this.isMovingRight = true
        this.isMovingDown = true
        let r = random(255)
        let g = random(255)
        let b = random(255)
        console.log(r)
        this.color = color(r,g,b)
    }

    move()
    {
        if(this.isMovingDown)
            this.y+=this.yspeed
        else
            this.y-=this.yspeed
        if(this.isMovingRight)
            this.x+=this.xspeed
        else
            this.x-=this.xspeed
        if(this.x+this.diameter/2>=windowWidth)
            this.isMovingRight = false;
        if(this.x-this.diameter/2<=0)
            this.isMovingRight = true
        
        if(this.y+this.diameter/2>=windowHeight)
            this.isMovingDown=false
        if(this.y-this.diameter/2<=0)
            this.isMovingDown=true
    }

    show()
    {
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter)
    }
}
