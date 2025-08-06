import { RegisterForm } from "@/components/(frontend)/auth/register-form";


const RegisterPage = async () => {

  // User is not authenticated, show login form
  return (
    <div className='flex justify-center mt-10'>
      <RegisterForm/>
    </div>
  );
};

export default RegisterPage;