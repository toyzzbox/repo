import * as z from "zod";


export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid e mail adress",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 charecters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({ message: "Geçerli bir e-posta girin" }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
  });

// export const LoginSchema = z.object({
//     email: z.string().email({
//         message: "Please enter a valid e mail adress",
//     }),
//     password: z.string().min(6, {
//         message: "Password must be at least 6 charecters long",
//     }),
// });