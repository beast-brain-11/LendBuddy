import os
import argparse
from pydub import AudioSegment

def convert_wav_to_oga(input_file, output_file=None):
    """
    Convert a WAV file to OGA (Ogg Audio) format
    
    Args:
        input_file (str): Path to the input WAV file
        output_file (str, optional): Path to the output OGA file. If not provided,
                                     it will use the same name as input but with .oga extension
    
    Returns:
        str: Path to the converted file
    """
    try:
        # Check if input file exists
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"Input file not found: {input_file}")
        
        # Check if input file is a WAV file
        if not input_file.lower().endswith('.wav'):
            raise ValueError(f"Input file must be a WAV file: {input_file}")
        
        # If output file is not provided, create one with the same name but .oga extension
        if output_file is None:
            output_file = os.path.splitext(input_file)[0] + '.oga'
        
        # Load the WAV file
        print(f"Loading WAV file: {input_file}")
        audio = AudioSegment.from_wav(input_file)
        
        # Export as OGA
        print(f"Converting to OGA format...")
        audio.export(output_file, format="ogg", codec="libvorbis")
        
        print(f"Conversion complete! Output file: {output_file}")
        return output_file
    
    except Exception as e:
        print(f"Error converting WAV to OGA: {str(e)}")
        raise

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Convert WAV files to OGA format')
    parser.add_argument('input_file', help='Path to the input WAV file')
    parser.add_argument('-o', '--output', help='Path to the output OGA file (optional)')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Convert the file
    try:
        convert_wav_to_oga(args.input_file, args.output)
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())