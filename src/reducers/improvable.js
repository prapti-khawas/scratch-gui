import { defaultVM } from './vm';

var smellType = 0;
var sprite = 0;
var smellNumber = -1;
var response = null;
const smellNames = ["LongScript","UncommunicativeName","DuplicateCode","DuplicateExpression"];

const checkCode = function () {
    clearBoxes();
    mixpanel.track("Feedback displayed",{
        "sessionID": sessionStorage.getItem("sessionID"),
        "userID": window.scratch_username,
        "projectID": window.projectID
    });

    // var oReq = new XMLHttpRequest();
    //oReq.open("GET", "http://localhost:8080/sb3webservice/sb3analysis?ID=149974792");
    // oReq.onload = function() {
    //     var responseText = oReq.responseText;
    //     Blockly.getMainWorkspace().explainHighlightBox(responseText);
    //     console.log(responseText);
    // };
    // oReq.send();

    smellType = 0;
    sprite = 0;
    smellNumber = -1;

    var xhr = new XMLHttpRequest();
    //var url = "http://0.0.0.0:8080/analyze";
    // var url = "https://engine.q4blocks.org:8080/analyze";
    var url = "https://analyzer.cfapps.io/analyze";
    // var url = "http://0.0.0.0:8080/save-project";
    // document.getElementById("checkcodeButton").style="display:none";
    // document.getElementById("loadingButton").style="display:flex";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const token = sessionStorage.getItem("jwt");
    xhr.setRequestHeader("Authorization", token);
    xhr.onload = function() {
        // document.getElementById("checkcodeButton").style="display:flex";
        // document.getElementById("loadingButton").style="display:none";
        response = JSON.parse(xhr.responseText);
        var workspace = Blockly.getMainWorkspace();
        if(response["error"]=="Unknown block type"){
            mixpanel.track("Error Unknown block type");
            //workspace.explainHighlightBox("Uh oh! \n Looks like you have used a block which our tool does not support. \n Don't worry, we are working on it!",0,1);
            return {
                type: null,
                menu: null
            };
        } else if(response["error"]) {
            mixpanel.track("Error "+response['error']);
            //workspace.explainHighlightBox("Uh oh! \n Looks like we are facing a problem. \n You can report the issue by emailing the below error to quality4blocks@research.cs.vt.edu \n "+response['error'],0,1);
            return {
                type: null,
                menu: null
            };
        }
        var smellPresent = 0;
        smellNames.forEach(function(smellName) {
            var i = 0;
            if(smellName=="UncommunicativeName" && response[smellName].length>0){
                smellPresent = 1;
            }
            for(i=0;i<response[smellName].length;i++){
                if(response[smellName][i].length>0){
                    smellPresent = 1;
                    break;
                }
            }
        });
        if(smellPresent==1){
            mixpanel.track("Smells Present");
            workspace.drawBox(350,400);
            var strEx = '<g id="doneButton" style="pointer-events: auto;cursor: pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="80" y="20"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="145" y="45">Okay</text></g>';
            var str = '<text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="20">Hey there! </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="60">That\'s great work! </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="100">But guess what? This code can be made even </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="120">better. Improving your code can increase its </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="140">popularity and the chances that others will</text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="160">remix your project. </text></g>';
            //workspace.explainHighlightBox("Hey there! \n That's great work! \n But guess what? This code can be made even better. Improving your code can improve the popularity and the chances of your project to be remixed by others. Would you like to find how?",0,1);
            document.getElementById("options").innerHTML=strEx;
            document.getElementById("options2").innerHTML=str;
            document.getElementById("doneButton").onclick = function() {
                clearBoxes();
            };
        } else {
            workspace.drawBox(350,400);
            var strEx = '<g id="doneButton" style="pointer-events: auto;cursor: pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="80" y="20"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="145" y="45">Great!</text></g>';
            var str = '<text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="20">Hey there! </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="60">That\'s great work! </text><text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" x="30" y="100">What a perfect masterpiece!</text></g>';
            //workspace.explainHighlightBox("Hey there! \n That's great work! \n This code is a perfect masterpiece!",0,1);
            document.getElementById("options").innerHTML=strEx;
            document.getElementById("options2").innerHTML=str;
            document.getElementById("doneButton").onclick = function() {
                clearBoxes();
            };
        }
    };
    var data = defaultVM.toJSON();
    xhr.send(data);
    return {
        type: null,
        menu: null
    };

    // nextSmell(1);
    // const f = Blockly.getMainWorkspace().getFlyout();
    // f.setScrollPos(7100);
    // f.drawHighlightBox(["`jEk@4|i[#Fk?(8x)AV.-my variable"]);

};
const clearBoxes = function () {
    // mixpanel.track("Cleared suggestions");
    Blockly.getMainWorkspace().removeHighlightBox();
    Blockly.getMainWorkspace().getFlyout().removeHighlightBox();
    return {
        type: null,
        menu: null
    };
};

