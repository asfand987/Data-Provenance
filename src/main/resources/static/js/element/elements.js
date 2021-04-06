 /**
     * create an element to be drawn on the canvas
     * @param {*} id 
     * @returns element 
    */
  function createElement(id) {
    let arr = [];
    let element = $('<div>').addClass(properties[0].clsName).attr('id', id).attr('variables', arr);
    let strong = $('<strong>');
    element.css({'top': properties[0].top, 'left': properties[0].left});
    element.append("<i style='display: none';><\/i>");

    const agent = "window diamond custom jtk-node jsplumb-connected-end";
    const className  = properties[0].clsName;

    if (className == agent) {
        let p = "<p style='line-height: 110%; margin-top: 35%' class='agentLabel'" + "ondblclick='$(this).focus();'>" + id + "</p>";
        strong.append(p);
    }
    else {
        let p = $('<p>').text(id);
        p.id = "p";
        strong.append(p);
    }
    element.append(strong);
    return element;
}


/**
 * Add endpoints to elements on canvas.
 * 
 * 
 * This function was citied from the jsPlumb community edition page
 * 
 * Title: Flowchart Demo
 * Author: jsPlumb
 * Date: Dec 2020
 * Type: code
 * Availability: https://github.com/jsplumb/jsplumb/blob/master/demo/flowchart/demo.js
 * 
 */
var addEndpointsToElements = function (sourceAnchors, targetAnchors, id) {
    for (let i = 0; i < sourceAnchors.length; i++) {
        let uuid = sourceAnchors[i];
        jsPlumbInstance.addEndpoint(id, sourceEndpoint, {
            anchor: sourceAnchors[i], uuid: uuid
        });
    }
    for (let j = 0; j < targetAnchors.length; j++) {
        let uuid = targetAnchors[j];
        jsPlumbInstance.addEndpoint(id, targetEndpoint, {
            anchor: targetAnchors[j], uuid: uuid
        });
    }
};
    

/**
 * Draw element on canvas.
 */
    function putElementOnCanvas(element, canvasId, id) {
    $(canvasId).append(element);
    let type;
    if(element[0].classList[1] == "start") {
        type = "entity"
    }
    else if(element[0].classList[1] == "step") {
        type = "activity";
    }
    else {
        type = "agent";
    }

    addEndpointsToElements(properties[0].sourceEP, properties[0].targetEP, id, type);
    makeInstanceDraggable();
    elementsOnCanvas.push(element);
}

function makeInstanceDraggable() {
    jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), { grid: [20, 20] });
}

/**
 * Makes elements draggable
 * @param {*} id 
 * @param {*} className 
 * @param {*} text 
 */
function makeElementDraggable(id, className, text){
    $(id).draggable({
    helper: function(){ return $("<div/>",{ text: text, class:className, }); }, stack: ".custom", revert: false });
}
/**
 * Confirm page reload
 */
window.onbeforeunload = function(e) {
    return 'Are you sure you want to leave? You are in the middle of something.';
};
