# chat-app
## Description
Chat Application!

Using Technology : Nodejs,Redis,Rabbitmq

## Building and Running the Application
To start the application run the command : 
# docker-compose up
go to localhost:3000 at your broswer
Choose nickname and room
start chatting!

## Get logs
To get the logs of the application that came from rabbitmq use that command:
$ docker exec -it <your-app-continer> /bin/bash
$ cd logs
$ cat <filename.log>