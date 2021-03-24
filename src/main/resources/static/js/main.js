var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
var elementsOnCanvas = [];
var connections = [];

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

    /**
     * Add connection labels to connections.
     */
    jsPlumbInstance.bind('connection', function (info) {
        let entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        let activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];
        let agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];; 

        let source = info.source.className.split(' ').slice(1, 2)[0];
        let target = info.target.className.split(' ').slice(1, 2)[0];
       
        info.targetId = info.target.id;
        info.connection.targetId = info.target.id;

        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        }); 

        if (source == entity && source == target) info.connection.getOverlay("label").setLabel("wasDerivedFrom");
        else if(source == entity && target == agent) info.connection.getOverlay("label").setLabel("wasAttributedTo");
        else if(source == entity && target == activity) info.connection.getOverlay("label").setLabel("wasGeneratedBy");
        else if(source == activity && target == agent) info.connection.getOverlay("label").setLabel("wasAssociatedWith");
        else if(source == activity && target == entity) info.connection.getOverlay("label").setLabel("used");
        else if(source == activity && target == source) info.connection.getOverlay("label").setLabel("wasInformedBy");
        else if(source == agent && target == source) info.connection.getOverlay("label").setLabel("actedOnBehalfOf");
        else if(source == agent && target == activity) info.connection.getOverlay("label").setLabel("");
        else if(source == agent && target == entity) info.connection.getOverlay("label").setLabel("");
    });
 
    /**
     * Delete connection on click.
     */
    jsPlumbInstance.bind('click', function (connection) {
        let answer = window.confirm("Are you sure you want to delete this connection?");
        if(answer) jsPlumbInstance.detach(connection);
    });

    /**
     * Delete element from canvas on double click.
     */
    $(document).on('dblclick','.window',function(){
        let answer = window.confirm("Are you sure you want to delete this connection?");
        if(!answer) return;
        for (let i = 0; i < elementsOnCanvas.length; i++) {
            if(elementsOnCanvas[i][0] == $(this)[0])  elementsOnCanvas.splice(i, 1);
        }
        jsPlumbInstance.remove($(this));
    });
  
    /**
     * Define and register connections 
     */
    jsPlumbInstance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
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

    sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
           /* strokeStyle: "#bbbb77",  7AB02C*/
            fillStyle: "transparent",
            radius: 5,
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
        paintStyle: {fillStyle: "#7AB02C", radius: 5},
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
 //   makeDraggable("#agentID", "test", "agents");

    entityCount = 1;
    agentCount = 1;
    activityCount = 1;
    tt = 0;
    
    /**
     * Allow the canvas to accept elements.
     */
    $("#canvas").droppable({
        //accept: ".window",
        drop: function () {
            if (clicked) {
    	        clicked = false;
                let id;
                id =  alertBox("Please enter your ID:", "ID");
                id = "prov:" + id;
                element = createElement(id);
                drawElement(element, "#canvas", id);
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
        ["Bottom"],
        ["Left", "Right", "Top"], true, 100, 100);
        clicked = true;
    });

    // $('#agentID').mousedown(function () {
    //     loadProperties("test", "5em", "5em", "agents",
    //     ["Bottom"],
    //     ["Left", "Right", "Top"], true, 100, 100);
    //     clicked = true;
    // });

   
    /**
     * create an element to be drawn on the canvas
     * @param {*} id 
     * @returns element
     */
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
        let p = $('<p>').text(id.substring(0, 12));
        p.id = "p";
        strong.append(p);
        elm.append(strong);

        return elm;
    }

    /**
     * Add endpoints to elements on canvas.
     */
    var _addEndpoints = function (sourceAnchors, targetAnchors, id, type) {
        endpointColours(type);
        
        for (let i = 0; i < sourceAnchors.length; i++) {
            let sourceUUID = sourceAnchors[i];
            epp = jsPlumbInstance.addEndpoint(id, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            epp = null;
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            let targetUUID = targetAnchors[j];
            epp = jsPlumbInstance.addEndpoint(id, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID
            });
            epp = null;
        }
    };
    
    /**
     * This function adds colours to the endpoints depending on what type of
     * element it is placed upon.
     * @param {element} type 
     */
    function endpointColours(type) {
        if(type == "entity") {
            sourceEndpoint.paintStyle.strokeStyle = "#999966";
            targetEndpoint.paintStyle.fillStyle = "#55552b";
        }
        else if(type == "activity") {
            sourceEndpoint.paintStyle.strokeStyle = "#8080ff";
            targetEndpoint.paintStyle.fillStyle = "#1a1aff";
        }
        else {
            sourceEndpoint.paintStyle.strokeStyle = "#999966";
            targetEndpoint.paintStyle.fillStyle = "#55552b";
        }
    }

    /**
     * Draw element on canvas.
     */
    function drawElement(element, canvasId, id) {
        $(canvasId).append(element);
        let type;
        if(element[0].classList[1] == "start") type = "entity"
        else if(element[0].classList[1] == "step") type = "activity";
        else type = "agent";
        _addEndpoints(properties[0].startpoints, properties[0].endpoints, id, type);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });   
        elementsOnCanvas.push(element);
    }

});




