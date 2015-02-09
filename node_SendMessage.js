
# Node-SendMessage
This is an example of how you can send a message to SmartNotify using Node.js  Make sure you use the proper keys + access.  You can email us if you need to get the Key.  This application has been tested using an Intel Galileo Card.

/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */

function EncodeRequest (obj) {
    var str = [];
    for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

function SendMessage() {
    console.log("***** SENDING A MESSAGE *****");
    var  jsonObject = {
        "UserID" : "00000000-0000-0000-0000-0000000000000",  //PROPER ID HERE
        "apikey" : "00000000-0000-0000-0000-0000000000000", //PROPER KEY HERE
        "MessagingHistory_Sender_Locator" : "0000",
        "MessagingHistory_Content" : "Fantastic job everyone. Can you believe the temperature is 21 degrees?",
        "MessagingHistory_Title" : "Temp demo Thur",
        "MessagingHistory_IsPref" : false,
        "GroupToReach" : 22,
        "OutBoundPhoneNumber" : "+13105551212",  //PROPER PHONE HERE
        "MessagingHistory_MethodID" : "6"
    };
    jsonObject = EncodeRequest(jsonObject);
    
    // prepare the header
    var postheaders = {
        'Content-Type' : 'application/x-www-form-urlencoded',
    };
    
    // the post options
    var optionspost = {
        host : 'pyradev.azurewebsites.net',   //http://pyradev.azurewebsites.net/admin/Services/SmartCommunications.asmx/GetFilteredSmartCastsForUserAsJSON
        port : 80,  // SWITCH TO 443 IN PROD URL → I AM USING THE TEST URL HERE
        path : '/admin/Services/smartmedia.asmx/UploadMediaMessages',
        method : 'POST',
        headers : postheaders
    };
    
    console.info('Options prepared:');
    console.info(optionspost);
    console.info('Do the POST call');
    
    // do the POST call
    var reqPost = http.request(optionspost, function(res) {
                               //var reqPost = https.request(optionspost, function(res) {
                               console.log("statusCode: ", res.statusCode);
                               // uncomment it for header details
                               console.log("headers Received: ", res.headers);
                               
                               res.on('data', function(d) {
                                      console.info('POST result:\n');
                                      process.stdout.write(d);
                                      console.info('\n\nPOST completed');
                                      });
                               });
    
    // write the json data
    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function(e) {
               console.error(e);
               });
    
}

//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
                            'use strict';
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end('<h1>Sending messages from an Intel Galileo platform!</h1>');
                            
                            }).listen(1337);

var io = require('socket.io')(app);

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
      'use strict';
      console.log('a user connected');
      //Emits an event along with a message
      socket.emit('connected', 'Welcome');
      SendMessage()
      
      //Attach a 'disconnect' event handler to the socket
      socket.on('disconnect', function () {
                console.log('user disconnected');
                });
      });



