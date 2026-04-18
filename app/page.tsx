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
  workerType: string;
  pic: string;
  cv: string;
}

interface Lead {
  id: number;
  source: string;
  action: string;
  time: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  cvCards?: Talent[];
}

const jobOptions = [
  'office boy', 'Driver', 'Domestic worker', 'Nurse', 'Babysitter', 'Teacher',
  'Cook', 'Tailor', 'Farmer', 'Security Guard', 'Hairdresser', 'Secretary',
  'Cleaner', 'Caregiver', 'Sales', 'Cashier', 'Waiter', 'hospitality', 'Technical'
];

const countryOptions = [
  'Burundi', 'Ghana', "Côte d'Ivoire", 'Madagascar', 'Myanmar', 'Nepal',
  'Nigeria', 'Philippines', 'Rwanda', 'Sri Lanka', 'Tanzania', 'Ethiopia',
  'Kenya', 'Indonesia', 'Bangladesh', 'India', 'Eritrea', 'Uganda',
  'Sierra leone', 'Gambia'
];

const workerTypeOptions = ['Recruitment Workers', 'Returned Housemaids'];

const GEMINI_API_KEY = 'AIzaSyCG3HaU5TO4nbtEgkzwii585nB2hcDTkW0';

const translations = {
  en: {
    welcome: 'Welcome To Doha, Qatar', brandLoading: 'ZOD MANPOWER',
    home: 'Home', about: 'About', services: 'Services', vacancies: 'Vacancies',
    hireNav: 'Hire Talent', applyNow: 'Apply Now', adminPortal: 'Admin Portal',
    certified: 'ISO 9001:2015 Certified Agency', heroTitle: 'The Gateway to',
    heroTitleSpan: 'Premium Talent', heroTitleEnd: 'in Doha.',
    heroDesc: 'Expertly connecting world-class human resources to the ambitious vision of Qatar.',
    forEmployers: 'For Employers', forJobSeekers: 'For Job Seekers', yearsLabel: 'Years in Doha Market',
    successfulPlacements: 'Successful Placements', corporateClients: 'Corporate Clients',
    responseTime: 'Candidate Response Time', complianceRate: 'Compliance Rate',
    ourLegacy: 'Our Legacy', aboutTitle: "Leading Doha's Recruitment Evolution for Over a Decade.",
    aboutDesc: "ZOD Manpower is not just a recruitment firm; we are a strategic partner in Qatar's national growth.",
    personalizedMatching: 'Personalized Candidate Matching', directLiaison: 'Direct Qatar Government Liaison',
    multiIndustry: 'Multi-Industry Expertise', ourExpertise: 'Our Expertise',
    comprehensiveSolutions: 'Comprehensive Recruitment Solutions',
    visaTitle: 'Visa & Documentation', visaDesc: 'End-to-end handling of Qatar work permits, QID processing.',
    techTitle: 'Technical Screening', techDesc: "Rigorous multi-stage skill testing and background checks.",
    projectsTitle: 'Lusail & Doha Projects', projectsDesc: 'Specialized large-scale staffing solutions.',
    currentOpenings: 'Current Openings in Qatar', openingsDesc: 'Join our network and work with top-tier companies.',
    applyViaWhatsapp: 'APPLY VIA WHATSAPP',
    hireTitle: 'Hire Top Talent Instantly', hireDesc: 'Employers can browse our pre-vetted candidates.',
    searchPlaceholder: 'Search Skill (e.g. Driver, Nurse)...', refresh: 'Refresh', ready: 'Ready', viewCV: 'View CV', hireBtn: 'Hire',
    allCountries: 'All Countries', featuredCandidates: 'Featured Candidates', viewAllCandidates: 'View All Candidates →',
    testimonial1: '"ZOD Manpower found us 50+ staff for our luxury hotel in Lusail within 30 days."',
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
    internal: 'Internal', copyright: '© 2026 ZOD MANPOWER.',
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
    confirmDelete: 'Confirm Deletion', deleteMsg: 'Are you sure you want to delete this candidate?',
    cancel: 'Cancel', yesDelete: 'Yes, Delete', english: 'English', arabic: 'العربية',
    workerType: 'Worker Type', recruitmentWorkers: 'Recruitment Workers', returnedHousemaids: 'Returned Housemaids',
    searchCandidates: 'Search Candidates...', searchByName: 'Search by name, job, or country',
  },
  ar: {
    welcome: 'مرحباً بكم في الدوحة', brandLoading: 'زود مان باور',
    home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا', vacancies: 'الوظائف الشاغرة',
    hireNav: 'توظيف', applyNow: 'قدم الآن', adminPortal: 'بوابة المشرفين',
    certified: 'وكالة معتمدة ISO 9001:2015', heroTitle: 'البوابة إلى',
    heroTitleSpan: 'المواهب المتميزة', heroTitleEnd: 'في الدوحة.',
    heroDesc: 'نربط بخبرة الموارد البشرية العالمية برؤية قطر الطموحة.',
    forEmployers: 'لأصحاب العمل', forJobSeekers: 'للباحثين عن عمل', yearsLabel: 'سنة في سوق الدوحة',
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
    currentOpenings: 'الوظائف الشاغرة حالياً في قطر', openingsDesc: 'انضم إلى شبكتنا.',
    applyViaWhatsapp: 'قدم عبر واتساب',
    hireTitle: 'وظف أفضل المواهب فوراً', hireDesc: 'تصفح مرشحينا المعتمدين.',
    searchPlaceholder: 'ابحث عن مهارة...', refresh: 'تحديث', ready: 'جاهز', viewCV: 'عرض السيرة', hireBtn: 'توظيف',
    allCountries: 'كل الدول', featuredCandidates: 'المرشحون المميزون', viewAllCandidates: 'عرض كل المرشحين ←',
    testimonial1: '"وجدت لنا زود مان باور أكثر من 50 موظفاً خلال 30 يوماً."',
    author1: '— مدير الموارد البشرية',
    testimonial2: '"جئت من سريلانكا عبر زود والآن أعمل في شركة كبرى."',
    author2: '— محمد ر.',
    testimonial3: '"محترفون وموثوقون وشفافون جداً."',
    author3: '— سارة ك.',
    faqTitle: 'الأسئلة الشائعة',
    faqQ1: 'ما وقت معالجة التأشيرة؟', faqA1: 'من 15 إلى 45 يوم عمل.',
    faqQ2: 'هل هناك رسوم للمرشحين؟', faqA2: 'لا. لا ينبغي للمرشحين دفع أي رسوم.',
    faqQ3: 'ما القطاعات التي تتخصصون فيها؟', faqA3: 'الضيافة والبناء والرعاية الصحية.',
    faqQ4: 'كيف يطلب أصحاب العمل المرشحين؟', faqA4: 'عبر واتساب مباشرة.',
    footerText: 'وكالة التوظيف المرخصة الرائدة في قطر.',
    quickLinks: 'روابط سريعة', aboutDoha: 'عن وكالة الدوحة', clientServices: 'خدمات العملاء', browseCVs: 'تصفح السير الذاتية',
    internal: 'داخلي', copyright: '© 2026 زود مانباور.',
    privacyPolicy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
    staffAuth: 'مصادقة الموظفين', restricted: 'دخول مقيد لمشرفي زود مان باور',
    username: 'اسم المستخدم', password: 'كلمة المرور', enterAdmin: 'أدخل اسم المستخدم', authorizedOnly: 'دخول مصرح به فقط',
    staffPortal: 'بوابة الموظفين', logout: 'تسجيل الخروج', totalCandidates: 'إجمالي المرشحين',
    webLeads: 'طلبات الويب', activeVacancies: 'الوظائف النشطة',
    inventoryManagement: 'إدارة المخزون', visitorLogs: 'سجلات الزوار',
    newCandidate: 'مرشح جديد', editCandidate: 'تعديل:', fullName: 'الاسم الكامل', age: 'العمر', gender: 'الجنس',
    jobDesignation: 'المسمى الوظيفي', country: 'البلد', religion: 'الدين', salaryQAR: 'الراتب (ريال قطري)',
    photo: 'الصورة', cvUpload: 'السيرة الذاتية', saveRecord: 'حفظ بيانات المرشح',
    candidateDetails: 'تفاصيل المرشح', position: 'الوظيفة', salary: 'الراتب', actions: 'إجراءات',
    realtimeLogs: 'سجلات النشاط', clearLogs: 'مسح جميع السجلات',
    trafficSource: 'مصدر الزيارة', actionTaken: 'الإجراء المتخذ', timeLocal: 'الوقت',
    confirmDelete: 'تأكيد الحذف', deleteMsg: 'هل أنت متأكد من حذف هذا المرشح؟',
    cancel: 'إلغاء', yesDelete: 'نعم، احذف', english: 'English', arabic: 'العربية',
    workerType: 'نوع العامل', recruitmentWorkers: 'عمال التوظيف', returnedHousemaids: 'خادمات عائدات',
    searchCandidates: 'ابحث عن مرشحين...', searchByName: 'ابحث بالاسم أو الوظيفة أو البلد',
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
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showHirePage, setShowHirePage] = useState(false);

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
  const workerTypeRef = useRef<HTMLSelectElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

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
    formData.append('workerType', workerTypeRef.current!.value);
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
    if (workerTypeRef.current) workerTypeRef.current.value = workerTypeOptions[0];
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
    if (workerTypeRef.current) workerTypeRef.current.value = talent.workerType || workerTypeOptions[0];
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
          ? "Please contact us via WhatsApp at +94729204485"
          : "يرجى الاتصال بنا على واتساب +94729204485");

      setChatMessages((prev) => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'bot', text: chatLanguageSelected === 'en' ? "Please contact us on WhatsApp +94729204485" : "يرجى الاتصال بنا على واتساب +94729204485" }]);
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

  // Filter for Homepage hire page
  const filteredTalents = talents.filter((tal) => {
    const matchSearch = searchQuery === '' || tal.name.toLowerCase().includes(searchQuery.toLowerCase()) || tal.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !countryFilter || tal.country === countryFilter;
    return matchSearch && matchCountry;
  });

  // Filter for Admin panel with search
  const adminFilteredTalents = talents.filter((tal) => {
    const matchSearch = adminSearchQuery === '' || 
      tal.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      tal.job.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      tal.country.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchSearch;
  });

  const featuredTalents = talents.slice(0, 2);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
        <div className="text-center">
          <img src="/logo/logo.jpeg" alt="ZOD MANPOWER" className="w-24 h-24 rounded-full mx-auto mb-8 object-cover shadow-lg animate-pulse" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
    <>
      {/* Chatbot */}
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
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
          {chatOpen ? <i className="fa-solid fa-xmark text-xl"></i> : <i className="fa-solid fa-robot text-xl"></i>}
        </button>
      </div>

      {/* Login Modal */}
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

      {/* Delete Modal */}
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
          <nav className="fixed w-full z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => { setShowHirePage(false); window.scrollTo(0, 0); }}>
                <img src="/logo/logo.jpeg" alt="ZOD MANPOWER Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110" />
                <div className="text-xl font-extrabold tracking-tighter uppercase">ZOD<span className="text-[#002F66]"> MANPOWER</span></div>
              </div>
              <div className="hidden lg:flex items-center space-x-8 font-semibold text-xs uppercase tracking-widest">
                <a href="#home" onClick={() => setShowHirePage(false)} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.home}</a>
                <a href="#about" className="nav-link hover:text-[#002F66] transition-all duration-300">{t.about}</a>
                <a href="#services" className="nav-link hover:text-[#002F66] transition-all duration-300">{t.services}</a>
                <a href="#vacancies" className="nav-link hover:text-[#002F66] transition-all duration-300">{t.vacancies}</a>
                <button onClick={() => setShowHirePage(true)} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.hireNav}</button>
                <a href="https://wa.me/94729204485" onClick={() => trackLead('Nav Apply', 'Global Apply')} target="_blank" className="bg-[#002F66] text-white px-6 py-2.5 rounded-full shadow-md hover:bg-[#002060] transition-all hover:scale-105 active:scale-95">{t.applyNow}</a>
                <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-[#002F66] hover:bg-gray-200 transition-all"><i className="fa-solid fa-globe text-[10px]"></i><span>{language === 'en' ? 'العربية' : 'English'}</span></button>
              </div>
              <button className="lg:hidden text-2xl text-[#002F66]" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars-staggered"></i></button>
            </div>
          </nav>

          <div className={`mobile-sidebar ${sidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-close" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark text-[#002F66]"></i></div>
            <div className="sidebar-nav mt-8">
              <a href="#home" onClick={() => { setShowHirePage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.home}</a>
              <a href="#about" onClick={() => setSidebarOpen(false)} className="transition-all hover:translate-x-2">{t.about}</a>
              <a href="#services" onClick={() => setSidebarOpen(false)} className="transition-all hover:translate-x-2">{t.services}</a>
              <a href="#vacancies" onClick={() => setSidebarOpen(false)} className="transition-all hover:translate-x-2">{t.vacancies}</a>
              <button onClick={() => { setShowHirePage(true); setSidebarOpen(false); }} className="transition-all hover:translate-x-2 text-left">{t.hireNav}</button>
              <a href="https://wa.me/94729204485" onClick={() => { trackLead('Mobile Nav Apply', 'Global Apply'); setSidebarOpen(false); }} target="_blank" className="sidebar-apply" style={{ backgroundColor: '#002F66' }}>{t.applyNow}</a>
              <button onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setSidebarOpen(false); }} className="mt-4 w-full py-2 bg-gray-100 rounded-full text-sm font-bold text-[#002F66] hover:bg-gray-200 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-globe text-xs"></i>{language === 'en' ? 'العربية' : 'English'}</button>
            </div>
          </div>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

          {showHirePage ? (
            <div className="min-h-screen pt-28 pb-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowHirePage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-sm mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> Back to Home</button>
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
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-tag w-5 text-[#002F66]"></i><span>{talent.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}</span></div>
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
              <section id="home" className="relative pt-48 pb-32 px-6 qatar-gradient text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><i className="fa-solid fa-globe text-[40rem] absolute -top-20 -right-40 animate-spin-slow"></i></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-8 fade-in">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 animate-pulse">{t.certified}</span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] animate-slide-up">{t.heroTitle} <span className="text-amber-400">{t.heroTitleSpan}</span> {t.heroTitleEnd}</h1>
                    <p className="text-lg opacity-80 leading-relaxed max-w-lg">{t.heroDesc}</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setShowHirePage(true)} className="bg-white text-[#002F66] px-10 py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-transform duration-300">{t.forEmployers}</button>
                      <a href="#vacancies" className="bg-transparent border-2 border-white/30 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all hover:scale-105 duration-300">{t.forJobSeekers}</a>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center relative">
                    <div className="w-80 h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] rotate-12 flex items-center justify-center shadow-2xl hover:rotate-0 transition-transform duration-700 hover:scale-105"><i className="fa-solid fa-building-columns text-[10rem] opacity-20 -rotate-12"></i></div>
                    <div className="absolute -bottom-10 -left-10 p-8 bg-amber-400 rounded-3xl shadow-2xl text-[#002F66] animate-float" style={{ animationDuration: '3s' }}><div className="text-4xl font-bold">12+</div><div className="text-[10px] font-bold uppercase tracking-tighter leading-none">{t.yearsLabel}</div></div>
                  </div>
                </div>
              </section>

              {/* Stats */}
              <section className="py-16 bg-white border-b reveal">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
                  {[{ num: '5.2K', label: t.successfulPlacements }, { num: '180+', label: t.corporateClients }, { num: '24h', label: t.responseTime }, { num: '100%', label: t.complianceRate }].map((s, i) => (
                    <div key={i} className="flex items-center space-x-4 border-r border-gray-100 last:border-0 hover:translate-x-2 transition-all duration-300 group">
                      <div className="text-4xl text-[#002F66] font-black group-hover:scale-110 transition-transform">{s.num}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Candidates */}
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
                            <div className="text-[10px] text-gray-400 mt-1">{talent.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}</div>
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

              {/* About */}
              <section id="about" className="py-24 px-6 bg-white reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                  <div className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-[4rem] overflow-hidden shadow-inner"><img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="About" /></div>
                    <div className="absolute -bottom-8 -right-8 p-10 bg-[#002F66] rounded-[3rem] text-white shadow-2xl hidden md:block transition-all duration-300 hover:scale-105"><i className="fa-solid fa-quote-left text-4xl opacity-20 mb-4 block"></i><p className="font-bold text-lg italic">"Connecting People, <br />Empowering Visions."</p></div>
                  </div>
                  <div className="space-y-8">
                    <h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em]">{t.ourLegacy}</h2>
                    <h3 className="text-4xl font-bold text-slate-900 leading-tight">{t.aboutTitle}</h3>
                    <p className="text-gray-500 leading-relaxed">{t.aboutDesc}</p>
                    <ul className="space-y-4">{[t.personalizedMatching, t.directLiaison, t.multiIndustry].map((item, i) => (<li key={i} className="flex items-center space-x-3 font-bold text-sm text-slate-700 group cursor-pointer"><i className="fa-solid fa-check-circle text-[#002F66] transition-transform group-hover:scale-110"></i><span className="group-hover:translate-x-1 transition-transform">{item}</span></li>))}</ul>
                  </div>
                </div>
              </section>

              {/* Services */}
              <section id="services" className="py-24 px-6 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto text-center mb-20"><h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em] mb-4">{t.ourExpertise}</h2><h3 className="text-4xl font-bold text-slate-900">{t.comprehensiveSolutions}</h3></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                  {[{ icon: 'passport', title: t.visaTitle, desc: t.visaDesc }, { icon: 'users-gear', title: t.techTitle, desc: t.techDesc }, { icon: 'city', title: t.projectsTitle, desc: t.projectsDesc }].map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-3 border border-gray-50 cursor-pointer">
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002F66] group-hover:text-white transition-all duration-500 group-hover:rotate-6"><i className={`fa-solid fa-${s.icon} text-2xl`}></i></div>
                      <h4 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-[#002F66] transition-colors">{s.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Vacancies */}
              <section id="vacancies" className="py-24 px-6 bg-slate-900 text-white relative reveal">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"><i className="fa-solid fa-briefcase text-[50rem] absolute -bottom-40 -left-40 animate-spin-slow"></i></div>
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="text-center mb-16"><h3 className="text-4xl font-bold mb-4">{t.currentOpenings}</h3><p className="text-slate-400">{t.openingsDesc}</p></div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[{ name: 'Hospitality Waiters', count: 12, area: '5-Star Hotels, West Bay', link: 'Waiter position' }, { name: 'Security Guards', count: 25, area: 'Retail & Malls Sector', link: 'Security position' }, { name: 'Cleaning Staff', count: 40, area: 'Corporate Offices', link: 'Cleaning position' }, { name: 'Office Assistants', count: 8, area: 'Lusail Business District', link: 'Office Assistant position' }].map((v, i) => (
                      <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl" onClick={() => { trackLead('Vacancy', v.name); window.location.href = `https://wa.me/94729204485?text=Apply for ${v.link}`; }}>
                        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-[#002F66] mb-6 font-bold group-hover:scale-110 transition-transform">{v.count}</div>
                        <h5 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{v.name}</h5>
                        <p className="text-xs text-slate-500 mb-4 italic">{v.area}</p>
                        <div className="flex items-center text-[10px] font-bold text-amber-400 gap-2 group-hover:gap-3 transition-all">{t.applyViaWhatsapp} <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-24 bg-gray-50 px-6 reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                  {[{ text: t.testimonial1, author: t.author1 }, { text: t.testimonial2, author: t.author2 }, { text: t.testimonial3, author: t.author3 }].map((item, i) => (
                    <div key={i} className="space-y-6 p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      <div className="flex text-amber-400 text-xs gap-1">{[...Array(5)].map((_, j) => <i key={j} className="fa-solid fa-star"></i>)}</div>
                      <p className="text-gray-600 italic">{item.text}</p>
                      <div className="font-bold text-sm uppercase tracking-widest text-slate-900">{item.author}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="py-24 bg-white px-6 reveal">
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
              <footer className="py-24 bg-slate-900 text-white px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
                  <div className="col-span-2"><div className="text-2xl font-black uppercase mb-6 tracking-tighter">ZOD<span className="text-[#002F66]"> MANPOWER</span></div><p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">{t.footerText}</p><div className="flex space-x-4"><a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-facebook-f"></i></a><a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-linkedin-in"></i></a></div></div>
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
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.activeVacancies}</p><div className="text-4xl font-bold text-[#002F66]">4</div></div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-center"><button onClick={fetchTalents} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 hover:scale-105"><i className="fa-solid fa-rotate-right mr-2"></i> {t.refresh}</button></div>
            </div>

            {/* Admin Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder={t.searchCandidates}
                  className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-2">{t.searchByName}</p>
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
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.jobDesignation}</label><select ref={jobRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{jobOptions.map(job => <option key={job} value={job}>{job}</option>)}</select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.country}</label><select ref={countryRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{countryOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.religion}</label><select ref={religionRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all"><option value="Muslim">Muslim</option><option value="Christian">Christian</option><option value="Hindu">Hindu</option><option value="Buddhist">Buddhist</option></select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.salaryQAR}</label><input ref={salaryRef} type="number" defaultValue="0" step="100" className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.workerType}</label><select ref={workerTypeRef} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">
                      {workerTypeOptions.map(opt => <option key={opt} value={opt}>{opt === 'Recruitment Workers' ? t.recruitmentWorkers : t.returnedHousemaids}</option>)}
                    </select></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-2">{t.photo}</label><input ref={picRef} type="file" accept="image/*" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all" /></div>
                    <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-2">{t.cvUpload}</label><input ref={cvRef} type="file" accept=".pdf,image/*" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" /></div>
                    <button type="submit" className="w-full py-4 bg-[#002F66] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-[#002060] transition-all duration-300 hover:scale-105">{t.saveRecord}</button>
                  </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b">
                        <tr><th className="p-6">{t.candidateDetails}</th><th className="p-6">{t.position}</th><th className="p-6">{t.salary}</th><th className="p-6">{t.workerType}</th><th className="p-6 text-right">{t.actions}</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {adminFilteredTalents.map((talent) => (
                          <tr key={talent.id} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="p-6"><div className="flex items-center space-x-3"><img src={talent.pic} className="w-10 h-10 rounded-lg object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50')} alt={talent.name} /><div><div className="font-bold text-slate-800 text-sm">{escapeHtml(talent.name)}</div><div className="text-[9px] text-gray-400 uppercase">{escapeHtml(talent.country)}</div></div></div></td>
                            <td className="p-6"><div className="text-xs font-bold text-gray-600">{escapeHtml(talent.job)}</div></td>
                            <td className="p-6"><div className="text-xs font-bold text-gray-600">{talent.salary || 0} QAR</div></td>
                            <td className="p-6"><div className="text-xs font-bold text-gray-600">{talent.workerType === 'Returned Housemaids' ? '🔄 Returned' : '📋 Recruitment'}</div></td>
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
    </>
  );
}
