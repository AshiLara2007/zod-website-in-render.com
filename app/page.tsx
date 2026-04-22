'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  workerType: string;
  pic: string;
  cv: string;
  createdAt?: string;
  updatedAt?: string;
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

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}

const jobOptions = [
  'Driver', 'Baby sitting', 'Nurse', 'Cook', 'Domestic Worker', 'Teacher', 'House Maid'
];

const countryOptions = [
  'Indonesia', 'Sri Lanka', 'Philippines', 'Bangladesh', 'India', 'Ethiopia', 'Kenya', 'Uganda'
];

const experienceOptions = [
  '0-1 Year', '1-2 Years', '2-3 Years', '3-4 Years', '4-5 Years', '5-7 Years', '7-10 Years', '10+ Years'
];

const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

const workerTypeOptions = ['Recruitment Workers', 'Returned Housemaids'];

const GEMINI_API_KEY = 'AIzaSyCG3HaU5TO4nbtEgkzwii585nB2hcDTkW0';

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Mr. Mohamed Razeen', position: 'CEO', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: true },
  { id: '2', name: 'Ms. Fatima Al Saeed', position: 'Operations Director', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: true },
  { id: '3', name: 'Mr. Khalid Al Mansouri', position: 'Recruitment Manager', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: true },
  { id: '4', name: 'Ms. Noor Al Emadi', position: 'Client Relations Head', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: true },
  { id: '5', name: 'Mr. Youssef Hassan', position: 'Visa Processing Officer', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: false },
  { id: '6', name: 'Ms. Lina Al Kuwari', position: 'Marketing Specialist', photo: 'https://github.com/AshiLara2007/ZOD-Photos/blob/main/Unknown-person.gif?raw=true', phone: '+97455355206', isTopManagement: false },
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
    testimonial1: '"I came to Qatar through ZOD MANPOWER RECRUITMENT, and they found me a good place to work in Doha."',
    author1: '— Muhammad Ikmar., Sri Lanka',
    testimonial2: '"I came from Sri Lanka through ZOD and now work in a top company."',
    author2: '— Mohamed R., Office Admin',
    testimonial3: '"ZOD Manpower found us 50+ staff for our hotel"',
    author3: '— Fathima Sarah., Manager',
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
    houseMaids: 'House Maids', drivers: 'Drivers', nurses: 'Nurses', monthlyCleaners: 'Monthly Cleaners', returnedHousemaids: 'Returned Housemaids', alMohannadi: 'Al-Mohannadi',
    ourTeam: 'Our Team', teamTitle: 'Meet Our Team', teamDesc: 'Dedicated professionals committed to excellence.',
    topManagementTitle: 'Our Top Management Team', contact: 'Contact', viewMore: 'View More',
    ourVision: 'Our Vision', ourMission: 'Our Mission',
    visionText: 'To be the most trusted manpower solutions provider in the Middle East.',
    missionText: 'To provide ethical, transparent, and efficient recruitment services.',
    experience: 'Experience', driversJob: 'Drivers', babysitting: 'Baby sitting', nursesJob: 'Nurses', cooks: 'Cook', domesticWorker: 'Domestic Worker', teacher: 'Teacher',
    ourServicesTitle: 'Our Expertise', ourServicesDesc: 'Specialized recruitment solutions.',
    viewCandidates: 'View Candidates',
    discount1: 'Welcome To ZOD MANPOWER', discount2: 'Offers Will Be Coming Soon', discount3: 'Contact Us For Get More Informations', discountOffer: '🔥 LIMITED OFFER',
    backToHome: 'Back to Home', maritalStatus: 'Marital Status', single: 'Single', married: 'Married', divorced: 'Divorced', widowed: 'Widowed',
    ourJourney: 'Our Journey', ourLocation: 'Our Location', whatClientsSay: 'What Our Clients Say',
    brandName: 'ZOD MANPOWER RECRUITMENT',
    candidateAdded: 'Candidate Added Successfully!', candidateUpdated: 'Candidate Updated Successfully!', candidateDeleted: 'Candidate Deleted Successfully!',
    errorOccurred: 'An error occurred', saving: 'Saving...', deleting: 'Deleting...',
    workerType: 'Worker Type', recruitmentWorkers: 'Recruitment Workers', returnedHousemaidsType: 'Returned Housemaids',
    showReturnedOnly: 'Show Returned Housemaids Only',
    adminSearch: 'Search Candidates...',
    searchByName: 'Search by name, job, or country',
    workerTypeColumn: 'Worker Type',
    appComingSoon: 'Mobile App Coming Soon',
    comingSoonMsg: 'Our mobile app is coming soon! Stay tuned.',
    playStore: 'Google Play',
    appStore: 'App Store',
    clearAllCVs: 'Clear All CVs',
    confirmClearCVs: 'Are you sure? This will remove all CV links from all candidates.',
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
    houseMaids: 'خادمات منازل', drivers: 'سائقين', nurses: 'ممرضين', monthlyCleaners: 'عمال نظافة شهري', returnedHousemaids: 'خادمات عائدات', alMohannadi: 'المهندي',
    ourTeam: 'فريقنا', teamTitle: 'تعرف على فريقنا', teamDesc: 'محترفون ملتزمون بالتميز.',
    topManagementTitle: 'فريق الإدارة العليا', contact: 'اتصل', viewMore: 'اقرأ المزيد',
    ourVision: 'رؤيتنا', ourMission: 'مهمتنا',
    visionText: 'أن نكون مزود حلول القوى العاملة الأكثر ثقة.',
    missionText: 'تقديم خدمات توظيف أخلاقية وشفافة.',
    experience: 'الخبرة', driversJob: 'سائقين', babysitting: 'رعاية أطفال', nursesJob: 'ممرضين', cooks: 'طهاة', domesticWorker: 'عمال منازل', teacher: 'معلمين',
    ourServicesTitle: 'خبراتنا', ourServicesDesc: 'حلول توظيف متخصصة.',
    viewCandidates: 'عرض المرشحين',
    discount1: 'أهلاً بكم في شركة زود للقوى العاملة', discount2: 'ستتوفر العروض قريباً', discount3: 'تواصل معنا للحصول على مزيد من المعلومات', discountOffer: '🔥 عرض محدود',
    backToHome: 'العودة إلى الرئيسية', maritalStatus: 'الحالة الاجتماعية', single: 'أعزب', married: 'متزوج', divorced: 'مطلق', widowed: 'أرمل',
    ourJourney: 'رحلتنا', ourLocation: 'موقعنا', whatClientsSay: 'ماذا يقول عملاؤنا',
    brandName: 'زود مان باور للتوظيف',
    candidateAdded: 'تم إضافة المرشح بنجاح!', candidateUpdated: 'تم تحديث المرشح بنجاح!', candidateDeleted: 'تم حذف المرشح بنجاح!',
    errorOccurred: 'حدث خطأ', saving: 'جاري الحفظ...', deleting: 'جاري الحذف...',
    workerType: 'نوع العامل', recruitmentWorkers: 'عمال التوظيف', returnedHousemaidsType: 'خادمات عائدات',
    showReturnedOnly: 'إظهار الخادمات العائدات فقط',
    adminSearch: 'ابحث عن مرشحين...',
    searchByName: 'ابحث بالاسم أو الوظيفة أو البلد',
    workerTypeColumn: 'نوع العامل',
    appComingSoon: 'تطبيق الجوال قريباً',
    comingSoonMsg: 'تطبيقنا للجوال قادم قريباً! ترقبوا.',
    playStore: 'متجر بلاي',
    appStore: 'متجر آبل',
    clearAllCVs: 'مسح جميع السير الذاتية',
    confirmClearCVs: 'هل أنت متأكد؟ سيؤدي هذا إلى إزالة جميع روابط السيرة الذاتية من جميع المرشحين.',
  }
};