const nextSmell = function(num) {
    if(num == 1){
        mixpanel.track("Navigated to next Improvable");
    } else {
        mixpanel.track("Navigated to previous Improvable");
    }
    
    var maxSmellNumber = (smellType == 1)? response[smellNames[smellType]].length : response[smellNames[smellType]][sprite].length;
    if(((smellNumber+num)>=0) && ((smellNumber+num)<maxSmellNumber)){
        smellNumber = smellNumber+num;
    } else {
        if(smellType == 1){
            smellType = smellType+num;
            sprite = 0;
            smellNumber = 0;
            document.getElementsByClassName("sprite-selector_sprite_21WnR")[sprite].click();
        } else if((sprite+num)>=0 && ((sprite+num)<response[smellNames[smellType]].length)){
            sprite = sprite+num;
            smellNumber = 0;
            document.getElementsByClassName("sprite-selector_sprite_21WnR")[sprite].click();
        } else {
            if((smellType+num)>=0 && ((smellType+num)<smellNames.length)){
                smellType = smellType+num;
                sprite = 0;
                smellNumber = 0;
                document.getElementsByClassName("sprite-selector_sprite_21WnR")[sprite].click();
            } else {
                document.getElementsByClassName("sprite-selector_sprite_21WnR")[0].click();
                return;
            }
        }
    }
    
    var workspace = Blockly.getMainWorkspace();
    workspace.removeHighlightBox();
    workspace.getFlyout().removeHighlightBox();

    switch(smellNames[smellType]){
        case "LongScript":
        handleLongScript(response, workspace);
        break;
        case "UncommunicativeName":
        handleUncommunicativeName(response, workspace);
        break;
        case "DuplicateCode":
        handleDuplicateCode(response, workspace);
        break;
        case "DuplicateExpression":
        handleDuplicateExpr(response,workspace);
        break;
    }
    return {
        type: null,
        menu: null
    };
    

};
const handleLongScript = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var lastClickedBlock1, lastClickedBlock2;
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    workspace.centerOnBlock(smell.topBlock);
    workspace.drawHighlightBox(smell.topBlock, smell.bottomBlock);
    //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
    var str = '<g id="divdingButton" style="cursor:pointer;"><rect height="40" width="200" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="90" y="175">See Next Improvable</text>'
    workspace.explainHighlightBox("This code can look even better if we break it down. \n This maybe the right place to use the concept of 'Dividable Script'. \n What do you think?", 0);
    document.getElementById('options').innerHTML=str;
    
    document.getElementById("divdingButton").onclick = function() {
        workspace.removeHighlightBox();
        nextSmell(1);
    }
};

