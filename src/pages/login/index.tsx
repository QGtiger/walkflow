import './index.css';
import ProductFeatures from './components/ProductFeatures';
import LoginForm from './components/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side: Product description */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-white to-blue-50 p-6 md:p-12 lg:p-16 flex items-center justify-center">
        <ProductFeatures />
      </div>

      {/* Right side: Login form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
