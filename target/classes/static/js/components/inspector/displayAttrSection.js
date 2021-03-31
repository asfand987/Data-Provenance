


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