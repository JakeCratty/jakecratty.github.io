function setup()
{
    p5.disableFriendlyErrors = true;
    var cnv = createCanvas(windowWidth, windowHeight);
    if(windowHeight < 500 || windowWidth < 500){
        onMobile = true
    }
    cnv.style('display', 'block')
    background(255)
    

}

let shift = 0
let vectorList = []
let height = 500
function draw()
{    
    background(177, 218, 252)
    vectorList = []
    for(i = -25; i < windowWidth + 50; i+=25){
        let x = i + shift
        fill(0)
        stroke(0)
        strokeWeight(1)
        let y = noise(x*0.0005)*1000 + 500
        vectorList.push(createVector(i, y))
    }
    shift += 3
    
    stroke(112, 89, 70)
    strokeWeight(7)
    fill(173, 125, 85)
    beginShape()
        for(i = 0; i < vectorList.length; i++){
            vertex(vectorList[i].x, vectorList[i].y)
        }
        vertex(windowWidth, windowHeight)
        vertex(0, windowHeight)
    endShape()
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked(){


}