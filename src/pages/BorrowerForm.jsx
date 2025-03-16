import { useState, useContext } from 'react'
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const loanTypes = [
    { value: 'personal', label: 'Personal Loan' },
    { value: 'home', label: 'Home Loan' },
    { value: 'car', label: 'Car Loan' },
    { value: 'education', label: 'Education Loan' },
    { value: 'business', label: 'Business Loan' },
]

const BorrowerForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isAuthenticated, token } = useContext(AuthContext)
    const toast = useToast()

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            loanType: '',
            loanAmount: 100000,
            loanTenure: 12,
            maxInterestRate: 10,
            monthlyIncome: '',
            employmentType: '',
            purpose: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required').matches(
                /^[6-9]\d{9}$/,
                'Please enter a valid 10-digit Indian mobile number'
            ),
            loanType: Yup.string().required('Loan type is required'),
            loanAmount: Yup.number()
                .required('Loan amount is required')
                .min(10000, 'Minimum loan amount is ₹10,000')
                .max(10000000, 'Maximum loan amount is ₹1 Crore'),
            loanTenure: Yup.number()
                .required('Loan tenure is required')
                .min(3, 'Minimum tenure is 3 months')
                .max(360, 'Maximum tenure is 30 years (360 months)'),
            maxInterestRate: Yup.number()
                .required('Maximum interest rate is required')
                .min(5, 'Minimum interest rate is 5%')
                .max(24, 'Maximum interest rate is 24%'),
            monthlyIncome: Yup.number()
                .required('Monthly income is required')
                .min(10000, 'Minimum monthly income should be ₹10,000'),
            employmentType: Yup.string().required('Employment type is required'),
            purpose: Yup.string().required('Loan purpose is required')
        }),
        onSubmit: async (values) => {
            if (!isAuthenticated) {
                toast({
                    title: 'Authentication required',
                    description: 'Please login to submit a loan application',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                })
                return
            }

            try {
                setIsSubmitting(true)

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }

                await axios.post('/api/loans', values, config)

                toast({
                    title: 'Loan request submitted!',
                    description: 'Banks will review your application and compete to offer you the best rate.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            } catch (err) {
                console.error('Error submitting loan application:', err.response?.data || err.message)
                toast({
                    title: 'Submission failed',
                    description: err.response?.data?.errors?.[0]?.msg || 'Failed to submit loan application. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    return (
        <Container maxW="container.md" py={{ base: 4, md: 10 }}>
            <VStack spacing={{ base: 4, md: 8 }} align="stretch">
                <Heading
                    as="h1"
                    size={{ base: "lg", md: "xl" }}
                    textAlign="center"
                    bgGradient="linear(to-r, teal.400, teal.600)"
                    bgClip="text"
                >
                    Apply for a Loan
                </Heading>

                <Text
                    textAlign="center"
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                >
                    Set your loan requirements and let banks compete to offer you the best deal
                </Text>

                <Box
                    as="form"
                    onSubmit={formik.handleSubmit}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={{ base: 6, md: 8 }}
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    shadow="xl"
                >
                    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                        <FormControl isInvalid={formik.touched.fullName && formik.errors.fullName}>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                                id="fullName"
                                {...formik.getFieldProps('fullName')}
                            />
                            <FormErrorMessage>{formik.errors.fullName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel>Email Address</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                            />
                            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.phone && formik.errors.phone}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                id="phone"
                                {...formik.getFieldProps('phone')}
                            />
                            <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.loanType && formik.errors.loanType}>
                            <FormLabel>Loan Type</FormLabel>
                            <Select
                                id="loanType"
                                placeholder="Select loan type"
                                {...formik.getFieldProps('loanType')}
                            >
                                {loanTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{formik.errors.loanType}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.loanAmount && formik.errors.loanAmount}>
                            <FormLabel>Loan Amount (₹)</FormLabel>
                            <NumberInput
                                id="loanAmount"
                                min={10000}
                                max={10000000}
                                value={formik.values.loanAmount}
                                onChange={(value) => formik.setFieldValue('loanAmount', Number(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>{formik.errors.loanAmount}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.loanTenure && formik.errors.loanTenure}>
                            <FormLabel>Loan Tenure (Months)</FormLabel>
                            <Slider
                                id="loanTenure"
                                min={3}
                                max={360}
                                value={formik.values.loanTenure}
                                onChange={(value) => formik.setFieldValue('loanTenure', value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text mt={2} fontSize="sm" color="gray.600">
                                {formik.values.loanTenure} months
                            </Text>
                            <FormErrorMessage>{formik.errors.loanTenure}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.maxInterestRate && formik.errors.maxInterestRate}>
                            <FormLabel>Maximum Interest Rate (%)</FormLabel>
                            <NumberInput
                                id="maxInterestRate"
                                min={5}
                                max={24}
                                value={formik.values.maxInterestRate}
                                onChange={(value) => formik.setFieldValue('maxInterestRate', Number(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>{formik.errors.maxInterestRate}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.monthlyIncome && formik.errors.monthlyIncome}>
                            <FormLabel>Monthly Income (₹)</FormLabel>
                            <NumberInput
                                id="monthlyIncome"
                                min={10000}
                                value={formik.values.monthlyIncome}
                                onChange={(value) => formik.setFieldValue('monthlyIncome', Number(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>{formik.errors.monthlyIncome}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.employmentType && formik.errors.employmentType}>
                            <FormLabel>Employment Type</FormLabel>
                            <Select
                                id="employmentType"
                                placeholder="Select employment type"
                                {...formik.getFieldProps('employmentType')}
                            >
                                <option value="salaried">Salaried</option>
                                <option value="self-employed">Self Employed</option>
                                <option value="business">Business Owner</option>
                            </Select>
                            <FormErrorMessage>{formik.errors.employmentType}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.purpose && formik.errors.purpose}>
                            <FormLabel>Loan Purpose</FormLabel>
                            <Input
                                id="purpose"
                                {...formik.getFieldProps('purpose')}
                            />
                            <FormErrorMessage>{formik.errors.purpose}</FormErrorMessage>
                        </FormControl>

                        <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            type="submit"
                            width="full"
                        >
                            Submit Application
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default BorrowerForm
