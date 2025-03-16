import os
import re
import requests
import streamlit as st
from llama_parse import LlamaParse
import nest_asyncio

# Set up environment
os.environ["LLAMA_CLOUD_API_KEY"] = "llx-KZbzjQypInrMrAqm67nyHiHkYZu4atkiNlW4B3nJ67m7rdcV"
nest_asyncio.apply()

# Function to extract details using LlamaParse
def details_extract(path_adhaar, path_pan):
    parsing_instruction_adhaar = "Extract the Aadhaar Number from the Pdf, and only output the Aadhaar Number nothing else"
    vannila_parser_1 = LlamaParse(result_type="markdown", parsing_instruction=parsing_instruction_adhaar).load_data(path_adhaar)
    Aadhar_String = vannila_parser_1[0].text

    parsing_instruction_pan = "Extract the PAN Number from the Pdf, and only output the PAN Number nothing else"
    vannila_parser_2 = LlamaParse(result_type="markdown", parsing_instruction=parsing_instruction_pan).load_data(path_pan)
    Pan_string = vannila_parser_2[0].text

    # Remove whitespaces
    new_string_adhaar = ''.join(Aadhar_String.split())
    new_string_pan = ''.join(Pan_string.split())

    return new_string_adhaar, new_string_pan

# Function to verify Aadhaar and PAN linkage
def verify_linkage(adhaar_number, pan_number):
    url = "https://verify-pan-aadhaar-link1.p.rapidapi.com/getEntity"
    payload = {
        "aadhaarNumber": adhaar_number,
        "pan": pan_number
    }
    headers = {
        "x-rapidapi-key": "7a1c2e2be8msh6f1aa1eae823544p1e7bc0jsncfdb08014994",
        "x-rapidapi-host": "verify-pan-aadhaar-link1.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        result = response.json()
        desc = result.get('messages', [{}])[0].get('desc', '')

        # Regex pattern to match linking status
        pattern = r'Your PAN (\w+) is already linked to given Aadhaar (\d{2}X{8}\d{2})'
        match = re.search(pattern, desc)

        if match:
            pan = match.group(1)
            aadhaar = match.group(2)
            return True, f"✅ PAN {pan} is linked to Aadhaar {aadhaar}"
        else:
            return False, "❌ PAN is not linked to Aadhaar"
    except Exception as e:
        return False, f"❌ Error during verification: {e}"

# Streamlit App UI
st.title("🔎 Aadhaar and PAN Verification")

# Aadhaar File Upload
adhaar_file = st.file_uploader("Upload Aadhaar PDF", type="pdf")
# PAN File Upload
pan_file = st.file_uploader("Upload PAN PDF", type="pdf")

# Submit Button
if st.button("Verify Linkage"):
    if adhaar_file and pan_file:
        # Save files locally
        adhaar_path = f"./temp_adhaar.pdf"
        pan_path = f"./temp_pan.pdf"

        with open(adhaar_path, "wb") as f:
            f.write(adhaar_file.read())

        with open(pan_path, "wb") as f:
            f.write(pan_file.read())

        # Extract Aadhaar and PAN numbers
        Aadhar_number, Pan_number = details_extract(adhaar_path, pan_path)

        if Aadhar_number and Pan_number:
            st.write(f"**Extracted Aadhaar:** `{Aadhar_number}`")
            st.write(f"**Extracted PAN:** `{Pan_number}`")

            # ✅ Aadhaar and PAN number validation (before linkage check)
            st.success(f"✅ Aadhaar Number `{Aadhar_number}` is validated")
            st.success(f"✅ PAN Number `{Pan_number}` is validated")

            # Verify linkage using the API
            success, result = verify_linkage(Aadhar_number, Pan_number)

            if success:
                st.success("✅ Linkage is validated successfully!")
                st.success(result)
            else:
                st.error(result)
        else:
            st.error("❌ Failed to extract Aadhaar or PAN details.")
    else:
        st.warning("⚠️ Please upload both Aadhaar and PAN PDFs.")

# Cleanup (Optional)
if os.path.exists("./temp_adhaar.pdf"):
    os.remove("./temp_adhaar.pdf")
if os.path.exists("./temp_pan.pdf"):
    os.remove("./temp_pan.pdf")
