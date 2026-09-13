import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Star,
  Sparkles,
  Flame,
  Utensils,
  Coffee,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  MapPin,
  Clock,
  Heart
} from "lucide-react";

export interface MenuItem {
  id: string;
  name: { fr: string; en: string; ar: string };
  category: "entrees" | "tajines" | "grillades" | "pizzas" | "desserts" | "boissons";
  price: number;
  image: string;
  description: { fr: string; en: string; ar: string };
  prepTime?: string;
  badges?: string[];
  allergens?: string[];
  isSignature?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  // ── CHAPITRE I : ENTRÉES ──
  {
    id: "e1",
    name: {
      fr: "Pastilla Royale au Pigeon & Amandes",
      en: "Royal Pigeon Pastilla with Toasted Almonds",
      ar: "بسطيلة ملكية بالحمام واللوز المحمص"
    },
    category: "entrees",
    price: 120,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Pâte filo croustillante dorée au four, effiloché de pigeon mijoté aux épices nobles de Fès, cannelle de Ceylan, amandes torréfiées et sucre glace.",
      en: "Crispy filo pastry stuffed with shredded pigeon slow-cooked with Fes spices, Ceylon cinnamon, toasted almonds, and icing sugar.",
      ar: "ورقة بسطيلة مقرمشة، لحم الحمام المتبل بأجود التوابل الفاسية، قرفة سيلان، ولوز محمص بالسكر الصقيل."
    },
    prepTime: "15 min",
    badges: ["Signature Chef", "Coup de Cœur"],
    allergens: ["Gluten", "Fruits à coque", "Œufs"],
    isSignature: true
  },
  {
    id: "e2",
    name: {
      fr: "Assortiment de Briouates Artisanales (6 pcs)",
      en: "Handcrafted Briouates Platter (6 pcs)",
      ar: "تشكيلة بريوات تقليدية (6 قطع)"
    },
    category: "entrees",
    price: 75,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Trio croustillant : 2 au chèvre frais & miel de thym de l'Atlas, 2 aux crevettes royales persillées, 2 au bœuf haché épicé.",
      en: "Crispy trio: 2 fresh goat cheese & Atlas thyme honey, 2 royal garlic prawns, 2 spiced minced beef.",
      ar: "ثلاثي مقرمش: 2 بجبن الماعز وعسل الزعتر، 2 بالقيمرون الملكي، 2 بالكفتة المتبلة."
    },
    prepTime: "10 min",
    allergens: ["Gluten", "Lactose", "Crustacés"]
  },
  {
    id: "e3",
    name: {
      fr: "Tartare de Saumon Sauvage à l'Avocat & Yuzu",
      en: "Wild Salmon Tartare with Avocado & Yuzu",
      ar: "تارتار السلمون البري مع الأفوكادو واليوزو"
    },
    category: "entrees",
    price: 115,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Saumon atlantique coupé au couteau, brunoise d'avocat Hass de Taroudant, vinaigrette aux agrumes de l'Ourika et perles de citron caviar.",
      en: "Hand-cut Atlantic salmon, Taroudant avocado brunoise, Ourika citrus dressing and finger lime pearls.",
      ar: "سلمون أطلسي طازج مقطع يدوياً مع أفوكادو تارودانت وتتبيلة حمضيات أوريكا المنعشة."
    },
    prepTime: "12 min",
    badges: ["Ultra Frais"],
    allergens: ["Poisson", "Sésame"]
  },
  {
    id: "e4",
    name: {
      fr: "Salade Marocaine Royale & Zaâlouk Fumé",
      en: "Royal Moroccan Salad Trio & Smoked Zaalouk",
      ar: "سلطة مغربية ملكية مع زعلوك مدخن"
    },
    category: "entrees",
    price: 65,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Dégustation traditionnelle : Zaâlouk d'aubergines rôties au feu de bois, Méchouia de poivrons doux et Taktouka parfumée à l'huile d'argane vierge.",
      en: "Traditional tasting: Wood-fire smoked eggplant Zaalouk, sweet red pepper Mechouia, and Taktouka with virgin argan oil.",
      ar: "تشكيلة تقليدية أصيلة: زعلوك باذنجان مشوي، مشوية فلفل حلو، وتكتوكة بزيت أركان البكر."
    },
    prepTime: "8 min",
    badges: ["Végétarien", "Bio"],
    isVegetarian: true
  },

  // ── CHAPITRE II : TAJINES & SIGNATURES ──
  {
    id: "t1",
    name: {
      fr: "Tajine d'Agneau aux Pruneaux & Amandes Torréfiées",
      en: "Slow-Cooked Lamb Shank Tajine with Prunes & Almonds",
      ar: "طاجين لحم الغنم بالبرقوق المعسل واللوز المحمص"
    },
    category: "tajines",
    price: 165,
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Souris d'agneau fondante cuite 4h à l'étouffée dans un tajine de terre cuite, pruneaux au miel de lavande, graines de sésame doré et réduction au safran de Taliouine.",
      en: "Melt-in-your-mouth lamb shank braised 4 hours in clay pot, prunes infused with lavender honey, golden sesame and Taliouine saffron.",
      ar: "موزة لحم الغنم الطرية مطهوة على نار هادئة 4 ساعات، برقوق معسل بزهور اللافندر، سمسم وزعفران تاليوين الأصيل."
    },
    prepTime: "20 min",
    badges: ["Signature Chef", "Best-Seller"],
    allergens: ["Fruits à coque", "Sésame"],
    isSignature: true
  },
  {
    id: "t2",
    name: {
      fr: "Tanjia Marrakchia Cuite au Four à Cendres",
      en: "Traditional Marrakech Tanjia in Clay Jar",
      ar: "طنجية مراكشية أصيلة في الفرن التقليدي"
    },
    category: "tajines",
    price: 175,
    image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Le plat emblématique de la Médina de Marrakech. Jarret de bœuf mijoté 6 heures sous les cendres avec cumin beldi, citron confit, ail et beurre rance smen.",
      en: "The iconic Medina masterpiece. Beef shank simmered 6 hours in hot ashes with beldi cumin, preserved lemon, garlic and smen butter.",
      ar: "تحفة مراكش الخالدة. لحم عجل مطهو 6 ساعات في الرماد مع الكمون البلدي، الحامض المصير، الثوم والسمن الحار."
    },
    prepTime: "15 min",
    badges: ["Héritage Marrakech"],
    allergens: ["Lactose"],
    isSignature: true
  },
  {
    id: "t3",
    name: {
      fr: "Couscous Royal aux Sept Légumes Bio",
      en: "Royal Couscous with Seven Organic Garden Vegetables",
      ar: "كسكس ملكي بسبع خضار ولحم الضأن والدجاج البلدي"
    },
    category: "tajines",
    price: 155,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Semoule roulée à la main à la vapeur d'arômes, trio d'agneau, poulet fermier et merguez artisanales, bouillon safrané et compotée de raisins caramélisés (Tfaya).",
      en: "Hand-steamed fine semolina, tender lamb, farm chicken, artisan merguez sausages, saffron broth and sweet caramelized raisin Tfaya.",
      ar: "سميد رقيق مبخر على البخار التقليدي، تشكيلة لحم الضأن والدجاج البلدي والمفروم، مرق الزعفران وتفاية البصل والزبيب."
    },
    prepTime: "18 min",
    badges: ["Terroir Maroc"],
    allergens: ["Gluten"]
  },
  {
    id: "t4",
    name: {
      fr: "Tajine de Daurade Royale & Chermoula Parfumée",
      en: "Royal Sea Bream Tajine with Fresh Chermoula",
      ar: "طاجين الدنيس الملكي بالشرمولة والخضار الطازجة"
    },
    category: "tajines",
    price: 160,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Pavé de daurade fraîche mariné à la chermoula parfumée à la coriandre fraîche, poivrons rouges rôtis, rondelles de pommes de terre fondantes et olives violettes.",
      en: "Fresh sea bream marinated in cilantro-garlic chermoula, roasted red peppers, tender potato rounds and violet olives.",
      ar: "سمك دنيس طازج متبل بالشرمولة المغربية الغنية بالكزبرة والثوم وزيت الزيتون، مع فلفل وبطاطس وزيتون بلدي."
    },
    prepTime: "18 min",
    badges: ["Pêche Côtière", "Épicé Doux"],
    allergens: ["Poisson"],
    isSpicy: true
  },

  // ── CHAPITRE III : GRILLADES & POISSONS ──
  {
    id: "g1",
    name: {
      fr: "Filet de Bœuf Rossini & Purée de Pommes de Terre Truffée",
      en: "Beef Tenderloin Rossini & Truffled Potato Puree",
      ar: "فيليه لحم البقر روسيني مع بيوريه البطاطس بالكمأة"
    },
    category: "grillades",
    price: 220,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Pavé de filet de bœuf d'exception (220g), escalope de foie gras poêlée, jus corsé à la truffe noire de l'Atlas et écrasé de rattes au beurre doux.",
      en: "Prime beef tenderloin (220g), pan-seared duck foie gras, Atlas black truffle jus and velvety potato puree.",
      ar: "قطعة فيليه بقر فاخرة (220 غرام)، كبد الأوز المشوي، صوص الكمأة السوداء وبيوريه بطاطس زبدية ناعمة."
    },
    prepTime: "20 min",
    badges: ["Gastronomique", "Signature"],
    allergens: ["Lactose"],
    isSignature: true
  },
  {
    id: "g2",
    name: {
      fr: "Côte de Bœuf Maturée Black Angus (800g à partager)",
      en: "Dry-Aged Black Angus Ribeye (800g to share)",
      ar: "شريحة لحم بلاك أنجوس المعتقة (800 غرام للمشاركة)"
    },
    category: "grillades",
    price: 430,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Maturée 35 jours dans notre cave à viande, grillée au feu de bois d'olivier. Servie avec fleur de sel d'Ifrane, légumes rôtis et duo de sauces maison.",
      en: "Aged 35 days in-house, seared over olive wood embers. Served with Ifrane sea salt, roasted veggies and two signature sauces.",
      ar: "معتقة لمدة 35 يوماً، مشوية على خشب الزيتون الطبيعي، تقدم مع ملح إفران وخضار مشوية."
    },
    prepTime: "25 min",
    badges: ["Pour 2 personnes"]
  },
  {
    id: "g3",
    name: {
      fr: "Loup de Mer Rôti Entier aux Herbes Sauvages de l'Atlas",
      en: "Whole Roasted Sea Bass with Atlas Wild Herbs",
      ar: "سمك ذئب البحر مشوي كاملاً بالأعشاب الطبيعية"
    },
    category: "grillades",
    price: 195,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Loup de mer côtier sauvage (env. 600g), rôti entier au four à bois avec tomates cerises confites, câpres, citron confit et huile d'olive vierge bio.",
      en: "Wild Atlantic sea bass (approx 600g), roasted in wood-fired oven with confit cherry tomatoes, capers, preserved lemon and extra-virgin olive oil.",
      ar: "سمك طازج (600 غرام)، مشوي في فرن الحطب مع طماطم كرزية، كبار، ليمون مصير وزيت زيتون بكر."
    },
    prepTime: "22 min",
    badges: ["Arrivage Quotidien"],
    allergens: ["Poisson"]
  },

  // ── CHAPITRE IV : PÂTES & PIZZAS ──
  {
    id: "p1",
    name: {
      fr: "Tagliatelles Fraîches aux Gambas Royales & Pesto Pistache",
      en: "Fresh Tagliatelle with Royal Prawns & Pistachio Pesto",
      ar: "تاغلياتيل طازجة مع الروبيان الملكي وبيستو الفستق"
    },
    category: "pizzas",
    price: 145,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Pâtes faites maison à la minute, gambas flambées au zeste d'orange amère, pesto artisanal de pistaches grillées et copeaux de parmesan AOP 24 mois.",
      en: "House-made fresh pasta, prawns flambéed with bitter orange zest, toasted pistachio pesto and 24-month aged Parmigiano Reggiano.",
      ar: "معكرونة طازجة محضرة يومياً، روبيان ملكي متبل، بيستو الفستق المحمص، وجبن بارميزان معتق."
    },
    prepTime: "14 min",
    badges: ["Pâtes Fraîches Maison"],
    allergens: ["Gluten", "Crustacés", "Lactose"]
  },
  {
    id: "p2",
    name: {
      fr: "Pizza Napolitaine Truffe Noire & Burrata di Puglia",
      en: "Neapolitan Black Truffle & Puglia Burrata Pizza",
      ar: "بيتزا نابوليتان بالكمأة السوداء وبوراتا إيطالية"
    },
    category: "pizzas",
    price: 135,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Pâte fermentée 48 heures, crème de truffe d'été, mozzarella fior di latte, cœur de burrata crémeuse posée à la sortie du four, roquette fraîche et huile de truffe.",
      en: "48-hour slow fermented dough, summer truffle cream, fior di latte mozzarella, fresh burrata added after baking, arugula and truffle drizzle.",
      ar: "عجينة مخمرة 48 ساعة، كريمة الكمأة، جبن بوراتا الطازج الكريمي، جرجير وزيت الكمأة العطري."
    },
    prepTime: "12 min",
    badges: ["Four à Bois", "Végétarien"],
    allergens: ["Gluten", "Lactose"],
    isVegetarian: true
  },

  // ── CHAPITRE V : DESSERTS ──
  {
    id: "d1",
    name: {
      fr: "Pastilla Croustillante au Lait d'Amande & Fleur d'Oranger",
      en: "Crispy Almond Milk Pastilla with Orange Blossom",
      ar: "بسطيلة الحليب المقرمشة بماء زهر الليمون"
    },
    category: "desserts",
    price: 65,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Feuilles croustillantes superposées, crème diplomate infusée à la fleur d'oranger distillée à Marrakech, éclats d'amandes torréfiées et filet de miel d'oranger.",
      en: "Layered crispy wafer sheets, silky orange blossom diplomat cream, crushed toasted almonds, and pure orange honey drizzle.",
      ar: "طبقات مقرمشة ذهبية، كريمة ناعمة بماء الزهر المراكشي، رقائق لوز محمص وخيط من عسل البرتقال."
    },
    prepTime: "8 min",
    badges: ["Dessert Signature", "Culte"],
    allergens: ["Gluten", "Lactose", "Fruits à coque"],
    isSignature: true
  },
  {
    id: "d2",
    name: {
      fr: "Moelleux Chocolat Guanaja 70% & Cœur Coulant Amlou",
      en: "70% Dark Chocolate Lava Cake with Melting Amlou Center",
      ar: "كيك الشوكولاتة الذائبة مع قلب أمْلو المغربي"
    },
    category: "desserts",
    price: 70,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Chocolat noir grand cru 70%, cœur fondant à l'Amlou traditionnel (amandes grillées, argane bio et miel), servi tiède avec glace artisanale vanille Bourbon.",
      en: "Grand cru 70% dark chocolate cake with warm molten Moroccan Amlou (almonds, argan oil, honey), paired with Bourbon vanilla bean gelato.",
      ar: "كيك شوكولاتة داكنة ساخنة محشوة بقلب أملو أصيل (لوز وأركان وعسل)، تقدم مع آيس كريم فانيليا."
    },
    prepTime: "10 min",
    badges: ["Chocolat Grand Cru"],
    allergens: ["Gluten", "Lactose", "Fruits à coque", "Œufs"]
  },

  // ── CHAPITRE VI : BOISSONS & THÉS ──
  {
    id: "b1",
    name: {
      fr: "Mojito Signature de l'Ourika (Mocktail Frais)",
      en: "Ourika Valley Signature Mojito (Fresh Mocktail)",
      ar: "موهيتو أوريكا المنعش بالنعناع والرمان"
    },
    category: "boissons",
    price: 48,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Menthe fraîche de l'Atlas pillée au pilon, jus de grenade fraîchement pressée, citron vert bio, sucre de canne et eau pétillante gazeuse glacée.",
      en: "Fresh Atlas mint muddled with freshly pressed pomegranate juice, organic lime, raw cane sugar and chilled sparkling soda.",
      ar: "نعناع الأطلس الطازج، عصير رمان طبيعي معصور، ليمون أخضر، سكر القصب وماء فوار مثلج."
    },
    prepTime: "5 min",
    badges: ["Mocktail Frais", "Sans Alcool"],
    isVegetarian: true
  },
  {
    id: "b2",
    name: {
      fr: "Cérémonie du Thé à la Menthe & Pâtisseries Fines",
      en: "Royal Mint Tea Ceremony & Moroccan Fine Pastries",
      ar: "مراسم الشاي المغربي الأصيل مع حلويات ملكية"
    },
    category: "boissons",
    price: 45,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    description: {
      fr: "Thé vert Gunpowder infusé à la menthe fraîche Nanah et absinthe chiba, servi dans la théière argentée traditionnelle avec duo de cornes de gazelle et ghoriba.",
      en: "Gunpowder green tea infused with fresh Nanah mint, poured ceremoniously from an authentic silver teapot, with fine gazelle horns pastries.",
      ar: "شاي مغربي أصيل بالنعناع والشيبة، يقدم في البراد الفضي التقليدي مع كعب الغزال والغريبة."
    },
    prepTime: "5 min",
    badges: ["Tradition Marocaine"],
    allergens: ["Fruits à coque"]
  }
];

