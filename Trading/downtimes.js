// @ts-check

const downtimes = {
        'Doing a job': {
                id: 0,
        },
        'Crime': {
                id: 1,
        },
        'Training to gain xp': {
                id: 2,
        },
};

const events = {
        JOB_BAD: "You were unable to complete the job, losing spent gold without getting paid.",
        JOB_OK: "You managed to recoup your losses for a net 0 workday.",
        JOB_GOOD: "You do a pretty decent job. Your costumers are happy with your work.",
        JOB_GREAT: "Your work is outstanding. People pay extra to get *your* services, specifically.",

        CRIME_BAD: "You got caught and have to pay up for your misdeads. Your sentence is a ",
        CRIME_OK: "You managed to escape the guards, but couldn't take the loot with you.",
        CRIME_GOOD: "You managed to get away with some valuable stuff.",
        CRIME_GREAT: "You pulled off a remarkable heist!",

        TRAINING_BAD_BOTH: "Due to a serious misfortune, you damage your weapon *and* hurt yourself.",
        TRAINING_BAD1: "You damaged your weapon, and it will need repairs.",
        TRAINING_BAD2: "You had an accident and wounded yourself.",
        TRAINING_GOOD: "You've had a good training session, feeling exhausted but well prepared for future battles.",
        TRAINING_GREAT: "People watching you train will think of you as a master in your art. You'll need a long rest after this one...",
};

