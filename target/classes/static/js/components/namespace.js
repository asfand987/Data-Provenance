document.getElementById("nameSpaceButton").addEventListener("click", addNameSpace);

    function deleteNameSpace(id) {
        let namespaceDiv = document.getElementById(id);
        let namespaceOptionID = document.getElementById(id + "Option");
        let namespaceIdentifier = document.getElementById(id + ":");
        
        namespaceIdentifier.remove();
        namespaceOptionID.remove();
        namespaceDiv.remove();

        if(id == "zone") {
            for(let i = 0; i < 6; i++) {
                let zoneAttr = document.getElementById("zoneAttr" + i);
                zoneAttr.remove();
            }            
        }
        
        //Delete from array
        delete namespaceArray.prefix[id];
        //console.log(namespaceArray);

    }


    function addNamespaceAttributes(namespace) {
        let selectionAttr = document.getElementById("attrOption");
        let option = document.createElement("option");
        option.id = namespace;
        option.innerHTML = namespace;
        selectionAttr.appendChild(option);
     
    }

    function addNameSpace() {
        let userInput = prompt("Prefix", "namespace");
        let namespaceContainer = document.getElementById("namespaceContainer"); 
        let label = document.createElement("label");
        let br = document.createElement("br");
        let namespaceDiv = document.createElement("div");
        let namespaceBtn = document.createElement("button");

        let userInputArr = userInput.split(" ");
        let prefix = userInputArr[0];
        //console.log(url);
        let url = userInputArr[1];
        //console.log(url);

        label.innerHTML = prefix;//
        namespaceBtn.innerHTML = "X";
        namespaceBtn.style = "margin:5px";
        namespaceDiv.id = prefix;
        namespaceBtn.addEventListener("click", function() {
            deleteNameSpace(prefix);
        });
        namespaceDiv.style = "overflow-y: auto";
        namespaceDiv.appendChild(label);
        namespaceDiv.appendChild(namespaceBtn);
        namespaceDiv.appendChild(br);
        namespaceContainer.appendChild(namespaceDiv);

        //add namespace to namespace arr
        //namespaceArray['prefix'].push({[prefix]: url});
        namespaceArray.prefix[prefix] = url;

        //console.log(namespaceArray);

        addNamespaceAttributes(userInput.split(' ').slice(0, 1) + ":");
        addNamespacetoInspector(prefix);
    }

    function addNamespacetoInspector(NamespaceID) {
        let namespaceAddtoID = document.getElementById("addNStoID");
        let namespaceOption = document.createElement("option");
        namespaceOption.innerHTML = NamespaceID;
        namespaceOption.id = NamespaceID + "Option";
        namespaceAddtoID.appendChild(namespaceOption);
         //console.log(namespace);
    }
    arr = namespaceArray;

    //template section
    document.getElementById("templateButton").addEventListener("click", addTemplate);

    function addTemplate() {
        let answer = window.confirm("Are you sure you want to use this template?");
        if(answer) {
            let namespaceContainer = document.getElementById("namespaceContainer"); 
            let templateNamespace = ["var https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=Av1vl05MV1M1WxZVb42rGLtTk37kIQa7T9AmsNarCJg%3D&amp;reserved=0", 
        "vvar https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=ShrK0YkKgDsTjAVFL0%2Byst5XhXThLNep2ev%2FN5hSF%2B0%3D&amp;reserved=0",
        "zone https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fzone%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=h3FIJgGbmcW5JyjoSKA1uGhLkoocZPvnEMDyJ0wtuAE%3D&amp;reserved=0"]
            
            for(let i = 0; i < templateNamespace.length; i++) {
                let label = document.createElement("label");
                let namespaceBtn = document.createElement("button");
                let br = document.createElement("br");
                let namespaceDiv = document.createElement("div");
                let templateNamespaceArr = templateNamespace[i].split(' ');
                let prefixValue = templateNamespaceArr[0];
                let url = templateNamespaceArr[1];
                //console.log(id);
                label.innerHTML = prefixValue;
                namespaceBtn.innerHTML = "X";
                namespaceBtn.style = "margin:5px";

                namespaceDiv.id = prefixValue;
                namespaceDiv.style = "overflow-y: auto";
                namespaceDiv.appendChild(label);
                namespaceDiv.appendChild(namespaceBtn);
                namespaceDiv.appendChild(br);

                namespaceContainer.appendChild(namespaceDiv);
                //namespaceArray.prefix.push({[prefixValue]: url});
                namespaceArray.prefix[prefixValue] = url;
                addNamespacetoInspector(prefixValue);

                namespaceBtn.addEventListener("click", function() {
                    deleteNameSpace(prefixValue);
                });
                addNamespaceAttributes(prefixValue + ":");
            }

            addTemplateNamespaceAttributes();
            
        }
    }

    function addTemplateNamespaceAttributes() {
        let selectionAttr = document.getElementById("pd-attrOption");
        let namespaceAttrs = ["zone:id", "zone:type", "zone:min", "zone:max", "zone:parent", "zone:relation"];

        for(let i = 0; i < namespaceAttrs.length; i++) {
            let option = document.createElement("option");
            let br = document.createElement("br");
            option.id = "zoneAttr" + i;
            option.innerHTML = namespaceAttrs[i];
            selectionAttr.appendChild(option);
            selectionAttr.appendChild(br);
        }
    }
   
    var saveFunction;
    var del;
    var arr;
    function removeDefaultNameSpace() {
        var removeDefaultNameSpaceDiv = document.getElementById("defaultNameSpaceDiv");
        arr.shift(); 
        removeDefaultNameSpaceDiv.remove();
        console.log(arr);
    }
    
    