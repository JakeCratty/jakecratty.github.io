//Javascript page to interact with elements on fancifymytext.html


let biggerbBtn = document.querySelector("button")
let mooBtn = document.getElementById("MooBtn")
let fancyRadio = document.getElementById("fancy")
let boringRadio = document.getElementById("normal")
let text = document.getElementById("Text");

biggerbBtn.onclick = function() {
  alert("hello, world!")
  text.style.fontSize = "2em";
  text.textContent = text.textContent;
}

fancyRadio.onchange = function()  {
  alert("You've selected fancier text!")
  text.style.fontWeight = "bold";
  text.style.color = "blue";
  text.style.textDecoration = "underline";
  text.textContent = text.textContent;
}

boringRadio.onchange = function() {
  text.style.fontWeight = "normal";
  text.style.color = "black";
  text.style.textDecoration = "none";
}

mooBtn.onclick = function() {
  let textString = text.textContent
  let sentences = textString.split(".")
  textString = sentences.join("-moo.")
  text.textContent = textString.toUpperCase()
}