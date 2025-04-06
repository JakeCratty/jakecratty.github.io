//Globals
let car;
let carPos;
let sun, sunPos, moon, moonPos;
let cycleRadius;
let basePath;
let showAll = true;
let time = 0;
let shift = 0
let vectorList = []
let canvasHeight = 500
let amt = 0
let timeOfDay = 0;
let dayNightCycleSpeed = 0.2
let timeDirection = 1
let carMidPoint = 25
let particles = []

let world;
let stars = []

class Terrain{
    constructor(granularity, scale, yOffset, scrollSpeed, strokeColor, fillColor, vectorDist){
        this.granularity = granularity
        this.scale = scale
        this.yOffset = yOffset
        this.initialYOffset = yOffset
        this.desiredYOffset = yOffset - 0
        this.scrollSpeed = scrollSpeed;
        this.terrainColor = color
        this.vectorList = []
        this.shift = 0
        this.strokeColor = strokeColor
        this.fillColor = fillColor
        this.vectorDist = vectorDist
        this.targetTerrain = null
        this.lerpPercent = 0
        this.initTerrain()
    }

    initTerrain(){
        for(let x = -50; x < windowWidth+25; x+=this.vectorDist){
            let y = noise(x*this.granularity)*this.scale + this.yOffset
            this.vectorList.push(createVector(x, y))
        }
    }

