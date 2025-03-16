import requests
import os

# API endpoint URL
API_URL = "http://localhost:8000/convert/"

# Path to the WAV file to convert
WAV_FILE_PATH = "file_example_WAV_1MG.wav"

# Check if the WAV file exists
if not os.path.exists(WAV_FILE_PATH):
    print(f"Error: WAV file not found at {WAV_FILE_PATH}")
    exit(1)

# Optional: Custom output filename
OUTPUT_FILENAME = "converted_output.oga"

print(f"\nTesting WAV to OGA Converter API")
print(f"--------------------------------")
print(f"Input file: {WAV_FILE_PATH}")
print(f"API endpoint: {API_URL}")

try:
    # Prepare the files and data for the request
    files = {
        'file': (os.path.basename(WAV_FILE_PATH), open(WAV_FILE_PATH, 'rb'), 'audio/wav')
    }
    data = {
        'output_filename': OUTPUT_FILENAME
    }
    
    # Send the POST request to the API
    print("\nSending request to API...")
    response = requests.post(API_URL, files=files, data=data)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Save the converted file
        output_path = os.path.join("test_output", OUTPUT_FILENAME)
        os.makedirs("test_output", exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"\nSuccess! Converted file saved to: {output_path}")
        print(f"Content type: {response.headers.get('content-type')}")
        print(f"File size: {len(response.content)} bytes")
    else:
        print(f"\nError: API returned status code {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"\nError: {str(e)}")

finally:
    # Close the file
    files['file'][1].close()