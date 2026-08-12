// FaithBlock Bible Data (KJV - public domain)
// 100+ verses organized by life-need, used for daily verses, devotionals, and AI prompts.

export interface Verse {
  text: string;
  reference: string;
  /** life-need category */
  need: Need;
}

export type Need =
  | 'anxiety'
  | 'strength'
  | 'hope'
  | 'guidance'
  | 'gratitude'
  | 'healing'
  | 'forgiveness'
  | 'peace'
  | 'love'
  | 'courage'
  | 'faith'
  | 'provision'
  | 'prayer'
  | 'joy'
  | 'wisdom';

export const NEED_LABELS: Record<Need, string> = {
  anxiety: 'When You Feel Anxious',
  strength: 'When You Need Strength',
  hope: 'When You Need Hope',
  guidance: 'When You Need Direction',
  gratitude: 'When You Need Gratitude',
  healing: 'When You Need Healing',
  forgiveness: 'When You Need Forgiveness',
  peace: 'When You Need Peace',
  love: 'When You Need Love',
  courage: 'When You Need Courage',
  faith: 'When You Need Faith',
  provision: 'When You Need Provision',
  prayer: 'For Prayer',
  joy: 'For Joy',
  wisdom: 'For Wisdom',
};

export const VERSES: Verse[] = [
  // PEACE
  { text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.', reference: 'Psalm 46:10', need: 'peace' },
  { text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', reference: 'John 14:27', need: 'peace' },
  { text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', reference: 'Philippians 4:7', need: 'peace' },
  { text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.', reference: 'Isaiah 26:3', need: 'peace' },
  { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', reference: 'Matthew 11:28', need: 'peace' },

  // ANXIETY
  { text: 'Casting all your care upon him; for he careth for you.', reference: '1 Peter 5:7', need: 'anxiety' },
  { text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', reference: 'Philippians 4:6', need: 'anxiety' },
  { text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', reference: '2 Timothy 1:7', need: 'anxiety' },
  { text: 'Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment?', reference: 'Matthew 6:25', need: 'anxiety' },
  { text: 'When I am afraid, I will trust in thee.', reference: 'Psalm 56:3', need: 'anxiety' },
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', reference: 'Philippians 4:6', need: 'anxiety' },

  // STRENGTH
  { text: 'I can do all things through Christ which strengtheneth me.', reference: 'Philippians 4:13', need: 'strength' },
  { text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', reference: 'Isaiah 40:31', need: 'strength' },
  { text: 'The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.', reference: 'Psalm 28:7', need: 'strength' },
  { text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', reference: 'Isaiah 41:10', need: 'strength' },
  { text: 'My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.', reference: 'Psalm 73:26', need: 'strength' },
  { text: 'The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust.', reference: 'Psalm 18:2', need: 'strength' },

  // HOPE
  { text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', reference: 'Jeremiah 29:11', need: 'hope' },
  { text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.', reference: 'Romans 15:13', need: 'hope' },
  { text: 'But I will hope continually, and will yet praise thee more and more.', reference: 'Psalm 71:14', need: 'hope' },
  { text: 'Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him, who is the health of my countenance, and my God.', reference: 'Psalm 42:11', need: 'hope' },
  { text: 'Weeping may endure for a night, but joy cometh in the morning.', reference: 'Psalm 30:5', need: 'hope' },
  { text: 'And hope maketh not ashamed; because the love of God is shed abroad in our hearts by the Holy Ghost which is given unto us.', reference: 'Romans 5:5', need: 'hope' },

  // GUIDANCE
  { text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', reference: 'Proverbs 3:5-6', need: 'guidance' },
  { text: 'Thy word is a lamp unto my feet, and a light unto my path.', reference: 'Psalm 119:105', need: 'guidance' },
  { text: 'I will instruct thee and teach thee in the way which thou shalt go: I will guide thee with mine eye.', reference: 'Psalm 32:8', need: 'guidance' },
  { text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.', reference: 'James 1:5', need: 'guidance' },
  { text: 'And thine ears shall hear a word behind thee, saying, This is the way, walk ye in it, when ye turn to the right hand, and when ye turn to the left.', reference: 'Isaiah 30:21', need: 'guidance' },

  // GRATITUDE
  { text: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.', reference: '1 Thessalonians 5:18', need: 'gratitude' },
  { text: 'Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.', reference: 'Psalm 100:4', need: 'gratitude' },
  { text: 'Let the peace of Christ rule in your hearts... And be thankful.', reference: 'Colossians 3:15', need: 'gratitude' },
  { text: 'Give thanks unto the LORD, for he is good: for his mercy endureth for ever.', reference: 'Psalm 136:1', need: 'gratitude' },
  { text: 'I will praise thee, O Lord, with my whole heart; I will shew forth all thy marvellous works.', reference: 'Psalm 9:1', need: 'gratitude' },

  // HEALING
  { text: 'He healeth the broken in heart, and bindeth up their wounds.', reference: 'Psalm 147:3', need: 'healing' },
  { text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.', reference: 'Isaiah 53:5', need: 'healing' },
  { text: 'And the prayer of faith shall save the sick, and the Lord shall raise him up; and if he have committed sins, they shall be forgiven him.', reference: 'James 5:15', need: 'healing' },
  { text: 'Heal me, O LORD, and I shall be healed; save me, and I shall be saved: for thou art my praise.', reference: 'Jeremiah 17:14', need: 'healing' },
  { text: 'Bless the LORD, O my soul, and forget not all his benefits: Who forgiveth all thine iniquities; who healeth all thy diseases.', reference: 'Psalm 103:2-3', need: 'healing' },

  // FORGIVENESS
  { text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.', reference: '1 John 1:9', need: 'forgiveness' },
  { text: 'Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.', reference: 'Colossians 3:13', need: 'forgiveness' },
  { text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ sake hath forgiven you.', reference: 'Ephesians 4:32', need: 'forgiveness' },
  { text: 'I, even I, am he that blotteth out thy transgressions for mine own sake, and will not remember thy sins.', reference: 'Isaiah 43:25', need: 'forgiveness' },
  { text: 'Then came Peter to him, and said, Lord, how oft shall my brother sin against me, and I forgive him? till seven times? Jesus saith unto him, I say not unto thee, Until seven times: but, Until seventy times seven.', reference: 'Matthew 18:21-22', need: 'forgiveness' },

  // LOVE
  { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', reference: 'John 3:16', need: 'love' },
  { text: 'Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.', reference: '1 John 4:7', need: 'love' },
  { text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.', reference: '1 Corinthians 13:4', need: 'love' },
  { text: 'The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee.', reference: 'Jeremiah 31:3', need: 'love' },
  { text: 'Greater love hath no man than this, that a man lay down his life for his friends.', reference: 'John 15:13', need: 'love' },
  { text: 'We love him, because he first loved us.', reference: '1 John 4:19', need: 'love' },

  // COURAGE
  { text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', reference: 'Joshua 1:9', need: 'courage' },
  { text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.', reference: 'Deuteronomy 31:6', need: 'courage' },
  { text: 'Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.', reference: 'Psalm 27:14', need: 'courage' },
  { text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', reference: 'Joshua 1:9', need: 'courage' },
  { text: 'But the righteous are bold as a lion.', reference: 'Proverbs 28:1', need: 'courage' },

  // FAITH
  { text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', reference: 'Hebrews 11:1', need: 'faith' },
  { text: 'Jesus said unto him, If thou canst believe, all things are possible to him that believeth.', reference: 'Mark 9:23', need: 'faith' },
  { text: 'And Jesus answering saith unto them, Have faith in God.', reference: 'Mark 11:22', need: 'faith' },
  { text: 'For we walk by faith, not by sight.', reference: '2 Corinthians 5:7', need: 'faith' },
  { text: 'So then faith cometh by hearing, and hearing by the word of God.', reference: 'Romans 10:17', need: 'faith' },

  // PROVISION
  { text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.', reference: 'Philippians 4:19', need: 'provision' },
  { text: 'Consider the lilies of the field, how they grow; they toil not, neither do they spin: And yet I say unto you, That even Solomon in all his glory was not arrayed like one of these.', reference: 'Matthew 6:28-29', need: 'provision' },
  { text: 'The young lions do lack, and suffer hunger: but they that seek the LORD shall not want any good thing.', reference: 'Psalm 34:10', need: 'provision' },
  { text: 'Give us this day our daily bread.', reference: 'Matthew 6:11', need: 'provision' },
  { text: 'And God is able to make all grace abound toward you; that ye, always having all sufficiency in all things, may abound to every good work.', reference: '2 Corinthians 9:8', need: 'provision' },

  // PRAYER
  { text: 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.', reference: 'Matthew 7:7', need: 'prayer' },
  { text: 'And all things, whatsoever ye shall ask in prayer, believing, ye shall receive.', reference: 'Matthew 21:22', need: 'prayer' },
  { text: 'Pray without ceasing.', reference: '1 Thessalonians 5:17', need: 'prayer' },
  { text: 'Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.', reference: 'James 5:16', need: 'prayer' },
  { text: 'Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.', reference: 'Jeremiah 33:3', need: 'prayer' },
  { text: 'If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you.', reference: 'John 15:7', need: 'prayer' },

  // JOY
  { text: 'Rejoice in the Lord alway: and again I say, Rejoice.', reference: 'Philippians 4:4', need: 'joy' },
  { text: 'The joy of the LORD is your strength.', reference: 'Nehemiah 8:10', need: 'joy' },
  { text: 'Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.', reference: 'Psalm 16:11', need: 'joy' },
  { text: 'These things have I spoken unto you, that my joy might remain in you, and that your joy might be full.', reference: 'John 15:11', need: 'joy' },
  { text: 'Shout for joy unto God, all ye lands.', reference: 'Psalm 66:1', need: 'joy' },

  // WISDOM
  { text: 'The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.', reference: 'Proverbs 9:10', need: 'wisdom' },
  { text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.', reference: 'James 1:5', need: 'wisdom' },
  { text: 'For the LORD giveth wisdom: and out of his mouth cometh knowledge and understanding.', reference: 'Proverbs 2:6', need: 'wisdom' },
  { text: 'Get wisdom, get understanding: forget it not; neither decline from the words of my mouth.', reference: 'Proverbs 4:5', need: 'wisdom' },
  { text: 'But the wisdom that is from above is first pure, then peaceable, gentle, and easy to be intreated, full of mercy and good fruits, without partiality, and without hypocrisy.', reference: 'James 3:17', need: 'wisdom' },

  // STRENGTH (extended)
  { text: 'God is our refuge and strength, a very present help in trouble.', reference: 'Psalm 46:1', need: 'strength' },
  { text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?', reference: 'Psalm 27:1', need: 'strength' },
  { text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.', reference: 'Ephesians 6:10', need: 'strength' },

  // PEACE (extended)
  { text: 'The LORD give strength unto his people; the LORD will bless his people with peace.', reference: 'Psalm 29:11', need: 'peace' },
  { text: 'Therefore being justified by faith, we have peace with God through our Lord Jesus Christ.', reference: 'Romans 5:1', need: 'peace' },

  // HOPE (extended)
  { text: 'The LORD is good unto them that wait for him, to the soul that seeketh him.', reference: 'Lamentations 3:25', need: 'hope' },
  { text: 'For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning.', reference: 'Psalm 30:5', need: 'hope' },

  // GUIDANCE (extended)
  { text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.', reference: 'Psalm 37:23', need: 'guidance' },
  { text: 'Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.', reference: 'Psalm 37:5', need: 'guidance' },

  // PROVISION (extended)
  { text: 'The LORD is my shepherd; I shall not want.', reference: 'Psalm 23:1', need: 'provision' },
  { text: 'And it shall come to pass, that before they call, I will answer; and while they are yet speaking, I will hear.', reference: 'Isaiah 65:24', need: 'provision' },
];

/** deterministic daily verse selection */
export function getVerseOfDay(dayIndex: number): Verse {
  const idx = Math.abs(dayIndex) % VERSES.length;
  return VERSES[idx];
}

/** pick a verse for a specific need */
export function getVerseByNeed(need: Need): Verse {
  const pool = VERSES.filter((v) => v.need === need);
  if (!pool.length) return VERSES[0];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/** pick a random verse */
export function getRandomVerse(): Verse {
  const idx = Math.floor(Math.random() * VERSES.length);
  return VERSES[idx];
}

/** all unique needs */
export const ALL_NEEDS: Need[] = [...new Set(VERSES.map((v) => v.need))];
