# chat-app
## Description
Chat Application!

Using Technology : Nodejs,Redis,Rabbitmq

## Building and Running the Application
  clone or download that repository.
  To start the application run the command : 
```bash
$ docker-compose up
```
go to localhost:3000 at your broswer
Choose nickname and room
start chatting!
## 
## Get logs
To get the logs of the application that came from rabbitmq use that command:
```bash
$ docker exec -it <your-app-continer> /bin/bash
$ cd logs
$ cat <filename.log>
```
##
