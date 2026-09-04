import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Users, 
  Heart, 
  MonitorPlay, 
  Phone, 
  Mail, 
  Menu, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Award,
  Globe,
  Clock,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { SchoolProfile } from '../../types';

interface LandingPageProps {
  schoolProfile: SchoolProfile;
  onEnterPortal: () => void;
  onEnrollNow?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  schoolProfile,
  onEnterPortal,
  onEnrollNow,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = [
  {
    src: '/sha-73rd-anniversary-campus.png',
    alt: 'Sacred Heart Academy 73rd Founding Anniversary',
    link: '#',
  },
  {
    src: '/sha-73rd-anniversary-people.png',
    alt: 'Sacred Heart Academy Anniversary Celebration',
    link: '#',
  },
  {
    src: '/programs-offered.png',
    alt: 'Sacred Heart Academy Programs Offered',
    link: '#',
  },
  {
    src: '/bread-pastry.jpg',
    alt: 'Senior High School Bread and Pastry Production',
    link: '#',
  },
  {
    src: '/housekeeping.jpg',
    alt: 'Senior High School Housekeeping',
    link: '#',
  },
];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-900 selection:text-white flex flex-col">
      {/* Top Utility Bar (Dark Green) */}
      <div className="bg-emerald-900 text-emerald-100 py-1.5 hidden lg:block border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5" /> 
              {schoolProfile.contactNumber}
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5" /> 
              {schoolProfile.email}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#alumni" className="hover:text-amber-400 transition-colors">Alumni</a>
            <a href="#careers" className="hover:text-amber-400 transition-colors">Careers</a>
            <a href="#library" className="hover:text-amber-400 transition-colors">Library</a>
            <button 
              onClick={onEnterPortal}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation (White) */}
      <nav className={`bg-white transition-all duration-300 z-50 ${isScrolled ? 'fixed top-0 w-full shadow-lg border-b border-emerald-100' : 'relative border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            {/* Logo & Branding */}
            <div className="flex items-center gap-3 sm:gap-4">
             {/* Logo & Branding */}
<div className="flex items-center gap-3 sm:gap-4">
  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
    <img
      src="/sacred-heart-logo.png"
      alt="Sacred Heart Academy Official Logo"
      className="w-full h-full object-contain"
    />
  </div>

  <div className="flex flex-col justify-center">
    <h1 className="font-extrabold text-lg sm:text-2xl text-emerald-950 uppercase tracking-tight leading-none">
      {schoolProfile.name}
    </h1>

    <p className="text-[10px] sm:text-xs text-emerald-700 font-semibold tracking-widest uppercase mt-1">
    </p>
  </div>
</div>
          
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm font-bold text-emerald-950 hover:text-amber-500 transition-colors">Home</a>
              
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors py-2">
                  About Us <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-900" />
                </button>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors py-2">
                  Academics <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-900" />
                </button>
              </div>

              <a href="#admissions" className="text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors">Admissions</a>
              <a href="#news" className="text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors">News & Events</a>
              
              <button
                onClick={onEnrollNow || onEnterPortal}
                className="ml-4 bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border-b-4 border-emerald-950 active:border-b-0 active:mt-1"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
               <button
                onClick={onEnterPortal}
                className="bg-emerald-800 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm"
              >
                Login
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-emerald-900 bg-slate-100 rounded-md"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      
     {/* Hero Slider / Banner */}
<section className="relative w-full bg-slate-950 overflow-hidden">
  <div className="relative aspect-[1880/836] min-h-[420px] max-h-[780px] w-full">

    {heroSlides.map((slide, index) => (
      <a
        key={slide.src}
        href={slide.link}
        className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ${
          index === activeHeroSlide
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-label={`Open ${slide.alt}`}
      >
        <img
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Click / Read More Overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none">
          <div className="bg-emerald-950/80 text-white px-6 py-3 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity">
            <span className="font-bold">
              Click to view more information
            </span>
          </div>
        </div>
      </a>
    ))}

    {/* Previous Button */}
    <button
      type="button"
      aria-label="Previous hero slide"
      onClick={(e) => {
        e.preventDefault();
        setActiveHeroSlide(
          (current) =>
            (current - 1 + heroSlides.length) % heroSlides.length
        );
      }}
      className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm border border-white/50 text-white flex items-center justify-center transition-all shadow-lg"
    >
      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
    </button>

    {/* Next Button */}
    <button
      type="button"
      aria-label="Next hero slide"
      onClick={(e) => {
        e.preventDefault();
        setActiveHeroSlide(
          (current) => (current + 1) % heroSlides.length
        );
      }}
      className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm border border-white/50 text-white flex items-center justify-center transition-all shadow-lg"
    >
      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
    </button>

    {/* Slide Indicators */}
    <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
      {heroSlides.map((slide, index) => (
        <button
          key={slide.src}
          type="button"
          aria-label={`Show hero slide ${index + 1}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveHeroSlide(index);
          }}
          className={`h-2.5 rounded-full transition-all ${
            index === activeHeroSlide
              ? 'w-8 bg-white shadow-lg'
              : 'w-2.5 bg-white/60 hover:bg-white/90'
          }`}
        />
      ))}
    </div>

  </div>
