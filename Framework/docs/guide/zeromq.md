# ZeroMQ client
ZeroMQ client allows to connect to the server via `req` or `sub` socket patterns.

#### Instance
```js
ZeroMQClient(IP, PORT, PATTERN);
```
Where:
 * `IP` IP address of ZeroMQ server
 * `PORT` port number of ZeroMQ server
 * `PATTERN` socket patters (either *req* or *sub*)

#### Emitted events
 * `message` - when a new message is received

#### Example
```js
const {ZeroMQClient} = require('@aliceo2/aliceo2-gui');

// Subscribe to publisher server
const zmqSub = new ZeroMQClient('zeromq.cern.ch', '1234', 'sub');

// display messages with topic 'message'
zmqSub.on('message', function(message) {
  console.log(message);
});
```

## ZeroMQ installation note
If you have installed ZeroMQ under custom path, npm install will fail with : `fatal error: zmq.h: No such file or directory`.
To resolve this issue you need to recompile zmq module.

1. Go to `node_modules/@aliceo2/aliceo2-gui` directory
2. Download `zeromq` modue
 ```
 curl `npm v zeromq dist.tarball` | tar xvz && mv package/ node_modules/zeromq/
 ```
3. Add ZeroMQ include directory to `node_modules/zeromq/binding.gyp` file after line 67
 ```
 '-I/<ZeroMQPath>/include/'
 ```
4. Run again 
 ```
 npm install
 ```
