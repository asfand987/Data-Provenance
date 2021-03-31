/**
 * This function 
 */



/*
** This function checks if container div already exists, if so, add all existing data to it to display.
** Otherwise create a new one.
** Used in @createNewAttributes(id).
*/
function displayAttrInInspector(id, input, label, button, form) { 
    let attributeDiv = document.getElementById(id+"-attributesContainerDiv");
    
    if(!attributeDiv) {
        attributeDiv = document.createElement('div');
        attributeDiv.id = id+"-attributesContainerDiv";
    }

    //   Display user entered in data to the inspector. Deletes the form used to enter in the data.
    //   Called when '+' button is pressed in the inspector.
    //   Returns attributeDiv.
    
    createComponentsToDisplay(id, input, label, button, attributeDiv);

    form.appendChild(attributeDiv);
}


/*
**  Create components for attribute which user has entered from form into Inspector to display
**
*/
function createComponentsToDisplay(id, input, label, button, attributeDiv) {
    document.getElementById(id+"-Button").addEventListener("click", function() { 
        let br = document.createElement("br");
        let attrButton = document.createElement("button");
        let attrLabel = document.createElement("label");
        let attributeValue = document.getElementById(id+"-Input").value;
        let element = document.getElementById(id);

        attrButton.className = "btn btn-danger"

        //Add data directly onto DOM object element
        element.attributes[2].nodeValue =  element.attributes[2].nodeValue + label.innerHTML+ ": " + attributeValue + ",";
        

        //Get all data stored in DOM element
        let elementAttributes = element.attributes[2].nodeValue.split(",");
        elementAttributes.pop();

        //Create components of all existing attributes belonging to element
        for (let i = 0; i < elementAttributes.length; i++) {
            attrButton.innerHTML = "X";
            attrButton.type = 'button';
            attrButton.id = elementAttributes[i];

            //Delete attribute on from Inspector and remove value from DOM object on click
            attrButton.addEventListener("click", function() { deleteAttribute(attrLabel, attrButton, br, element); });

            attrLabel.innerHTML = elementAttributes[i];
            attributeDiv.appendChild(attrLabel);
            attributeDiv.appendChild(attrButton);
            attributeDiv.appendChild(br);
        }
            //Remove From used to enter in new attribute data
            removeForm(input, label, button);
        });

        return attributeDiv;
}


/*
**  Each attribute has an "X" button to delete it. This function will remove remnants of that data from the Inspector.
**
*/
function deleteAttribute(label, button, br, element) {
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