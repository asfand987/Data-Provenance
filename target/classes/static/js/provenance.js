var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, elementCount = 0;
var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
var elementsOnCanvas = [];
var namespace = ["default <http://kcl.ac.uk/1>"];

jsPlumb.ready(function () {
    var element = "";   //the element which will be appended to the canvas
    var clicked = false;    //check whether an element from the palette was clicked

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
        var entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        var activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];
        var agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];; 

        //var source=info.sourceId.replace(/[0-9]/g, '');
        var source = info.source.className.split(' ').slice(1, 2)[0];
        var target = info.target.className.split(' ').slice(1, 2)[0];
       
        info.targetId = info.target.id;
        info.connection.targetId = info.target.id;

        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        }); 

        if (source == entity && source == target) {
            info.connection.getOverlay("label").setLabel("wasDerivedFrom");
        }
        else if(source == entity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAttributedTo");
        }
        else if(source == entity && target == activity) {
            info.connection.getOverlay("label").setLabel("wasGeneratedBy");
        }
        else if(source == activity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAssociatedWith");
        }
        else if(source == activity && target == entity) {
            info.connection.getOverlay("label").setLabel("used");
        }
        else if(source == activity && target == source) {
            info.connection.getOverlay("label").setLabel("wasInformedBy");
        }
        else if(source == agent && target == source) {
            info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
        }
        else if(source == agent && target == activity) {
            info.connection.getOverlay("label").setLabel("");
        }
        else if(source == agent && target == entity) {
            info.connection.getOverlay("label").setLabel("");
        }
    });
 
    jsPlumbInstance.bind('click', function (connection, e) {
        var answer = window.confirm("Are you sure you want to delete this connection?");
        if(answer) {
            jsPlumbInstance.detach(connection);
        }

    });

    $(document).on('dblclick','.window',function(){
        var answer = window.confirm("Are you sure you want to delete this connection?");
        for (var i = 0; i < elementsOnCanvas.length; i++) {
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

                var id;
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
        var arr = [];
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id).attr('variables', arr);
        
        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });
        //console.log(properties[0].clsName );
        var strong = $('<strong>');
        elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
        var p = $('<p>').text(id);
        p.id = "p";
        strong.append(p);
        elm.append(strong);

        return elm;
    }

     //add the endpoints for the elements
    // var epp;
    var _addEndpoints = function (sourceAnchors, targetAnchors, id) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = sourceAnchors[i];
            epp = jsPlumbInstance.addEndpoint(id, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            //sourcepointList.push([id , epp]);
            epp = null;
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = targetAnchors[j];
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
        var inspectorWindow = document.getElementById("inspectorSpan");

        if (inspectorWindow.style.display == "none") {
            inspectorWindow.style.display = "inline-block";
            //console.log("On click " + objectIdentifier);
            clickedObject = node;
            //inspectorAttr(objectIdentifier);
            var placeholder = document.getElementById("objectName");
            placeholder.placeholder = id;
        } else {
            inspectorWindow.style.display = "none";
        }
    }

    function displayInspectorValues(id) {
        var inspectorValues = document.querySelectorAll("#inspectorValuesContainer div");
        
        //console.log(Is);
        for (var i = 0; i < inspectorValues.length; i++) {
            if(inspectorValues[i].id != (id+"Inspector")) {
                inspectorValues[i].style.display = "none";
            }
            else {
                inspectorValues[i].style.display = "inline-block";
            }
        }
        var attributes = document.getElementById(id+"Attr");
            if(attributes) {
                attributes.style.display = "inline-block";
            }
    }

    document.onclick = function(node) {
        var clssName = node.path[2].className.split(' ').slice(1, 2);
        if(clssName == "start" || clssName == "step" || clssName == "diamond") {
            var objectIdentifier = node.path[2].id;
            idEle = node.path[2].id;
            displayInspectorWindow(node, objectIdentifier);
            displayInspectorValues(objectIdentifier);
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
        var inspectorWindow = document.getElementById(id+"Inspector");
        var div = document.getElementById("inspectorValuesContainer");
        let selectionAttr = document.getElementById("attrOption");
        let selection =  document.getElementById("attr");
        
        var form = document.createElement('form');
        var input = document.createElement("input");
        var label = document.createElement("label");
        var button = document.createElement("button");
        var br = document.createElement("br");
        
        let attributeType = selection.options[selection.selectedIndex].text;
        let enterAttributeValue = prompt("Enter " +  attributeType + " type", "type");
        label.innerHTML = attributeType + enterAttributeValue;

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
            var localDiv = document.createElement("div");
            localDiv.id = id+"Inspector";
            localDiv.appendChild(form);
            div.appendChild(localDiv);
        }
        
        displayNodeValues(id, input, label, button, form);
        
    }

    function addNamespaceAttributes() {
        let selectionAttr = document.getElementById("attrOption");
        for(let i = 1; i < namespace.length; i++) {
            let word = namespace[i].split(" ")[1] + ":";
            let containsAttr = false;
            for(let j = 0; j < selectionAttr.length; j++) {
                console.log("word " + word);
                console.log("selection " + selectionAttr[j].innerHTML);
                if(word == selectionAttr[j].innerHTML) {
                    console.log("true");
                    containsAttr = true;
                    break;
                }
            }

            if(!containsAttr) {
                let option = document.createElement("option");
                option.innerHTML = word;
                selectionAttr.appendChild(option);
            }
        }
        
    }
    function displayNodeValues(id, input, label, button, form) {
        var divAttr = document.getElementById(id+"Attr");
        if(divAttr) {
            form.appendChild(divAttr);
        }
        else {
            var divAttr = document.createElement('div');
            divAttr.id = id+"Attr";
        }

        var br = document.createElement("br");
        var attrButton = document.createElement("button");
        var attrlabel = document.createElement("label");
    
        document.getElementById(id+"Button").addEventListener("click", function() {
            block = false;
            var inputValue = document.getElementById(id+"Input").value;
            var node = document.getElementById(id);
            node.attributes[2].nodeValue =  node.attributes[2].nodeValue + label.innerHTML+ ": " + inputValue + ",";
            
            var nodeAttrs = node.attributes[2].nodeValue.split(",");
            nodeAttrs.pop();
            
            for (var i = 0; i < nodeAttrs.length; i++) {
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
                divAttr.appendChild(attrlabel);
                divAttr.appendChild(attrButton);
                divAttr.appendChild(br);
            }
            console.log(node.attributes[2]);
            input.remove();
            label.remove(); 
            button.remove();
        });
        form.appendChild(divAttr);
    }

    function myFunction(message, placeholder) { 
        var txt;
        var promptAlert = prompt(message, placeholder);
        if (promptAlert == null || promptAlert == "") {
          txt = "User cancelled the prompt.";
        } else {
          txt =  promptAlert;
        }
        //idIs = txt;
        return txt;
    }

    function printValues() {
        console.log("test");
    };
    
    document.getElementById("flowchartSaveBtn").addEventListener("click", printValues);

    saveFunction = function saveOutput() {
        var nodeID = clickedObject.path[2].id;
        
        var x = document.getElementById("objectName");
        var p = document.getElementById(nodeID).querySelectorAll("p");//.getElementsByClassName("p");
        var cont = document.getElementById(nodeID+"Inspector");
        var input = document.getElementById(nodeID+"Input");
        var button = document.getElementById(nodeID+"Button");
        var label = document.getElementById(nodeID+"Label");
        var attr = document.getElementById(nodeID+"Attr");

        //Delete old element ID
        if(x.value != '') {
            nodeID =  x.value;
            p[0].innerHTML = nodeID;
            x.value = '';       
            
            if(cont) { cont.id = nodeID+"Inspector";}
            if(input) { input.id = nodeID+"Input";}
            if(button) { button.id = nodeID+"Button";}
            if(label) { label.id = nodeID+"Label";}
            if(attr) { attr.id = nodeID+"Attr";}
            jsPlumbInstance.setId(clickedObject.path[2].id, nodeID);
            jsPlumbInstance.recalculateOffsets(nodeID);

            idEle = nodeID;
        }
    }

    document.getElementById("nameSpaceButton").addEventListener("click", addNameSpace);

    function deleteNameSpace(id, namespaceId) {
        var namespaceDiv = document.getElementById(id);
        namespaceDiv.remove();
        var index = namespace.indexOf(namespaceId);
        if (index > -1) {
            namespace.splice(index, 1);
        }
        //console.log(namespace)
    }

    function addNameSpace() {
        let namespaceAlert = prompt("Enter Namespace", "namespace");
        let namespaceContainer = document.getElementById("namespaceContainer"); 
        let label = document.createElement("label");
        let br = document.createElement("br");
        let namespaceDiv = document.createElement("div");
        let namespaceBtn = document.createElement("button");
        label.innerHTML = "prefix " + namespaceAlert;
        namespaceBtn.innerHTML = "X";
        namespaceBtn.style = "margin:5px";
        
        namespaceDiv.id = label.innerHTML;
        namespaceBtn.addEventListener("click", function() {
            deleteNameSpace(namespaceDiv.id, label.innerHTML);
        });
        namespaceDiv.style = "overflow-y: auto";
        namespaceDiv.appendChild(label);
        namespaceDiv.appendChild(namespaceBtn);
        namespaceDiv.appendChild(br);
        namespaceContainer.appendChild(namespaceDiv);
        namespace.push(label.innerHTML);

        addNamespaceAttributes();
        //console.log(namespace);
    }

    arr = namespace;

    //template section
    document.getElementById("templateButton").addEventListener("click", addTemplate);

    function addTemplate() {
        let answer = window.confirm("Are you sure you want to use this template?");
        if(answer) {
            let namespaceContainer = document.getElementById("namespaceContainer"); 
            let templateNamespace = ["prefix var <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=Av1vl05MV1M1WxZVb42rGLtTk37kIQa7T9AmsNarCJg%3D&amp;reserved=0>", 
        "prefix vvar <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fvvar%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=ShrK0YkKgDsTjAVFL0%2Byst5XhXThLNep2ev%2FN5hSF%2B0%3D&amp;reserved=0>",
        "prefix zone <https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fkclhi.org%2Fprovenance%2Fpgt%2Fzone%2F&amp;data=04%7C01%7Casfand.khan%40kcl.ac.uk%7C3a4ba86164dd46d5754e08d8d739fefc%7C8370cf1416f34c16b83c724071654356%7C0%7C0%7C637495991372983971%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&amp;sdata=h3FIJgGbmcW5JyjoSKA1uGhLkoocZPvnEMDyJ0wtuAE%3D&amp;reserved=0>"]
            
            for(let i = 0; i < templateNamespace.length; i++) {
                let label = document.createElement("label");
                let namespaceBtn = document.createElement("button");
                let br = document.createElement("br");
                let namespaceDiv = document.createElement("div");
                label.innerHTML = templateNamespace[i];
                namespaceBtn.innerHTML = "X";
                namespaceBtn.style = "margin:5px";
                namespaceDiv.id = label.innerHTML;
                namespaceBtn.addEventListener("click", function() {
                    deleteNameSpace(namespaceDiv.id, label.innerHTML);
                });
                namespaceDiv.style = "overflow-y: auto";
                namespaceDiv.appendChild(label);
                namespaceDiv.appendChild(namespaceBtn);
                namespaceDiv.appendChild(br);
                namespaceContainer.appendChild(namespaceDiv);
                namespace.push(label.innerHTML);
            }
            addNamespaceAttributes();
            addTemplateNamespaceAttributes();
        }
    }

    function addTemplateNamespaceAttributes() {
        let selectionAttr = document.getElementById("pd-attrOption");
        let namespaceAttrs = ["zone:id", "zone:type", "zone:min", "zone:max", "zone:parent", "zone:relation"];

        for(let i = 0; i < namespaceAttrs.length; i++) {
            let option = document.createElement("option");
            let br = document.createElement("br");
            option.innerHTML = namespaceAttrs[i];
            selectionAttr.appendChild(option);
            selectionAttr.appendChild(br);
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



