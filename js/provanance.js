var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, elementCount = 0;
var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element

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
    jsPlumbInstance.bind("connection", function (info) {
        var entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
        var activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected";
        var agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected"; 
        //var source=info.sourceId.replace(/[0-9]/g, '');
        var source = info.source.className;
        var target = info.target.className;
       
        info.targetId = info.target.id;
        info.connection.targetId = info.target.id;

        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        }); 
       
        //console.log(info);
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
 

    //instance.connect({ source: "opened", target: "phone1", type:"basic" });
    //define basic connection type
    var basicType = {
        connector: "StateMachine",
        paintStyle: {strokeStyle: "#216477", lineWidth: 4},
        hoverPaintStyle: {strokeStyle: "blue"}
    };
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

    /*$("#agentID").draggable({
        helper: function () {
    	   return createElement("");
        },
        stack: ".custom",
        revert: false
	});*/
   
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
        //p.innerHTML = id;
        p.id = "p";
        //console.log(p);
        strong.append(p);
        elm.append(strong);
        //t.append(elm);
        //console.log(elm[0].attributes);
        return elm;
    }

     //add the endpoints for the elements
    var epp;
    var _addEndpoints = function (sourceAnchors, targetAnchors, id) {
        //console.log(sourceAnchors);
        
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = sourceAnchors[i];
            //console.log("sourceAnchors: " + sourceAnchors[i]);
            epp = jsPlumbInstance.addEndpoint(id, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            
            sourcepointList.push([id , epp]);
            //epp.canvas.setAttribute("title", "Drag a connection here");
            epp = null;
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = targetAnchors[j];
            epp = jsPlumbInstance.addEndpoint(id, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID
            });
            
            endpointList.push([id, epp]);
            //epp.canvas.setAttribute("title", "Drop a connection here");
            epp = null;
        }

    };

    function drawElement(element, canvasId, id) {
        $(canvasId).append(element);
        //console.log(properties[0].startpoints);
        _addEndpoints(properties[0].startpoints, properties[0].endpoints, id);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });   
    }

    var clickedObject;
    var idEle;
    document.onclick = function(e) {
        var clssName = e.path[2].className.split(' ').slice(1, 2);
        if(clssName == "start" || clssName == "step" || clssName == "diamond") {
            
            //console.log(e.path[2]);
            //if(e.path[2].className == entityClsName || e.path[2].className == activityClsName || e.path[2].className == agentClsName ) {
            var x = document.getElementById("s");
            var objectIdentifier = e.path[2].id;
            idEle = e.path[2].id;
            
            if (x.style.display == "none") {
                x.style.display = "inline-block";
                //console.log("On click " + objectIdentifier);
                clickedObject = e;
                //inspectorAttr(objectIdentifier);
                var placeholder = document.getElementById("objectName");
                placeholder.placeholder = objectIdentifier;
            } else {
                x.style.display = "none";
            }

            var IDs = document.querySelectorAll("#AttrContainer div");
            var Is = document.querySelectorAll(e.path[2].id+" label");
            //console.log(Is);
            for (var i = 0; i<IDs.length; i++) {
                if(IDs[i].id != (objectIdentifier+"Inspector")) {
                    IDs[i].style.display = "none";
                }
                else {
                    IDs[i].style.display = "inline-block";
                }
            }
            //var getAttrId = "#"+e.path[2].id+"D";
            var attrs = document.getElementById(objectIdentifier+"Attr");
            if(attrs) {
                attrs.style.display = "inline-block";
            }

        }
    }
    //are = idEle; 
    var count = false;
    document.getElementById("attrBtn").addEventListener("click",  function() {
        if(!count) {
            inspectorAttr(idEle);
            count = true;
        }
    });   
    //var inputValue;
    function inspectorAttr(a) {
        var cont = document.getElementById(a+"Inspector");
        var div = document.getElementById("AttrContainer");
        var selectionAttr = document.getElementById("attr");
        var optionText = selectionAttr.options[selectionAttr.selectedIndex].text;
        
        //console.log(selectionAttr.options[selectionAttr.selectedIndex].value);
       
        var form = document.createElement('form');
        var input = document.createElement("input");
        var label = document.createElement("label");
        var button = document.createElement("button");
        var br = document.createElement("br");

        if(selectionAttr.options[selectionAttr.selectedIndex].value == 4) {
            var attr = myFunction("Enter Attr", "Attr");
            label.innerHTML = attr;
        }
        else {
            label.innerHTML = optionText;
        }
        input.id = a+"Input";
        button.id = a+"Button";
        label.id = a+"Label";
        //label.innerHTML = optionText;
        //input.id = a+"Inspector";
        input.type = 'text';
        input.name = 'name';
       
        //inputValue = input;
        button.innerHTML = "S";
        button.type = 'button';

        //form.appendChild(divAttr);
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(button);
        form.appendChild(br);

        if(cont) {
            cont.appendChild(form);
            div.appendChild(cont);
        }
        else {
            input.id = a+"Input";
            button.id = a+"Button";
            var localDiv = document.createElement("div");
            localDiv.id = a+"Inspector";
            localDiv.appendChild(form);
            div.appendChild(localDiv);
        }

        var divAttr = document.getElementById(a+"Attr");
        var br = document.createElement("br");
        var b = document.createElement("button");
        var attrlabel = document.createElement("label");
        
        if(divAttr) {
            //console.log(divAttr);
            form.appendChild(divAttr);
        }
        else {
            var divAttr = document.createElement('div');
            divAttr.id = a+"Attr";
        }

        document.getElementById(a+"Button").addEventListener("click", function() {
            count = false;
            var inputValue = document.getElementById(a+"Input").value;
            var val = document.getElementById(a);
            //console.log(val.attributes[2]);
            val.attributes[2].nodeValue =  val.attributes[2].nodeValue + label.innerHTML+ ": " + inputValue + ",";
            var res = val.attributes[2].nodeValue.split(",");
            var i;
            res.pop();
            
            for (i = 0; i < res.length; i++) {
                //var attrlabel = document.createElement("label");
                b.innerHTML = "+";
                b.type = 'button';

                attrlabel.innerHTML = res[i];
                divAttr.appendChild(attrlabel);
                divAttr.appendChild(b);
                divAttr.appendChild(br);
            }
            console.log(val.attributes[2]);
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
});

var saveFunction;
