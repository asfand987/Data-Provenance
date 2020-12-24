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
        if (source == "entityWindow" && source == target) {
            info.connection.getOverlay("label").setLabel("wasDerivedFrom");
        }
        else if(source == "entityWindow" && target == "agentWindow") {
            info.connection.getOverlay("label").setLabel("wasAttributedTo");
        }
        else if(source == "entityWindow" && target == "activityWindow") {
            info.connection.getOverlay("label").setLabel("wasGeneratedBy");
        }
        else if(source == "activityWindow" && target == "agentWindow") {
            info.connection.getOverlay("label").setLabel("wasAssociatedWith");
        }
        else if(source == "activityWindow" && target == "entityWindow") {
            info.connection.getOverlay("label").setLabel("used");
        }
        else if(source == "activityWindow" && target == source) {
            info.connection.getOverlay("label").setLabel("wasInformedBy");
        }
        else if(source == "agentWindow" && target == source) {
            info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
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
    makeDraggable("#Penta", "p");
    
    /*$("#agentID").draggable({
        helper: function () {
    	   return createElement("");
        },
        stack: ".custom",
        revert: false
	});*/
   
	//make the editor canvas droppable
    $("#canvas").droppable({
        accept: ".window",
        drop: function (event, ui) {
            if (clicked) {
    	        clicked = false;
    	        elementCount++;
                var name = "Window" + elementCount;
                //console.log(properties[0]);
                var id;
                if(properties[0].label == "entity") {
                    id = "entityWindow" + elementCount;
                }
                else if(properties[0].label == "activity") {
                    id = "activityWindow" + elementCount;
                }
                else if(properties[0].label == "agents") {
                    id = "agentWindow" + elementCount;
                }
                else {
                    alert("Hello! I am an alert box!!");
                }
                //var id = docu
    	        element = createElement(id);
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
        ["Left", "Right"],
        ["Top", "Bottom"], true, 100, 100);
        clicked = true;
    });


    //create an element to be drawn on the canvas
    function createElement(id) {
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id);
        
        /*if (properties[0].clsName.indexOf("diamond") > -1) {
            elm.outerWidth("100px");
            elm.outerHeight("100px");
            //console.log("True");
        }*/
        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });
        console.log(properties[0].clsName );
        var strong = $('<strong>');
        /*if (properties[0].clsName == "window diamond custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none; margin-left: -5px; margin-top: -50px' " +
            "class=\"fa fa-trash fa-lg close-icon desc-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='desc-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        }
        else if (properties[0].clsName == "window parallelogram step custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon input-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='input-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label
                + "</p>";
            strong.append(p);
        }
        else if (properties[0].contenteditable) {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        } else {
            console.log("ewewe");
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = $('<p>').text(properties[0].label);
            strong.append(p);
        }*/
        //console.log("ewewe");
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
            id = "entity";
        }
        else if(properties[0].label == "activity") {
            id = "activity";
        }
        else if(properties[0].label == "agents") {
            id = "agent";
        }
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
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

});