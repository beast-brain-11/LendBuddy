import { Box, Flex, Button, Heading, Spacer, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout, userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box as="nav" bg="teal.500" color="white" p={4} shadow="lg" position="sticky" top={0} zIndex={1000}>
            <Flex maxW="container.xl" mx="auto" align="center">
                <Heading
                    size="md"
                    as={RouterLink}
                    to="/"
                    _hover={{ textDecoration: 'none', transform: 'scale(1.05)' }}
                    transition="all 0.2s ease"
                >
                    LendBuddy
                </Heading>
                <Spacer />
                <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                    {userRole === 'bank' ? (
                        <>
                            <Button
                                as={RouterLink}
                                to="/bank-dashboard"
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Bank Dashboard
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/news-alerts"
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                News Alerts
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                as={RouterLink}
                                to="/"
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Home
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/borrow"
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Apply for Loan
                            </Button>
                            <Button
                                onClick={() => window.location.href = "http://localhost:8501"}
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Loan Eligibility
                            </Button>
                            {isAuthenticated && (
                                <Button
                                    as={RouterLink}
                                    to="/news-alerts"
                                    variant="ghost"
                                    _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                    transition="all 0.2s ease"
                                >
                                    News Alerts
                                </Button>
                            )}
                        </>
                    )}

                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                variant="ghost"
                                _hover={{ bg: 'teal.600' }}
                                transition="all 0.2s ease"
                            >
                                <Avatar size="sm" name={user?.name} bg="teal.300" color="white" />
                            </MenuButton>
                            <MenuList color="black" shadow="xl" borderWidth="1px" _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}>
                                <MenuItem
                                    as={RouterLink}
                                    to="/profile"
                                    _hover={{ bg: 'teal.50', color: 'teal.600' }}
                                    transition="all 0.2s ease"
                                >
                                    My Profile
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    onClick={handleLogout}
                                    _hover={{ bg: 'red.50', color: 'red.500' }}
                                    transition="all 0.2s ease"
                                >
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <HStack spacing={2}>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Login
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/signup"
                                colorScheme="white"
                                variant="outline"
                                _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                                transition="all 0.2s ease"
                            >
                                Sign Up
                            </Button>
                        </HStack>
                    )}
                </HStack>
            </Flex>
        </Box>
    )
}

export default Navbar