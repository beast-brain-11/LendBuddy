import { useState, useEffect, useContext } from 'react'
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatGroup,
    SimpleGrid,
    Divider,
    Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const BankDashboard = () => {
    const [loanRequests, setLoanRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedLoan, setSelectedLoan] = useState(null)
    const [acceptedLoans, setAcceptedLoans] = useState([])
    const [offeredRate, setOfferedRate] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { token } = useContext(AuthContext)
    const toast = useToast()

    // Fetch loan requests from API
    useEffect(() => {
        const fetchLoanRequests = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get('/api/loans')

                // Separate pending and accepted loans
                const pending = []
                const accepted = []

                response.data.forEach(loan => {
                    if (loan.status === 'approved' && loan.offers.some(offer => offer.approved)) {
                        accepted.push({
                            ...loan,
                            offeredRate: loan.offers.find(offer => offer.approved).interestRate,
                            acceptedAt: loan.offers.find(offer => offer.approved).createdAt
                        })
                    } else if (loan.status === 'pending') {
                        pending.push(loan)
                    }
                })

                setLoanRequests(pending)
                setAcceptedLoans(accepted)
            } catch (error) {
                console.error('Error fetching loan requests:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load loan requests',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchLoanRequests()
    }, [])

    const handleViewLoan = (loan) => {
        setSelectedLoan(loan)
        setOfferedRate(loan.maxInterestRate - 0.5) // Default to slightly lower than max rate
        onOpen()
    }

    const handleAcceptLoan = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            }

            await axios.post(`/api/loans/${selectedLoan._id}/offer`, { interestRate: offeredRate }, config)

            // Update local state immediately
            const updatedLoan = {
                ...selectedLoan,
                offeredRate: offeredRate,
                acceptedAt: new Date().toISOString()
            }

            setLoanRequests(prevRequests => prevRequests.filter(loan => loan._id !== selectedLoan._id))
            setAcceptedLoans(prevAccepted => [...prevAccepted, updatedLoan])

            toast({
                title: 'Loan offer sent!',
                description: `You've offered ${offeredRate}% interest rate to ${selectedLoan.fullName}.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

            onClose()
        } catch (error) {
            console.error('Error making loan offer:', error)
            toast({
                title: 'Error',
                description: 'Failed to send loan offer',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    // Calculate dashboard stats
    const totalPendingAmount = loanRequests.reduce((sum, loan) => sum + loan.loanAmount, 0)
    const totalAcceptedAmount = acceptedLoans.reduce((sum, loan) => sum + loan.loanAmount, 0)
    const averageOfferedRate = acceptedLoans.length > 0
        ? acceptedLoans.reduce((sum, loan) => sum + loan.offeredRate, 0) / acceptedLoans.length
        : 0

    return (
        <Container maxW="container.xl" py={{ base: 4, md: 10 }}>
            <VStack spacing={{ base: 4, md: 8 }} align="stretch">
                <Heading
                    as="h1"
                    size={{ base: "lg", md: "xl" }}
                    textAlign="center"
                    bgGradient="linear(to-r, teal.400, teal.600)"
                    bgClip="text"
                >
                    Bank Dashboard
                </Heading>

                <Text textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                    Review loan requests and offer competitive interest rates
                </Text>

                {/* Dashboard Stats */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 4, md: 6 }}>
                    <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
                        <StatLabel>Pending Requests</StatLabel>
                        <StatNumber>{loanRequests.length}</StatNumber>
                        <StatHelpText>Total: ₹{totalPendingAmount.toLocaleString()}</StatHelpText>
                    </Stat>

                    <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
                        <StatLabel>Accepted Loans</StatLabel>
                        <StatNumber>{acceptedLoans.length}</StatNumber>
                        <StatHelpText>Total: ₹{totalAcceptedAmount.toLocaleString()}</StatHelpText>
                    </Stat>

                    <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
                        <StatLabel>Avg. Offered Rate</StatLabel>
                        <StatNumber>{averageOfferedRate.toFixed(2)}%</StatNumber>
                        <StatHelpText>Across all accepted loans</StatHelpText>
                    </Stat>
                </SimpleGrid>

                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Pending Requests</Tab>
                        <Tab>Accepted Loans</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            {isLoading ? (
                                <Box textAlign="center" py={8}>
                                    <Spinner size="xl" color="teal.500" />
                                </Box>
                            ) : loanRequests.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <Text>No pending loan requests</Text>
                                </Box>
                            ) : (
                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Loan Type</Th>
                                                <Th>Amount</Th>
                                                <Th>Max Interest</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {loanRequests.map((loan) => (
                                                <Tr key={loan._id}>
                                                    <Td>{loan.fullName}</Td>
                                                    <Td>
                                                        <Badge colorScheme="teal">
                                                            {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)}
                                                        </Badge>
                                                    </Td>
                                                    <Td>₹{loan.loanAmount.toLocaleString()}</Td>
                                                    <Td>{loan.maxInterestRate}%</Td>
                                                    <Td>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="teal"
                                                            onClick={() => handleViewLoan(loan)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}
                        </TabPanel>

                        <TabPanel>
                            {isLoading ? (
                                <Box textAlign="center" py={8}>
                                    <Spinner size="xl" color="teal.500" />
                                </Box>
                            ) : acceptedLoans.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <Text>No accepted loans</Text>
                                </Box>
                            ) : (
                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Loan Type</Th>
                                                <Th>Amount</Th>
                                                <Th>Offered Rate</Th>
                                                <Th>Accepted Date</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {acceptedLoans.map((loan) => (
                                                <Tr key={loan._id}>
                                                    <Td>{loan.fullName}</Td>
                                                    <Td>
                                                        <Badge colorScheme="green">
                                                            {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)}
                                                        </Badge>
                                                    </Td>
                                                    <Td>₹{loan.loanAmount.toLocaleString()}</Td>
                                                    <Td>{loan.offeredRate}%</Td>
                                                    <Td>{new Date(loan.acceptedAt).toLocaleDateString()}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                {/* Loan Details Modal */}
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Loan Request Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedLoan && (
                                <VStack spacing={4} align="stretch">
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Box>
                                            <Text fontWeight="bold">Full Name</Text>
                                            <Text>{selectedLoan.fullName}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Email</Text>
                                            <Text>{selectedLoan.email}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Phone</Text>
                                            <Text>{selectedLoan.phone}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Employment Type</Text>
                                            <Text>{selectedLoan.employmentType}</Text>
                                        </Box>
                                    </SimpleGrid>

                                    <Divider />

                                    <SimpleGrid columns={2} spacing={4}>
                                        <Box>
                                            <Text fontWeight="bold">Loan Type</Text>
                                            <Badge colorScheme="teal">
                                                {selectedLoan.loanType.charAt(0).toUpperCase() + selectedLoan.loanType.slice(1)}
                                            </Badge>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Loan Amount</Text>
                                            <Text>₹{selectedLoan.loanAmount.toLocaleString()}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Loan Tenure</Text>
                                            <Text>{selectedLoan.loanTenure} months</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Maximum Interest Rate</Text>
                                            <Text>{selectedLoan.maxInterestRate}%</Text>
                                        </Box>
                                    </SimpleGrid>

                                    <Divider />

                                    <Box>
                                        <Text fontWeight="bold">Monthly Income</Text>
                                        <Text>₹{selectedLoan.monthlyIncome.toLocaleString()}</Text>
                                    </Box>

                                    <Box>
                                        <Text fontWeight="bold">Loan Purpose</Text>
                                        <Text>{selectedLoan.purpose}</Text>
                                    </Box>

                                    <Divider />

                                    <FormControl>
                                        <FormLabel>Your Offered Interest Rate</FormLabel>
                                        <NumberInput
                                            value={offeredRate}
                                            onChange={(value) => setOfferedRate(parseFloat(value))}
                                            min={5}
                                            max={selectedLoan.maxInterestRate}
                                            step={0.1}
                                            precision={1}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                </VStack>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme="teal" onClick={handleAcceptLoan}>
                                Accept Request
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    )
}

export default BankDashboard