const downtimeTables = {
        'Doing a job': {
                table: [
                        [events.JOB_BAD, events.JOB_BAD, events.JOB_OK, events.JOB_GOOD, events.JOB_GOOD, events.JOB_GOOD, events.JOB_GOOD, events.JOB_GREAT, events.JOB_GREAT, events.JOB_GREAT],
                        ["-10gp", "-5gp", "0gp", "+20gp", "+22gp", "+27gp", "+36gp", "+51gp", "+77gp", "+124gp"],
                        ["-10gp", "-5gp", "0gp", "+30gp", "+33gp", "+40gp", "+52gp", "+73gp", "+110gp", "+176gp"],
                        ["-20gp", "-10gp", "0gp", "+40gp", "+44gp", "+53gp", "+69gp", "+97gp", "+146gp", "+234gp"],
                        ["-20gp", "-10gp", "0gp", "+50gp", "+55gp", "+66gp", "+86gp", "+121gp", "+182gp", "+292gp"],
                        ["-30gp", "-15gp", "0gp", "+60gp", "+66gp", "+80gp", "+104gp", "+146gp", "+219gp", "+351gp"],
                        ["-30gp", "-15gp", "0gp", "+70gp", "+77gp", "+93gp", "+121gp", "+170gp", "+255gp", "+408gp"],
                        ["-40gp", "-20gp", "0gp", "+80gp", "+88gp", "+106gp", "+138gp", "+194gp", "+291gp", "+466gp"],
                        ["-40gp", "-20gp", "0gp", "+90gp", "+99gp", "+119gp", "+155gp", "+217gp", "+326gp", "+522gp"],
                        ["-50gp", "-25gp", "0gp", "+100gp", "+110gp", "+132gp", "+172gp", "+241gp", "+362gp", "+580gp"],
                        ["-50gp", "-25gp", "0gp", "+110gp", "+121gp", "+146gp", "+190gp", "+266gp", "+399gp", "+639gp"],
                        ["-60gp", "-30gp", "0gp", "+120gp", "+132gp", "+159gp", "+207gp", "+290gp", "+435gp", "+696gp"],
                        ["-60gp", "-30gp", "0gp", "+130gp", "+143gp", "+172gp", "+224gp", "+314gp", "+471gp", "+754gp"],
                        ["-70gp", "-35gp", "0gp", "+140gp", "+154gp", "+185gp", "+241gp", "+338gp", "+507gp", "+812gp"],
                        ["-70gp", "-35gp", "0gp", "+150gp", "+165gp", "+198gp", "+258gp", "+362gp", "+543gp", "+869gp"],
                        ["-80gp", "-40gp", "0gp", "+160gp", "+176gp", "+212gp", "+276gp", "+387gp", "+581gp", "+930gp"],
                        ["-80gp", "-40gp", "0gp", "+170gp", "+187gp", "+225gp", "+293gp", "+411gp", "+617gp", "+988gp"],
                        ["-90gp", "-45gp", "0gp", "+180gp", "+198gp", "+238gp", "+310gp", "+434gp", "+651gp", "+1042gp"],
                        ["-90gp", "-45gp", "0gp", "+190gp", "+209gp", "+251gp", "+327gp", "+458gp", "+687gp", "+1100gp"],
                        ["-100gp", "-50gp", "0gp", "+200gp", "+220gp", "+264gp", "+344gp", "+482gp", "+723gp", "+1157gp"],
                ],
        },
        'Crime': {
                table: [
                        [events.CRIME_BAD+"large fine.", events.CRIME_BAD+"medium fine.", events.CRIME_BAD+"small fine.", events.CRIME_OK, events.CRIME_GOOD, events.CRIME_GOOD, events.CRIME_GOOD, events.CRIME_GREAT, events.CRIME_GREAT, events.CRIME_GREAT],
                        ["-278gp", "-223gp", "-167gp", "0gp", "+66gp", "+81gp", "+108gp", "+153gp", "+231gp", "+372gp"],
                        ["-397gp", "-317gp", "-238gp", "0gp", "+99gp", "+120gp", "+156gp", "+219gp", "+330gp", "+528gp"],
                        ["-531gp", "-425gp", "-319gp", "0gp", "+132gp", "+159gp", "+207gp", "+291gp", "+438gp", "+702gp"],
                        ["-660gp", "-528gp", "-396gp", "0gp", "+165gp", "+198gp", "+258gp", "+363gp", "+546gp", "+876gp"],
                        ["-798gp", "-639gp", "-479gp", "0gp", "+198gp", "+240gp", "+312gp", "+438gp", "+657gp", "+1053gp"],
                        ["-926gp", "-741gp", "-555gp", "0gp", "+231gp", "+279gp", "+363gp", "+510gp", "+765gp", "+1224gp"],
                        ["-1060gp", "-848gp", "-636gp", "0gp", "+264gp", "+318gp", "+414gp", "+582gp", "+873gp", "+1398gp"],
                        ["-1185gp", "-948gp", "-711gp", "0gp", "+297gp", "+357gp", "+465gp", "+651gp", "+978gp", "+1566gp"],
                        ["-1320gp", "-1056gp", "-792gp", "0gp", "+330gp", "+396gp", "+516gp", "+723gp", "+1086gp", "+1740gp"],
                        ["-1452gp", "-1162gp", "-871gp", "0gp", "+363gp", "+438gp", "+570gp", "+798gp", "+1197gp", "+1917gp"],
                        ["-1586gp", "-1269gp", "-952gp", "0gp", "+396gp", "+477gp", "+621gp", "+870gp", "+1305gp", "+2088gp"],
                        ["-1715gp", "-1372gp", "-1029gp", "0gp", "+429gp", "+516gp", "+672gp", "+942gp", "+1413gp", "+2262gp"],
                        ["-1849gp", "-1479gp", "-1109gp", "0gp", "+462gp", "+555gp", "+723gp", "+1014gp", "+1521gp", "+2436gp"],
                        ["-1977gp", "-1581gp", "-1186gp", "0gp", "+495gp", "+594gp", "+774gp", "+1086gp", "+1629gp", "+2607gp"],
                        ["-2118gp", "-1694gp", "-1271gp", "0gp", "+528gp", "+636gp", "+828gp", "+1161gp", "+1743gp", "+2790gp"],
                        ["-2246gp", "-1797gp", "-1348gp", "0gp", "+561gp", "+675gp", "+879gp", "+1233gp", "+1851gp", "+2964gp"],
                        ["-2375gp", "-1900gp", "-1425gp", "0gp", "+594gp", "+714gp", "+930gp", "+1302gp", "+1953gp", "+3126gp"],
                        ["-2503gp", "-2003gp", "-1502gp", "0gp", "+627gp", "+753gp", "+981gp", "+1374gp", "+2061gp", "+3300gp"],
                        ["-2637gp", "-2110gp", "-1582gp", "0gp", "+660gp", "+792gp", "+1032gp", "+1446gp", "+2169gp", "+3471gp"],
                ],
        },
        'Training to gain xp': {
                table: [
                        [events.TRAINING_BAD_BOTH, events.TRAINING_BAD1, events.TRAINING_BAD2, events.TRAINING_GOOD, events.TRAINING_GOOD, events.TRAINING_GOOD, events.TRAINING_GOOD, events.TRAINING_GREAT, events.TRAINING_GREAT, events.TRAINING_GREAT],
                        ["-5gp and -3hp", "-5gp", "-3hp", "+30xp", "+40xp", "+50xp", "+60xp", "+70xp", "+80xp", "+100xp"],
                        ["-15gp and -5hp", "-15gp", "-5hp", "+68xp", "+90xp", "+113xp", "+135xp", "+158xp", "+180xp", "+225xp"],
                        ["-25gp and -7hp", "-25gp", "-7hp", "+143xp", "+190xp", "+238xp", "+285xp", "+333xp", "+380xp", "+475xp"], ["-35gp and -9hp", "-35gp", "-9hp", "+188xp", "+250xp", "+313xp", "+375xp", "+438xp", "+500xp", "+625xp"], ["-45gp and -11hp", "-45gp", "-11hp", "+225xp", "+300xp", "+375xp", "+450xp", "+525xp", "+600xp", "+750xp"],
                        ["-55gp and -13hp", "-55gp", "-13hp", "+255xp", "+339xp", "+424xp", "+509xp", "+593xp", "+678xp", "+847xp"],
                        ["-65gp and -15hp", "-65gp", "-15hp", "+281xp", "+374xp", "+467xp", "+561xp", "+654xp", "+748xp", "+934xp"],
                        ["-75gp and -15hp", "-75gp", "-15hp", "+300xp", "+400xp", "+500xp", "+600xp", "+700xp", "+800xp", "+1000xp"],
                        ["-85gp and -15hp", "-85gp", "-15hp", "+351xp", "+467xp", "+584xp", "+701xp", "+817xp", "+934xp", "+1167xp"],
                        ["-95gp and -15hp", "-95gp", "-15hp", "+375xp", "+500xp", "+625xp", "+750xp", "+875xp", "+1000xp", "+1250xp"],
                        ["-105gp and -15hp", "-105gp", "-15hp", "+401xp", "+534xp", "+667xp", "+801xp", "+934xp", "+1068xp", "+1334xp"],
                        ["-115gp and -15hp", "-115gp", "-15hp", "+429xp", "+572xp", "+715xp", "+858xp", "+1001xp", "+1144xp", "+1429xp"],
                        ["-125gp and -15hp", "-125gp", "-15hp", "+469xp", "+626xp", "+782xp", "+938xp", "+1095xp", "+1251xp", "+1563xp"],
                        ["-135gp and -15hp", "-135gp", "-15hp", "+530xp", "+706xp", "+883xp", "+1059xp", "+1236xp", "+1412xp", "+1765xp"],
                        ["-145gp and -15hp", "-145gp", "-15hp", "+563xp", "+750xp", "+938xp", "+1125xp", "+1313xp", "+1500xp", "+1875xp"],
                        ["-155gp and -15hp", "-155gp", "-15hp", "+667xp", "+890xp", "+1112xp", "+1334xp", "+1557xp", "+1779xp", "+2223xp"],
                        ["-165gp and -15hp", "-165gp", "-15hp", "+750xp", "+1000xp", "+1250xp", "+1500xp", "+1750xp", "+2000xp", "+2500xp"],
                        ["-175gp and -15hp", "-175gp", "-15hp", "+938xp", "+1250xp", "+1563xp", "+1875xp", "+2188xp", "+2500xp", "+3125xp"],
                ],
        },
};
/**
 * @return {[string, {id: number}][]}
 */

