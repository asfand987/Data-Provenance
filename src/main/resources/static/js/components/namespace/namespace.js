/*
**  This file contains all code related to the namespace functionality.
**  All things related to the template functionality are included.
**
*/

//---------------------------Global variables-------------------------------------------------------//
var namespaceArray = {prefix:{default : 'http://www.w3.org/ns/prov#'}};


/*
**  This function lets the user enter in custom namespaces.
**
*/
document.getElementById("nameSpaceButton").addEventListener("click", addNameSpace);

function addNameSpace() {
    const userInput = prompt("Namespace", "Prefix https://someurl.com/");
    
    //---------------------------Separate prefix and url from user input-----------------------------//
    const separateInput = userInput.split(" ");
    const prefix = separateInput[0];
    const url = separateInput[1];
    //-----------------------------------------------------------------------------------------------//
    
    displayNamespace(prefix, url);
    displayNamespaceInspecAttr(userInput.split(' ').slice(0, 1) + ":");
    displayNamespaceInspecID(prefix);
}


/*
**  This function displays the namespace in the UI.
**  Used in @addNameSpace().
**
*/
function displayNamespace(prefix, url) {
    const namespaceContainer = document.getElementById("namespaceContainer"); 
    const namespaceDiv = document.createElement("div");
    const namespaceBtn = document.createElement("button");
    const label = document.createElement("label");

    label.innerHTML = prefix;//
    namespaceBtn.innerHTML = "X";
    namespaceBtn.className = "btn btn-danger"

    namespaceBtn.style = "margin:1px";
    namespaceDiv.id = prefix;
    
    namespaceBtn.addEventListener("click", function() {
        deleteNameSpace(prefix);
    });
    namespaceDiv.style = "overflow-y: auto; display: inline-block";
    namespaceDiv.appendChild(label);
    namespaceDiv.appendChild(namespaceBtn);
    namespaceContainer.appendChild(namespaceDiv);

    //add namespace to namespace array
    namespaceArray.prefix[prefix] = url;
}

/*
**  This function delete namespace from the array and user interface.
**  Used in @displayNamespace(prefix, url) function as a addEventListener to the namespaces respective 
**  delete button in the UI.
**
*/
function deleteNameSpace(id) {
    const namespaceDiv = document.getElementById(id);
    const namespaceOptionID = document.getElementById(id + "-NSoption");
    const namespaceIdentifier = document.getElementById(id + ":");
    
    namespaceIdentifier.remove();
    namespaceOptionID.remove();
    namespaceDiv.remove();

    removePredefinedAttributes(id);
    
    delete namespaceArray.prefix[id];

}


/*
**  This function adds the namespace to the attribute section in the Inspector. Used in @addNameSpace().
**  
*/
function displayNamespaceInspecAttr(namespace) {
    const selectionAttr = document.getElementById("attrOption");
    const option = document.createElement("option");
    option.id = namespace;
    option.innerHTML = namespace;
    selectionAttr.appendChild(option);
    
}

/*
**  This function adds a namespace option to the ID field in the inspector. 
**
*/
function displayNamespaceInspecID(NamespaceID) {
    const namespaceAddtoID = document.getElementById("addNStoID");
    const namespaceOption = document.createElement("option");
    namespaceOption.innerHTML = NamespaceID;
    namespaceOption.id = NamespaceID + "-NSoption";
    namespaceAddtoID.appendChild(namespaceOption);
}
