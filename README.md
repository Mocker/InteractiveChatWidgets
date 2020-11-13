# InteractiveChatWidgets
Framework for building widgets that interact with zoom and webrtc sessions

Uses Electron for the main GUI, + swift bindings to generate a virtual camera on MacOS

Client : the desktop client
 - src : The Electron/NodeJS framework
 - Drivers : OS native apps to create a virtual camera
  - Windows : C++ code to create a Windows driver
  - MacOS : Swift based driver
Server : A simple static server to connect WebRTC clients that are in the same chat