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
        inspectorWindow.style.display = "none"; //hide Inspector indow.
    } 
}

/*
**  This function displays each unique element values in the Inspector Component.
**  This function is used in the function @document.onclick so whenever an element
**  is clicked on by the user, the inspector gets populated with the elements respective
**  data.
*/
function displayElementValuesInInspector(id) {
    const inspectorValues = document.querySelectorAll("#elementDataInInspector div");

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
    
/*
**  This function is responsible for letting the user enter in data to elements, this is done inside the inspector.
**  
*/
document.getElementById("chooseAttributeBtn").addEventListener("click",  function() {
    userEnterDataIntoElement(clickedElementID);
});  

function userEnterDataIntoElement(id) {
    let elementDataDivParent = document.getElementById("elementDataInInspector");
    let elementDataDiv = document.getElementById(id+"-attributesContainerDivParent");
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
    userInputAttr.id = id+"-Input";
    userInputAttr.type = 'text';
    userInputAttr.name = 'name';

    //-----------------------------------------------------Button-------------------------------------------------//
    attrSaveBtn.innerHTML = "✓";
    attrSaveBtn.className = "btn btn-warning";//"inspectorBtn"
    attrSaveBtn.type = 'button';
    attrSaveBtn.id = id+"-Button";

    //-----------------------------------------------------Label--------------------------------------------------//
    attrLabel.id = id+"-Label";

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
        elementDataDiv.id = id+"-attributesContainerDivParent";
        elementDataDiv.appendChild(form);
        elementDataDivParent.appendChild(elementDataDiv);
    }
    
    addDataToElement(id, userInputAttr, attrLabel, attrSaveBtn, form);
    
}

/*
** This funciton checks if dataDiv already exists, if so, add all existing data to it to display.
** Otherwise create a new one.
** Used in @userEnterDataIntoElement(id).
*/
function addDataToElement(id, input, label, button, form) { 
    let dataDiv = document.getElementById(id+"-attributesContainerDiv");
    
    if(!dataDiv) {
        dataDiv = document.createElement('div');
        dataDiv.id = id+"-attributesContainerDiv";
    }

    //------------------------------------------------------------------------------------------------------------//

    /*
    **  Display user entered in data to the inspector. Deletes the form used to enter in the data.
    **  Called when '+' button is pressed in the inspector.
    ** Returns dataDiv.
    */
    showNewDataInInspector(id, input, label, button, dataDiv);

    form.appendChild(dataDiv);
}

/*
**  Add data which user has entered from form into Inspector to display
**
*/
function showNewDataInInspector(id, input, label, button, dataDiv) {
    document.getElementById(id+"-Button").addEventListener("click", function() { 
        let br = document.createElement("br");
        let attrButton = document.createElement("button");
        let attrlabel = document.createElement("label");
        let attributeValue = document.getElementById(id+"-Input").value;
        let element = document.getElementById(id);

        attrButton.className = "btn btn-danger"

        //------------------------------------Add data directly onto element-----------------------------------------//
        element.attributes[2].nodeValue =  element.attributes[2].nodeValue + label.innerHTML+ ": " + attributeValue + ",";
        
        //-----------------------------------------------------------------------------------------------------------//

        //----------------------------------Get all data stored In element-------------------------------------------//
        let elementAttributes = element.attributes[2].nodeValue.split(",");
        elementAttributes.pop();
        //-----------------------------------------------------------------------------------------------------------//

        //----------------------------------Display all data stored in element in Inspector--------------------------//
        for (let i = 0; i < elementAttributes.length; i++) {
            attrButton.innerHTML = "X";
            attrButton.type = 'button';
            attrButton.id = elementAttributes[i];

            //-------------------------------Delete data on from Inspector on click----------------------------------//
            attrButton.addEventListener("click", function() { deleteData(attrlabel, attrButton, br, element); });
            //-------------------------------------------------------------------------------------------------------//

            attrlabel.innerHTML = elementAttributes[i];
            dataDiv.appendChild(attrlabel);
            dataDiv.appendChild(attrButton);
            dataDiv.appendChild(br);
        }
            //----------------------------------Remove From used to enter in new attribute data----------------------//
            removeForm(input, label, button);
        });

        return dataDiv;
}


/*
**  Each attribute has an "X" button to delete it. This function will remove remnants of that data from the Inspector.
**
*/
function deleteData(label, button, br, element) {
    label.remove();
    button.remove();
    br.remove();
    element.attributes[2].nodeValue = element.attributes[2].nodeValue.replace(label.innerHTML+",", "");

}

/*
**  Deletes Form after the user has used it to make a new attribute
**
*/
function removeForm(input, label, button) {
    input.remove();
    label.remove(); 
    button.remove();
}


/*
**  This section updates the ID of elements as well as updating all corresponding div's inside the inspector for
**  that particular element.
*/
document.getElementById("idBtn").addEventListener("click", function() { updateIDs(); });

function updateIDs() {
     //--------------------------------- ------Old ID and new ID-------------------------------------------------//
    var elementID = clickedElement.path[2].id;
    let userEnteredID = document.getElementById("placeholderID");
    //-----------------------------------------------------------------------------------------------------------//


    //----------------------------------Change name on element in the UI-----------------------------------------//
    let elementInnerHTML = document.getElementById(elementID).querySelectorAll("p");
    
    //--------------------------To be updated, attribute container DIV's for each unique element-----------------//
    let attributesContainerDivParent = document.getElementById(elementID+"-attributesContainerDivParent");
    let attributesContainerDiv = document.getElementById(elementID+"-attributesContainerDiv");
    //-----------------------------------------------------------------------------------------------------------//


    //--------------------------To be updated, Form for adding new attributes------------------------------------//
    let newAttributeInput = document.getElementById(elementID+"-Input");
    let newAttributeButton = document.getElementById(elementID+"-Button");
    let newAttributeLabel = document.getElementById(elementID+"-Label");

    //-------------------------------------Update ID's-----------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------//
    let getNsOption = document.getElementById("addNStoID");
    let getNSnValue = getNsOption.options[getNsOption.selectedIndex].value;

    if(userEnteredID.value != '') {

        if(getNSnValue != "default") userEnteredID.value = getNSnValue + ":" + userEnteredID.value; 
        else  userEnteredID.value = "prov:" + userEnteredID.value;
        

        //update old ID with new ID
        elementID =  userEnteredID.value;

        //update element name on UI
        elementInnerHTML[0].innerHTML = elementID;

        userEnteredID.value = '';       
        
        if(attributesContainerDivParent) {    attributesContainerDivParent.id = elementID+"-attributesContainerDivParent"; };
        if(newAttributeInput) {     newAttributeInput.id = elementID+"-Input";  };
        if(newAttributeButton) {    newAttributeButton.id = elementID+"-Button";    };
        if(newAttributeLabel) {     newAttributeLabel.id = elementID+"-Label";  }
        if(attributesContainerDiv) {    attributesContainerDiv.id = elementID+"-attributesContainerDiv";    }

        //update instance
        jsPlumbInstance.setId(clickedElement.path[2].id, elementID);
        jsPlumbInstance.recalculateOffsets(elementID);

        clickedElementID = elementID;
    }
}

function alertBox(message, placeholder) { 
    let value;
    let promptAlert = prompt(message, placeholder);
    if (promptAlert == null || promptAlert == "") {
        value = "User cancelled the prompt.";
    } else {
        value =  promptAlert;
    }
    return value;
}