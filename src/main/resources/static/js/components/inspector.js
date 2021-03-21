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
    let clssName = element.path[2].className.split(' ').slice(1, 2);

    if(clssName == "start" || clssName == "step" || clssName == "diamond") {   
        let elementID = element.path[2].id;
        clickedElementID = element.path[2].id;
        displayInspectorComponent(element, elementID);
        displayElementValuesInInspector(elementID);
    }
}

/*
**  This function makes the Inspector component visible on the interface.  
*/
function displayInspectorComponent(node, id) {
    const inspectorWindow = document.getElementById("inspectorSpan");

    if (inspectorWindow.style.display == "none") {
        inspectorWindow.style.display = "inline-block";
        clickedElement = node;
        const displayIdOnInputBox = document.getElementById("placeholderID");
        displayIdOnInputBox.placeholder = id;
    } else {
        inspectorWindow.style.display = "none";
    }
}

/*
**  This function displays each unique elements values in the Inspector Component.
**  This function is used in the function @document.onclick so whenever an element
**  is clicked on by the user, the inspector gets populated with the elements respective
**  data.
*/
function displayElementValuesInInspector(id) {
    const inspectorValues = document.querySelectorAll("#elementDataInInspector div");

    for (let i = 0; i < inspectorValues.length; i++) {
        if(inspectorValues[i].id != (id+"inspectorComponent")) {
            inspectorValues[i].style.display = "none";
        }
        else {
            inspectorValues[i].style.display = "inline-block";
        }
    }
    const displaySelectBox = document.getElementById(id+"selectionAttributes");
    if(displaySelectBox) {
        displaySelectBox.style.display = "inline-block";
    }
}

