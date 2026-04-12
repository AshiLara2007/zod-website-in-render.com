'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface Talent {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  job: string;
  country: string;
  religion: string;
  salary: number;
  experience: string;
  maritalStatus: string;
  pic: string;
  cv: string;
}

interface Lead {
  id: number;
  source: string;
  action: string;
  time: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  phone: string;
  isTopManagement: boolean;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  cvCards?: Talent[];
}

const jobOptions = [
  'Driver', 'Baby sitting', 'Nurse', 'Cook', 'Domestic Worker', 'Teacher'
];

const countryOptions = [
  'Indonesia', 'Sri Lanka', 'Philippines', 'Bangladesh', 'India', 'Ethiopia', 'Kenya', 'Uganda'
];

const experienceOptions = [
  '0-1 Year', '1-2 Years', '2-3 Years', '3-4 Years', '4-5 Years', '5-7 Years', '7-10 Years', '10+ Years'
];

const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

const GEMINI_API_KEY = 'AIzaSyCG3HaU5TO4nbtEgkzwii585nB2hcDTkW0';

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Mr. Ahmed Al Thani', position: 'CEO & Founder', photo: 'https://randomuser.me/api/portraits/men/1.jpg', phone: '+97455355206', isTopManagement: true },
  { id: '2', name: 'Ms. Fatima Al Saeed', position: 'Operations Director', photo: 'https://randomuser.me/api/portraits/women/2.jpg', phone: '+97455355206', isTopManagement: true },
  { id: '3', name: 'Mr. Khalid Al Mansouri', position: 'Recruitment Manager', photo: 'https://randomuser.me/api/portraits/men/3.jpg', phone: '+97455355206', isTopManagement: true },
  { id: '4', name: 'Ms. Noor Al Emadi', position: 'Client Relations Head', photo: 'https://randomuser.me/api/portraits/women/4.jpg', phone: '+97455355206', isTopManagement: true },
  { id: '5', name: 'Mr. Youssef Hassan', position: 'Visa Processing Officer', photo: 'https://randomuser.me/api/portraits/men/5.jpg', phone: '+97455355206', isTopManagement: false },
  { id: '6', name: 'Ms. Lina Al Kuwari', position: 'Marketing Specialist', photo: 'https://randomuser.me/api/portraits/women/6.jpg', phone: '+97455355206', isTopManagement: false },
];

