document.addEventListener('DOMContentLoaded', () => {
    initPeriodicTable();
});

function initPeriodicTable() {
    renderPeriodicTable();
    initTableEventListeners();
    loadStudiedElements();
    updateStudiedCount();
}

// Полные данные ВСЕХ элементов (1-118)
const elements = [
    // Период 1
    { number: 1, symbol: "H", name: "Водород", mass: "1.008", category: "nonmetal", group: 1, period: 1 },
    { number: 2, symbol: "He", name: "Гелий", mass: "4.003", category: "noble", group: 18, period: 1 },
    
    // Период 2
    { number: 3, symbol: "Li", name: "Литий", mass: "6.941", category: "metal", group: 1, period: 2 },
    { number: 4, symbol: "Be", name: "Бериллий", mass: "9.012", category: "metal", group: 2, period: 2 },
    { number: 5, symbol: "B", name: "Бор", mass: "10.81", category: "metalloid", group: 13, period: 2 },
    { number: 6, symbol: "C", name: "Углерод", mass: "12.01", category: "nonmetal", group: 14, period: 2 },
    { number: 7, symbol: "N", name: "Азот", mass: "14.01", category: "nonmetal", group: 15, period: 2 },
    { number: 8, symbol: "O", name: "Кислород", mass: "16.00", category: "nonmetal", group: 16, period: 2 },
    { number: 9, symbol: "F", name: "Фтор", mass: "19.00", category: "nonmetal", group: 17, period: 2 },
    { number: 10, symbol: "Ne", name: "Неон", mass: "20.18", category: "noble", group: 18, period: 2 },
    
    // Период 3
    { number: 11, symbol: "Na", name: "Натрий", mass: "22.99", category: "metal", group: 1, period: 3 },
    { number: 12, symbol: "Mg", name: "Магний", mass: "24.31", category: "metal", group: 2, period: 3 },
    { number: 13, symbol: "Al", name: "Алюминий", mass: "26.98", category: "metal", group: 13, period: 3 },
    { number: 14, symbol: "Si", name: "Кремний", mass: "28.09", category: "metalloid", group: 14, period: 3 },
    { number: 15, symbol: "P", name: "Фосфор", mass: "30.97", category: "nonmetal", group: 15, period: 3 },
    { number: 16, symbol: "S", name: "Сера", mass: "32.07", category: "nonmetal", group: 16, period: 3 },
    { number: 17, symbol: "Cl", name: "Хлор", mass: "35.45", category: "nonmetal", group: 17, period: 3 },
    { number: 18, symbol: "Ar", name: "Аргон", mass: "39.95", category: "noble", group: 18, period: 3 },
    
    // Период 4
    { number: 19, symbol: "K", name: "Калий", mass: "39.10", category: "metal", group: 1, period: 4 },
    { number: 20, symbol: "Ca", name: "Кальций", mass: "40.08", category: "metal", group: 2, period: 4 },
    { number: 21, symbol: "Sc", name: "Скандий", mass: "44.96", category: "metal", group: 3, period: 4 },
    { number: 22, symbol: "Ti", name: "Титан", mass: "47.87", category: "metal", group: 4, period: 4 },
    { number: 23, symbol: "V", name: "Ванадий", mass: "50.94", category: "metal", group: 5, period: 4 },
    { number: 24, symbol: "Cr", name: "Хром", mass: "52.00", category: "metal", group: 6, period: 4 },
    { number: 25, symbol: "Mn", name: "Марганец", mass: "54.94", category: "metal", group: 7, period: 4 },
    { number: 26, symbol: "Fe", name: "Железо", mass: "55.85", category: "metal", group: 8, period: 4 },
    { number: 27, symbol: "Co", name: "Кобальт", mass: "58.93", category: "metal", group: 9, period: 4 },
    { number: 28, symbol: "Ni", name: "Никель", mass: "58.69", category: "metal", group: 10, period: 4 },
    { number: 29, symbol: "Cu", name: "Медь", mass: "63.55", category: "metal", group: 11, period: 4 },
    { number: 30, symbol: "Zn", name: "Цинк", mass: "65.38", category: "metal", group: 12, period: 4 },
    { number: 31, symbol: "Ga", name: "Галлий", mass: "69.72", category: "metal", group: 13, period: 4 },
    { number: 32, symbol: "Ge", name: "Германий", mass: "72.64", category: "metalloid", group: 14, period: 4 },
    { number: 33, symbol: "As", name: "Мышьяк", mass: "74.92", category: "metalloid", group: 15, period: 4 },
    { number: 34, symbol: "Se", name: "Селен", mass: "78.96", category: "nonmetal", group: 16, period: 4 },
    { number: 35, symbol: "Br", name: "Бром", mass: "79.90", category: "nonmetal", group: 17, period: 4 },
    { number: 36, symbol: "Kr", name: "Криптон", mass: "83.80", category: "noble", group: 18, period: 4 },
    
    // Период 5
    { number: 37, symbol: "Rb", name: "Рубидий", mass: "85.47", category: "metal", group: 1, period: 5 },
    { number: 38, symbol: "Sr", name: "Стронций", mass: "87.62", category: "metal", group: 2, period: 5 },
    { number: 39, symbol: "Y", name: "Иттрий", mass: "88.91", category: "metal", group: 3, period: 5 },
    { number: 40, symbol: "Zr", name: "Цирконий", mass: "91.22", category: "metal", group: 4, period: 5 },
    { number: 41, symbol: "Nb", name: "Ниобий", mass: "92.91", category: "metal", group: 5, period: 5 },
    { number: 42, symbol: "Mo", name: "Молибден", mass: "95.94", category: "metal", group: 6, period: 5 },
    { number: 43, symbol: "Tc", name: "Технеций", mass: "(98)", category: "metal", group: 7, period: 5 },
    { number: 44, symbol: "Ru", name: "Рутений", mass: "101.1", category: "metal", group: 8, period: 5 },
    { number: 45, symbol: "Rh", name: "Родий", mass: "102.9", category: "metal", group: 9, period: 5 },
    { number: 46, symbol: "Pd", name: "Палладий", mass: "106.4", category: "metal", group: 10, period: 5 },
    { number: 47, symbol: "Ag", name: "Серебро", mass: "107.9", category: "metal", group: 11, period: 5 },
    { number: 48, symbol: "Cd", name: "Кадмий", mass: "112.4", category: "metal", group: 12, period: 5 },
    { number: 49, symbol: "In", name: "Индий", mass: "114.8", category: "metal", group: 13, period: 5 },
    { number: 50, symbol: "Sn", name: "Олово", mass: "118.7", category: "metal", group: 14, period: 5 },
    { number: 51, symbol: "Sb", name: "Сурьма", mass: "121.8", category: "metalloid", group: 15, period: 5 },
    { number: 52, symbol: "Te", name: "Теллур", mass: "127.6", category: "metalloid", group: 16, period: 5 },
    { number: 53, symbol: "I", name: "Йод", mass: "126.9", category: "nonmetal", group: 17, period: 5 },
    { number: 54, symbol: "Xe", name: "Ксенон", mass: "131.3", category: "noble", group: 18, period: 5 },
    
    // Период 6
    { number: 55, symbol: "Cs", name: "Цезий", mass: "132.9", category: "metal", group: 1, period: 6 },
    { number: 56, symbol: "Ba", name: "Барий", mass: "137.3", category: "metal", group: 2, period: 6 },
    // Лантаноиды
    { number: 57, symbol: "La", name: "Лантан", mass: "138.9", category: "metal", group: 3, period: 6 },
    { number: 58, symbol: "Ce", name: "Церий", mass: "140.1", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 59, symbol: "Pr", name: "Празеодим", mass: "140.9", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 60, symbol: "Nd", name: "Неодим", mass: "144.2", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 61, symbol: "Pm", name: "Прометий", mass: "(145)", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 62, symbol: "Sm", name: "Самарий", mass: "150.4", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 63, symbol: "Eu", name: "Европий", mass: "152.0", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 64, symbol: "Gd", name: "Гадолиний", mass: "157.3", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 65, symbol: "Tb", name: "Тербий", mass: "158.9", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 66, symbol: "Dy", name: "Диспрозий", mass: "162.5", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 67, symbol: "Ho", name: "Гольмий", mass: "164.9", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 68, symbol: "Er", name: "Эрбий", mass: "167.3", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 69, symbol: "Tm", name: "Тулий", mass: "168.9", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 70, symbol: "Yb", name: "Иттербий", mass: "173.0", category: "metal", group: 0, period: 6, lanthanide: true },
    { number: 71, symbol: "Lu", name: "Лютеций", mass: "175.0", category: "metal", group: 3, period: 6 },
    
    // Продолжение периода 6
    { number: 72, symbol: "Hf", name: "Гафний", mass: "178.5", category: "metal", group: 4, period: 6 },
    { number: 73, symbol: "Ta", name: "Тантал", mass: "180.9", category: "metal", group: 5, period: 6 },
    { number: 74, symbol: "W", name: "Вольфрам", mass: "183.8", category: "metal", group: 6, period: 6 },
    { number: 75, symbol: "Re", name: "Рений", mass: "186.2", category: "metal", group: 7, period: 6 },
    { number: 76, symbol: "Os", name: "Осмий", mass: "190.2", category: "metal", group: 8, period: 6 },
    { number: 77, symbol: "Ir", name: "Иридий", mass: "192.2", category: "metal", group: 9, period: 6 },
    { number: 78, symbol: "Pt", name: "Платина", mass: "195.1", category: "metal", group: 10, period: 6 },
    { number: 79, symbol: "Au", name: "Золото", mass: "197.0", category: "metal", group: 11, period: 6 },
    { number: 80, symbol: "Hg", name: "Ртуть", mass: "200.6", category: "metal", group: 12, period: 6 },
    { number: 81, symbol: "Tl", name: "Таллий", mass: "204.4", category: "metal", group: 13, period: 6 },
    { number: 82, symbol: "Pb", name: "Свинец", mass: "207.2", category: "metal", group: 14, period: 6 },
    { number: 83, symbol: "Bi", name: "Висмут", mass: "209.0", category: "metal", group: 15, period: 6 },
    { number: 84, symbol: "Po", name: "Полоний", mass: "(209)", category: "metalloid", group: 16, period: 6 },
    { number: 85, symbol: "At", name: "Астат", mass: "(210)", category: "metalloid", group: 17, period: 6 },
    { number: 86, symbol: "Rn", name: "Радон", mass: "(222)", category: "noble", group: 18, period: 6 },
    
    // Период 7
    { number: 87, symbol: "Fr", name: "Франций", mass: "(223)", category: "metal", group: 1, period: 7 },
    { number: 88, symbol: "Ra", name: "Радий", mass: "(226)", category: "metal", group: 2, period: 7 },
    // Актиноиды
    { number: 89, symbol: "Ac", name: "Актиний", mass: "(227)", category: "metal", group: 3, period: 7 },
    { number: 90, symbol: "Th", name: "Торий", mass: "232.0", category: "metal", group: 0, period: 7, actinide: true },
    { number: 91, symbol: "Pa", name: "Протактиний", mass: "231.0", category: "metal", group: 0, period: 7, actinide: true },
    { number: 92, symbol: "U", name: "Уран", mass: "238.0", category: "metal", group: 0, period: 7, actinide: true },
    { number: 93, symbol: "Np", name: "Нептуний", mass: "(237)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 94, symbol: "Pu", name: "Плутоний", mass: "(244)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 95, symbol: "Am", name: "Америций", mass: "(243)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 96, symbol: "Cm", name: "Кюрий", mass: "(247)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 97, symbol: "Bk", name: "Берклий", mass: "(247)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 98, symbol: "Cf", name: "Калифорний", mass: "(251)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 99, symbol: "Es", name: "Эйнштейний", mass: "(252)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 100, symbol: "Fm", name: "Фермий", mass: "(257)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 101, symbol: "Md", name: "Менделевий", mass: "(258)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 102, symbol: "No", name: "Нобелий", mass: "(259)", category: "metal", group: 0, period: 7, actinide: true },
    { number: 103, symbol: "Lr", name: "Лоуренсий", mass: "(262)", category: "metal", group: 3, period: 7 },
    
    // Продолжение периода 7
    { number: 104, symbol: "Rf", name: "Резерфордий", mass: "(267)", category: "metal", group: 4, period: 7 },
    { number: 105, symbol: "Db", name: "Дубний", mass: "(268)", category: "metal", group: 5, period: 7 },
    { number: 106, symbol: "Sg", name: "Сиборгий", mass: "(269)", category: "metal", group: 6, period: 7 },
    { number: 107, symbol: "Bh", name: "Борий", mass: "(270)", category: "metal", group: 7, period: 7 },
    { number: 108, symbol: "Hs", name: "Хассий", mass: "(269)", category: "metal", group: 8, period: 7 },
    { number: 109, symbol: "Mt", name: "Мейтнерий", mass: "(278)", category: "metal", group: 9, period: 7 },
    { number: 110, symbol: "Ds", name: "Дармштадтий", mass: "(281)", category: "metal", group: 10, period: 7 },
    { number: 111, symbol: "Rg", name: "Рентгений", mass: "(282)", category: "metal", group: 11, period: 7 },
    { number: 112, symbol: "Cn", name: "Коперниций", mass: "(285)", category: "metal", group: 12, period: 7 },
    { number: 113, symbol: "Nh", name: "Нихоний", mass: "(286)", category: "metal", group: 13, period: 7 },
    { number: 114, symbol: "Fl", name: "Флеровий", mass: "(289)", category: "metal", group: 14, period: 7 },
    { number: 115, symbol: "Mc", name: "Московий", mass: "(290)", category: "metal", group: 15, period: 7 },
    { number: 116, symbol: "Lv", name: "Ливерморий", mass: "(293)", category: "metal", group: 16, period: 7 },
    { number: 117, symbol: "Ts", name: "Теннессин", mass: "(294)", category: "metalloid", group: 17, period: 7 },
    { number: 118, symbol: "Og", name: "Оганессон", mass: "(294)", category: "noble", group: 18, period: 7 }
];

// Подробная информация об элементах (расширенная)
const elementDetails = {
    "H": {
        description: "Самый легкий и распространенный элемент во Вселенной",
        facts: [
            "Составляет 75% массы Вселенной",
            "Горит голубым пламенем",
            "Используется в топливных элементах"
        ],
        uses: ["Производство аммиака", "Гидрогенизация жиров", "Ракетное топливо"],
        discovery: "1766 год, Генри Кавендиш",
        state: "Газ",
        density: "0.0899 г/л"
    },
    "He": {
        description: "Второй по легкости и распространенности элемент",
        facts: [
            "Не образует химических соединений",
            "Имеет самую низкую температуру кипения",
            "Используется для охлаждения"
        ],
        uses: ["Дирижабли", "Криогеника", "Сварка"],
        discovery: "1868 год, Пьер Жансен",
        state: "Газ",
        density: "0.1785 г/л"
    },
    "Li": {
        description: "Самый легкий металл",
        facts: [
            "Плавает в воде",
            "Используется в батареях",
            "Придает пламени красный цвет"
        ],
        uses: ["Аккумуляторы", "Керамика", "Медицина"],
        discovery: "1817 год, Йохан Арфведсон",
        state: "Твердый",
        density: "0.534 г/см³"
    },
    "Be": {
        description: "Легкий и прочный металл",
        facts: [
            "Прозрачен для рентгеновских лучей",
            "Токсичен при вдыхании",
            "Используется в сплавах"
        ],
        uses: ["Спутники", "Ядерные реакторы", "Спортивное оборудование"],
        discovery: "1798 год, Николя Воклен",
        state: "Твердый",
        density: "1.85 г/см³"
    },
    "B": {
        description: "Важный элемент для растений и промышленности",
        facts: [
            "Образует очень твердые соединения",
            "Необходим для роста растений",
            "Используется в жаропрочных материалах"
        ],
        uses: ["Борное стекло", "Удобрения", "Полупроводники"],
        discovery: "1808 год, Луи Гей-Люссак",
        state: "Твердый",
        density: "2.34 г/см³"
    },
    "C": {
        description: "Основной элемент органической химии",
        facts: [
            "Образует больше соединений, чем все другие элементы вместе",
            "Существует в разных формах: алмаз, графит, графен",
            "Основа всей жизни на Земле"
        ],
        uses: ["Сталь", "Пластмассы", "Аккумуляторы"],
        discovery: "Древность",
        state: "Твердый",
        density: "2.26 г/см³ (графит)"
    },
    "N": {
        description: "Основной компонент атмосферы Земли",
        facts: [
            "Составляет 78% воздуха",
            "Не поддерживает горение",
            "Важен для роста растений"
        ],
        uses: ["Удобрения", "Азотная кислота", "Консервация"],
        discovery: "1772 год, Даниэль Резерфорд",
        state: "Газ",
        density: "1.251 г/л"
    },
    "O": {
        description: "Жизненно важный элемент для дыхания и горения",
        facts: [
            "Составляет 21% атмосферы Земли",
            "Самое распространенное вещество в земной коре",
            "Озон (O₃) защищает от ультрафиолета"
        ],
        uses: ["Медицина", "Металлургия", "Водоочистка"],
        discovery: "1774 год, Джозеф Пристли",
        state: "Газ",
        density: "1.429 г/л"
    },
    "F": {
        description: "Самый электроотрицательный элемент",
        facts: [
            "Самый реакционноспособный элемент",
            "Предотвращает кариес",
            "Встречается в зубной пасте"
        ],
        uses: ["Тефлон", "Фреоны", "Зубная паста"],
        discovery: "1886 год, Анри Муассан",
        state: "Газ",
        density: "1.696 г/л"
    },
    "Ne": {
        description: "Инертный газ, используемый в освещении",
        facts: [
            "Дает красно-оранжевое свечение",
            "Не образует соединений",
            "Используется в лазерах"
        ],
        uses: ["Неоновые лампы", "Лазеры", "Холодильники"],
        discovery: "1898 год, Уильям Рамзай",
        state: "Газ",
        density: "0.9002 г/л"
    },
    "Na": {
        description: "Мягкий серебристо-белый щелочной металл",
        facts: [
            "Бурно реагирует с водой",
            "Важен для нервной системы",
            "Сохраняет жидкое состояние в широком диапазоне температур"
        ],
        uses: ["Уличное освещение", "Охлаждающая жидкость", "Производство мыла"],
        discovery: "1807 год, Хэмфри Дэви",
        state: "Твердый",
        density: "0.968 г/см³"
    },
    "Mg": {
        description: "Легкий и прочный металл",
        facts: [
            "Горит ярким белым пламенем",
            "Важен для фотосинтеза",
            "Используется в сплавах"
        ],
        uses: ["Автомобильные детали", "Фейерверки", "Медицина"],
        discovery: "1755 год, Джозеф Блэк",
        state: "Твердый",
        density: "1.738 г/см³"
    },
    "Al": {
        description: "Легкий и прочный металл с широким применением",
        facts: [
            "Самый распространенный металл в земной коре",
            "Не магнитится",
            "Легко поддается обработке"
        ],
        uses: ["Авиация", "Упаковка", "Строительство"],
        discovery: "1825 год, Ханс Эрстед",
        state: "Твердый",
        density: "2.70 г/см³"
    },
    "Si": {
        description: "Второй по распространенности элемент в земной коре",
        facts: [
            "Основа современной электроники",
            "Составляет 28% земной коры",
            "Используется в солнечных батареях"
        ],
        uses: ["Полупроводники", "Стекло", "Солнечные панели"],
        discovery: "1824 год, Йёнс Берцелиус",
        state: "Твердый",
        density: "2.33 г/см³"
    },
    "P": {
        description: "Элемент, важный для жизни и промышленности",
        facts: [
            "Существует в нескольких аллотропных формах",
            "Светится в темноте (белый фосфор)",
            "Важен для ДНК и АТФ"
        ],
        uses: ["Удобрения", "Спички", "Моющие средства"],
        discovery: "1669 год, Хенниг Бранд",
        state: "Твердый",
        density: "1.82 г/см³ (белый)"
    },
    "S": {
        description: "Желтый неметалл с характерным запахом",
        facts: [
            "Имеет запах тухлых яиц (сероводород)",
            "Используется в производстве кислот",
            "Важен для белков"
        ],
        uses: ["Серная кислота", "Спички", "Вулканизация"],
        discovery: "Древность",
        state: "Твердый",
        density: "2.07 г/см³"
    },
    "Cl": {
        description: "Желто-зеленый ядовитый газ",
        facts: [
            "Используется для дезинфекции воды",
            "Образует поваренную соль с натрием",
            "Применялся как химическое оружие"
        ],
        uses: ["Дезинфекция", "Пластмассы", "Растворители"],
        discovery: "1774 год, Карл Вильгельм Шееле",
        state: "Газ",
        density: "3.214 г/л"
    },
    "Ar": {
        description: "Инертный газ, третий по распространенности в атмосфере",
        facts: [
            "Составляет 0.93% воздуха",
            "Используется для защиты от окисления",
            "Не образует соединений"
        ],
        uses: ["Сварка", "Лампы накаливания", "Хроматография"],
        discovery: "1894 год, Уильям Рамзай",
        state: "Газ",
        density: "1.784 г/л"
    }
};

// Функция для получения информации об элементе (с запасными данными)
function getElementDetails(symbol) {
    return elementDetails[symbol] || {
        description: "Этот элемент имеет важное значение в химии и различных отраслях промышленности.",
        facts: [
            "Изучается в школьной программе",
            "Имеет уникальные химические свойства",
            "Встречается в природе или производится искусственно"
        ],
        uses: ["Промышленное применение", "Научные исследования", "Технологии"],
        discovery: "Известен ученым",
        state: "Зависит от условий",
        density: "Различная"
    };
}

function renderPeriodicTable(filterCategory = 'all') {
    const container = document.getElementById('periodicTable');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Создаем основной контейнер для таблицы
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    
    const mainTable = document.createElement('div');
    mainTable.className = 'main-table';
    
    const lanthanidesTable = document.createElement('div');
    lanthanidesTable.className = 'lanthanides-table';
    lanthanidesTable.innerHTML = '<h4>Лантаноиды</h4>';
    
    const actinidesTable = document.createElement('div');
    actinidesTable.className = 'actinides-table';
    actinidesTable.innerHTML = '<h4>Актиноиды</h4>';
    
    // Создаем основную таблицу (7 периодов × 18 групп)
    for (let period = 1; period <= 7; period++) {
        for (let group = 1; group <= 18; group++) {
            const cell = document.createElement('div');
            cell.className = 'table-cell';
            
            // Находим элемент для этой ячейки
            const element = elements.find(e => 
                e.period === period && 
                e.group === group &&
                !e.lanthanide && 
                !e.actinide
            );
            
            if (element && (filterCategory === 'all' || element.category === filterCategory)) {
                cell.innerHTML = createElementHTML(element);
            } else if (!element && period <= 7 && group <= 18) {
                // Пустая ячейка
                cell.innerHTML = '<div class="element empty"></div>';
            }
            
            mainTable.appendChild(cell);
        }
    }
    
    // Добавляем лантаноиды
    const lanthanides = elements.filter(e => e.lanthanide);
    for (let i = 57; i <= 71; i++) {
        const element = lanthanides.find(e => e.number === i);
        const cell = document.createElement('div');
        cell.className = 'table-cell';
        
        if (element && (filterCategory === 'all' || element.category === filterCategory)) {
            cell.innerHTML = createElementHTML(element);
        } else {
            cell.innerHTML = '<div class="element empty"></div>';
        }
        
        lanthanidesTable.appendChild(cell);
    }
    
    // Добавляем актиноиды
    const actinides = elements.filter(e => e.actinide);
    for (let i = 89; i <= 103; i++) {
        const element = actinides.find(e => e.number === i);
        const cell = document.createElement('div');
        cell.className = 'table-cell';
        
        if (element && (filterCategory === 'all' || element.category === filterCategory)) {
            cell.innerHTML = createElementHTML(element);
        } else {
            cell.innerHTML = '<div class="element empty"></div>';
        }
        
        actinidesTable.appendChild(cell);
    }
    
    tableWrapper.appendChild(mainTable);
    tableWrapper.appendChild(lanthanidesTable);
    tableWrapper.appendChild(actinidesTable);
    container.appendChild(tableWrapper);
    
    // Добавляем обработчики для элементов
    addElementEventListeners();
    
    // Добавляем пояснения для мобильных устройств
    if (window.innerWidth <= 768) {
        addMobileInstructions();
    }
}

function createElementHTML(element) {
    const studiedElements = JSON.parse(localStorage.getItem('studiedElements') || '[]');
    const isStudied = studiedElements.includes(element.symbol);
    
    return `
        <div class="element ${element.category} ${isStudied ? 'studied' : ''}" 
             data-symbol="${element.symbol}"
             data-number="${element.number}"
             title="${element.name} (${element.symbol}) - ${element.mass}">
            <div class="element-number">${element.number}</div>
            <div class="element-symbol">${element.symbol}</div>
            <div class="element-name">${element.name}</div>
            ${isStudied ? '<div class="studied-badge"><i class="fas fa-check"></i></div>' : ''}
        </div>
    `;
}

function addMobileInstructions() {
    const container = document.getElementById('periodicTable');
    if (!container) return;
    
    const instructions = document.createElement('div');
    instructions.className = 'mobile-instructions';
    instructions.innerHTML = `
        <p><i class="fas fa-hand-pointer"></i> Нажмите на элемент для подробной информации</p>
        <p><i class="fas fa-expand-alt"></i> Прокручивайте таблицу для просмотра всех элементов</p>
        <p><i class="fas fa-filter"></i> Используйте фильтры для поиска нужных элементов</p>
    `;
    
    container.parentNode.insertBefore(instructions, container.nextSibling);
}

function initTableEventListeners() {
    // Фильтры категорий
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            renderPeriodicTable(category);
        });
    });
    
    // Поиск
    const searchInput = document.getElementById('elementSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                // Показываем все элементы
                document.querySelectorAll('.element').forEach(el => {
                    el.parentElement.style.display = 'block';
                    el.classList.remove('highlight');
                });
                return;
            }
            
            document.querySelectorAll('.element').forEach(el => {
                const symbol = el.dataset.symbol ? el.dataset.symbol.toLowerCase() : '';
                const name = el.querySelector('.element-name') ? 
                           el.querySelector('.element-name').textContent.toLowerCase() : '';
                const number = el.dataset.number || '';
                
                if (symbol.includes(query) || name.includes(query) || number.includes(query)) {
                    el.parentElement.style.display = 'block';
                    el.classList.add('highlight');
                    
                    // Анимация
                    el.style.animation = 'pulse 0.5s';
                    setTimeout(() => {
                        el.style.animation = '';
                    }, 500);
                } else {
                    el.parentElement.style.display = 'none';
                    el.classList.remove('highlight');
                }
            });
        });
    }
}

