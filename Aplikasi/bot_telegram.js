var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic = 'sensor'; //subscribe to all topics
var Broker_URL = 'mqtt://192.168.1.11';
const TelegramBot = require('node-telegram-bot-api');
const token = '1142923808:AAF26Vf7HBpHBr1va4cH9NRGruvFOrwQ0cw';
const bot = new TelegramBot(token, {polling: true});

var client  = mqtt.connect(Broker_URL);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
};

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
};



function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {
	var message_str = message.toString(); //convert byte array to string
	console.log("message to string", message_str);
	message_str = message_str.replace(/\n$/, ''); //remove new line
	//message_str = message_str.toString().split("|");
    console.log("message to params array",message_str);
    //payload syntax: clientID,topic,message
    if (message_str.length == 0) {
		console.log("Invalid payload");
		} else {	
		insert_message(topic, message_str, packet);
		//console.log(message_arr);
	}
};

function mqtt_close() {
	//console.log("Close MQTT");
};

function insert_message(topic, message_str, packet) {
	var message_arr = extract_string(message_str); //split a string into an array
	var hum= message_arr[0];
    var temp = message_arr[1];
    var d = new Date();
    var n = d.getHours();
    
    
    if (n == 10){
        bot.sendMessage(316190685, "Notif Everyday "+ "\n" + "Your Server Room Temperature is " + temp +'°C');
        
    }
    if (temp >= 35){
        bot.sendMessage(316190685, "Warning !!" + "\n" + "Your Server Room Temperature is " + temp +'°C');
    }else if (temp == 33){
        bot.sendMessage(316190685, "Your Server Room Temperature is " + temp +'°C');
    }


};	


//split a string into an array of substrings
function extract_string(message_str) {
	var message_arr = message_str.split(","); //convert to array	
	return message_arr;
};	

