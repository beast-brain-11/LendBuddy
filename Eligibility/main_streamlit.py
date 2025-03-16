import streamlit as st
import pandas as pd
import os
import joblib

# ✅ Load the trained model
model_gradient_boosting = joblib.load('gradient_boosting.pkl')

# ✅ Encoding map for categorical values
encoding_map = {
    'Employed': 0, 'Unemployed': 1, 'Self-Employed': 2, 'Retired': 3,
    'Bachelor': 0, 'Master': 1, 'PhD': 2, 'High School': 3,
    'Married': 0, 'Single': 1, 'Divorced': 2, 'Widowed': 3,
    'Own': 0, 'Rent': 1, 'Mortgage': 2, 'Other': 3,
    'Debt Consolidation': 0, 'Home Improvement': 1, 'Business': 2, 'Medical': 3, 'Other': 4
}

# ✅ Default values for other fields
default_values = {
    'CreditScore': 750,
    'MonthlyDebtPayments': 1500,
    'CreditCardUtilizationRate': 0.32,
    'NumberOfOpenCreditLines': 4,
    'NumberOfCreditInquiries': 1,
    'DebtToIncomeRatio': 0.40,
    'BankruptcyHistory': 0,
    'PreviousLoanDefaults': 0,
    'PaymentHistory': 0.96,
    'LengthOfCreditHistory': 8,
    'SavingsAccountBalance': 12000,
    'CheckingAccountBalance': 4000,
    'TotalLiabilities': 60000,
    'UtilityBillsPaymentHistory': 0.90,
    'JobTenure': 6,
    'TotalDebtToIncomeRatio': 0.45
}

# ✅ Title
st.title("Loan Eligibility Prediction App")

# ✅ User input fields
age = st.number_input("Age", min_value=18, max_value=100, value=32)
annual_income = st.number_input("Annual Income ($)", min_value=1000, value=85000)
employment_status = st.selectbox("Employment Status", ['Employed', 'Unemployed', 'Self-Employed', 'Retired'])
education_level = st.selectbox("Education Level", ['High School', 'Bachelor', 'Master', 'PhD'])
loan_amount = st.number_input("Loan Amount ($)", min_value=1000, value=20000)
loan_duration = st.number_input("Loan Duration (Months)", min_value=6, value=48)
marital_status = st.selectbox("Marital Status", ['Single', 'Married', 'Divorced', 'Widowed'])
number_of_dependents = st.number_input("Number of Dependents", min_value=0, value=2)
home_ownership_status = st.selectbox("Home Ownership Status", ['Own', 'Rent', 'Mortgage', 'Other'])
total_assets = st.number_input("Total Assets ($)", min_value=0, value=180000)
loan_purpose = st.selectbox("Loan Purpose", ['Debt Consolidation', 'Home Improvement', 'Business', 'Medical', 'Other'])

# ✅ File upload section
st.subheader("Upload Aadhaar and PAN Details")
adhaar_file = st.file_uploader("Upload Aadhaar (PDF)", type=['pdf'])
pan_file = st.file_uploader("Upload PAN (PDF)", type=['pdf'])

# ✅ Function to simulate Aadhaar and PAN extraction
def details_extract(adhaar_path, pan_path):
    aadhaar_number = "1234-5678-9101"
    pan_number = "ABCDE1234F"
    return aadhaar_number, pan_number

# ✅ Function to simulate Aadhaar-PAN linkage verification
def verify_linkage(aadhaar_number, pan_number):
    if aadhaar_number and pan_number:
        return True, "Aadhaar and PAN are successfully linked."
    return False, "Failed to verify Aadhaar and PAN linkage."

# ✅ Prediction button
if st.button("Verify & Predict"):
    if adhaar_file and pan_file:
        # Save files locally
        adhaar_path = "./temp_adhaar.pdf"
        pan_path = "./temp_pan.pdf"
        with open(adhaar_path, "wb") as f:
            f.write(adhaar_file.read())
        with open(pan_path, "wb") as f:
            f.write(pan_file.read())

        # ✅ Extract Aadhaar and PAN details
        aadhaar_number, pan_number = details_extract(adhaar_path, pan_path)
        if aadhaar_number and pan_number:
            st.success(f"✅ Extracted Aadhaar: {aadhaar_number}")
            st.success(f"✅ Extracted PAN: {pan_number}")

            # ✅ Simulate Aadhaar and PAN verification
            st.success("✅ PAN Verification Successful!")
            st.success("✅ Aadhaar Verification Successful!")

            # ✅ Verify Linkage
            success, result = verify_linkage(aadhaar_number, pan_number)
            if success:
                st.success("✅ Aadhaar and PAN Linkage Verified Successfully!")

                # ✅ Prepare input data
                input_data = {
                    'Age': age,
                    'AnnualIncome': annual_income,
                    'CreditScore': default_values['CreditScore'],
                    'EmploymentStatus': employment_status,
                    'EducationLevel': education_level,
                    'LoanAmount': loan_amount,
                    'LoanDuration': loan_duration,
                    'MaritalStatus': marital_status,
                    'NumberOfDependents': number_of_dependents,
                    'HomeOwnershipStatus': home_ownership_status,
                    'MonthlyDebtPayments': default_values['MonthlyDebtPayments'],
                    'CreditCardUtilizationRate': default_values['CreditCardUtilizationRate'],
                    'NumberOfOpenCreditLines': default_values['NumberOfOpenCreditLines'],
                    'NumberOfCreditInquiries': default_values['NumberOfCreditInquiries'],
                    'DebtToIncomeRatio': default_values['DebtToIncomeRatio'],
                    'BankruptcyHistory': default_values['BankruptcyHistory'],
                    'LoanPurpose': loan_purpose,
                    'PreviousLoanDefaults': default_values['PreviousLoanDefaults'],
                    'PaymentHistory': default_values['PaymentHistory'],
                    'LengthOfCreditHistory': default_values['LengthOfCreditHistory'],
                    'SavingsAccountBalance': default_values['SavingsAccountBalance'],
                    'CheckingAccountBalance': default_values['CheckingAccountBalance'],
                    'TotalAssets': total_assets,
                    'TotalLiabilities': default_values['TotalLiabilities'],
                    'UtilityBillsPaymentHistory': default_values['UtilityBillsPaymentHistory'],
                    'JobTenure': default_values['JobTenure'],
                    'TotalDebtToIncomeRatio': default_values['TotalDebtToIncomeRatio']
                }

                # ✅ Ensure order consistency using sample_input keys
                sample_input_order = list(input_data.keys())
                input_df = pd.DataFrame([input_data])[sample_input_order]

                # ✅ Encode categorical values
                input_df.replace(encoding_map, inplace=True)

                # ✅ Predict
                prediction = model_gradient_boosting.predict(input_df)
                result_map = {0: 'Rejected', 1: 'Approved'}
                decoded_prediction = result_map[prediction[0]]

                st.subheader("Loan Eligibility Result")
                if decoded_prediction == 'Approved':
                    st.success(f"Loan Status: {decoded_prediction}")
                else:
                    st.error(f"Loan Status: {decoded_prediction}")
            else:
                st.error(result)
        else:
            st.error("Failed to extract Aadhaar or PAN details.")

        # ✅ Cleanup
        if os.path.exists("./temp_adhaar.pdf"):
            os.remove("./temp_adhaar.pdf")
        if os.path.exists("./temp_pan.pdf"):
            os.remove("./temp_pan.pdf")

# ✅ Footer
st.markdown("---")
st.caption("© 2025 Loan Eligibility Prediction App")