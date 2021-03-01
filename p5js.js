//

let sketch = function(p) {
    p.setup = function(){
      p.createCanvas(400, 400);
      p.background(0);
    }

    let diameter = 100;
    let forward = true
    let x = diameter/2;
    p.draw = function()
    {
        p.background(0)
        p.fill(255, 0, 0);
        p.ellipse(x, p.height/2, diameter, diameter);
        if(forward) 
            x++
        else 
            x--
        if(x + diameter/2 > p.width || x - diameter/2 < 0){
            forward = !forward;
        }
    }
  };
new p5(sketch, 'P5Project');