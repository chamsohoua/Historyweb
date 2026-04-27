export const ERA_META = {
  Resistance: { color: '#E11D48', bg: '#FFF1F2', badgeColor: '#BE123C', border: '#FECDD3' },
  Revolution: { color: '#2563EB', bg: '#EFF6FF', badgeColor: '#1D4ED8', border: '#DBEAFE' },
  Medieval:   { color: '#D97706', bg: '#FFFBEB', badgeColor: '#B45309', border: '#FEF3C7' },
};

export const PEOPLE_DATA = [
  { 
    id: 'dey-hussein', 
    era: 'Resistance', 
    icon: '⚔️',
    born: '1765', died: '1838',
    image: '/assets/history-illustration.png',
    audio: '/assets/audio/dey-hussein.mp3',
    name: { en: 'Dey Hussein', ar: 'الداي حسين', fr: 'Dey Hussein' },
    bio: {
      en: "The last Dey of Algiers, he defended the city with dignity during the 1830 invasion. His forced exile marked the beginning of a long resistance.",
      ar: "آخر دايات الجزائر، حكم خلال الغزو الفرنسي عام 1830. دافع عن العاصمة بكرامة قبل نفيه، لتبدأ بعدها حقبة المقاومة الطويلة.",
      fr: "Le dernier Dey d'Alger, il a défendu la ville avec dignité lors de l'invasion de 1830. Son exil a marqué le début d'une longue résistance."
    }
  },
  { 
    id: 'abdelkader', 
    era: 'Resistance', 
    icon: '🏇',
    born: '1808', died: '1883',
    image: '/assets/images/people/abdelkader.jpg',
    audio: '/assets/audio/abdelkader.mp3',
    name: { en: 'Emir Abdelkader', ar: 'الأمير عبد القادر', fr: 'Émir Abdelkader' },
    bio: {
      en: "The founder of the modern Algerian state, he was a scholar and military genius who led the struggle against invasion for 15 years.",
      ar: "مؤسس الدولة الجزائرية الحديثة، كان عالماً وقائداً عسكرياً عبقرياً قاد الكفاح ضد الغزو الفرنسي لمدة 15 عاماً.",
      fr: "Fondateur de l'État algérien moderne, il était un savant et un génie militaire qui a mené la lutte contre l'invasion pendant 15 ans."
    }
  },
  { 
    id: 'ahmed-bey', 
    era: 'Resistance', 
    icon: '🏰',
    born: '1786', died: '1850',
    image: '/assets/images/people/ahmed-bey.jpg',
    audio: '/assets/audio/ahmed-bey.mp3',
    name: { en: 'Ahmed Bey', ar: 'أحمد باي', fr: 'Ahmed Bey' },
    bio: {
      en: "The Bey of Constantine who led a fierce resistance in eastern Algeria, famously defeating French forces during the first siege of 1836.",
      ar: "باي قسنطينة الذي قاد مقاومة شرسة في شرق الجزائر، واشتهر بهزيمة القوات الفرنسية في حصار قسنطينة الأول عام 1836.",
      fr: "Le Bey de Constantine qui a mené une résistance féroce dans l'est de l'Algérie, battant les forces françaises lors du siège de 1836."
    }
  },
  { 
    id: 'messali', 
    era: 'Revolution', 
    icon: '✊',
    born: '1898', died: '1974',
    image: '/assets/images/people/messali.jpg',
    audio: '/assets/audio/messali.mp3',
    name: { en: 'Messali Hadj', ar: 'مصالي الحاج', fr: 'Messali Hadj' },
    bio: {
      en: "The father of Algerian nationalism, he dedicated his life to organizing the political movement for total independence.",
      ar: "أب الحركة الوطنية الجزائرية، كرس حياته لتنظيم الحركة السياسية والمطالبة بالاستقلال التام للجزائر.",
      fr: "Le père du nationalisme algérien, il a consacré sa vie à organiser le mouvement politique pour l'indépendance totale."
    }
  },
  { 
    id: 'ben-badis', 
    era: 'Medieval', 
    icon: '📖',
    born: '1889', died: '1940',
    image: '/assets/images/people/ben-badis.jpg',
    audio: '/assets/audio/ben-badis.mp3',
    name: { en: 'Abdelhamid Ben Badis', ar: 'عبد الحميد بن باديس', fr: 'Abdelhamid Ben Badis' },
    bio: {
      en: "A visionary educator and reformer who preserved the Algerian identity with his association of Muslim Ulema.",
      ar: "رائد النهضة الإصلاحية في الجزائر، حافظ على الهوية الوطنية من خلال جمعية العلماء المسلمين الجزائريين والتعليم.",
      fr: "Éducateur visionnaire et réformateur qui a préservé l'identité algérienne grâce à son association des Oulémas musulmans."
    }
  },
  { 
    id: 'ben-boulaïd', 
    era: 'Revolution', 
    icon: '💥',
    born: '1917', died: '1956',
    image: '/assets/images/people/ben-boulaïd.jpg',
    audio: '/assets/audio/ben-boulaïd.mp3',
    name: { en: 'Mostefa Ben Boulaïd', ar: 'مصطفى بن بولعيد', fr: 'Mostefa Ben Boulaïd' },
    bio: {
      en: "Known as the Father of the Revolution, he was the first commander of Wilaya I and a key architect of the November 1st uprising.",
      ar: "يُلقب بـ 'أب الثورة'، كان أول قائد للمنطقة الأولى (الأوراس) وأحد المهندسين الأساسيين لاندلاع ثورة أول نوفمبر.",
      fr: "Surnommé le Père de la Révolution, il fut le premier chef de la Wilaya I et l'un des architectes du 1er novembre."
    }
  },
  { 
    id: 'boudiaf', 
    era: 'Revolution', 
    icon: '🌟',
    born: '1919', died: '1992',
    image: '/assets/images/people/Gemini_Generated_Image_g7vzxgg7vzxgg7vz.jpg',
    audio: '/assets/audio/boudiaf.mp3',
    name: { en: 'Mohamed Boudiaf', ar: 'محمد بوضياف', fr: 'Mohamed Boudiaf' },
    bio: {
      en: "A historic leader and founder of the FLN who returned from exile in 1992 to lead the nation during a critical transition.",
      ar: "قائد تاريخي وأحد مؤسسي جبهة التحرير الوطني، عاد من المنفى عام 1992 ليرأس البلاد في مرحلة انتقالية حرجة.",
      fr: "Chef historique et fondateur du FLN, il est revenu d'exil en 1992 pour diriger la nation lors d'une transition critique."
    }
  }
];