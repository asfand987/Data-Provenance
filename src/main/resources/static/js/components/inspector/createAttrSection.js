    
/*
**  This function is responsible for letting the user enter in data to elements, this is done inside the inspector.
**  
*/
document.getElementById("chooseAttributeBtn").addEventListener("click",  function() {
    userEnterDataIntoElement(clickedElementID);
});  

function userEnterDataIntoElement(id) {
    let elementDataDivParent = document.getElementById("inspectorAttrContainer");
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
** This function checks if dataDiv already exists, if so, add all existing data to it to display.
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