</section>

      {/* Quick Action Cards (Overlapping Hero visually on desktop) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shadow-2xl rounded-xl overflow-hidden bg-white border border-slate-100">
          <div className="p-8 hover:bg-emerald-50 transition-colors group cursor-pointer border-r border-slate-100">
            <BookOpen className="w-10 h-10 text-emerald-700 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Academics</h3>
            <p className="text-sm text-slate-500">Explore our comprehensive curriculum.</p>
          </div>
          <div onClick={onEnrollNow || onEnterPortal} className="p-8 hover:bg-emerald-50 transition-colors group cursor-pointer border-r border-slate-100">
            <Users className="w-10 h-10 text-emerald-700 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Admissions</h3>
            <p className="text-sm text-slate-500">Join our growing community today.</p>
          </div>
          <div onClick={onEnterPortal} className="p-8 hover:bg-emerald-50 transition-colors group cursor-pointer border-r border-slate-100">
            <MonitorPlay className="w-10 h-10 text-emerald-700 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Student Portal</h3>
            <p className="text-sm text-slate-500">Access grades, schedules & resources.</p>
          </div>
          <div className="p-8 bg-amber-400 hover:bg-amber-500 transition-colors group cursor-pointer">
            <Globe className="w-10 h-10 text-amber-950 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-amber-950 mb-2">Campus Life</h3>
            <p className="text-sm text-amber-900 font-medium">Discover student activities.</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section (About) */}
      <div className="py-16 sm:py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-sm mb-4">
                <Award className="w-4 h-4" />
                About The Academy
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Our Mission & <span className="text-emerald-700">Vision</span>
              </h2>
              
              <div className="space-y-8 mt-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <Award className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl text-emerald-950 mb-2">Our Mission</h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      To provide life-long quality education to the youth to become progressive in thought, dynamic in spirit, proactive in doing things, forward-looking, and in their desire for excellence.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-1">
                    <Heart className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl text-emerald-950 mb-2">Our Vision</h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      Sacred Heart Academy is a pioneer institution that molds and produces graduates who will be pillars of the community today, tomorrow, and beyond.
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-10 flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900 transition-colors">
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-emerald-900 rounded-2xl transform translate-x-4 translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
                alt="Students studying" 
                className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="text-4xl font-black text-amber-400">100%</div>
                <div className="text-sm font-bold text-slate-700 leading-tight">Commitment<br/>to Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Programs */}
      <div id="academics" className="pt-10 pb-20 sm:pb-28 bg-slate-50 border-t border-slate-200">
        {/* FREE Offerings Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-amber-400 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border-4 border-amber-300">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-10 pointer-events-none">
              <Award className="w-64 h-64 text-amber-900" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="bg-red-600 text-white text-3xl md:text-4xl font-black italic px-6 py-2 rounded-lg shadow-lg rotate-2 border-4 border-white">
                FREE!
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight leading-tight mb-2 drop-shadow-sm">
                  Tuition Fee • School Uniform • School Service
                </h3>
                <p className="text-amber-900 font-bold text-sm bg-amber-300/50 inline-block px-3 py-1 rounded">
                  Service areas: Del Pilar, San Vicente, Pagdiwitan, Mandiclom, Maligaya
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <button 
                onClick={onEnrollNow || onEnterPortal}
                className="px-8 py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl mb-4">Programs Offered</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600">
              Discover our comprehensive curriculum designed to prepare students for college, career, and life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Junior High School */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="h-64 overflow-hidden relative">
                 <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop"
                  alt="Junior High School"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-wider px-3 py-1 inline-block rounded-sm mb-3">
                    Grades 7 to 10
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight">Junior High School</h3>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Focusing on foundational skills, critical thinking, and character development aligned with the DepEd K to 12 curriculum.
                </p>
                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-emerald-100 text-emerald-700 rounded"><BookOpen className="w-4 h-4"/></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Core Subjects</h4>
                      <p className="text-xs text-slate-500 mt-1">English, Math, Science, Filipino, Araling Panlipunan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-amber-100 text-amber-700 rounded"><Heart className="w-4 h-4"/></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Values Education</h4>
                      <p className="text-xs text-slate-500 mt-1">Edukasyon sa Pagpapakatao (ESP)</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onEnrollNow || onEnterPortal}
                  className="w-full py-3.5 bg-slate-100 hover:bg-emerald-800 text-emerald-800 hover:text-white border border-slate-200 hover:border-emerald-800 rounded-md font-bold transition-all flex justify-center items-center gap-2"
                >
                  <span>Admission Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Senior High School */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="h-64 overflow-hidden relative">
                 <img
                  src="https://images.unsplash.com/photo-1523580494112-071d16940a0c?q=80&w=2070&auto=format&fit=crop"
                  alt="Senior High School"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-wider px-3 py-1 inline-block rounded-sm mb-3">
                    Grades 11 to 12
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight">Senior High School</h3>
                </div>
              </div>
              <div className="p-8 sm:p-10 flex flex-col h-full">
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Strengthened Senior High School Curriculum preparing students for higher education, employment, or entrepreneurship.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 flex-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-black text-emerald-800 text-base mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4"/> Academic Track
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      Comprehensive academic preparation for higher education across various disciplines.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-black text-emerald-800 text-base mb-3 flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4"/> Technical Pro Track
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-2 font-bold">
                      <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-500" /> Computer Systems Servicing</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-500" /> Bread & Pastry Production</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-500" /> Food Processing</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-500" /> Housekeeping</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={onEnrollNow || onEnterPortal}
                  className="w-full py-3.5 bg-slate-100 hover:bg-emerald-800 text-emerald-800 hover:text-white border border-slate-200 hover:border-emerald-800 rounded-md font-bold transition-all flex justify-center items-center gap-2"
                >
                  <span>Admission Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Specialized Courses & Electives (Grades 11 & 12) */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mb-10 flex items-center gap-3 relative z-10">
              <GraduationCap className="w-8 h-8 text-amber-400" />
              Grade 11 & 12 Specialized Subjects
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
              {/* Column 1: ICT & Tech */}
              <div>
                <h4 className="font-black text-emerald-900 mb-5 border-b-2 border-emerald-100 pb-2 uppercase tracking-wide text-sm">
                  ICT & Computer Technologies
                </h4>
                <ul className="space-y-4 text-sm text-slate-700 font-bold">
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Computer Programming <span className="text-xs text-slate-500 block">(Oracle Database)</span></span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC III</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Computer Programming <span className="text-xs text-slate-500 block">(Java / .Net)</span></span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC III</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Computer Systems Servicing</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC II</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Broadband Installation</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC II</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Contact Center Services</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC II</span>
                  </li>
                </ul>
              </div>
              
              {/* Column 2: Industrial & Humanities */}
              <div>
                <h4 className="font-black text-emerald-900 mb-5 border-b-2 border-emerald-100 pb-2 uppercase tracking-wide text-sm">
                  Industrial & Maritime
                </h4>
                <ul className="space-y-4 text-sm text-slate-700 font-bold mb-10">
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Photovoltaic Systems Installation</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">NC II</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="pr-2">Marine Eng. at Support Level</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">Non-NC</span>
                  </li>
                </ul>

                <h4 className="font-black text-emerald-900 mb-5 border-b-2 border-emerald-100 pb-2 uppercase tracking-wide text-sm">
                  Core Languages & Philo
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 font-bold">
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Filipino 1 & 2 <span className="text-xs text-slate-500 font-medium block">(Wika / Larang)</span></li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Contemporary Literature 1 & 2</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Introduction to Philosophy</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Malikhaing Pagsulat</li>
                </ul>
              </div>
              
              {/* Column 3: Arts & Social Sciences */}
              <div>
                <h4 className="font-black text-emerald-900 mb-5 border-b-2 border-emerald-100 pb-2 uppercase tracking-wide text-sm">
                  Arts, Social Sciences & Humanities
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 font-bold">
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Arts 1 & 2 <span className="text-xs text-slate-500 font-medium block">(Creative Industries)</span></li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Creative Composition 1 & 2</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Filipino Identity Through the Arts</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Leadership & Management in Arts</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Citizenship and Civic Engagement</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Philippine Politics and Governance</li>
                  <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" /> Social Sciences <span className="text-xs text-slate-500 font-medium block">(Theory & Practice)</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News / Updates Banner */}
      <div className="bg-emerald-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Clock className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Latest Announcements</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and memos from the School Head's Office.
          </p>
          <button 
            onClick={onEnterPortal}
            className="px-6 py-3 bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-amber-950 font-bold rounded-md transition-colors"
          >
            Log in to view Announcements
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 pt-16 pb-8 border-t-[10px] border-amber-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center border-2 border-amber-400">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <h4 className="text-lg font-black text-white uppercase leading-tight tracking-tight">{schoolProfile.name}</h4>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-emerald-100/70">
              Providing holistic education and shaping the future leaders of tomorrow. Excellence in Faith, Character, and Wisdom.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium text-emerald-100/80">
              <li><a href="#" className="hover:text-amber-400 flex items-center gap-2"><ChevronRight className="w-3 h-3"/> About Us</a></li>
              <li><a href="#academics" className="hover:text-amber-400 flex items-center gap-2"><ChevronRight className="w-3 h-3"/> Academic Programs</a></li>
              <li><a href="#" className="hover:text-amber-400 flex items-center gap-2"><ChevronRight className="w-3 h-3"/> Admissions & Enrollment</a></li>
              <li><a href="#" className="hover:text-amber-400 flex items-center gap-2"><ChevronRight className="w-3 h-3"/> News & Events</a></li>
              <li><a href="#" className="hover:text-amber-400 flex items-center gap-2"><ChevronRight className="w-3 h-3"/> Careers / Join Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-4 text-sm text-emerald-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{schoolProfile.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{schoolProfile.contactNumber}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{schoolProfile.email}</span>
              </li>
            </ul>
          </div>

          {/* DepEd & Action */}
          <div>
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Student Portal</h4>
             <p className="text-sm mb-6 leading-relaxed text-emerald-100/80">
               Official portal for students, parents, and faculty to access grades, schedules, and memos.
             </p>
             <button
              onClick={onEnterPortal}
              className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-md text-sm font-bold transition-colors flex justify-center items-center gap-2 shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span>Portal Sign In</span>
            </button>
            <div className="mt-6 p-3 bg-emerald-900 border border-emerald-800 rounded text-center">
              <p className="text-xs font-semibold text-emerald-300">DepEd School ID</p>
              <p className="text-lg font-black text-white">{schoolProfile.schoolId}</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-500 font-medium">
          <p>&copy; {new Date().getFullYear()} {schoolProfile.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
