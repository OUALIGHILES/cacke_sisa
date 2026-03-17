"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "en" | "ar" | "fr"

interface Translations {
  [key: string]: {
    en: string
    ar: string
    fr: string
  }
}

export const translations: Translations = {
  // Navbar
  home: { en: "Home", ar: "الرئيسية", fr: "Accueil" },
  gallery: { en: "Gallery", ar: "المعرض", fr: "Galerie" },
  customize: { en: "Customize", ar: "تخصيص", fr: "Personnaliser" },
  contact: { en: "Contact", ar: "اتصل بنا", fr: "Contact" },
  admin: { en: "Admin", ar: "الإدارة", fr: "Admin" },
  
  // Hero Section
  premiumCakes: { en: "Premium Handmade Cakes", ar: "كيك فاخر يدوي الصنع", fr: "Gâteaux Faits Main Premium" },
  heroTitle: { en: "SISA_Cake", ar: "كيك سيسا", fr: "SISA_Cake" },
  heroSubtitle: { en: "Handmade Cakes for Your", ar: "كيك يدوي الصنع لـ", fr: "Gâteaux Faits Main pour Vos" },
  specialMoments: { en: "Special Moments", ar: "لحظاتك الخاصة", fr: "Moments Spéciaux" },
  heroDescription: { 
    en: "Every cake tells a story. We craft beautiful, delicious cakes for birthdays, weddings, and celebrations that create lasting memories.",
    ar: "كل كيكة تحكي قصة. نحن نصنع كيكات جميلة ولذيذة لأعياد الميلاد وحفلات الزفاف والاحتفالات التي تخلق ذكريات دائمة.",
    fr: "Chaque gâteau raconte une histoire. Nous créons de beaux gâteaux délicieux pour les anniversaires, mariages et célébrations qui créent des souvenirs durables."
  },
  viewCakes: { en: "View Cakes", ar: "عرض الكيكات", fr: "Voir les Gâteaux" },
  customizeYourCake: { en: "Customize Your Cake", ar: "خصص كيكتك", fr: "Personnalisez Votre Gâteau" },
  cakesMade: { en: "Cakes Made", ar: "كيكات مصنوعة", fr: "Gâteaux Créés" },
  customerRating: { en: "Customer Rating", ar: "تقييم العملاء", fr: "Évaluation Clients" },
  freshIngredients: { en: "Fresh Ingredients", ar: "مكونات طازجة", fr: "Ingrédients Frais" },
  scrollDown: { en: "Scroll Down", ar: "اسحب للأسفل", fr: "Défiler vers le bas" },
  
  // About Section
  ourStory: { en: "Our Story", ar: "قصتنا", fr: "Notre Histoire" },
  craftingSweet: { en: "Crafting Sweet", ar: "صنع ذكريات", fr: "Créer des Souvenirs" },
  memories: { en: "Memories", ar: "حلوة", fr: "Sucrés" },
  aboutDescription1: { 
    en: "SISA_Cake by OUALI SANA started as a home kitchen dream and has grown into a beloved bakery known for creating beautiful, delicious cakes that make celebrations unforgettable.",
    ar: "بدأت كيك سيسا من حلم في مطبخ المنزل على يد وعلي سناء ونمت لتصبح مخبزًا محبوبًا معروفًا بصنع كيكات جميلة ولذيذة تجعل الاحتفالات لا تُنسى.",
    fr: "SISA_Cake par OUALI SANA a commencé comme un rêve de cuisine maison et est devenu une boulangerie bien-aimée connue pour créer de beaux gâteaux délicieux qui rendent les célébrations inoubliables."
  },
  aboutDescription2: { 
    en: "Every cake we create is a work of art, combining traditional baking techniques with modern design aesthetics. We believe that a great cake is not just about taste but about the joy it brings to your special moments.",
    ar: "كل كيكة نصنعها هي عمل فني، يجمع بين تقنيات الخبز التقليدية والجماليات التصميمية الحديثة. نؤمن بأن الكيكة الرائعة ليست فقط عن المذاق بل عن الفرح الذي تجلبه للحظاتك الخاصة.",
    fr: "Chaque gâteau que nous créons est une œuvre d'art, combinant les techniques de pâtisserie traditionnelles avec l'esthétique du design moderne. Nous croyons qu'un excellent gâteau n'est pas seulement une question de goût mais de joie qu'il apporte à vos moments spéciaux."
  },
  yearsExperience: { en: "Years Experience", ar: "سنوات خبرة", fr: "Années d'Expérience" },
  madeWithLove: { en: "Made with Love", ar: "صنع بحب", fr: "Fait avec Amour" },
  madeWithLoveDesc: { en: "Every cake is crafted with passion and attention to detail.", ar: "كل كيكة مصنوعة بشغف واهتمام بالتفاصيل.", fr: "Chaque gâteau est confectionné avec passion et attention aux détails." },
  freshIngredientsTitle: { en: "Fresh Ingredients", ar: "مكونات طازجة", fr: "Ingrédients Frais" },
  freshIngredientsDesc: { en: "We use only the finest, freshest ingredients available.", ar: "نستخدم فقط أجود المكونات الطازجة المتاحة.", fr: "Nous utilisons uniquement les meilleurs ingrédients les plus frais." },
  awardWinning: { en: "Award Winning", ar: "حائز على جوائز", fr: "Primé" },
  awardWinningDesc: { en: "Recognized for excellence in taste and design.", ar: "معترف به للتميز في الذوق والتصميم.", fr: "Reconnu pour l'excellence du goût et du design." },
  onTimeDelivery: { en: "On-Time Delivery", ar: "توصيل في الوقت", fr: "Livraison à Temps" },
  onTimeDeliveryDesc: { en: "Your cake arrives fresh and on schedule, every time.", ar: "كيكتك تصل طازجة وفي الموعد، في كل مرة.", fr: "Votre gâteau arrive frais et à l'heure, à chaque fois." },
  
  // Footer
  footerDescription: { 
    en: "Crafting sweet memories with premium handmade cakes for your special moments. Created by OUALI SANA.",
    ar: "صنع ذكريات حلوة مع كيكات يدوية فاخرة للحظاتك الخاصة. أنشأتها وعلي سناء.",
    fr: "Créer des souvenirs sucrés avec des gâteaux faits main premium pour vos moments spéciaux. Créé par OUALI SANA."
  },
  quickLinks: { en: "Quick Links", ar: "روابط سريعة", fr: "Liens Rapides" },
  contactUs: { en: "Contact Us", ar: "اتصل بنا", fr: "Contactez-nous" },
  followUs: { en: "Follow Us", ar: "تابعنا", fr: "Suivez-nous" },
  openDaily: { en: "Open Daily: 9AM - 8PM", ar: "مفتوح يومياً: 9 صباحاً - 8 مساءً", fr: "Ouvert tous les jours: 9h - 20h" },
  allRightsReserved: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة.", fr: "Tous droits réservés." },
  createdBy: { en: "Created by", ar: "أنشأته", fr: "Créé par" },
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية", fr: "Politique de Confidentialité" },
  termsOfService: { en: "Terms of Service", ar: "شروط الخدمة", fr: "Conditions d'Utilisation" },
  
  // Featured Cakes
  featuredCakes: { en: "Featured Cakes", ar: "الكيكات المميزة", fr: "Gâteaux en Vedette" },
  ourSignature: { en: "Our Signature", ar: "إبداعاتنا", fr: "Nos Créations" },
  creations: { en: "Creations", fr: "Signature", ar: "المميزة" },
  viewAll: { en: "View All", ar: "عرض الكل", fr: "Voir Tout" },
  orderNow: { en: "Order Now", ar: "اطلب الآن", fr: "Commander" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل", fr: "Voir Détails" },
  
  // Testimonials
  testimonials: { en: "Testimonials", ar: "آراء العملاء", fr: "Témoignages" },
  whatOurCustomers: { en: "What Our Customers", ar: "ماذا يقول", fr: "Ce que Nos Clients" },
  say: { en: "Say", ar: "عملاؤنا", fr: "Disent" },
  
  // Contact Page
  getInTouch: { en: "Get in Touch", ar: "تواصل معنا", fr: "Contactez-nous" },
  sendMessage: { en: "Send Message", ar: "إرسال رسالة", fr: "Envoyer" },
  yourName: { en: "Your Name", ar: "اسمك", fr: "Votre Nom" },
  yourEmail: { en: "Your Email", ar: "بريدك الإلكتروني", fr: "Votre Email" },
  yourMessage: { en: "Your Message", ar: "رسالتك", fr: "Votre Message" },
  phone: { en: "Phone", ar: "الهاتف", fr: "Téléphone" },
  email: { en: "Email", ar: "البريد الإلكتروني", fr: "Email" },
  address: { en: "Address", ar: "العنوان", fr: "Adresse" },
  
  // Customize Page
  buildYourDream: { en: "Build Your Dream", ar: "اصنع كيكة", fr: "Créez Votre Gâteau" },
  cakeTitle: { en: "Cake", ar: "أحلامك", fr: "de Rêve" },
  selectSize: { en: "Select Size", ar: "اختر الحجم", fr: "Sélectionner la Taille" },
  selectFlavor: { en: "Select Flavor", ar: "اختر النكهة", fr: "Sélectionner le Parfum" },
  addOns: { en: "Add-Ons", ar: "إضافات", fr: "Suppléments" },
  totalPrice: { en: "Total Price", ar: "السعر الإجمالي", fr: "Prix Total" },
  placeOrder: { en: "Place Order", ar: "تأكيد الطلب", fr: "Passer Commande" },
  
  // Common
  loading: { en: "Loading...", ar: "جاري التحميل...", fr: "Chargement..." },
  from: { en: "From", ar: "من", fr: "À partir de" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && ["en", "ar", "fr"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