const translations = {
  en: {
    welcome: 'Welcome To Doha, Qatar', brandLoading: 'ZOD MANPOWER RECRUITMENT',
    home: 'Home', about: 'About', services: 'Services',
    hireNav: 'Hire Talent', contactUs: 'Contact Us', adminPortal: 'Admin Portal',
    certified: 'Welcome To Doha, Qatar', heroTitle: 'The Gateway to',
    heroTitleSpan: 'Premium Talent', heroTitleEnd: 'in Doha.',
    heroDesc: 'Expertly connecting world-class human resources to the ambitious vision of Qatar.',
    yearsLabel: 'Years in Doha Market',
    successfulPlacements: 'Successful Placements', corporateClients: 'Corporate Clients',
    responseTime: 'Candidate Response Time', complianceRate: 'Compliance Rate',
    ourLegacy: 'Our Legacy', aboutTitle: "Leading Doha's Recruitment Evolution for Over a Decade.",
    aboutDesc: "ZOD Manpower is not just a recruitment firm; we are a strategic partner in Qatar's national growth.",
    personalizedMatching: 'Personalized Candidate Matching', directLiaison: 'Direct Qatar Government Liaison',
    multiIndustry: 'Multi-Industry Expertise', ourExpertise: 'Our Expertise',
    comprehensiveSolutions: 'Comprehensive Recruitment Solutions',
    visaTitle: 'Visa & Documentation', visaDesc: 'End-to-end handling of Qatar work permits, QID processing.',
    techTitle: 'Technical Screening', techDesc: 'Rigorous multi-stage skill testing and background checks.',
    projectsTitle: 'Lusail & Doha Projects', projectsDesc: 'Specialized large-scale staffing solutions.',
    applyViaWhatsapp: 'APPLY VIA WHATSAPP',
    hireTitle: 'Hire Top Talent Instantly', hireDesc: 'Employers can browse our pre-vetted candidates.',
    searchPlaceholder: 'Search Skill (e.g. Driver, Nurse)...', refresh: 'Refresh', ready: 'Ready', viewCV: 'View CV', hireBtn: 'Hire',
    allCountries: 'All Countries', featuredCandidates: 'Featured Candidates', viewAllCandidates: 'View All Candidates →',
    testimonial1: '"ZOD Manpower found us 50+ staff for our luxury hotel."',
    author1: '— HR Director, Doha Regency',
    testimonial2: '"I came from Sri Lanka through ZOD and now work in a top company."',
    author2: '— Mohamed R., Office Admin',
    testimonial3: '"Professional, reliable and very transparent."',
    author3: '— Sarah K., Hospitality Manager',
    faqTitle: 'Recruitment FAQ',
    faqQ1: 'What is the typical visa processing time?', faqA1: 'Standard processing takes 15-45 business days.',
    faqQ2: 'Are there any upfront fees for candidates?', faqA2: 'No. We follow Qatar Labor Laws.',
    faqQ3: 'What industries do you specialize in?', faqA3: 'Hospitality, construction, healthcare, domestic services.',
    faqQ4: 'How do employers request candidates?', faqA4: 'Contact us directly via WhatsApp.',
    footerText: "Qatar's leading licensed manpower recruitment agency.",
    quickLinks: 'Quick Links', aboutDoha: 'About Doha Agency', clientServices: 'Client Services', browseCVs: 'Browse CVs',
    internal: 'Internal', copyright: '© 2026 ZOD MANPOWER RECRUITMENT.',
    privacyPolicy: 'Privacy Policy', terms: 'Terms of Service',
    staffAuth: 'Staff Authentication', restricted: 'Restricted access for ZOD Manpower Admins',
    username: 'Username', password: 'Password', enterAdmin: 'Enter admin', authorizedOnly: 'Authorized Access Only',
    staffPortal: 'Staff Portal', logout: 'Logout', totalCandidates: 'Total Candidates', webLeads: 'Web Leads',
    activeVacancies: 'Active Vacancies', inventoryManagement: 'Inventory Management', visitorLogs: 'Visitor Logs',
    newCandidate: 'New Candidate', editCandidate: 'Edit:', fullName: 'Full Name', age: 'Age', dob: 'Date of Birth', gender: 'Gender',
    jobDesignation: 'Job Designation', country: 'Country', religion: 'Religion', salaryQAR: 'Salary (QAR)',
    photo: 'Photo', cvUpload: 'CV (PDF/Image)', saveRecord: 'Save Candidate Record',
    candidateDetails: 'Candidate Details', position: 'Position', salary: 'Salary', actions: 'Actions',
    realtimeLogs: 'Real-time Activity Logs', clearLogs: 'Clear All Logs',
    trafficSource: 'Traffic Source', actionTaken: 'Action Taken', timeLocal: 'Time (Local)',
    confirmDelete: 'Confirm Deletion', deleteMsg: 'Are you sure you want to delete this candidate?',
    cancel: 'Cancel', yesDelete: 'Yes, Delete', english: 'English', arabic: 'العربية',
    houseMaids: 'House Maids', drivers: 'Drivers', nurses: 'Nurses', monthlyCleaners: 'Monthly Cleaners', returnedHousemaids: 'Returned Housemaids',
    ourTeam: 'Our Team', teamTitle: 'Meet Our Team', teamDesc: 'Dedicated professionals committed to excellence.',
    topManagementTitle: 'Our Top Management Team', contact: 'Contact', viewMore: 'View More',
    ourVision: 'Our Vision', ourMission: 'Our Mission',
    visionText: 'To be the most trusted manpower solutions provider in the Middle East.',
    missionText: 'To provide ethical, transparent, and efficient recruitment services.',
    experience: 'Experience', driversJob: 'Drivers', babysitting: 'Baby sitting', nursesJob: 'Nurses', cooks: 'Cook', domesticWorker: 'Domestic Worker', teacher: 'Teacher',
    ourServicesTitle: 'Our Expertise', ourServicesDesc: 'Specialized recruitment solutions.',
    viewCandidates: 'View Candidates',
    discount1: '20% OFF on First Placement', discount2: 'Free Visa Processing for Group Hiring (10+)', discount3: '15% Discount for Annual Contracts', discountOffer: '🔥 LIMITED OFFER',
    backToHome: 'Back to Home', maritalStatus: 'Marital Status', single: 'Single', married: 'Married', divorced: 'Divorced', widowed: 'Widowed',
  },
  ar: {
    welcome: 'مرحباً بكم في الدوحة', brandLoading: 'زود مان باور للتوظيف',
    home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا',
    hireNav: 'توظيف', contactUs: 'اتصل بنا', adminPortal: 'بوابة المشرفين',
    certified: 'مرحباً بكم في الدوحة', heroTitle: 'البوابة إلى',
    heroTitleSpan: 'المواهب المتميزة', heroTitleEnd: 'في الدوحة.',
    heroDesc: 'نربط بخبرة الموارد البشرية العالمية برؤية قطر الطموحة.',
    yearsLabel: 'سنة في سوق الدوحة',
    successfulPlacements: 'تعيين ناجح', corporateClients: 'عميل من الشركات',
    responseTime: 'وقت الاستجابة للمرشح', complianceRate: 'معدل الامتثال',
    ourLegacy: 'إرثنا', aboutTitle: 'ريادة تطور التوظيف في الدوحة لأكثر من عقد.',
    aboutDesc: 'زود مان باور ليست مجرد شركة توظيف؛ نحن شريك استراتيجي.',
    personalizedMatching: 'مطابقة مرشحين مخصصة', directLiaison: 'اتصال مباشر مع حكومة قطر',
    multiIndustry: 'خبرة متعددة الصناعات', ourExpertise: 'خبراتنا',
    comprehensiveSolutions: 'حلول توظيف شاملة',
    visaTitle: 'التأشيرات والوثائق', visaDesc: 'معالجة شاملة لتصاريح العمل القطرية.',
    techTitle: 'الفحص التقني', techDesc: 'اختبارات مهارات متعددة.',
    projectsTitle: 'مشاريع لوسيل والدوحة', projectsDesc: 'حلول توظيف واسعة النطاق.',
    applyViaWhatsapp: 'قدم عبر واتساب',
    hireTitle: 'وظف أفضل المواهب فوراً', hireDesc: 'تصفح مرشحينا المعتمدين.',
    searchPlaceholder: 'ابحث عن مهارة...', refresh: 'تحديث', ready: 'جاهز', viewCV: 'عرض السيرة', hireBtn: 'توظيف',
    allCountries: 'كل الدول', featuredCandidates: 'المرشحون المميزون', viewAllCandidates: 'عرض كل المرشحين ←',
    testimonial1: '"وجدت لنا زود مان باور أكثر من 50 موظفاً."',
    author1: '— مدير الموارد البشرية',
    testimonial2: '"جئت من سريلانكا عبر زود والآن أعمل في شركة كبرى."',
    author2: '— محمد ر.',
    testimonial3: '"محترفون وموثوقون وشفافون."',
    author3: '— سارة ك.',
    faqTitle: 'الأسئلة الشائعة',
    faqQ1: 'ما وقت معالجة التأشيرة؟', faqA1: 'من 15 إلى 45 يوم عمل.',
    faqQ2: 'هل هناك رسوم للمرشحين؟', faqA2: 'لا. لا ينبغي للمرشحين دفع أي رسوم.',
    faqQ3: 'ما القطاعات التي تتخصصون فيها؟', faqA3: 'الضيافة والبناء والرعاية الصحية.',
    faqQ4: 'كيف يطلب أصحاب العمل المرشحين؟', faqA4: 'عبر واتساب مباشرة.',
    footerText: 'وكالة التوظيف المرخصة الرائدة في قطر.',
    quickLinks: 'روابط سريعة', aboutDoha: 'عن وكالة الدوحة', clientServices: 'خدمات العملاء', browseCVs: 'تصفح السير الذاتية',
    internal: 'داخلي', copyright: '© 2026 زود مانباور للتوظيف.',
    privacyPolicy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
    staffAuth: 'مصادقة الموظفين', restricted: 'دخول مقيد لمشرفي زود مان باور',
    username: 'اسم المستخدم', password: 'كلمة المرور', enterAdmin: 'أدخل اسم المستخدم', authorizedOnly: 'دخول مصرح به فقط',
    staffPortal: 'بوابة الموظفين', logout: 'تسجيل الخروج', totalCandidates: 'إجمالي المرشحين',
    webLeads: 'طلبات الويب', activeVacancies: 'الوظائف النشطة',
    inventoryManagement: 'إدارة المخزون', visitorLogs: 'سجلات الزوار',
    newCandidate: 'مرشح جديد', editCandidate: 'تعديل:', fullName: 'الاسم الكامل', age: 'العمر', dob: 'تاريخ الميلاد', gender: 'الجنس',
    jobDesignation: 'المسمى الوظيفي', country: 'البلد', religion: 'الدين', salaryQAR: 'الراتب (ريال قطري)',
    photo: 'الصورة', cvUpload: 'السيرة الذاتية', saveRecord: 'حفظ بيانات المرشح',
    candidateDetails: 'تفاصيل المرشح', position: 'الوظيفة', salary: 'الراتب', actions: 'إجراءات',
    realtimeLogs: 'سجلات النشاط', clearLogs: 'مسح جميع السجلات',
    trafficSource: 'مصدر الزيارة', actionTaken: 'الإجراء المتخذ', timeLocal: 'الوقت',
    confirmDelete: 'تأكيد الحذف', deleteMsg: 'هل أنت متأكد من حذف هذا المرشح؟',
    cancel: 'إلغاء', yesDelete: 'نعم، احذف', english: 'English', arabic: 'العربية',
    houseMaids: 'خادمات منازل', drivers: 'سائقين', nurses: 'ممرضين', monthlyCleaners: 'عمال نظافة شهري', returnedHousemaids: 'خادمات عائدات',
    ourTeam: 'فريقنا', teamTitle: 'تعرف على فريقنا', teamDesc: 'محترفون ملتزمون بالتميز.',
    topManagementTitle: 'فريق الإدارة العليا', contact: 'اتصل', viewMore: 'اقرأ المزيد',
    ourVision: 'رؤيتنا', ourMission: 'مهمتنا',
    visionText: 'أن نكون مزود حلول القوى العاملة الأكثر ثقة.',
    missionText: 'تقديم خدمات توظيف أخلاقية وشفافة.',
    experience: 'الخبرة', driversJob: 'سائقين', babysitting: 'رعاية أطفال', nursesJob: 'ممرضين', cooks: 'طهاة', domesticWorker: 'عمال منازل', teacher: 'معلمين',
    ourServicesTitle: 'خبراتنا', ourServicesDesc: 'حلول توظيف متخصصة.',
    viewCandidates: 'عرض المرشحين',
    discount1: 'خصم 20% على أول تعيين', discount2: 'معالجة تأشيرة مجانية', discount3: 'خصم 15% على العقود السنوية', discountOffer: '🔥 عرض محدود',
    backToHome: 'العودة إلى الرئيسية', maritalStatus: 'الحالة الاجتماعية', single: 'أعزب', married: 'متزوج', divorced: 'مطلق', widowed: 'أرمل',
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(true);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [adminActive, setAdminActive] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'candidates' | 'leads'>('candidates');
  const [editTalent, setEditTalent] = useState<Talent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showHirePage, setShowHirePage] = useState(false);
  const [showOurTeamPage, setShowOurTeamPage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showReturnedHousemaids, setShowReturnedHousemaids] = useState(false);
  const [jobFilter, setJobFilter] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLanguageSelected, setChatLanguageSelected] = useState<'en' | 'ar' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const jobRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const religionRef = useRef<HTMLSelectElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const experienceRef = useRef<HTMLSelectElement>(null);
  const maritalStatusRef = useRef<HTMLSelectElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = calculateAge(e.target.value);
    setCalculatedAge(age);
  };

  const fetchTalents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/talents');
      const data = await res.json();
      setTalents(data);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLeads = () => {
    const stored = localStorage.getItem('zod_activity_leads');
    if (stored) setLeads(JSON.parse(stored));
  };

  const trackLead = (source: string, action: string) => {
    const newLead = { id: Date.now(), source, action, time: new Date().toLocaleTimeString() };
    setLeads((prev) => {
      const updated = [newLead, ...prev].slice(0, 50);
      localStorage.setItem('zod_activity_leads', JSON.stringify(updated));
      return updated;
    });
  };

  const clearLeads = () => {
    if (confirm(t.clearLogs)) { setLeads([]); localStorage.setItem('zod_activity_leads', '[]'); }
  };

  const handleDiscountClick = (discountText: string) => {
    const whatsappNumber = '97455355206';
    const message = `Hi! I'm interested in the offer: ${discountText}. Can you please provide more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackLead('Discount Banner', discountText);
  };

  const handleHireClick = (talentName: string, source: string) => {
    const whatsappNumber = '97455355206';
    const message = `Hi! I'm interested in hiring ${talentName}. Can you please provide more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackLead(source, `Hire: ${talentName}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editTalent) formData.append('id', editTalent.id);
    formData.append('name', nameRef.current!.value);
    formData.append('dob', dobRef.current!.value);
    formData.append('age', String(calculatedAge || 0));
    formData.append('gender', genderRef.current!.value);
    formData.append('job', jobRef.current!.value);
    formData.append('country', countryRef.current!.value);
    formData.append('religion', religionRef.current!.value);
    formData.append('salary', salaryRef.current!.value);
    formData.append('experience', experienceRef.current!.value);
    formData.append('maritalStatus', maritalStatusRef.current!.value);
    if (picRef.current?.files?.[0]) formData.append('tPic', picRef.current.files[0]);
    if (cvRef.current?.files?.[0]) formData.append('tCv', cvRef.current.files[0]);
    try {
      const res = await fetch('/api/talents', { method: 'POST', body: formData });
      if (res.ok) { resetForm(); await fetchTalents(); alert('Candidate saved successfully!'); }
      else { const err = await res.json(); alert('Error: ' + (err.error || 'Unknown error')); }
    } catch { alert('Network error.'); }
  };

  const resetForm = () => {
    setEditTalent(null);
    setCalculatedAge(null);
    if (nameRef.current) nameRef.current.value = '';
    if (dobRef.current) dobRef.current.value = '';
    if (genderRef.current) genderRef.current.value = 'Male';
    if (jobRef.current) jobRef.current.value = jobOptions[0];
    if (countryRef.current) countryRef.current.value = countryOptions[0];
    if (religionRef.current) religionRef.current.value = 'Muslim';
    if (salaryRef.current) salaryRef.current.value = '0';
    if (experienceRef.current) experienceRef.current.value = experienceOptions[0];
    if (maritalStatusRef.current) maritalStatusRef.current.value = maritalStatusOptions[0];
    if (picRef.current) picRef.current.value = '';
    if (cvRef.current) cvRef.current.value = '';
  };

  const editHandler = (talent: Talent) => {
    setEditTalent(talent);
    setCalculatedAge(talent.age);
    if (nameRef.current) nameRef.current.value = talent.name;
    if (dobRef.current) dobRef.current.value = talent.dob || '';
    if (genderRef.current) genderRef.current.value = talent.gender;
    if (jobRef.current) jobRef.current.value = talent.job;
    if (countryRef.current) countryRef.current.value = talent.country;
    if (religionRef.current) religionRef.current.value = talent.religion || 'Muslim';
    if (salaryRef.current) salaryRef.current.value = String(talent.salary || 0);
    if (experienceRef.current) experienceRef.current.value = talent.experience || experienceOptions[0];
    if (maritalStatusRef.current) maritalStatusRef.current.value = talent.maritalStatus || maritalStatusOptions[0];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id: string) => { setDeleteTargetId(id); setDeleteModalOpen(true); };

  const performDelete = async () => {
    if (!deleteTargetId) return;
    await fetch(`/api/talents/${deleteTargetId}`, { method: 'DELETE' });
    await fetchTalents();
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = document.getElementById('adminUser') as HTMLInputElement;
    const p = document.getElementById('adminPass') as HTMLInputElement;
    if (!u || !p) return;
    if (u.value === 'admin' && p.value === '1978') {
      setAdminActive(true); setLoginModalOpen(false); u.value = ''; p.value = '';
    } else { alert('Invalid credentials. Use admin / 1978'); }
  };

  const handleQuickHire = (category: string) => {
    trackLead('Quick Hire', category);
    setShowHirePage(true);
    setShowOurTeamPage(false);
    setShowAboutPage(false);
    setShowReturnedHousemaids(false);
    setSearchQuery(category.toLowerCase());
  };

  const handleReturnedHousemaids = () => {
    trackLead('Returned Housemaids', 'View');
    setShowReturnedHousemaids(true);
    setShowHirePage(false);
    setShowOurTeamPage(false);
    setShowAboutPage(false);
    setJobFilter('Domestic Worker');
  };

  const startChat = (lang: 'en' | 'ar') => {
    setChatLanguageSelected(lang);
    const welcomeMsg = lang === 'en'
      ? 'Hello! 👋 I am ZOD AI Assistant. Ask me about jobs, visa, hiring!'
      : 'مرحباً! 👋 أنا مساعد ZOD AI. اسألني عن الوظائف!';
    setChatMessages([{ role: 'bot', text: welcomeMsg }]);
  };

  const sendChatMessage = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading || !chatLanguageSelected) return;
    const userMsg: ChatMessage = { role: 'user', text: msg };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    trackLead('Chatbot', msg.slice(0, 40));

    try {
      const systemPrompt = chatLanguageSelected === 'en'
        ? `You are ZOD Assistant for ZOD Manpower. Answer concisely. User: ${msg}`
        : `أنت مساعد ZOD. أجب باختصار. المستخدم: ${msg}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
          })
        }
      );

      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        (chatLanguageSelected === 'en'
          ? "Please contact us via WhatsApp at +97455355206"
          : "يرجى الاتصال بنا على واتساب +97455355206");

      setChatMessages((prev) => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'bot', text: chatLanguageSelected === 'en' ? "Please contact us on WhatsApp +97455355206" : "يرجى الاتصال بنا على واتساب +97455355206" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendChatMessage();
  };

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  useEffect(() => {
    const init = async () => { await fetchTalents(); loadLeads(); setTimeout(() => setIsLoading(false), 3000); };
    init();
  }, [fetchTalents]);

  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', reveal); reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  const escapeHtml = (str: string) => str.replace(/[&<>]/g, (m) => (m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'));

  const filteredTalents = talents.filter((tal) => {
    const matchSearch = searchQuery === '' || tal.name.toLowerCase().includes(searchQuery.toLowerCase()) || tal.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !countryFilter || tal.country === countryFilter;
    const matchJob = !jobFilter || tal.job.toLowerCase().includes(jobFilter.toLowerCase());
    return matchSearch && matchCountry && matchJob;
  });

  const featuredTalents = talents.slice(0, 2);
  const topManagementTeam = teamMembers.filter(member => member.isTopManagement);
  const regularTeam = teamMembers.filter(member => !member.isTopManagement);

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  if (isLoading) {
    return (
      <div dir={dir} className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
        <div className="text-center">
          <img src="/logo/logo.jpeg" alt="ZOD MANPOWER RECRUITMENT" className="w-24 h-24 rounded-full mx-auto mb-8 object-cover shadow-lg animate-pulse" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1 className="text-4xl md:text-5xl font-bold text-[#002F66] mb-4 animate-bounce">{language === 'en' ? 'Welcome To Doha' : 'مرحباً بكم في الدوحة'}</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">{t.brandLoading}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setLanguage('en')} className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${language === 'en' ? 'bg-[#002F66] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>English</button>
            <button onClick={() => setLanguage('ar')} className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${language === 'ar' ? 'bg-[#002F66] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>العربية</button>
          </div>
          <div className="mt-12 w-12 h-12 border-4 border-[#002F66] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className={isRTL ? 'rtl' : 'ltr'}>
      <style jsx global>{`
        .rtl { direction: rtl; text-align: right; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes marquee-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
        .animate-marquee-rtl { animation: marquee-rtl 15s linear infinite; }
        .animate-marquee:hover, .animate-marquee-rtl:hover { animation-play-state: paused; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(200%) skewX(-12deg); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glass-nav { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05); }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: #002F66; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .qatar-gradient { background: linear-gradient(135deg, #002F66 0%, #0040aa 50%, #002F66 100%); }
        .mobile-sidebar { position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background: white; z-index: 1000; transition: right 0.3s ease; box-shadow: -2px 0 20px rgba(0,0,0,0.1); padding: 20px; overflow-y: auto; }
        .mobile-sidebar.active { right: 0; }
        .sidebar-close { position: absolute; top: 20px; right: 20px; font-size: 24px; cursor: pointer; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 20px; margin-top: 60px; }
        .sidebar-nav a, .sidebar-nav button { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #333; padding: 10px 0; border-bottom: 1px solid #eee; }
        .sidebar-apply { background: #002F66; color: white; padding: 12px; border-radius: 30px; text-align: center; margin-top: 20px; }
        .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
        .sidebar-overlay.active { opacity: 1; visibility: visible; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-item.active .fa-plus { transform: rotate(45deg); }
      `}</style>

      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '520px' }}>
            <div className="bg-[#002F66] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><i className="fa-solid fa-robot text-white text-sm"></i></div>
                <div>
                  <div className="text-white font-bold text-sm">ZOD AI Assistant</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {!chatLanguageSelected ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-700 font-bold">Select Language</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => startChat('en')} className="px-5 py-2 bg-[#002F66] text-white rounded-full text-sm font-bold hover:bg-[#002060] transition">English</button>
                    <button onClick={() => startChat('ar')} className="px-5 py-2 bg-[#002F66] text-white rounded-full text-sm font-bold hover:bg-[#002060] transition">العربية</button>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#002F66] text-white rounded-br-sm' : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'}`}>{msg.text}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm shadow-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
            {chatLanguageSelected && (
              <div className="px-4 py-3 border-t bg-white flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleChatKey} placeholder={chatLanguageSelected === 'en' ? "Ask me anything..." : "اسألني أي شيء..."} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#002F66] transition-all" disabled={chatLoading} />
                <button onClick={sendChatMessage} disabled={chatLoading} className="w-10 h-10 bg-[#002F66] text-white rounded-xl flex items-center justify-center hover:bg-[#002060] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"><i className="fa-solid fa-paper-plane text-xs"></i></button>
              </div>
            )}
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} className="w-14 h-14 bg-[#002F66] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-[#002060] active:scale-95">
          {chatOpen ? <i className="fa-solid fa-xmark text-xl"></i> : <i className="fa-regular fa-message text-xl"></i>}
        </button>
      </div>

      {/* Admin Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-gray-100">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-transform hover:rotate-90"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
            <div className="text-center mb-8">
              <i className="fa-solid fa-user-shield text-5xl text-[#002F66] mb-4"></i>
              <h2 className="text-2xl font-bold text-slate-900">{t.staffAuth}</h2>
              <p className="text-sm text-gray-500">{t.restricted}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              <div><label className="text-xs font-bold uppercase text-gray-400 ml-1">{t.username}</label><input type="text" id="adminUser" placeholder={t.enterAdmin} autoComplete="off" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all" required /></div>
              <div><label className="text-xs font-bold uppercase text-gray-400 ml-1">{t.password}</label><input type="password" id="adminPass" placeholder="••••••••" autoComplete="new-password" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all" required /></div>
              <button type="submit" className="w-full py-4 bg-[#002F66] text-white font-bold rounded-2xl hover:bg-[#002060] transition-all shadow-lg">{t.authorizedOnly}</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4 animate-pulse"><i className="fa-solid fa-trash-can text-red-600 text-xl"></i></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t.confirmDelete}</h3>
              <p className="text-sm text-gray-500 mb-6">{t.deleteMsg}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-all">{t.cancel}</button>
                <button onClick={performDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all">{t.yesDelete}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!adminActive && (
        <div className="public-section">
          {/* Discount Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-amber-500 to-red-600 pt-24 pb-3 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="overflow-hidden whitespace-nowrap">
                <div className={`inline-flex gap-8 ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
                  <div onClick={() => handleDiscountClick('20% OFF on First Placement')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">🎉 {t.discount1}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Free Visa Processing for Group Hiring (10+)')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">✨ {t.discount2}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('15% Discount for Annual Contracts')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">💎 {t.discount3}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('20% OFF on First Placement')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">🎉 {t.discount1}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Free Visa Processing for Group Hiring (10+)')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">✨ {t.discount2}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('15% Discount for Annual Contracts')} className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-2">
                    <span className="text-white font-bold text-sm">💎 {t.discount3}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="fixed w-full z-50 glass-nav" style={{ top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); window.scrollTo(0, 0); }}>
                <img src="/logo/logo.jpeg" alt="ZOD MANPOWER RECRUITMENT Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110" />
                <div className="text-2xl font-extrabold tracking-tighter uppercase">ZOD<span className="text-[#002F66]"> MANPOWER RECRUITMENT</span></div>
              </div>
              <div className="hidden lg:flex items-center space-x-8 font-semibold text-xs uppercase tracking-widest">
                <a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.home}</a>
                <a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.about}</a>
                <a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.services}</a>
                <button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.ourTeam}</button>
                <button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.hireNav}</button>
                <a href="https://wa.me/97455355206" onClick={() => trackLead('Nav Apply', 'Global Apply')} target="_blank" className="bg-[#002F66] text-white px-6 py-2.5 rounded-full shadow-md hover:bg-[#002060] transition-all hover:scale-105 active:scale-95">{t.contactUs}</a>
                <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-[#002F66] hover:bg-gray-200 transition-all"><i className="fa-solid fa-globe text-[10px]"></i><span>{language === 'en' ? 'العربية' : 'English'}</span></button>
              </div>
              <button className="lg:hidden text-2xl text-[#002F66]" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars-staggered"></i></button>
            </div>
          </nav>

          {/* Mobile Sidebar */}
          <div className={`mobile-sidebar ${sidebarOpen ? 'active' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="sidebar-close" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark text-[#002F66]"></i></div>
            <div className="sidebar-nav mt-8">
              <a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.home}</a>
              <a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.about}</a>
              <a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.services}</a>
              <button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2 text-left">{t.ourTeam}</button>
              <button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); setShowReturnedHousemaids(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2 text-left">{t.hireNav}</button>
              <a href="https://wa.me/97455355206" onClick={() => { trackLead('Mobile Nav Apply', 'Global Apply'); setSidebarOpen(false); }} target="_blank" className="sidebar-apply" style={{ backgroundColor: '#002F66' }}>{t.contactUs}</a>
              <button onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setSidebarOpen(false); }} className="mt-4 w-full py-2 bg-gray-100 rounded-full text-sm font-bold text-[#002F66] hover:bg-gray-200 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-globe text-xs"></i>{language === 'en' ? 'العربية' : 'English'}</button>
            </div>
          </div>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

          {/* Simple render for other pages - to avoid complexity, showing simplified version */}
          {showOurTeamPage ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowOurTeamPage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="text-center mb-12 reveal">
                  <h3 className="text-4xl font-bold text-slate-900 mb-4">{t.teamTitle}</h3>
                  <p className="text-gray-500 max-w-2xl mx-auto">{t.teamDesc}</p>
                </div>
                <div className="mb-16">
                  <h4 className="text-2xl font-bold text-[#002F66] text-center mb-10">{t.topManagementTitle}</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topManagementTeam.map((member) => (
                      <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                        <div className="relative h-64 bg-gradient-to-r from-[#002F66] to-[#0040aa] flex items-center justify-center">
                          <img src={member.photo} alt={member.name} className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105" onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150?text=User')} />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="text-white font-bold text-sm text-center">{member.position}</div>
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          <h4 className="text-xl font-bold text-slate-800 mb-3">{escapeHtml(member.name)}</h4>
                          <a href={`https://wa.me/${member.phone}`} target="_blank" onClick={() => trackLead('Team Contact', member.name)} className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all hover:scale-105">
                            <i className="fa-brands fa-whatsapp"></i> {t.contact}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : showAboutPage ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowAboutPage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="bg-white rounded-3xl p-10 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div><h3 className="text-3xl font-bold text-[#002F66] mb-6">{t.ourVision}</h3><p className="text-gray-600 leading-relaxed text-lg">{t.visionText}</p></div>
                    <div><h3 className="text-3xl font-bold text-[#002F66] mb-6">{t.ourMission}</h3><p className="text-gray-600 leading-relaxed text-lg">{t.missionText}</p></div>
                  </div>
                </div>
              </div>
            </div>
          ) : showReturnedHousemaids ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowReturnedHousemaids(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="text-center mb-10"><h3 className="text-4xl font-bold text-slate-900 mb-2">{t.returnedHousemaids}</h3></div>
                {loading ? <div className="text-center py-24">Loading...</div> : filteredTalents.length === 0 ? <div className="text-center py-24">No candidates found.</div> : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {filteredTalents.map((talent) => (
                      <div key={talent.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                        <img src={talent.pic} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                        <h4 className="font-bold text-slate-800 text-xl text-center">{escapeHtml(talent.name)}</h4>
                        <p className="text-[#002F66] font-bold text-center">{escapeHtml(talent.job)}</p>
                        <div className="mt-4 flex gap-3">
                          <a href={talent.cv} target="_blank" className="flex-1 py-3 bg-gray-100 text-center rounded-xl font-bold text-[10px] uppercase">{t.viewCV}</a>
                          <button onClick={() => handleHireClick(talent.name, 'Returned Housemaid')} className="flex-1 py-3 bg-[#002F66] text-white text-center rounded-xl font-bold text-[10px] uppercase">{t.hireBtn}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : showHirePage ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowHirePage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div><h3 className="text-4xl font-bold text-slate-900 mb-2">{t.hireTitle}</h3><p className="text-gray-500">{t.hireDesc}</p></div>
                  <div className="flex gap-3 w-full md:w-auto flex-wrap">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="flex-1 p-4 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66]" />
                    <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="p-4 bg-white border rounded-2xl">
                      <option value="">{t.allCountries}</option>
                      {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={fetchTalents} className="px-5 py-4 bg-gray-200 rounded-2xl"><i className="fa-solid fa-rotate-right"></i></button>
                  </div>
                </div>
                {loading ? <div className="text-center py-24">Loading...</div> : filteredTalents.length === 0 ? <div className="text-center py-24">No candidates found.</div> : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {filteredTalents.map((talent) => (
                      <div key={talent.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                        <img src={talent.pic} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                        <h4 className="font-bold text-slate-800 text-xl text-center">{escapeHtml(talent.name)}</h4>
                        <p className="text-[#002F66] font-bold text-center">{escapeHtml(talent.job)}</p>
                        <div className="mt-4 flex gap-3">
                          <a href={talent.cv} target="_blank" className="flex-1 py-3 bg-gray-100 text-center rounded-xl font-bold text-[10px] uppercase">{t.viewCV}</a>
                          <button onClick={() => handleHireClick(talent.name, 'Hire Talent')} className="flex-1 py-3 bg-[#002F66] text-white text-center rounded-xl font-bold text-[10px] uppercase">{t.hireBtn}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <section id="home" className="relative pt-32 pb-32 px-6 qatar-gradient text-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-8">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 animate-pulse">{t.certified}</span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.1]">{t.heroTitle} <span className="text-amber-400">{t.heroTitleSpan}</span> {t.heroTitleEnd}</h1>
                    <p className="text-lg opacity-80 leading-relaxed max-w-lg">{t.heroDesc}</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => handleQuickHire('House Maids')} className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">🏠 {t.houseMaids}</button>
                      <button onClick={() => handleQuickHire('Drivers')} className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">🚗 {t.drivers}</button>
                      <button onClick={() => handleQuickHire('Nurses')} className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">🏥 {t.nurses}</button>
                      <button onClick={() => handleQuickHire('Monthly Cleaners')} className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">🧹 {t.monthlyCleaners}</button>
                      <button onClick={handleReturnedHousemaids} className="bg-amber-500/30 backdrop-blur-md border border-amber-400/50 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-amber-500">🔄 {t.returnedHousemaids}</button>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center relative">
                    <div className="w-80 h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] rotate-12 flex items-center justify-center shadow-2xl hover:rotate-0 transition-transform duration-700 hover:scale-105"><i className="fa-solid fa-building-columns text-[10rem] opacity-20 -rotate-12"></i></div>
                    <div className="absolute -bottom-10 -left-10 p-8 bg-amber-400 rounded-3xl shadow-2xl text-[#002F66] animate-float"><div className="text-4xl font-bold">12+</div><div className="text-[10px] font-bold uppercase tracking-tighter">{t.yearsLabel}</div></div>
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="py-16 bg-white border-b reveal">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
                  <div className="flex items-center space-x-4"><div className="text-4xl text-[#002F66] font-black">9.2K</div><div className="text-[10px] uppercase font-bold text-gray-400">{t.successfulPlacements}</div></div>
                  <div className="flex items-center space-x-4"><div className="text-4xl text-[#002F66] font-black">1.8K+</div><div className="text-[10px] uppercase font-bold text-gray-400">{t.corporateClients}</div></div>
                  <div className="flex items-center space-x-4"><div className="text-4xl text-[#002F66] font-black">24h</div><div className="text-[10px] uppercase font-bold text-gray-400">{t.responseTime}</div></div>
                  <div className="flex items-center space-x-4"><div className="text-4xl text-[#002F66] font-black">98.2%</div><div className="text-[10px] uppercase font-bold text-gray-400">{t.complianceRate}</div></div>
                </div>
              </section>

              {/* Featured Candidates Section */}
              <section className="py-16 bg-gray-50 px-6 reveal">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">{t.featuredCandidates}</h3>
                    <button onClick={() => setShowHirePage(true)} className="text-[#002F66] font-bold text-sm hover:underline">{t.viewAllCandidates}</button>
                  </div>
                  {featuredTalents.map((talent) => (
                    <div key={talent.id} className="bg-white p-5 rounded-2xl border shadow-sm mb-4 flex items-center gap-5">
                      <img src={talent.pic} className="w-16 h-16 rounded-xl object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80?text=User')} alt={talent.name} />
                      <div><div className="font-bold">{escapeHtml(talent.name)}</div><div className="text-[#002F66] text-xs">{escapeHtml(talent.job)}</div></div>
                      <button onClick={() => setShowHirePage(true)} className="ml-auto bg-[#002F66] text-white text-[10px] font-bold px-4 py-2 rounded-xl">{t.hireBtn}</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer */}
              <footer className="py-20 bg-slate-900 text-white px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                  <div className="col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <img src="/logo/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="text-2xl font-black uppercase">ZOD<span className="text-[#002F66]"> MANPOWER RECRUITMENT</span></div>
                    </div>
                    <p className="text-slate-500 text-sm mb-6">{t.footerText}</p>
                  </div>
                  <div><h6 className="font-bold uppercase text-xs mb-6">{t.quickLinks}</h6><ul className="space-y-4 text-xs text-slate-500"><li><a href="#about" className="hover:text-white">{t.aboutDoha}</a></li></ul></div>
                  <div><h6 className="font-bold uppercase text-xs mb-6">{t.internal}</h6><button onClick={() => setLoginModalOpen(true)} className="px-6 py-3 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 transition-all"><i className="fa-solid fa-lock text-[10px]"></i><span className="text-[10px] ml-2">{t.adminPortal}</span></button></div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 text-center text-[10px] text-slate-700"><p>{t.copyright}</p></div>
              </footer>
            </>
          )}
        </div>
      )}

      {/* Admin Panel */}
      {adminActive && (
        <div className="admin-section min-h-screen bg-gray-50 pb-20">
          <nav className="bg-white border-b px-6 py-4 mb-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-[#002F66] rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-gears text-[10px]"></i></div><span className="font-bold text-sm uppercase">{t.staffPortal}</span></div>
              <button onClick={() => setAdminActive(false)} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase">{t.logout}</button>
            </div>
          </nav>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{t.totalCandidates}</p><div className="text-4xl font-bold">{talents.length}</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{t.webLeads}</p><div className="text-4xl font-bold text-indigo-600">{leads.length}</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{t.activeVacancies}</p><div className="text-4xl font-bold text-[#002F66]">6</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex items-center justify-center"><button onClick={fetchTalents} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"><i className="fa-solid fa-rotate-right mr-2"></i> {t.refresh}</button></div>
            </div>
            <div className="flex space-x-6 mb-8 border-b">
              <button onClick={() => setActiveTab('candidates')} className={`pb-4 border-b-2 font-bold text-xs uppercase ${activeTab === 'candidates' ? 'border-slate-900' : 'border-transparent text-slate-400'}`}>{t.inventoryManagement}</button>
              <button onClick={() => setActiveTab('leads')} className={`pb-4 border-b-2 font-bold text-xs uppercase ${activeTab === 'leads' ? 'border-slate-900' : 'border-transparent text-slate-400'}`}>{t.visitorLogs}</button>
            </div>
            {activeTab === 'candidates' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                  <h4 className="font-bold uppercase text-xs text-[#002F66] mb-8">{editTalent ? `${t.editCandidate} ${editTalent.name}` : t.newCandidate}</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input ref={nameRef} type="text" placeholder={t.fullName} className="w-full p-4 bg-gray-50 border rounded-xl" required />
                    <input ref={dobRef} type="date" onChange={handleDobChange} className="w-full p-4 bg-gray-50 border rounded-xl" required />
                    {calculatedAge !== null && <div className="text-blue-600 text-xs">Age: {calculatedAge} years</div>}
                    <select ref={genderRef} className="w-full p-4 bg-gray-50 border rounded-xl"><option>Male</option><option>Female</option></select>
                    <select ref={maritalStatusRef} className="w-full p-4 bg-gray-50 border rounded-xl">{maritalStatusOptions.map(opt => <option key={opt}>{opt}</option>)}</select>
                    <select ref={jobRef} className="w-full p-4 bg-gray-50 border rounded-xl">{jobOptions.map(job => <option key={job}>{job}</option>)}</select>
                    <select ref={countryRef} className="w-full p-4 bg-gray-50 border rounded-xl">{countryOptions.map(c => <option key={c}>{c}</option>)}</select>
                    <select ref={religionRef} className="w-full p-4 bg-gray-50 border rounded-xl"><option>Muslim</option><option>Christian</option><option>Hindu</option><option>Buddhist</option></select>
                    <input ref={salaryRef} type="number" placeholder={t.salaryQAR} className="w-full p-4 bg-gray-50 border rounded-xl" />
                    <select ref={experienceRef} className="w-full p-4 bg-gray-50 border rounded-xl">{experienceOptions.map(exp => <option key={exp}>{exp}</option>)}</select>
                    <input ref={picRef} type="file" accept="image/*" className="text-xs" />
                    <input ref={cvRef} type="file" accept=".pdf,image/*" className="text-xs" />
                    <button type="submit" className="w-full py-4 bg-[#002F66] text-white rounded-xl font-bold text-xs">{t.saveRecord}</button>
                  </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[3rem] border shadow-sm overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                      <tr><th className="p-6">{t.candidateDetails}</th><th className="p-6">{t.position}</th><th className="p-6">{t.salary}</th><th className="p-6 text-right">{t.actions}</th></tr>
                    </thead>
                    <tbody>
                      {talents.map((talent) => (
                        <tr key={talent.id} className="hover:bg-gray-50 border-t">
                          <td className="p-6"><div className="flex items-center gap-3"><img src={talent.pic} className="w-10 h-10 rounded-lg object-cover" /><div><div className="font-bold text-sm">{escapeHtml(talent.name)}</div></div></div></td>
                          <td className="p-6"><div className="text-xs">{escapeHtml(talent.job)}</div></td>
                          <td className="p-6"><div className="text-xs">{talent.salary} QAR</div></td>
                          <td className="p-6 text-right"><button onClick={() => editHandler(talent)} className="text-blue-500 p-2"><i className="fa-solid fa-pen"></i></button><button onClick={() => confirmDelete(talent.id)} className="text-red-500 p-2"><i className="fa-solid fa-trash"></i></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
                <div className="p-8 border-b flex justify-between"><h4 className="font-bold text-xs uppercase text-indigo-600">{t.realtimeLogs}</h4><button onClick={clearLeads} className="text-[10px] font-bold text-red-500">{t.clearLogs}</button></div>
                <table className="w-full text-left"><thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase"><tr><th className="p-8">{t.trafficSource}</th><th className="p-8">{t.actionTaken}</th><th className="p-8 text-right">{t.timeLocal}</th></tr></thead>
                  <tbody>{leads.map((lead) => (<tr key={lead.id}><td className="p-8 text-xs font-bold">{lead.source}</td><td className="p-8 text-xs text-indigo-600 font-bold">{lead.action}</td><td className="p-8 text-right text-[10px] text-gray-400">{lead.time}</td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