const CHAPTERS = [
  {
    id: "entrees",
    number: "I",
    title: { fr: "Les Entrées & Tapas", en: "Starters & Tapas", ar: "المقبلات والشهيوات" },
    subtitle: { fr: "Saveurs fraîches & bouchées croustillantes", en: "Fresh flavours & crisp bites", ar: "نكهات طازجة ومقرمشة" },
    icon: Sparkles
  },
  {
    id: "tajines",
    number: "II",
    title: { fr: "Les Tajines & Signatures", en: "Tajines & Mains", ar: "الطواجن وأطباق الشيف" },
    subtitle: { fr: "Mijotés à l'étouffée dans la terre cuite", en: "Slow-cooked in clay pottery", ar: "مطهوة ببطء في الفخار التقليدي" },
    icon: Flame
  },
  {
    id: "grillades",
    number: "III",
    title: { fr: "Les Grillades & Poissons", en: "Grills & Seafood", ar: "المشاوي والأسماك" },
    subtitle: { fr: "Cuissons au feu de bois d'olivier", en: "Seared over olive wood embers", ar: "مشوية على خشب الزيتون" },
    icon: Utensils
  },
  {
    id: "pizzas",
    number: "IV",
    title: { fr: "Pâtes Fraîches & Pizzas", en: "Fresh Pasta & Pizzas", ar: "المعكرونة والبيتزا" },
    subtitle: { fr: "Artisanales & cuites au four à bois", en: "Artisanal wood-fired dough", ar: "عجينة تقليدية في فرن الحطب" },
    icon: Utensils
  },
  {
    id: "desserts",
    number: "V",
    title: { fr: "Les Desserts Gourmands", en: "Fine Desserts", ar: "الحلويات الملكية" },
    subtitle: { fr: "Douceurs sucrées & parfums de fleur d'oranger", en: "Sweet notes & orange blossom", ar: "حلويات بماء الزهر والعسل" },
    icon: Sparkles
  },
  {
    id: "boissons",
    number: "VI",
    title: { fr: "Boissons Fraîches & Thés", en: "Drinks & Fine Teas", ar: "المشروبات والشاي" },
    subtitle: { fr: "Mocktails signature & cérémonies du thé", en: "Signature mocktails & mint teas", ar: "موهيتو منعش وشاي مغربي" },
    icon: Coffee
  }
];

