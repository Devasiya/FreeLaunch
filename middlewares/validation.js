const Joi = require("joi");

// ⬇️ Common Fields Validation
const username = Joi.string().alphanum().min(3).max(30).trim().required();
const email = Joi.string().email().trim().required();
const password = Joi.string().min(6).max(50).trim().required();
const phoneNumber = Joi.string().pattern(/^[0-9]{10}$/).optional();
const location = Joi.object({
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pincode: Joi.string().pattern(/^\d{4,10}$/).optional() // Flexible pincode for different countries
});

// ⬇️ Client Registration Validation
const clientSchema = Joi.object({
    username,
    email,
    password,
    firstName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().optional(),
    companyName: Joi.string().trim().optional(),
    profilePhoto: Joi.string().uri().optional(),
    location,
    category: Joi.string().trim().optional(),
    description: Joi.string().trim().max(500).optional(),
    phoneNumber,
    instagramLink: Joi.string().uri().optional(),
    linkedInLink: Joi.string().uri().optional()
});

// ⬇️ Freelancer Registration Validation
const freelancerSchema = Joi.object({
    username,
    email,
    password,
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    profilePhoto: Joi.string().uri().optional(),
    location,
    experience: Joi.string().trim().optional(),
    description: Joi.string().trim().max(500).optional(),
    phoneNumber,
    instagramLink: Joi.string().uri().optional(),
    linkedInLink: Joi.string().uri().optional(),
    skills: Joi.array().items(Joi.string().trim()).optional()
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
        req.flash("error", error.details.map(err => err.message).join(", ")); // Convert array to string
        return res.redirect(req.get("referer") || "/");
    }

    next();
};

// ⬇️ Exporting Middleware
module.exports = {
    validateSignup,
    clientSchema,
    freelancerSchema,
    loginSchema
};
