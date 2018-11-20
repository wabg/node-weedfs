# node-seaweedfs (weed-fs)
[![npm version](https://badge.fury.io/js/node-seaweedfs.svg)](https://badge.fury.io/js/node-seaweedfs)
[![Build Status](https://travis-ci.org/atroo/node-weedfs.svg?branch=master)](https://travis-ci.org/atroo/node-weedfs)
[![Maintainability](https://api.codeclimate.com/v1/badges/65e9f87b30d7e2d52239/maintainability)](https://codeclimate.com/github/atroo/node-weedfs/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/65e9f87b30d7e2d52239/test_coverage)](https://codeclimate.com/github/atroo/node-weedfs/test_coverage)

This project is a node.js client library for the SeaweedFS REST interface. This is a rewrite of [cruzrr](https://github.com/cruzrr/node-weedfs)'s implementation to support Promises for better error handling. Also tests have been rewritten to use mocha and check for more error cases. This module supports readable streams to be written SeaweedFS and be writable streams to fetch files.

This module requires at least node 0.12 to enable native Promises.

# What is SeaweedFS?

[SeaweedFS](https://github.com/chrislusf/seaweedfs) is a simple and highly scalable distributed file system. It focuses on two objectives:
* storing billions of files!
* and serving them fast!

# Install

```bash
npm install @wabg/node-seaweedfs
```

# node.js

|seaweed client version|node.js version|
|---|---|
|1.3.0|0.12|
|>= 1.4.0|>=4|

# Basic Usage

```js
const weedClient = require("node-seaweedfs");
const seaweedfs = new weedClient({
	server:		"localhost",
	DataCenterServer: "192.168.8.123", // [Optional] 
	port:		9333
});

seaweedfs.write("./file.png").then((fileInfo) => {
  return seaweedfs.read(fileInfo.fid);
}).then((Buffer) => {
  // do something with the buffer
}).catch((err) => {
  // error handling
});
```

# Test

adjust test/testconf.js to your needs and just run

```js
gulp test
```

If you want to create new tests this watch task might be handy

```js
gulp
```

# API

## write(file(s), [{opts}])

Use the <code>write()</code> function to store files.  The callback recieves the parsed JSON response.

Anything passed to the <code>{opts}</code> is made into a query string and
is used with the <code>/dir/assign</code> HTTP request.  You can use this to define the replication strategy.

```js
client.write("./file.png", {replication: 000}).then(function(fileInfo) {
	console.log(fileinfo);
}).catch(function(err) {
    //error handling
});
```

Instead of a path you can also pass a buffer or a stream

```js
//using a Buffer
client.write(new Buffer("atroo")).then(function(fileInfo) {
	// The fid's will be the same, to access each variaton just
	// add _ARRAYINDEX to the end of the fid. In this case fileB
	// would be: fid + "_1"
	
	var fidA = fileInfo;
	var fidB = fileInfo + "_1";
	
	console.log(fileInfo);
}).catch(function(err) {
    //error handling
})

//using a Stream
client.write(getReadableStreamSomeHow()).then(function(fileInfo) {
	// The fid's will be the same, to access each variaton just
	// add _ARRAYINDEX to the end of the fid. In this case fileB
	// would be: fid + "_1"
	
	var fidA = fileInfo;
	var fidB = fileInfo + "_1";
	
	console.log(fileInfo);
}).catch(function(err) {
    //error handling
})
```

You can also write multiple files:

```js
client.write(["./fileA.jpg", "./fileB.jpg"]).then(function(fileInfo) {
	// The fid's will be the same, to access each variaton just
	// add _ARRAYINDEX to the end of the fid. In this case fileB
	// would be: fid + "_1"
	
	var fidA = fileInfo;
	var fidB = fileInfo + "_1";
	
	console.log(fileInfo);
}).catch(function(err) {
    //error handling
})
```

For multiple files any combinations of path's, Buffers or Streams are allowed

## read(fileId, [stream])

The read function supports streaming.  To use simply do:

```js
client.read(fileId, fs.createWriteStream("read.png"));
```

If you prefer not to use streams just use:

```js
client.read(fileId).then(function(Buffer) {
	//do something with the buffer
}).catch(function(err) {
    //error handling
});
```

## find(file)

This function can be used to find the location(s) of a file amongst the cluster.

```js
client.find(fileId).then(function(json) {
	console.log(json.locations);
});
```

## remove(file)

This function will delete a file from all locations.

```js
client.remove(fileId).then(function() {
    console.log("removed filed");
}).catch(function(err) {
    console.log("could not remove " + fileId);
});
```

## masterStatus()

This function will query the master status for status information.  The callback contains an object containing the information about which master server is the leader and which master servers are available.

```js
client.masterStatus().then(function(status) {
	console.log(status);
});
```

## systemStatus()

This function will query the master server for information about the current topology and available storage layouts.

```js
client.systemStatus().then(function(status) {
	console.log(status);
});
```

## volumeStatus(host)

This function will query an individual volume server for information about the volumes on this server.

```js
client.status("127.0.0.1:8080").then(function(status) {
	console.log(status);
});
```

## vacuum(opts)

This function will force the master server to preform garbage collection on volume servers.

> # Force Garbage Collection
>
> If your system has many deletions, the deleted file's disk space will not be synchronously re-claimed. There is a background job to check volume disk usage. If empty space is more than the threshold, default to 0.3, the vacuum job will make the volume readonly, create a new volume with only existing files, and switch on the new volume. If you are impatient or doing some testing, vacuum the unused spaces this way.

```js
client.vacuum({garbageThreshold: 0.4}).then(function(status) {
	console.log(status);
});
```
