import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    VStack,
    HStack,
    useToast,
    Link,
    Select,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { register, guestLogin } = useContext(AuthContext);

    const handleGuestLogin = async () => {
        try {
            const success = await guestLogin();
            if (success) {
                toast({
                    title: 'Guest login successful!',
                    description: 'Welcome to LendBuddy!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            }
        } catch (error) {
            toast({
                title: 'Guest login failed',
                description: error.message || 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            role: 'user'
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
            phone: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
                .required('Phone number is required'),
            address: Yup.string().required('Address is required'),
            role: Yup.string().oneOf(['user', 'bank'], 'Invalid role selected').required('Role is required')
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                // Remove confirmPassword before sending to API
                const { confirmPassword, ...userData } = values;

                const success = await register(userData);

                if (success) {
                    toast({
                        title: 'Account created successfully!',
                        description: 'Welcome to LendBuddy!',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });

                    // Redirect based on role
                    if (userData.role === 'bank') {
                        navigate('/bank-dashboard');
                    } else {
                        navigate('/');
                    }
                }
            } catch (error) {
                toast({
                    title: 'Registration failed',
                    description: error.response?.data?.errors?.[0]?.msg || 'Something went wrong',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

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
                    Create Your Account
                </Heading>

                <Button
                    colorScheme="gray"
                    size="lg"
                    width="100%"
                    onClick={handleGuestLogin}
                    isLoading={isLoading}
                >
                    Continue as Guest
                </Button>

                <Text textAlign="center" color="gray.500">
                    - OR -
                </Text>

                <Box as="form" onSubmit={formik.handleSubmit} borderWidth="1px" borderRadius="lg" p={{ base: 4, md: 6 }} bg="white" shadow="md">
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                        <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Full Name</FormLabel>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                size={{ base: "sm", md: "md" }}
                                {...formik.getFieldProps('name')}
                            />
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Email Address</FormLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                size={{ base: "sm", md: "md" }}
                                {...formik.getFieldProps('email')}
                            />
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.email}</FormErrorMessage>
                        </FormControl>

                        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                            <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                                <FormLabel fontSize={{ base: "sm", md: "md" }}>Password</FormLabel>
                                <InputGroup size={{ base: "sm", md: "md" }}>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        {...formik.getFieldProps('password')}
                                    />
                                    <InputRightElement width={{ base: "3.5rem", md: "4.5rem" }}>
                                        <Button h={{ base: "1.5rem", md: "1.75rem" }} size="sm" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.password}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}>
                                <FormLabel fontSize={{ base: "sm", md: "md" }}>Confirm Password</FormLabel>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    size={{ base: "sm", md: "md" }}
                                    {...formik.getFieldProps('confirmPassword')}
                                />
                                <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>
                        </VStack>

                        <FormControl isInvalid={formik.touched.phone && formik.errors.phone}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Phone Number</FormLabel>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="10-digit mobile number"
                                size={{ base: "sm", md: "md" }}
                                {...formik.getFieldProps('phone')}
                            />
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.phone}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.address && formik.errors.address}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Address</FormLabel>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Enter your address"
                                size={{ base: "sm", md: "md" }}
                                {...formik.getFieldProps('address')}
                            />
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.address}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.role && formik.errors.role}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Account Type</FormLabel>
                            <Select
                                id="role"
                                name="role"
                                placeholder="Select account type"
                                size={{ base: "sm", md: "md" }}
                                {...formik.getFieldProps('role')}
                            >
                                <option value="user">Regular User</option>
                                <option value="bank">Bank Authority</option>
                            </Select>
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.role}</FormErrorMessage>
                        </FormControl>

                        <Button
                            mt={{ base: 3, md: 4 }}
                            colorScheme="teal"
                            isLoading={isLoading}
                            type="submit"
                            width="full"
                            size={{ base: "sm", md: "md" }}
                        >
                            Sign Up
                        </Button>

                        <Text mt={{ base: 3, md: 4 }} textAlign="center" fontSize={{ base: "sm", md: "md" }}>
                            Already have an account?{' '}
                            <Link as={RouterLink} to="/login" color="teal.500">
                                Log In
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Signup;