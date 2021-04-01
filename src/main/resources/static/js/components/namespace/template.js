
//----------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------//
//------------------------------------Template section------------------------------------------------//
//----------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------//

/*
**  This function adds template namespaces and then displays it in the UI.
**
*/
document.getElementById("templateButton").addEventListener("click", addTemplate);


function addTemplate() {
    const answer = window.confirm("Are you sure you want to use this template?");
    if(!answer) return;

    const templateNamespace = ["var https://kclhi.org/provenance/pgt/var/", 
    "vvar https://kclhi.org/provenance/pgt/vvar/",
    "zone https://kclhi.org/provenance/pgt/zone/"];

    displayTempInInspectorID(templateNamespace);
    displayTempInInspectorAttrs();
        
}

/** 
 *  This function displays the template namespaces in the UI.
 *  Used in addTemplate()
 *
**/
function displayTempInInspectorID(templateNamespace) {
    const namespaceContainer = document.getElementById("namespaceContainer"); 
    for(let i = 0; i < templateNamespace.length; i++) {
        //Create elements to display
        const label = document.createElement("label");
        const namespaceBtn = document.createElement("button");
        const namespaceDiv = document.createElement("div");

        //separate prefix name from url
        const templateNamespaceArr = templateNamespace[i].split(' ');
        const prefixValue = templateNamespaceArr[0];
        const url = templateNamespaceArr[1];

        label.innerHTML = prefixValue;
        namespaceBtn.innerHTML = "X";
        namespaceBtn.className = "btn btn-danger" //namespaceBtn
        namespaceBtn.style = "margin:1px";
        namespaceDiv.id = prefixValue;
        namespaceDiv.style = "overflow-y: auto";
        namespaceDiv.appendChild(label);
        namespaceDiv.appendChild(namespaceBtn);

        namespaceContainer.appendChild(namespaceDiv);
        namespaceArray.prefix[prefixValue] = url;

        displayNamespaceInspecID(prefixValue);

        namespaceBtn.addEventListener("click", function() {
            deleteNameSpace(prefixValue);
        });
        displayNamespaceInspecAttr(prefixValue + ":");
    }
}

/**
 * Add template namespaces to attributes section and predefined attributes section in inspector.
 * 
 */
function displayTempInInspectorAttrs() {
    const zoneAttributes = ["zone:id", "zone:type", "zone:min", "zone:max", "zone:parent", "zone:relation"];
    addTemplateAttr(zoneAttributes, "zoneAttr");
}

function addTemplateAttr(arr, type) {
    const selectionAttr = document.getElementById("pd-attrOption");
    for(let i = 0; i < arr.length; i++) {
        const option = document.createElement("option");
        option.id = type + i;
        option.innerHTML = arr[i];
        selectionAttr.appendChild(option);
    }
}

    /*
**  This function removes all predefined zone attributes when it gets deleted from the UI.
**  Used in @deleteNameSpace(id).
**
*/
function removePredefinedAttributes(id) {
    if(id == "zone") {
        removeAttr("zoneAttr");
    }
}

function removeAttr(attrID) {
    let index = 1;
    if(attrID == "zoneAttr") index = 6;
    for(index = 0; index < 6; index++) {
        let zoneAttr = document.getElementById(attrID + index);
        zoneAttr.remove();
    }  
}
   
    