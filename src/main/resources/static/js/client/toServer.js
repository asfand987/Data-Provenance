/**
 * This file is responsible for sending and receiving data from the server side.
 */

/**
 * Button responsible for exporting in the user interface.
 */
document.getElementById("exportBtn").addEventListener("click", parseDataIntoProvJSON);


/**
 * parses all data on the canvas into PROV-JSON format.
 * @returns 
 */
function parseDataIntoProvJSON(){
    let alert = confirm("Convert to syntax form?");
    if(!alert) return;

    //All these files are in the outputController class
    clearObjects();
    addConnectionsToObject();
    addElementsToObject();
    sendJsonToServer(); 
    scrollToOutput();  
}

/**
 * Sends data to server as a string.
 * Receives data as a string.
 */
function sendJsonToServer() {
    const JSON_Object = combineAllObjects();
    const JSONObjectString = JSON.stringify(JSON_Object);

    $.ajax({
        url: 'http://localhost:8080/',
        type: 'POST',
        data: JSONObjectString,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            // this function is in the controller class.
            displayOutput(data);
        },
        error: function(){
        }
    });

}

function combineAllObjects() {
    const conversionFormatOption =  document.getElementById("conversionFormat");
    const conversionFormat = conversionFormatOption.options[conversionFormatOption.selectedIndex].value;

    let JSON_Object = [];
    const conversionType = [conversionFormat]
    
    JSON_Object = JSON_Object.concat(
        namespaceArray, 
        entityObject,
        activityObject, 
        agentObject, 
        wasDerivedFromObject, 
        wasAttributedToObject,  
        wasGeneratedByObject, 
        wasAssociatedWithObject, 
        usedObject, wasInformedByObject, 
        actedOnBehalfOfObject, 
        conversionType
        );
    
    return JSON_Object;
}



