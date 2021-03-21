var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, elementCount = 0;
var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
var elementsOnCanvas = [];
var namespaceArray = {prefix:{default : 'http://kcl.ac.uk/1'}};
var connections = [];
var lastClickElement;

jsPlumb.ready(function () {
    let element = "";   //the element which will be appended to the canvas

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

        // let connectionID = alertBox("Enter ID: ", "id");
        // //jsPlumbInstance.setId(info.connection.id, connectionID);
        // info.connection.id = connectionID;

        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        }); 

        if (source == entity && source == target) {
            info.connection.getOverlay("label").setLabel("wasDerivedFrom");
            //connections.push("wasDerivedFrom(" + sourceID + ", " + targetID + ")");
        }
        else if(source == entity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAttributedTo");
            //connections.push("wasAttributedTo(" + sourceID + ", " + targetID + ")");
        }
        else if(source == entity && target == activity) {
            info.connection.getOverlay("label").setLabel("wasGeneratedBy");
            //connections.push("wasGeneratedBy(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == agent) {
            info.connection.getOverlay("label").setLabel("wasAssociatedWith");
            //connections.push("wasAssociatedWith(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == entity) {
            info.connection.getOverlay("label").setLabel("used");
            //connections.push("used(" + sourceID + ", " + targetID + ")");
        }
        else if(source == activity && target == source) {
            info.connection.getOverlay("label").setLabel("wasInformedBy");
            //connections.push("wasInformedBy(" + sourceID + ", " + targetID + ")");
        }
        else if(source == agent && target == source) {
            info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
            //connections.push("actedOnBehalfOf(" + sourceID + ", " + targetID + ")");
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
                //console.log($(this).remove());
        if(!answer) return;
        
        for (let i = 0; i < elementsOnCanvas.length; i++) {
            if(elementsOnCanvas[i][0] == $(this)[0]) {
                elementsOnCanvas.splice(i, 1);
            }
        }
        jsPlumbInstance.remove($(this));
        
       
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
                id =  alertBox("Please enter your ID:", "ID");
                id = "prov:" + id;
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

});