function addElementEventListeners() {
    document.querySelectorAll('.element:not(.empty)').forEach(element => {
        element.addEventListener('click', () => {
            const symbol = element.dataset.symbol;
            showElementDetails(symbol);
            
            // Отслеживание изученных элементов для достижения
            trackElementStudy(symbol);
        });
        
        // Эффект при наведении
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.zIndex = '100';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.zIndex = '1';
        });
        
        // Для мобильных устройств - touch эффект
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
    });
}

function showElementDetails(symbol) {
    const element = elements.find(e => e.symbol === symbol);
    if (!element) return;
    
    const details = getElementDetails(symbol);
    const container = document.getElementById('elementDetails');
    if (!container) return;
    
    // Анимация перехода
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = `
            <div class="details-header">
                <div class="element-title">
                    <h3>${element.name} (${element.symbol})</h3>
                    <span class="element-mass">${element.mass} а.е.м.</span>
                </div>
                <div class="element-badge ${element.category}">
                    ${getCategoryName(element.category)}
                </div>
            </div>
            
            <div class="details-content">
                <div class="element-summary">
                    <p class="element-description">${details.description}</p>
                    
                    <div class="basic-info">
                        <div class="info-item">
                            <span class="info-label">Атомный номер:</span>
                            <span class="info-value">${element.number}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Период:</span>
                            <span class="info-value">${element.period}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Группа:</span>
                            <span class="info-value">${element.group || '-'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Агрегатное состояние:</span>
                            <span class="info-value">${details.state}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Плотность:</span>
                            <span class="info-value">${details.density}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Открытие:</span>
                            <span class="info-value">${details.discovery}</span>
                        </div>
                    </div>
                </div>
                
                <div class="element-sections">
                    <div class="section">
                        <h4><i class="fas fa-lightbulb"></i> Интересные факты</h4>
                        <ul>
                            ${details.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h4><i class="fas fa-industry"></i> Применение</h4>
                        <ul>
                            ${details.uses.map(use => `<li>${use}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="study-progress">
                    <button class="btn study-btn" onclick="markAsStudied('${symbol}')">
                        <i class="fas fa-check"></i> Отметить как изученный
                    </button>
                    <div class="progress-text">
                        Изучено элементов: <span id="studiedCount">0</span>/118
                    </div>
                </div>
            </div>
        `;
        
        container.style.opacity = '1';
        
        // Обновляем счетчик изученных элементов
        updateStudiedCount();
        
    }, 300);
}

function getCategoryName(category) {
    const names = {
        metal: "Металл",
        nonmetal: "Неметалл",
        noble: "Благородный газ",
        metalloid: "Полуметалл"
    };
    return names[category] || category;
}

let studiedElements = new Set();

function loadStudiedElements() {
    const saved = localStorage.getItem('studiedElements');
    if (saved) {
        studiedElements = new Set(JSON.parse(saved));
    }
}

function trackElementStudy(symbol) {
    if (!studiedElements.has(symbol)) {
        studiedElements.add(symbol);
        localStorage.setItem('studiedElements', JSON.stringify([...studiedElements]));
        
        // Обновляем отображение
        updateStudiedCount();
        
        // Проверка достижения
        if (studiedElements.size >= 5 && typeof window.unlockAchievement === 'function') {
            window.unlockAchievement('elements_5');
        }
        
        // Проверка дополнительных достижений
        if (studiedElements.size >= 20) {
            window.unlockAchievement('elements_20');
        }
        if (studiedElements.size >= 50) {
            window.unlockAchievement('elements_50');
        }
        if (studiedElements.size >= 100) {
            window.unlockAchievement('elements_100');
        }
    }
}

function markAsStudied(symbol) {
    trackElementStudy(symbol);
    
    // Показываем уведомление
    const element = elements.find(e => e.symbol === symbol);
    if (element) {
        showNotification(`${element.name} отмечен как изученный!`, 'success');
    }
    
    // Подсвечиваем элемент в таблице
    document.querySelectorAll('.element').forEach(el => {
        if (el.dataset.symbol === symbol) {
            el.classList.add('studied');
            if (!el.querySelector('.studied-badge')) {
                el.innerHTML = createElementHTML(element);
            }
        }
    });
}

function updateStudiedCount() {
    const countElement = document.getElementById('studiedCount');
    if (countElement) {
        countElement.textContent = studiedElements.size;
    }
    
    // Подсвечиваем изученные элементы в таблице
    document.querySelectorAll('.element').forEach(el => {
        const symbol = el.dataset.symbol;
        if (symbol && studiedElements.has(symbol)) {
            const element = elements.find(e => e.symbol === symbol);
            if (element) {
                el.classList.add('studied');
                if (!el.querySelector('.studied-badge')) {
                    el.innerHTML = createElementHTML(element);
                }
            }
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем CSS стили для адаптивной таблицы
const tableStyles = document.createElement('style');
tableStyles.textContent = `
    /* Основные стили таблицы */
    .periodic-table {
        margin: 2rem 0;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 10px;
        background: var(--secondary);
        border-radius: var(--round);
    }
    
    .table-wrapper {
        min-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .main-table {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 3px;
        background: white;
        padding: 10px;
        border-radius: 10px;
    }
    
    .lanthanides-table,
    .actinides-table {
        display: grid;
        grid-template-columns: repeat(15, 1fr);
        gap: 3px;
        background: white;
        padding: 15px;
        border-radius: 10px;
        margin-top: 10px;
    }
    
    .lanthanides-table h4,
    .actinides-table h4 {
        grid-column: 1 / -1;
        text-align: center;
        margin-bottom: 10px;
        color: var(--dark);
        font-size: 1.1rem;
    }
    
    .table-cell {
        aspect-ratio: 1;
        min-width: 40px;
    }
    
    .element {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 3px;
        position: relative;
        border: 2px solid transparent;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-size: 0.7rem;
    }
    
    .element.empty {
        background: transparent;
        box-shadow: none;
        cursor: default;
        border: 2px dashed #eee;
    }
    
    .element:hover:not(.empty) {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-color: var(--accent);
        z-index: 10;
    }
    
    .element.highlight {
        animation: highlight 0.5s ease;
        border-color: var(--accent2);
        box-shadow: 0 0 10px var(--accent2);
    }
    
    .element.studied {
        border-color: #4CAF50;
        background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
    }
    
    .studied-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #4CAF50;
        color: white;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.6rem;
    }
    
    .element-number {
        font-size: 0.6rem;
        position: absolute;
        top: 2px;
        left: 3px;
        color: #666;
        font-weight: bold;
    }
    
    .element-symbol {
        font-size: 1rem;
        font-weight: bold;
        color: var(--dark);
        margin-top: 8px;
    }
    
    .element-name {
        font-size: 0.5rem;
        margin-top: 2px;
        color: #666;
        text-align: center;
        line-height: 1.1;
        padding: 0 1px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .element.metal { background: linear-gradient(135deg, #ffcccb 0%, #ffb3b3 100%); }
    .element.nonmetal { background: linear-gradient(135deg, #c9e4ff 0%, #a8d0ff 100%); }
    .element.noble { background: linear-gradient(135deg, #d0f0c0 0%, #b8e0a8 100%); }
    .element.metalloid { background: linear-gradient(135deg, #fffacd 0%, #fff0a8 100%); }
    
    /* Инструкции для мобильных */
    .mobile-instructions {
        background: var(--primary);
        padding: 1rem;
        border-radius: var(--round);
        margin-top: 1rem;
        display: none;
    }
    
    .mobile-instructions p {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0.5rem 0;
        color: var(--dark);
        font-size: 0.9rem;
    }
    
    .mobile-instructions i {
        color: var(--accent2);
    }
    
    /* Детали элемента */
    .details-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--primary);
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .element-title {
        flex-grow: 1;
    }
    
    .element-title h3 {
        margin: 0 0 0.5rem 0;
        color: var(--dark);
        font-size: 1.6rem;
    }
    
    .element-mass {
        font-size: 1rem;
        color: var(--accent2);
        font-weight: 600;
    }
    
    .element-badge {
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
        white-space: nowrap;
    }
    
    .element-badge.metal { background: #ff6b6b; }
    .element-badge.nonmetal { background: #4ecdc4; }
    .element-badge.noble { background: #2ecc71; }
    .element-badge.metalloid { background: #ffd166; }
    
    .details-content {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .basic-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.8rem;
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--secondary);
        border-radius: 10px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 0;
        border-bottom: 1px dashed #ddd;
    }
    
    .info-label {
        color: #666;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .info-value {
        font-weight: 600;
        color: var(--dark);
        font-size: 1rem;
        text-align: right;
    }
    
    .element-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .section h4 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--accent2);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--primary);
        font-size: 1.1rem;
    }
    
    .section ul {
        padding-left: 1.2rem;
        color: #666;
        font-size: 0.9rem;
    }
    
    .section li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }
    
    .study-progress {
        margin-top: 2rem;
        padding: 1.2rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        border-radius: var(--round);
        text-align: center;
    }
    
    .study-btn {
        margin-bottom: 1rem;
        font-size: 0.9rem;
        padding: 0.7rem 1.5rem;
    }
    
    .progress-text {
        font-size: 1rem;
        color: var(--dark);
        font-weight: 600;
    }
    
    #studiedCount {
        color: var(--accent2);
        font-size: 1.2rem;
        font-weight: 800;
    }
    
    /* Анимации */
    @keyframes highlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    /* Адаптивность */
    @media (max-width: 1200px) {
        .main-table {
            grid-template-columns: repeat(18, 1fr);
            font-size: 0.6rem;
        }
        
        .element-symbol {
            font-size: 0.9rem;
        }
        
        .element-name {
            font-size: 0.45rem;
        }
    }
    
    @media (max-width: 992px) {
        .periodic-table {
            padding: 5px;
        }
        
        .main-table {
            gap: 2px;
        }
        
        .table-cell {
            min-width: 35px;
        }
        
        .element-symbol {
            font-size: 0.8rem;
        }
        
        .element-name {
            display: none;
        }
        
        .basic-info {
            grid-template-columns: 1fr;
        }
        
        .element-sections {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 768px) {
        .periodic-table {
            min-width: 100%;
            overflow-x: scroll;
        }
        
        .table-wrapper {
            min-width: 700px;
        }
        
        .mobile-instructions {
            display: block;
        }
        
        .main-table {
            grid-template-columns: repeat(18, 1fr);
            font-size: 0.55rem;
        }
        
        .table-cell {
            min-width: 30px;
        }
        
        .element {
            padding: 2px;
        }
        
        .element-symbol {
            font-size: 0.7rem;
            margin-top: 5px;
        }
        
        .element-number {
            font-size: 0.5rem;
            top: 1px;
            left: 2px;
        }
        
        .studied-badge {
            width: 12px;
            height: 12px;
            font-size: 0.5rem;
            top: -3px;
            right: -3px;
        }
        
        .lanthanides-table,
        .actinides-table {
            grid-template-columns: repeat(15, 1fr);
            gap: 2px;
            padding: 10px;
        }
        
        .details-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .element-title h3 {
            font-size: 1.4rem;
        }
        
        .element-badge {
            align-self: flex-start;
        }
    }
    
    @media (max-width: 576px) {
        .table-wrapper {
            min-width: 650px;
        }
        
        .main-table {
            grid-template-columns: repeat(18, 1fr);
        }
        
        .table-cell {
            min-width: 28px;
        }
        
        .element-symbol {
            font-size: 0.65rem;
        }
        
        .element-number {
            font-size: 0.45rem;
        }
        
        .lanthanides-table h4,
        .actinides-table h4 {
            font-size: 0.9rem;
        }
        
        .study-btn {
            width: 100%;
            font-size: 0.8rem;
        }
    }
    
    @media (max-width: 480px) {
        .table-wrapper {
            min-width: 600px;
        }
        
        .table-cell {
            min-width: 25px;
        }
        
        .element-symbol {
            font-size: 0.6rem;
        }
        
        .element-number {
            font-size: 0.4rem;
        }
        
        .studied-badge {
            width: 10px;
            height: 10px;
            font-size: 0.4rem;
        }
        
        .mobile-instructions p {
            font-size: 0.8rem;
        }
    }
    
    /* Прокрутка для очень маленьких экранов */
    @media (max-width: 360px) {
        .periodic-table {
            margin-left: -10px;
            margin-right: -10px;
            border-radius: 0;
        }
        
        .table-wrapper {
            min-width: 550px;
        }
        
        .table-cell {
            min-width: 22px;
        }
    }
`;
document.head.appendChild(tableStyles);

// Инициализация при загрузке
loadStudiedElements();
updateStudiedCount();

// Экспортируем функцию для использования в кнопке
window.markAsStudied = markAsStudied;
