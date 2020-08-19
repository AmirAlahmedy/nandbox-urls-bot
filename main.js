"use strict";
const NandBox = require("./node_modules/nandbox-bot-api/src/NandBox");
const Nand = require("./node_modules/nandbox-bot-api/src/NandBoxClient");
const NandBoxClient = Nand.NandBoxClient;

const TextOutMessage = require('./node_modules/nandbox-bot-api/src/outmessages/TextOutMessage');
const Utils = require('./node_modules/nandbox-bot-api/src/util/Utility');
const Id = Utils.Id;
const Button = require('./node_modules/nandbox-bot-api/src/data/Button');
const Row = require('./node_modules/nandbox-bot-api/src/data/Row');
const Menu = require('./node_modules/nandbox-bot-api/src/data/Menu');
const OutMessage = require('./node_modules/nandbox-bot-api/src/outmessages/OutMessage');
const urlRegex = require('url-regex');

const TOKEN = "90091981353468629:0:v1sOgtiFnRuFEha0coHCl7b4PLCXqt";
const config = {
    URI: "wss://w1.nandbox.net:5020/nandbox/api/",
    DownloadServer: "https://w1.nandbox.net:5020/nandbox/download/",
    UploadServer: "https://w1.nandbox.net:5020/nandbox/upload/"
}


var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfuly 
    api = _api;
    console.log("Authenticated and Connected Successfully!");
}

let createButton = (label, callback, order, bgColor, txtColor, buttonQuery, nextMenuRef, buttonURL) => {
    let btn = new Button();

    btn.button_label = label;
    btn.button_order = order;
    btn.button_callback = callback;
    btn.button_bgcolor = bgColor;
    btn.button_textcolor = txtColor;
    btn.button_query = buttonQuery;
    btn.next_menu = nextMenuRef;
    btn.button_url = buttonURL;

    return btn;
 }

nCallBack.onReceive = incomingMsg => {
	console.log("Message Received");

	
	let outmsg = new TextOutMessage();
	let reference = Id();
	outmsg.chat_id = incomingMsg.chat.id;
	outmsg.reference = reference;
	outmsg.text = "Links";
	outmsg.web_page_preview = OutMessage.WEB_PREVIEW_INSTANCE_VIEW;
	outmsg.echo = 1;

	let rows = [];
	let inlineMenu = [];
	let menuRef = 'mainMenu';

	let j = 0; // buttons order

	let res = incomingMsg.text.split("\n"); // array of the line 
	res.forEach(element => {

		let i = 0;
		for(; element[i] != '|'; ++i){}
		
		let txt = ""; let  url = "";
		[txt, url] = [element.substring(0, i), element.substring(i + 1)]; // splitting each line into text and url
		url = url.replace(/\s+/g, '');


		if(urlRegex({exact: true, strict: false}).test(url)){
			
			
			let oneBtn = createButton(txt, "oneBtnCBInWebView", 1, "RED", "White", null, null);
			oneBtn.button_url = url;

			let buttons = [];
			buttons.push(oneBtn.toJsonObject()); // called toJsonObject to remove null values

			let rowOrder = ++j;
			let firstRow = new Row(buttons, rowOrder);
			rows.push(firstRow);

		}
	});

	let firstInlineMenu = new Menu(rows, menuRef);
	inlineMenu.push(firstInlineMenu);

	outmsg.menu_ref = menuRef;
	outmsg.inline_menu = inlineMenu;

	api.send(JSON.stringify(outmsg));
}


// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => {}
nCallBack.onClose = () => console.log("ONCLOSE");
nCallBack.onError = () => console.log("ONERROR");
nCallBack.onChatMenuCallBack = chatMenuCallback => { }
nCallBack.onInlineMessageCallback = inlineMsgCallback => { }
nCallBack.onMessagAckCallback = msgAck => { }
nCallBack.onUserJoinedBot = user => { }
nCallBack.onChatMember = chatMember => { }
nCallBack.onChatAdministrators = chatAdministrators => { }
nCallBack.userStartedBot = user => { }
nCallBack.onMyProfile = user => { }
nCallBack.onUserDetails = user => { }
nCallBack.userStoppedBot = user => { }
nCallBack.userLeftBot = user => { }
nCallBack.permanentUrl = permenantUrl => { }
nCallBack.onChatDetails = chat => { }
nCallBack.onInlineSearh = inlineSearch => { }


client.connect(TOKEN, nCallBack);