import os
os.environ["LLAMA_CLOUD_API_KEY"] = "llx-KZbzjQypInrMrAqm67nyHiHkYZu4atkiNlW4B3nJ67m7rdcV"

import nest_asyncio
from llama_parse import LlamaParse

def Details_extract(path_adhaar, path_pan):
    nest_asyncio.apply()
    parsing_instruction_adhaar = "Extract the Adhaar Number from the Pdf, and only output the Adhaar Number nothing else"
    vannila_parser_1 = LlamaParse(result_type="markdown", parsing_instruction=parsing_instruction_adhaar).load_data(path_adhaar)
    Aadhar_String = vannila_parser_1[0].text
    parsing_instruction_pan = "Extract the PAN Number from the Pdf, and only output the PAN Number nothing else"
    vannila_parser_2 = LlamaParse(result_type="markdown", parsing_instruction=parsing_instruction_pan).load_data(path_pan)
    Pan_string = vannila_parser_2[0].text
    new_string_adhaar=''
    new_string_pan=''
    for i in Pan_string:
        if i == " ":
            continue
        else:
            new_string_pan+=i
    for i in Aadhar_String:
        if i == " ":
            continue
        else:
            new_string_adhaar+=i
    return new_string_adhaar, new_string_pan

Aadhar_number, Pan_number = Details_extract(path_adhaar=r"C:\Users\prajw\CODE\LendBuddy\src\data\AADHAR_CARD.pdf", path_pan=r"C:\Users\prajw\CODE\LendBuddy\src\data\PAN_CARD.pdf")

# import requests

# url = "https://verify-pan-aadhaar-link1.p.rapidapi.com/getEntity"
# payload = {
# 	"aadhaarNumber": Aadhar_number,
# 	"pan": Pan_number
# }
# headers = {
# 	"x-rapidapi-key": "92a1c16c8dmshd88a36b6d838036p1210cejsn4688f0d36b18",
# 	"x-rapidapi-host": "verify-pan-aadhaar-link1.p.rapidapi.com",
# 	"Content-Type": "application/json"
# }

# response = requests.post(url, json=payload, headers=headers)

# print(response.json())

import requests

url = "https://verify-pan-aadhaar-link1.p.rapidapi.com/getEntity"
payload = {
	"aadhaarNumber": Aadhar_number,
	"pan": Pan_number
}
headers = {
	"x-rapidapi-key": "7a1c2e2be8msh6f1aa1eae823544p1e7bc0jsncfdb08014994",
	"x-rapidapi-host": "verify-pan-aadhaar-link1.p.rapidapi.com",
	"Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())

import re
# Regex pattern to match the linking status
pattern = r'Your PAN (\w+) is already linked to given Aadhaar (\d{2}X{8}\d{2})'
# Extract 'desc' from the JSON
try:
    desc = response.json().get('messages', [{}])[0].get('desc', '')
except Exception as e:
    print(f"Error parsing API response: {e}")
    desc = ''
# Check if PAN is linked to Aadhaar
match = re.search(pattern, desc)
if match:
    pan = match.group(1)
    if pan:
        print(f"✅ PAN {pan} is Verified")
    aadhaar = match.group(2)
    if aadhaar:
        print(f"✅ Aadhaar {aadhaar} is Verified")
    print(f"✅ PAN {pan} is linked to Aadhaar {aadhaar}")
else:
    print("❌ PAN is not linked to Aadhaar")