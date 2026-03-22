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
  liked: { en: "Liked", ar: "المفضلة", fr: "Aimés" },
  messages: { en: "Messages", ar: "الرسائل", fr: "Messages" },
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
  backToHome: { en: "Back to Home", ar: "العودة للرئيسية", fr: "Retour à l'Accueil" },
  viewAll: { en: "View All", ar: "عرض الكل", fr: "Voir Tout" },
  orderNow: { en: "Order Now", ar: "اطلب الآن", fr: "Commander" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل", fr: "Voir Détails" },

  // Authentication
  signIn: { en: "Sign In", ar: "تسجيل الدخول", fr: "Se Connecter" },
  signUp: { en: "Sign Up", ar: "إنشاء حساب", fr: "S'inscrire" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج", fr: "Se Déconnecter" },
  welcomeBack: { en: "Welcome Back", ar: "مرحباً بعودتك", fr: "Bon Retour" },
  createAccount: { en: "Create Account", ar: "إنشاء حساب", fr: "Créer un Compte" },
  phone: { en: "Phone Number", ar: "رقم الهاتف", fr: "Numéro de Téléphone" },
  password: { en: "Password", ar: "كلمة المرور", fr: "Mot de Passe" },
  confirmPassword: { en: "Confirm Password", ar: "تأكيد كلمة المرور", fr: "Confirmer le Mot de Passe" },
  fullName: { en: "Full Name", ar: "الاسم الكامل", fr: "Nom Complet" },
  email: { en: "Email", ar: "البريد الإلكتروني", fr: "Email" },
  optional: { en: "Optional", ar: "اختياري", fr: "Optionnel" },
  dontHaveAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟", fr: "Vous n'avez pas de compte ?" },
  alreadyHaveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟", fr: "Vous avez déjà un compte ?" },
  creatingAccount: { en: "Creating account...", ar: "جاري إنشاء الحساب...", fr: "Création du compte..." },
  signingIn: { en: "Signing in...", ar: "جاري تسجيل الدخول...", fr: "Connexion en cours..." },
  signInToAccount: { en: "Sign in to your SISA_Cake account", ar: "سجل الدخول لحسابك في سيسا كيك", fr: "Connectez-vous à votre compte SISA_Cake" },
  joinForSweeter: { en: "Join SISA_Cake for a sweeter experience", ar: "انضم إلى سيسا كيك لتجربة ألذ", fr: "Rejoignez SISA_Cake pour une expérience plus douce" },
  enterCredentials: { en: "Enter your credentials to access your account", ar: "أدخل بيانات الدخول للوصول لحسابك", fr: "Entrez vos identifiants pour accéder à votre compte" },
  createAccountToGetStarted: { en: "Create your account to get started", ar: "أنشئ حسابك للبدء", fr: "Créez votre compte pour commencer" },
  demoCredentials: { en: "Demo Admin Credentials:", ar: "بيانات الدخول التجريبية:", fr: "Identifiants Admin de Démo :" },
  bySigningIn: { en: "By signing in, you agree to our", ar: "بتسجيل الدخول، أنت توافق على", fr: "En vous connectant, vous acceptez nos" },
  bySigningUp: { en: "By signing up, you agree to our", ar: "بإنشاء حساب، أنت توافق على", fr: "En vous inscrivant, vous acceptez nos" },
  termsOfService: { en: "Terms of Service", ar: "شروط الخدمة", fr: "Conditions d'Utilisation" },
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية", fr: "Politique de Confidentialité" },
  and: { en: "and", ar: "و", fr: "et" },
  phoneRequired: { en: "Phone number is required", ar: "رقم الهاتف مطلوب", fr: "Le numéro de téléphone est requis" },
  validPhone: { en: "Please enter a valid 10-digit phone number", ar: "الرجاء إدخال رقم هاتف صحيح من 10 أرقام", fr: "Veuillez entrer un numéro de téléphone valide à 10 chiffres" },
  passwordRequired: { en: "Password is required", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis" },
  passwordMinLength: { en: "Password must be at least 6 characters", ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", fr: "Le mot de passe doit contenir au moins 6 caractères" },
  nameRequired: { en: "Name is required", ar: "الاسم مطلوب", fr: "Le nom est requis" },
  nameMinLength: { en: "Name must be at least 2 characters", ar: "الاسم يجب أن يكون حرفين على الأقل", fr: "Le nom doit contenir au moins 2 caractères" },
  validEmail: { en: "Please enter a valid email address", ar: "الرجاء إدخال بريد إلكتروني صحيح", fr: "Veuillez entrer une adresse email valide" },
  confirmPasswordRequired: { en: "Please confirm your password", ar: "الرجاء تأكيد كلمة المرور", fr: "Veuillez confirmer votre mot de passe" },
  passwordsDoNotMatch: { en: "Passwords do not match", ar: "كلمتا المرور غير متطابقتين", fr: "Les mots de passe ne correspondent pas" },
  successfullySignedIn: { en: "Successfully signed in!", ar: "تم تسجيل الدخول بنجاح!", fr: "Connecté avec succès !" },
  accountCreated: { en: "Account created successfully!", ar: "تم إنشاء الحساب بنجاح!", fr: "Compte créé avec succès !" },
  invalidCredentials: { en: "Invalid phone number or password", ar: "رقم الهاتف أو كلمة المرور غير صحيحة", fr: "Numéro de téléphone ou mot de passe invalide" },
  phoneAlreadyRegistered: { en: "This phone number is already registered", ar: "رقم الهاتف مسجل مسبقاً", fr: "Ce numéro de téléphone est déjà enregistré" },
  databaseNotConfigured: { en: "Database not configured", ar: "قاعدة البيانات غير مهيأة", fr: "Base de données non configurée" },
  weak: { en: "Weak", ar: "ضعيف", fr: "Faible" },
  medium: { en: "Medium", ar: "متوسط", fr: "Moyen" },
  strong: { en: "Strong", ar: "قوي", fr: "Fort" },
  createStrongPassword: { en: "Create a strong password", ar: "أنشئ كلمة مرور قوية", fr: "Créez un mot de passe fort" },
  confirmYourPassword: { en: "Confirm your password", ar: "أكد كلمة المرور", fr: "Confirmez votre mot de passe" },
  name: { en: "Name", ar: "الاسم", fr: "Nom" },
  sendMessage: { en: "Send Message", ar: "إرسال رسالة", fr: "Envoyer le Message" },
  sending: { en: "Sending...", ar: "جاري الإرسال...", fr: "Envoi en cours..." },

  // Contact Page
  getInTouch: { en: "Get in Touch", ar: "تواصل معنا", fr: "Contactez-nous" },
  contactInfo: { en: "Contact Information", ar: "معلومات الاتصال", fr: "Coordonnées" },
  reachOut: { en: "Reach out to us through any of these channels. We typically respond within 2-4 hours during business hours.", ar: "تواصل معنا عبر أي من هذه القنوات. نرد عادة خلال 2-4 ساعات في أوقات العمل.", fr: "Contactez-nous par l'un de ces canaux. Nous répondons généralement dans les 2-4 heures pendant les heures de travail." },
  quickContact: { en: "Quick Contact", ar: "تواصل سريع", fr: "Contact Rapide" },
  ourLocation: { en: "Our Location", ar: "موقعنا", fr: "Notre Emplacement" },
  sendUsMessage: { en: "Send Us a Message", ar: "أرسل لنا رسالة", fr: "Envoyez-nous un Message" },
  fillOutForm: { en: "Fill out the form below and we will get back to you soon.", ar: "املأ النموذج أدناه وسنتواصل معك قريباً.", fr: "Remplissez le formulaire ci-dessous et nous vous répondrons bientôt." },
  yourName: { en: "Your Name", ar: "اسمك", fr: "Votre Nom" },
  yourEmail: { en: "Your Email", ar: "بريدك الإلكتروني", fr: "Votre Email" },
  yourMessage: { en: "Your Message", ar: "رسالتك", fr: "Votre Message" },
  messageSent: { en: "Message Sent!", ar: "تم إرسال الرسالة!", fr: "Message Envoyé !" },
  thankYouReachOut: { en: "Thank you for reaching out. We will get back to you within 24 hours.", ar: "شكراً لتواصلك. سنرد عليك خلال 24 ساعة.", fr: "Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures." },
  sendAnother: { en: "Send Another Message", ar: "أرسل رسالة أخرى", fr: "Envoyer un Autre Message" },
  haveQuestions: { en: "Have questions or want to place an order? We would love to hear from you. Send us a message and we will respond as soon as possible.", ar: "هل لديك أسئلة أو تريد تقديم طلب؟ نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.", fr: "Vous avez des questions ou voulez passer commande ? Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dès que possible." },
  workingHours: { en: "Working Hours", ar: "ساعات العمل", fr: "Heures d'Ouverture" },
  monSat: { en: "Mon-Sat: 9AM - 6PM", ar: "الإثنين-السبت: 9ص - 6م", fr: "Lun-Sam: 9h - 18h" },
  whatsapp: { en: "WhatsApp", ar: "واتساب", fr: "WhatsApp" },
  emailUs: { en: "Email Us", ar: "راسلنا", fr: "Envoyez-nous un Email" },
  instagram: { en: "Instagram", ar: "إنستغرام", fr: "Instagram" },

  // Gallery Page
  cakeGallery: { en: "Cake Gallery", ar: "معرض الكيكات", fr: "Galerie des Gâteaux" },
  ourCake: { en: "Our Cake", ar: "كيكاتنا", fr: "Nos Gâteaux" },
  gallery: { en: "Gallery", ar: "المعرض", fr: "Galerie" },
  discoverCollection: { en: "Discover our collection of beautiful handmade cakes, each crafted with love and premium ingredients for your special moments.", ar: "اكتشف مجموعتنا من الكيكات اليدوية الجميلة، كل واحدة مصنوعة بحب ومكونات فاخرة للحظاتك الخاصة.", fr: "Découvrez notre collection de beaux gâteaux faits main, chacun créé avec amour et des ingrédients premium pour vos moments spéciaux." },
  allCakes: { en: "All Cakes", ar: "كل الكيكات", fr: "Tous les Gâteaux" },
  birthday: { en: "Birthday", ar: "عيد الميلاد", fr: "Anniversaire" },
  wedding: { en: "Wedding", ar: "زفاف", fr: "Mariage" },
  kids: { en: "Kids", ar: "أطفال", fr: "Enfants" },
  popular: { en: "Popular", ar: "مشهور", fr: "Populaire" },
  view: { en: "View", ar: "عرض", fr: "Voir" },
  order: { en: "Order", ar: "طلب", fr: "Commander" },
  da: { en: "DA", ar: "دج", fr: "DA" },

  // Customize Page
  customizeYourCake: { en: "Customize Your Cake", ar: "خصص كيكتك", fr: "Personnalisez Votre Gâteau" },
  designDreamCake: { en: "Design your dream cake with our interactive configurator. Choose your size, add extras, and watch your price update in real-time.", ar: "صمم كيكة أحلامك مع أداة التخصيص التفاعلية. اختر الحجم، أضف إضافات، وشاهد السعر يتحدث في الوقت الفعلي.", fr: "Concevez le gâteau de vos rêves avec notre configurateur interactif. Choisissez votre taille, ajoutez des extras et regardez votre prix se mettre à jour en temps réel." },
  chooseSize: { en: "Choose Cake Size", ar: "اختر حجم الكيكة", fr: "Choisissez la Taille du Gâteau" },
  chooseExtras: { en: "Choose Extras", ar: "اختر الإضافات", fr: "Choisissez les Suppléments" },
  quantity: { en: "Quantity", ar: "الكمية", fr: "Quantité" },
  priceSummary: { en: "Price Summary", ar: "ملخص السعر", fr: "Résumé du Prix" },
  orderViaWhatsApp: { en: "Order via WhatsApp", ar: "اطلب عبر واتساب", fr: "Commander via WhatsApp" },
  smallCake: { en: "Small Cake", ar: "كيكة صغيرة", fr: "Petit Gâteau" },
  mediumCake: { en: "Medium Cake", ar: "كيكة متوسطة", fr: "Gâteau Moyen" },
  largeCake: { en: "Large Cake", ar: "كيكة كبيرة", fr: "Grand Gâteau" },
  extraLarge: { en: "Extra Large", ar: "كبيرة جداً", fr: "Très Grand" },
  inchServes: { en: "inch - Serves", ar: "بوصة - تكفي", fr: "pouces - Sert" },
  addAlmonds: { en: "Add Almonds", ar: "إضافة لوز", fr: "Ajouter Amandes" },
  extraChocolate: { en: "Extra Chocolate", ar: "شوكولاتة إضافية", fr: "Chocolat Supplémentaire" },
  customNameWriting: { en: "Custom Name Writing", ar: "كتابة اسم مخصص", fr: "Écriture de Nom Personnalisé" },
  extraDecoration: { en: "Extra Decoration", ar: "زينة إضافية", fr: "Décoration Supplémentaire" },
  premiumFruits: { en: "Premium Fruits", ar: "فواكه فاخرة", fr: "Fruits Premium" },
  goldLeafAccent: { en: "Gold Leaf Accent", ar: "لمسة ورق الذهب", fr: "Accent Feuille d'Or" },
  macaronsTopping: { en: "Macarons Topping", ar: "تopping macarons", fr: "Garniture Macarons" },
  freshFlowers: { en: "Fresh Flowers", ar: "زهور طازجة", fr: "Fleurs Fraîches" },
  premiumRoastedAlmonds: { en: "Premium roasted almonds", ar: "لوز محمص فاخر", fr: "Amandes grillées premium" },
  belgianChocolate: { en: "Belgian dark chocolate drizzle", ar: "تغميس شوكولاتة داكنة بلجيكية", fr: "Nappage chocolat noir belge" },
  personalizedMessage: { en: "Personalized message", ar: "رسالة شخصية", fr: "Message personnalisé" },
  additionalFondant: { en: "Additional fondant decorations", ar: "زينة فوندان إضافية", fr: "Décorations en fondant supplémentaires" },
  freshSeasonalFruits: { en: "Fresh seasonal fruits", ar: "فواكه موسمية طازجة", fr: "Fruits de saison frais" },
  edibleGold: { en: "Edible gold leaf decoration", ar: "زينة ورق ذهب صالحة للأكل", fr: "Décoration en feuille d'or comestible" },
  frenchMacarons: { en: "6 French macarons on top", ar: "6 ماكارون فرنسي في الأعلى", fr: "6 macarons français sur le dessus" },
  edibleFlower: { en: "Edible flower decoration", ar: "زينة زهور صالحة للأكل", fr: "Décoration de fleurs comestibles" },
  extras: { en: "Extras", ar: "الإضافات", fr: "Suppléments" },
  totalPrice: { en: "Total Price", ar: "السعر الإجمالي", fr: "Prix Total" },
  helloOrder: { en: "Hello! I would like to order:", ar: "مرحباً! أود أن أطلب:", fr: "Bonjour ! Je voudrais commander :" },
  cakeSize: { en: "Cake Size", ar: "حجم الكيكة", fr: "Taille du gâteau" },
  pleaseLetKnow: { en: "Please let me know about availability and delivery options.", ar: "الرجاء إعلامي بالتوفر وخيارات التوصيل.", fr: "Veuillez me faire savoir la disponibilité et les options de livraison." },

  // Liked Page
  myLiked: { en: "My Liked", ar: "المفضلة", fr: "Mes Aimés" },
  cakes: { en: "Cakes", ar: "كيكات", fr: "Gâteaux" },
  browseFavorites: { en: "Browse your favorite cakes that you've saved for your special moments.", ar: "تصفح الكيكات المفضلة التي حفظتها للحظاتك الخاصة.", fr: "Parcourez vos gâteaux préférés que vous avez enregistrés pour vos moments spéciaux." },
  noLikedCakes: { en: "No liked cakes yet", ar: "لا توجد كيكات مفضلة بعد", fr: "Aucun gâteau aimé pour le moment" },
  startLiking: { en: "Start liking cakes to build your collection!", ar: "ابدأ بالإعجاب بالكيكات لبناء مجموعتك!", fr: "Commencez à aimer des gâteaux pour construire votre collection !" },
  browseGallery: { en: "Browse Gallery", ar: "تصفح المعرض", fr: "Parcourir la Galerie" },

  // Messages Page
  myMessages: { en: "My Messages", ar: "رسائلي", fr: "Mes Messages" },
  viewAllDiscussions: { en: "View all your cake discussions", ar: "عرض كل نقاشاتك حول الكيكات", fr: "Voir toutes vos discussions sur les gâteaux" },
  loadingMessages: { en: "Loading messages...", ar: "جاري تحميل الرسائل...", fr: "Chargement des messages..." },
  noMessagesYet: { en: "No messages yet", ar: "لا توجد رسائل بعد", fr: "Aucun message pour le moment" },
  startDiscussion: { en: "Start a discussion about a cake you like!", ar: "ابدأ نقاشاً حول كيكة تعجبك!", fr: "Commencez une discussion sur un gâteau que vous aimez !" },
  browseCakes: { en: "Browse Cakes", ar: "تصفح الكيكات", fr: "Parcourir les Gâteaux" },
  unknownCake: { en: "Unknown Cake", ar: "كيكة غير معروفة", fr: "Gâteau Inconnu" },
  message: { en: "message", ar: "رسالة", fr: "message" },
  messages: { en: "messages", ar: "رسائل", fr: "messages" },

  // Admin Page
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة التحكم", fr: "Tableau de Bord Admin" },
  manageCakes: { en: "Manage Cakes", ar: "إدارة الكيكات", fr: "Gérer les Gâteaux" },
  manageOrders: { en: "Manage Orders", ar: "إدارة الطلبات", fr: "Gérer les Commandes" },
  viewMessages: { en: "View Messages", ar: "عرض الرسائل", fr: "Voir les Messages" },
  settings: { en: "Settings", ar: "الإعدادات", fr: "Paramètres" },

  // Cake Card
  addToLiked: { en: "Add to Liked", ar: "أضف للمفضلة", fr: "Ajouter aux Aimés" },
  removeFromLiked: { en: "Remove from Liked", ar: "أزل من المفضلة", fr: "Retirer des Aimés" },

  // Location Map
  visitUs: { en: "Visit Us", ar: "زرنا", fr: "Visitez-nous" },
  findUsAt: { en: "Find us at our bakery location in the heart of the city.", ar: "اعثر علينا في مخبزنا في قلب المدينة.", fr: "Retrouvez-nous à notre boulangerie au cœur de la ville." },

  // Gallery Page
  ourCakeGallery: { en: "Our Cake Gallery", ar: "معرض الكيكات", fr: "Notre Galerie de Gâteaux" },
  discoverCollection: { en: "Discover our collection of beautiful handmade cakes, each crafted with love and premium ingredients for your special moments.", ar: "اكتشف مجموعتنا من الكيكات اليدوية الجميلة، كل واحدة مصنوعة بحب ومكونات فاخرة للحظاتك الخاصة.", fr: "Découvrez notre collection de beaux gâteaux faits main, chacun créé avec amour et des ingrédients premium pour vos moments spéciaux." },

  // Gallery Component
  allCakes: { en: "All Cakes", ar: "كل الكيكات", fr: "Tous les Gâteaux" },
  birthday: { en: "Birthday", ar: "عيد الميلاد", fr: "Anniversaire" },
  wedding: { en: "Wedding", ar: "زفاف", fr: "Mariage" },
  kids: { en: "Kids", ar: "أطفال", fr: "Enfants" },
  popular: { en: "Popular", ar: "مشهور", fr: "Populaire" },
  view: { en: "View", ar: "عرض", fr: "Voir" },
  order: { en: "Order", ar: "طلب", fr: "Commander" },
  da: { en: "DA", ar: "دج", fr: "DA" },

  // Customize Page
  customizeYourCake: { en: "Customize Your Cake", ar: "خصص كيكتك", fr: "Personnalisez Votre Gâteau" },
  designDreamCake: { en: "Design your dream cake with our interactive configurator. Choose your size, add extras, and watch your price update in real-time.", ar: "صمم كيكة أحلامك مع أداة التخصيص التفاعلية. اختر الحجم، أضف إضافات، وشاهد السعر يتحدث في الوقت الفعلي.", fr: "Concevez le gâteau de vos rêves avec notre configurateur interactif. Choisissez votre taille, ajoutez des extras et regardez votre prix se mettre à jour en temps réel." },

  // Cake Configurator
  chooseCakeSize: { en: "Choose Cake Size", ar: "اختر حجم الكيكة", fr: "Choisissez la Taille du Gâteau" },
  chooseExtras: { en: "Choose Extras", ar: "اختر الإضافات", fr: "Choisissez les Suppléments" },
  quantity: { en: "Quantity", ar: "الكمية", fr: "Quantité" },
  priceSummary: { en: "Price Summary", ar: "ملخص السعر", fr: "Résumé du Prix" },
  orderViaWhatsApp: { en: "Order via WhatsApp", ar: "اطلب عبر واتساب", fr: "Commander via WhatsApp" },
  smallCake: { en: "Small Cake", ar: "كيكة صغيرة", fr: "Petit Gâteau" },
  mediumCake: { en: "Medium Cake", ar: "كيكة متوسطة", fr: "Gâteau Moyen" },
  largeCake: { en: "Large Cake", ar: "كيكة كبيرة", fr: "Grand Gâteau" },
  extraLarge: { en: "Extra Large", ar: "كبيرة جداً", fr: "Très Grand" },
  inchServes: { en: "inch - Serves", ar: "بوصة - تكفي", fr: "pouces - Sert" },
  addAlmonds: { en: "Add Almonds", ar: "إضافة لوز", fr: "Ajouter Amandes" },
  extraChocolate: { en: "Extra Chocolate", ar: "شوكولاتة إضافية", fr: "Chocolat Supplémentaire" },
  customNameWriting: { en: "Custom Name Writing", ar: "كتابة اسم مخصص", fr: "Écriture de Nom Personnalisé" },
  extraDecoration: { en: "Extra Decoration", ar: "زينة إضافية", fr: "Décoration Supplémentaire" },
  premiumFruits: { en: "Premium Fruits", ar: "فواكه فاخرة", fr: "Fruits Premium" },
  goldLeafAccent: { en: "Gold Leaf Accent", ar: "لمسة ورق الذهب", fr: "Accent Feuille d'Or" },
  macaronsTopping: { en: "Macarons Topping", ar: "تopping macarons", fr: "Garniture Macarons" },
  freshFlowers: { en: "Fresh Flowers", ar: "زهور طازجة", fr: "Fleurs Fraîches" },
  premiumRoastedAlmonds: { en: "Premium roasted almonds", ar: "لوز محمص فاخر", fr: "Amandes grillées premium" },
  belgianChocolate: { en: "Belgian dark chocolate drizzle", ar: "تغميس شوكولاتة داكنة بلجيكية", fr: "Nappage chocolat noir belge" },
  personalizedMessage: { en: "Personalized message", ar: "رسالة شخصية", fr: "Message personnalisé" },
  additionalFondant: { en: "Additional fondant decorations", ar: "زينة فوندان إضافية", fr: "Décorations en fondant supplémentaires" },
  freshSeasonalFruits: { en: "Fresh seasonal fruits", ar: "فواكه موسمية طازجة", fr: "Fruits de saison frais" },
  edibleGold: { en: "Edible gold leaf decoration", ar: "زينة ورق ذهب صالحة للأكل", fr: "Décoration en feuille d'or comestible" },
  frenchMacarons: { en: "6 French macarons on top", ar: "6 ماكارون فرنسي في الأعلى", fr: "6 macarons français sur le dessus" },
  edibleFlower: { en: "Edible flower decoration", ar: "زينة زهور صالحة للأكل", fr: "Décoration de fleurs comestibles" },
  extras: { en: "Extras", ar: "الإضافات", fr: "Suppléments" },
  totalPrice: { en: "Total Price", ar: "السعر الإجمالي", fr: "Prix Total" },
  helloOrder: { en: "Hello! I would like to order:", ar: "مرحباً! أود أن أطلب:", fr: "Bonjour ! Je voudrais commander :" },
  cakeSize: { en: "Cake Size", ar: "حجم الكيكة", fr: "Taille du gâteau" },
  pleaseLetKnow: { en: "Please let me know about availability and delivery options.", ar: "الرجاء إعلامي بالتوفر وخيارات التوصيل.", fr: "Veuillez me faire savoir la disponibilité et les options de livraison." },
  serves: { en: "Serves", ar: "تكفي", fr: "Sert" },

  // Liked Page
  myLikedCakes: { en: "My Liked Cakes", ar: "الكيكات المفضلة", fr: "Mes Gâteaux Aimés" },
  browseFavorites: { en: "Browse your favorite cakes that you've saved for your special moments.", ar: "تصفح الكيكات المفضلة التي حفظتها للحظاتك الخاصة.", fr: "Parcourez vos gâteaux préférés que vous avez enregistrés pour vos moments spéciaux." },
  noLikedCakesYet: { en: "No liked cakes yet", ar: "لا توجد كيكات مفضلة بعد", fr: "Aucun gâteau aimé pour le moment" },
  startLiking: { en: "Start liking cakes to build your collection!", ar: "ابدأ بالإعجاب بالكيكات لبناء مجموعتك!", fr: "Commencez à aimer des gâteaux pour construire votre collection !" },
  browseGallery: { en: "Browse Gallery", ar: "تصفح المعرض", fr: "Parcourir la Galerie" },
  liked: { en: "Liked", ar: "مفضل", fr: "Aimé" },
  clearAll: { en: "Clear All", ar: "مسح الكل", fr: "Tout Effacer" },
  cakesLiked: { en: "Cakes Liked", ar: "كيكات مفضلة", fr: "Gâteaux Aimés" },
  cakeLiked: { en: "Cake Liked", ar: "كيكة مفضلة", fr: "Gâteau Aimé" },
  youHaventLiked: { en: "You haven't liked any cakes yet. Browse our gallery and save your favorites!", ar: "لم تقم بالإعجاب بأي كيكات بعد. تصفح معرضنا واحفظ كيكاتك المفضلة!", fr: "Vous n'avez pas encore aimé de gâteaux. Parcourez notre galerie et sauvegardez vos favoris !" },

  // Messages Page
  myMessages: { en: "My Messages", ar: "رسائلي", fr: "Mes Messages" },
  viewAllDiscussions: { en: "View all your cake discussions", ar: "عرض كل نقاشاتك حول الكيكات", fr: "Voir toutes vos discussions sur les gâteaux" },
  loadingMessages: { en: "Loading messages...", ar: "جاري تحميل الرسائل...", fr: "Chargement des messages..." },
  noMessagesYet: { en: "No messages yet", ar: "لا توجد رسائل بعد", fr: "Aucun message pour le moment" },
  startDiscussion: { en: "Start a discussion about a cake you like!", ar: "ابدأ نقاشاً حول كيكة تعجبك!", fr: "Commencez une discussion sur un gâteau que vous aimez !" },
  browseCakes: { en: "Browse Cakes", ar: "تصفح الكيكات", fr: "Parcourir les Gâteaux" },
  unknownCake: { en: "Unknown Cake", ar: "كيكة غير معروفة", fr: "Gâteau Inconnu" },
  message: { en: "message", ar: "رسالة", fr: "message" },
  messages: { en: "messages", ar: "رسائل", fr: "messages" },
  backToHome: { en: "Back to Home", ar: "العودة للرئيسية", fr: "Retour à l'Accueil" },
  more: { en: "more", ar: "أكثر", fr: "en plus" },
  removeFromLiked: { en: "Remove from liked", ar: "إزالة من المفضلة", fr: "Retirer des aimés" },

  // Admin Dashboard
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة التحكم", fr: "Tableau de Bord Admin" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم", fr: "Tableau de Bord" },
  welcomeBackOverview: { en: "Welcome back! Here is your bakery overview.", ar: "مرحباً بعودتك! هذه نظرة عامة على مخبزك.", fr: "Bon retour ! Voici l'aperçu de votre boulangerie." },
  totalCakes: { en: "Total Cakes", ar: "إجمالي الكيكات", fr: "Total Gâteaux" },
  newMessages: { en: "New Messages", ar: "رسائل جديدة", fr: "Nouveaux Messages" },
  monthlyRevenue: { en: "Monthly Revenue", ar: "الإيرادات الشهرية", fr: "Revenus Mensuels" },
  totalOrders: { en: "Total Orders", ar: "إجمالي الطلبات", fr: "Total Commandes" },
  fromLastMonth: { en: "from last month", ar: "من الشهر الماضي", fr: "du mois dernier" },
  recentMessages: { en: "Recent Messages", ar: "الرسائل الأخيرة", fr: "Messages Récents" },
  recentOrders: { en: "Recent Orders", ar: "الطلبات الأخيرة", fr: "Commandes Récentes" },
  quickActions: { en: "Quick Actions", ar: "إجراءات سريعة", fr: "Actions Rapides" },
  addNewCake: { en: "Add New Cake", ar: "إضافة كيكة جديدة", fr: "Ajouter Nouveau Gâteau" },
  viewMessages: { en: "View Messages", ar: "عرض الرسائل", fr: "Voir Messages" },
  editPricing: { en: "Edit Pricing", ar: "تعديل الأسعار", fr: "Modifier Prix" },
  settings: { en: "Settings", ar: "الإعدادات", fr: "Paramètres" },
  adminPanel: { en: "Admin Panel", ar: "لوحة الإدارة", fr: "Panneau Admin" },
  backToSite: { en: "Back to Site", ar: "العودة للموقع", fr: "Retour au Site" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج", fr: "Se Déconnecter" },

  // Admin Cakes Page
  manageCakes: { en: "Manage Cakes", ar: "إدارة الكيكات", fr: "Gérer les Gâteaux" },
  addEditDeleteCake: { en: "Add, edit, and delete cake products", ar: "إضافة وتعديل وحذف منتجات الكيك", fr: "Ajouter, modifier et supprimer des gâteaux" },
  addNewCake: { en: "Add New Cake", ar: "إضافة كيكة جديدة", fr: "Ajouter Nouveau Gâteau" },
  editCake: { en: "Edit Cake", ar: "تعديل الكيكة", fr: "Modifier Gâteau" },
  cakeTitle: { en: "Cake Title", ar: "عنوان الكيكة", fr: "Titre du Gâteau" },
  description: { en: "Description", ar: "الوصف", fr: "Description" },
  describeCake: { en: "Describe the cake...", ar: "اصف الكيكة...", fr: "Décrivez le gâteau..." },
  price: { en: "Price (DA)", ar: "السعر (دج)", fr: "Prix (DA)" },
  imageUrl: { en: "Image URL", ar: "رابط الصورة", fr: "URL Image" },
  cancel: { en: "Cancel", ar: "إلغاء", fr: "Annuler" },
  saveChanges: { en: "Save Changes", ar: "حفظ التغييرات", fr: "Enregistrer" },
  addCake: { en: "Add Cake", ar: "إضافة كيكة", fr: "Ajouter Gâteau" },
  searchCakes: { en: "Search cakes...", ar: "بحث عن كيكات...", fr: "Rechercher gâteaux..." },
  edit: { en: "Edit", ar: "تعديل", fr: "Modifier" },
  delete: { en: "Delete", ar: "حذف", fr: "Supprimer" },
  noCakesFound: { en: "No cakes found", ar: "لم يتم العثور على كيكات", fr: "Aucun gâteau trouvé" },
  deleteCakeConfirm: { en: "Are you sure you want to delete this cake?", ar: "هل أنت متأكد من حذف هذه الكيكة؟", fr: "Êtes-vous sûr de vouloir supprimer ce gâteau ?" },

  // Admin Messages Page
  customerMessages: { en: "Customer Messages", ar: "رسائل العملاء", fr: "Messages Clients" },
  unreadMessages: { en: "unread messages", ar: "رسائل غير مقروءة", fr: "messages non lus" },
  allMessagesRead: { en: "All messages read", ar: "جميع الرسائل مقروءة", fr: "Tous les messages lus" },
  searchMessages: { en: "Search messages...", ar: "بحث في الرسائل...", fr: "Rechercher messages..." },
  loadingMessages: { en: "Loading messages...", ar: "جاري تحميل الرسائل...", fr: "Chargement des messages..." },
  noMessagesFound: { en: "No messages found", ar: "لم يتم العثور على رسائل", fr: "Aucun message trouvé" },
  selectMessageView: { en: "Select a message to view details", ar: "اختر رسالة لعرض التفاصيل", fr: "Sélectionnez un message pour voir les détails" },
  customerInformation: { en: "Customer Information", ar: "معلومات العميل", fr: "Informations Client" },
  name: { en: "Name", ar: "الاسم", fr: "Nom" },
  phone: { en: "Phone", ar: "الهاتف", fr: "Téléphone" },
  email: { en: "Email", ar: "البريد الإلكتروني", fr: "Email" },
  sendReply: { en: "Send Reply", ar: "إرسال رد", fr: "Envoyer Réponse" },
  typeReply: { en: "Type your reply...", ar: "اكتب ردك...", fr: "Tapez votre réponse..." },
  whatsapp: { en: "WhatsApp", ar: "واتساب", fr: "WhatsApp" },
  deleteMessage: { en: "Delete Message", ar: "حذف الرسالة", fr: "Supprimer Message" },
  deleteMessageConfirm: { en: "Are you sure you want to delete this message?", ar: "هل أنت متأكد من حذف هذه الرسالة؟", fr: "Êtes-vous sûr de vouloir supprimer ce message ?" },
  errorDeletingMessage: { en: "Error deleting message", ar: "خطأ في حذف الرسالة", fr: "Erreur lors de la suppression" },
  errorSendingReply: { en: "Error sending reply. Check console for details.", ar: "خطأ في إرسال الرد. تحقق من الكونسول.", fr: "Erreur lors de l'envoi. Vérifiez la console." },
  replySentSuccessfully: { en: "Reply sent successfully!", ar: "تم إرسال الرد بنجاح!", fr: "Réponse envoyée avec succès !" },

  // Admin Pricing Page
  pricingManager: { en: "Pricing Manager", ar: "مدير الأسعار", fr: "Gestionnaire de Prix" },
  manageSizesAddons: { en: "Manage cake sizes and add-ons pricing", ar: "إدارة أسعار أحجام الكيك والإضافات", fr: "Gérer les tailles et suppléments" },
  cakeSizes: { en: "Cake Sizes", ar: "أحجام الكيك", fr: "Tailles de Gâteau" },
  addSize: { en: "Add Size", ar: "إضافة حجم", fr: "Ajouter Taille" },
  editSize: { en: "Edit Size", ar: "تعديل الحجم", fr: "Modifier Taille" },
  addNewSize: { en: "Add New Size", ar: "إضافة حجم جديد", fr: "Ajouter Nouvelle Taille" },
  sizeName: { en: "Size Name", ar: "اسم الحجم", fr: "Nom de la Taille" },
  example: { en: "e.g.", ar: "مثال:", fr: "ex." },
  mediumCake: { en: "Medium Cake", ar: "كيكة متوسطة", fr: "Gâteau Moyen" },
  save: { en: "Save", ar: "حفظ", fr: "Enregistrer" },
  add: { en: "Add", ar: "إضافة", fr: "Ajouter" },
  deleteSizeConfirm: { en: "Delete this size?", ar: "حذف هذا الحجم؟", fr: "Supprimer cette taille ?" },
  addOnsExtras: { en: "Add-ons / Extras", ar: "الإضافات / الإضافات الخاصة", fr: "Suppléments / Extras" },
  addExtra: { en: "Add Extra", ar: "إضافة إضافية", fr: "Ajouter Extra" },
  editAddOn: { en: "Edit Add-on", ar: "تعديل الإضافة", fr: "Modifier Supplément" },
  addNewAddOn: { en: "Add New Add-on", ar: "إضافة إضافة جديدة", fr: "Ajouter Nouveau Supplément" },
  addOnName: { en: "Add-on Name", ar: "اسم الإضافة", fr: "Nom du Supplément" },
  exampleExtra: { en: "e.g., Extra Chocolate", ar: "مثال: شوكولاتة إضافية", fr: "ex: Chocolat Supplémentaire" },
  deleteAddOnConfirm: { en: "Delete this add-on?", ar: "حذف هذه الإضافة؟", fr: "Supprimer ce supplément ?" },

  // Admin Settings Page
  businessSettings: { en: "Business Settings", ar: "إعدادات العمل", fr: "Paramètres Entreprise" },
  updateContactLocation: { en: "Update your contact information and location", ar: "تحديث معلومات الاتصال والموقع", fr: "Mettre à jour coordonnées et emplacement" },
  contactInformation: { en: "Contact Information", ar: "معلومات الاتصال", fr: "Coordonnées" },
  updateSocialContact: { en: "Update your social media and contact details displayed on the website", ar: "تحديث وسائل التواصل وتفاصيل الاتصال المعروضة على الموقع", fr: "Mettre à jour réseaux sociaux et coordonnées" },
  whatsappNumber: { en: "WhatsApp Number", ar: "رقم الواتساب", fr: "Numéro WhatsApp" },
  emailAddress: { en: "Email Address", ar: "عنوان البريد", fr: "Adresse Email" },
  instagramHandle: { en: "Instagram Handle", ar: "حساب إنستغرام", fr: "Compte Instagram" },
  businessHours: { en: "Business Hours", ar: "ساعات العمل", fr: "Heures d'Ouverture" },
  locationSettings: { en: "Location Settings", ar: "إعدادات الموقع", fr: "Paramètres d'Emplacement" },
  setBusinessAddress: { en: "Set your business address and map coordinates", ar: "تعيين عنوان العمل وإحداثيات الخريطة", fr: "Définir adresse et coordonnées" },
  fullAddress: { en: "Full Address", ar: "العنوان الكامل", fr: "Adresse Complète" },
  latitude: { en: "Latitude", ar: "خط العرض", fr: "Latitude" },
  longitude: { en: "Longitude", ar: "خط الطول", fr: "Longitude" },
  tipFindCoordinates: { en: "Tip: You can find coordinates by searching your address on Google Maps and copying the lat/lng from the URL.", ar: "نصيحة: يمكنك العثور على الإحداثيات بالبحث عن عنوانك في خرائط جوجل ونسخ خط العرض/الطول من الرابط.", fr: "Astuce: Trouvez les coordonnées en recherchant votre adresse sur Google Maps." },
  saving: { en: "Saving...", ar: "جاري الحفظ...", fr: "Enregistrement..." },
  saveSettings: { en: "Save Settings", ar: "حفظ الإعدادات", fr: "Enregistrer Paramètres" },
  settingsSaved: { en: "Settings saved successfully!", ar: "تم حفظ الإعدادات بنجاح!", fr: "Paramètres enregistrés avec succès !" },
  loadingSettings: { en: "Loading settings...", ar: "جاري تحميل الإعدادات...", fr: "Chargement des paramètres..." },
  settingsTableNotFound: { en: "Settings table not found. Please run the SQL query in Supabase dashboard to create the table.", ar: "جدول الإعدادات غير موجود. الرجاء تشغيل استعلام SQL في لوحة تحكم Supabase لإنشاء الجدول.", fr: "Table des paramètres introuvable. Exécutez la requête SQL dans le tableau de bord Supabase." },
  errorSavingSettings: { en: "Error saving settings", ar: "خطأ في حفظ الإعدادات", fr: "Erreur lors de l'enregistrement" },

  // Admin Sidebar
  cakes: { en: "Cakes", ar: "الكيكات", fr: "Gâteaux" },
  pricing: { en: "Pricing", ar: "الأسعار", fr: "Prix" },
  viewWebsite: { en: "View Website", ar: "عرض الموقع", fr: "Voir Site" },
  logout: { en: "Logout", ar: "تسجيل الخروج", fr: "Déconnexion" },

  // New Admin Pages
  orders: { en: "Orders", ar: "الطلبات", fr: "Commandes" },
  reviews: { en: "Reviews", ar: "التقييمات", fr: "Avis" },
  analytics: { en: "Analytics", ar: "التحليلات", fr: "Analytiques" },
  customers: { en: "Customers", ar: "العملاء", fr: "Clients" },
  notifications: { en: "Notifications", ar: "الإشعارات", fr: "Notifications" },

  // Orders Page
  manageOrders: { en: "Manage Orders", ar: "إدارة الطلبات", fr: "Gérer les Commandes" },
  trackOrderStatus: { en: "Track and manage order status", ar: "تتبع وإدارة حالة الطلب", fr: "Suivre et gérer l'état des commandes" },
  orderHistory: { en: "Order History", ar: "سجل الطلبات", fr: "Historique des Commandes" },
  orderDetails: { en: "Order Details", ar: "تفاصيل الطلب", fr: "Détails de la Commande" },
  orderId: { en: "Order ID", ar: "رقم الطلب", fr: "ID Commande" },
  orderDate: { en: "Order Date", ar: "تاريخ الطلب", fr: "Date de Commande" },
  orderStatus: { en: "Order Status", ar: "حالة الطلب", fr: "Statut de la Commande" },
  orderTotal: { en: "Order Total", ar: "إجمالي الطلب", fr: "Total Commande" },
  customerName: { en: "Customer Name", ar: "اسم العميل", fr: "Nom du Client" },
  customerPhone: { en: "Customer Phone", ar: "هاتف العميل", fr: "Téléphone du Client" },
  deliveryAddress: { en: "Delivery Address", ar: "عنوان التوصيل", fr: "Adresse de Livraison" },
  orderNotes: { en: "Order Notes", ar: "ملاحظات الطلب", fr: "Notes de Commande" },
  updateStatus: { en: "Update Status", ar: "تحديث الحالة", fr: "Mettre à Jour le Statut" },
  pending: { en: "Pending", ar: "قيد الانتظار", fr: "En Attente" },
  confirmed: { en: "Confirmed", ar: "مؤكد", fr: "Confirmé" },
  preparing: { en: "Preparing", ar: "قيد التحضير", fr: "En Préparation" },
  ready: { en: "Ready", ar: "جاهز", fr: "Prêt" },
  outForDelivery: { en: "Out for Delivery", ar: "خارج للتوصيل", fr: "En Livraison" },
  delivered: { en: "Delivered", ar: "تم التوصيل", fr: "Livré" },
  cancelled: { en: "Cancelled", ar: "ملغي", fr: "Annulé" },
  filterByStatus: { en: "Filter by Status", ar: "تصفية حسب الحالة", fr: "Filtrer par Statut" },
  allOrders: { en: "All Orders", ar: "كل الطلبات", fr: "Toutes les Commandes" },
  noOrdersFound: { en: "No orders found", ar: "لم يتم العثور على طلبات", fr: "Aucune commande trouvée" },
  statusUpdated: { en: "Status updated successfully!", ar: "تم تحديث الحالة بنجاح!", fr: "Statut mis à jour avec succès !" },

  // Reviews Page
  manageReviews: { en: "Manage Reviews", ar: "إدارة التقييمات", fr: "Gérer les Avis" },
  moderateCustomerReviews: { en: "Moderate customer reviews and ratings", ar: "مراجعة تقييمات وتقييمات العملاء", fr: "Modérer les avis et évaluations des clients" },
  averageRating: { en: "Average Rating", ar: "متوسط التقييم", fr: "Évaluation Moyenne" },
  totalReviews: { en: "Total Reviews", ar: "إجمالي التقييمات", fr: "Total des Avis" },
  rating: { en: "Rating", ar: "التقييم", fr: "Évaluation" },
  stars: { en: "Stars", ar: "نجوم", fr: "Étoiles" },
  reviewDate: { en: "Review Date", ar: "تاريخ التقييم", fr: "Date de l'Avis" },
  reviewComment: { en: "Review Comment", ar: "تعليق التقييم", fr: "Commentaire de l'Avis" },
  approveReview: { en: "Approve Review", ar: "الموافقة على التقييم", fr: "Approuver l'Avis" },
  deleteReview: { en: "Delete Review", ar: "حذف التقييم", fr: "Supprimer l'Avis" },
  reviewApproved: { en: "Review approved!", ar: "تم الموافقة على التقييم!", fr: "Avis approuvé !" },
  reviewDeleted: { en: "Review deleted!", ar: "تم حذف التقييم!", fr: "Avis supprimé !" },
  noReviewsYet: { en: "No reviews yet", ar: "لا توجد تقييمات بعد", fr: "Aucun avis pour le moment" },
  pendingApproval: { en: "Pending Approval", ar: "بانتظار الموافقة", fr: "En Attente d'Approbation" },
  approved: { en: "Approved", ar: "موافق عليه", fr: "Approuvé" },
  rejected: { en: "Rejected", ar: "مرفوض", fr: "Rejeté" },

  // Analytics Page
  analyticsDashboard: { en: "Analytics Dashboard", ar: "لوحة التحليلات", fr: "Tableau de Bord Analytique" },
  salesPerformance: { en: "Sales Performance", ar: "أداء المبيعات", fr: "Performance des Ventes" },
  revenueOverview: { en: "Revenue Overview", ar: "نظرة عامة على الإيرادات", fr: "Aperçu des Revenus" },
  topProducts: { en: "Top Products", ar: "أفضل المنتجات", fr: "Meilleurs Produits" },
  customerInsights: { en: "Customer Insights", ar: "رؤى العملاء", fr: "Aperçus Clients" },
  dailySales: { en: "Daily Sales", ar: "المبيعات اليومية", fr: "Ventes Quotidiennes" },
  weeklySales: { en: "Weekly Sales", ar: "المبيعات الأسبوعية", fr: "Ventes Hebdomadaires" },
  monthlySales: { en: "Monthly Sales", ar: "المبيعات الشهرية", fr: "Ventes Mensuelles" },
  totalRevenue: { en: "Total Revenue", ar: "إجمالي الإيرادات", fr: "Revenu Total" },
  averageOrderValue: { en: "Average Order Value", ar: "متوسط قيمة الطلب", fr: "Valeur Moyenne de Commande" },
  conversionRate: { en: "Conversion Rate", ar: "معدل التحويل", fr: "Taux de Conversion" },
  newCustomers: { en: "New Customers", ar: "عملاء جدد", fr: "Nouveaux Clients" },
  returningCustomers: { en: "Returning Customers", ar: "عملاء عائدين", fr: "Clients Fidèles" },
  popularCakes: { en: "Popular Cakes", ar: "الكيكات الشائعة", fr: "Gâteaux Populaires" },
  salesByCategory: { en: "Sales by Category", ar: "المبيعات حسب الفئة", fr: "Ventes par Catégorie" },
  thisWeek: { en: "This Week", ar: "هذا الأسبوع", fr: "Cette Semaine" },
  thisMonth: { en: "This Month", ar: "هذا الشهر", fr: "Ce Mois" },
  thisYear: { en: "This Year", ar: "هذا العام", fr: "Cette Année" },
  growth: { en: "Growth", ar: "النمو", fr: "Croissance" },

  // Customers Page
  manageCustomers: { en: "Manage Customers", ar: "إدارة العملاء", fr: "Gérer les Clients" },
  customerDatabase: { en: "View and manage customer database", ar: "عرض وإدارة قاعدة بيانات العملاء", fr: "Voir et gérer la base de données clients" },
  customerId: { en: "Customer ID", ar: "رقم العميل", fr: "ID Client" },
  registrationDate: { en: "Registration Date", ar: "تاريخ التسجيل", fr: "Date d'Inscription" },
  totalOrders: { en: "Total Orders", ar: "إجمالي الطلبات", fr: "Total Commandes" },
  customerSince: { en: "Customer Since", ar: "عميل منذ", fr: "Client Depuis" },
  viewProfile: { en: "View Profile", ar: "عرض الملف الشخصي", fr: "Voir le Profil" },
  customerOrders: { en: "Customer Orders", ar: "طلبات العميل", fr: "Commandes du Client" },
  noCustomersFound: { en: "No customers found", ar: "لم يتم العثور على عملاء", fr: "Aucun client trouvé" },
  searchCustomers: { en: "Search customers...", ar: "بحث عن عملاء...", fr: "Rechercher des clients..." },
  activeCustomers: { en: "Active Customers", ar: "عملاء نشطين", fr: "Clients Actifs" },
  vipCustomers: { en: "VIP Customers", ar: "عملاء VIP", fr: "Clients VIP" },

  // Notifications Page
  manageNotifications: { en: "Manage Notifications", ar: "إدارة الإشعارات", fr: "Gérer les Notifications" },
  sendNotifications: { en: "Send notifications to customers", ar: "إرسال إشعارات للعملاء", fr: "Envoyer des notifications aux clients" },
  notificationTitle: { en: "Notification Title", ar: "عنوان الإشعار", fr: "Titre de la Notification" },
  notificationMessage: { en: "Notification Message", ar: "رسالة الإشعار", fr: "Message de la Notification" },
  sendTo: { en: "Send To", ar: "إرسال إلى", fr: "Envoyer À" },
  allCustomers: { en: "All Customers", ar: "كل العملاء", fr: "Tous les Clients" },
  specificCustomers: { en: "Specific Customers", ar: "عملاء محددين", fr: "Clients Spécifiques" },
  notificationType: { en: "Notification Type", ar: "نوع الإشعار", fr: "Type de Notification" },
  promotional: { en: "Promotional", ar: "ترويجي", fr: "Promotionnel" },
  orderUpdate: { en: "Order Update", ar: "تحديث الطلب", fr: "Mise à Jour de la Commande" },
  general: { en: "General", ar: "عام", fr: "Général" },
  sendNotification: { en: "Send Notification", ar: "إرسال الإشعار", fr: "Envoyer la Notification" },
  notificationSent: { en: "Notification sent successfully!", ar: "تم إرسال الإشعار بنجاح!", fr: "Notification envoyée avec succès !" },
  notificationHistory: { en: "Notification History", ar: "سجل الإشعارات", fr: "Historique des Notifications" },
  sentDate: { en: "Sent Date", ar: "تاريخ الإرسال", fr: "Date d'Envoi" },
  recipients: { en: "Recipients", ar: "المستلمين", fr: "Destinataires" },
  noNotificationsYet: { en: "No notifications yet", ar: "لا توجد إشعارات بعد", fr: "Aucune notification pour le moment" },
  createNotification: { en: "Create Notification", ar: "إنشاء إشعار", fr: "Créer une Notification" },

  // Enhanced Dashboard
  todaysOrders: { en: "Today's Orders", ar: "طلبات اليوم", fr: "Commandes du Jour" },
  pendingOrders: { en: "Pending Orders", ar: "الطلبات المعلقة", fr: "Commandes en Attente" },
  completedToday: { en: "Completed Today", ar: "تم إكمالها اليوم", fr: "Terminées Aujourd'hui" },
  revenueToday: { en: "Revenue Today", ar: "إيرادات اليوم", fr: "Revenus du Jour" },
  lowStock: { en: "Low Stock", ar: "مخزون منخفض", fr: "Stock Faible" },
  recentActivity: { en: "Recent Activity", ar: "النشاط الأخير", fr: "Activité Récente" },
  quickStats: { en: "Quick Stats", ar: "إحصائيات سريعة", fr: "Statistiques Rapides" },
  salesChart: { en: "Sales Chart", ar: "رسم المبيعات", fr: "Graphique des Ventes" },
  orderTrends: { en: "Order Trends", ar: "اتجاهات الطلبات", fr: "Tendances des Commandes" },
  weeklySales: { en: "Weekly Sales", ar: "المبيعات الأسبوعية", fr: "Ventes Hebdomadaires" },
  topCustomers: { en: "Top Customers", ar: "أفضل العملاء", fr: "Meilleurs Clients" },
  pendingTasks: { en: "Pending Tasks", ar: "المهام المعلقة", fr: "Tâches en Attente" },
  actions: { en: "Actions", ar: "إجراءات", fr: "Actions" },
  totalSpent: { en: "Total Spent", ar: "إجمالي المنفق", fr: "Total Dépensé" },
  orders: { en: "Orders", ar: "طلبات", fr: "Commandes" },
  lastOrder: { en: "Last Order", ar: "آخر طلب", fr: "Dernière Commande" },
  notes: { en: "Notes", ar: "ملاحظات", fr: "Notes" },
  sendOffer: { en: "Send Offer", ar: "إرسال عرض", fr: "Envoyer Offre" },
  contact: { en: "Contact", ar: "اتصال", fr: "Contact" },
  totalNotifications: { en: "Total Notifications", ar: "إجمالي الإشعارات", fr: "Total Notifications" },
  sent: { en: "Sent", ar: "مرسل", fr: "Envoyé" },
  avgOpenRate: { en: "Avg Open Rate", ar: "متوسط معدل الفتح", fr: "Taux d'Ouverture Moyen" },
  opens: { en: "Opens", ar: "فتحات", fr: "Ouvertures" },
  clicks: { en: "Clicks", ar: "نقرات", fr: "Clics" },
  previewNotification: { en: "Preview Notification", ar: "معاينة الإشعار", fr: "Aperçu de la Notification" },
  deliveryDate: { en: "Delivery Date", ar: "تاريخ التوصيل", fr: "Date de Livraison" },
  reviewDetails: { en: "Review Details", ar: "تفاصيل التقييم", fr: "Détails de l'Avis" },
  reject: { en: "Reject", ar: "رفض", fr: "Rejeter" },
  contactInformation: { en: "Contact Information", ar: "معلومات الاتصال", fr: "Coordonnées" },
  noDataAvailable: { en: "No data available", ar: "لا توجد بيانات متاحة", fr: "Aucune donnée disponible" },
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
