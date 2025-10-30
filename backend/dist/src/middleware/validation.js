"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;
function validateRegistration(req, res, next) {
    // Debug logging to see what we're receiving
    console.log('Registration request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
            error: 'Invalid request body',
            message: 'Request body is missing or not valid JSON'
        });
        return;
    }
    const { usr_uname, usr_passwd, usr_email, usr_phone, usr_posio, full_name, usr_county } = req.body;
    // Required fields validation
    if (!usr_uname || !usr_passwd) {
        res.status(400).json({
            error: 'Missing required fields',
            required: ['usr_uname', 'usr_passwd'],
            received: Object.keys(req.body)
        });
        return;
    }
    // Username validation
    if (usr_uname.length < 3 || usr_uname.length > 190) {
        res.status(400).json({ error: 'Username must be between 3 and 190 characters' });
        return;
    }
    // Password validation
    if (usr_passwd.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }
    // Email validation (optional)
    if (usr_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usr_email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        if (usr_email.length > 254) {
            res.status(400).json({ error: 'Email must be less than 254 characters' });
            return;
        }
    }
    // Phone validation (optional)
    if (usr_phone && usr_phone.length > 20) {
        res.status(400).json({ error: 'Phone number must be less than 20 characters' });
        return;
    }
    // Position validation (optional)
    if (usr_posio) {
        const validPositions = ['traders', 'admin', 'vendor', 'customer'];
        if (!validPositions.includes(usr_posio)) {
            res.status(400).json({
                error: 'Invalid position',
                validPositions
            });
            return;
        }
    }
    // Full name validation (optional)
    if (full_name && full_name.length > 200) {
        res.status(400).json({ error: 'Full name must be less than 200 characters' });
        return;
    }
    // Country validation (optional)
    if (usr_county && usr_county.length > 200) {
        res.status(400).json({ error: 'Country must be less than 200 characters' });
        return;
    }
    next();
}
function validateLogin(req, res, next) {
    console.log('🔍 VALIDATION: Login request received');
    console.log('📝 Request body:', req.body);
    console.log('📄 Content-Type:', req.headers['content-type']);
    console.log('🔗 Full URL:', req.originalUrl);
    console.log('📡 Method:', req.method);
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
        console.log('❌ VALIDATION: Invalid request body');
        res.status(400).json({
            error: 'Invalid request body',
            message: 'Request body is missing or not valid JSON'
        });
        return;
    }
    const { usr_uname, usr_passwd } = req.body;
    // Required fields validation
    if (!usr_uname || !usr_passwd) {
        res.status(400).json({
            error: 'Missing required fields',
            required: ['usr_uname', 'usr_passwd'],
            received: Object.keys(req.body)
        });
        return;
    }
    // Username validation
    if (usr_uname.length < 1) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }
    // Password validation
    if (usr_passwd.length < 1) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }
    next();
}
