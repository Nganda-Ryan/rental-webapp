import { z } from "zod";


const loginSchema = z.object({
    username: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
});


export const signUpSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name is required." }),

  lastname: z
    .string()
    .min(2, { message: "Last name is required." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required.",
    invalid_type_error: "Invalid gender selected.",
  }),

  email: z
    .string()
    .min(2, { message: "Email is required." })
    .email({ message: "Invalid email address." }),

  phone: z
    .string()
    .min(2, { message: "Phone number is required." }),

  country: z
    .string()
    .min(2, { message: "Country is required." }),

  city: z
    .string()
    .min(2, { message: "City is required." }),

  street: z
    .string()
    .min(2, { message: "Street is required." }),
});



export { loginSchema };