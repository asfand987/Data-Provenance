/**
 * 
 * This file shows all methods responsible for saving the converted file locally.
 * 
 */

/********************************************************************************************
 * Code for this page was cited from stack overflow
 * 
 * Title: Saving HTML5 textarea contents to file
 * Author: @engincancan
 * Date: March 2020
 * Type: code
 * Availability: https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file
 
 ******************************************************************************************* */

const button = document.getElementById('saveButton');
button.addEventListener('click', saveTextAsFile);

function saveTextAsFile() {
  const textToWrite = document.getElementById('displayConvertedFile').value;
  const textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' });
  const fileNameToSaveAs = "convertedFile.txt"; //filename.extension
  
  const downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";

  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}