const ToastNotification = ({ toast, onClose }: { toast: Toast; onClose: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-exclamation';
      case 'warning': return 'fa-triangle-exclamation';
      default: return 'fa-circle-info';
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'from-emerald-500 to-teal-600';
      case 'error': return 'from-red-500 to-rose-600';
      case 'warning': return 'from-amber-500 to-orange-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-[200] animate-slide-in-right ${toast.type === 'error' ? 'animate-shake' : ''}`}>
      <div className={`bg-gradient-to-r ${getBgColor()} text-white rounded-2xl shadow-2xl p-4 min-w-[300px] max-w-md flex items-start gap-3 backdrop-blur-sm border border-white/20`}>
        <div className="flex-shrink-0">
          <i className={`fa-solid ${getIcon()} text-2xl`}></i>
        </div>
        <div className="flex-1">
          {toast.title && <h4 className="font-bold text-sm mb-1 tracking-wide">{toast.title}</h4>}
          <p className="text-sm opacity-95 leading-relaxed">{toast.message}</p>
        </div>
        <button onClick={() => onClose(toast.id)} className="flex-shrink-0 text-white/60 hover:text-white transition-all hover:rotate-90 duration-300">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const t = translations[language];
  const [languageSelected, setLanguageSelected] = useState(false);
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
  const [showOurTeamPage, setShowOurTeamPage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReturnedOnly, setShowReturnedOnly] = useState(false);

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
  const workerTypeRef = useRef<HTMLSelectElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const addToast = (type: Toast['type'], message: string, title?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, title }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
      addToast('error', t.errorOccurred, 'Network Error');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (languageSelected) {
      fetchTalents();
    }
  }, [languageSelected, fetchTalents]);

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
    if (confirm(t.clearLogs)) { setLeads([]); localStorage.setItem('zod_activity_leads', '[]'); addToast('info', 'Logs cleared successfully'); }
  };

  const clearAllCVs = async () => {
    if (!confirm(t.confirmClearCVs)) return;
    try {
      const res = await fetch('/api/talents/clear-cvs', { method: 'POST' });
      if (res.ok) {
        await fetchTalents();
        addToast('success', 'All CVs cleared successfully!', 'CV Clear');
      } else {
        addToast('error', 'Failed to clear CVs', 'Error');
      }
    } catch {
      addToast('error', 'Network error', 'Error');
    }
  };

  const handleDiscountClick = (discountText: string) => {
    const whatsappNumber = '97455355206';
    const message = `Hi! I'm interested in the offer: ${discountText}. Can you please provide more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackLead('Discount Banner', discountText);
    addToast('info', `Redirecting to WhatsApp for ${discountText}`, 'Special Offer');
  };

  const handleHireClick = (talent: Talent, source: string) => {
    const whatsappNumber = '97455355206';
    const cvLink = `${window.location.origin}/api/cv/${talent.id}`;
    const message = `Hi! I'm interested in hiring ${talent.name} (${talent.job}).\n\n📄 CV Link: ${cvLink}\n🌍 Country: ${talent.country}\n💰 Salary: ${talent.salary} QAR\n⭐ Experience: ${talent.experience}\n👤 Gender: ${talent.gender}, Age: ${talent.age}\n💍 Marital Status: ${talent.maritalStatus}\n\nPlease provide more details about this candidate.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackLead(source, `Hire: ${talent.name}`);
    addToast('success', `Inquiry sent for ${talent.name} with CV link`, 'Application Started');
  };

  const handleExternalLink = (url: string, source: string) => {
    trackLead('External Link', source);
    window.open(url, '_blank');
    addToast('info', `Redirecting to ${source}`, 'External Link');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    formData.append('workerType', workerTypeRef.current!.value);
    if (picRef.current?.files?.[0]) formData.append('tPic', picRef.current.files[0]);
    if (cvRef.current?.files?.[0]) formData.append('tCv', cvRef.current.files[0]);
    try {
      const res = await fetch('/api/talents', { method: 'POST', body: formData });
      if (res.ok) {
        resetForm();
        await fetchTalents();
        addToast('success', editTalent ? t.candidateUpdated : t.candidateAdded, 'Success');
      }
      else { const err = await res.json(); addToast('error', err.error || t.errorOccurred, 'Error'); }
    } catch {
      addToast('error', 'Network error. Please try again.', 'Connection Error');
    } finally {
      setIsSubmitting(false);
    }
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
    if (workerTypeRef.current) workerTypeRef.current.value = workerTypeOptions[0];
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
    if (workerTypeRef.current) workerTypeRef.current.value = talent.workerType || workerTypeOptions[0];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('info', `Editing ${talent.name}`, 'Edit Mode');
  };

  const confirmDelete = (id: string) => { setDeleteTargetId(id); setDeleteModalOpen(true); };

  const performDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/talents/${deleteTargetId}`, { method: 'DELETE' });
      await fetchTalents();
      addToast('success', t.candidateDeleted, 'Deleted');
    } catch (err) {
      addToast('error', t.errorOccurred, 'Delete Failed');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setIsDeleting(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = document.getElementById('adminUser') as HTMLInputElement;
    const p = document.getElementById('adminPass') as HTMLInputElement;
    if (!u || !p) return;
    if (u.value === 'admin' && p.value === '1978') {
      setAdminActive(true); setLoginModalOpen(false); u.value = ''; p.value = '';
      addToast('success', 'Welcome back, Admin!', 'Login Successful');
    } else {
      addToast('error', 'Invalid credentials. Try again', 'Access Denied');
      u.value = '';
      p.value = '';
    }
  };

  const handleQuickHire = (category: string) => {
    trackLead('Quick Hire', category);
    setShowHirePage(true);
    setShowOurTeamPage(false);
    setShowAboutPage(false);
    setSearchQuery(category);
    addToast('info', `Browsing ${category} candidates`, 'Category Selected');
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
    loadLeads();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', reveal); reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, [languageSelected]);

  const escapeHtml = (str: string) => str.replace(/[&<>]/g, (m) => (m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'));

  const sortedTalents = [...talents].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const featuredTalents = sortedTalents.slice(0, 6);

  const filteredTalents = talents.filter((tal) => {
    const matchSearch = searchQuery === '' || tal.name.toLowerCase().includes(searchQuery.toLowerCase()) || tal.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !countryFilter || tal.country === countryFilter;
    const matchReturned = !showReturnedOnly || tal.workerType === 'Returned Housemaids';
    return matchSearch && matchCountry && matchReturned;
  });

  const adminFilteredTalents = talents.filter((tal) => {
    const matchSearch = adminSearchQuery === '' ||
      tal.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      tal.job.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      tal.country.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchSearch;
  });

  const topManagementTeam = teamMembers.filter(member => member.isTopManagement);
  const regularTeam = teamMembers.filter(member => !member.isTopManagement);

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  // Language selection screen
  if (!languageSelected) {
    return (
      <div dir={dir} className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628] z-[200] flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl"></div>
            <img src="/logo/logo.jpeg" alt="ZOD MANPOWER" className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-6 md:mb-8 object-cover shadow-2xl relative z-10 animate-float border-2 border-blue-400/50" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-3 md:mb-4 animate-bounce">{language === 'en' ? 'Welcome To Doha' : 'مرحباً بكم في الدوحة'}</h1>
          <p className="text-lg md:text-2xl text-blue-200/80 mb-6 md:mb-8">{t.brandLoading}</p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
            <button onClick={() => { setLanguage('en'); setLanguageSelected(true); }} className="px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl">English</button>
            <button onClick={() => { setLanguage('ar'); setLanguageSelected(true); }} className="px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl">العربية</button>
          </div>
        </div>
      </div>
    );
  }

  // Main return - NO extra braces before this!
  return (
    <div dir={dir} className={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
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
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glass-nav { background: rgba(10, 22, 40, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(59,130,246,0.3); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #3b82f6, #6366f1); transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .qatar-gradient { background: linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%); }
        .mobile-sidebar { position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background: rgba(10,22,40,0.95); backdrop-filter: blur(12px); z-index: 1000; transition: right 0.3s ease; box-shadow: -2px 0 20px rgba(59,130,246,0.1); padding: 20px; overflow-y: auto; border-left: 1px solid rgba(59,130,246,0.3); }
        .mobile-sidebar.active { right: 0; }
        .sidebar-close { position: absolute; top: 20px; right: 20px; font-size: 24px; cursor: pointer; color: #3b82f6; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 20px; margin-top: 60px; }
        .sidebar-nav a, .sidebar-nav button { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #fff; padding: 10px 0; border-bottom: 1px solid rgba(59,130,246,0.2); transition: all 0.3s; }
        .sidebar-nav a:hover, .sidebar-nav button:hover { color: #3b82f6; transform: translateX(5px); }
        .sidebar-apply { background: linear-gradient(90deg, #3b82f6, #6366f1); color: white; padding: 12px; border-radius: 30px; text-align: center; margin-top: 20px; font-weight: bold; }
        .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 999; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
        .sidebar-overlay.active { opacity: 1; visibility: visible; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-item.active .fa-plus { transform: rotate(45deg); }
        .web3-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(59,130,246,0.2); border-radius: 1.5rem; transition: all 0.3s ease; }
        .web3-card:hover { background: rgba(255,255,255,0.06); border-color: #3b82f6; transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(59,130,246,0.2); }
        .gradient-border { position: relative; background: linear-gradient(135deg, #3b82f6, #6366f1, #3b82f6); background-size: 200% 200%; animation: gradientShift 3s ease infinite; }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @media (max-width: 640px) {
          .container-padding { padding-left: 1rem; padding-right: 1rem; }
          .text-responsive-hero { font-size: 1.8rem !important; }
          .text-responsive-title { font-size: 1.3rem !important; }
          .grid-responsive { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .nav-text { font-size: 0.65rem !important; }
          .discount-text { font-size: 0.7rem !important; }
          .discount-padding { padding: 0.4rem 0.8rem !important; }
          .app-buttons { flex-direction: column; width: 100%; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .grid-responsive-tablet { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1025px) {
          .grid-responsive-desktop { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div className="fixed top-16 right-0 z-[200] space-y-3">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Chat Button and Modal */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-72 sm:w-80 md:w-96 bg-[#0a1628]/90 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-blue-500/30 flex flex-col overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><i className="fa-solid fa-robot text-white"></i></div><div className="text-white font-bold text-sm">ZOD AI Assistant</div></div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-900/50 max-h-[400px]">
              {!chatLanguageSelected ? (
                <div className="text-center py-6 space-y-4"><p className="text-gray-300 font-bold">Select Language</p><div className="flex gap-3 justify-center"><button onClick={() => startChat('en')} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-bold">English</button><button onClick={() => startChat('ar')} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-bold">العربية</button></div></div>
              ) : (
                <>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-blue-500/30'}`}>{msg.text}</div>
                    </div>
                  ))}
                  {chatLoading && (<div className="flex justify-start"><div className="bg-gray-800 border border-blue-500/30 rounded-xl px-4 py-3"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block animate-bounce mx-0.5"></span><span className="w-2 h-2 bg-blue-400 rounded-full inline-block animate-bounce mx-0.5" style={{animationDelay: '0.15s'}}></span><span className="w-2 h-2 bg-blue-400 rounded-full inline-block animate-bounce mx-0.5" style={{animationDelay: '0.3s'}}></span></div></div>)}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
            {chatLanguageSelected && (
              <div className="px-3 py-3 border-t border-blue-500/30 bg-gray-900 flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleChatKey} placeholder={chatLanguageSelected === 'en' ? "Ask me anything..." : "اسألني أي شيء..."} className="flex-1 px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-xl text-sm outline-none focus:border-blue-500 text-white" disabled={chatLoading} />
                <button onClick={sendChatMessage} disabled={chatLoading} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition"><i className="fa-solid fa-paper-plane"></i></button>
              </div>
            )}
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">{chatOpen ? <i className="fa-solid fa-xmark text-xl"></i> : <i className="fa-regular fa-message text-xl"></i>}</button>
      </div>

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-[#0a1628] p-6 md:p-10 rounded-[1.5rem] w-full max-w-md shadow-2xl border border-blue-500/30">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-blue-400"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
            <div className="text-center mb-6"><i className="fa-solid fa-user-shield text-5xl text-blue-400 mb-4"></i><h2 className="text-2xl font-bold text-white">{t.staffAuth}</h2><p className="text-sm text-gray-400">{t.restricted}</p></div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div><label className="text-xs font-bold text-blue-400 ml-1">{t.username}</label><input type="text" id="adminUser" placeholder={t.enterAdmin} className="w-full p-4 bg-gray-800 border border-blue-500/30 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white" required /></div>
              <div><label className="text-xs font-bold text-blue-400 ml-1">{t.password}</label><input type="password" id="adminPass" placeholder="••••••••" className="w-full p-4 bg-gray-800 border border-blue-500/30 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white" required /></div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg transition">{t.authorizedOnly}</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#0a1628] p-6 rounded-xl max-w-md w-full border border-blue-500/30">
            <div className="text-center"><div className="mx-auto w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4"><i className="fa-solid fa-trash-can text-red-400 text-xl"></i></div><h3 className="text-lg font-bold text-white mb-2">{t.confirmDelete}</h3><p className="text-sm text-gray-400 mb-6">{t.deleteMsg}</p><div className="flex gap-3 justify-center"><button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600">{t.cancel}</button><button onClick={performDelete} className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700">{t.yesDelete}</button></div></div>
          </div>
        </div>
      )}

      {!adminActive ? (
        <div className="public-section">
          {/* Discount Marquee */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 pt-20 pb-2 px-4 gradient-border">
            <div className="max-w-7xl mx-auto overflow-hidden whitespace-nowrap">
              <div className={`inline-flex gap-8 ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
                <div onClick={() => handleDiscountClick(t.discount1)} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition mx-2"><span className="text-white font-bold text-sm">✨ {t.discount1}</span></div>
                <div onClick={() => handleDiscountClick(t.discount2)} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition mx-2"><span className="text-white font-bold text-sm">🎉 {t.discount2}</span></div>
                <div onClick={() => handleDiscountClick(t.discount3)} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer hover:bg-white/30 transition mx-2"><span className="text-white font-bold text-sm">💎 {t.discount3}</span></div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="fixed w-full z-50 glass-nav top-0">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); window.scrollTo(0,0); }}>
                <img src="/logo/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg border border-blue-400/30" />
                <div className="text-xl font-black uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{t.brandName}</div>
              </div>
              <div className="hidden lg:flex items-center gap-6 text-xs uppercase font-semibold">
                <a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link text-white hover:text-blue-400">{t.home}</a>
                <a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link text-white hover:text-blue-400">{t.about}</a>
                <a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link text-white hover:text-blue-400">{t.services}</a>
                <button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); }} className="nav-link text-white hover:text-blue-400">{t.ourTeam}</button>
                <button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link text-white hover:text-blue-400">{t.hireNav}</button>
                <a href="https://wa.me/97455355206" target="_blank" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full hover:scale-105 transition">{t.contactUs}</a>
                <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full text-blue-400 border border-blue-500/30"><i className="fa-solid fa-globe"></i>{language === 'en' ? 'العربية' : 'English'}</button>
              </div>
              <button className="lg:hidden text-2xl text-blue-400" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars"></i></button>
            </div>
          </nav>

          {/* Mobile Sidebar */}
          <div className={`mobile-sidebar ${sidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-close" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark"></i></div>
            <div className="sidebar-nav"><a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }}>{t.home}</a><a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }}>{t.about}</a><a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }}>{t.services}</a><button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); setSidebarOpen(false); }}>{t.ourTeam}</button><button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }}>{t.hireNav}</button><a href="https://wa.me/97455355206" target="_blank" className="sidebar-apply">{t.contactUs}</a><button onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setSidebarOpen(false); }} className="mt-4 w-full py-2 bg-gray-800 rounded-full text-sm font-bold text-blue-400 border border-blue-500/30">🌐 {language === 'en' ? 'العربية' : 'English'}</button></div>
          </div>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

          {showOurTeamPage ? (
            <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c]">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowOurTeamPage(false)} className="flex items-center gap-2 text-blue-400 mb-8"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent text-center mb-4">{t.teamTitle}</h3>
                <p className="text-gray-400 text-center mb-12">{t.teamDesc}</p>
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                  {topManagementTeam.map(m => (
                    <div key={m.id} className="bg-[#0a1628]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-blue-500/30">
                      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-center items-center rounded-t-2xl"><img src={m.photo} className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover" /></div>
                      <div className="p-4 text-center"><h4 className="font-bold text-xl text-white">{m.name}</h4><p className="text-blue-400 text-sm">{m.position}</p><a href={`https://wa.me/${m.phone}`} className="inline-flex mt-3 bg-green-600 text-white px-4 py-1 rounded-full text-sm hover:scale-105 transition"><i className="fa-brands fa-whatsapp mr-2"></i> {t.contact}</a></div>
                    </div>
                  ))}
                </div>
                <div><h4 className="text-xl font-bold text-blue-400 text-center mb-8">Our Dedicated Team</h4><div className="grid md:grid-cols-3 gap-4">{regularTeam.map(m => (<div key={m.id} className="bg-[#0a1628]/50 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition flex items-center gap-3 border border-blue-500/30"><img src={m.photo} className="w-12 h-12 rounded-full object-cover border border-blue-400/50" /><div><h5 className="font-bold text-white">{m.name}</h5><p className="text-blue-400 text-xs">{m.position}</p></div><a href={`https://wa.me/${m.phone}`} className="text-green-400 hover:text-green-300 ml-auto"><i className="fa-brands fa-whatsapp text-xl"></i></a></div>))}</div></div>
              </div>
            </div>
          ) : showAboutPage ? (
            <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c]">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowAboutPage(false)} className="flex items-center gap-2 text-blue-400 mb-8"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="bg-[#0a1628]/50 backdrop-blur-sm rounded-3xl p-10 border border-blue-500/30"><div className="grid md:grid-cols-2 gap-12"><div><h3 className="text-3xl font-bold text-blue-400 mb-4">{t.ourVision}</h3><p className="text-gray-300">{t.visionText}</p></div><div><h3 className="text-3xl font-bold text-blue-400 mb-4">{t.ourMission}</h3><p className="text-gray-300">{t.missionText}</p></div></div><div className="mt-8 pt-6 border-t border-blue-500/30"><h3 className="text-2xl font-bold text-white mb-3">{t.ourJourney}</h3><p className="text-gray-400">{language === 'en' ? 'ZOD Manpower, located in Doha, Qatar, is a recruitment agency specializing in supplying staff...' : 'شركة زود للتوظيف، ومقرها الدوحة، قطر، هي وكالة توظيف متخصصة...'}</p></div></div>
              </div>
            </div>
          ) : showHirePage ? (
            <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c]">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-400 mb-8"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="flex flex-wrap justify-between items-end mb-8 gap-4"><div><h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{t.hireTitle}</h3><p className="text-gray-400">{t.hireDesc}</p></div><div className="flex gap-3 flex-wrap"><input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-3 bg-gray-800 border border-blue-500/30 rounded-xl text-white w-64" /><select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="p-3 bg-gray-800 border border-blue-500/30 rounded-xl text-white"><option value="">{t.allCountries}</option>{countryOptions.map(c => <option key={c}>{c}</option>)}</select><label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-blue-500/30 rounded-xl cursor-pointer"><input type="checkbox" checked={showReturnedOnly} onChange={(e) => setShowReturnedOnly(e.target.checked)} className="w-4 h-4 text-blue-500 rounded" /><span className="text-sm text-gray-300">{t.showReturnedOnly}</span></label><button onClick={fetchTalents} className="px-4 py-3 bg-gray-800 border border-blue-500/30 rounded-xl text-blue-400"><i className="fa-solid fa-rotate-right"></i></button></div></div>
                {loading ? <div className="grid grid-cols-3 gap-6 text-gray-400">Loading...</div> : filteredTalents.length === 0 ? <div className="text-center py-24 text-gray-500">No candidates found</div> : (<div className="grid md:grid-cols-3 gap-8">{filteredTalents.map(t => (<div key={t.id} className="web3-card bg-gray-800/30 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col h-full"><img src={t.pic} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-blue-400/30" /><Link href={`/candidate/${t.id}`}><h4 className="font-bold text-xl text-white hover:text-blue-400 transition">{t.name}</h4></Link><p className="text-blue-400 font-bold text-sm">{t.job}</p><div className="mt-4 space-y-2 text-xs text-gray-400"><i className="fa-solid fa-earth-asia w-5 text-blue-400"></i> {t.country}<br /><i className="fa-solid fa-user w-5 text-blue-400"></i> {t.gender}, {t.age}<br /><i className="fa-solid fa-money-bill-wave w-5 text-blue-400"></i> {t.salary} QAR</div><div className="flex gap-2 mt-4"><a href={t.cv} target="_blank" className="flex-1 py-2 bg-gray-700 text-center rounded-xl text-xs text-white hover:bg-gray-600 transition">CV</a><button onClick={() => handleHireClick(t, 'Hire')} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs">Hire</button></div></div>))}</div>)}
              </div>
            </div>
          ) : (
            // HOME PAGE MAIN CONTENT
            <>
              <section id="home" className="relative pt-32 pb-32 px-4 qatar-gradient text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10"><i className="fa-solid fa-globe text-[40rem] absolute -top-40 -right-40 animate-spin-slow text-blue-400"></i></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-6 animate-fade-in-up"><span className="inline-block px-4 py-1 bg-blue-500/20 backdrop-blur-md rounded-full text-xs border border-blue-400/50 text-blue-300">{t.certified}</span><h1 className="text-5xl md:text-7xl font-bold">{t.heroTitle} <span className="text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">{t.heroTitleSpan}</span> {t.heroTitleEnd}</h1><p className="text-lg text-gray-300">{t.heroDesc}</p><div className="flex gap-4 flex-wrap"><button onClick={() => handleQuickHire('House Maid')} className="bg-blue-500/20 backdrop-blur-md border border-blue-400/50 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-500 hover:text-white transition">🏠 {t.houseMaids}</button><button onClick={() => handleQuickHire('Driver')} className="bg-blue-500/20 backdrop-blur-md border border-blue-400/50 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-500 hover:text-white transition">🚗 {t.drivers}</button><button onClick={() => handleQuickHire('Nurse')} className="bg-blue-500/20 backdrop-blur-md border border-blue-400/50 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-500 hover:text-white transition">🏥 {t.nurses}</button></div></div>
                  <div className="hidden md:flex justify-center relative"><div className="w-80 h-80 bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 rounded-[4rem] rotate-12 flex items-center justify-center"><i className="fa-solid fa-building-columns text-[10rem] opacity-20 text-blue-400"></i></div><div className="absolute -bottom-10 -left-10 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl text-white animate-float"><div className="text-4xl font-bold">12+</div><div className="text-xs">{t.yearsLabel}</div></div></div>
                </div>
              </section>

              <section className="py-16 bg-[#0a1628] border-b border-blue-500/20 reveal"><div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-10">{[{ num: '9.2K', label: t.successfulPlacements }, { num: '1.8K+', label: t.corporateClients }, { num: '24h', label: t.responseTime }, { num: '98.2%', label: t.complianceRate }].map((s,i) => (<div key={i} className="flex items-center gap-4"><div className="text-4xl text-blue-400 font-black">{s.num}</div><div className="text-xs uppercase font-bold text-gray-500">{s.label}</div></div>))}</div></section>

              <section className="py-16 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] px-4 reveal"><div className="max-w-7xl mx-auto"><div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{t.featuredCandidates}</h3><button onClick={() => setShowHirePage(true)} className="text-blue-400 text-sm group">{t.viewAllCandidates} <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i></button></div><div className="grid md:grid-cols-3 gap-8">{featuredTalents.map(t => (<div key={t.id} className="web3-card bg-gray-800/30 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all"><img src={t.pic} className="w-20 h-20 rounded-2xl mb-4 border border-blue-400/30" /><Link href={`/candidate/${t.id}`}><h4 className="font-bold text-xl text-white hover:text-blue-400 transition">{t.name}</h4></Link><p className="text-blue-400 text-sm">{t.job}</p><div className="mt-4 space-y-1 text-xs text-gray-400"><i className="fa-solid fa-earth-asia w-5 text-blue-400"></i> {t.country}<br /><i className="fa-solid fa-user w-5 text-blue-400"></i> {t.gender}, {t.age}<br /><i className="fa-solid fa-money-bill-wave w-5 text-blue-400"></i> {t.salary} QAR</div><div className="flex gap-2 mt-4"><a href={t.cv} target="_blank" className="flex-1 py-2 bg-gray-700 text-center rounded-xl text-xs text-white hover:bg-gray-600 transition">CV</a><button onClick={() => handleHireClick(t, 'Featured')} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs">Hire</button></div></div>))}</div></div></section>

              <section id="about" className="py-24 px-4 bg-[#0a1628] reveal"><div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center"><div><img src="https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD.jpg" className="rounded-[4rem] shadow-xl border border-blue-500/30" /></div><div><h2 className="text-sm text-blue-400 uppercase tracking-[0.3em]">{t.ourLegacy}</h2><h3 className="text-4xl font-bold text-white mt-2">{t.aboutTitle}</h3><p className="text-gray-400 mt-4">{t.aboutDesc}</p><button onClick={() => setShowAboutPage(true)} className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition">{t.viewMore}</button></div></div></section>

              <section id="services" className="py-24 px-4 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] reveal"><div className="text-center mb-16"><h2 className="text-sm text-blue-400 uppercase">{t.ourExpertise}</h2><h3 className="text-4xl font-bold text-white">{t.comprehensiveSolutions}</h3></div><div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">{[{ icon: 'passport', title: t.visaTitle, desc: t.visaDesc }, { icon: 'users-gear', title: t.techTitle, desc: t.techDesc }, { icon: 'city', title: t.projectsTitle, desc: t.projectsDesc }].map((s,i) => (<div key={i} className="bg-gray-800/30 p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group border border-blue-500/30"><div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 transition"><i className={`fa-solid fa-${s.icon} text-2xl text-blue-400`}></i></div><h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">{s.title}</h4><p className="text-gray-400 text-sm">{s.desc}</p></div>))}</div></section>

              <section className="py-16 px-4 bg-[#0a1628] reveal"><div className="text-center mb-8"><h3 className="text-2xl font-bold text-white">{t.ourLocation}</h3><p className="text-gray-400">ZOD MANPOWER RECRUITMENT, Doha, Qatar</p></div><div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-blue-500/30"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.756850059207!2d51.451755486019955!3d25.24511337222303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45da725e22a337%3A0xbea50deacb9863fc!2sZOD%20MANPOWER%20RECRUITMENT!5e0!3m2!1sen!2sqa!4v1776013064557!5m2!1sen!2sqa" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe></div></section>

              <section className="py-20 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] px-4 reveal"><h3 className="text-3xl font-bold text-center mb-12 text-white">{t.whatClientsSay}</h3><div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">{[{ text: t.testimonial1, author: t.author1 }, { text: t.testimonial2, author: t.author2 }, { text: t.testimonial3, author: t.author3 }].map((ts,i) => (<div key={i} className="bg-gray-800/30 p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-blue-500/30"><i className="fa-solid fa-quote-left text-3xl text-blue-400/30 mb-4"></i><p className="text-gray-300">{ts.text}</p><p className="font-bold text-blue-400 mt-4">{ts.author}</p></div>))}</div></section>

              <section className="py-20 bg-[#0a1628] px-4 reveal"><div className="max-w-5xl mx-auto"><h3 className="text-3xl font-bold text-center mb-12 text-white">{t.faqTitle}</h3><div className="grid md:grid-cols-2 gap-6">{[{ q: t.faqQ1, a: t.faqA1 }, { q: t.faqQ2, a: t.faqA2 }, { q: t.faqQ3, a: t.faqA3 }, { q: t.faqQ4, a: t.faqA4 }].map((faq,i) => (<div key={i} className="bg-gray-800/30 p-6 rounded-2xl cursor-pointer faq-item border border-blue-500/30" onClick={(e) => { const el = e.currentTarget; el.classList.toggle('active'); const ans = el.querySelector('.faq-answer'); if (ans) ans.style.maxHeight = el.classList.contains('active') ? ans.scrollHeight + 'px' : '0px'; }}><h5 className="font-bold flex justify-between text-white">{faq.q}<i className="fa-solid fa-plus text-blue-400"></i></h5><div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 text-gray-400 text-sm mt-2">{faq.a}</div></div>))}</div></div></section>

              <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><div className="text-center"><i className="fa-solid fa-mobile-screen-button text-3xl animate-pulse"></i><h3 className="text-2xl font-bold mt-2">{t.appComingSoon}</h3><p className="text-blue-100">{t.comingSoonMsg}</p><div className="flex justify-center gap-4 mt-4"><button onClick={() => addToast('info', 'Coming soon!', 'App')} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full flex items-center gap-2 transition"><i className="fa-brands fa-android"></i> {t.playStore}</button><button onClick={() => addToast('info', 'Coming soon!', 'App')} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full flex items-center gap-2 transition"><i className="fa-brands fa-apple"></i> {t.appStore}</button></div></div></section>

              <footer className="py-20 bg-[#0a1628] text-white px-4 border-t border-blue-500/30"><div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-blue-500/20 pb-12"><div className="col-span-2"><img src="/logo/logo.jpeg" className="w-12 h-12 rounded-xl mb-4 border border-blue-400/30" /><p className="text-gray-500 text-sm">{t.footerText}</p></div><div><h6 className="font-bold text-xs text-blue-400 uppercase tracking-wider mb-4">{t.quickLinks}</h6><ul className="space-y-2 text-xs text-gray-500"><li><a href="#about" className="hover:text-blue-400 transition">{t.aboutDoha}</a></li><li><a href="#services" className="hover:text-blue-400 transition">{t.clientServices}</a></li><li><button onClick={() => setShowHirePage(true)} className="hover:text-blue-400 transition">{t.browseCVs}</button></li></ul></div><div><h6 className="font-bold text-xs text-blue-400 uppercase tracking-wider mb-4">{t.internal}</h6><button onClick={() => setLoginModalOpen(true)} className="border border-blue-500/30 px-4 py-2 rounded-xl text-xs hover:bg-blue-500 hover:text-white transition"><i className="fa-solid fa-lock mr-2"></i>{t.adminPortal}</button></div></div><div className="max-w-7xl mx-auto pt-8 flex justify-between text-[10px] text-gray-600"><p>{t.copyright}</p><div className="flex gap-6"><a href="#" className="hover:text-blue-400 transition">{t.privacyPolicy}</a><a href="#" className="hover:text-blue-400 transition">{t.terms}</a></div></div></footer>
            </>
          )}
        </div>
      ) : (
        // Admin Panel
        <div className="admin-section min-h-screen bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] pb-20">
          <nav className="bg-[#0a1628]/90 backdrop-blur-sm border-b border-blue-500/30 px-4 py-3 sticky top-0 z-50"><div className="max-w-7xl mx-auto flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-gears text-white text-xs"></i></div><span className="font-bold text-sm text-white">{t.staffPortal}</span></div><div className="flex gap-2"><button onClick={clearAllCVs} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-xs transition"><i className="fa-solid fa-trash-alt mr-1"></i> {t.clearAllCVs}</button><button onClick={() => setAdminActive(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-xs">{t.logout}</button></div></div></nav>
          <div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-4 gap-6 mb-8"><div className="bg-gray-800/50 p-6 rounded-2xl border border-blue-500/30"><p className="text-xs text-blue-400">{t.totalCandidates}</p><div className="text-3xl font-bold text-white">{talents.length}</div></div><div className="bg-gray-800/50 p-6 rounded-2xl border border-blue-500/30"><p className="text-xs text-blue-400">{t.webLeads}</p><div className="text-3xl font-bold text-indigo-400">{leads.length}</div></div><div className="bg-gray-800/50 p-6 rounded-2xl border border-blue-500/30"><p className="text-xs text-blue-400">{t.activeVacancies}</p><div className="text-3xl font-bold text-white">0</div></div><div className="bg-gray-800/50 p-6 rounded-2xl border border-blue-500/30 flex items-center"><button onClick={fetchTalents} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-xs"><i className="fa-solid fa-rotate-right mr-1"></i> {t.refresh}</button></div></div>
          <div className="mb-6"><input type="text" placeholder={t.adminSearch} value={adminSearchQuery} onChange={(e) => setAdminSearchQuery(e.target.value)} className="w-full max-w-md p-3 pl-10 bg-gray-800 border border-blue-500/30 rounded-2xl text-white" /><i className="fa-solid fa-magnifying-glass relative left-8 top-[-28px] text-blue-400"></i></div>
          <div className="flex gap-6 border-b border-blue-500/30 mb-8"><button onClick={() => setActiveTab('candidates')} className={`pb-2 text-xs font-bold ${activeTab === 'candidates' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-500'}`}>{t.inventoryManagement}</button><button onClick={() => setActiveTab('leads')} className={`pb-2 text-xs font-bold ${activeTab === 'leads' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-500'}`}>{t.visitorLogs}</button></div>
          {activeTab === 'candidates' && (<div className="grid lg:grid-cols-3 gap-8"><div className="bg-gray-800/50 p-8 rounded-3xl border border-blue-500/30"><h4 className="font-bold text-xs text-blue-400 mb-4">{editTalent ? `${t.editCandidate} ${editTalent.name}` : t.newCandidate}</h4><form onSubmit={handleSubmit} className="space-y-3"><input ref={nameRef} placeholder={t.fullName} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white" required /><input ref={dobRef} type="date" onChange={handleDobChange} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white" required />{calculatedAge && <div className="text-blue-400 text-xs">Age: {calculatedAge}</div>}<div className="grid grid-cols-2 gap-3"><select ref={genderRef} className="p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white"><option>Male</option><option>Female</option></select><select ref={maritalStatusRef} className="p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white">{maritalStatusOptions.map(o => <option key={o}>{o}</option>)}</select></div><select ref={jobRef} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white">{jobOptions.map(j => <option key={j}>{j}</option>)}</select><select ref={countryRef} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white">{countryOptions.map(c => <option key={c}>{c}</option>)}</select><select ref={religionRef} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white"><option>Muslim</option><option>Christian</option><option>Hindu</option><option>Buddhist</option></select><input ref={salaryRef} type="number" placeholder={t.salaryQAR} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white" required /><select ref={experienceRef} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white">{experienceOptions.map(e => <option key={e}>{e}</option>)}</select><select ref={workerTypeRef} className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded-xl text-white">{workerTypeOptions.map(w => <option key={w}>{w === 'Recruitment Workers' ? t.recruitmentWorkers : t.returnedHousemaidsType}</option>)}</select><input ref={picRef} type="file" accept="image/*" className="text-sm text-gray-400" /><input ref={cvRef} type="file" accept=".pdf,image/*" className="text-sm text-gray-400" /><button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-bold">{isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : t.saveRecord}</button></form></div><div className="lg:col-span-2 bg-gray-800/50 rounded-3xl border border-blue-500/30 overflow-x-auto"><table className="w-full min-w-[800px]"><thead className="bg-gray-900/50 text-xs text-blue-400"><tr><th className="p-4">{t.candidateDetails}</th><th>{t.position}</th><th>{t.salary}</th><th>{t.workerTypeColumn}</th><th className="text-right">{t.actions}</th></tr></thead><tbody>{adminFilteredTalents.map(t => (<tr key={t.id} className="border-b border-blue-500/20 hover:bg-gray-700/30"><td className="p-4"><div className="flex items-center gap-3"><img src={t.pic} className="w-8 h-8 rounded-lg object-cover" /><div><div className="font-bold text-sm text-white">{t.name}</div><div className="text-xs text-gray-500">{t.country}</div></div></div></td><td className="text-gray-300">{t.job}</td><td className="text-gray-300">{t.salary} QAR</td><td className="text-gray-300">{t.workerType === 'Returned Housemaids' ? '🔄 Returned' : '📋 Recruitment'}</td><td className="text-right"><button onClick={() => editHandler(t)} className="text-blue-400 p-1 hover:bg-blue-500/20 rounded"><i className="fa-solid fa-pen"></i></button><button onClick={() => confirmDelete(t.id)} className="text-red-400 p-1 ml-2 hover:bg-red-500/20 rounded"><i className="fa-solid fa-trash"></i></button></td></tr>))}</tbody></table></div></div>)}
          {activeTab === 'leads' && (<div className="bg-gray-800/50 rounded-3xl border border-blue-500/30 p-4"><table className="w-full"><thead><tr><th className="p-4 text-left text-blue-400 text-xs">{t.trafficSource}</th><th className="text-blue-400 text-xs">{t.actionTaken}</th><th className="text-right text-blue-400 text-xs">{t.timeLocal}</th></tr></thead><tbody>{leads.map(l => (<tr key={l.id} className="border-b border-blue-500/20"><td className="p-4 text-gray-300">{l.source}</td><td className="text-blue-400">{l.action}</td><td className="text-right text-gray-500">{l.time}</td></tr>))}</tbody></table><button onClick={clearLeads} className="mt-4 text-red-400 text-xs">{t.clearLogs}</button></div>)}</div></div>
      )}
    </div>
  );
}
