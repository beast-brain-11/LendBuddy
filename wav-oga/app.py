import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import uvicorn
from wav_to_oga import convert_wav_to_oga
import tempfile

app = FastAPI(
    title="WAV to OGA Converter API",
    description="API for converting WAV audio files to OGA (Ogg Audio) format",
    version="1.0.0"
)

@app.get("/")
async def root():
    """Root endpoint that returns a welcome message"""
    return {"message": "Welcome to WAV to OGA Converter API"}

@app.post("/convert/", response_class=FileResponse)
async def convert_audio(file: UploadFile = File(...), output_filename: Optional[str] = None):
    """Convert uploaded WAV file to OGA format
    
    Args:
        file: The WAV file to convert
        output_filename: Optional custom filename for the output OGA file
    
    Returns:
        The converted OGA file for download
    """
    # Check if the uploaded file is a WAV file
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(status_code=400, detail="Uploaded file must be a WAV file")
    
    try:
        # Create a temporary directory to store files
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save the uploaded file to the temporary directory
            temp_input_path = os.path.join(temp_dir, file.filename)
            with open(temp_input_path, "wb") as temp_file:
                shutil.copyfileobj(file.file, temp_file)
            
            # Set output filename if provided
            temp_output_path = None
            if output_filename:
                if not output_filename.lower().endswith('.oga'):
                    output_filename += '.oga'
                temp_output_path = os.path.join(temp_dir, output_filename)
            
            # Convert the file
            output_path = convert_wav_to_oga(temp_input_path, temp_output_path)
            
            # Create a copy of the output file in a non-temporary location
            # This is necessary because the temporary directory will be deleted after this function returns
            permanent_output_dir = os.path.join(os.getcwd(), "converted_files")
            os.makedirs(permanent_output_dir, exist_ok=True)
            
            output_filename = os.path.basename(output_path)
            permanent_output_path = os.path.join(permanent_output_dir, output_filename)
            shutil.copy2(output_path, permanent_output_path)
            
            # Return the file as a download
            return FileResponse(
                path=permanent_output_path,
                filename=output_filename,
                media_type="audio/ogg"
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error converting file: {str(e)}")

if __name__ == "__main__":
    # Create the converted_files directory if it doesn't exist
    os.makedirs("converted_files", exist_ok=True)
    
    # Run the FastAPI app with Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)