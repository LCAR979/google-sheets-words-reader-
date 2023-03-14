// ==UserScript==
// @name         GoogleSheetsWordsReader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read words on the screen to help learn the language.

// @author       You
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

//GM_setValue('googleSheetsAPIKey', '');

const apiKey = GM_getValue('googleSheetsAPIKey');
const msg = new SpeechSynthesisUtterance();
const defaultRange = `'General'!A:A`;
const isUseDefaultRange = true;

function checkSpeechSynthesis() {
    if ('speechSynthesis' in window) {
        console.log('Web Speech API is available');
    } else {
        alert('Speech Synthesis feature is not supported in your current browser' +
              'Please switch to Google Chrome and try again');
    }
}

function initSpeechSynthesis() {
    const voices = window.speechSynthesis.getVoices();
    msg.voice = voices.find(voice => voice.name === 'Google US English Male');;
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;
}

function getSheetId(){
    const crtUrl = window.location.href;
    const sheetIdMatch = crtUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetIdMatch) {
        const sheetId = sheetIdMatch[1];
        console.log(`Sheet ID: ${sheetId}`);
        return sheetId;
    } else {
        alert('Sheet ID not found in the URL');
    }
}

function getRange(){
    if (isUseDefaultRange) {
        return defaultRange;
    } else {
        alert(`Due to the limitations of google sheets API,
              one can't get the A1Notion of selected cells.
              Hard coded sheetID and range are supported only`);
    }
}

function fetchData(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method : 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`,
            onload: function(response) {
                console.debug(response.responseText);
                const data = JSON.parse(response.responseText);// Extract the values from the response
                const words = data.values.flat();
                console.log(words);
                resolve(words);
            },
            onerror: function(error) {
                console.error(error);
                reject(error);
            }
        });
    });
};

function speakWords(words) {
    let crtIndex = 0;
    function speakWord() {
        msg.text = words[crtIndex];
        console.log(msg.text);
        msg.onend = ()=> {
            crtIndex ++;
            if (crtIndex < words.length) {
                speakWord();
            }
        }
        window.speechSynthesis.speak(msg);
    }
    speakWord();
}

(function() {
    'use strict';
    checkSpeechSynthesis();
    initSpeechSynthesis();
    console.log("Script WordsReader is running...");

    // add the button to the menu bar, directly after 'help' menu item
    var helpButton = document.querySelector('#docs-help-menu');
    var readButton = document.createElement('div');
    readButton.className = 'menu-button goog-control goog-inline-block';
    readButton.textContent = 'Read';
    readButton.addEventListener('click', ()=>{
        const sheetId = getSheetId();
        const range = getRange();
        fetchData(sheetId, range)
            .then((words) => {
            speakWords(words);
        })
            .catch((error) => {
            console.error(error);
        });
    });
    helpButton.insertAdjacentElement('afterend', readButton);
})();