    updateTerrain(){
        if(this.targetTerrain != null && this.lerpPercent){
            this.fillColor = lerpColor(this.fillColor, this.targetTerrain.fillColor, this.lerpPercent)
            this.scale = lerp(this.scale, this.targetTerrain.scale, this.lerpPercent)
            this.yOffset = lerp(this.yOffset, this.targetTerrain.yOffset, this.lerpPercent)
            this.scrollSpeed = lerp(this.scrollSpeed, this.targetTerrain.scrollSpeed, this.lerpPercent)
            this.shift = lerp(this.shift, this.targetTerrain.shift, this.lerpPercent)
        }
        //the slower the scroll, the higher the lerp percent
        this.lerpPercent += 0.00001
        console.log(this.lerpPercent)
        if(this.lerpPercent > 1){
            this.lerpPercent = 0
            this.targetTerrain = null
        }
        //randomly shift the terrain up and down
        if(this.yOffset < this.desiredYOffset)
            this.yOffset += 1
        else if(this.yOffset > this.desiredYOffset)
            this.yOffset -= 1

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

class Biome {
    constructor(name, bgRoad1, bgRoad2, mainRoad, fgRoad) {
        this.name = name
        this.bgRoad1 = bgRoad1
        this.bgRoad2 = bgRoad2
        this.mainRoad = mainRoad
        this.fgRoad = fgRoad
    }
}

class World {
    constructor(biome){
        this.biome = biome
        this.bgRoad1 = biome.bgRoad1
        this.bgRoad2 = biome.bgRoad2
        this.mainRoad = biome.mainRoad
        this.fgRoad = biome.fgRoad
    }

    updateBiome(newBiome){
        this.biome = newBiome
        this.bgRoad1 = newBiome.bgRoad1
        this.bgRoad2 = newBiome.bgRoad2
        this.mainRoad = newBiome.mainRoad
        this.fgRoad = newBiome.fgRoad
    }
}

//define biomes and their distinct variables such as color, height, yRange, etc
const biomes = {
}

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

let mainBuffer
function setup()
{
    // Disabling p5.js friendly errors to improve performance. 
    // Note: This may make debugging harder, so ensure this is intentional.
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
    cycleRadius = (canvasHeight - 100) - canvasHeight / 2
    biomes.canyon = new Biome(
        "Canyon",
        bgRoad1 = new Terrain(0.004, 600, 0, 1, color(80,50,40), color(150, 100, 65), 5),
        bgRoad2 = new Terrain(0.002, 400, 200, 2, color(112, 89, 70), color(173, 125, 85), 5),
        mainRoad = new Terrain(0.002, 150, 400, 5, color(100,60,50), color(190, 160, 125), 5),
        fgRoad = new Terrain(0.001, 200, 500, 9, color(112, 89, 70), color(173, 125, 85), 5)
    )
    biomes.forest = new Biome(
        "Forest",
        bgRoad1 = new Terrain(0.002, 100, 350, 0.5, color(80,50,40), color(40, 112, 35), 5),
        bgRoad2 = new Terrain(0.002, 200, 350, 1, color(112, 89, 70), color(54, 138, 48), 5),
        mainRoad = new Terrain(0.001, 50, 420, 5, color(100,60,50), color(74, 166, 68), 5),
        fgRoad = new Terrain(0.001, 30, 500, 9, color(112, 89, 70), color(113, 217, 106), 5)
    )
    //create a beach biome with sandy colors
    biomes.beach = new Biome(
        "Beach",
        bgRoad1 = new Terrain(0.002, 100, 350, 0.5, color(80,50,40), color(40, 112, 35), 5),
        bgRoad2 = new Terrain(0.002, 200, 350, 1, color(112, 89, 70), color(54, 138, 48), 5),
        mainRoad = new Terrain(0.001, 50, 420, 5, color(100,60,50), color(74, 166, 68), 5),
        fgRoad = new Terrain(0.001, 30, 500, 9, color(112, 89, 70), color(113, 217, 106), 5)
    )
    world = new World(biomes.canyon)

    //create a list of star vectors with a lambda function
    stars = Array.from({length: 200}, () => createVector(random(0, windowWidth), random(0, windowHeight/2)))
    rectMode(CENTER)
    imageMode(CENTER)
    colorMode(MULTIPLY)
}

let start = Date.now()
function draw()
{    
    time = Date.now() - start
    if(time > 1000){
        start = Date.now()
        //choose a random biome that is not the current one
        let targetBiome = biomes.forest//random(Object.values(biomes))
        world.mainRoad.targetTerrain = targetBiome.mainRoad
        world.bgRoad1.targetTerrain = targetBiome.bgRoad1
        world.bgRoad2.targetTerrain = targetBiome.bgRoad2
        world.fgRoad.targetTerrain = targetBiome.fgRoad
    }
    background(177, 218, 252)

    for(let star of stars){
        fill(255, 255, 255)
        ellipse(star.x, star.y, 2, 2)
    }
    
    //draw the sun and moon
    //drawSunAndMoon()

    if(showAll){
        world.bgRoad1.updateTerrain()
        world.bgRoad1.draw()   
        world.bgRoad2.updateTerrain()
        world.bgRoad2.draw()   
    }
    //generate vertices for main path
    world.mainRoad.updateTerrain()
    world.mainRoad.draw()

    //update and draw the car
    drawCar()

    //draw exhaust
    updateExhaust()
    drawExhaust()

    world.fgRoad.updateTerrain()
    world.fgRoad.draw()

    fill(0)
    textSize(24)
    noStroke()
    text("FPS: " + frameRate().toFixed(2), 50, 50)

    //dayNightCycle();
    time++
}

function dayNightCycle(){
    timeOfDay += dayNightCycleSpeed * timeDirection
    if(timeOfDay > 255 || timeOfDay < 0){
        timeDirection *= -1
    }
    tintColor = lerpColor(color(255, 100, 50, 0), color(0, 0, 50, 150), map(timeOfDay, 100, 150, 0, 1.0));
    fill(tintColor)
    rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight)

}


function mouseClicked(){
    showAll = !showAll
}

function drawCar(){
    //get angle between vert before and after car
    let vertA = world.mainRoad.vectorList[carMidPoint-5]
    let vertB = world.mainRoad.vectorList[carMidPoint+5]
    //line(vertA.x, vertA.y, vertB.x, vertB.y)
    let angle = atan2(vertB.y-vertA.y, vertB.x-vertA.x)
    carPos = createVector(world.mainRoad.vectorList[carMidPoint].x, world.mainRoad.vectorList[carMidPoint].y-19)
    
    // if(time % 5 == 0){
    //     console.log(time)
    //     carMidPoint += 1
    //     if(carMidPoint > mainRoad.vectorList.length-10){
    //         carMidPoint = 5
    //     }
    // }
    //draw the car
    push()
        translate(carPos.x, carPos.y)
        rotate(angle)
        scale(-1, 1)
        image(car, 0, 0)
        //the rgb code for yellow is (255, 255, 0)
        // noStroke()
        // fill(255, 255, 0)
        // ellipse(-car.width/2+3, 5, 5, 5)
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
function updateExhaust(){
    let particleSize = 6
    
    if(time % 15 == 0){
        let exhaustOffset = createVector(-car.width/2,8)
        let vertA = world.mainRoad.vectorList[20]
        let vertB = world.mainRoad.vectorList[30]
        let angle = atan2(vertB.y-vertA.y, vertB.x-vertA.x)
        let rotatedExhaustOffset = createVector(
            exhaustOffset.x * cos(angle) - exhaustOffset.y * sin(angle),
            exhaustOffset.x * sin(angle) + exhaustOffset.y * cos(angle)
        )
        let particleSpawn = createVector(carPos.x + rotatedExhaustOffset.x, carPos.y + rotatedExhaustOffset.y)
    
        particles.push(new Particle(particleSpawn, particleSize))
    }
}
function drawExhaust(){
    for(let particle of particles){
        particle.update()
        particle.draw()
    }
    particles = particles.filter(particle => particle.alpha > 0)
}