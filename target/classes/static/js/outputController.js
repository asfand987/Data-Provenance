/**
 * Every element on canvas is added to it's respective object as defined
 * below.
 * 
 */
var entityObject = {entity:{}};
var activityObject = {activity:{}};
var agentObject = {agent:{}};

function addElementsToObject() {
    elementsOnCanvas.forEach(function (e) {
        const className = e[0].className.split(' ').slice(1, 2)[0];
        const id = e[0].id;
        const attributeValues = e[0].attributes[2].nodeValue.split(",");
 
        const entity =  "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        const activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        const agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
 
        //attributeValues.pop();
 
        if(className == entity) {
            addToObject(id, attributeValues, "entity");
        }
        else if(className == activity) {
            addToObject(id, attributeValues, "activity");
        }
        else if(className == agent) {
            addToObject(id, attributeValues, "agent");
        }
    });
     
 }
 
function addToObject(id, elementAttributeValues, type) {
    var attribute = {attrs:{}};
    for(let i = 0; i < elementAttributeValues.length; i++) {
        let allAttributes = elementAttributeValues[i].split(" ");
        let prefix = allAttributes[0].slice(0, -1); 
        let value = allAttributes[1];
        attribute.attrs[prefix] = value;
    }
    console.log(type);
    if(type == "entity") {
        entityObject.entity[id] = attribute.attrs;
    }
    if(type == "activity") {
        activityObject.activity[id] = attribute.attrs;
    }
    else if(type == "agent") {
        agentObject.agent[id] = attribute.attrs;
    }
}
//----------------------------------------------------------------------------------------------------------//
 
/**
 * This section adds all connection information currently on the canvas,
 * and adds them to their respective objects as defined below.
 * 
*/

//connection objects
var wasDerivedFromObject = {wasDerivedFrom:{}};
var wasAttributedToObject = {wasAttributedTo:{}};
var wasGeneratedByObject = {wasGeneratedBy:{}};
var wasAssociatedWithObject = {wasAssociatedWith:{}};
var usedObject = {used:{}};
var wasInformedByObject = {wasInformedBy:{}};
var actedOnBehalfOfObject = {actedOnBehalfOf:{}};


//elements
var entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
var activity  = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected";
var agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected";

//ID's for each connection
var WG = 1;                         //wasDerivedFrom
var WAT = 1;                        //wasAttributedTo
var WBG = 1;                        //wasGeneratedBy
var WAW = 1;                        //wasAssociatedWith
var U = 1;                          //used
var INFM = 1;                       //wasInformedBy
var AO = 1;                         //actedOnBehalfOf
 

/**
 * Combine all connection objects into a single object.
 */
var connectionsObject = [];     //combined object
function combineConnectionObjects() {
    addConnectionsToObject();
    connectionsObject = connectionsObject.concat(wasDerivedFromObject, wasAttributedToObject, wasGeneratedByObject, wasAssociatedWithObject, usedObject, wasInformedByObject, actedOnBehalfOfObject);
}
 
function addConnectionsToObject() {
    $.each(jsPlumbInstance.getAllConnections(), function (idx, connection) {
        console.log(connection);
        let source = connection.source.className;
        let target = connection.target.className;

        let sourceID = connection.source.id;
        let targetID = connection.target.id;


        if (source == entity && source == target) {
            let values = addConnectionData("prov:generatedEntity","prov:usedEntity", sourceID, targetID);
            wasDerivedFromObject.wasDerivedFrom["_:WG" + WG++] = values;       
        }
        else if(source == entity && target == agent) {
            let values = addConnectionData("prov:agent", "prov:entity", targetID ,sourceID);
            wasAttributedToObject.wasAttributedTo["_:wAT" + WAT++] = values;
        }
        else if(source == entity && target == activity) {
            let values = addConnectionData("prov:entity", "prov:activity", sourceID, targetID);
            wasGeneratedByObject.wasGeneratedBy["_:wBG" + WBG++] = values;
        }
        else if(source == activity && target == agent) {
            let values = addConnectionData("prov:activity", "prov:agent", sourceID, targetID);
            wasAssociatedWithObject.wasAssociatedWith["_:wAW" + WAW++] = values;
        }
        else if(source == activity && target == entity) {
            let values = addConnectionData("prov:entity", "prov:activity", targetID, sourceID);
            usedObject.used["_:u" + U++] = values;
        }
        else if(source == activity && target == source) {
            let values = addConnectionData("prov:informant", "prov:informed", sourceID, targetID);
            wasInformedByObject.wasInformedBy["_:Infm" + INFM++] = values;
        }
        else if(source == agent && target == source) {
            let values = addConnectionData("prov:delegate", "prov:responsible", sourceID, targetID);
            actedOnBehalfOfObject.actedOnBehalfOf["_:aO" + AO++] = values;
        }
    });
}
 
 function addConnectionData(nameA, nameB, sourceID, targetID) {
     let wg = "attr";
     let values = {[wg] : {}}; 
     values["attr"][nameA] = sourceID;
     values["attr"][nameB] = targetID;
     return values["attr"];
 }

//---------------------------------------------------------------------------------------------------------------

/**
 *  All objects cleared cleared.
 */
function clearObjects(){
    let textbox = document.getElementById('displayConvertedFile');
    textbox.value = "";
    entityObject = {entity:{}};
    activityObject = {activity:{}};
    agentObject = {agent:{}};
    wasDerivedFromObject = {wasDerivedFrom:{}};
    wasAttributedToObject = {wasAttributedTo:{}};
    wasGeneratedByObject = {wasGeneratedBy:{}};
    wasAssociatedWithObject = {wasAssociatedWith:{}};
    usedObject = {used:{}};
    wasInformedByObject = {wasInformedBy:{}};
    actedOnBehalfOfObject = {actedOnBehalfOf:{}};
};

/**
 * On export btn press, scroll to output section.
 */
function scrollToOutput() {
    document.getElementById("saveButton").scrollIntoView();
}

/**
 *  Display converted data in output field. 
 */
function displayOutput(data) {
    let outputTextBox = document.getElementById('displayConvertedFile');
    if(data.substring(0, 3) == "org") {
        outputTextBox.value = " Error - \n " + data;
    }
    else {
        outputTextBox.value =  data;
    }
}