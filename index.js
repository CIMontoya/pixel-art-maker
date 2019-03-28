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
  var bucket = document.querySelector(".bucketCont")
  var bucketIcon = document.querySelector(".bucket")
  var brush = document.querySelector(".brushCont")
  var brushIcon = document.querySelector(".brush")
  var fillTool = false

  currentColorIndicator.style.background = 'white'
  brushIcon.style.border = `white 2px solid`
  brushIcon.style.borderRadius = '10px 10px 10px 10px'
  brushIcon.style.background = 'rgba(255, 255, 255, 0.6)'

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
    if(fillTool === false) {
      e.target.style.background = currentColor
    } else {
      fillDivs(e.target, e.target.id)
    }
  }

  function fillDivs(div, i, leftPaths = [], rightPaths = []) {
    let colorToReplace = div.style.background
    let u = 1
    let d = 1
    let upPath
    let downPath
    let id = +i

    while (u !== 0) {
      if(div.parentNode.children[id - 65] && div.parentNode.children[id - 65].style.background === colorToReplace) {
        id -= 65
        upPath = div.parentNode.children[id]
      }
      else if (upPath){
        upPath.style.background = currentColor
        if(upPath.nextSibling && upPath.nextSibling.style.background === colorToReplace && (id + 1) % 65 !== 0) {
          rightPaths.push(upPath.nextSibling)
        }
        if(+upPath.id === 0) {
          leftPaths = []
        } else if(upPath.previousSibling && upPath.previousSibling.style.background === colorToReplace) {
          leftPaths.push(upPath.previousSibling)
        }
        u -= 1
      } else {
        upPath = div
      }
    }
    while (d !== 0) {
      if(div.parentNode.children[id + 65] && div.parentNode.children[id + 65].style.background === colorToReplace) {
        id += 65
        downPath = div.parentNode.children[id]
        downPath.style.background = currentColor
        if(downPath.nextSibling && downPath.nextSibling.style.background === colorToReplace && downPath.parentNode.children[id - 65].nextSibling.style.background !== colorToReplace) {
          rightPaths.push(downPath.nextSibling)
        }
        if(downPath.previousSibling && downPath.previousSibling.style.background === colorToReplace && downPath.parentNode.children[id - 65].previousSibling.style.background !== colorToReplace){
          leftPaths.push(downPath.previousSibling)
        }
      }
      else {
        d -= 1
      }
    }
    if(rightPaths.length > 0) {
      let newRight = [...rightPaths]
      newRight.shift()
      fillDivs(rightPaths[0], rightPaths[0].id, leftPaths, newRight)
    } else if (leftPaths.length > 0) {
      let newLeft = [...leftPaths]
      newLeft.shift()
      fillDivs(leftPaths[0], leftPaths[0].id, newLeft, [])
    }
  }

  function changePixelColorByDrag(e) {
    if(mouseIsDown === true && fillTool === false) {
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

  function fill() {
    fillTool = true
    bucketIcon.style.border = `white 2px solid`
    bucketIcon.style.borderRadius = '10px 10px 10px 10px'
    bucketIcon.style.background = 'rgba(255, 255, 255, 0.6)'
    brushIcon.style.border = `none`
    brushIcon.style.background = 'none'

  }

  function noFill() {
    fillTool = false
    brushIcon.style.border = `white 2px solid`
    brushIcon.style.borderRadius = '10px 10px 10px 10px'
    brushIcon.style.background = 'rgba(255, 255, 255, 0.6)'
    bucketIcon.style.border = `none`
    bucketIcon.style.background = 'none'
  }

  function loadDrawing(e) {
      let colors = JSON.parse(localStorage.getItem(e.target.selectedOptions[0].value))
      var divs = document.querySelectorAll(".div")
      for(var k = 0; k < divs.length; k++) {
        removeElement(divs[k].id)
      }

      for(var i = 1; i <= colors.length;i++) {
        if((i - 1) % 65 === 0 || i === 1) {
          var pixels = document.createElement("div")
          pixels.classList.add("div", "borderLeft")
          pixels.style.background = colors[i]
        }
        else {
          pixels = document.createElement("div")
          pixels.classList.add("div")
          pixels.style.background = colors[i]
        }
        pixels.id = i
        pixels.onmousedown = changePixelColor
        pixels.addEventListener('mousedown', mouseDown)
        pixels.addEventListener('mouseup', mouseUp)
        pixels.onmouseenter = changePixelColorByDrag
        row.append(pixels)
      }
  }

  for(var i = 0; i < 1950;i++) {
    if((i) % 65 === 0 || i === 0) {
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

  bucket.addEventListener("click", fill)
  brush.addEventListener("click", noFill)
})
