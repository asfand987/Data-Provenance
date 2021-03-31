    
/**
 * This file contains code for creating new attributes in the Inspector component.
 * 
 */

//-------------------------------------------------------------------------------------------------/

/*
*  This function is responsible for letting the user enter in data to elements, 
*  this is done inside the inspector.
*  
*/
document.getElementById("chooseAttributeBtn").addEventListener("click",  function() {
    createNewAttributes(clickedElementID);
});  

function createNewAttributes(id) {
    let elementDataDivParent = document.getElementById("inspectorDisplayAttrContainer");
    let elementDataDiv = document.getElementById(id+"-attributesContainerDivParent");
    let attributeSelectionDiv =  document.getElementById("selectionAttributes");
    
    //create new form and corresponding elements for user to enter in new data and save.
    let form = document.createElement('form');

    //input
    let userInputAttr = document.createElement("input"); 

    //label
    let attrLabel = document.createElement("label");

    //button
    let attrSaveBtn = document.createElement("button");

    let newLine = document.createElement("p");
    
    let userSelectedAttrNamespace = attributeSelectionDiv.options[attributeSelectionDiv.selectedIndex].text;
    
    //Alert prompt
    if(attributeSelectionDiv.options[attributeSelectionDiv.selectedIndex].parentElement.label == "Attributes") {
        let alertPromptToEnterAttrType = prompt("Enter " +  userSelectedAttrNamespace + " type", );
        if(!alertPromptToEnterAttrType)   return;
        attrLabel.innerHTML = userSelectedAttrNamespace + alertPromptToEnterAttrType;
    }
    else {
        attrLabel.innerHTML = userSelectedAttrNamespace;
    }
    
    //Input info
    userInputAttr.id = id+"-Input";
    userInputAttr.type = 'text';
    userInputAttr.name = 'name';

    //Button info
    attrSaveBtn.innerHTML = "✓";
    attrSaveBtn.className = "btn btn-warning";//"inspectorBtn"
    attrSaveBtn.type = 'button';
    attrSaveBtn.id = id+"-Button";

    //Label info
    attrLabel.id = id+"-Label";

    newLine.className = "clear";

    $(form).submit(function (e) {
        e.preventDefault();
    });
    form.appendChild(attrLabel);
    form.appendChild(userInputAttr);
    form.appendChild(attrSaveBtn);
    form.appendChild(newLine);

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
    
    displayAttrInInspector(id, userInputAttr, attrLabel, attrSaveBtn, form);
    
}


