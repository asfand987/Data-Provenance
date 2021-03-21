var clickedElement;
var clickedElementID;


/*
**  This function makes the Inspector component visible on the interface  
*/
function displayInspectorComponent(node, id) {
    let inspectorWindow = document.getElementById("inspectorSpan");

    if (inspectorWindow.style.display == "none") {
        inspectorWindow.style.display = "inline-block";
        clickedElement = node;
        let displayIdOnInputBox = document.getElementById("placeholderID");
        displayIdOnInputBox.placeholder = id;
    } else {
        inspectorWindow.style.display = "none";
    }
}


function displayElementValueInInspector(id) {
    const inspectorValues = document.querySelectorAll("#inspectorValuesContainer div");

    for (let i = 0; i < inspectorValues.length; i++) {
        if(inspectorValues[i].id != (id+"Inspector")) {
            inspectorValues[i].style.display = "none";
        }
        else {
            inspectorValues[i].style.display = "inline-block";
        }
    }
    let attributes = document.getElementById(id+"Attr");
    if(attributes) {
        attributes.style.display = "inline-block";
    }
}

document.onclick = function(node) {
    let clssName = node.path[2].className.split(' ').slice(1, 2);
    if(clssName == "start" || clssName == "step" || clssName == "diamond") {
        let objectIdentifier = node.path[2].id;
        clickedElementID = node.path[2].id;
        console.log(objectIdentifier);
        displayInspectorComponent(node, objectIdentifier);
        displayElementValueInInspector(objectIdentifier);
        lastClickElement = clssName;
        //console.(elementsOnCanvas);
    }
}

var block = false;  
    document.getElementById("attrBtn").addEventListener("click",  function() {
        if(!block) {
            inspectorAttr(clickedElementID);
            block = true;
        }
    });   
   
    //var inputValue;
    function inspectorAttr(id) {
        let inspectorWindow = document.getElementById(id+"Inspector");
        let div = document.getElementById("inspectorValuesContainer");
        let selectionAttr = document.getElementById("attrOption");
        let selection =  document.getElementById("attr");
        
        let form = document.createElement('form');
        let input = document.createElement("input");
        let label = document.createElement("label");
        let button = document.createElement("button");
        let br = document.createElement("br");
        
        let attributeType = selection.options[selection.selectedIndex].text;
        
        if(selection.options[selection.selectedIndex].parentElement.label == "Attributes") {
            let enterAttributeValue = prompt("Enter " +  attributeType + " type", "type");
            label.innerHTML = attributeType + enterAttributeValue;
        }
        else {
            label.innerHTML = attributeType;
        }
        

        input.id = id+"Input";
        input.type = 'text';
        input.name = 'name';
        button.innerHTML = "S";
        button.type = 'button';
        button.id = id+"Button";
        label.id = id+"Label";

        $(form).submit(function (e) {
            e.preventDefault();
        });
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(button);
        //

        if(inspectorWindow) {
            inspectorWindow.appendChild(form);
            div.appendChild(inspectorWindow);
        }
        else {
            input.id = id+"Input";
            button.id = id+"Button";
            let localDiv = document.createElement("div");
            localDiv.id = id+"Inspector";
            localDiv.appendChild(form);
            div.appendChild(localDiv);
        }
        
        displayNodeValues(id, input, label, button, form);
        
    }

   
    function displayNodeValues(id, input, label, button, form) { 
        let divAttr = document.getElementById(id+"Attr");
     
        if(!divAttr) {
            divAttr = document.createElement('div');
            divAttr.id = id+"Attr";
        }
        let br = document.createElement("br");
        let attrButton = document.createElement("button");
        let attrlabel = document.createElement("label");
        
        //add attributes to the inspector window
        document.getElementById(id+"Button").addEventListener("click", function() {
            block = false;
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
        let cont = document.getElementById(nodeID+"Inspector");
        let input = document.getElementById(nodeID+"Input");
        let button = document.getElementById(nodeID+"Button");
        let label = document.getElementById(nodeID+"Label");
        let attr = document.getElementById(nodeID+"Attr");

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
                cont.id = nodeID+"Inspector";
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
                attr.id = nodeID+"Attr";
            }

            //changeElementIDinArray(nodeID, userEnteredID.value);
            //changeElementIDinArray(oldID, nodeID);

            jsPlumbInstance.setId(clickedElement.path[2].id, nodeID);
            jsPlumbInstance.recalculateOffsets(nodeID);

            clickedElementID = nodeID;
        }
    }