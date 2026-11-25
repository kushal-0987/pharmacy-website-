import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/healthcare';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.pharmacy': 'Pharmacy',
    'nav.healthTips': 'Health Tips',
    'nav.contact': 'Contact',
    'nav.bookAppointment': 'Book Appointment',
    'nav.account': 'My Portal',
    'nav.login': 'Log In',
    'nav.register': 'Register',
    'nav.staff': 'Staff Portal',
    'nav.admin': 'Admin Portal',
    'nav.search': 'Search services, tests & medicines...',

    // Top Bar
    'topbar.emergency': 'Emergency / Ambulance: 01-5582910 | 9801234567',
    'topbar.openNow': 'Open Now (Pharmacy 24/7 · Clinic 7 AM - 8 PM)',
    'topbar.location': 'Sanagau, Lalitpur, Nepal',

    // Hero & Trust
    'hero.title': 'Healthcare you can rely on, close to home.',
    'hero.subtitle': 'Two Brothers Healthcare Pvt. Ltd. provides licensed pharmacy, specialist doctor consultations, certified laboratory diagnostics, and doorstep medicine delivery in Sanagau, Lalitpur.',
    'hero.ctaBook': 'Book Appointment',
    'hero.ctaEnquire': 'Enquire about Medicine',
    'trust.licensed': 'Licensed Pharmacy (#TBH-9923)',
    'trust.professionals': 'Nepal Medical Council (NMC) Certified Doctors',
    'trust.delivery': 'Express Doorstep Delivery Across Lalitpur & Kathmandu',
    'trust.lab': 'Accredited Diagnostic Laboratory',

    // Services
    'services.heading': 'Our Core Healthcare Services',
    'services.subheading': 'Comprehensive clinical care, modern diagnostics, and a fully stocked pharmaceutical store right in your community.',
    'service.pharmacy.title': 'Community Pharmacy',
    'service.pharmacy.desc': 'Genuine medicines, temperature-regulated storage, prescription review, and home delivery.',
    'service.consultation.title': 'Doctor Consultation',
    'service.consultation.desc': 'General practitioners and specialists in internal medicine, pediatrics, gynecology, and cardiology.',
    'service.lab.title': 'Diagnostic Laboratory',
    'service.lab.desc': 'High-precision blood, urine, biochemistry, and cardiac screenings with fast digital reports.',
    'service.packages.title': 'Preventive Health Packages',
    'service.packages.desc': 'Cost-effective routine wellness bundles for men, women, seniors, and families.',
    'service.other.title': 'Nursing & Minor Procedures',
    'service.other.desc': 'Wound dressing, immunizations, vitals checks, nebulization, and home nursing assistance.',

    // How It Works
    'howItWorks.title': 'Simple, Transparent Healthcare',
    'howItWorks.step1.title': '1. Choose a Service',
    'howItWorks.step1.desc': 'Select consultation, lab tests, checkup package, or medicine enquiry online.',
    'howItWorks.step2.title': '2. Book or Enquire',
    'howItWorks.step2.desc': 'Pick your preferred date/time slot with our 10-minute hold or upload your prescription.',
    'howItWorks.step3.title': '3. Visit or Doorstep Care',
    'howItWorks.step3.desc': 'Receive verified care at our Sanagau facility or prompt delivery at your home.',

    // Common
    'btn.learnMore': 'Learn More',
    'btn.viewAll': 'View All',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.close': 'Close',
    'status.open': 'Open Now',
    'status.closed': 'Closed',
    'common.currency': 'NPR',
  },
  ne: {
    // Navigation
    'nav.home': 'गृहपृष्ठ',
    'nav.about': 'हाम्रो बारेमा',
    'nav.services': 'सेवाहरू',
    'nav.pharmacy': 'औषधि पसल',
    'nav.healthTips': 'स्वास्थ्य सुझाव',
    'nav.contact': 'सम्पर्क',
    'nav.bookAppointment': 'अपोइन्टमेन्ट लिनुहोस्',
    'nav.account': 'मेरो खाता',
    'nav.login': 'लगइन',
    'nav.register': 'दर्ता गर्नुहोस्',
    'nav.staff': 'कर्मचारी पोर्टल',
    'nav.admin': 'प्रशासक पोर्टल',
    'nav.search': 'सेवा, प्रयोगशाला परीक्षण र औषधि खोज्नुहोस्...',

    // Top Bar
    'topbar.emergency': 'आपतकालीन फोन: ०१-५५८२९१० | ९८०१२३४५६७',
    'topbar.openNow': 'हाल खुला छ (फार्मेसी २४/७ · क्लिनिक बिहान ७ - बेलुका ८)',
    'topbar.location': 'सनागाउँ, ललितपुर, नेपाल',

    // Hero & Trust
    'hero.title': 'तपाईंको नजिक, भरपर्दो र स्तरीय स्वास्थ्य सेवा।',
    'hero.subtitle': 'टु ब्रदर्स हेल्थकेयर प्रा. लि. — सनागाउँ, ललितपुरमा दर्ता प्राप्त फार्मेसी, विशेषज्ञ डाक्टर परामर्श, आधुनिक ल्याब परीक्षण तथा घरमै औषधि डेलिभरी सेवा प्रदान गर्दछ।',
    'hero.ctaBook': 'अपोइन्टमेन्ट लिनुहोस्',
    'hero.ctaEnquire': 'औषधि उपलब्धता सोध्नुहोस्',
    'trust.licensed': 'दर्ता प्राप्त फार्मेसी (नेपाल फार्मेसी काउन्सिल)',
    'trust.professionals': 'एनएमसी प्रमाणित विशेषज्ञ डाक्टरहरू',
    'trust.delivery': 'ललितपुर तथा काठमाडौँ उपत्यकामा द्रुत होम डेलिभरी',
    'trust.lab': 'गुणस्तरीय र अत्याधुनिक ल्याब डायग्नोस्टिक',

    // Services
    'services.heading': 'हाम्रा मुख्य स्वास्थ्य सेवाहरू',
    'services.subheading': 'तपाईंको समुदायमै भरपर्दो उपचार, आधुनिक ल्याब परीक्षण र गुणस्तरीय औषधि सेवा।',
    'service.pharmacy.title': 'समुदाय फार्मेसी',
    'service.pharmacy.desc': 'सक्कली औषधि, उचित भण्डारण, फर्मासिस्ट परामर्श तथा घरमै डेलिभरी।',
    'service.consultation.title': 'डाक्टर परामर्श',
    'service.consultation.desc': 'सामान्य फिजिसियन तथा बालरोग, स्त्रीरोग, मुटुरोग लगायतका विशेषज्ञ परामर्श।',
    'service.lab.title': 'डायग्नोस्टिक ल्याब',
    'service.lab.desc': 'रगत, पिसाब, बायोकेमिस्ट्री परीक्षण र छिटो अनलाइन डिजिटल रिपोर्ट।',
    'service.packages.title': 'स्वास्थ्य जाँच प्याकेजहरू',
    'service.packages.desc': 'सम्पूर्ण परिवार, महिला, पुरुष तथा ज्येष्ठ नागरिकका लागि सुलभ स्वास्थ्य जाँच।',
    'service.other.title': 'नर्सिङ तथा सामान्य सेवा',
    'service.other.desc': 'घाउ ड्रेसिङ, सुई, रक्तचाप जाँच, नेबुलाइजेसन तथा घरमै नर्सिङ सेवा।',

    // How It Works
    'howItWorks.title': 'सरल र भरपर्दो प्रक्रिया',
    'howItWorks.step1.title': '१. सेवा रोज्नुहोस्',
    'howItWorks.step1.desc': 'डाक्टर, ल्याब, स्वास्थ्य प्याकेज वा औषधि सोधपुछ छनोट गर्नुहोस्।',
    'howItWorks.step2.title': '२. समय तालिका छान्नुहोस्',
    'howItWorks.step2.desc': '१० मिनेटको समय सुरक्षित गर्दै अनलाइन बुक गर्नुहोस् वा प्रेस्क्रिप्सन अपलोड गर्नुहोस्।',
    'howItWorks.step3.title': '३. सेवा लिनुहोस्',
    'howItWorks.step3.desc': 'सनागाउँ क्लिनिकमा आउनुहोस् वा घरमै औषधि तथा सेवा प्राप्त गर्नुहोस्।',

    // Common
    'btn.learnMore': 'थप जान्नुहोस्',
    'btn.viewAll': 'सबै हेर्नुहोस्',
    'btn.submit': 'पठाउनुहोस्',
    'btn.cancel': 'रद्द गर्नुहोस्',
    'btn.confirm': 'पुष्टि गर्नुहोस्',
    'btn.close': 'बन्द गर्नुहोस्',
    'status.open': 'खुला छ',
    'status.closed': 'बन्द छ',
    'common.currency': 'रू',
  },
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('tbh_lang') as Language;
        if (saved === 'en' || saved === 'ne') {
          setLangState(saved);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.setItem('tbh_lang', newLang);
      } catch {
        // ignore
      }
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
