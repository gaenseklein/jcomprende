const WebSocket = require('ws');
//deactivate for local-test:
//const fs = require('fs');
//const https = require('https');
//const server = https.createServer({
//  cert: fs.readFileSync('/etc/letsencrypt/live/studio.pxi.gmbh/cert.pem'),
//  key: fs.readFileSync('/etc/letsencrypt/live/studio.pxi.gmbh/privkey.pem')
//});
//const wss = new WebSocket.Server({ server });
//activate for local-test:
const wss = new WebSocket.Server({port:3333});

var rooms = {};
var allids = [];
var owners = {};


wss.on('connection', function connection(ws, req){
        //new connection:

    ws.id = Math.floor(Math.random()*10000);
    if(allids.indexOf(ws.id)>-1)ws.id = Math.floor(Math.random()*10000);
    if(allids.indexOf(ws.id)>-1)ws.id = Math.floor(Math.random()*10000);
    if(allids.indexOf(ws.id)>-1)ws.id = Math.floor(Math.random()*10000);
    console.log("new connection with id:"+ws.id);
    ws.sendToRoom = function(message,excludeSelf){
        // console.log("sending to room:",message);
            for(var x=0;x<rooms[this.room].length;x++){
                if(excludeSelf && rooms[this.room][x] === this)continue;
                msg = message;
                if(typeof msg!="string")msg = JSON.stringify(message);
                rooms[this.room][x].send(msg);
            }
    }
    ws.on('message', function incoming(message){
        // console.log('received: %s',message);
        let data;
        try {
            data = JSON.parse(message);
        }catch(e){
           console.log(e);
            console.log("malformed message - no JSON");
            return;
        }
        if(data.action===undefined){
            console.error("action not defined");
            return; //close connection of ws directly in future
        }
        if(data.action==="heartBeat"){
          ws.send("pong");
          return;
        }
        if(data.action==="createRoom"){
          this.room=data.msg;
          if(rooms[this.room]===undefined){
          rooms[this.room]=new Array();
          owners[this.room]=ws.id; //TODO: better handle second creator
          }
          rooms[this.room].push(this);
          let creatorResponse = JSON.stringify({
            action:"initCreator",
            roomid:this.room
          });
          ws.send(creatorResponse);
          console.log("new room created");
        }
        if(data.action==="joinRoom"){
           this.room = data.msg;
           if(rooms[this.room]===undefined){
             console.log('room does not exist - sending response')
             // rooms[this.room]=new Array();
             // we cant enter a not-created room
             ws.send(JSON.stringify({action:"error",error:"room not created"}));
             return;
           }

           rooms[this.room].push(this);
           let askForCurrentState=JSON.stringify({
             action:"askCurrentState",
             newUser:ws.id
           });
           rooms[this.room][0].send(askForCurrentState);
        }
        if(data.action==="syncToSlideNr" ||
        data.action==="sendToAll"){
            if(rooms[data.room]===undefined)return; //should close connection alltogether
            this.sendToRoom(message,true);
            console.log("message send to room"); //,data);
        }
        if(data.action==="setUserName"){
            this.userName = data.msg;
        }
        if(data.action==="getUserNames" ||
        data.action==="joinRoom" ||
        data.action==="setUserName"){
            let data = new Array();
            for(var x=0;x<rooms[this.room].length;x++)data[x]={
                //username: rooms[this.room][x].userName,
                id: rooms[this.room][x].id};
            ws.sendToRoom(JSON.stringify({data:data, action:"userlist"}));
            console.log("sending userlist",data);
        }
        if(data.action==="sendToId" || data.action==="webrtc"){
            console.log('send to id', data.options.targetId)
            for(var x=0;x<rooms[this.room].length;x++){
                if(rooms[this.room][x].id === data.options.targetId){
                    rooms[this.room][x].send(message);
                    console.log('sent to id', rooms[this.room][x].id)
                    break;
                }
            }
        }
        //console.log(req);
    });
    ws.on('close',function close(){
      //remove from room:
      if(rooms[this.room]==undefined)return;
      for(var x=0;x<rooms[this.room].length;x++){
        if(rooms[this.room][x]===this){
          rooms[this.room].splice(x,1);
          console.log("user "+ws.id+" has left the room");
          if(rooms[this.room].length===0){
            rooms[this.room] = undefined;
            owners[this.room]=undefined;
            console.log("room empty -> destroy room");
          }else{
            let data = new Array();
            for(var x=0;x<rooms[this.room].length;x++)data[x]={
                //username: rooms[this.room][x].userName,
                id: rooms[this.room][x].id};
            ws.sendToRoom(JSON.stringify({data:data, action:"userlist"}),true);
            ws.sendToRoom({data:this.id,action:"userHasLeft"});
            console.log("sending new userlist",data);
          }
          break;
        }
      }
    });
    //ws.send('you have logged in succesfully');
    let respond = {msg: "you have logged in successfully", id:ws.id, action:"init"};
    ws.send(JSON.stringify(respond));
    console.log('somebody connected');
    //console.log(req);
});

console.log('server started');
