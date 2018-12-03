document.addEventListener("DOMContentLoaded", function(){

  var row = document.querySelector(".row")
  var colorDivs = document.querySelectorAll(".circle")
  var currentColor = ""
  var colorPicker = document.querySelector(".colorPick")
  var mouseIsDown = false
  var currentColorIndicator = document.querySelector(".currentColor")

  function changeSelectedColor(e) {
    currentColor = e.target.classList[1]
    currentColorIndicator.style.background = currentColor
  }

  function userColorChoice(e) {
    currentColor = e.target.value
    currentColorIndicator.style.background = currentColor
  }

  function mouseDown() {
    mouseIsDown = true;
  }

  function mouseUp() {
    mouseIsDown = false;
  }

  function changePixelColor(e) {
    e.target.style.background = currentColor
  }

  function changePixelColorByDrag(e) {
    if(mouseIsDown === true) {
      e.target.style.background = currentColor
    }
  }

  for(var i = 1; i <= 1950;i++) {
    if((i - 1) % 65 === 0 || i === 1) {
      var pixels = document.createElement("div")
      pixels.classList.add("div", "borderLeft")
    }
    else {
      pixels = document.createElement("div")
      pixels.classList.add("div")
    }
    pixels.onmousedown = changePixelColor
    pixels.addEventListener('mousedown', mouseDown)
    pixels.addEventListener('mouseup', mouseUp)
    pixels.onmouseenter = changePixelColorByDrag
    row.append(pixels)
  }

  for(var j = 0; j < colorDivs.length;j++) {
    colorDivs[j].addEventListener("click", changeSelectedColor)
  }
  colorPicker.addEventListener("change", userColorChoice)
})
