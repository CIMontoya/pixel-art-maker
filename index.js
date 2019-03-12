document.addEventListener("DOMContentLoaded", function(){

  var row = document.querySelector(".row")
  var colorDivs = document.querySelectorAll(".circle")
  var currentColor = ""
  var colorPicker = document.querySelector(".colorPick")
  var mouseIsDown = false
  var currentColorIndicator = document.querySelector(".currentColor")
  var saveButton = document.querySelector(".saveBut")
  var submitButton = document.querySelector(".submit")
  var loadButton = document.querySelector(".loadBut")
  var array = []
  var availableDrawings

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

  function openSaveForm(e) {
    e.target.parentNode.parentNode.parentNode.childNodes[7].className = "showForm"
  }

  function saveDrawing(e) {
    var divs = document.querySelectorAll(".div")
    for(var k = 0; k < divs.length; k++) {
      array.push(divs[k].outerHTML.substring(divs[k].outerHTML.indexOf(":") + 2, divs[k].outerHTML.indexOf(";")))
    }
    localStorage.setItem(e.target.parentNode.children[1].value, JSON.stringify(array))
  }

  function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function allStorage() {

    var keys = Object.keys(localStorage)

    return keys
}

  function showAvailableDrawings(e) {
    let keys = allStorage()
    if(loadButton.children.length === 1) {
      keys.map(key => {
        let option = document.createElement("option")
        option.value = key
        option.innerHTML = key
        loadButton.append(option)
      })
    }
    availableDrawings = document.querySelector('.loadBut')
    availableDrawings.addEventListener("change", loadDrawing)
  }

  function loadDrawing(e) {
      let colors = JSON.parse(localStorage.getItem(e.target.selectedOptions[0].value))
      var divs = document.querySelectorAll(".div")
      for(var k = 0; k < divs.length; k++) {
        removeElement(divs[k].id)
      }

      for(var i = 0; i < colors.length;i++) {
        if((i) % 65 === 0 || i === 0) {
          var pixels = document.createElement("div")
          pixels.classList.add("div", "borderLeft")
          pixels.style.background = colors[i]
        }
        else {
          pixels = document.createElement("div")
          pixels.classList.add("div")
          pixels.style.background = colors[i]
        }
        console.log(colors[i])
        pixels.id = i
        pixels.onmousedown = changePixelColor
        pixels.addEventListener('mousedown', mouseDown)
        pixels.addEventListener('mouseup', mouseUp)
        pixels.onmouseenter = changePixelColorByDrag
        row.append(pixels)
      }
  }

  for(var i = 1; i <= 1950;i++) {
    if((i - 1) % 65 === 0 || i === 1) {
      var pixels = document.createElement("div")
      pixels.classList.add("div", "borderLeft")
      pixels.style.background = "white"
    }
    else {
      pixels = document.createElement("div")
      pixels.classList.add("div")
      pixels.style.background = "white"
    }
    pixels.id = i
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

  saveButton.addEventListener("click", openSaveForm)
  submitButton.addEventListener("click", saveDrawing)

  loadButton.addEventListener("click", showAvailableDrawings)
})
