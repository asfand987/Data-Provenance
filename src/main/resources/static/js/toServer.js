document.getElementById("flowchartSaveBtn").addEventListener("click", createJSON);

function createJSON(){
    let textbox = document.getElementById('displayConvertedFile');
    textbox.value = "";
    addElementToArray();
    sendJsonToServer();
    
}

function sendJsonToServer() {
    var JSON_Array = [];
    JSON_Array = JSON_Array.concat(namespaceArray, enitityArray, activityArray, agentArray);

    
    var JSONstring = JSON.stringify(JSON_Array);
    console.log(JSONstring);        

    $.ajax({
        url: 'http://localhost:8080/',
        type: 'POST',
        data: JSONstring,
       // dataType: 'text',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            let textbox = document.getElementById('displayConvertedFile');
            textbox.value = data;
            //console.log(d);
        },
        error: function() {
            console.log("error");
        }, 
    });

}

function addElementToArray() {
   elementsOnCanvas.forEach(function (e) {
       let className = e[0].className;
       let id = e[0].id;
       let attributeValues = e[0].attributes[2].nodeValue.split(",");

       let entity =  "window start custom jtk-node jsplumb-connected jsplumb-endpoint-anchor jsplumb-draggable";
       let activity = "window step custom jtk-node jsplumb-connected-step jsplumb-endpoint-anchor jsplumb-draggable";
       let agent = "window diamond custom jtk-node jsplumb-connected-end jsplumb-endpoint-anchor jsplumb-draggable";

       attributeValues.pop();

       if(className == entity) {
            addAttributesToElementinArray(id, attributeValues, "entity");
       }
       else if(className == activity) {
            addAttributesToElementinArray(id, attributeValues, "activity");
       }
       else if(className == agent) {
            addAttributesToElementinArray(id, attributeValues, "agent");
       }
   });
    
}

function addAttributesToElementinArray(id, elementAttributeValues, type) {
    var attribute = {attrs:{}};
    for(let i = 0; i < elementAttributeValues.length; i++) {
        let allAttributes = elementAttributeValues[i].split(" ");
        let prefix = allAttributes[0].slice(0, -1); 
        let value = allAttributes[1];
        attribute.attrs[prefix] = value;
    }
    if(type == "entity") {
        enitityArray.entity[id] = attribute.attrs;
    }
    else if(type == "activity") {
        activityArray.activity[id] = attribute.attrs;
    }
    else if(type == "agent") {
        agentArray.agent[id] = attribute.attrs;
    }
}