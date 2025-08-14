import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/contact-form";
import { 
  GraduationCap, 
  Users, 
  Heart, 
  Clock, 
  Video, 
  TrendingUp, 
  Shield, 
  Star,
  Menu,
  X,
  Rocket,
  CheckCircle,
  ArrowRight,
  ArrowDown
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('bg-white/95', 'backdrop-blur-sm');
        } else {
          navbar.classList.remove('bg-white/95', 'backdrop-blur-sm');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center" data-testid="brand-logo">
              <GraduationCap className="text-blue-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">TopTeachers.online</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="nav-about"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="nav-how-it-works"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  data-testid="nav-testimonials"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  data-testid="nav-get-started"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-blue-600" data-testid="mobile-menu-button">
                {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6" data-testid="hero-headline">
                Connect with 
                <span className="text-blue-600"> Expert Tutors</span> 
                for Personalized Learning
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="hero-subheadline">
                Transform your learning journey with friendly, qualified online tutors who adapt to your unique learning style and pace. Success starts with the right teacher.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => scrollToSection('contact')} 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  data-testid="button-find-tutor"
                >
                  Find Your Tutor Today
                </Button>
                <Button 
                  onClick={() => scrollToSection('how-it-works')} 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all"
                  data-testid="button-how-it-works"
                >
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-12">
                <div className="text-center" data-testid="stat-tutors">
                  <div className="text-3xl font-bold text-blue-600">75+</div>
                  <div className="text-gray-600">Expert Tutors</div>
                </div>
                <div className="text-center" data-testid="stat-students">
                  <div className="text-3xl font-bold text-green-600">185+</div>
                  <div className="text-gray-600">Happy Students</div>
                </div>
                <div className="text-center" data-testid="stat-satisfaction">
                  <div className="text-3xl font-bold text-orange-600">91%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Happy students studying online with laptops" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="hero-image"
              />
              <Card className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Star className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">4.9/5 Rating</div>
                      <div className="text-gray-600 text-sm">From 185+ reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TopTeachers.online?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We carefully select and train our tutors to ensure you receive the highest quality education tailored to your individual needs and learning goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 border-none" data-testid="feature-qualified">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Qualified Experts</h3>
                <p className="text-gray-600">All our tutors are verified professionals with proven track records and excellent teaching credentials.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 p-8 border-none" data-testid="feature-personalized">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                  <Heart className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Approach</h3>
                <p className="text-gray-600">Every learning plan is customized to match your pace, style, and specific academic goals for maximum effectiveness.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 border-none" data-testid="feature-flexible">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                  <Clock className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexible Scheduling</h3>
                <p className="text-gray-600">Book sessions at times that work for you, with 24/7 availability and easy rescheduling options.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 border-none" data-testid="feature-technology">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                  <Video className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Technology</h3>
                <p className="text-gray-600">State-of-the-art virtual classroom with interactive whiteboards, screen sharing, and recording capabilities.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 border-none" data-testid="feature-tracking">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-600">Monitor your improvement with detailed analytics, regular assessments, and comprehensive progress reports.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 border-none" data-testid="feature-secure">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-6">
                  <Shield className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe & Secure</h3>
                <p className="text-gray-600">All sessions are conducted in a secure environment with verified tutors and comprehensive safety measures.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How TopTeachers Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with your perfect tutor is simple. Follow these easy steps to begin your personalized learning journey today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative" data-testid="step-1">
              <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow border-none">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Tell Us Your Needs</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Share your subject, current level, learning goals, and preferred schedule through our simple questionnaire.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                    alt="Professional tutor consulting with student" 
                    className="rounded-lg w-full h-32 object-cover" 
                  />
                </CardContent>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-blue-600 text-2xl" />
              </div>
              <div className="lg:hidden flex justify-center mt-4">
                <ArrowDown className="text-blue-600 text-2xl" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative" data-testid="step-2">
              <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow border-none">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Get Matched</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Our smart algorithm matches you with 3-5 highly qualified tutors who perfectly fit your requirements and learning style.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                    alt="Diverse group of professional tutors" 
                    className="rounded-lg w-full h-32 object-cover" 
                  />
                </CardContent>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-green-600 text-2xl" />
              </div>
              <div className="lg:hidden flex justify-center mt-4">
                <ArrowDown className="text-green-600 text-2xl" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative" data-testid="step-3">
              <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow border-none">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Try It Free</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Schedule a complimentary 30-minute trial session with your chosen tutor to ensure it's the perfect fit.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                    alt="Student and tutor having online video session" 
                    className="rounded-lg w-full h-32 object-cover" 
                  />
                </CardContent>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-orange-600 text-2xl" />
              </div>
              <div className="lg:hidden flex justify-center mt-4">
                <ArrowDown className="text-orange-600 text-2xl" />
              </div>
            </div>
            
            {/* Step 4 */}
            <div data-testid="step-4">
              <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow border-none">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white text-2xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Start Learning</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Begin your personalized learning journey with flexible scheduling, progress tracking, and ongoing support.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                    alt="Happy student celebrating academic success" 
                    className="rounded-lg w-full h-32 object-cover" 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => scrollToSection('contact')} 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
              data-testid="button-start-journey"
            >
              <Rocket className="mr-2" />
              Start Your Learning Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students & Tutors Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our community of learners and educators have to say about their TopTeachers experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Testimonial 1 */}
            <Card className="bg-blue-50 p-8 border border-blue-100" data-testid="testimonial-emily">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "My math grades improved from C to A+ in just 3 months! My tutor Sarah made complex concepts so easy to understand. I actually look forward to math class now!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b8fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Happy female student" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Emily Chen</div>
                    <div className="text-gray-600 text-sm">High School Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tutor Testimonial 1 */}
            <Card className="bg-green-50 p-8 border border-green-100" data-testid="testimonial-michael">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "TopTeachers provides the best platform for connecting with motivated students. The tools are excellent and the support team is always helpful. I love being part of this community!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Professional male tutor" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Dr. Michael Rodriguez</div>
                    <div className="text-gray-600 text-sm">Physics Tutor</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Student Testimonial 2 */}
            <Card className="bg-orange-50 p-8 border border-orange-100" data-testid="testimonial-jessica">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The flexibility is amazing! I can schedule sessions around my work. My English tutor helped me gain confidence in writing and speaking. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Young professional woman studying" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Jessica Thompson</div>
                    <div className="text-gray-600 text-sm">College Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Parent Testimonial */}
            <Card className="bg-purple-50 p-8 border border-purple-100" data-testid="testimonial-robert">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "As a parent, I appreciate the progress tracking and regular updates. My son's confidence in chemistry has skyrocketed. The tutor is patient and explains everything clearly."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Supportive parent" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Robert Johnson</div>
                    <div className="text-gray-600 text-sm">Parent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tutor Testimonial 2 */}
            <Card className="bg-pink-50 p-8 border border-pink-100" data-testid="testimonial-sarah">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "I've been teaching for 15 years, and TopTeachers has the most intuitive platform I've used. The student-tutor matching is spot on, and payments are always on time."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Professional female tutor" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Prof. Sarah Williams</div>
                    <div className="text-gray-600 text-sm">Literature Tutor</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Student Testimonial 3 */}
            <Card className="bg-teal-50 p-8 border border-teal-100" data-testid="testimonial-alex">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Preparing for SATs was stressful until I found my tutor here. The personalized study plan and practice tests helped me achieve my target score. Thank you TopTeachers!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Happy teenage student" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Alex Kumar</div>
                    <div className="text-gray-600 text-sm">SAT Prep Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Card className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white border-none" data-testid="cta-community">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4">Join 10,000+ Happy Learners</h3>
                <p className="text-xl mb-6">Experience the difference personalized tutoring can make in your academic journey</p>
                <Button 
                  onClick={() => scrollToSection('contact')} 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                  data-testid="button-join-community"
                >
                  <Users className="mr-2" />
                  Join Our Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16" data-testid="footer">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <GraduationCap className="text-blue-400 text-3xl mr-3" />
            <span className="text-2xl font-bold">TopTeachers.online</span>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connecting students with expert tutors for personalized, effective online learning experiences that unlock your full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Button 
              onClick={() => scrollToSection('contact')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              data-testid="footer-cta"
            >
              Start Your Learning Journey
            </Button>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-lg">
              &copy; 2024 TopTeachers.online. All rights reserved. | Made with ❤️ for better learning
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Empowering students worldwide through quality online education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
