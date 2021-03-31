var clickedElement;
var clickedElementID;  //last element that was clicked

/*
**  This function is called every time an element on canvas is clicked on by the user.
**  This is so the inspector component can be displayed on the interface as well as the
**  elements data values.
**
**  "start" = entity element
**  "step" = activity element
**  "diamond" = agent element
*/
document.onclick = function(element) {
    let clssName = element.path[2].className.split(' ').slice(1, 3).join().replace(/,/g, "");

    if(clssName == "startcustom" || clssName == "stepcustom" || clssName == "diamondcustom") {   
        let elementID = element.path[2].id;
        clickedElementID = element.path[2].id;
        displayInspectorComponent(element, elementID);
        displayElementAttributes(elementID);
    }
}

/*
**  This function makes the Inspector component visible on the interface.  
*/
function displayInspectorComponent(element, elementID) {
    const inspectorWindow = document.getElementById("inspectorSpan");

    if (inspectorWindow.style.display == "none") {
        inspectorWindow.style.display = "inline-block";
        clickedElement = element;
        const displayIdOnInputBox = document.getElementById("placeholderID");
        displayIdOnInputBox.placeholder = elementID;
    } else {
        inspectorWindow.style.display = "none"; //hide Inspector indow.
    } 
}

/*
**  This function displays each unique element values in the Inspector Component.
**  This function is used in the function @document.onclick so whenever an element
**  is clicked on by the user, the inspector gets populated with the elements respective
**  data.
*/
function displayElementAttributes(id) {
    const inspectorValues = document.querySelectorAll("#inspectorDisplayAttrContainer div");

    for (let i = 0; i < inspectorValues.length; i++) {
        if(inspectorValues[i].id != (id+"-attributesContainerDivParent")) {
            inspectorValues[i].style.display = "none";
        }
        else {
            inspectorValues[i].style.display = "block";
        }
    }
    const displayAttrContainer = document.getElementById(id+"-attributesContainerDiv");
    if(displayAttrContainer) {
        displayAttrContainer.style.display = "block";
        displayAttrContainer.label.style.paddingLeft = "5%";
    }
}



