# Replquick

Replquick executes JavaScript code and shows the outcome in a serialized format.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API

### POST /eval

Evaluates JavaScript code and returns the serialized result.

#### Request Body

```json
{
  "code": "string",
  "sessionId": "string"
}
```

#### Response

```json
{
  "root": "string",
  "serialized": {
    "id": {
      "type": "string",
      "value": any
    }
  }
}
```

#### Example

Request:
```json
{
  "code": "({obj: {x: 1+1,foo: \"bar\",baz: true,arr: [1,2,3,{ hello: \"world\" }]}})",
  "sessionId": "my-session"
}
```

Response:
```json
{
  "root": "3b9ff861-3f37-4480-984a-d5e81c87473a",
  "serialized": {
    "98e50b8d-1da6-4ee0-a1d8-a08edc1dd151": {
      "type": "string",
      "value": "obj"
    },
    "fd2a2d41-8992-4467-a9ce-2d0a28d69ea2": {
      "type": "string",
      "value": "x"
    },
    "99f6e9ef-7367-4dae-9532-ba071b749ad0": {
      "type": "number",
      "value": 2
    },
    "250b66e5-bb67-4e2a-86b2-caff788216c4": {
      "type": "string",
      "value": "foo"
    },
    "a3301a02-d973-4cb6-a886-4c53354efd4c": {
      "type": "string",
      "value": "bar"
    },
    "5c971d24-2261-40bf-a26e-518afaa78f8a": {
      "type": "string",
      "value": "baz"
    },
    "ae6580bb-d187-44a8-b3c5-d3fd5b5c4baf": {
      "type": "boolean",
      "value": true
    },
    "7a1aec75-caa7-4ba0-a294-1a714c9e2325": {
      "type": "string",
      "value": "arr"
    },
    "38f8a52b-3592-489c-9514-63648f34ce1d": {
      "type": "number",
      "value": 1
    },
    "635e92b5-87dc-407a-96e7-692528fcebb7": {
      "type": "number",
      "value": 2
    },
    "bd05b5a9-7491-42de-94c5-c1657ef30ba1": {
      "type": "number",
      "value": 3
    },
    "3e06cdf4-288c-429d-b2ca-5ef98b3386fb": {
      "type": "string",
      "value": "hello"
    },
    "da637a3f-72fc-4699-9698-33af4a7065b6": {
      "type": "string",
      "value": "world"
    },
    "0bf32512-d736-46cc-bfcb-f6efe159de41": {
      "type": "object",
      "value": [
        {
          "key": "3e06cdf4-288c-429d-b2ca-5ef98b3386fb",
          "value": "da637a3f-72fc-4699-9698-33af4a7065b6"
        }
      ]
    },
    "0817e535-6e08-41be-a180-c818b97211f7": {
      "type": "array",
      "value": [
        "38f8a52b-3592-489c-9514-63648f34ce1d",
        "635e92b5-87dc-407a-96e7-692528fcebb7",
        "bd05b5a9-7491-42de-94c5-c1657ef30ba1",
        "0bf32512-d736-46cc-bfcb-f6efe159de41"
      ]
    },
    "c93af583-905b-4cbc-bed8-94cab4e052f8": {
      "type": "object",
      "value": [
        {
          "key": "fd2a2d41-8992-4467-a9ce-2d0a28d69ea2",
          "value": "99f6e9ef-7367-4dae-9532-ba071b749ad0"
        },
        {
          "key": "250b66e5-bb67-4e2a-86b2-caff788216c4",
          "value": "a3301a02-d973-4cb6-a886-4c53354efd4c"
        },
        {
          "key": "5c971d24-2261-40bf-a26e-518afaa78f8a",
          "value": "ae6580bb-d187-44a8-b3c5-d3fd5b5c4baf"
        },
        {
          "key": "7a1aec75-caa7-4ba0-a294-1a714c9e2325",
          "value": "0817e535-6e08-41be-a180-c818b97211f7"
        }
      ]
    },
    "3b9ff861-3f37-4480-984a-d5e81c87473a": {
      "type": "object",
      "value": [
        {
          "key": "98e50b8d-1da6-4ee0-a1d8-a08edc1dd151",
          "value": "c93af583-905b-4cbc-bed8-94cab4e052f8"
        }
      ]
    }
  }
}
```
