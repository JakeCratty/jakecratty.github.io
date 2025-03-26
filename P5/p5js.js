
var b;
var ballList = [];
var particleList = [];
var time = 0;
function setup()
{
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block')
    background(0)
    for(i = 0; i < 25; i++)
        ballList.push(new Ball())
}

function draw()
{
    time++;
    background("#21dbde")
    ballList.forEach(ball => update(ball));
    particleList.forEach(particle => {
        particle.show()
        particle.move()
    });
    if(time % 100 == 0){
        ballList.push(new Ball())
    }
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

function mouseClicked(){
    let mousePos = createVector(mouseX, mouseY)
    let ballFound = false;
    let ball;
    ballListSortedById = [...ballList].sort((a, b) => b.id - a.id).reverse()
    for(i = ballListSortedById.length - 1; i >= 0 ; i--){
        ball = ballListSortedById[i];
        ballPos = createVector(ball.x, ball.y)
        if(ballPos.dist(mousePos) <= ball.diameter/2)
        {
            ballFound= true;
            ballIndex = ballList.indexOf(ball)
            break;
        }
    }
    if(ballFound){
        ballList.splice(ballIndex, 1)
        particleEffect(ball)
    }

}

function particleEffect(ball){
    for(i = 0; i < 100; i++){
        particleList.push(new Particle(ball.x, ball.y, ball.color, ball.diameter))
    }
}

class Particle{
    constructor(x, y, color, diameter){
        let newX = random(-diameter/2.0, diameter/2.0);
        let newY = random(-diameter/2.0, diameter/2.0);
        let finalPos = createVector(newX, newY).normalize().mult(random(-diameter/2.0, diameter/2.0))
        this.x = x + finalPos.x
        this.y = y + finalPos.y
        this.color = color;
        this.diameter = diameter/10.0;
        this.dir = createVector(this.x, this.y).sub(createVector(x, y)).normalize()
        this.lifetime = 255
        this.speed = 5
        console.log("Creating new particle with diameter: " + this.diameter)
    }
    move(){
        this.lifetime-=3;
        this.x += this.dir.x * this.speed
        this.y += this.dir.y * this.speed
        this.speed *= 0.98
    }
    show(){
        this.color.setAlpha(this.lifetime)
        let strokeColor = color(0)
        strokeColor.setAlpha(this.lifetime)
        stroke(strokeColor)
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter)
    }
}

let ballTotal = 0
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
        this.id = ballTotal;
        ballTotal++;
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
        stroke(0)
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter)
    }
}
