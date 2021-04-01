// require('../inspector.js');
// require('js/components/inspector.js');
/*
**  This section updates the ID of elements as well as updating all corresponding div's inside the inspector for
**  that particular element.
*/
document.getElementById("idBtn").addEventListener("click", function() { updateNewID(); });

function updateNewID() {
    var oldID = clickedElement.path[2].id;
    let inputComponent = document.getElementById("placeholderID");


    //Change name on element in the UI
    let elementInnerHTML = document.getElementById(oldID).querySelectorAll("p");
    
    //To be updated, attribute container DIV's for each unique element
    let attributesContainerDivParent = document.getElementById(oldID+"-attributesContainerDivParent");
    let attributesContainerDiv = document.getElementById(oldID+"-attributesContainerDiv");


    //To be updated, Form for creating new attributes
    let newAttributeInput = document.getElementById(oldID+"-Input");
    let newAttributeButton = document.getElementById(oldID+"-Button");
    let newAttributeLabel = document.getElementById(oldID+"-Label");

    //-------------------------------------Update ID's-----------------------------------------------------------//
    let getNsOption = document.getElementById("addNStoID");
    let getNSnValue = getNsOption.options[getNsOption.selectedIndex].value;


    if(inputComponent.value != '') {

        //update old ID with new ID
        newID =  inputComponent.value;

        if(getNSnValue != "default") newID = getNSnValue + ":" + newID; 
        else  newID = "prov:" + newID;
        

        //update element name on UI
        elementInnerHTML[0].innerHTML = newID;

        inputComponent.value = '';
        inputComponent.placeholder = newID;
        //update form for creating new attributes
        if(attributesContainerDivParent) {    attributesContainerDivParent.id = newID+"-attributesContainerDivParent"; };
        if(newAttributeInput) {     newAttributeInput.id = newID+"-Input";  };
        if(newAttributeButton) {    newAttributeButton.id = newID+"-Button";    };
        if(newAttributeLabel) {     newAttributeLabel.id = newID+"-Label";  }
        if(attributesContainerDiv) {    attributesContainerDiv.id = newID+"-attributesContainerDiv";    }

        //update instance
        jsPlumbInstance.setId(clickedElement.path[2].id, newID);
        jsPlumbInstance.recalculateOffsets(newID);

        clickedElementID = newID;
    }
}
