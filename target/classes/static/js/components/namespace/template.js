
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

    const templateNamespace = ["var https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=Av1vl05MV1M1WxZVb42rGLtTk37kIQa7T9AmsNarCJg%3D&amp;reserved=0", 
    "vvar https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=ShrK0YkKgDsTjAVFL0%2Byst5XhXThLNep2ev%2FN5hSF%2B0%3D&amp;reserved=0",
    "zone https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fzone%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=h3FIJgGbmcW5JyjoSKA1uGhLkoocZPvnEMDyJ0wtuAE%3D&amp;reserved=0",
    "datasci https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fdatasci%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C8508a24f34c9454239a708d8f2c5352e%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637526276100481689%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=yDvfzQA%2Fse5yZpxjLmZtD9M%2BYc6DGUQV3BM2%2BfJkJQY%3D&amp;reserved=0"];
        

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
    // const datasciAttributes = ["datasci:language"];
    addTemplateAttr(zoneAttributes, "zoneAttr");
    // addTemplateAttr(datasciAttributes, "datasciAttr");
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
    else if(id == "datasci") {
        removeAttr("datasciAttr");
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
   
    