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
  X,
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
  Youtube,
  FileText,
  Send,
  CheckCircle2
} from 'lucide-react';
import { SchoolProfile } from '../../types';
import { createPublicDocumentRequest } from '../../services/publicDocumentRequests';

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

// Public Document Request
const [showDocumentRequest, setShowDocumentRequest] = useState(false);
const [requestSubmitted, setRequestSubmitted] = useState(false);
const [generatedRequestId, setGeneratedRequestId] = useState('');
const [requestLoading, setRequestLoading] = useState(false);
const [requestError, setRequestError] = useState('');

const [documentRequest, setDocumentRequest] = useState({
  requesterName: '',
  email: '',
  mobile: '',
  relationship: 'Self',
  studentName: '',
  studentNumber: '',
  yearGraduated: '',
  gradeLevel: '',
  strand: '',
  schoolYear: '',
  documentType: 'Diploma',
  copies: '1',
  purpose: '',
  details: '',
});
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

  const handleDocumentRequestChange = (
    field: keyof typeof documentRequest,
    value: string
  ) => {
    setDocumentRequest((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmitDocumentRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setRequestError('');

    if (!documentRequest.requesterName.trim()) {
      setRequestError('Please enter the requester name.');
      return;
    }

    if (!documentRequest.email.trim()) {
      setRequestError('Please enter the requester email address.');
      return;
    }

    if (!documentRequest.mobile.trim()) {
      setRequestError('Please enter the requester mobile number.');
      return;
    }

    if (!documentRequest.studentName.trim()) {
      setRequestError('Please enter the student or graduate name.');
      return;
    }

    if (!documentRequest.yearGraduated) {
      setRequestError('Please select the year graduated.');
      return;
    }

    if (!documentRequest.purpose) {
      setRequestError('Please select the purpose of the request.');
      return;
    }

    setRequestLoading(true);

    try {
      const result = await createPublicDocumentRequest({
        requesterName: documentRequest.requesterName,
        requesterEmail: documentRequest.email,
        requesterMobile: documentRequest.mobile,
        relationship: documentRequest.relationship,
        studentName: documentRequest.studentName,
        studentNumber: documentRequest.studentNumber,
        yearGraduated: Number(documentRequest.yearGraduated),
        gradeLevel: documentRequest.gradeLevel,
        strand: documentRequest.strand,
        schoolYear: documentRequest.schoolYear,
        documentType: documentRequest.documentType,
        copies: Number(documentRequest.copies),
        purpose: documentRequest.purpose,
        details: documentRequest.details,
      });

      setGeneratedRequestId(result.request_number);
      setRequestSubmitted(true);
    } catch (error) {
      console.error('Public document request failed:', error);
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your request. Please try again.'
      );
    } finally {
      setRequestLoading(false);
    }
  };

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
            <div className="lg:hidden flex items-center gap-3">
              <button
                type="button"
                onClick={onEnterPortal}
                className="bg-emerald-800 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="p-2.5 text-slate-700 hover:text-emerald-900 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="landing-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div
              id="landing-mobile-menu"
              className="lg:hidden border-t border-slate-200 py-3 pb-4 space-y-1"
            >
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-bold text-emerald-950 hover:bg-emerald-50">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50">About Us</a>
              <a href="#academics" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50">Academics</a>
              <a href="#admissions" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50">Admissions</a>
              <a href="#news" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50">News &amp; Events</a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowDocumentRequest(true);
                  setRequestSubmitted(false);
                  setGeneratedRequestId('');
                  setRequestError('');
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-emerald-800 hover:bg-emerald-50 flex items-center justify-between"
              >
                Request School Document
                <FileText className="w-4 h-4" />
              </button>
            </div>
          )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 shadow-2xl rounded-xl overflow-hidden bg-white border border-slate-100">
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
          <button
            type="button"
            onClick={() => {
              setShowDocumentRequest(true);
              setRequestSubmitted(false);
              setGeneratedRequestId('');
              setRequestError('');
            }}
            className="p-8 text-left hover:bg-amber-50 transition-colors group cursor-pointer"
          >
            <FileText className="w-10 h-10 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Request School Document</h3>
            <p className="text-sm text-slate-500">
              Request diplomas, transcripts, certificates, and other school records.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">
              Request Now
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
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


      {/* =========================================================
          PUBLIC DOCUMENT REQUEST MODAL
      ========================================================== */}
      {showDocumentRequest && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

              <div className="bg-emerald-950 text-white px-6 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300 font-bold">
                        Sacred Heart Academy
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-black mt-1">
                        Public Document Request
                      </h2>
                      <p className="text-sm text-emerald-100/80 mt-2">
                        No account required. Submit a request for school records,
                        diplomas, certificates, and other documents.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDocumentRequest(false)}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                    aria-label="Close document request"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {requestSubmitted ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-5">
                    Request Submitted Successfully
                  </h3>

                  <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                    Please keep your Request ID. The Registrar may contact you
                    for verification and processing.
                  </p>

                  <div className="mt-6 inline-flex flex-col items-center bg-emerald-50 border border-emerald-200 rounded-2xl px-8 py-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                      Request ID
                    </span>
                    <span className="text-2xl font-black text-emerald-950 mt-1">
                      {generatedRequestId}
                    </span>
                  </div>

                  <div className="mt-8 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDocumentRequest(false);
                        setRequestSubmitted(false);
                      }}
                      className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitDocumentRequest}
                  className="p-6 sm:p-8 space-y-8"
                >

                  {/* Requester Information */}
                  <section>
                    <div className="flex items-center gap-3 mb-5">
                      <Users className="w-5 h-5 text-emerald-700" />
                      <div>
                        <h3 className="font-extrabold text-emerald-950">
                          Requester Information
                        </h3>
                        <p className="text-xs text-slate-500">
                          Who is submitting this request?
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Full Name *
                        </label>
                        <input
                          required
                          value={documentRequest.requesterName}
                          onChange={(e) =>
                            handleDocumentRequestChange('requesterName', e.target.value)
                          }
                          placeholder="Juan Dela Cruz"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Relationship to Student / Graduate *
                        </label>
                        <select
                          required
                          value={documentRequest.relationship}
                          onChange={(e) =>
                            handleDocumentRequestChange('relationship', e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <option>Self</option>
                          <option>Former Student</option>
                          <option>Alumni</option>
                          <option>Parent / Guardian</option>
                          <option>Authorized Representative</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={documentRequest.email}
                          onChange={(e) =>
                            handleDocumentRequestChange('email', e.target.value)
                          }
                          placeholder="juan@email.com"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          required
                          value={documentRequest.mobile}
                          onChange={(e) =>
                            handleDocumentRequestChange('mobile', e.target.value)
                          }
                          placeholder="09XXXXXXXXX"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Student / Graduate Information */}
                  <section>
                    <div className="flex items-center gap-3 mb-5">
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                      <div>
                        <h3 className="font-extrabold text-emerald-950">
                          Student / Graduate Information
                        </h3>
                        <p className="text-xs text-slate-500">
                          Help the Registrar locate the correct record.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Student / Graduate Full Name *
                        </label>
                        <input
                          required
                          value={documentRequest.studentName}
                          onChange={(e) =>
                            handleDocumentRequestChange('studentName', e.target.value)
                          }
                          placeholder="Pedro Dela Cruz"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Student Number
                        </label>
                        <input
                          value={documentRequest.studentNumber}
                          onChange={(e) =>
                            handleDocumentRequestChange('studentNumber', e.target.value)
                          }
                          placeholder="If known"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Year Graduated *
                        </label>
                        <select
                          required
                          value={documentRequest.yearGraduated}
                          onChange={(e) =>
                            handleDocumentRequestChange('yearGraduated', e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <option value="">Select Year</option>
                          {Array.from(
                            { length: new Date().getFullYear() - 1955 },
                            (_, index) => 1956 + index
                          )
                            .reverse()
                            .map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Grade / Level
                        </label>
                        <input
                          value={documentRequest.gradeLevel}
                          onChange={(e) =>
                            handleDocumentRequestChange('gradeLevel', e.target.value)
                          }
                          placeholder="e.g. Grade 12"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Strand / Program
                        </label>
                        <input
                          value={documentRequest.strand}
                          onChange={(e) =>
                            handleDocumentRequestChange('strand', e.target.value)
                          }
                          placeholder="Academic / TechPro"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          School Year
                        </label>
                        <input
                          value={documentRequest.schoolYear}
                          onChange={(e) =>
                            handleDocumentRequestChange('schoolYear', e.target.value)
                          }
                          placeholder="e.g. 2018-2019"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Document Details */}
                  <section>
                    <div className="flex items-center gap-3 mb-5">
                      <FileText className="w-5 h-5 text-emerald-700" />
                      <div>
                        <h3 className="font-extrabold text-emerald-950">
                          Requested Document
                        </h3>
                        <p className="text-xs text-slate-500">
                          Specify the document you need.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Document Type *
                        </label>
                        <select
                          required
                          value={documentRequest.documentType}
                          onChange={(e) =>
                            handleDocumentRequestChange('documentType', e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <option>Diploma</option>
                          <option>Transcript of Records</option>
                          <option>Form 137 / SF10</option>
                          <option>Form 138 / Report Card</option>
                          <option>Certificate of Graduation</option>
                          <option>Good Moral Certificate</option>
                          <option>Certificate of Enrollment</option>
                          <option>Certificate of Grades</option>
                          <option>Authentication / Certification</option>
                          <option>Other Document</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Number of Copies *
                        </label>
                        <select
                          required
                          value={documentRequest.copies}
                          onChange={(e) =>
                            handleDocumentRequestChange('copies', e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <option value="1">1 Copy</option>
                          <option value="2">2 Copies</option>
                          <option value="3">3 Copies</option>
                          <option value="4">4 Copies</option>
                          <option value="5">5 Copies</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Purpose of Request *
                        </label>
                        <select
                          required
                          value={documentRequest.purpose}
                          onChange={(e) =>
                            handleDocumentRequestChange('purpose', e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <option value="">Select Purpose</option>
                          <option>Employment</option>
                          <option>College / University Admission</option>
                          <option>Scholarship</option>
                          <option>Transfer</option>
                          <option>Government Requirement</option>
                          <option>Personal Record</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Additional Details
                        </label>
                        <textarea
                          value={documentRequest.details}
                          onChange={(e) =>
                            handleDocumentRequestChange('details', e.target.value)
                          }
                          rows={4}
                          placeholder="Add any information that may help the Registrar..."
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>
                    </div>
                  </section>

                  {requestError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-4">
                      <p className="text-sm font-semibold">
                        {requestError}
                      </p>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-950 leading-relaxed">
                        Please provide accurate information. The Registrar may
                        contact you using the information provided for verification.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDocumentRequest(false)}
                      disabled={requestLoading}
                      className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      {requestLoading
                        ? 'Submitting...'
                        : 'Submit Document Request'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        </div>
      )}

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
