import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Spinner,
    Alert,
    AlertIcon,
    Link,
    Divider,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';

const NewsAlerts = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const fetchLoanNews = async () => {
        try {
            const response = await axios.get('/api/news');
            setNews(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch news updates');
            setLoading(false);
            toast({
                title: 'Error',
                description: 'Failed to fetch loan news updates',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchLoanNews();
        const interval = setInterval(fetchLoanNews, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [toast]);

    if (loading) {
        return (
            <Container maxW="container.lg" py={10} centerContent>
                <Spinner size="xl" color="teal.500" />
                <Text mt={4}>Loading News Updates...</Text>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.lg" py={10}>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading
                    size="xl"
                    bgGradient="linear(to-r, teal.400, teal.600)"
                    bgClip="text"
                    mb={6}
                >
                    Finance News
                </Heading>

                {news.map((item, index) => (
                    <Box key={index} p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
                        <Link href={item.url} isExternal color="teal.600" fontWeight="bold">
                            <Text fontSize="xl">{item.title}</Text>
                        </Link>
                        <Text color="gray.600" fontSize="sm" mt={2}>
                            {new Date(item.pubDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text color="gray.500" fontSize="sm" mt={1}>
                            Source: {item.source}
                        </Text>
                    </Box>
                ))}

                {news.length === 0 && (
                    <Alert status="info">
                        <AlertIcon />
                        No news updates available at the moment
                    </Alert>
                )}
            </VStack>
        </Container>
    );
};

export default NewsAlerts;