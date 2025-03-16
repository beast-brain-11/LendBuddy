# WAV to OGA Converter API Documentation

## Overview

The WAV to OGA Converter API is a RESTful service that allows you to convert WAV audio files to OGA (Ogg Audio) format. This documentation provides detailed information on how to use the API, including endpoints, request parameters, response formats, and example code in multiple programming languages.

## API Endpoints

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Root Endpoint

- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns a welcome message to confirm the API is running.
- **Response**: JSON object with a welcome message.

**Example Response:**
```json
{
    "message": "Welcome to WAV to OGA Converter API"
}
```

#### 2. Convert WAV to OGA

- **URL**: `/convert/`
- **Method**: `POST`
- **Description**: Converts an uploaded WAV file to OGA format.
- **Content-Type**: `multipart/form-data`

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | The WAV file to convert. Must have a .wav extension. |
| output_filename | String | No | Custom filename for the output OGA file. If not provided, the original filename with .oga extension will be used. |

**Response:**
- **Content-Type**: `audio/ogg`
- **Description**: The converted OGA file as a downloadable file.

**Status Codes:**

| Status Code | Description |
|-------------|-------------|
| 200 | Successful conversion |
| 400 | Bad request (e.g., file is not a WAV file) |
| 500 | Server error during conversion |

## Code Examples

### Python

```python
import requests
import os

# API endpoint URL
API_URL = "http://localhost:8000/convert/"

# Path to the WAV file to convert
WAV_FILE_PATH = "path/to/your/file.wav"

# Check if the WAV file exists
if not os.path.exists(WAV_FILE_PATH):
    print(f"Error: WAV file not found at {WAV_FILE_PATH}")
    exit(1)

# Optional: Custom output filename
OUTPUT_FILENAME = "my_converted_file.oga"

try:
    # Prepare the files and data for the request
    files = {
        'file': (os.path.basename(WAV_FILE_PATH), open(WAV_FILE_PATH, 'rb'), 'audio/wav')
    }
    data = {
        'output_filename': OUTPUT_FILENAME
    }
    
    # Send the POST request to the API
    print("Sending request to API...")
    response = requests.post(API_URL, files=files, data=data)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Save the converted file
        output_path = os.path.join("output", OUTPUT_FILENAME)
        os.makedirs("output", exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Success! Converted file saved to: {output_path}")
        print(f"Content type: {response.headers.get('content-type')}")
        print(f"File size: {len(response.content)} bytes")
    else:
        print(f"Error: API returned status code {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"Error: {str(e)}")

finally:
    # Close the file
    files['file'][1].close()
```

### JavaScript (Node.js with axios and form-data)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// API endpoint URL
const API_URL = 'http://localhost:8000/convert/';

// Path to the WAV file to convert
const WAV_FILE_PATH = 'path/to/your/file.wav';

// Optional: Custom output filename
const OUTPUT_FILENAME = 'my_converted_file.oga';

// Check if the WAV file exists
if (!fs.existsSync(WAV_FILE_PATH)) {
    console.error(`Error: WAV file not found at ${WAV_FILE_PATH}`);
    process.exit(1);
}

// Create a new form data instance
const formData = new FormData();
formData.append('file', fs.createReadStream(WAV_FILE_PATH));
formData.append('output_filename', OUTPUT_FILENAME);

// Send the POST request to the API
console.log('Sending request to API...');
axios.post(API_URL, formData, {
    headers: {
        ...formData.getHeaders(),
    },
    responseType: 'arraybuffer',
})
.then(response => {
    // Create output directory if it doesn't exist
    const outputDir = 'output';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    // Save the converted file
    const outputPath = path.join(outputDir, OUTPUT_FILENAME);
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`Success! Converted file saved to: ${outputPath}`);
    console.log(`Content type: ${response.headers['content-type']}`);
    console.log(`File size: ${response.data.length} bytes`);
})
.catch(error => {
    console.error('Error:', error.message);
    if (error.response) {
        console.error(`Status code: ${error.response.status}`);
        console.error(`Response: ${error.response.data.toString()}`);
    }
});
```

### cURL Command

```bash
curl -X POST \
  http://localhost:8000/convert/ \
  -F "file=@path/to/your/file.wav" \
  -F "output_filename=my_converted_file.oga" \
  --output my_converted_file.oga
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

### Common Error Scenarios

1. **File Not a WAV File**
   - Status Code: 400
   - Response: `{"detail": "Uploaded file must be a WAV file"}`

2. **Server Error During Conversion**
   - Status Code: 500
   - Response: `{"detail": "Error converting file: [error message]"}`

## Interactive API Documentation

The API includes a Swagger UI interface for interactive testing and exploration:

```
http://localhost:8000/docs
```

This interface allows you to:
- View all available endpoints
- Test the API directly from your browser
- See request and response schemas
- Try out different parameters

## Installation and Setup

To run the API locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pydub python-multipart
   ```
3. Run the server:
   ```bash
   python app.py
   ```

### Requirements

- Python 3.6+
- FastAPI
- Uvicorn
- PyDub
- FFmpeg (must be installed and available in your PATH)

## Limitations

- The API currently only supports WAV to OGA conversion
- Maximum file size is determined by your server configuration
- The converted files are temporarily stored on the server in the `converted_files` directory