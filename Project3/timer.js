//javascript page that interacts with Proj3.html
//uses a textfield and a timer to write text to the screen

let inputTextField = document.getElementById("inputTextField");
let submitBtn = document.getElementById("SubmitBtn")
let outputText = document.getElementById("outputArea")
let goBtn = document.getElementById("GoBtn")
let outputParagraph = document.getElementById("outputArea")
let outputSpeedSlider = document.getElementById("timeInMillis")
let outputSpeed = document.getElementById("outputSpeed")
let printingText = false
let inputText
let intv

submitBtn.onclick = function()
{
    inputTextField.style.backgroundColor = "lightgreen"
    inputText = inputTextField.value
}

let onTextFieldChange = function()
{
    inputTextField.style.backgroundColor = "pink"
}

let start = function()
{
    outputSpeed.textContent = "One character every " + outputSpeedSlider.value + "ms"
}

goBtn.onclick = function()
{
    let index = 0
    let text = inputText
    let intervalSpeed = outputSpeedSlider.value
    clearInterval(intv)

    if(printingText){
        goBtn.textContent = "Go!"
        printingText = false
    }
    else
    {
        outputParagraph.textContent = ""
        goBtn.textContent = "Cancel"
        printingText = true
    }

    if(printingText)
    {
        intv = setInterval(() => {
            if(index >= text.length){
                clearInterval(intv)
                goBtn.textContent = "Go!"
                printingText = false
                return
            }
            else{
                outputParagraph.textContent += text[index]
                index++
            }
        }, intervalSpeed)
    }
}

outputSpeedSlider.onchange = function(){
    outputSpeed.textContent = "One character every " + outputSpeedSlider.value + "ms"
}

let updateParagraph = function(character){
    outputParagraph.textContent += character
}


