'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface Talent {
  id: string;
  name: string;
  age: number;
  gender: string;
  job: string;
  country: string;
  religion: string;
  salary: number;
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

// Only these 6 jobs for Manpower Services
const jobOptions = [
  'Driver', 'Baby sitting', 'Nurse', 'Cook', 'Domestic Worker', 'Teacher'
];

const countryOptions = [
  'Indonesia', 'Sri Lanka', 'Philippines', 'Bangladesh', 'India', 'Ethiopia', 'Kenya', 'Uganda'
];

const GEMINI_API_KEY = 'AIzaSyCG3HaU5TO4nbtEgkzwii585nB2hcDTkW0';

// Team Members Data
const teamMembers: TeamMember[] = [
  { id: '1', name: 'Mr. Ahmed Al Thani', position: 'CEO & Founder', photo: 'https://randomuser.me/api/portraits/men/1.jpg', phone: '+97412345678', isTopManagement: true },
  { id: '2', name: 'Ms. Fatima Al Saeed', position: 'Operations Director', photo: 'https://randomuser.me/api/portraits/women/2.jpg', phone: '+97412345679', isTopManagement: true },
  { id: '3', name: 'Mr. Khalid Al Mansouri', position: 'Recruitment Manager', photo: 'https://randomuser.me/api/portraits/men/3.jpg', phone: '+97412345680', isTopManagement: true },
  { id: '4', name: 'Ms. Noor Al Emadi', position: 'Client Relations Head', photo: 'https://randomuser.me/api/portraits/women/4.jpg', phone: '+97412345681', isTopManagement: true },
  { id: '5', name: 'Mr. Youssef Hassan', position: 'Visa Processing Officer', photo: 'https://randomuser.me/api/portraits/men/5.jpg', phone: '+97412345682', isTopManagement: false },
  { id: '6', name: 'Ms. Lina Al Kuwari', position: 'Marketing Specialist', photo: 'https://randomuser.me/api/portraits/women/6.jpg', phone: '+97412345683', isTopManagement: false },
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
    aboutDesc: "ZOD Manpower is not just a recruitment firm; we are a strategic partner in Qatar's national growth. From the towering skyscrapers of Lusail to the bustling streets of Msheireb, our talent drives the nation forward.",
    personalizedMatching: 'Personalized Candidate Matching', directLiaison: 'Direct Qatar Government Liaison',
    multiIndustry: 'Multi-Industry Expertise', ourExpertise: 'Our Expertise',
    comprehensiveSolutions: 'Comprehensive Recruitment Solutions',
    visaTitle: 'Visa & Documentation', visaDesc: 'End-to-end handling of Qatar work permits, QID processing, and professional licensing for international talent.',
    techTitle: 'Technical Screening', techDesc: "Rigorous multi-stage skill testing and background checks to ensure every candidate is ready for Doha's competitive market.",
    projectsTitle: 'Lusail & Doha Projects', projectsDesc: 'Specialized large-scale staffing solutions for major national infrastructure, hospitality, and oil & gas sectors.',
    applyViaWhatsapp: 'APPLY VIA WHATSAPP',
    hireTitle: 'Hire Top Talent Instantly', hireDesc: 'Employers can browse our pre-vetted candidates and request CVs directly.',
    searchPlaceholder: 'Search Skill (e.g. Driver, Nurse)...', refresh: 'Refresh', ready: 'Ready', viewCV: 'View CV', hireBtn: 'Hire',
    allCountries: 'All Countries', featuredCandidates: 'Featured Candidates', viewAllCandidates: 'View All Candidates →',
    testimonial1: '"ZOD Manpower found us 50+ staff for our luxury hotel in Lusail within 30 days. Their document processing is unmatched in Qatar."',
    author1: '— HR Director, Doha Regency',
    testimonial2: '"I came from Sri Lanka through ZOD and now work in a top company. They were honest and helped with everything."',
    author2: '— Mohamed R., Office Admin',
    testimonial3: '"Professional, reliable and very transparent. The best manpower agency I have worked with in the Middle East."',
    author3: '— Sarah K., Hospitality Manager',
    faqTitle: 'Recruitment FAQ',
    faqQ1: 'What is the typical visa processing time?', faqA1: 'Standard processing takes 15-45 business days depending on documentation, medicals, and embassy approvals.',
    faqQ2: 'Are there any upfront fees for candidates?', faqA2: 'No. We strictly follow Qatar Labor Laws and Ethical Recruitment standards. Candidates should not pay for jobs.',
    faqQ3: 'What industries do you specialize in?', faqA3: 'We specialize in hospitality, construction, healthcare, domestic services, security, retail, and oil & gas sectors across Qatar.',
    faqQ4: 'How do employers request candidates?', faqA4: 'Employers can browse our pre-vetted talent on this website and contact us directly via WhatsApp to request CVs or arrange interviews.',
    footerText: "Qatar's leading licensed manpower recruitment agency. Connecting global talent to the heart of the Middle East.",
    quickLinks: 'Quick Links', aboutDoha: 'About Doha Agency', clientServices: 'Client Services', browseCVs: 'Browse CVs',
    internal: 'Internal', copyright: '© 2026 ZOD MANPOWER RECRUITMENT.',
    privacyPolicy: 'Privacy Policy', terms: 'Terms of Service',
    staffAuth: 'Staff Authentication', restricted: 'Restricted access for ZOD Manpower Admins',
    username: 'Username', password: 'Password', enterAdmin: 'Enter admin', authorizedOnly: 'Authorized Access Only',
    staffPortal: 'Staff Portal', logout: 'Logout', totalCandidates: 'Total Candidates', webLeads: 'Web Leads',
    activeVacancies: 'Active Vacancies', inventoryManagement: 'Inventory Management', visitorLogs: 'Visitor Logs',
    newCandidate: 'New Candidate', editCandidate: 'Edit:', fullName: 'Full Name', age: 'Age', gender: 'Gender',
    jobDesignation: 'Job Designation', country: 'Country', religion: 'Religion', salaryQAR: 'Salary (QAR)',
    photo: 'Photo', cvUpload: 'CV (PDF/Image)', saveRecord: 'Save Candidate Record',
    candidateDetails: 'Candidate Details', position: 'Position', salary: 'Salary', actions: 'Actions',
    realtimeLogs: 'Real-time Activity Logs', clearLogs: 'Clear All Logs',
    trafficSource: 'Traffic Source', actionTaken: 'Action Taken', timeLocal: 'Time (Local)',
    confirmDelete: 'Confirm Deletion', deleteMsg: 'Are you sure you want to delete this candidate? This action cannot be undone.',
    cancel: 'Cancel', yesDelete: 'Yes, Delete', english: 'English', arabic: 'العربية',
    houseMaids: 'House Maids', drivers: 'Drivers', nurses: 'Nurses', monthlyCleaners: 'Monthly Cleaners', returnedHousemaids: 'Returned Housemaids',
    ourTeam: 'Our Team', teamTitle: 'Meet Our Team', teamDesc: 'Dedicated professionals committed to excellence in recruitment.',
    topManagementTitle: 'Our Top Management Team', contact: 'Contact', viewMore: 'View More',
    ourVision: 'Our Vision', ourMission: 'Our Mission',
    visionText: 'To be the most trusted and innovative manpower solutions provider in the Middle East, connecting global talent with opportunities that drive economic growth.',
    missionText: 'To provide ethical, transparent, and efficient recruitment services that empower businesses and transform lives through quality employment.',
    experience: 'Experience', driversJob: 'Drivers', babysitting: 'Baby sitting', nursesJob: 'Nurses', cooks: 'Cook', domesticWorker: 'Domestic Worker', teacher: 'Teacher',
    ourServicesTitle: 'Our Expertise', ourServicesDesc: 'Specialized recruitment solutions tailored to Qatar\'s diverse needs.',
    viewCandidates: 'View Candidates',
    discount1: '20% OFF on First Placement', discount2: 'Free Visa Processing for Group Hiring (10+)', discount3: '15% Discount for Annual Contracts', discountOffer: '🔥 LIMITED OFFER',
    backToHome: 'Back to Home',
  },
  ar: {
    welcome: 'مرحباً بكم في الدوحة', brandLoading: 'زود مان باور للتوظيف',
    home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا',
    hireNav: 'توظيف', contactUs: 'اتصل بنا', adminPortal: 'بوابة المشرفين',
    certified: 'وكالة معتمدة ISO 9001:2015', heroTitle: 'البوابة إلى',
    heroTitleSpan: 'المواهب المتميزة', heroTitleEnd: 'في الدوحة.',
    heroDesc: 'نربط بخبرة الموارد البشرية العالمية برؤية قطر الطموحة.',
    yearsLabel: 'سنة في سوق الدوحة',
    successfulPlacements: 'تعيين ناجح', corporateClients: 'عميل من الشركات',
    responseTime: 'وقت الاستجابة للمرشح', complianceRate: 'معدل الامتثال',
    ourLegacy: 'إرثنا', aboutTitle: 'ريادة تطور التوظيف في الدوحة لأكثر من عقد.',
    aboutDesc: 'زود مان باور ليست مجرد شركة توظيف؛ نحن شريك استراتيجي في النمو الوطني لقطر.',
    personalizedMatching: 'مطابقة مرشحين مخصصة', directLiaison: 'اتصال مباشر مع حكومة قطر',
    multiIndustry: 'خبرة متعددة الصناعات', ourExpertise: 'خبراتنا',
    comprehensiveSolutions: 'حلول توظيف شاملة',
    visaTitle: 'التأشيرات والوثائق', visaDesc: 'معالجة شاملة لتصاريح العمل القطرية ومعالجة QID.',
    techTitle: 'الفحص التقني', techDesc: 'اختبارات مهارات متعددة لضمان جاهزية كل مرشح.',
    projectsTitle: 'مشاريع لوسيل والدوحة', projectsDesc: 'حلول توظيف واسعة النطاق.',
    applyViaWhatsapp: 'قدم عبر واتساب',
    hireTitle: 'وظف أفضل المواهب فوراً', hireDesc: 'تصفح مرشحينا المعتمدين مسبقاً.',
    searchPlaceholder: 'ابحث عن مهارة...', refresh: 'تحديث', ready: 'جاهز', viewCV: 'عرض السيرة', hireBtn: 'توظيف',
    allCountries: 'كل الدول', featuredCandidates: 'المرشحون المميزون', viewAllCandidates: 'عرض كل المرشحين ←',
    testimonial1: '"وجدت لنا زود مان باور أكثر من 50 موظفاً خلال 30 يوماً."',
    author1: '— مدير الموارد البشرية، فندق الدوحة ريجنسي',
    testimonial2: '"جئت من سريلانكا عبر زود والآن أعمل في شركة كبرى."',
    author2: '— محمد ر.، مساعد إداري',
    testimonial3: '"محترفون وموثوقون وشفافون جداً."',
    author3: '— سارة ك.، مديرة الضيافة',
    faqTitle: 'الأسئلة الشائعة',
    faqQ1: 'ما وقت معالجة التأشيرة؟', faqA1: 'من 15 إلى 45 يوم عمل.',
    faqQ2: 'هل هناك رسوم للمرشحين؟', faqA2: 'لا. لا ينبغي للمرشحين دفع أي رسوم.',
    faqQ3: 'ما القطاعات التي تتخصصون فيها؟', faqA3: 'الضيافة والبناء والرعاية الصحية والنفط والغاز.',
    faqQ4: 'كيف يطلب أصحاب العمل المرشحين؟', faqA4: 'عبر واتساب أو من خلال الموقع مباشرة.',
    footerText: 'وكالة التوظيف المرخصة الرائدة في قطر.',
    quickLinks: 'روابط سريعة', aboutDoha: 'عن وكالة الدوحة', clientServices: 'خدمات العملاء', browseCVs: 'تصفح السير الذاتية',
    internal: 'داخلي', copyright: '© 2026 زود مانباور للتوظيف.',
    privacyPolicy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
    staffAuth: 'مصادقة الموظفين', restricted: 'دخول مقيد لمشرفي زود مان باور',
    username: 'اسم المستخدم', password: 'كلمة المرور', enterAdmin: 'أدخل اسم المستخدم', authorizedOnly: 'دخول مصرح به فقط',
    staffPortal: 'بوابة الموظفين', logout: 'تسجيل الخروج', totalCandidates: 'إجمالي المرشحين',
    webLeads: 'طلبات الويب', activeVacancies: 'الوظائف النشطة',
    inventoryManagement: 'إدارة المخزون', visitorLogs: 'سجلات الزوار',
    newCandidate: 'مرشح جديد', editCandidate: 'تعديل:', fullName: 'الاسم الكامل', age: 'العمر', gender: 'الجنس',
    jobDesignation: 'المسمى الوظيفي', country: 'البلد', religion: 'الدين', salaryQAR: 'الراتب (ريال قطري)',
    photo: 'الصورة', cvUpload: 'السيرة الذاتية (PDF/صورة)', saveRecord: 'حفظ بيانات المرشح',
    candidateDetails: 'تفاصيل المرشح', position: 'الوظيفة', salary: 'الراتب', actions: 'إجراءات',
    realtimeLogs: 'سجلات النشاط الفورية', clearLogs: 'مسح جميع السجلات',
    trafficSource: 'مصدر الزيارة', actionTaken: 'الإجراء المتخذ', timeLocal: 'الوقت (محلي)',
    confirmDelete: 'تأكيد الحذف', deleteMsg: 'هل أنت متأكد من حذف هذا المرشح؟',
    cancel: 'إلغاء', yesDelete: 'نعم، احذف', english: 'English', arabic: 'العربية',
    houseMaids: 'خادمات منازل', drivers: 'سائقين', nurses: 'ممرضين', monthlyCleaners: 'عمال نظافة شهري', returnedHousemaids: 'خادمات عائدات',
    ourTeam: 'فريقنا', teamTitle: 'تعرف على فريقنا', teamDesc: 'محترفون ملتزمون بالتميز في التوظيف.',
    topManagementTitle: 'فريق الإدارة العليا لدينا', contact: 'اتصل', viewMore: 'اقرأ المزيد',
    ourVision: 'رؤيتنا', ourMission: 'مهمتنا',
    visionText: 'أن نكون مزود حلول القوى العاملة الأكثر ثقة وابتكاراً في الشرق الأوسط، نربط المواهب العالمية بالفرص التي تدفع النمو الاقتصادي.',
    missionText: 'تقديم خدمات توظيف أخلاقية وشفافة وفعالة تمكّن الشركات وتحول حياة الأفراد من خلال فرص العمل الجيدة.',
    experience: 'الخبرة', driversJob: 'سائقين', babysitting: 'رعاية أطفال', nursesJob: 'ممرضين', cooks: 'طهاة', domesticWorker: 'عمال منازل', teacher: 'معلمين',
    ourServicesTitle: 'خبراتنا', ourServicesDesc: 'حلول توظيف متخصصة مصممة خصيصاً لتلبية احتياجات قطر المتنوعة.',
    viewCandidates: 'عرض المرشحين',
    discount1: 'خصم 20% على أول تعيين', discount2: 'معالجة تأشيرة مجانية للتعيين الجماعي (10+)', discount3: 'خصم 15% على العقود السنوية', discountOffer: '🔥 عرض محدود',
    backToHome: 'العودة إلى الرئيسية',
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

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLanguageSelected, setChatLanguageSelected] = useState<'en' | 'ar' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const jobRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const religionRef = useRef<HTMLSelectElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const manpowerJobs = [
    { key: 'Driver', label: t.driversJob, icon: 'fa-solid fa-truck-fast', color: 'from-blue-500 to-blue-700' },
    { key: 'Baby sitting', label: t.babysitting, icon: 'fa-solid fa-baby-carriage', color: 'from-pink-500 to-pink-700' },
    { key: 'Nurse', label: t.nursesJob, icon: 'fa-solid fa-hospital-user', color: 'from-green-500 to-green-700' },
    { key: 'Cook', label: t.cooks, icon: 'fa-solid fa-utensils', color: 'from-orange-500 to-orange-700' },
    { key: 'Domestic Worker', label: t.domesticWorker, icon: 'fa-solid fa-broom', color: 'from-purple-500 to-purple-700' },
    { key: 'Teacher', label: t.teacher, icon: 'fa-solid fa-chalkboard-user', color: 'from-red-500 to-red-700' },
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editTalent) formData.append('id', editTalent.id);
    formData.append('name', nameRef.current!.value);
    formData.append('age', ageRef.current!.value);
    formData.append('gender', genderRef.current!.value);
    formData.append('job', jobRef.current!.value);
    formData.append('country', countryRef.current!.value);
    formData.append('religion', religionRef.current!.value);
    formData.append('salary', salaryRef.current!.value);
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
    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (genderRef.current) genderRef.current.value = 'Male';
    if (jobRef.current) jobRef.current.value = jobOptions[0];
    if (countryRef.current) countryRef.current.value = countryOptions[0];
    if (religionRef.current) religionRef.current.value = 'Muslim';
    if (salaryRef.current) salaryRef.current.value = '0';
    if (picRef.current) picRef.current.value = '';
    if (cvRef.current) cvRef.current.value = '';
  };

  const editHandler = (talent: Talent) => {
    setEditTalent(talent);
    if (nameRef.current) nameRef.current.value = talent.name;
    if (ageRef.current) ageRef.current.value = String(talent.age);
    if (genderRef.current) genderRef.current.value = talent.gender;
    if (jobRef.current) jobRef.current.value = talent.job;
    if (countryRef.current) countryRef.current.value = talent.country;
    if (religionRef.current) religionRef.current.value = talent.religion || 'Muslim';
    if (salaryRef.current) salaryRef.current.value = String(talent.salary || 0);
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

  const handleServiceJobClick = (jobKey: string) => {
    trackLead('Service Job', jobKey);
    setShowHirePage(true);
    setShowOurTeamPage(false);
    setShowAboutPage(false);
    setShowReturnedHousemaids(false);
    setSearchQuery(jobKey.toLowerCase());
  };

  const startChat = (lang: 'en' | 'ar') => {
    setChatLanguageSelected(lang);
    const welcomeMsg = lang === 'en'
      ? 'Hello! 👋 I am ZOD AI Assistant. Ask me about jobs, visa, hiring, or mention a country to see available CVs!'
      : 'مرحباً! 👋 أنا مساعد ZOD AI. اسألني عن الوظائف، التأشيرات، التوظيف، أو اذكر دولة لمشاهدة السير الذاتية المتاحة!';
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

    const detectedCountry = countryOptions.find((c) =>
      msg.toLowerCase().includes(c.toLowerCase())
    );
    let cvCards: Talent[] = [];
    if (detectedCountry) {
      cvCards = talents.filter((tal) => tal.country.toLowerCase() === detectedCountry.toLowerCase()).slice(0, 3);
    }

    const simpleGreetings = ['hey', 'hi', 'hello', 'hola', 'salam', 'مرحبا'];
    if (simpleGreetings.includes(msg.trim().toLowerCase())) {
      const greetingResponse = chatLanguageSelected === 'en'
        ? 'Hey there! 👋 How can I help you today? Ask me about jobs, visa, or mention a country to see CVs.'
        : 'مرحباً! 👋 كيف يمكنني مساعدتك اليوم؟ اسأل عن الوظائف، التأشيرات، أو اذكر دولة لمشاهدة السير الذاتية.';
      setChatMessages((prev) => [...prev, { role: 'bot', text: greetingResponse, cvCards: cvCards.length > 0 ? cvCards : undefined }]);
      setChatLoading(false);
      return;
    }

    try {
      const systemPrompt = chatLanguageSelected === 'en'
        ? `You are ZOD Assistant, the official AI chatbot for ZOD Manpower — Qatar's leading licensed recruitment agency (ISO 9001:2015 certified, licensed by Qatar Ministry of Labor).

Key facts:
- We recruit from: ${countryOptions.join(', ')}
- Job categories: ${jobOptions.join(', ')}
- WhatsApp contact: +94729204485
- Visa processing: 15-45 business days
- Zero fees for candidates (Qatar Labor Law compliant)
- Salary range: 800-3000 QAR/month
- Active in Doha, Al Khor, Al Wakrah, Lusail

Answer the user helpfully, professionally, and concisely. If they ask about CVs from a specific country, acknowledge you are checking the database.

User question: ${msg}`
        : `أنت مساعد ZOD، بوت الدردشة الرسمي لشركة زود مان باور — وكالة التوظيف المرخصة الرائدة في قطر (معتمدة ISO 9001:2015، مرخصة من وزارة العمل القطرية).

حقائق رئيسية:
- نوظف من: ${countryOptions.join(', ')}
- فئات الوظائف: ${jobOptions.join(', ')}
- واتساب: +94729204485
- معالجة التأشيرة: 15-45 يوم عمل
- لا توجد رسوم للمرشحين (وفقاً لقانون العمل القطري)
- نطاق الرواتب: 800-3000 ريال قطري/شهر
- نعمل في الدوحة، الخور، الوكرة، لوسيل

أجب المستخدم بشكل مفيد ومهني ومختصر. إذا سأل عن السير الذاتية من بلد معين، أقر بأنك تتحقق من قاعدة البيانات.

سؤال المستخدم: ${msg}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            generationConfig: { maxOutputTokens: 350, temperature: 0.7 }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        (chatLanguageSelected === 'en'
          ? "I'm not sure how to answer that. Please contact us via WhatsApp at +94729204485."
          : "لست متأكداً من الإجابة. يرجى الاتصال بنا عبر واتساب +94729204485.");

      setChatMessages((prev) => [...prev, { role: 'bot', text: botText, cvCards: cvCards.length > 0 ? cvCards : undefined }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      let fallbackText = chatLanguageSelected === 'en'
        ? "Sorry, I'm having trouble connecting to my AI brain right now. Please contact us directly on WhatsApp at +94729204485 or use the 'Contact Us' button. 😊"
        : "عذراً، أواجه مشكلة في الاتصال بالذكاء الاصطناعي حالياً. يرجى الاتصال بنا مباشرة على واتساب +94729204485 أو استخدام زر 'اتصل بنا'. 😊";
      if (detectedCountry) {
        fallbackText = chatLanguageSelected === 'en'
          ? `We have ${cvCards.length} candidate(s) from ${detectedCountry} in our database! You can browse them below or contact us on WhatsApp.`
          : `لدينا ${cvCards.length} مرشح(ين) من ${detectedCountry} في قاعدة بياناتنا! يمكنك تصفحهم أدناه أو الاتصال بنا على واتساب.`;
      }
      setChatMessages((prev) => [...prev, { role: 'bot', text: fallbackText, cvCards: cvCards.length > 0 ? cvCards : undefined }]);
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
    const init = async () => { await fetchTalents(); loadLeads(); setTimeout(() => setIsLoading(false), 5000); };
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

  // RTL direction for Arabic
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
      {/* Global RTL Style */}
      <style jsx global>{`
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .rtl .flex-row-reverse-rtl {
          flex-direction: row-reverse;
        }
        .rtl .ml-auto-rtl {
          margin-left: auto;
          margin-right: 0;
        }
        .rtl .mr-auto-rtl {
          margin-right: auto;
          margin-left: 0;
        }
        .rtl .text-left-rtl {
          text-align: right;
        }
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
                  <div className="text-blue-200 text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>Powered by Gemini AI</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {!chatLanguageSelected ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-700 font-bold">Select Language / اختر اللغة</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => startChat('en')} className="px-5 py-2 bg-[#002F66] text-white rounded-full text-sm font-bold hover:bg-[#002060] transition">English</button>
                    <button onClick={() => startChat('ar')} className="px-5 py-2 bg-[#002F66] text-white rounded-full text-sm font-bold hover:bg-[#002060] transition">العربية</button>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="space-y-2">
                      <div className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#002F66] text-white rounded-br-sm' : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'}`}>{msg.text}</div>
                      </div>
                      {msg.cvCards && msg.cvCards.length > 0 && (
                        <div className="space-y-2 ml-1">
                          <p className="text-[10px] font-bold text-[#002F66] uppercase tracking-widest">
                            {chatLanguageSelected === 'en' ? 'Available CVs from our database:' : 'السير الذاتية المتاحة من قاعدة بياناتنا:'}
                          </p>
                          {msg.cvCards.map((talent) => (
                            <div key={talent.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                              <img src={talent.pic} className="w-10 h-10 rounded-lg object-cover shrink-0" onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50?text=User')} alt={talent.name} />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-800 text-xs truncate">{escapeHtml(talent.name)}</div>
                                <div className="text-[10px] text-[#002F66] font-bold">{escapeHtml(talent.job)}</div>
                                <div className="text-[10px] text-gray-400">{talent.salary} QAR · {talent.gender}, {talent.age}y</div>
                              </div>
                              <a href={`https://wa.me/94729204485?text=Interested in ${encodeURIComponent(talent.name)}`} target="_blank" onClick={() => trackLead('Chatbot CV', talent.name)} className="shrink-0 bg-[#002F66] text-white text-[9px] font-bold px-2 py-1.5 rounded-lg hover:bg-[#002060] transition-all">Hire</a>
                            </div>
                          ))}
                        </div>
                      )}
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
          {/* Discount Banner - Eye-catching animated banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-amber-500 to-red-600 pt-24 pb-3 px-6 animate-gradient-x">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white font-bold text-sm animate-pulse">{t.discountOffer}</span>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <span className="text-red-600 font-bold text-sm flex items-center gap-2">🎉 {t.discount1}</span>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <span className="text-red-600 font-bold text-sm flex items-center gap-2">✨ {t.discount2}</span>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <span className="text-red-600 font-bold text-sm flex items-center gap-2">💎 {t.discount3}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Animated background effect */}
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
                <a href="https://wa.me/94729204485" onClick={() => trackLead('Nav Apply', 'Global Apply')} target="_blank" className="bg-[#002F66] text-white px-6 py-2.5 rounded-full shadow-md hover:bg-[#002060] transition-all hover:scale-105 active:scale-95">{t.contactUs}</a>
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
              <a href="https://wa.me/94729204485" onClick={() => { trackLead('Mobile Nav Apply', 'Global Apply'); setSidebarOpen(false); }} target="_blank" className="sidebar-apply" style={{ backgroundColor: '#002F66' }}>{t.contactUs}</a>
              <button onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setSidebarOpen(false); }} className="mt-4 w-full py-2 bg-gray-100 rounded-full text-sm font-bold text-[#002F66] hover:bg-gray-200 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-globe text-xs"></i>{language === 'en' ? 'العربية' : 'English'}</button>
            </div>
          </div>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

          {/* Our Team Page */}
          {showOurTeamPage ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowOurTeamPage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                
                <div className="text-center mb-12 reveal">
                  <h3 className="text-4xl font-bold text-slate-900 mb-4">{t.teamTitle}</h3>
                  <p className="text-gray-500 max-w-2xl mx-auto">{t.teamDesc}</p>
                </div>

                {/* Top Management Team Section */}
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
                            <i className="fa-brands fa-whatsapp"></i> {t.contact} {member.name.split(' ')[0]}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regular Team Members */}
                <div>
                  <h4 className="text-xl font-bold text-slate-700 text-center mb-8">Our Dedicated Team</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularTeam.map((member) => (
                      <div key={member.id} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 border border-gray-100">
                        <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#002F66]/20" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80?text=User')} />
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-800">{escapeHtml(member.name)}</h5>
                          <p className="text-[#002F66] text-xs font-semibold">{escapeHtml(member.position)}</p>
                        </div>
                        <a href={`https://wa.me/${member.phone}`} target="_blank" onClick={() => trackLead('Team Contact', member.name)} className="text-green-600 hover:text-green-700 transition-all hover:scale-110">
                          <i className="fa-brands fa-whatsapp text-xl"></i>
                        </a>
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
                    <div>
                      <h3 className="text-3xl font-bold text-[#002F66] mb-6">{t.ourVision}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{t.visionText}</p>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-[#002F66] mb-6">{t.ourMission}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{t.missionText}</p>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Journey</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Founded in 2010, ZOD MANPOWER RECRUITMENT has grown to become one of Qatar's most trusted manpower agencies. 
                      With over 12 years of experience in the Doha market, we have successfully placed thousands of skilled professionals 
                      across various industries including hospitality, construction, healthcare, and domestic services. Our commitment to 
                      ethical recruitment and compliance with Qatar Labor Laws has earned us the trust of both employers and candidates alike.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : showReturnedHousemaids ? (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowReturnedHousemaids(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                
                <div className="text-center mb-10">
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">{t.returnedHousemaids}</h3>
                  <p className="text-gray-500">Experienced housemaids returning from overseas with proven track records</p>
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <div key={i} className="bg-white p-8 rounded-[2.5rem] border animate-pulse"><div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div><div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}</div>
                ) : filteredTalents.length === 0 ? (
                  <div className="text-center py-24 text-gray-400"><i className="fa-solid fa-user-slash text-5xl mb-4 block"></i><p className="font-bold">No returned housemaids found at the moment. Please check back later.</p></div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {filteredTalents.map((talent) => (
                      <div key={talent.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <img src={talent.pic} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#002F66]/10 shadow-sm" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{t.ready}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-800 text-xl leading-tight">{escapeHtml(talent.name)}</h4>
                          <p className="text-[#002F66] font-bold text-[11px] uppercase tracking-widest mt-1">{escapeHtml(talent.job)}</p>
                          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 mb-8">
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-earth-asia w-5 text-[#002F66]"></i><span>{escapeHtml(talent.country)}</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-user w-5 text-[#002F66]"></i><span>{talent.gender}, {talent.age} Years</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-money-bill-wave w-5 text-[#002F66]"></i><span>{talent.salary || 0} QAR</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-briefcase w-5 text-[#002F66]"></i><span>5+ Years Experience</span></div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-auto">
                          <a href={talent.cv} target="_blank" onClick={() => trackLead('Returned CV', talent.name)} className="flex-1 py-4 bg-gray-100 text-center rounded-xl font-bold text-[10px] uppercase hover:bg-gray-200 transition-all">{t.viewCV}</a>
                          <a href={`https://wa.me/94729204485?text=Interested in returned housemaid ${encodeURIComponent(talent.name)}`} onClick={() => trackLead('Returned Hire', talent.name)} target="_blank" className="flex-1 py-4 bg-[#002F66] text-white text-center rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-[#002060] transition-all">{t.hireBtn}</a>
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
                    <div className="relative flex-1 min-w-[180px]">
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full p-4 pl-12 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all" />
                      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="p-4 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all text-sm font-bold text-gray-700">
                      <option value="">{t.allCountries}</option>
                      {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={fetchTalents} className="px-5 py-4 bg-gray-200 rounded-2xl hover:bg-gray-300 transition-all hover:scale-105" title={t.refresh}><i className="fa-solid fa-rotate-right"></i></button>
                  </div>
                </div>
                {loading ? (
                  <div className="grid md:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <div key={i} className="bg-white p-8 rounded-[2.5rem] border animate-pulse"><div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div><div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}</div>
                ) : filteredTalents.length === 0 ? (
                  <div className="text-center py-24 text-gray-400"><i className="fa-solid fa-user-slash text-5xl mb-4 block"></i><p className="font-bold">No candidates found. Try a different search or country filter.</p></div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {filteredTalents.map((talent) => (
                      <div key={talent.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <img src={talent.pic} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#002F66]/10 shadow-sm" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{t.ready}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-800 text-xl leading-tight">{escapeHtml(talent.name)}</h4>
                          <p className="text-[#002F66] font-bold text-[11px] uppercase tracking-widest mt-1">{escapeHtml(talent.job)}</p>
                          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 mb-8">
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-earth-asia w-5 text-[#002F66]"></i><span>{escapeHtml(talent.country)}</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-user w-5 text-[#002F66]"></i><span>{talent.gender}, {talent.age} Years</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-money-bill-wave w-5 text-[#002F66]"></i><span>{talent.salary || 0} QAR</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-calendar-alt w-5 text-[#002F66]"></i><span>2-5 Years Exp</span></div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-auto">
                          <a href={talent.cv} target="_blank" onClick={() => trackLead('Public CV', talent.name)} className="flex-1 py-4 bg-gray-100 text-center rounded-xl font-bold text-[10px] uppercase hover:bg-gray-200 transition-all">{t.viewCV}</a>
                          <a href={`https://wa.me/94729204485?text=Interested in ${encodeURIComponent(talent.name)}`} onClick={() => trackLead('Hire Click', talent.name)} target="_blank" className="flex-1 py-4 bg-[#002F66] text-white text-center rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-[#002060] transition-all">{t.hireBtn}</a>
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
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><i className="fa-solid fa-globe text-[40rem] absolute -top-20 -right-40 animate-spin-slow"></i></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-8 fade-in">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 animate-pulse">{t.certified}</span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] animate-slide-up">{t.heroTitle} <span className="text-amber-400">{t.heroTitleSpan}</span> {t.heroTitleEnd}</h1>
                    <p className="text-lg opacity-80 leading-relaxed max-w-lg">{t.heroDesc}</p>
                    
                    {/* Quick Action Buttons - Including Returned Housemaids as normal button */}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <button onClick={() => handleQuickHire('House Maids')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-2 text-sm">🏠 {t.houseMaids}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleQuickHire('Drivers')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-2 text-sm">🚗 {t.drivers}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleQuickHire('Nurses')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-2 text-sm">🏥 {t.nurses}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleQuickHire('Monthly Cleaners')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-2 text-sm">🧹 {t.monthlyCleaners}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={handleReturnedHousemaids} className="group relative overflow-hidden bg-amber-500/30 backdrop-blur-md border border-amber-400/50 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-amber-500">
                        <span className="relative z-10 flex items-center gap-2 text-sm">🔄 {t.returnedHousemaids}</span>
                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center relative">
                    <div className="w-80 h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] rotate-12 flex items-center justify-center shadow-2xl hover:rotate-0 transition-transform duration-700 hover:scale-105"><i className="fa-solid fa-building-columns text-[10rem] opacity-20 -rotate-12"></i></div>
                    <div className="absolute -bottom-10 -left-10 p-8 bg-amber-400 rounded-3xl shadow-2xl text-[#002F66] animate-float" style={{ animationDuration: '3s' }}><div className="text-4xl font-bold">12+</div><div className="text-[10px] font-bold uppercase tracking-tighter leading-none">{t.yearsLabel}</div></div>
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="py-16 bg-white border-b reveal">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
                  {[{ num: '9.2K', label: t.successfulPlacements }, { num: '1.8K+', label: t.corporateClients }, { num: '24h', label: t.responseTime }, { num: '98.2%', label: t.complianceRate }].map((s, i) => (
                    <div key={i} className="flex items-center space-x-4 border-r border-gray-100 last:border-0 hover:translate-x-2 transition-all duration-300 group">
                      <div className="text-4xl text-[#002F66] font-black group-hover:scale-110 transition-transform">{s.num}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Candidates Section */}
              <section className="py-16 bg-gray-50 px-6 reveal">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">{t.featuredCandidates}</h3>
                    <button onClick={() => setShowHirePage(true)} className="text-[#002F66] font-bold text-sm hover:underline transition-all flex items-center gap-1">{t.viewAllCandidates}</button>
                  </div>
                  {loading ? (
                    <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="bg-white p-5 rounded-2xl border animate-pulse flex gap-4"><div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0"></div><div className="flex-1"><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/3"></div></div></div>)}</div>
                  ) : (
                    <div className="space-y-4">
                      {featuredTalents.map((talent) => (
                        <div key={talent.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5">
                          <img src={talent.pic} className="w-16 h-16 rounded-xl object-cover border-2 border-[#002F66]/10 shrink-0" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80?text=User')} alt={talent.name} />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-base truncate">{escapeHtml(talent.name)}</div>
                            <div className="text-[#002F66] font-bold text-[11px] uppercase tracking-widest">{escapeHtml(talent.job)} · {escapeHtml(talent.country)}</div>
                            <div className="text-[10px] text-gray-400 mt-1">Experience: 3-5 Years</div>
                          </div>
                          <div className="flex gap-3 items-center shrink-0">
                            <span className="text-xs font-bold text-gray-500 hidden sm:block">{talent.salary || 0} QAR</span>
                            <button onClick={() => setShowHirePage(true)} className="bg-[#002F66] text-white text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-[#002060] transition-all hover:scale-105">{t.hireBtn}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Our Legacy Section with View More Button */}
              <section id="about" className="py-24 px-6 bg-white reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                  <div className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-[4rem] overflow-hidden shadow-inner"><img src="https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="About" /></div>
                    <div className="absolute -bottom-8 -right-8 p-10 bg-[#002F66] rounded-[3rem] text-white shadow-2xl hidden md:block transition-all duration-300 hover:scale-105"><i className="fa-solid fa-quote-left text-4xl opacity-20 mb-4 block"></i><p className="font-bold text-lg italic">"Connecting People, <br />Empowering Visions."</p></div>
                  </div>
                  <div className="space-y-8">
                    <h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em]">{t.ourLegacy}</h2>
                    <h3 className="text-4xl font-bold text-slate-900 leading-tight">{t.aboutTitle}</h3>
                    <p className="text-gray-500 leading-relaxed">{t.aboutDesc}</p>
                    <ul className="space-y-4">{[t.personalizedMatching, t.directLiaison, t.multiIndustry].map((item, i) => (<li key={i} className="flex items-center space-x-3 font-bold text-sm text-slate-700 group cursor-pointer"><i className="fa-solid fa-check-circle text-[#002F66] transition-transform group-hover:scale-110"></i><span className="group-hover:translate-x-1 transition-transform">{item}</span></li>))}</ul>
                    <button onClick={() => setShowAboutPage(true)} className="inline-flex items-center gap-2 bg-[#002F66] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#002060] transition-all hover:scale-105 shadow-md">
                      {t.viewMore} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </section>

              {/* Services/Expertise Section */}
              <section id="services" className="py-24 px-6 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto text-center mb-20"><h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em] mb-4">{t.ourExpertise}</h2><h3 className="text-4xl font-bold text-slate-900">{t.comprehensiveSolutions}</h3></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                  {[{ icon: 'passport', title: t.visaTitle, desc: t.visaDesc }, { icon: 'users-gear', title: t.techTitle, desc: t.techDesc }, { icon: 'city', title: t.projectsTitle, desc: t.projectsDesc }].map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-3 border border-gray-100 cursor-pointer">
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002F66] group-hover:text-white transition-all duration-500 group-hover:rotate-6"><i className={`fa-solid fa-${s.icon} text-2xl`}></i></div>
                      <h4 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-[#002F66] transition-colors">{s.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location / Google Maps Section */}
              <section className="py-16 px-6 bg-white reveal">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Location</h3>
                    <p className="text-gray-500">ZOD MANPOWER RECRUITMENT, Doha, Qatar</p>
                  </div>
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115105.20279075674!2d51.43141955744967!3d25.301366678710125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c5344cc6cd77%3A0x8e2c6f0b3d8b9b9b!2sDoha%2C%20Qatar!5e0!3m2!1sen!2slk!4v1712345678901!5m2!1sen!2slk" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="ZOD MANPOWER RECRUITMENT Location"
                    ></iframe>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="py-20 bg-gray-50 px-6 reveal">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[{ text: t.testimonial1, author: t.author1 }, { text: t.testimonial2, author: t.author2 }, { text: t.testimonial3, author: t.author3 }].map((tst, i) => (
                      <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                        <i className="fa-solid fa-quote-left text-3xl text-[#002F66]/20 mb-4 block"></i>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{tst.text}</p>
                        <p className="font-bold text-slate-800 text-sm">{tst.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="py-20 bg-white px-6 reveal">
                <div className="max-w-5xl mx-auto">
                  <h3 className="text-3xl font-bold text-center mb-12">{t.faqTitle}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[{ q: t.faqQ1, a: t.faqA1 }, { q: t.faqQ2, a: t.faqA2 }, { q: t.faqQ3, a: t.faqA3 }, { q: t.faqQ4, a: t.faqA4 }].map((faq, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-2xl border shadow-sm faq-item cursor-pointer transition-all duration-300 hover:shadow-md" onClick={(e) => { const parent = e.currentTarget; parent.classList.toggle('active'); const answer = parent.querySelector('.faq-answer') as HTMLElement; if (parent.classList.contains('active')) answer.style.maxHeight = answer.scrollHeight + 'px'; else answer.style.maxHeight = '0px'; }}>
                        <h5 className="font-bold text-sm flex justify-between items-center uppercase tracking-tight">{faq.q}<i className="fa-solid fa-plus text-xs transition-transform duration-300 ml-2 shrink-0"></i></h5>
                        <div className="faq-answer text-gray-500 text-sm leading-relaxed">{faq.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-20 bg-slate-900 text-white px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
                  <div className="col-span-2"><div className="text-2xl font-black uppercase mb-6 tracking-tighter">ZOD<span className="text-[#002F66]"> MANPOWER RECRUITMENT</span></div><p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">{t.footerText}</p><div className="flex space-x-4"><a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-facebook-f"></i></a><a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-linkedin-in"></i></a></div></div>
                  <div><h6 className="font-bold uppercase text-xs tracking-widest mb-6 text-slate-300">{t.quickLinks}</h6><ul className="space-y-4 text-xs text-slate-500 font-bold uppercase"><li><a href="#about" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.aboutDoha}</a></li><li><a href="#services" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.clientServices}</a></li><li><button onClick={() => setShowHirePage(true)} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.browseCVs}</button></li></ul></div>
                  <div><h6 className="font-bold uppercase text-xs tracking-widest mb-6 text-slate-300">{t.internal}</h6><button onClick={() => setLoginModalOpen(true)} className="group flex items-center space-x-3 px-6 py-3 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-105"><i className="fa-solid fa-lock text-[10px] group-hover:rotate-12 transition-transform"></i><span className="text-[10px] font-bold uppercase tracking-widest">{t.adminPortal}</span></button></div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-700 tracking-widest uppercase font-bold"><p>{t.copyright}</p><div className="flex space-x-6"><a href="#" className="hover:text-white transition-colors">{t.privacyPolicy}</a><a href="#" className="hover:text-white transition-colors">{t.terms}</a></div></div>
              </footer>
            </>
          )}
        </div>
      )}

      {/* Admin Panel */}
      {adminActive && (
        <div className="admin-section min-h-screen bg-gray-50 pb-20">
          <nav className="bg-white border-b px-6 py-4 mb-10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-[#002F66] rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-gears text-[10px]"></i></div><span className="font-bold text-sm tracking-widest uppercase text-slate-900">{t.staffPortal}</span></div>
              <button onClick={() => setAdminActive(false)} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-105">{t.logout}</button>
            </div>
          </nav>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.totalCandidates}</p><div className="text-4xl font-bold text-slate-800">{talents.length}</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.webLeads}</p><div className="text-4xl font-bold text-indigo-600">{leads.length}</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.activeVacancies}</p><div className="text-4xl font-bold text-[#002F66]">6</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-center"><button onClick={fetchTalents} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 hover:scale-105"><i className="fa-solid fa-rotate-right mr-2"></i> {t.refresh}</button></div>
            </div>
            <div className="flex space-x-6 mb-8 border-b">
              <button onClick={() => setActiveTab('candidates')} className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'candidates' ? 'border-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t.inventoryManagement}</button>
              <button onClick={() => setActiveTab('leads')} className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'leads' ? 'border-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t.visitorLogs}</button>
            </div>
            {activeTab === 'candidates' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-8 border-b pb-4"><h4 className="font-bold uppercase text-xs text-[#002F66] tracking-widest">{editTalent ? `${t.editCandidate} ${editTalent.name}` : t.newCandidate}</h4><button onClick={resetForm} className="text-[10px] text-gray-400 hover:text-red-600 transition-all hover:rotate-12"><i className="fa-solid fa-rotate-left"></i></button></div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.fullName}</label><input ref={nameRef} type="text" className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.age}</label><input ref={ageRef} type="number" className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                      <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.gender}</label><select ref={genderRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all"><option>Male</option><option>Female</option></select></div>
                    </div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.jobDesignation}</label><select ref={jobRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">
                      {jobOptions.map(job => <option key={job} value={job}>{job}</option>)}
                    </select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.country}</label><select ref={countryRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{countryOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.religion}</label><select ref={religionRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all"><option value="Muslim">Muslim</option><option value="Christian">Christian</option></select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.salaryQAR}</label><input ref={salaryRef} type="number" defaultValue="0" step="100" className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-2">{t.photo}</label><input ref={picRef} type="file" accept="image/*" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all" /></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-2">{t.cvUpload}</label><input ref={cvRef} type="file" accept=".pdf,image/*" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" /></div>
                    <button type="submit" className="w-full py-4 bg-[#002F66] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-[#002060] transition-all duration-300 hover:scale-105">{t.saveRecord}</button>
                  </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left"><thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b"><tr><th className="p-6">{t.candidateDetails}</th><th className="p-6">{t.position}</th><th className="p-6">{t.salary}</th><th className="p-6 text-right">{t.actions}</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {talents.map((talent) => (
                        <tr key={talent.id} className="hover:bg-gray-50 transition-all duration-200">
                          <td className="p-6"><div className="flex items-center space-x-3"><img src={talent.pic} className="w-10 h-10 rounded-lg object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50')} alt={talent.name} /><div><div className="font-bold text-slate-800 text-sm">{escapeHtml(talent.name)}</div><div className="text-[9px] text-gray-400 uppercase">{escapeHtml(talent.country)}</div></div></div></td>
                          <td className="p-6"><div className="text-xs font-bold text-gray-600">{escapeHtml(talent.job)}</div></td>
                          <td className="p-6"><div className="text-xs font-bold text-gray-600">{talent.salary || 0} QAR</div></td>
                          <td className="p-6 text-right">
                            <button onClick={() => editHandler(talent)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={() => confirmDelete(talent.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"><i className="fa-solid fa-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b flex justify-between items-center"><h4 className="font-bold text-xs uppercase tracking-widest text-indigo-600">{t.realtimeLogs}</h4><button onClick={clearLeads} className="text-[10px] font-bold text-red-500 uppercase hover:underline transition-all">{t.clearLogs}</button></div>
                <table className="w-full text-left"><thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><tr><th className="p-8">{t.trafficSource}</th><th className="p-8">{t.actionTaken}</th><th className="p-8 text-right">{t.timeLocal}</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">{leads.map((lead) => (<tr key={lead.id}><td className="p-8 text-xs font-bold">{escapeHtml(lead.source)}</td><td className="p-8 text-xs text-indigo-600 font-bold">{escapeHtml(lead.action)}</td><td className="p-8 text-right text-[10px] text-gray-400">{lead.time}</td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