export function getDowntimes() {
        return Object.entries(downtimes);
}
/**
 * @return {string[]}
 */

export function getDowntimeNames() {
        return Object.keys(downtimes);
}
/**
 *
 * @returns {[string, {table: string[][]}][]}
 */

export function getDowntimeTables() {
        return Object.entries(downtimeTables);
}
const profs = {
        alchemist: "Alchemist’s supplies",
        brewer: "Brewer’s supplies",
        calligrapher: "Calligrapher's supplies",
        carpenter: "Carpenter’s tools",
        cartographer: "Cartographer’s tools",
        cobbler: "Cobbler’s tools",
        cook: "Cook’s utensils",
        glassblower: "Glassblower’s tools",
        jeweler: "Jeweler’s tools",
        leatherworker: "Leatherworker’s tools",
        mason: "Mason’s tools",
        painter: "Painter’s supplies",
        potter: "Potter’s tools",
        smith: "Smith’s tools",
        tinker: "Tinker’s tools",
        weaver: "Weaver’s tools",
        woodcarver: "Woodcarver’s tools",
        herbalist: "Herbalism Kit",
        forger: "Forgery Kit",
        poisoner: "Poisoner’s Kit",
};

export function getProficiencies() {
        return profs;
}

export function createProficiencyChoices() {
        const proficiencies = Object.entries(getProficiencies());
        const commandChoices = [];
        for (let i = 0; i < proficiencies.length; i++) {
                commandChoices.push({
                        value: proficiencies[i][0],
                        label: proficiencies[i][1],
                });
        }
        return commandChoices;
}
