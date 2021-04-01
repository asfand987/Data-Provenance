var wasDerivedFromArr = {wasDerivedFrom:{}};
var wasAttributedToArr = {wasAttributedTo:{}};
var wasGeneratedByArr = {wasGeneratedBy:{}};
var wasAssociatedWithArr = {wasAssociatedWith:{}};
var usedArr = {used:{}};
var wasInformedByArr = {wasInformedBy:{}};
var actedOnBehalfOfArr = {actedOnBehalfOf:{}};
var connectionArray = [];


//-------------------------------------
var entityArray = {entity:{}};
var activityArray = {activity:{}};
var agentArray = {agent:{}};

function addElementToArray() {
    elementsOnCanvas.forEach(function (e) {
        let className = e[0].className.split(' ').slice(1, 2)[0];
        let id = e[0].id;
        let attributeValues = e[0].attributes[2].nodeValue.split(",");
 
        let entity =  "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        let activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
        let agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable".split(' ').slice(1, 2)[0];
 
        //attributeValues.pop();
 
         if(className == entity) {
             addToArray(id, attributeValues, "entity");
         }
         else if(className == activity) {
             addToArray(id, attributeValues, "activity");
         }
         else if(className == agent) {
             addToArray(id, attributeValues, "agent");
         }
    });
     
 }
 
 function addToArray(id, elementAttributeValues, type) {
     var attribute = {attrs:{}};
     for(let i = 0; i < elementAttributeValues.length; i++) {
         let allAttributes = elementAttributeValues[i].split(" ");
         let prefix = allAttributes[0].slice(0, -1); 
         let value = allAttributes[1];
         attribute.attrs[prefix] = value;
     }
     console.log(type);
     if(type == "entity") {
         entityArray.entity[id] = attribute.attrs;
     }
     if(type == "activity") {
         activityArray.activity[id] = attribute.attrs;
     }
     else if(type == "agent") {
         agentArray.agent[id] = attribute.attrs;
     }
 }
 
 
 var entity = "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
 var activity  = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected";
 var agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable jsplumb-connected";
 
 var WG = 1;
 var WAT = 1;
 var WBG = 1;
 var WAW = 1;
 var U = 1;
 var INFM = 1;
 var AO = 1;
 
 function combineConnectionArrays() {
     addConnectionsToArray();
     connectionArray = connectionArray.concat(wasDerivedFromArr, wasAttributedToArr, wasGeneratedByArr, wasAssociatedWithArr, usedArr, wasInformedByArr, actedOnBehalfOfArr);
 }
 
 function addConnectionsToArray() {
     $.each(jsPlumbInstance.getAllConnections(), function (idx, connection) {
         console.log(connection);
         let source = connection.source.className;
         let target = connection.target.className;
 
         let sourceID = connection.source.id;
         let targetID = connection.target.id;
 
 
         if (source == entity && source == target) {
             let values = addConnectionData("prov:generatedEntity","prov:usedEntity", sourceID, targetID);
             wasDerivedFromArr.wasDerivedFrom["_:WG" + WG++] = values;       
         }
         else if(source == entity && target == agent) {
             let values = addConnectionData("prov:agent", "prov:entity", targetID ,sourceID);
             wasAttributedToArr.wasAttributedTo["_:wAT" + WAT++] = values;
         }
         else if(source == entity && target == activity) {
             let values = addConnectionData("prov:entity", "prov:activity", sourceID, targetID);
             wasGeneratedByArr.wasGeneratedBy["_:wBG" + WBG++] = values;
         }
         else if(source == activity && target == agent) {
             let values = addConnectionData("prov:activity", "prov:agent", sourceID, targetID);
             wasAssociatedWithArr.wasAssociatedWith["_:wAW" + WAW++] = values;
         }
         else if(source == activity && target == entity) {
             let values = addConnectionData("prov:entity", "prov:activity", targetID, sourceID);
             usedArr.used["_:u" + U++] = values;
         }
         else if(source == activity && target == source) {
             let values = addConnectionData("prov:informant", "prov:informed", sourceID, targetID);
             wasInformedByArr.wasInformedBy["_:Infm" + INFM++] = values;
         }
         else if(source == agent && target == source) {
             let values = addConnectionData("prov:delegate", "prov:responsible", sourceID, targetID);
             actedOnBehalfOfArr.actedOnBehalfOf["_:aO" + AO++] = values;
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

 
 function clearArrays(){
    let textbox = document.getElementById('displayConvertedFile');
    textbox.value = "";
    entityArray = {entity:{}};
    activityArray = {activity:{}};
    agentArray = {agent:{}};
    wasDerivedFromArr = {wasDerivedFrom:{}};
    wasAttributedToArr = {wasAttributedTo:{}};
    wasGeneratedByArr = {wasGeneratedBy:{}};
    wasAssociatedWithArr = {wasAssociatedWith:{}};
    usedArr = {used:{}};
    wasInformedByArr = {wasInformedBy:{}};
    actedOnBehalfOfArr = {actedOnBehalfOf:{}};
};