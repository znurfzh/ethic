import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InsertUser, loginSchema } from "@shared/schema";
import { Redirect, useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  userType: z.enum(["student", "alumni", "faculty", "professional"], {
    required_error: "Please select a user type",
  }),
  organization: z.string().optional(),
  institution: z.string().optional(),
  jobTitle: z.string().optional(),
  graduationYear: z.string().optional(),
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "mayapratama",
      password: "edtechisawesome@2025"
    }
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "mayapratama",
      password: "edtechisawesome@2025",
      displayName: "Maya Pratama",
      email: "maya.pratama@ethic.id",
      userType: "student",
      organization: "",
      institution: "Universitas Negeri Jakarta",
      jobTitle: "",
      graduationYear: "2026"
    }
  });

  const handleLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/home");
      }
    });
  };

  const handleRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    const userData: InsertUser = {
      ...data,
      // Convert graduationYear to a number if it exists
      graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined
    };

    registerMutation.mutate(userData, {
      onSuccess: () => {
        navigate("/home");
      }
    });
  };

  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-pattern flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md">
              E
            </div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">ETHIC</h1>
            <p className="text-gray-600 text-center mt-2">
              Educational Technology Hub for Indonesian Community
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardContent className="pt-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="alumni">Alumni</SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                                <SelectItem value="professional">EdTech Professional (Recruiter)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {(registerForm.watch("userType") === "alumni" || registerForm.watch("userType") === "faculty" || registerForm.watch("userType") === "professional") && (
                        <>
                          <FormField
                            control={registerForm.control}
                            name="organization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization/Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="Where do you work?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your position" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      {registerForm.watch("userType") === "student" && (
                        <>
                          <FormField
                            control={registerForm.control}
                            name="institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Educational Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="Where do you study?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="graduationYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Graduation Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 2026" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      {registerForm.watch("userType") === "alumni" && (
                        <>
                          <FormField
                            control={registerForm.control}
                            name="institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Alma Mater</FormLabel>
                                <FormControl>
                                  <Input placeholder="Where did you study?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="graduationYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Graduation Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 2020" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Column - Hero Image/Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-800 to-blue-600 p-12 items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6 text-white">Connect, Learn, and Grow Together</h1>
          <p className="text-xl mb-8 text-white opacity-90">
            Join Indonesia's premier community for educational technology enthusiasts, professionals, and innovators.
          </p>
          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Community Networking</h3>
                <p className="text-white opacity-80">Connect with peers, mentors, and professionals across Indonesia</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Knowledge Hub</h3>
                <p className="text-white opacity-80">Access curated resources, research, and best practices</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Innovation Challenges</h3>
                <p className="text-white opacity-80">Collaborate on projects to solve real educational problems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
