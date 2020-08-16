var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic = 'sensor'; //subscribe to all topics
var Broker_URL = 'mqtt://192.168.1.11';
var Database_URL = '127.0.0.1';



var options = {
	clientId: 'MyMQTT',
	port: 1883,
	//username: 'mqtt_user',
	//password: 'mqtt_password',	
	keepalive : 60
};

var client  = mqtt.connect(Broker_URL, options);
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

////////////////////////////////////////////////////
///////////////////// MYSQL ////////////////////////
////////////////////////////////////////////////////
var mysql = require('mysql'); //https://www.npmjs.com/package/mysql
//Create Connection
var connection = mysql.createConnection({
	host: '192.168.1.11',
    	user: "candra",
	password: "candramj123",
	database: "PA"
});

connection.connect(function(err) {
	if (err) throw err;
	//console.log("Database Connected!");
});

//insert a row into the tbl_messages table
function insert_message(topic, message_str, packet) {
	var message_arr = extract_string(message_str); //split a string into an array
	var hum= message_arr[0];
	var temp = message_arr[1];
	var date_insert= new Date();
	var sql = "INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)";
	var params = ['grafana', 'hum', 'temp', 'topic','date_insert', hum, temp, topic, date_insert];
	sql = mysql.format(sql, params);	
	
	connection.query(sql, function (error, results) {
		if (error) throw error;
		console.log("Message added: " + message_str);
	}); 
};	

//split a string into an array of substrings
function extract_string(message_str) {
	var message_arr = message_str.split(","); //convert to array	
	return message_arr;
};	

//count number of delimiters in a string
var delimiter = ",";
function countInstances(message_str) {
	var substrings = message_str.split(delimiter);
	return substrings.length - 1;
};