export const RestaurantMenuDemo: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<string>("entrees");
  const [language, setLanguage] = useState<"fr" | "en" | "ar">("fr");
  const [selectedPhoto, setSelectedPhoto] = useState<MenuItem | null>(null);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Active chapter details
  const currentChapter = CHAPTERS.find((c) => c.id === activeChapter) || CHAPTERS[0];
  const chapterDishes = MENU_ITEMS.filter((item) => item.category === activeChapter);

  const handleRateClick = () => {
    setRateModalOpen(true);
  };

  const handleConfirmRating = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {}
    setHasRated(true);
    setTimeout(() => {
      // Direct link to Google Reviews
      window.open("https://maps.google.com", "_blank");
      setRateModalOpen(false);
      setHasRated(false);
    }, 1400);
  };

  return (
    <div
      className={`min-h-screen bg-[#0d1117] text-[#f0f6fc] font-serif selection:bg-amber-500/30 selection:text-amber-200 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* ── BACKGROUND AMBIANCE ── */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-3xl" />
      </div>

      {/* ── MINIMAL TOP BAR (DISCREET LANGUAGE SELECTOR) ── */}
      <header className="relative z-20 border-b border-amber-950/40 bg-[#0d1117]/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500/80" />
            <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-amber-400/80 uppercase">
              La Carte Gastronomique
            </span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-black/40 border border-amber-500/20 rounded-full p-0.5 text-[11px] font-sans font-bold">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === "fr" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === "en" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === "ar" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              عربي
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN MENU BOOK WRAPPER ── */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-36">

        {/* ── BOOK COVER & RESTAURANT TITLE ── */}
        <div className="text-center space-y-4 py-6 border-b border-amber-900/30">
          
          {/* Subtle gold crest */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-500/40 p-1 flex items-center justify-center shadow-lg shadow-amber-950/40"
          >
            <Utensils className="w-7 h-7 text-amber-400" />
          </motion.div>

          <div className="space-y-1">
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-amber-100 tracking-wide font-serif"
            >
              LE JARDIN SECRET
            </motion.h1>
            <p className="text-xs font-sans tracking-[0.25em] text-amber-400/90 uppercase font-semibold">
              Restaurant & Lounge • Marrakech
            </p>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-md mx-auto italic leading-relaxed">
            {language === "fr" && "Cuisine marocaine d'exception, mijotée aux épices fines et aux produits nobles de notre terroir."}
            {language === "en" && "Refined Moroccan gastronomy cooked with rare spices and the finest local ingredients."}
            {language === "ar" && "أرقى فنون الطهي المغربي الأصيل بمكونات طبيعية وتوابل فاخرة."}
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px] font-sans text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> Guéliz, Marrakech
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> 4.9 (520+ avis)
            </span>
          </div>

        </div>

        {/* ── BOOK CHAPTERS / CATEGORIES NAVIGATION ── */}
        <div className="py-6 sticky top-0 z-30 bg-[#0d1117]/95 backdrop-blur-md border-b border-amber-900/30">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1">
            {CHAPTERS.map((chap) => {
              const active = activeChapter === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapter(chap.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all relative flex-shrink-0 ${
                    active
                      ? "text-slate-950 font-extrabold shadow-md"
                      : "text-slate-300 hover:text-amber-200 bg-slate-900/80 border border-slate-800"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeBookTab"
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 rounded-xl -z-10 shadow-lg shadow-amber-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`text-[10px] font-serif ${active ? "text-amber-950 font-black" : "text-amber-400"}`}>
                    {chap.number}.
                  </span>
                  <span>{chap.title[language]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CHAPTER CONTENT (BOOK PAGE STYLE) ── */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter + language}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              
              {/* Chapter Header */}
              <div className="text-center space-y-1.5 pb-4 border-b border-amber-500/20">
                <span className="text-[11px] font-sans font-bold tracking-[0.3em] text-amber-500 uppercase">
                  — CHAPITRE {currentChapter.number} —
                </span>
                <h2 className="text-2xl font-bold text-amber-100 font-serif">
                  {currentChapter.title[language]}
                </h2>
                <p className="text-xs text-slate-400 font-sans italic">
                  {currentChapter.subtitle[language]}
                </p>
              </div>

              {/* Dish Items (Classic Book Menu Layout) */}
              <div className="space-y-6">
                {chapterDishes.map((dish, i) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group border-b border-slate-800/80 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Dish Thumbnail (Tap to view) */}
                      <div
                        onClick={() => setSelectedPhoto(dish)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/30 flex-shrink-0 cursor-pointer shadow-md group-hover:border-amber-400 transition-colors"
                      >
                        <img
                          src={dish.image}
                          alt={dish.name[language]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {dish.isSignature && (
                          <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-sans font-black text-[8px] px-1 py-0.5 rounded shadow">
                            ★
                          </div>
                        )}
                      </div>

                      {/* Dish Information */}
                      <div className="flex-1 min-w-0">
                        
                        {/* Title & Price Line */}
                        <div className="flex items-baseline justify-between gap-2">
                          <h3
                            onClick={() => setSelectedPhoto(dish)}
                            className="text-base sm:text-lg font-bold text-amber-100 font-serif group-hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            {dish.name[language]}
                          </h3>

                          {/* Price */}
                          <div className="flex items-baseline gap-1 text-amber-400 font-sans font-black text-base whitespace-nowrap ml-2">
                            <span>{dish.price}</span>
                            <span className="text-[10px] text-amber-400/70 font-bold">DH</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mt-1">
                          {dish.description[language]}
                        </p>

                        {/* Badges / Allergens */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 font-sans text-[10px]">
                          {dish.prepTime && (
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-amber-400" />
                              {dish.prepTime}
                            </span>
                          )}
                          {dish.isVegetarian && (
                            <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                              Végétarien
                            </span>
                          )}
                          {dish.isSpicy && (
                            <span className="text-rose-400 bg-rose-950/40 border border-rose-800/40 px-1.5 py-0.5 rounded">
                              Épicé
                            </span>
                          )}
                          {dish.badges?.map((b) => (
                            <span
                              key={b}
                              className="text-amber-400/90 bg-amber-950/30 border border-amber-800/30 px-1.5 py-0.5 rounded italic"
                            >
                              {b}
                            </span>
                          ))}
                        </div>

                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CHAPTER SWITCHER BUTTONS (PAGE TURNING) ── */}
        <div className="flex items-center justify-between pt-8 border-t border-amber-900/30 text-xs font-sans">
          {(() => {
            const currentIdx = CHAPTERS.findIndex((c) => c.id === activeChapter);
            const prev = CHAPTERS[currentIdx - 1];
            const next = CHAPTERS[currentIdx + 1];

            return (
              <>
                {prev ? (
                  <button
                    onClick={() => setActiveChapter(prev.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{prev.title[language]}</span>
                  </button>
                ) : <div />}

                {next && (
                  <button
                    onClick={() => setActiveChapter(next.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-amber-400 font-bold hover:text-amber-300 transition-colors ml-auto"
                  >
                    <span>{next.title[language]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </>
            );
          })()}
        </div>

      </main>

      {/* ── ONLY ACTION BUTTON : RATE THE RESTAURANT ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/95 to-transparent pt-6 pb-5 px-4">
        <div className="max-w-md mx-auto">
          <motion.button
            onClick={handleRateClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-sans font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-amber-500/30 border border-amber-300"
          >
            <div className="flex items-center gap-0.5 text-slate-950">
              <Star className="w-4 h-4 fill-slate-950" />
              <Star className="w-4 h-4 fill-slate-950" />
              <Star className="w-4 h-4 fill-slate-950" />
              <Star className="w-4 h-4 fill-slate-950" />
              <Star className="w-4 h-4 fill-slate-950" />
            </div>
            <span>
              {language === "fr" && "Donner votre avis sur Google (5★)"}
              {language === "en" && "Rate us 5★ on Google Maps"}
              {language === "ar" && "تقييم المطعم بـ 5 نجوم على جوجل"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* ── PHOTO LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64">
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.name[language]}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {selectedPhoto.isSignature && (
                    <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 font-sans font-black text-xs px-2 py-0.5 rounded shadow">
                      PLAT SIGNATURE
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-lg font-bold text-amber-100 font-serif">
                      {selectedPhoto.name[language]}
                    </h4>
                    <span className="text-amber-400 font-sans font-black text-lg">
                      {selectedPhoto.price} DH
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {selectedPhoto.description[language]}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── RATE RESTAURANT MODAL ── */}
      <AnimatePresence>
        {rateModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRateModalOpen(false)}
            >
              <motion.div
                className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Star className="w-7 h-7 fill-amber-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-serif">
                    {language === "fr" && "Votre avis compte pour nous"}
                    {language === "en" && "Your experience matters"}
                    {language === "ar" && "رأيكم يهمنا ويسعدنا"}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {language === "fr" && "Partagez votre note 5 étoiles sur Google Maps pour soutenir notre équipe et notre cuisine."}
                    {language === "en" && "Share your 5-star review on Google Maps to support our kitchen and team."}
                    {language === "ar" && "شارك تقييمك 5 نجوم على خرائط جوجل لدعم طاقمنا ومطبخنا."}
                  </p>
                </div>

                {/* 5 Stars display */}
                <div className="flex items-center justify-center gap-1 py-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 animate-pulse" />
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <motion.button
                    onClick={handleConfirmRating}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-sans font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {language === "fr" && "Ouvrir Google Maps & Noter (5★)"}
                      {language === "en" && "Open Google Maps & Rate 5★"}
                      {language === "ar" && "فتح خرائط جوجل وتقييم 5 نجوم"}
                    </span>
                  </motion.button>

                  <button
                    onClick={() => setRateModalOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-400 font-sans"
                  >
                    {language === "fr" && "Retour au menu"}
                    {language === "en" && "Back to menu"}
                    {language === "ar" && "العودة للقائمة"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RestaurantMenuDemo;
