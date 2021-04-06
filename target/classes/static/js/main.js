/**
 *  I verify that I am the sole author of all the files in this program, unless it states otherwise.
 *
 *  Asfand Khan
 *  April 2021
 */

/**
 *  This is the main file for the client side. 
 * 
*/

var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
var elementsOnCanvas = [];
var properties;
var clickedElement = false;

jsPlumb.ready(function () {
    let element = "";   //the element which will be appended to the canvas

    jsPlumbInstance = window.jsp = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        ConnectionOverlays: [ ["Arrow", { location: 1, visible: true, id: "ARROW", length: 14, foldback: 0.8 }], [ "Label", { label: "", id: "label", cssClass: "aLabel" }]],
        Container: "canvas"
    });

    /**
     * Add labels to connections.
     */
    jsPlumbInstance.bind('connection', function (info) {
        const entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        const activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];
        const agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected".split(' ').slice(1, 2)[0];; 

        const source = info.source.className.split(' ').slice(1, 2)[0];
        const target = info.target.className.split(' ').slice(1, 2)[0];
       
        info.targetId = info.target.id;
        info.connection.targetId = info.target.id;

        makeInstanceDraggable();

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
        const answer = window.confirm("Are you sure you want to delete this connection?");
        if(answer) jsPlumbInstance.detach(connection);
    });

    /**
     * Delete element from canvas on double click.
     */
    $(document).on('dblclick','.window',function(){
        const answer = window.confirm("Are you sure you want to delete this connection?");
        if(!answer) return;
        for (let i = 0; i < elementsOnCanvas.length; i++) {
            if(elementsOnCanvas[i][0] == $(this)[0])  elementsOnCanvas.splice(i, 1);
        }
        jsPlumbInstance.remove($(this));
    });
  
    /**
     * Register connections 
     */
    jsPlumbInstance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
   
   

	makeElementDraggable("#entityID", "window start jsplumb-connected custom", "entity");
	makeElementDraggable("#activityID", "window step jsplumb-connected-step custom", "activity");
    $("#agentID").draggable({ helper: function () { return createElement("agent"); }, stack: ".custom", revert: false});

    /**
     * Allow the canvas to accept elements.
     */
    $("#canvas").droppable({
        drop: function () {
            if (clickedElement) {
                let id;
                id =  prompt("Please enter a ID, prov:", );
                //if no id is entered, do not create new element. 
                if(id)   id = "prov:" + id;
                else return;
                element = createElement(id);
                putElementOnCanvas(element, "#canvas", id);
                clickedElement = false;
	        }
        }   
    });

    /**
     * Take the x and y co-ordinates of the element when it's placed on canvas, and adjust them accordingly.
     */
    var x, y;
    $(document).on("mousemove", function (event) {
        x = event.pageX;
        y = event.pageY;
        if (clickedElement) {
            properties[0].top = y - 200;
            properties[0].left = x - 260;
        }
    });

    /**
     * Define properties for elements.
     */
    function addProperties(clsName, left, top, label, sourceEndpoint, targetEndpoint) {
        properties = [];
        properties.push({left: left, top: top, clsName: clsName, label: label, sourceEP: sourceEndpoint, targetEP: targetEndpoint});
    }

	//add properties of a entity once it is clicked inside the palette.
    $('#entityID').mousedown(function () { addProperties("window start custom jtk-node jsplumb-connected", "5em", "5em", "entity", ["Left", "Right"], ["Top", "Bottom"]);
    clickedElement = true;
    });

    //add properties of a activity once it is clicked inside the palette
    $('#activityID').mousedown(function () {
        addProperties("window step custom jtk-node jsplumb-connected-step", "5em", "5em", "activity", ["Left", "Right"], ["Top", "Bottom"]);
        clickedElement = true;
    });

    //add properties of a agent once it is clicked inside the palette
    $('#agentID').mousedown(function () {
        addProperties("window diamond custom jtk-node jsplumb-connected-end", "5em", "5em", "agents", ["Bottom"], ["Left", "Right", "Top"]);
        clickedElement = true;
    });     
   
   

    
});


