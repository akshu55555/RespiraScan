import { Link } from 'react-router-dom'

const DoctorLogin = () => {
  return (
    <div className="container mx-auto px-4 max-w-md py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Doctor Login</h2>
        
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#09D8B6] text-white py-2 px-4 rounded-md hover:bg-[#08c6a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09D8B6]"
          >
            Login
          </button>
        </form>
        
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/doctor-signup" className="text-[#09D8B6] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default DoctorLogin