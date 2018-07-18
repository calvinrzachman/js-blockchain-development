# js-blockchain-development

## To run the application: 
  ### Create the first instance
  1. Clone the repository
  2. Make sure you have all the necessary node modules installed (see package.json file)
    a. To install modules open up the command line and type 
  
    npm -i <module name> --save
      
  3. Create an application instance with the command  
  
    npm run dev
      
  
  If all goes well you should see the following in the CLI:  
  
    Listening for peer-to-peer connections on: 5001  
    Listening on port 3001
  
  ### Add Local Network Peers
  In order to add additional application instances (peers), you will need to specify a different HTTP_PORT and P2P_PORT as
  well as define the list of PEERS 
  
    • The default HTTP_PORT is 3001  
  
    • The default P2P_PORT is 5001  
  
    • PEERS defaults to an empty array ([])  
  
  
  1. Open up a new command line window/tab and type a command of the following form: 
  
    HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws:localhost:5001 npm run dev
  
  If all goes well you should see the following in the CLI:  
  
    Listening for peer-to-peer connections on: 5002
    Listening on port 3002
    Socket Connected
    
  ### Unit test with Jest  
    npm run test
   
