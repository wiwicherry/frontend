import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  // Step 1 States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(""); // <-- New Mobile State
  
  // Step 2 States (OTP)
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Controls which screen to show

  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { toast } = useToast();

  // --- STEP 1: Handle Initial Registration ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the new user data (including mobile) to the backend
      await api.post("/users", { name, email, password, mobile });
      
      // If successful, switch the screen to the OTP form
      setIsOtpSent(true);
      toast({
        title: "Check your email!",
        description: "We sent a 6-digit verification code to your inbox.",
      });
    } catch (error) {
      const err = error as any;
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Handle OTP Verification ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the email and the code the user typed to the new verify route
      const { data } = await api.post("/users/verify-otp", { email, otp });
      
      // Success! The backend gave us the token. Now we log them in.
      setUserInfo(data);
      toast({
        title: "Welcome to Wiwi & Cherry!",
        description: "Your account is verified and ready to go.",
      });
      navigate(redirect === "/" ? "/" : `/${redirect}`);
    } catch (error) {
      const err = error as any;
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: err.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        
        {/* === SCREEN 2: THE OTP VERIFICATION SCREEN === */}
        {isOtpSent ? (
          <>
            <h1 className="font-heading text-3xl font-semibold text-center mb-4">Verify Email</h1>
            <p className="text-center text-sm text-muted-foreground mb-8">
              We sent a code to <br/><span className="font-bold text-[#E5989B]">{email}</span>
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter 6-Digit Code</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  maxLength={6}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-[#E5989B] hover:bg-[#D49A89] text-white" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
            </form>
          </>
        ) : (
          
          /* === SCREEN 1: THE REGISTRATION FORM === */
          <>
            <h1 className="font-heading text-3xl font-semibold text-center mb-8">Create Account</h1>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-[#E5989B] hover:bg-[#D49A89] text-white" disabled={loading}>
                {loading ? "Sending Code..." : "Sign Up"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to={`/login?redirect=${redirect}`} className="text-[#E5989B] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Register;