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


    var windows = jsPlumb.getSelector(".canvas-wide .window start jsplumb-connected");
    jsPlumbInstance.bind("connection", function (info) {
        //info.connection.getOverlay("label").setLabel("t");
        
        var source=info.sourceId.replace(/[0-9]/g, '');
        var target=info.targetId.replace(/[0-9]/g, '');
        //document.getElementById(ci);
        //console.log(s+" -> "+t);
        //console.log(properties[0]);
        if (source == "e" && source == target) {
            info.connection.getOverlay("label").setLabel("wasDerivedFrom");
        }
        else if(source == "e" && target == "ex") {
            info.connection.getOverlay("label").setLabel("wasAttributedTo");
        }
        else if(source == "e" && target == "a") {
            info.connection.getOverlay("label").setLabel("wasGeneratedBy");
        }
        else if(source == "a" && target == "ex") {
            info.connection.getOverlay("label").setLabel("wasAssociatedWith");
        }
        else if(source == "a" && target == "e") {
            info.connection.getOverlay("label").setLabel("used");
        }
        else if(source == "a" && target == source) {
            info.connection.getOverlay("label").setLabel("wasInformedBy");
        }
        else if(source == "ex" && target == source) {
            info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
        }
        else if(source == "ex" && target == "a") {
            info.connection.getOverlay("label").setLabel("");
        }
        else if(source == "ex" && target == "e") {
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
            if (clicked) {
    	        clicked = false;
                elementCount++;
               
                //var name = "Window" + elementCount;
                //console.log(properties[0]);
                //var name; // add this
                var name;
                var id;


                if(properties[0].label == "entity") {
                    name =  entityCount;
                    id = "e" + entityCount++;
                }
                else if(properties[0].label == "activity") {
                    name = activityCount;
                    id = "a" + activityCount++;
                }
                else if(properties[0].label == "agents") {
                    var name = agentCount;
                    id = "ex" + agentCount++;
                }
                else {
                    alert("Hello! I am an alert box!!");
                }
                //console.log(id);
                
                //elementId(id);
                element = createElement(id);
                //properties[0].elementId = id;
                //console.log(properties[0].elementId);
    	        drawElement(element, "#canvas", name);
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
    function loadProperties(clsName, left, top, label, startpoints, endpoints, contenteditable, id) {
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
        var attr = ["testing!"];
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id).attr('attribute', attr);

        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });
        //console.log(properties[0].clsName );
        var strong = $('<strong>');

        elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
        var p = $('<p>').text(properties[0].label);
        strong.append(p);
        elm.append(strong);
       

        return elm;
    }

     //add the endpoints for the elements
    var epp;
    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        var id;
        if(properties[0].label == "entity") {
            id = "e";
        }
        else if(properties[0].label == "activity") {
            id = "a";
        }
        else if(properties[0].label == "agents") {
            id = "ex";
        }
        //onsole.log("toID is: " + toId);
        //console.log("id is: " + id);
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            //console.log("sourceAnchors is: " + sourceAnchors[i]); 
            //console.log("sourceUUID is: " + sourceUUID);
            //console.log("sourceEP " + sourceEndpoint);
            epp = jsPlumbInstance.addEndpoint(id + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            
            sourcepointList.push([id + toId, epp]);
            epp.canvas.setAttribute("title", "Drag a connection from here");
            epp = null;
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            epp = jsPlumbInstance.addEndpoint(id + toId, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID
            });
            endpointList.push([id + toId, epp]);
            epp.canvas.setAttribute("title", "Drop a connection here");
            epp = null;
        }
    };


    function drawElement(element, canvasId, name) {
        
        $(canvasId).append(element);
        _addEndpoints(name, properties[0].startpoints, properties[0].endpoints);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });
        
    }

    // Inspector 
    var entityClsName = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
    var activityClsName = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable";
    var agentClsName = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable";
    
    var clickedObject;
    document.onclick = function(e) {
        //console.log(e.path[2].className);
        
        
        if(e.path[2].className == entityClsName || e.path[2].className == activityClsName || e.path[2].className == agentClsName ) {
            var x = document.getElementById("s");
            if (x.style.display == "none") {
                x.style.display = "inline-block";
                //console.log(e);
                ee = e;
                var placeholder = document.getElementById("objectName");
                placeholder.placeholder = e.path[2].id; 
                //e.path[2].attributes[2].inputValue.push("w");
                //console.log(e.path[2].attributes[2].value);
                //e.path[2].id = 7;
            } else {
                x.style.display = "none";
            }
        }
        
    }

   
    
});


/*function add() {
    var val = parseInt($('#vvar-input').val())+1;
    var input="<input type='text' placeholder='Add var...' id='new_"+val+"'><button onclick='values()'>confirm</button><br/><div data-value=1 id=new_input2></div><input type='hidden' value=1 id=vars><br/>";
    $('#new_input').append(input);
    $('#vvar-input').val(val);
}

function values() {
    var val = parseInt($('#vars').val())+1;
    var val2 = document.getElementById('new_input2').getAttribute('data-value');

    console.log(val2);
    var input="<input type='text' placeholder='Add values...' id='new_"+val+"'>";
    
    $('#new_input2').append(input);
    $('#vars').val(val);
}*/


var inputValue;
function provLabel() {
    var selectionAttr = document.getElementById("attr");
    //console.log(selectionAttr.options[selectionAttr.selectedIndex].text);

    var optionText = selectionAttr.options[selectionAttr.selectedIndex].text
    var form = document.getElementById('form');
    var input = document.createElement("input");
    var label = document.createElement("label");
    var button = document.createElement("button");

    label.innerHTML = optionText;
    
    input.id = 'input-';
    input.type = 'text';
    input.name = 'name';
    input.placeholder = 'Enter ' + optionText + "... attribute";
    inputValue = input;

    form.appendChild(label);
    form.appendChild(input);
}

var ee;
function saveOutput() {
    //console.log(inputValue.value);
    //ee.path[2].attribute.push(inputValue);
    //console.log(ee);
    console.log(ee.path[2]);
}

function inspector() {

}




  