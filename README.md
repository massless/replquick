# Flatval

Flatval is an API designed to execute JavaScript code and respond with the outcome in a serialized format. The results are presented as a flat map of objects, hence the name 'Flatval'.

## Features

- Execute JavaScript code in a sandboxed environment
- Maintain session state between evaluations
- Serialize complex JavaScript objects into a flat structure
- Handle errors gracefully with proper serialization

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
  "code": "string",     // The JavaScript code to evaluate
  "sessionId": "string" // Optional: Session ID for maintaining state
}
```

#### Response

```json
{
  "root": "string",     // ID of the root node
  "serialized": {       // Map of serialized values
    "id": {
      "type": "string", // One of: object, array, error, undefined, string, number, boolean
      "value": any      // The serialized value
    }
  }
}
```

#### Example

Request:
```json
{
  "code": "var x = 1; x + 2;",
  "sessionId": "my-session"
}
```

Response:
```json
{
  "root": "5e04a0ec-be54-4908-81b1-d6b076b6a4ef",
  "serialized": {
    "5e04a0ec-be54-4908-81b1-d6b076b6a4ef": {
      "type": "number",
      "value": 3
    }
  }
}
```
