import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    Text,
    VStack,
    HStack,
    useToast,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Avatar,
    Flex,
    Spacer,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user, isAuthenticated, loading, updateProfile, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // Redirect if not authenticated
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    const formik = useFormik({
        initialValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
                .required('Phone number is required'),
            address: Yup.string().required('Address is required')
        }),
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                const success = await updateProfile(values);

                if (success) {
                    toast({
                        title: 'Profile updated!',
                        description: 'Your profile has been successfully updated.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    setIsEditing(false);
                } else {
                    toast({
                        title: 'Update failed',
                        description: 'Failed to update profile. Please try again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (err) {
                toast({
                    title: 'Update failed',
                    description: 'Something went wrong',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleLogout = () => {
        logout();
        navigate('/');
        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    if (loading) {
        return (
            <Container maxW="container.md" py={10} centerContent>
                <Text>Loading profile...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={{ base: 4, md: 10 }}>
            <VStack spacing={{ base: 4, md: 8 }} align="stretch">
                <Flex align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Heading
                        as="h1"
                        size={{ base: "lg", md: "xl" }}
                        bgGradient="linear(to-r, teal.400, teal.600)"
                        bgClip="text"
                        textAlign={{ base: 'center', md: 'left' }}
                    >
                        My Profile
                    </Heading>
                    <Spacer display={{ base: 'none', md: 'block' }} />
                    <Button colorScheme="red" variant="outline" onClick={handleLogout} size={{ base: 'sm', md: 'md' }}>
                        Logout
                    </Button>
                </Flex>

                <Box borderWidth="1px" borderRadius="lg" p={{ base: 4, md: 6 }} bg="white" shadow="md">
                    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                        <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={{ base: 4, md: 6 }}>
                            <Avatar size={{ base: "lg", md: "xl" }} name={user?.name} src="" bg="teal.500" />

                            <Box flex="1" width="100%">
                                <StatGroup flexDirection={{ base: 'column', sm: 'row' }} gap={{ base: 2, sm: 0 }}>
                                    <Stat>
                                        <StatLabel fontSize={{ base: 'sm', md: 'md' }}>Member Since</StatLabel>
                                        <StatNumber fontSize={{ base: 'md', md: 'lg' }}>
                                            {user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}
                                        </StatNumber>
                                    </Stat>

                                    <Stat>
                                        <StatLabel fontSize={{ base: 'sm', md: 'md' }}>Email</StatLabel>
                                        <StatNumber fontSize={{ base: 'md', md: 'lg' }}>{user?.email}</StatNumber>
                                    </Stat>
                                </StatGroup>
                            </Box>
                        </Flex>

                        <Divider />

                        {isEditing ? (
                            <Box as="form" onSubmit={formik.handleSubmit}>
                                <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                                    <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                                        <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Full Name</FormLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            size={{ base: 'sm', md: 'md' }}
                                            {...formik.getFieldProps('name')}
                                        />
                                        <FormErrorMessage fontSize={{ base: 'xs', md: 'sm' }}>{formik.errors.name}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={formik.touched.phone && formik.errors.phone}>
                                        <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Phone Number</FormLabel>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            size={{ base: 'sm', md: 'md' }}
                                            {...formik.getFieldProps('phone')}
                                        />
                                        <FormErrorMessage fontSize={{ base: 'xs', md: 'sm' }}>{formik.errors.phone}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={formik.touched.address && formik.errors.address}>
                                        <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Address</FormLabel>
                                        <Input
                                            id="address"
                                            name="address"
                                            size={{ base: 'sm', md: 'md' }}
                                            {...formik.getFieldProps('address')}
                                        />
                                        <FormErrorMessage fontSize={{ base: 'xs', md: 'sm' }}>{formik.errors.address}</FormErrorMessage>
                                    </FormControl>

                                    <HStack spacing={4} pt={{ base: 3, md: 4 }}>
                                        <Button
                                            colorScheme="teal"
                                            isLoading={isSubmitting}
                                            type="submit"
                                            size={{ base: 'sm', md: 'md' }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            size={{ base: 'sm', md: 'md' }}
                                        >
                                            Cancel
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        ) : (
                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Text fontWeight="bold">Full Name</Text>
                                    <Text>{user?.name}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold">Phone Number</Text>
                                    <Text>{user?.phone || 'Not provided'}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold">Address</Text>
                                    <Text>{user?.address || 'Not provided'}</Text>
                                </Box>

                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    onClick={() => setIsEditing(true)}
                                    alignSelf="flex-start"
                                >
                                    Edit Profile
                                </Button>
                            </VStack>
                        )}
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Profile;