let car;

function preload(){
    car = loadImage('P5/car/car.png')
}

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

}

let shift = 0
let vectorList = []
let height = 500
let amt = 0
function draw()
{    
    background(177, 218, 252)

    //generate vertices for main path
    vectorList = []
    for(i = -25; i < windowWidth+25; i+=25){
        let x = i + shift
        fill(0)
        stroke(0)
        strokeWeight(1)
        let y = noise(x*0.002)*200 + 500
        vectorList.push(createVector(i - (windowWidth/2*0), y))
    }
    shift += 3
    
    //draw main path
    stroke(112, 89, 70)
    strokeWeight(7)
    fill(173, 125, 85)
    beginShape(TESS)
        for(let v of vectorList){
            vertex(v.x, v.y)
        }
        vertex(windowWidth, windowHeight)
        vertex(0, windowHeight)
        vertex(vectorList[0].x, vectorList[0].y)
    endShape(CLOSE)

    fill(100, 250, 60)
    stroke(0)
    strokeWeight(2)

    //get angle between vert 4 and 5
    stroke(0)
    strokeWeight(5)
    vertA = vectorList[3]
    vertB = vectorList[6]
    //line(vertA.x, vertA.y, vertB.x, vertB.y)
    let angle = atan2(vertB.y-vertA.y, vertB.x-vertA.x)

    push()
    translate(vectorList[4].x, vectorList[4].y-10)
    rotate(angle)
    image(car, 0, 0)
    pop()
    amt += 0.02
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked(){


}
