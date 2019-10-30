# browserify-protobuf

`browserify-protobuf` is a Browserify transform.
With this tool you can require protocol buffer files directly in your code.

It is based on the `pbjs` cli command of `protobufjs`. And uses the `json-module` flag, but it loads each
required protocol buffer into a separate protobuf Root object.

## Installation

```bash
npm install --save-dev @techteamer/browserify-protobuf
```

## Usage

`example.proto`
```proto
syntax = "proto2";

package test;

service TestService {
    rpc Echo (TextMessage) returns (TextMessage) {}
}

message TextMessage {
    required string text = 1;
}
```

`example.js`
```javascript
const exampleProto = require('example.proto')
const TestService = exampleProto.lookupService('TestService')
// ...
```

### Build

Run directly from CLI:
```bash
browserify example.js -t @techteamer/browserify-protobuf > dist.js
```

Or using the browserify API:
```javascript
browserify(file, {
  // browserify options
  transform: ['@techteamer/browserify-protobuf']
})
```

Or add it to browserify config using `package.json`:
```json
{
  "browserify": {
    "transform": [
      ["@techteamer/browserify-protobuf"]    
    ]  
  }
}
```
