var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, elementCount = 0;
var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
var elementsOnCanvas = [];
var namespaceArray = {prefix:[{default : '<http://kcl.ac.uk/1>'}]};
var connections = [];
var enitityArray = {entity:[]};
var activityArray = {activity:[]};
var agentArray = {agent:[]};
var lastClickElement;



jsPlumb.ready(function () {
    let element = "";   //the element which will be appended to the canvas
    //let clicked = false;    //check whether an element from the palette was clicked

    jsPlumbInstance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                visible: true,
                id: "ARROW",
                length: 14,
                foldback: 0.8
            }], [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
        ],
        Container: "canvas"
    });

    //var windows = jsPlumb.getSelector(".canvas-wide .window start jsplumb-connected");
    jsPlumbInstance.bind('connection', function (info) {
        let entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        let activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];
        let agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];; 

        //var source=info.sourceId.replace(/[0-9]/g, '');
        let source = info.source.className.split(' ').slice(1, 2)[0];
        let target = info.target.className.split(' ').slice(1, 2)[0];
       
        info.targetId = info.target.id;
        info.connection.targetId = info.target.id;

        let sourceID = info.sourceId;
        let targetID = info.targetId;
        //console.log(sourceID + " " + targetID);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        }); 

        if (source == entity && source == target) {
            info.connection.getOverlay("label").setLabel("wasDerivedFrom");
            connections.push("wasDerivedFrom(" + sourceID + ", " + targetID + ")");
        }
        else if(source == entity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAttributedTo");
            connections.push("wasAttributedTo(" + sourceID + ", " + targetID + ")");
        }
        else if(source == entity && target == activity) {
            info.connection.getOverlay("label").setLabel("wasGeneratedBy");
            connections.push("wasGeneratedBy(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAssociatedWith");
            connections.push("wasAssociatedWith(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == entity) {
            info.connection.getOverlay("label").setLabel("used");
            connections.push("used(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == source) {
            info.connection.getOverlay("label").setLabel("wasInformedBy");
            connections.push("wasInformedBy(" + sourceID + ", " + targetID + ")");
        }
        else if(source == agent && target == source) {
            info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
            connections.push("actedOnBehalfOf(" + sourceID + ", " + targetID + ")");
        }
        else if(source == agent && target == activity) {
            info.connection.getOverlay("label").setLabel("");
            //connections.push("wasAttributedTo(" + sourceID + ", " + targetID + ")");
        }
        else if(source == agent && target == entity) {
            info.connection.getOverlay("label").setLabel("");
            //connections.push("wasAttributedTo(" + sourceID + ", " + targetID + ")");
        }
    });
 
    jsPlumbInstance.bind('click', function (connection, e) {
        let answer = window.confirm("Are you sure you want to delete this connection?");
        if(answer) {
            jsPlumbInstance.detach(connection);
        }

    });

    $(document).on('dblclick','.window',function(){
        let answer = window.confirm("Are you sure you want to delete this connection?");
        for (let i = 0; i < elementsOnCanvas.length; i++) {
            if(elementsOnCanvas[i][0] == $(this)[0]) {
                elementsOnCanvas.splice(i, 1);
            }
        }
                //console.log($(this).remove());
        if(answer) {
            jsPlumbInstance.remove($(this));
        }
       
    });
  
    //instance.connect({ source: "opened", target: "phone1", type:"basic" });
    //define basic connection type
    // var basicType = {
    //     connector: "StateMachine",
    //     paintStyle: {strokeStyle: "#216477", lineWidth: 4},
    //     hoverPaintStyle: {strokeStyle: "blue"}
    // };
    //jsPlumbInstance.registerConnectionType("basic", basicType);
    jsPlumbInstance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
    //style for the connector
    var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#61B7CF",
        joinstyle: "round",
        outlineColor: "white",
        outlineWidth: 2
    },

    //style for the connector hover
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#216477",
        outlineWidth: 2,
        outlineColor: "white"
    },
    endpointHoverStyle = {
        fillStyle: "#216477",
        strokeStyle: "#216477"
    },

    //the source endpoint definition from which a connection can be started
    sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
            strokeStyle: "#7AB02C",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: ["Flowchart", {stub: [40, 60], gap: 5, cornerRadius: 5, alwaysRespectStubs: true}],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        EndpointOverlays: [],
        maxConnections: -1,
        dragOptions: {},
        connectorOverlays: [
            ["Arrow", {
                location: 1,
                visible: true,
                id: "ARROW",
                direction: 1
            }]
        ]
    },

    //definition of the target endpoint the connector would end
    targetEndpoint = {
        endpoint: "Dot",
        paintStyle: {fillStyle: "#7AB02C", radius: 9},
        maxConnections: -1,
        dropOptions: {hoverClass: "hover", activeClass: "active"},
        hoverPaintStyle: endpointHoverStyle,
        isTarget: true
    };

       
	function makeDraggable(id, className, text){
	    $(id).draggable({
		helper: function(){
		    return $("<div/>",{
			text: text,
			class:className
		    });
		},
		stack: ".custom",
		revert: false
	    });
	}

	makeDraggable("#entityID", "window start jsplumb-connected custom", "entity");
	makeDraggable("#activityID", "window step jsplumb-connected-step custom", "activity");
    makeDraggable("#agentID", "window diamond jsplumb-connected-end custom", "agents");

    //make the editor canvas droppable
    entityCount = 1;
    agentCount = 1;
    activityCount = 1;
    tt = 0;
    
    $("#canvas").droppable({
        //accept: ".window",
        drop: function (event, ui) {
            //console.log(idIs);
            if (clicked) {
    	        clicked = false;
                elementCount++;

                let id;
                id =  myFunction("Please enter your ID:", "ID");
                element = createElement(id);

                drawElement(element, "#canvas", id);//, name);
    	        element = "";
	        }
        }   
    });

    //take the x, y coordinates of the current mouse position
    var x, y;
    $(document).on("mousemove", function (event) {
        x = event.pageX;
        y = event.pageY;
        if (clicked) {
            properties[0].top = y - 308;
            properties[0].left = x - 308;
        }
    });

    var properties;
    var clicked = false;
    function loadProperties(clsName, left, top, label, startpoints, endpoints, contenteditable) {
        properties = [];
        properties.push({
            left: left,
            top: top,
            clsName: clsName,
            label: label,
            startpoints: startpoints,
            endpoints: endpoints,
            contenteditable: contenteditable
        });
    }

	//load properties of a start element once the start element in the palette is clicked
    $('#entityID').mousedown(function () {
        loadProperties("window start custom jtk-node jsplumb-connected", "5em", "5em", "entity", ["Left", "Right"],
            ["Top", "Bottom"], false);
        clicked = true;
    });
    //["Left", "Right"], ["Top", "Bottom"]
    //load properties of a step element once the step element in the palette is clicked
    $('#activityID').mousedown(function () {
        loadProperties("window step custom jtk-node jsplumb-connected-step", "5em", "5em", "activity",
        ["Left", "Right"],
        ["Top", "Bottom"], false);
        clicked = true;
    });

    //load properties of a decision element once the decision element in the palette is clicked
    $('#agentID').mousedown(function () {
        loadProperties("window diamond custom jtk-node jsplumb-connected-end", "5em", "5em", "agents",
        ["Bottom"],
        ["Left", "Right", "Top"], true, 100, 100);
        clicked = true;
    });

   
    //create an element to be drawn on the canvas
    function createElement(id) {
        let arr = [];
        let elm = $('<div>').addClass(properties[0].clsName).attr('id', id).attr('variables', arr);
        //console.log(properties[0].clsName);
        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });
        //console.log(properties[0].clsName );
        let strong = $('<strong>');
        elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
        let p = $('<p>').text(id);
        p.id = "p";
        strong.append(p);
        elm.append(strong);

        let entity = "window start custom jtk-node jsplumb-connected";
        let activity = "window step custom jtk-node jsplumb-connected-step";
        let agent = "window diamond custom jtk-node jsplumb-connected-end";
        
        // if(properties[0].clsName == entity) {
        //     enitityArray['entity'].push({[id]: {}});
        // }
        // else if(properties[0].clsName == activity) {
        //     activityArray['activity'].push({[id]: {}});
        // }
        // else {
        //     if(properties[0].clsName == agent) {
        //         agentArray['agent'].push({[id]: {}});
        //     }
        // }
        // console.log(enitityArray);
        return elm;
    }

     //add the endpoints for the elements
    // var epp;
    var _addEndpoints = function (sourceAnchors, targetAnchors, id) {
        for (let i = 0; i < sourceAnchors.length; i++) {
            let sourceUUID = sourceAnchors[i];
            epp = jsPlumbInstance.addEndpoint(id, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            //sourcepointList.push([id , epp]);
            epp = null;
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            let targetUUID = targetAnchors[j];
            epp = jsPlumbInstance.addEndpoint(id, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID
            });
            // endpointList.push([id, epp]);
            //epp.canvas.setAttribute("title", "Drop a connection here");
            epp = null;
        }
    };
    
    function drawElement(element, canvasId, id) {
        $(canvasId).append(element);
        _addEndpoints(properties[0].startpoints, properties[0].endpoints, id);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });   
        elementsOnCanvas.push(element);
    }

    var clickedObject;
    var idEle;

    function displayInspectorWindow(node, id) {
        let inspectorWindow = document.getElementById("inspectorSpan");

        if (inspectorWindow.style.display == "none") {
            inspectorWindow.style.display = "inline-block";
            //console.log("On click " + objectIdentifier);
            clickedObject = node;
            //inspectorAttr(objectIdentifier);
            let placeholder = document.getElementById("objectName");
            placeholder.placeholder = id;
        } else {
            inspectorWindow.style.display = "none";
        }
    }

    function displayInspectorValues(id) {
        let inspectorValues = document.querySelectorAll("#inspectorValuesContainer div");
        
        //console.log(Is);
        for (let i = 0; i < inspectorValues.length; i++) {
            if(inspectorValues[i].id != (id+"Inspector")) {
                inspectorValues[i].style.display = "none";
            }
            else {
                inspectorValues[i].style.display = "inline-block";
            }
        }
        let attributes = document.getElementById(id+"Attr");
            if(attributes) {
                attributes.style.display = "inline-block";
            }
    }

    document.onclick = function(node) {
        let clssName = node.path[2].className.split(' ').slice(1, 2);
        if(clssName == "start" || clssName == "step" || clssName == "diamond") {
            let objectIdentifier = node.path[2].id;
            idEle = node.path[2].id;
            console.log(objectIdentifier);
            displayInspectorWindow(node, objectIdentifier);
            displayInspectorValues(objectIdentifier);
            lastClickElement = clssName;
            //console.log(elementsOnCanvas);
        }
    }
    

    //are = idEle; 
    var block = false;  
    document.getElementById("attrBtn").addEventListener("click",  function() {
        if(!block) {
            inspectorAttr(idEle);
            block = true;
        }
    });   
   
    //var inputValue;
    function inspectorAttr(id) {
        let inspectorWindow = document.getElementById(id+"Inspector");
        let div = document.getElementById("inspectorValuesContainer");
        let selectionAttr = document.getElementById("attrOption");
        let selection =  document.getElementById("attr");
        
        let form = document.createElement('form');
        let input = document.createElement("input");
        let label = document.createElement("label");
        let button = document.createElement("button");
        let br = document.createElement("br");
        
        let attributeType = selection.options[selection.selectedIndex].text;
        
        if(selection.options[selection.selectedIndex].parentElement.label == "Attributes") {
            let enterAttributeValue = prompt("Enter " +  attributeType + " type", "type");
            label.innerHTML = attributeType + enterAttributeValue;
        }
        else {
            label.innerHTML = attributeType;
        }
        

        input.id = id+"Input";
        input.type = 'text';
        input.name = 'name';
        button.innerHTML = "S";
        button.type = 'button';
        button.id = id+"Button";
        label.id = id+"Label";

        $(form).submit(function (e) {
            e.preventDefault();
        });
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(button);
        //

        if(inspectorWindow) {
            inspectorWindow.appendChild(form);
            div.appendChild(inspectorWindow);
        }
        else {
            input.id = id+"Input";
            button.id = id+"Button";
            let localDiv = document.createElement("div");
            localDiv.id = id+"Inspector";
            localDiv.appendChild(form);
            div.appendChild(localDiv);
        }
        
        displayNodeValues(id, input, label, button, form);
        
    }

   
    function displayNodeValues(id, input, label, button, form) { 
        let divAttr = document.getElementById(id+"Attr");
     
        if(!divAttr) {
            divAttr = document.createElement('div');
            divAttr.id = id+"Attr";
        }
        let br = document.createElement("br");
        let attrButton = document.createElement("button");
        let attrlabel = document.createElement("label");
        
        //add attributes to the inspector window
        document.getElementById(id+"Button").addEventListener("click", function() {
            block = false;
            let attributeValue = document.getElementById(id+"Input").value;
            //console.log(attributeValue);
            let node = document.getElementById(id);
            node.attributes[2].nodeValue =  node.attributes[2].nodeValue + label.innerHTML+ ": " + attributeValue + ",";
            
            let nodeAttrs = node.attributes[2].nodeValue.split(",");
            nodeAttrs.pop();
            
            for (let i = 0; i < nodeAttrs.length; i++) {
                attrButton.innerHTML = "X";
                attrButton.type = 'button';
                attrButton.id = nodeAttrs[i];
                //delete
                attrButton.addEventListener("click", function() {
                    attrlabel.remove();
                    attrButton.remove();
                    node.attributes[2].nodeValue = node.attributes[2].nodeValue.replace(attrlabel.innerHTML+",", "");
                    //console.log( node.attributes[2].nodeValue);
                })
                attrlabel.innerHTML = nodeAttrs[i];
                //console.log(attrlabel.innerHTML);
                let prefix = nodeAttrs[i].split(" ")[0].slice(0, -1);
                //let value =
                divAttr.appendChild(attrlabel);
                divAttr.appendChild(attrButton);
                divAttr.appendChild(br);
            }
                //console.log(node.attributes[2].nodeValue);
                //console.log(node.attributes[2]);
                input.remove();
                label.remove(); 
                button.remove();
            });
        form.appendChild(divAttr);
    }

    function myFunction(message, placeholder) { 
        let txt;
        let promptAlert = prompt(message, placeholder);
        if (promptAlert == null || promptAlert == "") {
          txt = "User cancelled the prompt.";
        } else {
          txt =  promptAlert;
        }
        //idIs = txt;
        return txt;
    }

    
    function changeElementIDinArray(oldID, newID) {
        if(lastClickElement == "start") {
            enitityArray.entity[0][newID] = enitityArray.entity[0][oldID];
            delete enitityArray.entity[0][oldID];
        }
        //change Activ ID in entity array
        else if(lastClickElement == "step") {
            activityArray.activity[0][newID] = activityArray.activity[0][oldID];
            delete activityArray.activity[0][oldID];
        }
        else if(lastClickElement == "diamond") {
            agentArray.agent[0][newID] = agentArray.agent[0][oldID];
            delete agentArray.agent[0][oldID];
        }
        console.log(enitityArray);
        console.log(activityArray);
        console.log(enitityArray);
    } 

    saveFunction = function saveOutput() {
        var nodeID = clickedObject.path[2].id;
        let userEnteredID = document.getElementById("objectName");
        let p = document.getElementById(nodeID).querySelectorAll("p");//.getElementsByClassName("p");
        let cont = document.getElementById(nodeID+"Inspector");
        let input = document.getElementById(nodeID+"Input");
        let button = document.getElementById(nodeID+"Button");
        let label = document.getElementById(nodeID+"Label");
        let attr = document.getElementById(nodeID+"Attr");

        //console.log(nodeID);
        let getNsOption = document.getElementById("addNStoID");
        let getNSOptionValue = getNsOption.options[getNsOption.selectedIndex].value;
        
        
        
        //Delete old element ID
        if(userEnteredID.value != '') {
             //change connection ID
            for(let i = 0; i < connections.length; i++) {
                if(connections[i].includes(nodeID)) {
                    connections[i] = connections[i].replaceAll(nodeID, userEnteredID.value);
                }
            }

            if(getNSOptionValue != "default") {
                userEnteredID.value = getNSOptionValue + ":" + userEnteredID.value;
            }
            let oldID = nodeID;

            //update nodeID with new ID
            nodeID =  userEnteredID.value;
            p[0].innerHTML = nodeID;
            userEnteredID.value = '';       
            
            if(cont) { 
                cont.id = nodeID+"Inspector";
            }
            if(input) { 
                input.id = nodeID+"Input";
            }
            if(button) { 
                button.id = nodeID+"Button";
            }
            if(label) { 
                label.id = nodeID+"Label";
            }
            if(attr) { 
                attr.id = nodeID+"Attr";
            }

            //changeElementIDinArray(nodeID, userEnteredID.value);
            //changeElementIDinArray(oldID, nodeID);

            jsPlumbInstance.setId(clickedObject.path[2].id, nodeID);
            jsPlumbInstance.recalculateOffsets(nodeID);

            idEle = nodeID;
        }
    }

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
        namespaceArray['prefix'] = namespaceArray.prefix.filter(obj => !(obj.hasOwnProperty(id)));
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
        let url = userInputArr[1];

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
        namespaceArray['prefix'].push({[prefix]: url});
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
            let templateNamespace = ["var <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=Av1vl05MV1M1WxZVb42rGLtTk37kIQa7T9AmsNarCJg%3D&amp;reserved=0>", 
        "vvar <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=ShrK0YkKgDsTjAVFL0%2Byst5XhXThLNep2ev%2FN5hSF%2B0%3D&amp;reserved=0>",
        "zone <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fzone%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=h3FIJgGbmcW5JyjoSKA1uGhLkoocZPvnEMDyJ0wtuAE%3D&amp;reserved=0>"]
            
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
                namespaceArray['prefix'].push({[prefixValue]: url})

                addNamespacetoInspector(prefixValue);

                namespaceBtn.addEventListener("click", function() {
                    deleteNameSpace(prefixValue);
                });
                addNamespaceAttributes(prefixValue + ":");
            }

            //addNamespaceAttributes();
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

    /**
     * JSON Section
     */

    document.getElementById("flowchartSaveBtn").addEventListener("click", createJSON);

    function createJSON(){
        addElementToArray();

        var JSON_Array = [];
        JSON_Array = JSON_Array.concat(namespaceArray, enitityArray, activityArray, agentArray);
        //console.log(JSON_Array);
        //console.log(jsPlumbInstance.getConnections());
    }

    function addElementToArray() {
       elementsOnCanvas.forEach(function (e) {
           let className = e[0].className;
           let id = e[0].id;
           let attributeValues = e[0].attributes[2].nodeValue.split(",");

           let entity =  "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
           let activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable";
           let agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable";

           attributeValues.pop();

           if(className == entity) {
                addAttributesToElementinArray(id, attributeValues, "entity");
           }
           else if(className == activity) {
                addAttributesToElementinArray(id, attributeValues, "activity");
           }
           else if(className == agent) {
                addAttributesToElementinArray(id, attributeValues, "agent");
           }
       });
        //console.log(enitityArray);
        //console.log(activityArray);
        //console.log(agentArray);
    }

    function addAttributesToElementinArray(id, elementAttributeValues, type) {
        var attribute = []
        for(let i = 0; i < elementAttributeValues.length; i++) {
            let allAttributes = elementAttributeValues[i].split(" ");
            let prefix = allAttributes[0].slice(0, -1); ;
            let value = allAttributes[1];
            attribute.push({[prefix] : value});
        }
        if(type == "entity") {
            enitityArray['entity'].push({[id] : attribute});
        }
        else if(type == "activity") {
            activityArray['activity'].push({[id] : attribute});
        }
        else if(type == "agent") {
            agentArray['agent'].push({[id] : attribute});
        }
    }

});

var saveFunction;
var del;
var arr;
function removeDefaultNameSpace() {
    var removeDefaultNameSpaceDiv = document.getElementById("defaultNameSpaceDiv");
    arr.shift(); 
    removeDefaultNameSpaceDiv.remove();
    console.log(arr);
}




