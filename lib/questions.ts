export interface Question {
  id: string;
  text: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  questions: Question[];
}

export const categories: Category[] = [
  {
    id: 'basics',
    name: 'Basics',
    emoji: '💕',
    questions: [
      { id: 'b1', text: 'I would like to have sex more frequently', category: 'basics' },
      { id: 'b2', text: 'I enjoy giving oral sex', category: 'basics' },
      { id: 'b3', text: 'I enjoy receiving oral sex', category: 'basics' },
      { id: 'b4', text: 'I like to be kissed during sex', category: 'basics' },
      { id: 'b5', text: 'I enjoy making out for extended periods', category: 'basics' },
      { id: 'b6', text: 'I like dirty talk during intimacy', category: 'basics' },
      { id: 'b7', text: 'I enjoy giving massages as foreplay', category: 'basics' },
      { id: 'b8', text: 'I enjoy receiving massages as foreplay', category: 'basics' },
      { id: 'b9', text: 'I like to watch my partner undress', category: 'basics' },
      { id: 'b10', text: 'I enjoy undressing slowly for my partner', category: 'basics' },
      { id: 'b11', text: 'I like mutual masturbation', category: 'basics' },
      { id: 'b12', text: 'I enjoy watching my partner pleasure themselves', category: 'basics' },
      { id: 'b13', text: 'I am comfortable pleasuring myself in front of my partner', category: 'basics' },
      { id: 'b14', text: 'I like to maintain eye contact during sex', category: 'basics' },
      { id: 'b15', text: 'I enjoy spontaneous, unplanned sex', category: 'basics' },
      { id: 'b16', text: 'I enjoy planned, anticipated sexual encounters', category: 'basics' },
      { id: 'b17', text: 'I like quickies', category: 'basics' },
      { id: 'b18', text: 'I prefer longer, extended sessions', category: 'basics' },
      { id: 'b19', text: 'I enjoy having sex in the morning', category: 'basics' },
      { id: 'b20', text: 'I enjoy having sex at night before bed', category: 'basics' },
      { id: 'b21', text: 'I like to shower or bathe together', category: 'basics' },
      { id: 'b22', text: 'I enjoy cuddling after sex', category: 'basics' },
    ],
  },
  {
    id: 'roleplay',
    name: 'Role Play',
    emoji: '🎭',
    questions: [
      { id: 'r1', text: 'I am interested in role playing scenarios', category: 'roleplay' },
      { id: 'r2', text: 'I would like to play strangers meeting for the first time', category: 'roleplay' },
      { id: 'r3', text: 'I am interested in boss/employee scenarios', category: 'roleplay' },
      { id: 'r4', text: 'I would enjoy teacher/student role play', category: 'roleplay' },
      { id: 'r5', text: 'I am interested in doctor/patient scenarios', category: 'roleplay' },
      { id: 'r6', text: 'I would like to try massage therapist role play', category: 'roleplay' },
      { id: 'r7', text: 'I am interested in delivery person scenarios', category: 'roleplay' },
      { id: 'r8', text: 'I would enjoy playing captured/captor', category: 'roleplay' },
      { id: 'r9', text: 'I am interested in maid/butler role play', category: 'roleplay' },
      { id: 'r10', text: 'I would like to act out a fantasy with costumes', category: 'roleplay' },
      { id: 'r11', text: 'I enjoy wearing sexy costumes or lingerie', category: 'roleplay' },
      { id: 'r12', text: 'I like when my partner wears sexy costumes or lingerie', category: 'roleplay' },
      { id: 'r13', text: 'I am interested in uniform fantasies (nurse, police, etc.)', category: 'roleplay' },
      { id: 'r14', text: 'I would enjoy pretending we just met and flirting', category: 'roleplay' },
      { id: 'r15', text: 'I am interested in power exchange scenarios', category: 'roleplay' },
      { id: 'r16', text: 'I would like to try phone/video sex while apart', category: 'roleplay' },
      { id: 'r17', text: 'I am interested in sending/receiving sexy texts or photos', category: 'roleplay' },
      { id: 'r18', text: 'I would enjoy acting out a scene from a movie or book', category: 'roleplay' },
    ],
  },
  {
    id: 'anal',
    name: 'Anal Play',
    emoji: '🍑',
    questions: [
      { id: 'a1', text: 'I am interested in giving anal stimulation with fingers', category: 'anal' },
      { id: 'a2', text: 'I am interested in receiving anal stimulation with fingers', category: 'anal' },
      { id: 'a3', text: 'I would like to try using anal toys on my partner', category: 'anal' },
      { id: 'a4', text: 'I would like to try having anal toys used on me', category: 'anal' },
      { id: 'a5', text: 'I am interested in giving analingus (rimming)', category: 'anal' },
      { id: 'a6', text: 'I am interested in receiving analingus (rimming)', category: 'anal' },
      { id: 'a7', text: 'I would like to try anal intercourse (giving)', category: 'anal' },
      { id: 'a8', text: 'I would like to try anal intercourse (receiving)', category: 'anal' },
      { id: 'a9', text: 'I am interested in prostate massage', category: 'anal' },
    ],
  },
  {
    id: 'positions',
    name: 'Positions',
    emoji: '🔄',
    questions: [
      { id: 'p1', text: 'I enjoy missionary position', category: 'positions' },
      { id: 'p2', text: 'I enjoy doggy style', category: 'positions' },
      { id: 'p3', text: 'I like cowgirl/riding on top', category: 'positions' },
      { id: 'p4', text: 'I enjoy reverse cowgirl', category: 'positions' },
      { id: 'p5', text: 'I like spooning sex', category: 'positions' },
      { id: 'p6', text: 'I enjoy standing positions', category: 'positions' },
      { id: 'p7', text: 'I would like to try sex against a wall', category: 'positions' },
      { id: 'p8', text: 'I enjoy 69 position', category: 'positions' },
      { id: 'p9', text: 'I like face-to-face sitting positions', category: 'positions' },
      { id: 'p10', text: 'I would like to experiment with new positions', category: 'positions' },
      { id: 'p11', text: 'I enjoy positions where I can see my partner\'s face', category: 'positions' },
      { id: 'p12', text: 'I like positions with deep penetration', category: 'positions' },
      { id: 'p13', text: 'I would like to try positions from a Kama Sutra book', category: 'positions' },
    ],
  },
  {
    id: 'bdsm',
    name: 'BDSM',
    emoji: '⛓️',
    questions: [
      { id: 'd1', text: 'I enjoy being dominant in the bedroom', category: 'bdsm' },
      { id: 'd2', text: 'I enjoy being submissive in the bedroom', category: 'bdsm' },
      { id: 'd3', text: 'I like to switch between dominant and submissive roles', category: 'bdsm' },
      { id: 'd4', text: 'I am interested in light bondage (scarves, ties)', category: 'bdsm' },
      { id: 'd5', text: 'I would like to try handcuffs or restraints', category: 'bdsm' },
      { id: 'd6', text: 'I am interested in being tied up', category: 'bdsm' },
      { id: 'd7', text: 'I am interested in tying up my partner', category: 'bdsm' },
      { id: 'd8', text: 'I enjoy light spanking', category: 'bdsm' },
      { id: 'd9', text: 'I would like to try harder spanking', category: 'bdsm' },
      { id: 'd10', text: 'I am interested in using a paddle or crop', category: 'bdsm' },
      { id: 'd11', text: 'I would like to try blindfolds', category: 'bdsm' },
      { id: 'd12', text: 'I am interested in sensory deprivation', category: 'bdsm' },
      { id: 'd13', text: 'I enjoy hair pulling', category: 'bdsm' },
      { id: 'd14', text: 'I like light choking or breath play', category: 'bdsm' },
      { id: 'd15', text: 'I am interested in nipple clamps or stimulation', category: 'bdsm' },
      { id: 'd16', text: 'I would like to try ice or temperature play', category: 'bdsm' },
      { id: 'd17', text: 'I am interested in wax play', category: 'bdsm' },
      { id: 'd18', text: 'I would enjoy giving commands during sex', category: 'bdsm' },
      { id: 'd19', text: 'I would enjoy following commands during sex', category: 'bdsm' },
      { id: 'd20', text: 'I am interested in orgasm control or edging', category: 'bdsm' },
      { id: 'd21', text: 'I would like to try orgasm denial', category: 'bdsm' },
      { id: 'd22', text: 'I am interested in using a collar', category: 'bdsm' },
      { id: 'd23', text: 'I would like to explore pet play', category: 'bdsm' },
      { id: 'd24', text: 'I am interested in punishment/reward dynamics', category: 'bdsm' },
      { id: 'd25', text: 'I would like to try a gag', category: 'bdsm' },
      { id: 'd26', text: 'I am interested in face slapping (consensual)', category: 'bdsm' },
      { id: 'd27', text: 'I would enjoy leaving marks (hickeys, scratches)', category: 'bdsm' },
      { id: 'd28', text: 'I would enjoy receiving marks (hickeys, scratches)', category: 'bdsm' },
      { id: 'd29', text: 'I am interested in foot worship', category: 'bdsm' },
      { id: 'd30', text: 'I would like to explore sensation play (feathers, etc.)', category: 'bdsm' },
      { id: 'd31', text: 'I am interested in a full BDSM scene with planning', category: 'bdsm' },
      { id: 'd32', text: 'I would like to establish a safe word for intense play', category: 'bdsm' },
    ],
  },
  {
    id: 'frequency',
    name: 'Frequency & Location',
    emoji: '📍',
    questions: [
      { id: 'f1', text: 'I would like to have sex in a car', category: 'frequency' },
      { id: 'f2', text: 'I am interested in outdoor sex (private area)', category: 'frequency' },
      { id: 'f3', text: 'I would like to try sex in a semi-public place', category: 'frequency' },
      { id: 'f4', text: 'I enjoy the thrill of possibly being caught', category: 'frequency' },
      { id: 'f5', text: 'I would like to have sex in a hotel room', category: 'frequency' },
      { id: 'f6', text: 'I am interested in sex on the beach', category: 'frequency' },
      { id: 'f7', text: 'I would like to try sex in a pool or hot tub', category: 'frequency' },
      { id: 'f8', text: 'I am interested in sex during a trip or vacation', category: 'frequency' },
      { id: 'f9', text: 'I would like to try sex in the kitchen', category: 'frequency' },
      { id: 'f10', text: 'I am interested in sex on the couch/living room', category: 'frequency' },
      { id: 'f11', text: 'I would like to have sex in different rooms of the house', category: 'frequency' },
      { id: 'f12', text: 'I enjoy having sex with music playing', category: 'frequency' },
      { id: 'f13', text: 'I like having sex with candles lit', category: 'frequency' },
      { id: 'f14', text: 'I enjoy sex in complete darkness', category: 'frequency' },
      { id: 'f15', text: 'I like having sex with the lights on', category: 'frequency' },
      { id: 'f16', text: 'I would like to make a sex tape (private)', category: 'frequency' },
      { id: 'f17', text: 'I am interested in taking sexy photos together', category: 'frequency' },
      { id: 'f18', text: 'I enjoy watching porn with my partner', category: 'frequency' },
      { id: 'f19', text: 'I would like to recreate scenes from porn', category: 'frequency' },
      { id: 'f20', text: 'I am interested in using mirrors during sex', category: 'frequency' },
      { id: 'f21', text: 'I would like to schedule regular date nights for intimacy', category: 'frequency' },
      { id: 'f22', text: 'I enjoy surprise sexual encounters initiated by my partner', category: 'frequency' },
      { id: 'f23', text: 'I would like to wake my partner up with sexual activity', category: 'frequency' },
      { id: 'f24', text: 'I would enjoy being woken up with sexual activity', category: 'frequency' },
      { id: 'f25', text: 'I am interested in all-day teasing leading to sex', category: 'frequency' },
    ],
  },
  {
    id: 'toys',
    name: 'Toys & Devices',
    emoji: '🎮',
    questions: [
      { id: 't1', text: 'I would like to use vibrators during sex', category: 'toys' },
      { id: 't2', text: 'I am interested in using dildos', category: 'toys' },
      { id: 't3', text: 'I would like to try a cock ring', category: 'toys' },
      { id: 't4', text: 'I am interested in using butt plugs', category: 'toys' },
      { id: 't5', text: 'I would like to explore remote-controlled toys', category: 'toys' },
      { id: 't6', text: 'I am interested in using a sex swing or furniture', category: 'toys' },
      { id: 't7', text: 'I would like to try a couples vibrator', category: 'toys' },
      { id: 't8', text: 'I am interested in using massage wands', category: 'toys' },
      { id: 't9', text: 'I would like to shop for toys together', category: 'toys' },
      { id: 't10', text: 'I am interested in trying new toys regularly', category: 'toys' },
    ],
  },
  {
    id: 'body',
    name: 'Body Preferences',
    emoji: '👅',
    questions: [
      { id: 'o1', text: 'I enjoy my partner finishing on my body', category: 'body' },
      { id: 'o2', text: 'I enjoy finishing on my partner\'s body', category: 'body' },
      { id: 'o3', text: 'I am interested in facials (consensual)', category: 'body' },
      { id: 'o4', text: 'I am comfortable with swallowing', category: 'body' },
      { id: 'o5', text: 'I enjoy giving attention to my partner\'s entire body', category: 'body' },
      { id: 'o6', text: 'I enjoy receiving attention on my entire body', category: 'body' },
      { id: 'o7', text: 'I am interested in body worship', category: 'body' },
      { id: 'o8', text: 'I would like more focus on erogenous zones', category: 'body' },
      { id: 'o9', text: 'I enjoy giving/receiving breast or chest stimulation', category: 'body' },
    ],
  },
  {
    id: 'group',
    name: 'Swingers & Group',
    emoji: '👥',
    questions: [
      { id: 'g1', text: 'I fantasize about a threesome (FFM)', category: 'group' },
      { id: 'g2', text: 'I fantasize about a threesome (MMF)', category: 'group' },
      { id: 'g3', text: 'I am interested in watching my partner with someone else', category: 'group' },
      { id: 'g4', text: 'I am interested in being watched by someone else', category: 'group' },
      { id: 'g5', text: 'I would like to attend a swingers party (just to watch)', category: 'group' },
      { id: 'g6', text: 'I am interested in soft swapping (kissing/touching only)', category: 'group' },
      { id: 'g7', text: 'I am interested in full partner swapping', category: 'group' },
      { id: 'g8', text: 'I fantasize about group sex (more than 3 people)', category: 'group' },
      { id: 'g9', text: 'I am interested in same-sex experiences', category: 'group' },
      { id: 'g10', text: 'I would be open to discussing ethical non-monogamy', category: 'group' },
    ],
  },
  {
    id: 'bonus',
    name: 'Bonus: Extra Spicy 🌶️',
    emoji: '🔥',
    questions: [
      { id: 'x1', text: 'I want my partner to be rougher with me in bed', category: 'bonus' },
      { id: 'x2', text: 'I want to be completely used and ravished by my partner', category: 'bonus' },
      { id: 'x3', text: 'I fantasize about my partner taking me without warning', category: 'bonus' },
      { id: 'x4', text: 'I want to try being called degrading names during sex', category: 'bonus' },
      { id: 'x5', text: 'I want to call my partner degrading names during sex', category: 'bonus' },
      { id: 'x6', text: 'I fantasize about being "forced" (consensual non-consent)', category: 'bonus' },
      { id: 'x7', text: 'I want my partner to hold me down and have their way with me', category: 'bonus' },
      { id: 'x8', text: 'I want to spit or be spat on during sex', category: 'bonus' },
      { id: 'x9', text: 'I want to try "free use" scenarios where I\'m always available', category: 'bonus' },
      { id: 'x10', text: 'I fantasize about my partner finishing inside me', category: 'bonus' },
      { id: 'x11', text: 'I want to beg my partner to let me finish', category: 'bonus' },
      { id: 'x12', text: 'I want my partner to beg me to let them finish', category: 'bonus' },
      { id: 'x13', text: 'I want to try having sex while one of us is on the phone/video call', category: 'bonus' },
      { id: 'x14', text: 'I fantasize about teasing my partner under the table in public', category: 'bonus' },
      { id: 'x15', text: 'I want to be edged for hours before being allowed to finish', category: 'bonus' },
      { id: 'x16', text: 'I want to try a day where I must do whatever my partner says sexually', category: 'bonus' },
      { id: 'x17', text: 'I fantasize about my partner using me while I pretend to sleep', category: 'bonus' },
      { id: 'x18', text: 'I want to wear something sexy under my clothes when we go out', category: 'bonus' },
      { id: 'x19', text: 'I want my partner to secretly control a vibrator on me in public', category: 'bonus' },
      { id: 'x20', text: 'I fantasize about having a hall pass for one celebrity', category: 'bonus' },
    ],
  },
];

export const allQuestions: Question[] = categories.flatMap((cat) => cat.questions);

export const TOTAL_QUESTIONS = allQuestions.length;

// Answer scale: 1-5 where 1 is "No way" and 5 is "Yes!"
export const answerOptions = [
  { value: 1, emoji: '🤮', label: 'No way' },
  { value: 2, emoji: '😕', label: 'Probably not' },
  { value: 3, emoji: '🤷', label: 'Maybe' },
  { value: 4, emoji: '😀', label: 'Sure' },
  { value: 5, emoji: '😍', label: 'Yes!' },
];

// Function to check if two answers are a match (both positive)
export function isMatch(answerA: number, answerB: number): boolean {
  // Both answers need to be 4 or 5 (Sure or Yes!) to be a match
  return answerA >= 4 && answerB >= 4;
}

// Function to get match strength
export function getMatchStrength(answerA: number, answerB: number): 'perfect' | 'good' | 'none' {
  if (answerA === 5 && answerB === 5) return 'perfect';
  if (answerA >= 4 && answerB >= 4) return 'good';
  return 'none';
}
