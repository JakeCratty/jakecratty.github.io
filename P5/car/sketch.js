let car;
let carPos;
let sun, sunPos, moon, moonPos;
let cycleRadius;
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
    moon = loadImage(basePath + "car/moon.png")
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
    moon.resize(150, 150)
    cycleRadius = (windowHeight - 100) - windowHeight/2
    bgRoad1 = new Terrain(0.004, 600, 0, 1, color(80,50,40), color(150, 100, 65), 5)
    bgRoad2 = new Terrain(0.002, 400, 200, 2, color(112, 89, 70), color(173, 125, 85), 5)
    mainRoad = new Terrain(0.001, 200, 400, 5, color(100,60,50), color(190, 160, 125), 5)
    fgRoad = new Terrain(0.001, 200, 500, 9, color(100,60,50), color(210, 180, 145), 5)

}

let shift = 0
let vectorList = []
let height = 500
let amt = 0
function draw()
{    
    background(177, 218, 252)    
    
    //draw the sun and moon
    //drawSunAndMoon()

    if(showAll){
        bgRoad1.updateTerrain()
        bgRoad1.draw()   
        bgRoad2.updateTerrain()
        bgRoad2.draw()   
    }
    //generate vertices for main path
    mainRoad.updateTerrain()
    mainRoad.draw()

    //update and draw the car
    drawCar()

    //draw exhaust
    updateExhaust()
    drawExhaust()

    fgRoad.updateTerrain()
    fgRoad.draw()

    fill(0)
    textSize(24)
    noStroke()
    text("FPS: " + frameRate().toFixed(2), 50, 50)

    dayNightCycle();
}

let timeOfDay = 0;
let dayNightCycleSpeed = 0.5
let timeDirection = 1
function dayNightCycle(){
    timeOfDay += dayNightCycleSpeed * timeDirection
    if(timeOfDay > 255 || timeOfDay < 0){
        timeDirection *= -1
    }
    tintColor = lerpColor(color(255, 100, 50, 0), color(0, 0, 50, 150), map(timeOfDay, 0, 255, 0, 1));
    fill(tintColor)
    rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight)

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
        this.initTerrain()
    }

    initTerrain(){
        for(let x = -25; x < windowWidth+25; x+=this.vectorDist){
            let y = noise(x*this.granularity)*this.scale + this.yOffset
            this.vectorList.push(createVector(x, y))
        }
        console.log("Init terrain: " + this.vectorList.length + " vertices")
    }

    updateTerrain(){
        this.vectorList = this.vectorList.filter(v => v.x > -25)
        this.shift += this.scrollSpeed
        while(this.vectorList[this.vectorList.length-1].x < windowWidth+25){
            let x = this.vectorList[this.vectorList.length-1].x + this.vectorDist
            let y = noise((x + this.shift)*this.granularity)*this.scale + this.yOffset
            this.vectorList.push(createVector(x, y))
        }

        for(let v of this.vectorList){
            v.x -= this.scrollSpeed
        }
    }

    draw(){
        stroke(this.strokeColor)
        strokeWeight(2)
        noStroke()
        fill(this.fillColor)
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


function drawSunAndMoon(){
    //equation of a circle
    //x = r*cos(theta) + h
    //y = r*sin(theta) + k
    //where k,h is the center of the circle
    //and theta is the angle in radians
    // and r is the radius of the circle
    //for example: x = 100*cos(theta) + 200, y = 100*sin(theta) + 200
    //where (200,200) is the center of the circle and 100 is the radius
    //and theta is the angle in radians

    //applying this to the sun and the moon we get
    let sunAngle = ((timeOfDay) / (255)) * TWO_PI; // Map timeOfDay to a full circle (0 to TWO_PI)

    // Calculate the angle for the moon (opposite side of the circle)
    let moonAngle = sunAngle + PI; // Opposite side of the circle (180 degrees apart)

    // Ensure angles stay within 0 to TWO_PI
    sunAngle = sunAngle % TWO_PI;
    moonAngle = moonAngle % TWO_PI;

    // Calculate positions for the sun and moon
    let sunX = cycleRadius * cos(sunAngle) + windowWidth / 2;
    let sunY = cycleRadius * sin(sunAngle) + windowHeight / 2;
    let moonX = cycleRadius * cos(moonAngle) + windowWidth / 2;
    let moonY = cycleRadius * sin(moonAngle) + windowHeight / 2;

    // Update sun and moon positions
    sunPos = createVector(sunX, sunY);
    moonPos = createVector(moonX, moonY);
    image(sun, sunPos.x, sunPos.y)
    image(moon, moonPos.x, moonPos.y)
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