const handleUncommunicativeName = function (response, workspace) {
    if(response[smellNames[smellType]].length==0) {
        nextSmell(1);
        return;
    }

    var msg = "";
    var smell = response[smellNames[smellType]][smellNumber];
    var str="";

    str='<g  id="button" style="cursor:pointer;"><rect height="40" width="200" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="100"></rect><text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="90" y="125">See Next Improvable</text></g>'
    msg = "Can "+smell.name+" be renamed better? \n This maybe the right place to use the concept of 'Renamable Element'. \n What do you think?";

    const f = workspace.getFlyout();
    workspace.refreshToolboxSelection_();
    f.setScrollPos(7100);
    f.drawHighlightBox([smell.varBlock]);
    workspace.explainHighlightBox(msg, 1);
    document.getElementById('options').innerHTML=str;
    if(document.getElementById("button")) document.getElementById("button").onclick = function() {
        workspace.removeHighlightBox();
        workspace.getFlyout().removeHighlightBox();
        mixpanel.track("Uncommunicative Name Refactoring Done");
        nextSmell(1);
    }
};

const handleDuplicateCode = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    workspace.centerOnBlock(smell.groups[0].topBlock);
    var i=0;
    for(i=0;i<smell.noOfGroups;i++) {
        workspace.drawHighlightBox(smell.groups[i].topBlock, smell.groups[i].bottomBlock);
    }
    var newBlocks = [];
    //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
    workspace.explainHighlightBox("This code can look even better if we removed all the repeated code and instead used a single block for it. \n This maybe the right place to use the concept of 'Reusable Repeats'. \n What do you think?", 0);
    //while(document.getElementById('options').childNodes.length!=0) {document.getElementById('options').childNodes.forEach(function(each){each.remove();})}
    var str = '<g id="navigateButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="70" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See Next Repeat</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="200" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="90" y="175">See Next Improvable</text></g></g>'
    document.getElementById("options").innerHTML=str;
    var eachRepeat = 1;
    document.getElementById("navigateButton").onclick = function() {
        workspace.centerOnBlock(smell.groups[eachRepeat].topBlock);
        eachRepeat++;
        if(eachRepeat==smell.noOfGroups) eachRepeat = 0;
    };
    document.getElementById("reusingButton").onclick = function() {
        workspace.removeHighlightBox();
        workspace.getFlyout().removeHighlightBox();
        nextSmell(1);
    };
}

const handleDuplicateExpr = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var booleanOps = ["operator_lt","operator_gt","operator_equals","operator_and","operator_or","operator_not"];
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    var exprb = workspace.getBlockById(smell.groups[0].exprBlock);
    if (!booleanOps.includes(exprb.type)) {
        workspace.centerOnBlock(smell.groups[0].exprBlock);
        var i=0;
        for(i=0;i<smell.noOfGroups;i++) {
            workspace.drawHighlightBox(smell.groups[i].exprBlock);
        }
        //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
        workspace.explainHighlightBox("This code can look better if we removed all the repeated expressions and instead used a single variable for it. \n This maybe the right place to use the concept of 'Reusable Expressions'. \n What do you think?", 0);
        document.getElementById('options').innerHTML=str;
        //while(document.getElementById('options').childNodes.length!=0) {document.getElementById('options').childNodes.forEach(function(each){each.remove();})}
        var str = '<g id="navigateButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="70" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See Next Repeat</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="200" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="90" y="175">See Next Improvable</text></g></g>'
        document.getElementById("options").innerHTML=str;
        var eachRepeat = 1;
        document.getElementById("navigateButton").onclick = function() {
            workspace.centerOnBlock(smell.groups[eachRepeat].exprBlock);
            eachRepeat++;
            if(eachRepeat==smell.noOfGroups) eachRepeat = 0;
        };
        var varNum = 1;
        document.getElementById("reusingButton").onclick = function() {
            workspace.removeHighlightBox();
            workspace.getFlyout().removeHighlightBox();
            nextSmell(1);
        };
    } 
}



export {
    checkCode,
    clearBoxes,
    nextSmell,
};
