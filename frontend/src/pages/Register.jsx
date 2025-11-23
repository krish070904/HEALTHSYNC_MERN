import { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import { registerUser } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const registrationAttempted = useRef(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    diseaseTags: "",
    dietType: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.consentAccepted && location.state?.registrationData && !registrationAttempted.current) {
      registrationAttempted.current = true;
      completeRegistration(location.state.registrationData);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    registrationAttempted.current = false;

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    navigate("/consent", { state: { registrationData: form } });
  };

  const completeRegistration = async (registrationData) => {
    setLoading(true);
    setError("");

    try {
      const dataToSend = {
        ...registrationData,
        diseaseTags: registrationData.diseaseTags
          ? registrationData.diseaseTags.split(",").map((d) => d.trim())
          : [],
      };
      const { user, token } = await registerUser(dataToSend);
      login(user, token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
      registrationAttempted.current = false;
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen relative overflow-hidden">
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--saffron)] mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Completing Registration...</p>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--saffron-light)] rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--serenity-blue)] rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[var(--saffron)] opacity-20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="glassmorphic rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="mt-2 text-gray-600">Sign up to start your health journey.</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
              <input type="tel" name="phone" placeholder="Mobile Number" value={form.phone} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
                <select name="gender" value={form.gender} onChange={handleChange} required className="form-select block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="number" name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
                <input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
              </div>

              <input type="text" name="diseaseTags" placeholder="Disease Name(s) (comma separated)" value={form.diseaseTags} onChange={handleChange} className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />
              <input type="text" name="dietType" placeholder="Diet Preference (if any)" value={form.dietType} onChange={handleChange} className="form-input block w-full rounded-lg border-transparent bg-white/70 py-3 px-4 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--saffron)] transition" />

              <button type="submit" className="flex w-full justify-center rounded-lg bg-[var(--saffron)] px-3 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--saffron-light)] hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--saffron)] transition-all duration-300">
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-semibold leading-6 text-gray-700 hover:text-[var(--saffron)]">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
