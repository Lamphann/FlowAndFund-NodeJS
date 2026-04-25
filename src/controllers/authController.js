const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authService = require("../services/authService");

//CẤU HÌNH JOI VALIDATION
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.empty": "Tên đăng nhập không được để trống",
        "string.min": "Tên đăng nhập phải có ít nhất 3 ký tự",
        "string.alphanum": "Tên đăng nhập chỉ gồm chữ và số"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ"
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự"
    }),
    confirm: Joi.any().valid(Joi.ref('password')).required().messages({
        "any.only": "Xác nhận mật khẩu không khớp"
    })
});

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập tên đăng nhập"
    }),
    password: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập mật khẩu"
    }),
    remember: Joi.string().optional()
});

//GET PAGES
exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Đăng nhập", error: null });
};

exports.getRegister = (req, res) => {
  res.render("auth/register", { title: "Đăng ký", error: null });
};

//POST REGISTER
exports.postRegister = async (req, res) => {
    try {
        // 1. Dùng Joi kiểm tra dữ liệu từ form
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.render("auth/register", { title: "Đăng ký", error: error.details[0].message });
        }

        // 2. Gọi Service để lưu vào Database
        await authService.register(value.username, value.email, value.password);
        
        // 3. Thành công thì về trang đăng nhập
        res.redirect("/login");
    } catch (err) {
        res.render("auth/register", { title: "Đăng ký", error: err.message });
    }
};

//POST LOGIN
exports.postLogin = async (req, res) => {
    try {
        // 1. Dùng Joi kiểm tra dữ liệu
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.render("auth/login", { title: "Đăng nhập", error: error.details[0].message });
        }

        // 2. Gọi Service để kiểm tra DB
        const user = await authService.login(value.username, value.password);

        // 3. Tạo JWT Token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: value.remember ? "7d" : "1d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: value.remember ? 7 * 24 * 60 * 60 * 1000 : null
        });

        res.redirect("/expenses");
    } catch (err) {
        res.render("auth/login", { title: "Đăng nhập", error: err.message });
    }
};

//LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};