document.getElementById("chooseAttributeBtn").addEventListener("click",  function() {
        userEnterDataIntoElement(clickedElementID);
});   

   
//var inputValue;
function userEnterDataIntoElement(id) {
    let elementDataDivParent = document.getElementById("elementDataInInspector");
    let elementDataDiv = document.getElementById(id+"inspectorComponent");
    let attributeSelectionDiv =  document.getElementById("selectionAttributes");
    
    //------------create new form and corresponding elements for user to enter in new data and save--------------//
    let form = document.createElement('form');

    //input
    let userInputAttr = document.createElement("input"); 

    //label
    let attrLabel = document.createElement("label");

    //button
    let attrSaveBtn = document.createElement("button");
    //-----------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------//

    
    let userSelectedAttrNamespace = attributeSelectionDiv.options[attributeSelectionDiv.selectedIndex].text;
    
    //-------------------------------------------------------Alert prompt----------------------------------------//
    if(attributeSelectionDiv.options[attributeSelectionDiv.selectedIndex].parentElement.label == "Attributes") {
        let alertPromptToEnterAttrType = prompt("Enter " +  userSelectedAttrNamespace + " type", );
        if(!alertPromptToEnterAttrType)   return;
        attrLabel.innerHTML = userSelectedAttrNamespace + alertPromptToEnterAttrType;
    }
    else {
        attrLabel.innerHTML = userSelectedAttrNamespace;
    }
    //-----------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------//
    

    //-----------------------------------------------------Input-------------------------------------------------//
    userInputAttr.id = id+"Input";
    userInputAttr.type = 'text';
    userInputAttr.name = 'name';

    //-----------------------------------------------------Button-------------------------------------------------//
    attrSaveBtn.innerHTML = "S";
    attrSaveBtn.type = 'button';
    attrSaveBtn.id = id+"Button";

    //-----------------------------------------------------Label--------------------------------------------------//
    attrLabel.id = id+"Label";

    //-----------------------------------------------------Form---------------------------------------------------//
    $(form).submit(function (e) {
        e.preventDefault();
    });
    form.appendChild(attrLabel);
    form.appendChild(userInputAttr);
    form.appendChild(attrSaveBtn);
    //------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------------------------//

    /*
    **  if elementDataDiv (div where data is held) already exists, add the form (data) to it and then add to parentDiv.
    **  else create new elementDataDiv to add data to.
    */
    if(elementDataDiv) {
        elementDataDiv.appendChild(form);
        elementDataDivParent.appendChild(elementDataDiv);
    }
    else {

        let elementDataDiv = document.createElement("div");
        elementDataDiv.id = id+"inspectorComponent";
        elementDataDiv.appendChild(form);
        elementDataDivParent.appendChild(elementDataDiv);
    }
    
    displayNodeValues(id, userInputAttr, attrLabel, attrSaveBtn, form);
    
}

   
    function displayNodeValues(id, input, label, button, form) { 
        let divAttr = document.getElementById(id+"selectionAttributes");
     
        if(!divAttr) {
            divAttr = document.createElement('div');
            divAttr.id = id+"selectionAttributes";
        }
        let br = document.createElement("br");
        let attrButton = document.createElement("button");
        let attrlabel = document.createElement("label");
        
        //add attributes to the inspector window
        document.getElementById(id+"Button").addEventListener("click", function() {
            let attributeValue = document.getElementById(id+"Input").value;
            //console.log(attributeValue);
            let node = document.getElementById(id);
            node.attributes[2].nodeValue =  node.attributes[2].nodeValue + label.innerHTML+ ": " + attributeValue + ",";
            
            let nodeAttrs = node.attributes[2].nodeValue.split(",");
            nodeAttrs.pop();
            
            for (let i = 0; i < nodeAttrs.length; i++) {
                attrButton.innerHTML = "X";
                attrButton.type = 'button';
                attrButton.id = nodeAttrs[i];
                //delete
                attrButton.addEventListener("click", function() {
                    attrlabel.remove();
                    attrButton.remove();
                    node.attributes[2].nodeValue = node.attributes[2].nodeValue.replace(attrlabel.innerHTML+",", "");
                    //console.log( node.attributes[2].nodeValue);
                })
                attrlabel.innerHTML = nodeAttrs[i];
                //console.log(attrlabel.innerHTML);
                let prefix = nodeAttrs[i].split(" ")[0].slice(0, -1);
                //let value =
                divAttr.appendChild(attrlabel);
                divAttr.appendChild(attrButton);
                divAttr.appendChild(br);
            }
                //console.log(node.attributes[2].nodeValue);
                //console.log(node.attributes[2]);
                input.remove();
                label.remove(); 
                button.remove();
            });
        form.appendChild(divAttr);
    }

    function myFunction(message, placeholder) { 
        let txt;
        let promptAlert = prompt(message, placeholder);
        if (promptAlert == null || promptAlert == "") {
          txt = "User cancelled the prompt.";
        } else {
          txt =  promptAlert;
        }
        //idIs = txt;
        return txt;
    }

    saveFunction = function saveOutput() {
        var nodeID = clickedElement.path[2].id;
        let userEnteredID = document.getElementById("objectName");
        let p = document.getElementById(nodeID).querySelectorAll("p");//.getElementsByClassName("p");
        let cont = document.getElementById(nodeID+"inspectorComponent");
        let input = document.getElementById(nodeID+"Input");
        let button = document.getElementById(nodeID+"Button");
        let label = document.getElementById(nodeID+"Label");
        let attr = document.getElementById(nodeID+"selectionAttributes");

        //console.log(nodeID);
        let getNsOption = document.getElementById("addNStoID");
        let getNSOptionValue = getNsOption.options[getNsOption.selectedIndex].value;
        
        
        
        //Delete old element ID
        if(userEnteredID.value != '') {
             //change connection ID
            for(let i = 0; i < connections.length; i++) {
                if(connections[i].includes(nodeID)) {
                    connections[i] = connections[i].replaceAll(nodeID, userEnteredID.value);
                }
            }

            if(getNSOptionValue != "default") {
                userEnteredID.value = getNSOptionValue + ":" + userEnteredID.value;
            }
             else {
                 userEnteredID.value = "prov:" + userEnteredID.value;
             }
            let oldID = nodeID;

            //update nodeID with new ID
            nodeID =  userEnteredID.value;
            p[0].innerHTML = nodeID;
            userEnteredID.value = '';       
            
            if(cont) { 
                cont.id = nodeID+"inspectorComponent";
            }
            if(input) { 
                input.id = nodeID+"Input";
            }
            if(button) { 
                button.id = nodeID+"Button";
            }
            if(label) { 
                label.id = nodeID+"Label";
            }
            if(attr) { 
                attr.id = nodeID+"selectionAttributes";
            }

            //changeElementIDinArray(nodeID, userEnteredID.value);
            //changeElementIDinArray(oldID, nodeID);

            jsPlumbInstance.setId(clickedElement.path[2].id, nodeID);
            jsPlumbInstance.recalculateOffsets(nodeID);

            clickedElementID = nodeID;
        }
    }