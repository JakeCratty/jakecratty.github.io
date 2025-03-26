
var b;
var ballList = [];
var particleList = [];
var time = 0;
let startTime = Date.now()
let deltaTime = 0
let ballTotal = 0
let onMobile = false
let numParticles = 100
function setup()
{
    p5.disableFriendlyErrors = true;
    var cnv = createCanvas(windowWidth, windowHeight);
    if(windowHeight < 500 || windowWidth < 500)){
        onMobile = true
        numParticles = 50
    }
    cnv.style('display', 'block')
    background(0)
    for(i = 0; i < 3; i++)
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

    particleList = particleList.filter(particle => particle.lifetime > 0)

    if(ballList.length>0){
        if(time % 100 == 0){
            ballList.push(new Ball())
        }

        deltaTime = Date.now() - startTime 
    }else{
        textSize(32)
        fill('purple')
        stroke(0)
        strokeWeight(2)
        text("Bubbles Popped: " + ballTotal, windowWidth/2-50, windowHeight/2)
    }
    textSize(24)
    fill(255)
    stroke(0)
    strokeWeight(2)
    text("Time: " + truncate(deltaTime/1000), 100, 100)
}

function truncate(time){
    return time
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
    for(i = 0; i < numParticles; i++){
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
        this.speedMod = random(0.95, 0.99)
    }
    move(){
        this.lifetime-=3;
        this.x += this.dir.x * this.speed
        this.y += this.dir.y * this.speed
        this.speed *= this.speedMod
    }
    show(){
        if(this.speed < 0.5)
        {
            this.lifetime = 0
        }
        this.color.setAlpha(this.lifetime)
        let strokeColor = color(0)
        strokeColor.setAlpha(this.lifetime)
        stroke(strokeColor)
        noStroke()
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter)
    }
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
