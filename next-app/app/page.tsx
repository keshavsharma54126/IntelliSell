"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ui/ModeToggle";
import {
  MessageCircle,
  BarChart,
  Zap,
  // Clock,
  // Building,
  // Lock,
  Menu,
  X,
  // ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ArrowRight, MessageSquare, Shield } from "lucide-react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#benefits", label: "Benefits" },
    { href: "#cta", label: "Request Demo" },
    {
      label: "Login",
      onClick: () => signIn(undefined, { callbackUrl: "/home" }),
    },
    { label: "Signup",onClick:()=>router.push("/signup") },
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Conversations",
      description: "Engage clients with intelligent, context-aware responses.",
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Gain insights from comprehensive conversation data.",
    },
    {
      icon: Zap,
      title: "Seamless Integration",
      description: "Easily connect with your existing B2B systems.",
    },
  ];

  const benefits = [
    {
      title: "Time Efficiency",
      description: "Automate responses to save valuable time for your team.",
    },
    {
      title: "Scalable Solution",
      description:
        "Grow your business without proportionally increasing support costs.",
    },
    {
      title: "Enhanced Security",
      description:
        "Ensure data protection with enterprise-grade security measures.",
    },
    {
      title: "Improved Conversion",
      description:
        "Increase sales with timely and relevant customer interactions.",
    },
  ];

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden">

      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg ${
          isScrolled ? "py-2 shadow-md" : "py-3 sm:py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                Intelli
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-green-500 dark:from-cyan-300 dark:to-green-400">
                Sell
              </span>
            </h1>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <ul className="flex space-x-8">
                {navItems.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <ModeToggle />
            </nav>
            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col items-center space-y-8 p-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsMenuOpen(false);
                      }}
                      className="text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16 sm:pt-20">
        <WavyBackground
          className="max-w-full mx-auto pb-12 sm:pb-20 lg:pb-32"
          waveOpacity={0.2}
        >

          <section className="relative text-center py-12 sm:py-20 lg:py-32 my-auto">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-400 leading-tight">
                  <TypewriterEffect
                    words={[
                      { text: "Automate" },
                      { text: "Your" },
                      {
                        text: "Sales",
                        className: "text-cyan-500 dark:text-cyan-400",
                      },
                      {
                        text: "Process",
                        className: "text-green-500 dark:text-green-400",
                      },
                    ]}
                  />
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-10 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
              >
                Harness the power of AI-driven communication for unparalleled
                efficiency and growth in your B2B sales process.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 "
              >
                <Button
                  onClick={() => router.push("/signin")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-5xl mx-auto mt-20 sm:mt-40 px-4 sm:px-6 mb-12 sm:mb-24"
          >
            <div className="mb-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                Why Choose Our IntelliSell?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: MessageSquare,
                    title: "Intelligent Conversations",
                    description:
                      "Our AI engages in natural, context-aware dialogues.",
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description:
                      "Instant responses to keep your sales pipeline moving.",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Compliant",
                    description:
                      "Enterprise-grade security for your peace of mind.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <feature.icon className="h-12 w-12  mb-4 text-cyan-500" />
                    <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </WavyBackground>

        {/* Testimonials Section */}

        <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-gray-800">

          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-gray-200">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: "John Doe",
                  company: "Tech Co",
                  quote:
                    "This AI bot has transformed our sales process. It's like having a tireless sales rep working 24/7.",
                },
                {
                  name: "Jane Smith",
                  company: "Marketing Inc",
                  quote:
                    "The efficiency gains are incredible. Our team can focus on high-value tasks while the bot handles initial inquiries.",
                },
                {
                  name: "Alex Johnson",
                  company: "Global Solutions",
                  quote:
                    "The natural language processing is impressive. Clients often can't tell they're talking to an AI.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
                >
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {`"${testimonial.quote}"`}
                  </p>
                  <div className="font-semibold text-cyan-600 dark:text-cyan-200">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.company}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-12 sm:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <h3 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-purple-400 dark:to-pink-400">
              Enterprise-Grade Features
            </h3>
            <HoverEffect
              items={features.map((feature) => ({
                ...feature,
                link: "#",
              }))}
            />
          </div>
        </section>

        <section
          id="benefits"
          className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <h3 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-purple-400 dark:to-pink-400">
              Benefits
            </h3>
            <StickyScroll content={benefits} />
          </div>
        </section>

        <section id="cta" className="py-12 sm:py-16 lg:py-24 px-4">
          <BackgroundGradient className="mx-auto rounded-[22px] p-4 sm:p-8">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Transform Your Sales Process?
              </h3>
              <p className="mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-gray-200">
                Experience the power of AI-driven communication. Request a demo
                today.
              </p>
              <form className="max-w-md mx-auto space-y-4">
                <Input
                  type="text"
                  placeholder="Company Name"
                  className="w-full bg-white/10 text-white placeholder-white/60 border-0 rounded-full focus:ring-2 focus:ring-white/50"
                />
                <Input
                  type="email"
                  placeholder="Business Email"
                  className="w-full bg-white/10 text-white placeholder-white/60 border-0 rounded-full focus:ring-2 focus:ring-white/50"
                />
                <Button
                  size="lg"
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                >
                  Request Demo
                </Button>
              </form>
            </div>
          </BackgroundGradient>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 dark:text-gray-500 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white dark:text-gray-300 font-semibold mb-4">
                About Us
              </h4>
              <p className="text-sm">
                Innovating B2B communication with AI-powered solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-semibold mb-4">
                Quick Links
              </h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#cta"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-semibold mb-4">
                Contact
              </h4>
              <p className="text-sm">info@intellisell.com</p>
              <p className="text-sm">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-semibold mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} IntelliSell. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
