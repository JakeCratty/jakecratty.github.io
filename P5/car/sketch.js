let car;
let carPos;
let sun;
let basePath;
let showAll = true
function preload(){

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // Local environment
      basePath = "/P5/";
    } else {
      // GitHub Pages environment
      basePath = "/P5/";
    }
    car = loadImage(basePath + "car/car.png")
    sun = loadImage(basePath + "car/sun.png")
}

let mainRoad, bgRoad1
function setup()
{
    p5.disableFriendlyErrors = true;
    var cnv = createCanvas(windowWidth, windowHeight);
    if(windowHeight < 500 || windowWidth < 500){
        onMobile = true
    }
    cnv.style('display', 'block')
    background(255)
    rectMode(CENTER)
    imageMode(CENTER)
    car.resize(100, 66)
    sun.resize(150, 150)

    mainRoad = new Terrain(0.002, 400, 200, 3, color(112, 89, 70), color(173, 125, 85), 5)
    bgRoad1 = new Terrain(0.004, 600, 0, 1.5, color(100,60,50), color(150, 100, 65), 5)

}

let shift = 0
let vectorList = []
let height = 500
let amt = 0
function draw()
{    
    background(177, 218, 252)

    if(showAll){
        bgRoad1.updateTerrain()
        bgRoad1.draw()   
    }
    //generate vertices for main path
    mainRoad.updateTerrain()
    
    //draw main path
    mainRoad.draw()

    //update and draw the car
    drawCar()

    //draw exhaust
    updateExhaust()
    drawExhaust()    
    
    //draw the sun
    drawSun()

    fill(0)
    textSize(24)
    text("FPS: " + frameRate().toFixed(2), 50, 50)
}

class Terrain{
    constructor(granularity, scale, yOffset, scrollSpeed, strokeColor, fillColor, vectorDist){
        this.granularity = granularity
        this.scale = scale
        this.yOffset = yOffset
        this.scrollSpeed = scrollSpeed;
        this.color = color
        this.vectorList = []
        this.shift = 0
        this.strokeColor = strokeColor
        this.fillColor = fillColor
        this.vectorDist = vectorDist
    }

    updateTerrain(){
        this.vectorList = []
        for(let i = -25; i < windowWidth+25; i+=this.vectorDist){
            let x = i + this.shift
            let y = noise(x*this.granularity)*this.scale + this.yOffset
            this.vectorList.push(createVector(i, y))
        }
        this.shift += this.scrollSpeed
    }

    draw(){
        stroke(this.strokeColor)
        strokeWeight(7)
        fill(this.fillColor)
        noStroke()
        beginShape(TESS)
            for(let v of this.vectorList){
                vertex(v.x, v.y)
            }
            vertex(windowWidth, windowHeight)
            vertex(0, windowHeight)
            vertex(this.vectorList[0].x, this.vectorList[0].y)
        endShape(CLOSE)
    }
}

function mouseClicked(){
    showAll = !showAll
}

function drawCar(){
    //get angle between vert before and after car
    vertA = mainRoad.vectorList[20]
    vertB = mainRoad.vectorList[30]
    //line(vertA.x, vertA.y, vertB.x, vertB.y)
    let angle = atan2(vertB.y-vertA.y, vertB.x-vertA.x)
    carPos = createVector(mainRoad.vectorList[25].x, mainRoad.vectorList[25].y-19)
    
    //draw the car
    push()
        translate(carPos.x, carPos.y)
        rotate(angle)
        scale(-1, 1)
        image(car, 0, 0)
    pop()
}

function drawSun(){
    push()
        translate(windowWidth-100, 80)
        rotate(amt)
        image(sun, 0, 0)
    pop()
    amt += 0.001
}
function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

let time = 0
let particles = []
function updateExhaust(){
    particleSpawn = createVector(carPos.x-car.width/2, carPos.y+8)
    particleSize = 6
    if(time % 15 == 0){
        particles.push(new Particle(particleSpawn, particleSize))
    }
    time++
}
function drawExhaust(){
    for(particle of particles){
        particle.update()
        particle.draw()
    }
    particles = particles.filter(particle => particle.alpha > 0)
}

class Particle {
    constructor(pos, size){
        this.pos = pos.copy()
        this.size = size
        this.alpha = 255
    }

    update(){
        this.pos.y -= 1
        this.pos.x -= 0.8
        this.alpha -= 5
    }

    draw(){
        stroke(80, this.alpha)
        strokeWeight(1)
        noFill()
        ellipse(this.pos.x, this.pos.y, this.size, this.size)
    }
}