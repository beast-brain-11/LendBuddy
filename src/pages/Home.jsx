import { useContext } from 'react'
import { Box, Button, Container, Heading, Text, VStack, HStack, Image, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaHandshake, FaChartLine, FaLock } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'

const Feature = ({ title, text, icon }) => {
    return (
        <VStack
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={useColorModeValue('white', 'gray.800')}
            align="start"
            spacing={3}
        >
            <Icon as={icon} w={10} h={10} color="teal.500" />
            <Heading fontSize="xl">{title}</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
        </VStack>
    )
}

const Home = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    return (
        <Container maxW="container.xl" py={{ base: 4, md: 10 }}>
            <VStack spacing={{ base: 6, md: 10 }} align="stretch">
                {/* Hero Section */}
                <Box textAlign="center" py={{ base: 6, md: 10 }}>
                    <Heading
                        as="h1"
                        size={{ base: "xl", md: "2xl" }}
                        mb={{ base: 3, md: 4 }}
                        bgGradient="linear(to-r, teal.400, teal.600)"
                        bgClip="text"
                    >
                        Welcome to LendBuddy
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "xl" }} color={useColorModeValue('gray.600', 'gray.400')} mb={{ base: 6, md: 8 }}>
                        India's first reverse loan marketplace where borrowers set terms and lenders compete
                    </Text>
                    <VStack spacing={4} direction={{ base: "column", sm: "row" }}>
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    as={RouterLink}
                                    to="/login"
                                    size={{ base: "md", md: "lg" }}
                                    colorScheme="teal"
                                    px={{ base: 6, md: 8 }}
                                    w={{ base: "full", sm: "auto" }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to="/signup"
                                    size={{ base: "md", md: "lg" }}
                                    variant="outline"
                                    colorScheme="teal"
                                    px={{ base: 6, md: 8 }}
                                    w={{ base: "full", sm: "auto" }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : userRole === 'bank' ? (
                            <Button
                                as={RouterLink}
                                to="/bank-dashboard"
                                size={{ base: "md", md: "lg" }}
                                colorScheme="teal"
                                px={{ base: 6, md: 8 }}
                                w={{ base: "full", sm: "auto" }}
                            >
                                Go to Dashboard
                            </Button>
                        ) : (
                            <Button
                                as={RouterLink}
                                to="/borrow"
                                size={{ base: "md", md: "lg" }}
                                colorScheme="teal"
                                px={{ base: 6, md: 8 }}
                                w={{ base: "full", sm: "auto" }}
                            >
                                Apply for Loan
                            </Button>
                        )}
                    </VStack>
                </Box>

                {/* How It Works */}
                <Box py={{ base: 6, md: 10 }}>
                    <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={{ base: 6, md: 8 }} textAlign="center">
                        How It Works
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 10 }}>
                        {userRole === 'bank' ? (
                            <>
                                <Feature
                                    icon={FaHandshake}
                                    title="Review Applications"
                                    text="Access and review loan applications from potential borrowers."
                                />
                                <Feature
                                    icon={FaChartLine}
                                    title="Make Competitive Offers"
                                    text="Analyze requirements and make competitive interest rate offers."
                                />
                                <Feature
                                    icon={FaLock}
                                    title="Secure Deals"
                                    text="Close deals with borrowers who accept your competitive rates."
                                />
                            </>
                        ) : (
                            <>
                                <Feature
                                    icon={FaHandshake}
                                    title="You Set the Terms"
                                    text="Specify your loan amount, tenure, and desired interest rate. You're in control of what you want."
                                />
                                <Feature
                                    icon={FaChartLine}
                                    title="Banks Compete"
                                    text="Multiple banks review your requirements and compete to offer you the best possible deal."
                                />
                                <Feature
                                    icon={FaLock}
                                    title="Secure the Best Rate"
                                    text="Choose the offer that works best for you and complete your loan application process."
                                />
                            </>
                        )}
                    </SimpleGrid>
                </Box>

                {/* Call to Action */}
                {!isAuthenticated && (
                    <Box
                        py={{ base: 6, md: 10 }}
                        bg="teal.50"
                        borderRadius="lg"
                        p={{ base: 6, md: 8 }}
                        textAlign="center"
                    >
                        <Heading as="h3" size={{ base: "md", md: "lg" }} mb={{ base: 3, md: 4 }}>
                            Want Loan Advice?
                        </Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} mb={{ base: 6, md: 8 }}>
                            Talk to Our Loan Advisor
                        </Text>
                        <Button
                            size={{ base: "md", md: "lg" }}
                            colorScheme="teal"
                            px={8}
                            onClick={() => window.location.href = "http://localhost:8501/"}
                        >
                            Conversate
                        </Button>
                    </Box>
                )}
            </VStack>
        </Container>
    )
}

export default Home