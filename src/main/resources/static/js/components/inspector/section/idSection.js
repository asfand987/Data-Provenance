// require('../inspector.js');
// require('js/components/inspector.js');
/*
**  This section updates the ID of elements as well as updating all corresponding div's inside the inspector for
**  that particular element.
*/
document.getElementById("idBtn").addEventListener("click", function() { updateNewID(); });

function updateNewID() {
    var oldID = clickedElement.path[2].id;
    let newID = document.getElementById("placeholderID");


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

    if(newID.value != '') {

        if(getNSnValue != "default") newID.value = getNSnValue + ":" + newID.value; 
        else  newID.value = "prov:" + newID.value;
        
        //update old ID with new ID
        oldID =  newID.value;

        //update element name on UI
        elementInnerHTML[0].innerHTML = oldID;

        newID.value = '';       
        
        //update form for creating new attributes
        if(attributesContainerDivParent) {    attributesContainerDivParent.id = oldID+"-attributesContainerDivParent"; };
        if(newAttributeInput) {     newAttributeInput.id = oldID+"-Input";  };
        if(newAttributeButton) {    newAttributeButton.id = oldID+"-Button";    };
        if(newAttributeLabel) {     newAttributeLabel.id = oldID+"-Label";  }
        if(attributesContainerDiv) {    attributesContainerDiv.id = oldID+"-attributesContainerDiv";    }

        //update instance
        jsPlumbInstance.setId(clickedElement.path[2].id, oldID);
        jsPlumbInstance.recalculateOffsets(oldID);

        clickedElementID = oldID;
    }
}
