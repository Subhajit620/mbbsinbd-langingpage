import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/landing-page.css';

const COLLEGES = [
  { name: 'Anwer Khan Modern Medical College',                    location: 'Dhanmondi, Dhaka',        type: 'pvt', est: 2008, score: 98, desc: 'Affiliated with University of Dhaka. Renowned private medical college offering top-tier clinical exposure.', img: 'college/anwer_khan.jpg' },
  { name: 'MH Samorita Medical College',                          location: 'Tejgaon, Dhaka',          type: 'pvt', est: 2010, score: 96, desc: 'Affiliated with University of Dhaka. High academic standards and robust healthcare infrastructure.', img: 'college/mh_samorita.jpg' },
  { name: 'Enam Medical College & Hospital',                      location: 'Savar, Dhaka',            type: 'pvt', est: 2003, score: 95, desc: 'Affiliated with University of Dhaka. Outstanding teaching hospital with comprehensive medical services.', img: 'college/enam_medical.webp' },
  { name: 'Tairunnessa Memorial Medical College & Hospital',      location: 'Gazipur',                 type: 'pvt', est: 2002, score: 94, desc: 'Affiliated with University of Dhaka. Highly popular private institution with premium labs and facilities.', img: 'college/tairunnessa.webp' },
  { name: 'Jahurul Islam Medical College & Hospital',             location: 'Bajitpur, Kishoreganj',   type: 'pvt', est: 1992, score: 93, desc: 'Affiliated with University of Dhaka. First private medical college located in a rural setting, offering unmatched community medicine exposure.', img: 'college/jahurul_islam.jpg' },
  { name: "Z.H. Sikder Women's Medical College & Hospital",       location: 'Dhaka',                   type: 'pvt', est: 1992, score: 92, desc: 'Affiliated with University of Dhaka. Dedicated to providing medical education exclusively for women with a rich clinical hospital.', img: 'college/zh_sikder.jpg' },
  { name: 'TMSS Medical College & Rafatullah Community Hospital', location: 'Bogura',                  type: 'pvt', est: 2008, score: 91, desc: 'Affiliated with Bangladesh Medical University (formerly Rajshahi Medical University). Premier private medical college in northern Bangladesh.', img: 'college/tmss.jpg' },
  { name: 'Mainamoti Medical College & Hospital',                 location: 'Cumilla',                 type: 'pvt', est: 2011, score: 90, desc: 'Affiliated with Chattogram Medical University. Dedicated to providing qualitative medical education and care.', img: 'college/mainamoti.jpg' },
  { name: 'Ad-Din Akij Medical College Hospital',                 location: 'Khulna',                  type: 'pvt', est: 2013, score: 89, desc: 'Affiliated with Bangladesh Medical University (formerly Rajshahi Medical University). Modern campus and well-equipped teaching hospital.', img: 'college/ad_din_akij.jpg' },
  { name: 'Prime Medical College Hospital',                       location: 'Rangpur',                 type: 'pvt', est: 2008, score: 88, desc: 'Affiliated with Bangladesh Medical University (formerly Rajshahi Medical University). Excellent academic atmosphere and clinical teaching.', img: 'college/prime_medical.jpg' },
  { name: 'Rangpur Community Medical College',                    location: 'Rangpur',                 type: 'pvt', est: 2008, score: 87, desc: 'Affiliated with Bangladesh Medical University (formerly Rajshahi Medical University). Highly chosen by international medical students.', img: 'college/rangpur_community.jpg' },
  { name: 'North Bengal Medical College',                         location: 'Sirajganj',               type: 'pvt', est: 2000, score: 86, desc: 'Affiliated with University of Rajshahi. Established pioneer medical college in the Sirajganj region.', img: 'college/north_bengal.jpg' },
  { name: 'Jalalabad Ragib-Rabeya Medical College & Hospital',    location: 'Sylhet',                  type: 'pvt', est: 1995, score: 85, desc: 'Affiliated with Shahjalal University of Science & Technology. Exceptional medical campus in the scenic city of Sylhet.', img: 'college/jalalabad_ragib.jpg' },
  { name: 'Park View Medical College Hospital',                   location: 'Sylhet',                  type: 'pvt', est: 2013, score: 84, desc: 'Affiliated with Shahjalal University of Science & Technology. High clinical patient flow and modern diagnostic facilities.', img: 'college/park_view.jpg' },
  { name: 'Dhaka National Medical College',                       location: 'Dhaka',                   type: 'pvt', est: '1925', score: 83, desc: 'Affiliated with University of Dhaka. Rich historical legacy and highly popular among international medical aspirants.', img: 'college/dhaka_national.webp' },
  { name: 'Popular Medical College',                              location: 'Dhanmondi, Dhaka',        type: 'pvt', est: 2010, score: 82, desc: 'Affiliated with University of Dhaka. Situated in the heart of Dhaka with prestigious medical infrastructure.', img: 'college/popular_medical.webp' },
  { name: 'Delta Medical College & Hospital',                     location: 'Mirpur, Dhaka',           type: 'pvt', est: 2006, score: 81, desc: 'Affiliated with University of Dhaka. Specializes in advanced clinical learning, oncology, and general healthcare training.', img: 'college/delta_medical.jpg' },
  { name: 'Monno Medical College & Hospital',                     location: 'Manikganj',               type: 'pvt', est: 2011, score: 80, desc: 'Affiliated with University of Dhaka. Beautiful eco-friendly campus with extensive clinical training facilities.', img: 'college/monno_medical.jpg' },
  { name: 'BGC Trust Medical College',                            location: 'Chattogram',              type: 'pvt', est: 2002, score: 79, desc: 'Affiliated with Chittagong Medical University. Focused on high-quality academic environment and extensive clinical hospital training.', img: 'college/bgc_trust.jpg' },
  { name: 'Bangladesh Medical College',                           location: 'Dhanmondi, Dhaka',        type: 'pvt', est: 1986, score: 78, desc: 'Affiliated with University of Dhaka. First private medical college in Bangladesh with excellent academic records.', img: 'college/bangladesh_medical.png' }
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

function LandingPage() {
  const navigate = useNavigate();

  // Basic States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Hero Slider
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderImages = [
    { img: 'bannerimage/dmch_lab.jpg', title: 'Dhaka Medical College (DMCH)' },
    { img: 'bannerimage/ssmc_lab.png', title: 'Sir Salimullah Medical College (SSMC)' },
    { img: 'bannerimage/doctor-2-1-1.jpg', title: 'Senior Student Mentorship' }
  ];

  // custom select dropdown
  const [countryTriggerOpen, setCountryTriggerOpen] = useState(false);

  // FAQ Accordion
  const [faqOpen, setFaqOpen] = useState(null);

  // YouTube Lazy Load States
  const [activeVideos, setActiveVideos] = useState({});

  // Search Colleges
  const [collegeSearch, setCollegeSearch] = useState('');

  // 2-Step Form Wizard States
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    name: '', email: '', phone: '', country: '', neetScore: '', query: '',
    c10Sub1Name: 'English', c10Sub1Mark: '',
    c10Sub2Name: 'Mathematics', c10Sub2Mark: '',
    c10Sub3Name: 'Science', c10Sub3Mark: '',
    c10Sub4Name: 'Social Science', c10Sub4Mark: '',
    c10Sub5Name: 'Second Language', c10Sub5Mark: '',
    c12Sub1Mark: '', c12Sub2Mark: '', c12Sub3Mark: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCollege, setModalCollege] = useState(null);
  const [modalFormValues, setModalFormValues] = useState({
    name: '', email: '', phone: '', program: '', Score: '', location: ''
  });
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Stats Counters
  const [counterStudents, setCounterStudents] = useState(0);
  const [counterColleges, setCounterColleges] = useState(0);
  const [counterRatio, setCounterRatio] = useState(0);

  useEffect(() => {
    // Dismiss Splash Loader
    const splashTimer = setTimeout(() => {
      setSplashVisible(false);
    }, 1900);

    // Scroll listener for sticky navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Auto Hero Image Slider
    const sliderTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % sliderImages.length);
    }, 5000);

    // Counter anim triggers
    const animateCounters = () => {
      let currentValS = 0;
      let currentValC = 0;
      let currentValR = 0;
      const interval = setInterval(() => {
        let done = true;
        if (currentValS < 8500) { currentValS += 250; setCounterStudents(Math.min(currentValS, 8500)); done = false; }
        if (currentValC < 50) { currentValC += 2; setCounterColleges(Math.min(currentValC, 50)); done = false; }
        if (currentValR < 97) { currentValR += 3; setCounterRatio(Math.min(currentValR, 97)); done = false; }
        if (done) clearInterval(interval);
      }, 30);
    };
    animateCounters();

    return () => {
      clearTimeout(splashTimer);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(sliderTimer);
    };
  }, []);

  // GPA Live Calculations
  const getGradePoint = (mark) => {
    const m = parseFloat(mark);
    if (m >= 80) return 5.0;
    if (m >= 70) return 4.0;
    if (m >= 60) return 3.5;
    if (m >= 50) return 3.0;
    if (m >= 40) return 2.0;
    if (m >= 25) return 1.0;
    return 0.0;
  };

  const calculateC10Gpa = () => {
    const m1 = parseFloat(formValues.c10Sub1Mark);
    const m2 = parseFloat(formValues.c10Sub2Mark);
    const m3 = parseFloat(formValues.c10Sub3Mark);
    const m4 = parseFloat(formValues.c10Sub4Mark);
    const m5 = parseFloat(formValues.c10Sub5Mark);

    if (isNaN(m1) || isNaN(m2) || isNaN(m3) || isNaN(m4) || isNaN(m5)) return '0.00';
    const totalGP = getGradePoint(m1) + getGradePoint(m2) + getGradePoint(m3) + getGradePoint(m4) + getGradePoint(m5);
    return (totalGP / 5.0).toFixed(2);
  };

  const calculateC12Gpa = () => {
    const m1 = parseFloat(formValues.c12Sub1Mark);
    const m2 = parseFloat(formValues.c12Sub2Mark);
    const m3 = parseFloat(formValues.c12Sub3Mark);

    if (isNaN(m1) || isNaN(m2) || isNaN(m3)) return '0.00';
    const totalGP = getGradePoint(m1) + getGradePoint(m2) + getGradePoint(m3);
    return (totalGP / 3.0).toFixed(2);
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNextStep = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = 'Please enter your full name.';
    if (!formValues.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formValues.phone.trim()) errors.phone = 'Please enter your phone number.';
    if (!formValues.country.trim()) errors.country = 'Please select your state/location.';
    if (!formValues.neetScore.trim()) {
      errors.neetScore = 'Please enter your NEET score.';
    } else {
      const score = parseInt(formValues.neetScore);
      if (isNaN(score) || score < 0 || score > 720) {
        errors.neetScore = 'NEET score must be between 0 and 720.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setStep(2);
    document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Additional validations for step 2 marks
    const errors = {};
    const marksFields = [
      'c10Sub1Mark', 'c10Sub2Mark', 'c10Sub3Mark', 'c10Sub4Mark', 'c10Sub5Mark',
      'c12Sub1Mark', 'c12Sub2Mark', 'c12Sub3Mark'
    ];

    marksFields.forEach(field => {
      const mark = parseFloat(formValues[field]);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        errors[field] = 'Marks must be between 0 and 100';
      }
    });

    if (!formValues.passYear) {
      errors.passYear = 'Please select your passing year.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formValues,
        location: formValues.country,
        c10Gpa: parseFloat(calculateC10Gpa()),
        c12Gpa: parseFloat(calculateC12Gpa()),
        biologyMarks: parseFloat(formValues.c12Sub3Mark)
      };

      const res = await axios.post('/api/leads/check-eligibility', payload);
      if (res.data.success) {
        // Track Conversion in Google Tag Manager (GTM)
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'generate_lead',
            event_category: 'Eligibility Form',
            lead_name: formValues.name,
            lead_email: formValues.email
          });

          // Track Conversion in OpenAI Ads Manager
          if (typeof window.oaiq === 'function') {
            window.oaiq('measure', 'lead_created', {
              type: 'customer_action'
            });
          }
        }

        navigate('/thank-you', { state: res.data.data });
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal Inquiry Form Submit
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!modalFormValues.name || !modalFormValues.email || !modalFormValues.location) {
      setModalError('Please fill in all mandatory fields.');
      return;
    }

    setModalSubmitting(true);

    try {
      // Direct Google Apps Script submit replacement (submits inquiry to MongoDB/backend route)
      const res = await axios.post('/api/submit', {
        name: modalFormValues.name,
        email: modalFormValues.email,
        phone: modalFormValues.phone || 'N/A',
        passYear: modalFormValues.program || 'N/A',
        neetScore: parseInt(modalFormValues.Score) || 0,
        country: modalFormValues.location,
        query: `Inquiry for ${modalCollege?.name}`
      });

      if (res.data.status === 'success') {
        // Track Conversion in Google Tag Manager (GTM)
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'generate_lead',
            event_category: 'Modal Inquiry',
            lead_name: modalFormValues.name,
            lead_email: modalFormValues.email
          });

          // Track Conversion in OpenAI Ads Manager
          if (typeof window.oaiq === 'function') {
            window.oaiq('measure', 'lead_created', {
              type: 'customer_action'
            });
          }
        }
        setModalSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setModalSuccess(false);
          setModalFormValues({ name: '', email: '', phone: '', program: '', Score: '', location: '' });
        }, 2200);
      }
    } catch (err) {
      setModalError('Something went wrong. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleCollegeCardClick = (college) => {
    setModalCollege(college);
    setModalOpen(true);
  };

  const filteredColleges = collegesSearch => {
    const q = collegeSearch.toLowerCase().trim();
    if (!q) return COLLEGES;
    return COLLEGES.filter(c =>
      c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    );
  };

  const currentColleges = filteredColleges();

  return (
    <div style={{ background: '#ffffff', color: '#1f2937' }}>
      {/* ══════════════════ SPLASH LOADER ══════════════════ */}
      {splashVisible && (
        <div id="splash">
          <div className="splash-orbit"></div>
          <div className="splash-orbit splash-orbit-2"></div>
          <div className="splash-logo">
            <img src="Aspiringlife10.png" alt="Logo" />
          </div>
          <p className="splash-tagline">Your MBBS Journey &nbsp;·&nbsp; Starts Here</p>
          <div className="splash-bar-track">
            <div className="splash-bar-fill"></div>
          </div>
        </div>
      )}

      {/* PAGE TRANSITION CURTAIN */}
      <div id="curtain"></div>

      {/* ══════════════════ NAV ══════════════════ */}
      <header className={`nav reveal in ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav__inner">
          <a href="#" className="nav__logo">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDvk0PhpvnmubiTsg7LcN4AdnVV2GPVPijN2sy8lvueQ&s=10" 
              alt="Aspiring Logo"
              className="nav__logo-img"
            />
          </a>
          <nav className="nav__links">
            <a href="#features">Why Us</a>
            <a href="#hero-form">Eligibility Check</a>
           
            <a href="#colleges">BD Colleges</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#stories">Real Stories</a>
           
            <Link to="/admin-login">Admin Login</Link>
            <a href="tel:+919051773700" className="nav__phone-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +91 90517 73700
            </a>
          </nav>

          <button className={`nav__hamburger ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="nav__mobile open" id="mobileMenu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Why Us</a>
            <a href="#hero-form" onClick={() => setMobileMenuOpen(false)}>Eligibility Check</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#colleges" onClick={() => setMobileMenuOpen(false)}>BD Colleges</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)}>Real Stories</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>MBBS Bangladesh</a>
            <a href="#hero-form" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Free Counseling</a>
            <a href="tel:+919051773700" style={{ marginTop: '15px', color: '#2563eb', border: '1.5px solid #2563eb', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +91 90517 73700
            </a>
          </div>
        )}
      </header>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hero" id="home">
        <div className="hero__dot-grid"></div>
        <div className="hero__inner">
          {/* Left copy */}
          <div className="reveal in" style={{ transitionDelay: '.15s' }}>
            <div className="hero__badge">
              <span className="hero__badge-dot"></span>
              2026-27 Admissions Open — 500+ Students Enrolled This Year
            </div>
            <h1 className="hero__title">
              Study MBBS in<br />
              <span>Bangladesh</span>
            </h1>
            <p className="hero__sub">
              Aspiring Life is Bangladesh's most trusted MBBS consultancy. We guide students from admission to graduation — in Bangladesh, Russia, China, Nepal &amp; more.
            </p>
            <div className="hero__cta-wrap">
              <a href="#hero-form" className="btn-primary hero__cta-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Free Consultation
              </a>
            </div>
          </div>

          {/* RIGHT: DOCTOR IMAGE SLIDER */}
          <div className="hero__image-wrap reveal in" style={{ transitionDelay: '.32s' }}>
            <div className="hero__image-bg-shape"></div>
            <div className="hero__deco hero__deco--1">🩺</div>
            <div className="hero__deco hero__deco--2">❇️</div>

            <div className="hero__slider">
              <div className="slider__dots">
                {sliderImages.map((_, i) => (
                  <span key={i} className={`slider__dot ${activeSlide === i ? 'active' : ''}`} onClick={() => setActiveSlide(i)}></span>
                ))}
              </div>

              <button className="slider__btn slider__btn--prev" onClick={() => setActiveSlide(prev => (prev - 1 + sliderImages.length) % sliderImages.length)} aria-label="Previous Slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="slider__btn slider__btn--next" onClick={() => setActiveSlide(prev => (prev + 1) % sliderImages.length)} aria-label="Next Slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <div className="slider__slides">
                {sliderImages.map((slide, i) => (
                  <div key={i} className={`slider__slide ${activeSlide === i ? 'active' : ''}`}>
                    <img src={slide.img} className="slider__img" alt={slide.title} />
                    <div className="slider__caption"><span className="caption__status-dot"></span>{slide.title}</div>
                  </div>
                ))}
              </div>

              <div className="slider__badge">
                <div className="slider__badge-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div className="slider__badge-text">
                  <strong>10+</strong>
                  <span>Years Exp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BELOW GRID: CHECK CARDS & SOCIAL PROOF */}
        <div className="hero__below-grid reveal in" style={{ transitionDelay: '.38s' }}>
          <div className="hero__checks">
            <div className="hero__check-card">
              <div className="hero__check-icon hero__check-icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <strong>Free Counseling</strong>
            </div>
            <div className="hero__check-card">
              <div className="hero__check-icon hero__check-icon--red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <strong>WHO &amp; BDMC Approved</strong>
            </div>
            <div className="hero__check-card">
              <div className="hero__check-icon hero__check-icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <strong>Scholarship Available</strong>
            </div>
          </div>

          <div className="hero__social-proof">
            <div className="hero__avatars">
              <img src="https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2" alt="student" />
              <img src="https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2" alt="student" />
              <img src="https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2" alt="student" />
              <img src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2" alt="student" />
            </div>
            <div>
              <span className="hero__stars">★★★★★</span>
              <p className="hero__rating-text">4.9 / 5 from 1,800+ student reviews</p>
            </div>
          </div>
        </div>

        {/* BOTTOM: HORIZONTAL COUNSELING FORM WIZARD */}
        <div className="hero__form-card hero__form-card--horizontal reveal in" style={{ transitionDelay: '.4s' }} id="hero-form">
          <div className="form-card-header">
            <span className="form-badge-pill"><span className="form-badge-dot"></span>Free Counseling &amp; Eligibility Report</span>
            <h2>Check Your Eligibility for MBBS in Bangladesh 2026</h2>
            <p>Complete your 2-step evaluation to calculate your admission GPA &amp; receive your official PDF report instantly.</p>
          </div>

          <div id="heroFormWrap">
            {/* 2-Step Progress Indicator Bar */}
            <div className="form-step-progress">
              <div className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-num">{step > 1 ? '✓' : '1'}</span>
                <span className="step-text">Basic Details</span>
              </div>
              <div className="step-line-bar">
                <div className="step-line-fill" style={{ width: step === 1 ? '0%' : '100%' }}></div>
              </div>
              <div className={`step-item ${step === 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-text">Eligibility Check</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="form-step-panel active">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="hName">Full Name <span className="req">*</span></label>
                      <input 
                        className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                        type="text" 
                        id="hName" 
                        name="name" 
                        value={formValues.name}
                        onChange={handleInputChange}
                        placeholder="Your Full Name" 
                        required 
                      />
                      {formErrors.name && <div className="el-error-msg">{formErrors.name}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="hEmail">Email Address <span className="req">*</span></label>
                      <input 
                        className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                        type="email" 
                        id="hEmail" 
                        name="email" 
                        value={formValues.email}
                        onChange={handleInputChange}
                        placeholder="you@gmail.com" 
                        required 
                      />
                      {formErrors.email && <div className="el-error-msg">{formErrors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="hPhone">Phone / WhatsApp <span className="req">*</span></label>
                      <input 
                        className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                        type="tel" 
                        id="hPhone" 
                        name="phone" 
                        value={formValues.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXXXXXXX"
                        required
                      />
                      {formErrors.phone && <div className="el-error-msg">{formErrors.phone}</div>}
                    </div>

                    {/* custom State/Location select */}
                    <div className="form-group">
                      <label>Location / State <span className="req">*</span></label>
                      <div className="custom-select-wrapper">
                        <div className="custom-select-trigger" onClick={() => setCountryTriggerOpen(!countryTriggerOpen)}>
                          <span className={!formValues.country ? 'select-placeholder' : ''}>
                            {formValues.country || 'Select a state...'}
                          </span>
                          <span className="custom-select-arrow">▼</span>
                        </div>
                        {countryTriggerOpen && (
                          <div className="custom-select-options" style={{ display: 'block' }}>
                            {STATES.map((state, i) => (
                              <div
                                key={i}
                                className={`custom-option ${formValues.country === state ? 'selected' : ''}`}
                                onClick={() => {
                                  setFormValues(prev => ({ ...prev, country: state }));
                                  setFormErrors(prev => ({ ...prev, country: '' }));
                                  setCountryTriggerOpen(false);
                                }}
                              >
                                {state}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formErrors.country && <div className="el-error-msg">{formErrors.country}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="hNeetScore">NEET Score <span className="req">*</span></label>
                      <input 
                        className={`form-input ${formErrors.neetScore ? 'input-error' : ''}`}
                        type="number" 
                        id="hNeetScore" 
                        name="neetScore"
                        value={formValues.neetScore}
                        onChange={handleInputChange}
                        placeholder="Enter your NEET score"
                        min="0"
                        max="720"
                        required
                      />
                      {formErrors.neetScore && <div className="el-error-msg">{formErrors.neetScore}</div>}
                    </div>

                    <div className="form-group form-group--textarea">
                      <label htmlFor="hinfo">How Can I Help You?</label>
                      <textarea
                        className="form-input"
                        id="hinfo"
                        name="query"
                        value={formValues.query}
                        onChange={handleInputChange}
                        placeholder="Write your questions or notes..."
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="form-group form-group--submit-center" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                      <button type="button" className="btn-submit btn-next-step" onClick={handleNextStep}>
                        Next: Eligibility Check &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="form-step-panel">
                  <div className="form-grid">
                    {/* Class 10 - 5 Subjects */}
                    <div className="c10-calculator-wrapper">
                      <div className="c10-header">
                        <div className="c10-title">
                          <span>Class 10 Subject Marks (5 Subjects) <span className="req">*</span></span>
                          <span className="c10-subtitle">Enter subject marks for automatic GPA calculation</span>
                        </div>
                        <div className="auto-gpa-badge has-gpa">
                          Calculated GPA: <strong>{calculateC10Gpa()}</strong> / 5.0
                        </div>
                      </div>

                      <div className="c10-subjects-grid">
                        {[1, 2, 3, 4, 5].map(i => {
                          const subNameKey = `c10Sub${i}Name`;
                          const subMarkKey = `c10Sub${i}Mark`;
                          return (
                            <div key={i} className="c10-subject-row">
                              <input
                                type="text"
                                className="c10-sub-name"
                                name={subNameKey}
                                value={formValues[subNameKey]}
                                onChange={handleInputChange}
                                placeholder={`Subject ${i}`}
                              />
                              <div className="input-with-suffix">
                                <input
                                  type="number"
                                  className={`c10-sub-mark ${formErrors[subMarkKey] ? 'input-error' : ''}`}
                                  name={subMarkKey}
                                  value={formValues[subMarkKey]}
                                  onChange={handleInputChange}
                                  placeholder="Marks (0-100)"
                                  min="0"
                                  max="100"
                                />
                                <span className="suffix">/ 100</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Class 12 - 3 Subjects (PCB) */}
                    <div className="c12-calculator-wrapper">
                      <div className="c12-header">
                        <div className="c12-title">
                          <span>Class 12 PCB Subject Marks (3 Subjects) <span className="req">*</span></span>
                          <span className="c12-subtitle">Enter Physics, Chemistry &amp; Biology marks for automatic GPA calculation</span>
                        </div>
                        <div className="auto-gpa-badge has-gpa">
                          Calculated Class 12 GPA: <strong>{calculateC12Gpa()}</strong> / 5.0
                        </div>
                      </div>

                      <div className="c12-subjects-grid">
                        {['Physics', 'Chemistry', 'Biology'].map((sub, idx) => {
                          const subMarkKey = `c12Sub${idx + 1}Mark`;
                          return (
                            <div key={idx} className="c12-subject-row">
                              <input type="text" className="c12-sub-name" value={sub} readOnly />
                              <div className="input-with-suffix">
                                <input
                                  type="number"
                                  className={`c12-sub-mark ${formErrors[subMarkKey] ? 'input-error' : ''}`}
                                  name={subMarkKey}
                                  value={formValues[subMarkKey]}
                                  onChange={handleInputChange}
                                  placeholder={`${sub} Marks (0-100)`}
                                  min="0"
                                  max="100"
                                />
                                <span className="suffix">/ 100</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Passing Year */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="hPassYear">Class 12 Passing Year <span className="req">*</span></label>
                      <select
                        className={`form-input ${formErrors.passYear ? 'input-error' : ''}`}
                        id="hPassYear"
                        name="passYear"
                        value={formValues.passYear}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                      </select>
                      {formErrors.passYear && <div className="el-error-msg">{formErrors.passYear}</div>}
                    </div>

                    {/* Submit & Back Buttons */}
                    <div className="step-nav-wrap" style={{ gridColumn: '1 / -1' }}>
                      <button type="button" className="btn-prev-step" onClick={handlePrevStep}>
                        &larr; Back to Details
                      </button>
                      <button className="btn-submit btn-submit-final" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Generating Report...' : 'Submit & Get PDF Report ✓'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {submitError && (
            <p className="form-error" style={{ display: 'block' }}>
              {submitError}
            </p>
          )}

          <p className="form-note">
            No fees. No commitment. A counselor will call you within 24 hours.
          </p>
        </div>

        <div className="hero__scroll">
          <span>scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ══════════════════ FEATURES SHOWCASE ══════════════════ */}
      <section className="features-showcase-section" id="features">
        <div className="features-showcase-header container">
          <span className="badge badge--blue">Why AspiringLife in Bangladesh</span>
          <h2>Why choose us for MBBS in Bangladesh?</h2>
          <p>Indian students decide pursuing MBBS in Bangladesh because of the familiar environment, English medium of teaching and the straightforward budget without any hidden surprises.</p>
        </div>

        <div className="features-showcase-container container">
          <div className="features-showcase-left">
            <div className="showcase-item">
              <div className="showcase-num">01</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <div className="showcase-body">
                <h3>MBBS Counselling by Expert</h3>
                <p>Get personalized guidance from experienced MBBS admission experts. Maximize your chances of securing admission to the best medical colleges.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-num">02</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div className="showcase-body">
                <h3>Guidance to Choose the Right College</h3>
                <p>Compare colleges based on rankings, fees, and career opportunities. Make informed decisions that match your goals and budget.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-num">03</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div className="showcase-body">
                <h3>Pre-Orientation Classes</h3>
                <p>Prepare for your medical journey with expert-led orientation sessions. Gain confidence before starting your academic life abroad.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-num">04</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="showcase-body">
                <h3>Loan Assistance</h3>
                <p>Receive end-to-end support in securing education loans with ease. Explore flexible financing options from trusted banking partners.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-num">05</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <div className="showcase-body">
                <h3>Visa Assistance</h3>
                <p>Get complete guidance for a smooth and hassle-free visa application process. Our experts help you with documentation and interview preparation.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-num">06</div>
              <div className="showcase-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="showcase-body">
                <h3>24×7 Local Support</h3>
                <p>Enjoy round-the-clock assistance whenever you need help abroad. Dedicated local support ensures a safe and comfortable student experience.</p>
              </div>
            </div>
          </div>

          <div className="features-showcase-right">
            <div className="features-animated-image">
              <div className="glow-circle glow-circle-1"></div>
              <div className="glow-circle glow-circle-2"></div>
              <div className="image-frame-container">
                <img src="group-of-doctors.png" alt="Doctors Support Team" className="ai-doctors-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="section" id="testimonials">
        <div className="section-header">
          <span className="badge badge--amber">Success Stories</span>
          <h2>Success Stories from Google Reviews</h2>
          <p>Read honest experiences from Indian medical aspirants who secured their MBBS seats in top Bangladesh medical colleges with our guidance.</p>
          <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(0,0,0,0.03)', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, border: '1px solid #e2e8f0' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Rated 4.9/5 based on verified Google Reviews</span>
            <span style={{ color: '#fbbf24' }}>★★★★★</span>
          </div>
        </div>

        <div className="testimonials-grid container">
          {[
            { stars: '★★★★★', name: 'Mohammed Safique', img: 'review1.png', text: 'Earlier in April2024 I did Apostle for UAE attestation. Thanks Tamal.' },
            { stars: '★★★★★', name: 'sarfraz', img: 'review2.png', text: '"Excellent services, no hidden charges, everything transparent, full support, even during illness of student, they provided light food Dalia to student."' },
            { stars: '★★★★★', name: 'Prasenjit Dhara', img: 'review3.png', text: '"Really good service. I did apostille for Norway. They are really helpful. I would recommend you for getting your documents apostilled."' },
            { stars: '★★★★★', name: 'Nataasha Ray', img: 'nataasha_profile.png', text: '"Medical in Bangladesh doing is very much satisfying and by the help of aspiring life consultancy it is very much helpful and I\'m very much greatful by there help"' },
            { stars: '★★★★★', name: 'RAJDEEP ROY', img: 'rajdeep_profile.png', text: '"KINDLY CONTACT ME FOR FOREIGN EXCHANGE AND TUITION FEE TRANSFER."' },
            { stars: '★★★★★', name: 'Kazi Lailatul Islam', img: 'kazi_profile.png', text: '"It\'s a very good educational consultancy in india. Too much supporting. Basically i prefer this because of they have a regional office in bangladesh."' }
          ].map((testi, idx) => (
            <div key={idx} className="testi-card" style={{ border: '1px solid rgba(66, 133, 244, 0.15)', background: 'rgba(66, 133, 244, 0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="testi-stars" style={{ color: '#fbbf24' }}>{testi.stars}</div>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </div>
              <p className="testi-text" style={{ color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6, marginTop: '12px', fontSize: '13px' }}>{testi.text}</p>
              <div className="testi-author" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={testi.img} alt={testi.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#111827' }}>{testi.name}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ REAL STORIES ══════════════════ */}
      <section className="section section--alt" id="stories">
        <div className="section-header">
          <span className="badge badge--green">Why Study MBBS in Bangladesh?</span>
          <h2>Benefits of Studying MBBS in Bangladesh</h2>
          <p>Discover why thousands of students choose Bangladesh for their medical degree — affordable fees, world-class hospitals, and globally recognised qualifications.</p>
        </div>

        {/* Featured Video */}
        <div className="stories-feat">
          <div className="stories-feat-video">
            {activeVideos['GXaGuEZm_W4'] ? (
              <iframe
                src="https://www.youtube.com/embed/GXaGuEZm_W4?autoplay=1&rel=0&enablejsapi=1"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              ></iframe>
            ) : (
              <div 
                className="story-thumb-overlay" 
                style={{ backgroundImage: "url('https://img.youtube.com/vi/GXaGuEZm_W4/maxresdefault.jpg')" }}
                onClick={() => setActiveVideos(prev => ({ ...prev, 'GXaGuEZm_W4': true }))}
              >
                <div className="story-play-btn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="stories-feat-body">
            <span className="stories-feat-badge">
              <svg width="8" height="8" viewBox="0 0 8 8" style={{ marginRight: '5px' }}>
                <circle cx="4" cy="4" r="4" fill="currentColor"/>
              </svg>
              Top Pick
            </span>
            <div className="stories-feat-title">
              💰🎓 Top 4 Medical Colleges in Bangladesh Under 35 Lacs! 😱
            </div>
            <div className="stories-feat-desc">
              We reveal the Top 4 Medical Colleges in Bangladesh where you can pursue your MBBS degree for an incredible total package of under 35 Lacs INR! This is a complete breakdown that every aspiring medical student and parent needs to see.
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="stories-grid">
          {[
            { id: 'mtY4e5zPcvY', title: 'MBBS in Bangladesh Reality by Tamil Nadu Student', desc: 'Did you know that some states are completely CLOSED, while OPEN states like Uttar Pradesh, Kerala, and Karnataka offer private colleges with varying budgets? Or look at options like Bangladesh with identical syllabi and top clinical exposure.' },
            { id: '_borwpmVYTo', title: 'NEET Struggles to FMGE Success - Doctor from Bangladesh', desc: 'Are you stressed about NEET results? Watch the journey of Dr. Sweta Sharma who turned her NEET score into success by studying at Dhaka National Medical College, cracking FMGE on her first attempt.' },
            { id: 'UuJWfpQ3DKI', title: 'Is MBBS in Bangladesh Worth It? Mumbai Student Journey', desc: 'Dr. Rohit shares his raw and honest experience, from moving abroad to mastering 19 subjects. He debunks myths and explains why the clinical exposure in Bangladesh is outstanding.' }
          ].map((story, i) => (
            <div key={i} className="story-card">
              <div className="story-video-wrap">
                {activeVideos[story.id] ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${story.id}?autoplay=1&rel=0&enablejsapi=1`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  ></iframe>
                ) : (
                  <div 
                    className="story-thumb-overlay"
                    style={{ backgroundImage: `url('https://img.youtube.com/vi/${story.id}/maxresdefault.jpg')` }}
                    onClick={() => setActiveVideos(prev => ({ ...prev, [story.id]: true }))}
                  >
                    <div className="story-play-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="story-body">
                <div className="story-author">
                  <div className="story-avatar">{i === 0 ? '📊' : i === 1 ? '🏥' : '👩‍⚕️'}</div>
                  <div className="story-author-info">
                    <strong>MBBS Guide</strong>
                    <span>Bangladesh Medical Journey</span>
                  </div>
                </div>
                <div className="story-title">{story.title}</div>
                <div className="story-desc">{story.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ ELIGIBILITY CRITERIA ══════════════════ */}
      <section className="eligibility-section">
        <div className="eligibility-container">
          <h2>Eligibility Criteria for <span>MBBS Admission in Bangladesh</span></h2>
          <p className="intro">Students applying for an MBBS program in Bangladesh must meet the following eligibility requirements to be considered for admission:</p>
          <div className="eligibility-points-list">
            {[
              { title: 'Age Limit', desc: 'The applicant must be at least 17 years of age at the time of admission.' },
              { title: 'Compulsory Subjects', desc: 'Must have completed 10+2 (Class 12) with Physics, Chemistry, and Biology (PCB) as compulsory subjects.' },
              { title: 'Aggregate Marks', desc: 'A minimum of 60% aggregate marks in PCB is required.' },
              { title: 'Academic Gap', desc: 'There should not be more than a one-year gap after completing Class 12.' },
              { title: 'Minimum GPA Requirement', desc: 'Candidates must have obtained a minimum GPA of 3.50 in both Class 10 and Class 12 examinations.' },
              { title: 'Biology Marks', desc: 'A minimum of 70% marks in Biology is mandatory.' },
              { title: 'NEET Exam Qualification', desc: 'Indian students must have qualified the NEET-UG examination as per the latest NMC guidelines.' }
            ].map((pt, i) => (
              <div key={i} className="eligibility-point-item">
                <div className="point-marker">
                  <div className="point-dot"></div>
                  <div className="point-pulse"></div>
                </div>
                <div className="point-content">
                  <h3>{pt.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: pt.desc }}></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ DOCUMENTS CHECKLIST ══════════════════ */}
      <section className="docs-checklist-section">
        <div className="docs-checklist-container">
          <div className="docs-checklist-header">
            <span className="badge badge--blue">Required Checklist</span>
            <h2>Documents Required for MBBS Admission in Bangladesh</h2>
            <p className="docs-checklist-intro">To make your admission process smooth and hassle-free, keep the following documents ready:</p>
          </div>
          <div className="docs-checklist-layout">
            <div className="docs-checklist-left">
              <div className="docs-checklist-banner-card">
                <img src="document-requirement.png" alt="Document Requirement" />
                <div className="image-overlay-text">
                  <span>Aspiring Life Support</span>
                  <h3>Direct Guidance for Indian Students</h3>
                </div>
              </div>
            </div>
            <div className="docs-checklist-right">
              <div className="docs-checklist-grid">
                {[
                  { title: 'Class 10 Mark Sheet', desc: 'Original board examination marksheet and Passing Certificate.' },
                  { title: 'Class 12 Mark Sheet', desc: 'Class 12 board exam original marksheet and certificate.' },
                  { title: 'Valid Passport', desc: 'Must have a validity of at least one year from the date of application.' },
                  { title: 'Aadhaar Card Copy', desc: 'Clean photocopy of student\'s valid Aadhaar Card.' },
                  { title: 'NEET Scorecard', desc: 'Copy of qualified NEET UG scorecard as per NMC regulations.' },
                  { title: '10 Photographs', desc: 'White background, 70% face coverage (Size: 3.5 × 4.5 cm).' }
                ].map((doc, idx) => (
                  <div key={idx} className="docs-checklist-card">
                    <div className="docs-checklist-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="docs-checklist-content">
                      <h3>{doc.title}</h3>
                      <p>{doc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ COLLEGES CATALOG ══════════════════ */}
      <section className="section" id="colleges">
        <div className="section-header">
          <span className="badge badge--blue">Bangladesh</span>
          <h2>Top Colleges in Bangladesh</h2>
          <p>Click any card to apply or request information from that institution.</p>
        </div>

        <div className="colleges-wrap">
          <div className="colleges-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              className="colleges-search-input" 
              type="text" 
              placeholder="Search by college name or location…" 
              value={collegeSearch}
              onChange={(e) => setCollegeSearch(e.target.value)}
            />
          </div>

          <div className="colleges-grid-container">
            {currentColleges.length > 0 ? (
              <div className="colleges-grid">
                {currentColleges.map((c, i) => {
                  const origIdx = COLLEGES.indexOf(c);
                  return (
                    <div key={i} className="college-card" onClick={() => handleCollegeCardClick(c)}>
                      <div className="col-img-wrap">
                        <img className="col-card-img" src={`${c.img}`} alt={c.name} />
                        <span className="col-card-rank">#{origIdx + 1}</span>
                        <span className={`col-card-badge col-badge col-badge--${c.type}`}>
                          {c.type === 'pvt' ? 'Private' : 'Govt.'}
                        </span>
                      </div>
                      <div className="col-card-content">
                        <h3 className="col-card-title">{c.name}</h3>
                        <p className="col-card-desc">{c.desc}</p>
                        <div className="col-card-meta">
                          <span>📍 {c.location}</span>
                          <span>📅 Estd: {c.est}</span>
                        </div>
                        <button className="col-apply-btn btn-full-width" onClick={(e) => { e.stopPropagation(); handleCollegeCardClick(c); }}>
                          Apply Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="col-no-results">No colleges match your search.</div>
            )}
          </div>

          <div className="colleges-footer">
            <span>Showing {currentColleges.length} colleges found</span>
            <span>Click a card or "Apply Now" to open the inquiry form</span>
          </div>
        </div>
      </section>

      {/* ══════════════════ ADMISSION PROCESS ══════════════════ */}
      <section className="admission-process">
        <div className="process-container">
          <div className="process-header">
            <h2>MBBS in Bangladesh – Your Admission Journey</h2>
            <p>Complete guidance and support for Indian students at every step of the admission process.</p>
          </div>
          <div className="process-grid">
            {[
              { num: '01', title: 'Check Your Eligibility', desc: 'We review your NEET qualification, 10+2 marks, and basic documents to confirm eligibility.' },
              { num: '02', title: 'Choose the Right College', desc: 'Based on budget and preference, we help you select the best medical college for your future.' },
              { num: '03', title: 'Submit Your Application', desc: 'Our team helps you prepare and submit all required documents smoothly.' },
              { num: '04', title: 'Receive Admission Letter', desc: 'Once approved, you\'ll receive your admission offer and pay tuition fees.' },
              { num: '05', title: 'Visa & Travel Support', desc: 'From visa documentation to travel planning, we stay with you until departure.' }
            ].map((step, i) => (
              <div key={i} className="process-card">
                <div className="step">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className="section" id="faq">
        <div className="section-header">
          <span className="badge badge--slate">FAQ</span>
          <h2>Common questions about MBBS admission</h2>
        </div>
        <div className="faq-list">
          {[
            { q: 'What are the minimum requirements for MBBS admission Bangladesh?', a: 'Most universities require a minimum GPA of 3.5 in SSC + HSC with Biology, Chemistry, and Physics. Our counselors will assess your profile.' },
            { q: 'Is an MBBS degree from abroad valid in Bangladesh?', a: 'Yes — if the university is recognized by WHO and listed in WDOMS, graduates can sit the BMDC equivalence exam.' },
            { q: 'How much does MBBS cost abroad compared to Bangladesh?', a: 'MBBS in Russia or China typically costs USD 25,000–40,000 for the full 6-year program compared to private colleges here.' },
            { q: 'Are scholarships available for Bangladeshi students?', a: 'Yes — several universities offer merit-based scholarships. MedGuide BD actively helps students apply.' },
            { q: 'How long does the entire admission process take?', a: 'From initial counseling to departure typically takes 4–8 weeks.' }
          ].map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button className={`faq-trigger ${faqOpen === idx ? 'open' : ''}`} onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                {faq.q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {faqOpen === idx && <div className="faq-body open">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ COLLEGE MODAL ══════════════════ */}
      {modalOpen && modalCollege && (
        <div className="modal-overlay open" onClick={() => setModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-college-tag">
                <div className="modal-college-icon">
                  <img src={modalCollege.img} alt={modalCollege.name} />
                </div>
                <div>
                  <p className="modal-title">{modalCollege.name}</p>
                  <p className="modal-subtitle">{modalCollege.location} · Private · Estd: {modalCollege.est}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-divider"></div>
            <div className="modal-body">
              <div id="collegeModalFormWrap">
                {modalSuccess ? (
                  <div className="form-success">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <strong>Inquiry submitted!</strong>
                    <p>We'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit}>
                    <input type="hidden" value={modalCollege.name} />
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>Full Name <span className="req">*</span></label>
                      <input 
                        className="form-input form-input--light" 
                        type="text" 
                        placeholder="Your full name" 
                        value={modalFormValues.name}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>Email Address <span className="req">*</span></label>
                      <input 
                        className="form-input form-input--light" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={modalFormValues.email}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, email: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>Phone Number</label>
                      <input 
                        className="form-input form-input--light" 
                        type="tel" 
                        placeholder="+91 XXXXXXXXXX" 
                        value={modalFormValues.phone}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>Passing Year</label>
                      <input 
                        className="form-input form-input--light" 
                        type="text" 
                        placeholder="e.g. 2025" 
                        value={modalFormValues.program}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, program: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>NEET Score</label>
                      <input 
                        className="form-input form-input--light" 
                        type="number" 
                        placeholder="e.g. 450" 
                        value={modalFormValues.Score}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, Score: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ color: '#6b7280' }}>State / Location <span className="req">*</span></label>
                      <input 
                        className="form-input form-input--light" 
                        type="text" 
                        placeholder="Your state" 
                        value={modalFormValues.location}
                        onChange={(e) => setModalFormValues(prev => ({ ...prev, location: e.target.value }))}
                        required 
                      />
                    </div>
                    {modalError && <p className="form-error form-error--light" style={{ display: 'block' }}>{modalError}</p>}
                    <button className="btn-submit btn-submit--light" type="submit" disabled={modalSubmitting}>
                      {modalSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ CTA STRIP ══════════════════ */}
      <section className="cta-strip">
        <h2>Your doctor journey begins with one conversation.</h2>
        <p>Join 8,500+ Bangladeshi students who trusted Aspiring Life. Book your free counseling session today.</p>
        <a href="#hero-form">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          Book Free Session
        </a>
      </section>

      {/* Floating Phone & WhatsApp Buttons */}
      <div className="fab-container" id="contactFab">
        <a href="https://wa.me/919051773700" className="fab-btn fab-btn--whatsapp" data-tooltip="WhatsApp Us" target="_blank" rel="noopener noreferrer">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.689 1.975 14.223 1.95 12.01 1.95c-5.438 0-9.863 4.373-9.867 9.802-.001 1.764.475 3.486 1.38 5.019L2.523 21.68l5.124-1.343zM16.643 14.37c-.247-.123-1.463-.722-1.692-.806-.228-.083-.393-.123-.558.124-.166.247-.64.806-.784.97-.145.166-.29.185-.537.062-.247-.123-1.043-.384-1.986-1.226-.733-.655-1.229-1.464-1.373-1.711-.145-.247-.015-.38.109-.502.112-.11.247-.29.37-.435.124-.145.166-.247.247-.413.083-.166.042-.31-.02-.435-.062-.123-.558-1.343-.765-1.842-.202-.486-.406-.42-.558-.428-.145-.006-.31-.007-.475-.007-.166 0-.435.062-.662.31-.228.247-.868.847-.868 2.062 0 1.215.885 2.39 1.009 2.556.124.166 1.74 2.658 4.215 3.728.59.255 1.05.408 1.41.523.593.19 1.133.163 1.559.1.476-.07 1.463-.598 1.668-1.176.207-.578.207-1.074.145-1.176-.062-.102-.228-.166-.475-.29z"/>
          </svg>
        </a>
        <a href="tel:+919051773700" className="fab-btn fab-btn--phone" data-tooltip="Call Us">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      </div>

      {/* Sticky Bottom Contact Bar */}
      <div className="sticky-contact-bar">
        <a href="tel:+919051773700" className="sticky-contact-btn">
          <div className="sticky-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="phone-icon-pulse">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="sticky-text-wrapper">
            <span className="sticky-label">TALK TO EXPERT ADVISOR</span>
            <span className="sticky-number">+91 90517 73700</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
