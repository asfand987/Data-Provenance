
document.getElementById("convertBtn").addEventListener("click", createJSON);

function createJSON(){
    let alert = confirm("Convert to syntax form?");
    if(!alert) return;

    clearArrays();
    addConnectionsToArray();
    addElementToArray();
    sendJsonToServer(); 
    scrollToOutput();  
}


function sendJsonToServer() {
    let conversionFormatOption =  document.getElementById("conversionFormat");
    let conversionFormat = conversionFormatOption.options[conversionFormatOption.selectedIndex].value;

    var JSON_Array = [];
    var conversionType = [conversionFormat]
    
    JSON_Array = JSON_Array.concat(
        namespaceArray, 
        entityArray,
        activityArray, 
        agentArray, 
        wasDerivedFromArr, 
        wasAttributedToArr,  
        wasGeneratedByArr, 
        wasAssociatedWithArr, 
        usedArr, wasInformedByArr, 
        actedOnBehalfOfArr, 
        conversionType
        );
    

    var JSONstring = JSON.stringify(JSON_Array);
    //console.log(JSONstring);        

    $.ajax({
        url: 'http://localhost:8080/',
        type: 'POST',
        data: JSONstring,
       // dataType: 'text',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            let textbox = document.getElementById('displayConvertedFile');
            textbox.value = data;
        },
        error: function(data){
           
       }
    });

}

function scrollToOutput() {
    document.getElementById("saveButton").scrollIntoView();
}