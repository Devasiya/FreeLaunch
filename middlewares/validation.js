const Joi = require("joi");

// ⬇️ Common Fields Validation
const username = Joi.string().alphanum().min(3).max(30).required();
const email = Joi.string().email().required();
const password = Joi.string().min(6).max(50).required();
const phoneNumber = Joi.string().pattern(/^[0-9]{10}$/).optional();
const location = Joi.object({
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pincode: Joi.string().pattern(/^\d{6}$/).optional() // 6-digit pincode
});

// ⬇️ Client Registration Validation
const clientSchema = Joi.object({
    username,
    email,
    password,
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    companyName: Joi.string().optional(),
    profilePhoto: Joi.string().uri().optional(),
    location,
    category: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    phoneNumber,
    instagramLink: Joi.string().uri().optional(),
    linkedInLink: Joi.string().uri().optional()
});

// ⬇️ Freelancer Registration Validation
const freelancerSchema = Joi.object({
    username,
    email,
    password,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    profilePhoto: Joi.string().uri().optional(),
    location,
    experience: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    phoneNumber,
    instagramLink: Joi.string().uri().optional(),
    linkedInLink: Joi.string().uri().optional(),
    skills: Joi.array().items(Joi.string()).optional()
});

// ⬇️ Login Validation
const loginSchema = Joi.object({
    email,
    password
});

// ⬇️ Middleware to Validate Request Body
const validateSignup = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        req.flash("error", error.details.map(err => err.message));
        return res.redirect(req.get("referer") || "/");
    }
    next();
};

module.exports = {
    validateClientSignup: validateSignup(clientSchema),
    validateFreelancerSignup: validateSignup(freelancerSchema),
    validateLogin: validateSignup(loginSchema)
};
