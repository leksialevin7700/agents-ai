import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Plane, Mail, Lock, User, Phone, ArrowRight, Check, Globe } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
    const navigate = useNavigate();

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return { label: 'Weak', color: 'text-red-500' };
            case 2:
            case 3: return { label: 'Medium', color: 'text-yellow-500' };
            case 4:
            case 5: return { label: 'Strong', color: 'text-green-500' };
            default: return { label: '', color: '' };
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        calculatePasswordStrength(newPassword);
    };

    // Register handler function
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);
        
        try {
            console.log("Sending register request:", { username, email, phoneNumber, password });
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                username,
                email,
                phoneNumber,
                password,
            });
            console.log("Register response:", response.data);
            alert(response.data.message); // Display backend message
            navigate("/login"); // Redirect to Login page after successful registration
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            // Display error message from backend
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Dummy social login handlers
    const handleGoogleRegister = () => {
        alert("Google registration functionality would be implemented here. For now, this is a dummy button.");
    };

    const handleFacebookRegister = () => {
        alert("Facebook registration functionality would be implemented here. For now, this is a dummy button.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 shadow-lg">
                        <Plane className="w-8 h-8 text-white transform rotate-45" />
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Join TravelMate AI
                    </h1>
                    <p className="text-gray-600">Create your account and start planning amazing trips</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 block">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50"
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength <= 1 ? 'bg-red-500' :
                                                    passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-medium ${getPasswordStrengthLabel().color}`}>
                                            {getPasswordStrengthLabel().label}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {confirmPassword && (
                                <div className="flex items-center gap-2 mt-2">
                                    {password === confirmPassword ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-green-600">Passwords match</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-red-600">Passwords do not match</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3">
                            <label className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                    required
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-green-600 hover:text-green-700 underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-green-600 hover:text-green-700 underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>

                            <label className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="subscribeNewsletter"
                                    checked={subscribeNewsletter}
                                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-600">
                                    Subscribe to our newsletter for travel tips and exclusive offers
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !agreeToTerms}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                   

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Quick Demo Access */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-3">Want to try without signing up?</p>
                    <Link
                        to="/chat"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white/60 text-gray-700 rounded-xl border border-gray-200 hover:bg-white/80 transition-all"
                    >
                        <Globe className="w-4 h-4" />
                        Try Demo Version
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;