import { Box, Container, Grid, GridItem, Heading, Text, Link as ChakraLink, HStack, VStack, Divider } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box as="footer" bg="gray.800" color="white" py={8} mt="auto">
            <Container maxW="container.xl">
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
                    <VStack align={{ base: 'center', md: 'start' }} spacing={4}>
                        <Heading size="md">LendBuddy</Heading>
                        <Text color="gray.300">
                            Connecting borrowers and lenders for a better financial future.
                        </Text>
                    </VStack>
                    <VStack align="center" spacing={4}>
                        <Heading size="md">Quick Links</Heading>
                        <VStack spacing={2} align="center">
                            <Link to="/">
                                <ChakraLink color="gray.300" _hover={{ color: 'white' }}>Home</ChakraLink>
                            </Link>
                            <Link to="/profile">
                                <ChakraLink color="gray.300" _hover={{ color: 'white' }}>Profile</ChakraLink>
                            </Link>
                            <Link to="/borrow">
                                <ChakraLink color="gray.300" _hover={{ color: 'white' }}>Apply for Loan</ChakraLink>
                            </Link>
                        </VStack>
                    </VStack>
                    <VStack align={{ base: 'center', md: 'end' }} spacing={4}>
                        <Heading size="md">Contact</Heading>
                        <Text color="gray.300">Email: support@lendbuddy.com</Text>
                        <HStack spacing={4}>
                            <ChakraLink href="#" color="gray.300" _hover={{ color: 'white' }} aria-label="Facebook">
                                <i className="fab fa-facebook"></i>
                            </ChakraLink>
                            <ChakraLink href="#" color="gray.300" _hover={{ color: 'white' }} aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </ChakraLink>
                            <ChakraLink href="#" color="gray.300" _hover={{ color: 'white' }} aria-label="LinkedIn">
                                <i className="fab fa-linkedin"></i>
                            </ChakraLink>
                        </HStack>
                    </VStack>
                </Grid>
                <Divider my={8} borderColor="gray.700" />
                <Text textAlign="center" color="gray.300">
                    © {currentYear} LendBuddy. All rights reserved.
                </Text>
            </Container>
        </Box>
    );
};

export default Footer;