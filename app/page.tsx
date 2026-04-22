'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

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
      case 'success': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'error': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'warning': return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-[200] animate-slide-in-right ${toast.type === 'error' ? 'animate-shake' : ''}`}>
      <div className={`${getBgColor()} text-white rounded-xl shadow-2xl p-4 min-w-[280px] max-w-md flex items-start gap-3 backdrop-blur-sm`}>
        <div className="flex-shrink-0">
          <i className={`fa-solid ${getIcon()} text-xl`}></i>
        </div>
        <div className="flex-1">
          {toast.title && <h4 className="font-bold text-sm mb-1">{toast.title}</h4>}
          <p className="text-sm opacity-90">{toast.message}</p>
        </div>
        <button onClick={() => onClose(toast.id)} className="flex-shrink-0 text-white/70 hover:text-white transition-colors">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
    </div>
  );
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

  // ✅ FIX 1: Auto Refresh REMOVED - දැන් පටවන වෙලාවට වරක් විතරයි
  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

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

  const handleDiscountClick = (discountText: string) => {
    const whatsappNumber = '97455355206';
    const message = `Hi! I'm interested in the offer: ${discountText}. Can you please provide more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackLead('Discount Banner', discountText);
    addToast('info', `Redirecting to WhatsApp for ${discountText}`, 'Special Offer');
  };

  // ✅ FIX 4: Hire Click with CV Link
  const handleHireClick = (talent: Talent, source: string) => {
    const whatsappNumber = '97455355206';
    const cvLink = `${window.location.origin}/api/cv/${talent.id}`;
    const message = `Hi! I'm interested in hiring ${talent.name} (${talent.job}).

📄 CV Link: ${cvLink}
🌍 Country: ${talent.country}
💰 Salary: ${talent.salary} QAR
⭐ Experience: ${talent.experience}
👤 Gender: ${talent.gender}, Age: ${talent.age}
💍 Marital Status: ${talent.maritalStatus}

Please provide more details about this candidate.`;
    
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

  const sortedTalents = [...talents].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // ✅ FIX 2: Featured Talents with Returned Filter
  const featuredTalents = React.useMemo(() => {
    const latestTalents = [...sortedTalents].slice(0, 20);
    if (showReturnedOnly) {
      const returnedOnly = latestTalents.filter(t => t.workerType === 'Returned Housemaids');
      return returnedOnly.slice(0, 6);
    }
    return latestTalents.slice(0, 6);
  }, [sortedTalents, showReturnedOnly]);
  
  // Hire Page Filter with Returned option
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

  if (isLoading) {
    return (
      <div dir={dir} className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <img src="/logo/logo.jpeg" alt="ZOD MANPOWER RECRUITMENT" className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-6 md:mb-8 object-cover shadow-lg animate-pulse" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1 className="text-3xl md:text-5xl font-bold text-[#002F66] mb-3 md:mb-4 animate-bounce">{language === 'en' ? 'Welcome To Doha' : 'مرحباً بكم في الدوحة'}</h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-6 md:mb-8">{t.brandLoading}</p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
            <button onClick={() => setLanguage('en')} className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${language === 'en' ? 'bg-[#002F66] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>English</button>
            <button onClick={() => setLanguage('ar')} className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${language === 'ar' ? 'bg-[#002F66] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>العربية</button>
          </div>
          <div className="mt-8 md:mt-12 w-10 h-10 md:w-12 md:h-12 border-4 border-[#002F66] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

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
        
        @media (max-width: 768px) {
          .container-padding { padding-left: 1rem; padding-right: 1rem; }
          .text-responsive-hero { font-size: 2rem !important; }
          .text-responsive-title { font-size: 1.5rem !important; }
          .grid-responsive { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .nav-text { font-size: 0.7rem !important; }
          .discount-text { font-size: 0.75rem !important; }
          .discount-padding { padding: 0.5rem 1rem !important; }
        }
        
        @media (max-width: 1024px) and (min-width: 769px) {
          .grid-responsive-tablet { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div className="fixed top-16 right-0 z-[200] space-y-3">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-72 sm:w-80 md:w-96 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '480px' }}>
            <div className="bg-[#002F66] px-4 py-3 md:px-5 md:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-white/20 rounded-full flex items-center justify-center"><i className="fa-solid fa-robot text-white text-xs md:text-sm"></i></div>
                <div><div className="text-white font-bold text-xs md:text-sm">ZOD AI Assistant</div></div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 md:px-4 md:py-4 space-y-3 bg-gray-50">
              {!chatLanguageSelected ? (
                <div className="text-center py-6 md:py-8 space-y-3 md:space-y-4">
                  <p className="text-gray-700 font-bold text-sm md:text-base">Select Language</p>
                  <div className="flex gap-2 md:gap-3 justify-center">
                    <button onClick={() => startChat('en')} className="px-4 md:px-5 py-1.5 md:py-2 bg-[#002F66] text-white rounded-full text-xs md:text-sm font-bold hover:bg-[#002060] transition">English</button>
                    <button onClick={() => startChat('ar')} className="px-4 md:px-5 py-1.5 md:py-2 bg-[#002F66] text-white rounded-full text-xs md:text-sm font-bold hover:bg-[#002060] transition">العربية</button>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                      <div className={`max-w-[85%] px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#002F66] text-white rounded-br-sm' : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'}`}>{msg.text}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 rounded-bl-sm shadow-sm flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#002F66] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
            {chatLanguageSelected && (
              <div className="px-3 py-2 md:px-4 md:py-3 border-t bg-white flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleChatKey} placeholder={chatLanguageSelected === 'en' ? "Ask me anything..." : "اسألني أي شيء..."} className="flex-1 px-3 py-2 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm outline-none focus:border-[#002F66] transition-all" disabled={chatLoading} />
                <button onClick={sendChatMessage} disabled={chatLoading} className="w-8 h-8 md:w-10 md:h-10 bg-[#002F66] text-white rounded-xl flex items-center justify-center hover:bg-[#002060] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"><i className="fa-solid fa-paper-plane text-xs"></i></button>
              </div>
            )}
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} className="w-12 h-12 md:w-14 md:h-14 bg-[#002F66] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-[#002060] active:scale-95">
          {chatOpen ? <i className="fa-solid fa-xmark text-lg md:text-xl"></i> : <i className="fa-regular fa-message text-lg md:text-xl"></i>}
        </button>
      </div>

      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-gray-100">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black transition-transform hover:rotate-90"><i className="fa-solid fa-circle-xmark text-xl md:text-2xl"></i></button>
            <div className="text-center mb-6 md:mb-8">
              <i className="fa-solid fa-user-shield text-4xl md:text-5xl text-[#002F66] mb-3 md:mb-4"></i>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">{t.staffAuth}</h2>
              <p className="text-xs md:text-sm text-gray-500">{t.restricted}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5" autoComplete="off">
              <div><label className="text-[10px] md:text-xs font-bold uppercase text-gray-400 ml-1">{t.username}</label><input type="text" id="adminUser" placeholder={t.enterAdmin} autoComplete="off" className="w-full p-3 md:p-4 bg-gray-50 border rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all" required /></div>
              <div><label className="text-[10px] md:text-xs font-bold uppercase text-gray-400 ml-1">{t.password}</label><input type="password" id="adminPass" placeholder="••••••••" autoComplete="new-password" className="w-full p-3 md:p-4 bg-gray-50 border rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all" required /></div>
              <button type="submit" className="w-full py-3 md:py-4 bg-[#002F66] text-white font-bold rounded-xl md:rounded-2xl hover:bg-[#002060] transition-all shadow-lg">{t.authorizedOnly}</button>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-red-100 mb-3 md:mb-4 animate-pulse"><i className="fa-solid fa-trash-can text-red-600 text-lg md:text-xl"></i></div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{t.confirmDelete}</h3>
              <p className="text-xs md:text-sm text-gray-500 mb-5 md:mb-6">{t.deleteMsg}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteModalOpen(false)} className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-all text-sm">{t.cancel}</button>
                <button onClick={performDelete} disabled={isDeleting} className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all text-sm disabled:opacity-50">
                  {isDeleting ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                  {t.yesDelete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!adminActive && (
        <div className="public-section">
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-amber-500 to-red-600 pt-20 md:pt-24 pb-2 md:pb-3 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="overflow-hidden whitespace-nowrap">
                <div className={`inline-flex gap-4 md:gap-8 ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
                  <div onClick={() => handleDiscountClick('Welcome To ZOD MANPOWER')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">✨ {t.discount1}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Offers Will Be Coming Soon')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">🎉 {t.discount2}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Contact Us For Get More Informations')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">💎 {t.discount3}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Welcome To ZOD MANPOWER')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">✨ {t.discount1}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Offers Will Be Coming Soon')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">🎉 {t.discount2}</span>
                  </div>
                  <div onClick={() => handleDiscountClick('Contact Us For Get More Informations')} className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300 mx-1 md:mx-2">
                    <span className="text-white font-bold text-xs md:text-base discount-text">💎 {t.discount3}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <nav className="fixed w-full z-50 glass-nav" style={{ top: '0' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer group" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); window.scrollTo(0, 0); }}>
                <img src="/logo/logo.jpeg" alt="ZOD MANPOWER RECRUITMENT Logo" className="w-8 h-8 md:w-12 md:h-12 rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110" />
                <div className="text-sm md:text-2xl font-extrabold tracking-tighter uppercase">{t.brandName}</div>
              </div>
              <div className="hidden lg:flex items-center space-x-4 md:space-x-8 font-semibold text-[10px] md:text-xs uppercase tracking-widest">
                <a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.home}</a>
                <a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.about}</a>
                <a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.services}</a>
                <button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.ourTeam}</button>
                <button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); }} className="nav-link hover:text-[#002F66] transition-all duration-300">{t.hireNav}</button>
                <a href="https://wa.me/97455355206" onClick={() => trackLead('Nav Apply', 'Global Apply')} target="_blank" className="bg-[#002F66] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full shadow-md hover:bg-[#002060] transition-all hover:scale-105 active:scale-95 text-[10px] md:text-xs">{t.contactUs}</a>
                <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-[#002F66] hover:bg-gray-200 transition-all"><i className="fa-solid fa-globe text-[8px] md:text-[10px]"></i><span>{language === 'en' ? 'العربية' : 'English'}</span></button>
              </div>
              <button className="lg:hidden text-xl md:text-2xl text-[#002F66]" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars-staggered"></i></button>
            </div>
          </nav>

          <div className={`mobile-sidebar ${sidebarOpen ? 'active' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="sidebar-close" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark text-[#002F66]"></i></div>
            <div className="sidebar-nav mt-8">
              <a href="#home" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.home}</a>
              <a href="#about" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.about}</a>
              <a href="#services" onClick={() => { setShowHirePage(false); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2">{t.services}</a>
              <button onClick={() => { setShowOurTeamPage(true); setShowHirePage(false); setShowAboutPage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2 text-left">{t.ourTeam}</button>
              <button onClick={() => { setShowHirePage(true); setShowOurTeamPage(false); setShowAboutPage(false); setSidebarOpen(false); }} className="transition-all hover:translate-x-2 text-left">{t.hireNav}</button>
              <a href="https://wa.me/97455355206" onClick={() => { trackLead('Mobile Nav Apply', 'Global Apply'); setSidebarOpen(false); }} target="_blank" className="sidebar-apply" style={{ backgroundColor: '#002F66' }}>{t.contactUs}</a>
              <button onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setSidebarOpen(false); }} className="mt-4 w-full py-2 bg-gray-100 rounded-full text-sm font-bold text-[#002F66] hover:bg-gray-200 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-globe text-xs"></i>{language === 'en' ? 'العربية' : 'English'}</button>
            </div>
          </div>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

          {showOurTeamPage ? (
            <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowOurTeamPage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-xs md:text-sm mb-6 md:mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="text-center mb-8 md:mb-12 reveal">
                  <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">{t.teamTitle}</h3>
                  <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">{t.teamDesc}</p>
                </div>
                <div className="mb-12 md:mb-16">
                  <h4 className="text-xl md:text-2xl font-bold text-[#002F66] text-center mb-6 md:mb-10">{t.topManagementTitle}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {topManagementTeam.map((member) => (
                      <div key={member.id} className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                        <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#002F66] to-[#0040aa] flex items-center justify-center">
                          <img src={member.photo} alt={member.name} className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105" onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150?text=User')} />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                            <div className="text-white font-bold text-xs md:text-sm text-center">{member.position}</div>
                          </div>
                        </div>
                        <div className="p-4 md:p-6 text-center">
                          <h4 className="text-base md:text-xl font-bold text-slate-800 mb-2 md:mb-3">{escapeHtml(member.name)}</h4>
                          <a href={`https://wa.me/${member.phone}`} target="_blank" onClick={() => trackLead('Team Contact', member.name)} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-green-700 transition-all hover:scale-105">
                            <i className="fa-brands fa-whatsapp text-sm md:text-base"></i> {t.contact}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-slate-700 text-center mb-6 md:mb-8">Our Dedicated Team</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {regularTeam.map((member) => (
                      <div key={member.id} className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 md:gap-4 border border-gray-100">
                        <img src={member.photo} alt={member.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#002F66]/20" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80?text=User')} />
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-800 text-sm md:text-base">{escapeHtml(member.name)}</h5>
                          <p className="text-[#002F66] text-[10px] md:text-xs font-semibold">{escapeHtml(member.position)}</p>
                        </div>
                        <a href={`https://wa.me/${member.phone}`} target="_blank" onClick={() => trackLead('Team Contact', member.name)} className="text-green-600 hover:text-green-700 transition-all hover:scale-110">
                          <i className="fa-brands fa-whatsapp text-lg md:text-xl"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : showAboutPage ? (
            <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowAboutPage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-xs md:text-sm mb-6 md:mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div><h3 className="text-2xl md:text-3xl font-bold text-[#002F66] mb-4 md:mb-6">{t.ourVision}</h3><p className="text-gray-600 leading-relaxed text-sm md:text-lg">{t.visionText}</p></div>
                    <div><h3 className="text-2xl md:text-3xl font-bold text-[#002F66] mb-4 md:mb-6">{t.ourMission}</h3><p className="text-gray-600 leading-relaxed text-sm md:text-lg">{t.missionText}</p></div>
                  </div>
                  <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4">{t.ourJourney}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                      {language === 'en' 
                        ? 'ZOD Manpower, located in Doha, Qatar, is a recruitment agency specializing in supplying staff, including housemaids, nurses, and office boys from countries like the Philippines, Sri Lanka, Kenya, and India. We offer various staffing solutions and are listed as a recruitment agency in Qatar. '
                        : 'شركة زود للتوظيف، ومقرها الدوحة، قطر، هي وكالة توظيف متخصصة في توفير الكوادر البشرية، بما في ذلك عاملات المنازل والممرضات وعمال المكاتب، من دول مثل الفلبين وسريلانكا وكينيا والهند. نقدم حلولاً متنوعة للتوظيف، ونحن مسجلون كوكالة توظيف معتمدة في قطر.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : showHirePage ? (
            // ✅ HIRE PAGE WITH RETURNED FILTER
            <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setShowHirePage(false)} className="flex items-center gap-2 text-[#002F66] font-bold text-xs md:text-sm mb-6 md:mb-8 hover:underline transition-all"><i className="fa-solid fa-arrow-left"></i> {t.backToHome}</button>
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-10 gap-4 md:gap-6">
                  <div><h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">{t.hireTitle}</h3><p className="text-gray-500 text-sm md:text-base">{t.hireDesc}</p></div>
                  <div className="flex gap-2 md:gap-3 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[150px] md:min-w-[180px]">
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full p-3 md:p-4 pl-8 md:pl-12 bg-white border rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all text-sm md:text-base" />
                      <i className="fa-solid fa-magnifying-glass absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
                    </div>
                    <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="p-3 md:p-4 bg-white border rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all text-xs md:text-sm font-bold text-gray-700">
                      <option value="">{t.allCountries}</option>
                      {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {/* ✅ FIX 3: Returned Filter Button on Hire Page */}
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                      <input 
                        type="checkbox" 
                        checked={showReturnedOnly} 
                        onChange={(e) => setShowReturnedOnly(e.target.checked)}
                        className="w-4 h-4 text-[#002F66] rounded"
                      />
                      <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{t.showReturnedOnly}</span>
                    </label>
                    <button onClick={fetchTalents} className="px-4 md:px-5 py-3 md:py-4 bg-gray-200 rounded-xl md:rounded-2xl hover:bg-gray-300 transition-all hover:scale-105" title={t.refresh}><i className="fa-solid fa-rotate-right text-xs md:text-sm"></i></button>
                  </div>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">{[...Array(6)].map((_, i) => <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border animate-pulse"><div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-2xl mb-4"></div><div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}</div>
                ) : filteredTalents.length === 0 ? (
                  <div className="text-center py-16 md:py-24 text-gray-400"><i className="fa-solid fa-user-slash text-4xl md:text-5xl mb-4 block"></i><p className="font-bold text-sm md:text-base">No candidates found. Try a different search or country filter.</p></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredTalents.map((talent) => (
                      <div key={talent.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4 md:mb-6">
                          <img src={talent.pic} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-[#002F66]/10 shadow-sm" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                          <span className="bg-emerald-50 text-emerald-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{t.ready}</span>
                        </div>
                        <div className="flex-grow">
                          {/* ✅ FIX 5: Clickable Name Link */}
                          <Link href={`/candidate/${talent.id}`}>
                            <h4 className="font-bold text-slate-800 text-lg md:text-xl leading-tight hover:text-[#002F66] cursor-pointer transition-colors">
                              {escapeHtml(talent.name)}
                            </h4>
                          </Link>
                          <p className="text-[#002F66] font-bold text-[10px] md:text-[11px] uppercase tracking-widest mt-1">{escapeHtml(talent.job)}</p>
                          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100 space-y-2 md:space-y-3 mb-6 md:mb-8">
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-earth-asia w-4 md:w-5 text-[#002F66]"></i><span>{escapeHtml(talent.country)}</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-user w-4 md:w-5 text-[#002F66]"></i><span>{talent.gender}, {talent.age} Years</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-money-bill-wave w-4 md:w-5 text-[#002F66]"></i><span>{talent.salary || 0} QAR</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-calendar-alt w-4 md:w-5 text-[#002F66]"></i><span>{talent.experience || '2-5 Years'} Exp</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-heart w-4 md:w-5 text-[#002F66]"></i><span>{talent.maritalStatus || 'Single'}</span></div>
                            <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-tag w-4 md:w-5 text-[#002F66]"></i><span>{talent.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}</span></div>
                          </div>
                        </div>
                        <div className="flex gap-2 md:gap-3 mt-auto">
                          <a href={talent.cv} target="_blank" onClick={() => trackLead('Public CV', talent.name)} className="flex-1 py-2 md:py-4 bg-gray-100 text-center rounded-xl font-bold text-[8px] md:text-[10px] uppercase hover:bg-gray-200 transition-all">{t.viewCV}</a>
                          <button onClick={() => handleHireClick(talent, 'Hire Talent')} className="flex-1 py-2 md:py-4 bg-[#002F66] text-white text-center rounded-xl font-bold text-[8px] md:text-[10px] uppercase shadow-lg hover:bg-[#002060] transition-all">{t.hireBtn}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <section id="home" className="relative pt-24 md:pt-32 pb-16 md:pb-32 px-4 md:px-6 qatar-gradient text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><i className="fa-solid fa-globe text-[20rem] md:text-[40rem] absolute -top-20 -right-40 animate-spin-slow"></i></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
                  <div className="space-y-6 md:space-y-8 fade-in">
                    <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest border border-white/20 animate-pulse">{t.certified}</span>
                    <h1 className="text-3xl md:text-7xl font-bold leading-[1.1] animate-slide-up">{t.heroTitle} <span className="text-amber-400">{t.heroTitleSpan}</span> {t.heroTitleEnd}</h1>
                    <p className="text-sm md:text-lg opacity-80 leading-relaxed max-w-lg">{t.heroDesc}</p>
                    <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                      <button onClick={() => handleQuickHire('House Maid')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-1 md:gap-2 text-xs md:text-sm">🏠 {t.houseMaids}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleQuickHire('Driver')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-1 md:gap-2 text-xs md:text-sm">🚗 {t.drivers}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleQuickHire('Nurse')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-1 md:gap-2 text-xs md:text-sm">🏥 {t.nurses}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleExternalLink('https://alkhadam.net/qa/en/company/411', 'Monthly Cleaners')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-1 md:gap-2 text-xs md:text-sm">🧹 {t.monthlyCleaners}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button onClick={() => handleExternalLink('https://alkhadam.net/qa/en/company/7653', 'Al-Mohannadi')} className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white hover:text-[#002F66]">
                        <span className="relative z-10 flex items-center gap-1 md:gap-2 text-xs md:text-sm">🏥 {t.alMohannadi}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] md:rounded-[4rem] rotate-12 flex items-center justify-center shadow-2xl hover:rotate-0 transition-transform duration-700 hover:scale-105"><i className="fa-solid fa-building-columns text-[6rem] md:text-[10rem] opacity-20 -rotate-12"></i></div>
                    <div className="absolute -bottom-6 md:-bottom-10 -left-6 md:-left-10 p-4 md:p-8 bg-amber-400 rounded-2xl md:rounded-3xl shadow-2xl text-[#002F66] animate-float" style={{ animationDuration: '3s' }}><div className="text-2xl md:text-4xl font-bold">12+</div><div className="text-[8px] md:text-[10px] font-bold uppercase tracking-tighter leading-none">{t.yearsLabel}</div></div>
                  </div>
                </div>
              </section>

              <section className="py-12 md:py-16 bg-white border-b reveal">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {[{ num: '9.2K', label: t.successfulPlacements }, { num: '1.8K+', label: t.corporateClients }, { num: '24h', label: t.responseTime }, { num: '98.2%', label: t.complianceRate }].map((s, i) => (
                    <div key={i} className="flex items-center space-x-2 md:space-x-4 border-r border-gray-100 last:border-0 hover:translate-x-2 transition-all duration-300 group">
                      <div className="text-2xl md:text-4xl text-[#002F66] font-black group-hover:scale-110 transition-transform">{s.num}</div>
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ✅ FEATURED CANDIDATES SECTION WITH CLICKABLE NAMES AND RETURNED FILTER */}
              <section className="py-12 md:py-16 bg-gray-50 px-4 md:px-6 reveal">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-6 md:mb-8 flex-wrap gap-4">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t.featuredCandidates}</h3>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={showReturnedOnly} 
                          onChange={(e) => setShowReturnedOnly(e.target.checked)}
                          className="w-4 h-4 text-[#002F66] rounded border-gray-300 focus:ring-[#002F66]"
                        />
                        <span className="text-xs md:text-sm font-medium text-gray-700">{t.showReturnedOnly}</span>
                      </label>
                      <button onClick={() => setShowHirePage(true)} className="text-[#002F66] font-bold text-xs md:text-sm hover:underline transition-all flex items-center gap-1">{t.viewAllCandidates}</button>
                    </div>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">{[...Array(6)].map((_, i) => <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border animate-pulse"><div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-2xl mb-4"></div><div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}</div>
                  ) : featuredTalents.length === 0 ? (
                    <div className="text-center py-16 md:py-24 text-gray-400"><i className="fa-solid fa-user-slash text-4xl md:text-5xl mb-4 block"></i><p className="font-bold text-sm md:text-base">No candidates available. Please check back later.</p></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {featuredTalents.map((talent) => (
                        <div key={talent.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4 md:mb-6">
                            <img src={talent.pic} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-[#002F66]/10 shadow-sm" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=User')} alt={talent.name} />
                            <span className="bg-emerald-50 text-emerald-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{t.ready}</span>
                          </div>
                          <div className="flex-grow">
                            {/* ✅ FIX 5: Clickable Name Link */}
                            <Link href={`/candidate/${talent.id}`}>
                              <h4 className="font-bold text-slate-800 text-lg md:text-xl leading-tight hover:text-[#002F66] cursor-pointer transition-colors">
                                {escapeHtml(talent.name)}
                              </h4>
                            </Link>
                            <p className="text-[#002F66] font-bold text-[10px] md:text-[11px] uppercase tracking-widest mt-1">{escapeHtml(talent.job)}</p>
                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100 space-y-2 md:space-y-3 mb-6 md:mb-8">
                              <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-earth-asia w-4 md:w-5 text-[#002F66]"></i><span>{escapeHtml(talent.country)}</span></div>
                              <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-user w-4 md:w-5 text-[#002F66]"></i><span>{talent.gender}, {talent.age} Years</span></div>
                              <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-money-bill-wave w-4 md:w-5 text-[#002F66]"></i><span>{talent.salary || 0} QAR</span></div>
                              <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-calendar-alt w-4 md:w-5 text-[#002F66]"></i><span>{talent.experience || '3-5 Years'} Exp</span></div>
                              <div className="flex items-center text-xs text-gray-500"><i className="fa-solid fa-tag w-4 md:w-5 text-[#002F66]"></i><span>{talent.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}</span></div>
                            </div>
                          </div>
                          <div className="flex gap-2 md:gap-3 mt-auto">
                            <a href={talent.cv} target="_blank" onClick={() => trackLead('Featured CV', talent.name)} className="flex-1 py-2 md:py-4 bg-gray-100 text-center rounded-xl font-bold text-[8px] md:text-[10px] uppercase hover:bg-gray-200 transition-all">{t.viewCV}</a>
                            <button onClick={() => handleHireClick(talent, 'Featured Hire')} className="flex-1 py-2 md:py-4 bg-[#002F66] text-white text-center rounded-xl font-bold text-[8px] md:text-[10px] uppercase shadow-lg hover:bg-[#002060] transition-all">{t.hireBtn}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-white reveal">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  <div className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-inner"><img src="https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="About" /></div>
                    <div className="absolute -bottom-4 md:-bottom-8 -right-4 md:-right-8 p-6 md:p-10 bg-[#002F66] rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl hidden md:block transition-all duration-300 hover:scale-105"><i className="fa-solid fa-quote-left text-3xl md:text-4xl opacity-20 mb-4 block"></i><p className="font-bold text-base md:text-lg italic">"Connecting People, <br />Empowering Visions."</p></div>
                  </div>
                  <div className="space-y-6 md:space-y-8">
                    <h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em]">{t.ourLegacy}</h2>
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">{t.aboutTitle}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">{t.aboutDesc}</p>
                    <ul className="space-y-3 md:space-y-4">{[t.personalizedMatching, t.directLiaison, t.multiIndustry].map((item, i) => (<li key={i} className="flex items-center space-x-2 md:space-x-3 font-bold text-xs md:text-sm text-slate-700 group cursor-pointer"><i className="fa-solid fa-check-circle text-[#002F66] transition-transform group-hover:scale-110"></i><span className="group-hover:translate-x-1 transition-transform">{item}</span></li>))}</ul>
                    <button onClick={() => setShowAboutPage(true)} className="inline-flex items-center gap-2 bg-[#002F66] text-white px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-[#002060] transition-all hover:scale-105 shadow-md">
                      {t.viewMore} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </section>

              <section id="services" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20"><h2 className="text-sm font-bold text-red-800 uppercase tracking-[0.3em] mb-4">{t.ourExpertise}</h2><h3 className="text-2xl md:text-4xl font-bold text-slate-900">{t.comprehensiveSolutions}</h3></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
                  {[{ icon: 'passport', title: t.visaTitle, desc: t.visaDesc }, { icon: 'users-gear', title: t.techTitle, desc: t.techDesc }, { icon: 'city', title: t.projectsTitle, desc: t.projectsDesc }].map((s, i) => (
                    <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-3 border border-gray-100 cursor-pointer">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#002F66] group-hover:text-white transition-all duration-500 group-hover:rotate-6"><i className={`fa-solid fa-${s.icon} text-xl md:text-2xl`}></i></div>
                      <h4 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-slate-900 group-hover:text-[#002F66] transition-colors">{s.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="py-12 md:py-16 px-4 md:px-6 bg-white reveal">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{t.ourLocation}</h3>
                    <p className="text-gray-500 text-sm md:text-base">ZOD MANPOWER RECRUITMENT, Doha, Qatar</p>
                  </div>
                  <div className="w-full h-[250px] md:h-[400px] rounded-xl md:rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.756850059207!2d51.451755486019955!3d25.24511337222303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45da725e22a337%3A0xbea50deacb9863fc!2sZOD%20MANPOWER%20RECRUITMENT!5e0!3m2!1sen!2sqa!4v1776013064557!5m2!1sen!2sqa" 
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

              <section className="py-16 md:py-20 bg-gray-50 px-4 md:px-6 reveal">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{t.whatClientsSay}</h3>
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {[{ text: t.testimonial1, author: t.author1 }, { text: t.testimonial2, author: t.author2 }, { text: t.testimonial3, author: t.author3 }].map((tst, i) => (
                      <div key={i} className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                        <i className="fa-solid fa-quote-left text-2xl md:text-3xl text-[#002F66]/20 mb-3 md:mb-4 block"></i>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">{tst.text}</p>
                        <p className="font-bold text-slate-800 text-xs md:text-sm">{tst.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-16 md:py-20 bg-white px-4 md:px-6 reveal">
                <div className="max-w-5xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{t.faqTitle}</h3>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {[{ q: t.faqQ1, a: t.faqA1 }, { q: t.faqQ2, a: t.faqA2 }, { q: t.faqQ3, a: t.faqA3 }, { q: t.faqQ4, a: t.faqA4 }].map((faq, i) => (
                      <div key={i} className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border shadow-sm faq-item cursor-pointer transition-all duration-300 hover:shadow-md" onClick={(e) => { const parent = e.currentTarget; parent.classList.toggle('active'); const answer = parent.querySelector('.faq-answer') as HTMLElement; if (parent.classList.contains('active')) answer.style.maxHeight = answer.scrollHeight + 'px'; else answer.style.maxHeight = '0px'; }}>
                        <h5 className="font-bold text-xs md:text-sm flex justify-between items-center uppercase tracking-tight">{faq.q}<i className="fa-solid fa-plus text-[10px] md:text-xs transition-transform duration-300 ml-2 shrink-0"></i></h5>
                        <div className="faq-answer text-gray-500 text-xs md:text-sm leading-relaxed">{faq.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <footer className="py-16 md:py-20 bg-slate-900 text-white px-4 md:px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 md:gap-12 border-b border-white/5 pb-12 md:pb-16">
                  <div className="col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <img src="/logo/logo.jpeg" alt="ZOD MANPOWER RECRUITMENT Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-lg" />
                      <div className="text-lg md:text-2xl font-black uppercase tracking-tighter">{t.brandName}</div>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-sm mb-6">{t.footerText}</p>
                    <div className="flex space-x-3 md:space-x-4"><a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-facebook-f text-sm md:text-base"></i></a><a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002F66] transition-all duration-300 hover:scale-110"><i className="fa-brands fa-linkedin-in text-sm md:text-base"></i></a></div>
                  </div>
                  <div><h6 className="font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 text-slate-300">{t.quickLinks}</h6><ul className="space-y-3 md:space-y-4 text-[10px] md:text-xs text-slate-500 font-bold uppercase"><li><a href="#about" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.aboutDoha}</a></li><li><a href="#services" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.clientServices}</a></li><li><button onClick={() => setShowHirePage(true)} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{t.browseCVs}</button></li></ul></div>
                  <div><h6 className="font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 text-slate-300">{t.internal}</h6><button onClick={() => setLoginModalOpen(true)} className="group flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-2 md:py-3 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-105"><i className="fa-solid fa-lock text-[8px] md:text-[10px] group-hover:rotate-12 transition-transform"></i><span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{t.adminPortal}</span></button></div>
                </div>
                <div className="max-w-7xl mx-auto pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-[8px] md:text-[10px] text-slate-700 tracking-widest uppercase font-bold"><p>{t.copyright}</p><div className="flex space-x-4 md:space-x-6"><a href="#" className="hover:text-white transition-colors">{t.privacyPolicy}</a><a href="#" className="hover:text-white transition-colors">{t.terms}</a></div></div>
              </footer>
            </>
          )}
        </div>
      )}

      {adminActive && (
        <div className="admin-section min-h-screen bg-gray-50 pb-16 md:pb-20">
          <nav className="bg-white border-b px-4 md:px-6 py-3 md:py-4 mb-6 md:mb-10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2 md:space-x-3"><div className="w-6 h-6 md:w-8 md:h-8 bg-[#002F66] rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-gears text-[8px] md:text-[10px]"></i></div><span className="font-bold text-xs md:text-sm tracking-widest uppercase text-slate-900">{t.staffPortal}</span></div>
              <button onClick={() => setAdminActive(false)} className="bg-red-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-105">{t.logout}</button>
            </div>
          </nav>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
              <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">{t.totalCandidates}</p><div className="text-2xl md:text-4xl font-bold text-slate-800">{talents.length}</div></div>
              <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">{t.webLeads}</p><div className="text-2xl md:text-4xl font-bold text-indigo-600">{leads.length}</div></div>
              <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"><p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">{t.activeVacancies}</p><div className="text-2xl md:text-4xl font-bold text-[#002F66]">0</div></div>
              <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-center"><button onClick={fetchTalents} className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase transition-all duration-300 hover:scale-105"><i className="fa-solid fa-rotate-right mr-1 md:mr-2"></i> {t.refresh}</button></div>
            </div>

            <div className="mb-6 md:mb-8">
              <div className="relative max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder={t.adminSearch}
                  className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#002F66] transition-all text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-2">{t.searchByName}</p>
            </div>

            <div className="flex space-x-4 md:space-x-6 mb-6 md:mb-8 border-b">
              <button onClick={() => setActiveTab('candidates')} className={`pb-3 md:pb-4 border-b-2 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'candidates' ? 'border-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t.inventoryManagement}</button>
              <button onClick={() => setActiveTab('leads')} className={`pb-3 md:pb-4 border-b-2 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'leads' ? 'border-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t.visitorLogs}</button>
            </div>

            {activeTab === 'candidates' && (
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-6 md:mb-8 border-b pb-3 md:pb-4"><h4 className="font-bold uppercase text-[10px] md:text-xs text-[#002F66] tracking-widest">{editTalent ? `${t.editCandidate} ${editTalent.name}` : t.newCandidate}</h4><button onClick={resetForm} className="text-[8px] md:text-[10px] text-gray-400 hover:text-red-600 transition-all hover:rotate-12"><i className="fa-solid fa-rotate-left"></i></button></div>
                  <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.fullName}</label><input ref={nameRef} type="text" className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all text-sm md:text-base" required /></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.dob}</label><input ref={dobRef} type="date" onChange={handleDobChange} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                    {calculatedAge !== null && (<div className="bg-blue-50 p-2 md:p-3 rounded-lg md:rounded-xl"><span className="text-[10px] md:text-xs font-bold text-blue-600">Age: {calculatedAge} years</span></div>)}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.gender}</label><select ref={genderRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all"><option>Male</option><option>Female</option></select></div>
                      <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.maritalStatus}</label><select ref={maritalStatusRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                    </div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.jobDesignation}</label><select ref={jobRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{jobOptions.map(job => <option key={job} value={job}>{job}</option>)}</select></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.country}</label><select ref={countryRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{countryOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.religion}</label><select ref={religionRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all"><option value="Muslim">Muslim</option><option value="Christian">Christian</option><option value="Hindu">Hindu</option><option value="Buddhist">Buddhist</option></select></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.salaryQAR}</label><input ref={salaryRef} type="number" defaultValue="0" step="100" className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all" required /></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.experience}</label><select ref={experienceRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{experienceOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}</select></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1">{t.workerType}</label><select ref={workerTypeRef} className="w-full p-3 md:p-4 bg-gray-50 border border-transparent rounded-lg md:rounded-xl outline-none focus:bg-white focus:border-[#002F66] transition-all">{workerTypeOptions.map(opt => <option key={opt} value={opt}>{opt === 'Recruitment Workers' ? t.recruitmentWorkers : t.returnedHousemaidsType}</option>)}</select></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1 md:mb-2">{t.photo}</label><input ref={picRef} type="file" accept="image/*" className="text-[10px] md:text-xs file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded-full file:border-0 file:text-[8px] md:file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all" /></div>
                    <div><label className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1 md:mb-2">{t.cvUpload}</label><input ref={cvRef} type="file" accept=".pdf,image/*" className="text-[10px] md:text-xs file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded-full file:border-0 file:text-[8px] md:file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" /></div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 md:py-4 bg-[#002F66] text-white rounded-lg md:rounded-xl font-bold uppercase text-[8px] md:text-[10px] tracking-widest shadow-lg hover:bg-[#002060] transition-all duration-300 hover:scale-105 disabled:opacity-50">
                      {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                      {t.saveRecord}
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm overflow-x-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-gray-50 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b">
                        <tr>
                          <th className="p-4 md:p-6">{t.candidateDetails}</th>
                          <th className="p-4 md:p-6">{t.position}</th>
                          <th className="p-4 md:p-6">{t.salary}</th>
                          <th className="p-4 md:p-6">{t.workerTypeColumn}</th>
                          <th className="p-4 md:p-6 text-right">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {adminFilteredTalents.map((talent) => (
                          <tr key={talent.id} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="p-4 md:p-6"><div className="flex items-center space-x-2 md:space-x-3"><img src={talent.pic} className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50')} alt={talent.name} /><div><div className="font-bold text-slate-800 text-xs md:text-sm">{escapeHtml(talent.name)}</div><div className="text-[8px] md:text-[9px] text-gray-400 uppercase">{escapeHtml(talent.country)}</div></div></div></td>
                            <td className="p-4 md:p-6"><div className="text-[10px] md:text-xs font-bold text-gray-600">{escapeHtml(talent.job)}</div></td>
                            <td className="p-4 md:p-6"><div className="text-[10px] md:text-xs font-bold text-gray-600">{talent.salary || 0} QAR</div></td>
                            <td className="p-4 md:p-6"><div className="text-[10px] md:text-xs font-bold text-gray-600">{talent.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}</div></td>
                            <td className="p-4 md:p-6 text-right">
                              <button onClick={() => editHandler(talent)} className="text-blue-500 p-1 md:p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"><i className="fa-solid fa-pen text-xs md:text-sm"></i></button>
                              <button onClick={() => confirmDelete(talent.id)} className="text-red-500 p-1 md:p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"><i className="fa-solid fa-trash text-xs md:text-sm"></i></button>
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
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm overflow-x-auto">
                <div className="p-4 md:p-8 border-b flex justify-between items-center flex-wrap gap-2"><h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-indigo-600">{t.realtimeLogs}</h4><button onClick={clearLeads} className="text-[8px] md:text-[10px] font-bold text-red-500 uppercase hover:underline transition-all">{t.clearLogs}</button></div>
                <table className="w-full text-left min-w-[400px]">
                  <thead className="bg-gray-50 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr><th className="p-4 md:p-8">{t.trafficSource}</th><th className="p-4 md:p-8">{t.actionTaken}</th><th className="p-4 md:p-8 text-right">{t.timeLocal}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map((lead) => (<tr key={lead.id}><td className="p-4 md:p-8 text-[10px] md:text-xs font-bold">{lead.source}</td><td className="p-4 md:p-8 text-[10px] md:text-xs text-indigo-600 font-bold">{lead.action}</td><td className="p-4 md:p-8 text-right text-[8px] md:text-[10px] text-gray-400">{lead.time}</td></tr>))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
