import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
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
    useToast,
    Link,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, error, userRole, guestLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const success = await login(values.email, values.password);

                if (success) {
                    toast({
                        title: 'Login successful!',
                        description: 'Welcome back to LendBuddy!',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });

                    navigate(userRole === 'bank' ? '/bank-dashboard' : '/');
                    return;
                }

                toast({
                    title: 'Login failed',
                    description: error || 'Invalid credentials',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (err) {
                toast({
                    title: 'Login failed',
                    description: 'Something went wrong',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

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
            } else {
                toast({
                    title: 'Guest login failed',
                    description: error || 'Something went wrong',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (err) {
            toast({
                title: 'Guest login failed',
                description: 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.md" py={{ base: 4, md: 10 }}>
            <VStack
                spacing={{ base: 4, md: 8 }}
                align="stretch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading
                    as="h1"
                    size={{ base: "lg", md: "xl" }}
                    textAlign="center"
                    bgGradient="linear(to-r, teal.400, teal.600)"
                    bgClip="text"
                    _hover={{ bgGradient: "linear(to-r, teal.500, teal.700)" }}
                    transition="all 0.3s ease"
                >
                    Welcome Back
                </Heading>

                <Text
                    textAlign="center"
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                >
                    Log in to your LendBuddy account
                </Text>

                <Button
                    colorScheme="gray"
                    size="lg"
                    width="100%"
                    onClick={handleGuestLogin}
                    isLoading={formik.isSubmitting}
                    _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                    transition="all 0.2s ease"
                >
                    Continue as Guest
                </Button>

                <Text textAlign="center" color="gray.500">
                    - OR -
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
                    _hover={{ shadow: "2xl" }}
                    transition="all 0.3s ease"
                >
                    <VStack spacing={{ base: 4, md: 5 }} align="stretch">
                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Email Address</FormLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                size={{ base: "md", md: "lg" }}
                                _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                                {...formik.getFieldProps('email')}
                            />
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                            <FormLabel fontSize={{ base: "sm", md: "md" }}>Password</FormLabel>
                            <InputGroup size={{ base: "md", md: "lg" }}>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                                    {...formik.getFieldProps('password')}
                                />
                                <InputRightElement width={{ base: "4.5rem", md: "5rem" }}>
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        _hover={{ bg: "teal.50" }}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{formik.errors.password}</FormErrorMessage>
                        </FormControl>

                        <Button
                            mt={{ base: 4, md: 6 }}
                            colorScheme="teal"
                            isLoading={formik.isSubmitting}
                            type="submit"
                            width="full"
                            size={{ base: "md", md: "lg" }}
                            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                            transition="all 0.2s ease"
                        >
                            Log In
                        </Button>

                        <Text mt={{ base: 4, md: 6 }} textAlign="center" fontSize={{ base: "sm", md: "md" }}>
                            Don't have an account?{' '}
                            <Link
                                as={RouterLink}
                                to="/signup"
                                color="teal.500"
                                _hover={{ color: "teal.600", textDecoration: "underline" }}
                                transition="all 0.2s ease"
                            >
                                Sign Up
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Login;