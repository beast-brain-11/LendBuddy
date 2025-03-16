import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BorrowerForm from './pages/user/BorrowerForm'
import BankDashboard from './pages/bank/BankDashboard'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Profile from './pages/common/Profile'
import NewsAlerts from './pages/common/NewsAlerts'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
// Remove LoanEligibilityChecker import

function App() {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box as="main" p={4} flex="1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/borrow" element={<ProtectedRoute element={<BorrowerForm />} allowedRoles={['user']} />} />
                    // Remove LoanEligibilityChecker route
                    <Route path="/bank-dashboard" element={<ProtectedRoute element={<BankDashboard />} allowedRoles={['bank']} />} />
                    <Route path="/news-alerts" element={<ProtectedRoute element={<NewsAlerts />} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                </Routes>
            </Box>
            <Footer />
        </Box>
    )
}

export default App