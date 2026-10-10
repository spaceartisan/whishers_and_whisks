(() => {
  'use strict';

  // Keep the app matched to the *visible* mobile viewport. Android Chrome's
  // collapsing address bar can otherwise leave fixed UI partially off-screen.
  let viewportRaf = 0;
  function syncMobileViewport(){
    cancelAnimationFrame(viewportRaf);
    viewportRaf=requestAnimationFrame(()=>{
      const vv=window.visualViewport;
      const h=Math.max(320,Math.round(vv?.height || window.innerHeight || document.documentElement.clientHeight));
      document.documentElement.style.setProperty('--app-height',`${h}px`);
    });
  }
  syncMobileViewport();
  window.addEventListener('resize',syncMobileViewport,{passive:true});
  window.addEventListener('orientationchange',syncMobileViewport,{passive:true});
  window.visualViewport?.addEventListener('resize',syncMobileViewport,{passive:true});

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const editableAssetVersion = Date.now();

  const recipes = [
    { id:'cookie', name:'Butter Cookie', emoji:'🍪', price:0, reward:8, steps:['ingredients','mix','bake','decorate'], ingredients:[['Flour','🌾'],['Butter','🧈'],['Sugar','🧂'],['Egg','🥚']], note:'A warm little classic.' },
    { id:'cupcake', name:'Berry Cupcake', emoji:'🧁', price:45, reward:13, steps:['ingredients','mix','bake','decorate'], ingredients:[['Flour','🌾'],['Milk','🥛'],['Berry','🍓'],['Egg','🥚']], note:'Soft, sweet, and berry cozy.' },
    { id:'bread', name:'Cat Loaf', emoji:'🍞', price:85, reward:18, steps:['ingredients','mix','knead','bake','decorate'], ingredients:[['Flour','🌾'],['Milk','🥛'],['Butter','🧈'],['Yeast','✨']], note:'A loaf shaped with love.' },
    { id:'roll', name:'Cinnamon Roll', emoji:'🥐', price:140, reward:25, steps:['ingredients','mix','knead','bake','decorate'], ingredients:[['Flour','🌾'],['Butter','🧈'],['Cinnamon','🤎'],['Sugar','🧂']], note:'Warm swirls for a quiet day.' },
    { id:'pie', name:'Strawberry Pie', emoji:'🥧', price:220, reward:34, steps:['ingredients','mix','press','bake','decorate'], ingredients:[['Flour','🌾'],['Butter','🧈'],['Berry','🍓'],['Sugar','🧂']], note:'A little celebration in a crust.' },
    { id:'cake', name:'Cloud Cake', emoji:'🎂', price:340, reward:48, steps:['ingredients','mix','bake','decorate'], ingredients:[['Flour','🌾'],['Milk','🥛'],['Cream','☁️'],['Berry','🍓']], note:'Fluffy enough to nap on.' }
  ];

  const cats = [
    { id:'mochi', name:'Mochi', color:'#d8aa78', favorite:'cookie' },
    { id:'bean', name:'Bean', color:'#8e6f65', favorite:'cupcake' },
    { id:'peaches', name:'Peaches', color:'#e7a47f', favorite:'pie' },
    { id:'olive', name:'Olive', color:'#a7aa83', favorite:'bread' },
    { id:'snowdrop', name:'Snowdrop', color:'#e8e5df', favorite:'cake' },
    { id:'miso', name:'Miso', color:'#bf8d5f', favorite:'roll' }
  ];

  const accessories = [
    { id:'none', name:'No accessory', emoji:'', image:'', price:0, desc:'Simple and comfy.' },
    { id:'chef', name:'Tiny Chef Hat', emoji:'👨‍🍳', image:'assets/accessories/chef.png', price:70, desc:'Official bakery business.' },
    { id:'bow', name:'Pink Bow', emoji:'🎀', image:'assets/accessories/bow.png', price:95, desc:'For very important baking.' },
    { id:'flower', name:'Daisy', emoji:'🌼', image:'assets/accessories/flower.png', price:125, desc:'Fresh from the windowsill.' },
    { id:'glasses', name:'Round Glasses', emoji:'🤓', image:'assets/accessories/glasses.png', price:180, desc:'Serious recipe research.' },
    { id:'crown', name:'Bakery Crown', emoji:'👑', image:'assets/accessories/crown.png', price:300, desc:'For the ruler of pastries.' }
  ];

  const defaultAccessoryPositions = {
    chef:{x:14,y:4,scale:1}, bow:{x:32,y:18,scale:1}, flower:{x:15,y:16,scale:1}, glasses:{x:13,y:24,scale:1}, crown:{x:24,y:16,scale:1}
  };
  let accessoryPositions = {...defaultAccessoryPositions};
  const defaultBakerPawPositions = {
    left:{x:-6,y:28}, right:{x:54,y:28}
  };
  let bakerPawPositions = {...defaultBakerPawPositions};
  async function loadAccessoryPositions(){
    try{
      const response=await fetch('accessory_positions.json',{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      for(const id of Object.keys(defaultAccessoryPositions)){
        const pos=data?.[id];
        if(pos && Number.isFinite(Number(pos.x)) && Number.isFinite(Number(pos.y))){
          const scale=Number(pos.scale);
          accessoryPositions[id]={x:Number(pos.x),y:Number(pos.y),scale:Number.isFinite(scale)&&scale>0?scale:1};
        }
      }
      renderBakery();
    }catch(err){
      console.warn('Using built-in accessory positions; accessory_positions.json could not be loaded.',err);
    }
  }
  async function loadBakerPawPositions(){
    try{
      const response=await fetch('baker_paw_positions.json',{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      for(const id of Object.keys(defaultBakerPawPositions)){
        const pos=data?.[id];
        if(pos && Number.isFinite(Number(pos.x)) && Number.isFinite(Number(pos.y))){
          bakerPawPositions[id]={x:Number(pos.x),y:Number(pos.y)};
        }
      }
      renderBakery();
    }catch(err){
      console.warn('Using built-in baker paw positions; baker_paw_positions.json could not be loaded.',err);
    }
  }

  const decor = [
    { id:'classic', name:'Sunny Bakery', emoji:'☀️', price:0, desc:'Warm cream walls and a wooden counter.' },
    { id:'strawberry', name:'Strawberry Room', emoji:'🍓', price:110, desc:'Soft pink walls and berry colors.' },
    { id:'mint', name:'Mint Kitchen', emoji:'🌿', price:160, desc:'A cool, leafy little bake shop.' },
    { id:'night', name:'Moonlight Bakery', emoji:'🌙', price:260, desc:'Quiet evening colors for late baking.' }
  ];


  const equipmentLevels = [
    { level:1, name:'Starter Kitchen', price:0, multiplier:1.00, desc:'Your trusty starter tools.' },
    { level:2, name:'Sturdy Tools', price:120, multiplier:1.15, desc:'Better pans and utensils.' },
    { level:3, name:'Cozy Mixer', price:300, multiplier:1.30, desc:'A dependable mixer and nicer bakeware.' },
    { level:4, name:'Bakery Oven', price:650, multiplier:1.50, desc:'Even heat and bakery-grade equipment.' },
    { level:5, name:'Dream Kitchen', price:1200, multiplier:1.75, desc:'The coziest little professional kitchen.' }
  ];

  const ingredientGrades = [
    { id:'pantry', name:'Pantry Basics', emoji:'🥣', price:0, pack:5, payout:1.00, friendship:1, qualityBonus:0, desc:'Simple everyday ingredients. Pat Biscuit for a free basket.' },
    { id:'fresh', name:'Fresh Market', emoji:'🌾', price:12, pack:4, payout:1.12, friendship:1, qualityBonus:10, desc:'Fresh milk, butter and flour. A small step up.' },
    { id:'choice', name:"Baker's Choice", emoji:'🧈', price:28, pack:4, payout:1.30, friendship:2, qualityBonus:24, desc:'Reliable bakery-grade ingredients.' },
    { id:'clover', name:'Cream & Clover', emoji:'🍓', price:60, pack:4, payout:1.60, friendship:2, qualityBonus:38, desc:'Rich cream, fragrant fruit and very good butter.' },
    { id:'moonlit', name:'Moonlit Reserve', emoji:'✨', price:100, pack:4, payout:2.00, friendship:3, qualityBonus:50, desc:'Ridiculously fancy ingredients for special bakes.' }
  ];
  const bakeQualities = [
    { id:'homey', name:'Homey', min:0, multiplier:1.00 },
    { id:'cozy', name:'Cozy', min:65, multiplier:1.08 },
    { id:'fancy', name:'Fancy', min:82, multiplier:1.18 },
    { id:'purrfect', name:'Purrfect', min:94, multiplier:1.35 },
    { id:'cats-meow', name:"Cat's Meow", min:108, multiplier:1.65 }
  ];

  const slotSymbols = [
    { emoji:'🐾', weight:30, multiplier:2 },
    { emoji:'🍪', weight:24, multiplier:3 },
    { emoji:'🍓', weight:18, multiplier:4 },
    { emoji:'🧁', weight:12, multiplier:6 },
    { emoji:'🐟', weight:8, multiplier:10 },
    { emoji:'🐱', weight:5, multiplier:15 },
    { emoji:'👑', weight:1, multiplier:50 }
  ];
  const slotBets = [5,10,25];

  const fishingRods = [
    { level:1, name:'Twig Rod', price:0, maxTier:1 },
    { level:2, name:'Willow Rod', price:150, maxTier:2 },
    { level:3, name:'Lake Rod', price:400, maxTier:3 },
    { level:4, name:'Carbon Rod', price:850, maxTier:4 },
    { level:5, name:'Star Rod', price:1600, maxTier:5 }
  ];
  const fishingReels = [
    { level:1, name:'Tin Reel', price:0, multiplier:1.00, wait:2600 },
    { level:2, name:'Smooth Reel', price:120, multiplier:1.15, wait:2300 },
    { level:3, name:'Silver Reel', price:330, multiplier:1.35, wait:2000 },
    { level:4, name:'Quiet Reel', price:700, multiplier:1.60, wait:1700 },
    { level:5, name:'Golden Reel', price:1400, multiplier:2.00, wait:1400 }
  ];
  const fishTable = [
    { id:'minnow', name:'Pond Minnow', emoji:'🐟', value:8, weight:38, tier:0, minLb:0.10, maxLb:0.45 },
    { id:'bluegill', name:'Bluegill', emoji:'🐠', value:12, weight:28, tier:1, minLb:0.30, maxLb:1.25 },
    { id:'perch', name:'Sunny Perch', emoji:'🐟', value:18, weight:18, tier:1, minLb:0.55, maxLb:1.90 },
    { id:'bass', name:'Lake Bass', emoji:'🐟', value:28, weight:12, tier:2, minLb:1.50, maxLb:8.50 },
    { id:'trout', name:'Rainbow Trout', emoji:'🐟', value:45, weight:7, tier:3, minLb:1.25, maxLb:10.50 },
    { id:'koi', name:'Vacation Koi', emoji:'🐠', value:75, weight:3, tier:4, minLb:2.50, maxLb:16.00 },
    { id:'golden', name:'Golden Fish', emoji:'✨', value:150, weight:1, tier:5, minLb:5.00, maxLb:25.00 }
  ];


  const achievements = [
    {id:'first-batch',category:'Bakery',icon:'🍪',title:'First Batch',desc:'Bake your first treat.',goal:1,value:s=>s.totalBakes||0},
    {id:'bakers-dozen',category:'Bakery',icon:'🥐',title:"Baker's Dozen",desc:'Complete 13 bakes.',goal:13,value:s=>s.totalBakes||0},
    {id:'flour-power',category:'Bakery',icon:'🌾',title:'Flour Power',desc:'Complete 50 bakes.',goal:50,value:s=>s.totalBakes||0},
    {id:'century-sweets',category:'Bakery',icon:'🎂',title:'Century of Sweets',desc:'Complete 100 bakes.',goal:100,value:s=>s.totalBakes||0},
    {id:'recipe-curious',category:'Bakery',icon:'📖',title:'Recipe Curious',desc:'Unlock 3 recipes.',goal:3,value:s=>(s.unlockedRecipes||[]).length},
    {id:'full-menu',category:'Bakery',icon:'🧁',title:'Full Menu',desc:'Unlock every recipe.',goal:recipes.length,value:s=>(s.unlockedRecipes||[]).length},
    {id:'one-of-everything',category:'Bakery',icon:'🍰',title:'One of Everything',desc:'Bake every recipe at least once.',goal:recipes.length,value:s=>recipes.filter(r=>(s.bakes?.[r.id]||0)>0).length},
    {id:'cozy-result',category:'Bakery',icon:'☕',title:'Cozy Result',desc:'Make your first Cozy-quality bake.',goal:1,value:s=>s.qualityCounts?.cozy||0},
    {id:'fancy-paws',category:'Bakery',icon:'✨',title:'Fancy Paws',desc:'Make your first Fancy-quality bake.',goal:1,value:s=>s.qualityCounts?.fancy||0},
    {id:'purrfection',category:'Bakery',icon:'💖',title:'Purrfection',desc:'Make your first Purrfect bake.',goal:1,value:s=>s.qualityCounts?.purrfect||0},
    {id:'cats-meow',category:'Bakery',icon:'🌟',title:"The Cat's Meow",desc:"Make a Cat's Meow-quality bake.",goal:1,value:s=>s.qualityCounts?.['cats-meow']||0},
    {id:'ten-cats-meows',category:'Bakery',icon:'👑',title:'Meowster Baker',desc:"Make 10 Cat's Meow-quality bakes.",goal:10,value:s=>s.qualityCounts?.['cats-meow']||0},

    {id:'first-friend',category:'Friendship',icon:'♥',title:'First Bakery Friend',desc:'Become best bakery friends with one cat.',goal:1,value:s=>Object.values(s.friendships||{}).filter(v=>v>=5).length},
    {id:'three-friends',category:'Friendship',icon:'💕',title:'Popular Pastry Cat',desc:'Become best bakery friends with 3 cats.',goal:3,value:s=>Object.values(s.friendships||{}).filter(v=>v>=5).length},
    {id:'all-friends',category:'Friendship',icon:'🐾',title:'Everybody Knows Your Name',desc:'Become best bakery friends with every customer cat.',goal:cats.length,value:s=>Object.values(s.friendships||{}).filter(v=>v>=5).length},
    {id:'fifteen-hearts',category:'Friendship',icon:'💗',title:'A Lot of Love',desc:'Earn 15 total friendship hearts.',goal:15,value:s=>Object.values(s.friendships||{}).reduce((a,b)=>a+(Number(b)||0),0)},

    {id:'better-tools',category:'Shop',icon:'🧰',title:'Better Tools',desc:'Upgrade the bakery equipment once.',goal:2,value:s=>s.equipmentLevel||1},
    {id:'dream-kitchen',category:'Shop',icon:'⚙️',title:'Dream Kitchen',desc:'Reach Bakery Equipment Level 5.',goal:5,value:s=>s.equipmentLevel||1},
    {id:'interior-designer',category:'Shop',icon:'🪴',title:'Interior Designer',desc:'Own every bakery decor theme.',goal:decor.length,value:s=>(s.ownedDecor||[]).length},
    {id:'wardrobe-full',category:'Shop',icon:'🎀',title:'Full Wardrobe',desc:'Own every baker accessory.',goal:accessories.length,value:s=>(s.ownedAccessories||[]).length},
    {id:'pat-biscuit',category:'Shop',icon:'🐱',title:'Payment Accepted',desc:'Pat Biscuit for pantry basics.',goal:1,value:s=>s.clerkPats||0},
    {id:'biscuit-regular',category:'Shop',icon:'🥣',title:"Biscuit's Regular",desc:'Pat Biscuit 25 times.',goal:25,value:s=>s.clerkPats||0},
    {id:'biscuit-superfan',category:'Shop',icon:'🐈',title:"Biscuit's Biggest Fan",desc:'Pat Biscuit 100 times.',goal:100,value:s=>s.clerkPats||0},

    {id:'first-spin',category:'Slots',icon:'🎰',title:'Just One Spin',desc:'Play Lucky Cat Slots once.',goal:1,value:s=>s.slotSpins||0},
    {id:'slot-regular',category:'Slots',icon:'🍓',title:'Lucky Regular',desc:'Play 25 slot spins.',goal:25,value:s=>s.slotSpins||0},
    {id:'slot-century',category:'Slots',icon:'🐾',title:'One Hundred Spins',desc:'Play 100 slot spins.',goal:100,value:s=>s.slotSpins||0},
    {id:'first-slot-win',category:'Slots',icon:'✨',title:'Lucky Paw',desc:'Win more than your bet for the first time.',goal:1,value:s=>s.slotWins||0},
    {id:'ten-slot-wins',category:'Slots',icon:'🍀',title:'On a Roll',desc:'Win 10 times at the slots.',goal:10,value:s=>s.slotWins||0},
    {id:'twentyfive-slot-wins',category:'Slots',icon:'👑',title:'House Cat',desc:'Win 25 times at the slots.',goal:25,value:s=>s.slotWins||0},

    {id:'first-fish',category:'Fishing',icon:'🐟',title:'Gone Fishing',desc:'Catch your first fish.',goal:1,value:s=>s.fishCaught||0},
    {id:'fish-25',category:'Fishing',icon:'🎣',title:'Lake Regular',desc:'Catch 25 fish.',goal:25,value:s=>s.fishCaught||0},
    {id:'fish-100',category:'Fishing',icon:'🐠',title:'Master Angler',desc:'Catch 100 fish.',goal:100,value:s=>s.fishCaught||0},
    {id:'five-pounder',category:'Fishing',icon:'🏅',title:'That One Was This Big',desc:'Record a fish weighing at least 5 lb.',goal:5,value:s=>Math.max(0,...(s.fishRecords||[]).map(r=>Number(r.sizeLb)||0),Number(s.fishingLast?.sizeLb)||0)},
    {id:'ten-pounder',category:'Fishing',icon:'🏆',title:'Trophy Fish',desc:'Record a fish weighing at least 10 lb.',goal:10,value:s=>Math.max(0,...(s.fishRecords||[]).map(r=>Number(r.sizeLb)||0),Number(s.fishingLast?.sizeLb)||0)},
    {id:'twenty-pounder',category:'Fishing',icon:'🌊',title:'Lake Monster',desc:'Record a fish weighing at least 20 lb.',goal:20,value:s=>Math.max(0,...(s.fishRecords||[]).map(r=>Number(r.sizeLb)||0),Number(s.fishingLast?.sizeLb)||0)},
    {id:'star-rod',category:'Fishing',icon:'🎣',title:'Star Rod',desc:'Reach Rod Level 5.',goal:5,value:s=>s.fishingRodLevel||1},
    {id:'golden-reel',category:'Fishing',icon:'⚙️',title:'Golden Reel',desc:'Reach Reel Level 5.',goal:5,value:s=>s.fishingReelLevel||1},

    {id:'crumb-for-william',category:'William',icon:'🍞',title:'A Crumb for William',desc:'Give William something once.',goal:1,value:s=>s.williamItemsGiven||0},
    {id:'william-snacks',category:'William',icon:'🥖',title:'Crow Catering',desc:'Give William 25 items.',goal:25,value:s=>s.williamItemsGiven||0},
    {id:'first-shiny',category:'William',icon:'💎',title:'Crow Gift',desc:'Receive your first item from William.',goal:1,value:s=>s.williamItemsReceived||0},
    {id:'shiny-collection',category:'William',icon:'🔔',title:'Shiny Collection',desc:'Receive 25 items from William.',goal:25,value:s=>s.williamItemsReceived||0},
    {id:'first-dance',category:'William',icon:'🪩',title:'Birds of a Feather',desc:'Have one dance party with William.',goal:1,value:s=>s.williamDanceParties||0},
    {id:'dance-ten',category:'William',icon:'🎵',title:'Tiny Dance Club',desc:'Have 10 dance parties.',goal:10,value:s=>s.williamDanceParties||0},
    {id:'dance-25',category:'William',icon:'🎉',title:'Friday Night Caw',desc:'Have 25 dance parties.',goal:25,value:s=>s.williamDanceParties||0},
    {id:'stats-first',category:'William',icon:'📊',title:'Unexpected Statistics',desc:'Hear William mention statistics once.',goal:1,value:s=>s.williamStatisticsMentions||0},
    {id:'stats-ten',category:'William',icon:'📈',title:'Crow-Designed Experiment',desc:'Hear 10 statistical comments from William.',goal:10,value:s=>s.williamStatisticsMentions||0},
    {id:'stats-25',category:'William',icon:'🧪',title:'Standard Least Squawks',desc:'Hear 25 statistical comments from William.',goal:25,value:s=>s.williamStatisticsMentions||0},

    {id:'first-pet',category:'Relax',icon:'🐈',title:'Just One Pet',desc:'Start your first Relax petting session.',goal:1,value:s=>s.relaxPetSessions||0},
    {id:'pet-five-min',category:'Relax',icon:'💤',title:'Five Quiet Minutes',desc:'Spend 5 minutes actively petting.',goal:5*60*1000,value:s=>s.relaxPetTimeMs||0,format:'time'},
    {id:'pet-thirty-min',category:'Relax',icon:'🌙',title:'Half-Hour Purr',desc:'Spend 30 minutes actively petting.',goal:30*60*1000,value:s=>s.relaxPetTimeMs||0,format:'time'},
    {id:'pet-one-hour',category:'Relax',icon:'💗',title:'Professional Cat Petter',desc:'Spend 1 hour actively petting.',goal:60*60*1000,value:s=>s.relaxPetTimeMs||0,format:'time'},
    {id:'named-relax-cat',category:'Relax',icon:'✏️',title:'A Proper Name',desc:'Give the Relax cat a custom name.',goal:1,value:s=>(s.relaxCatName||'').trim()?1:0},

    {id:'try-everything',category:'Grand Tour',icon:'🌈',title:'A Little Bit of Everything',desc:'Bake, play slots, fish, pet a cat, and hang out with William.',goal:5,value:s=>[
      (s.totalBakes||0)>0,(s.slotSpins||0)>0,(s.fishCaught||0)>0,(s.relaxPetSessions||0)>0,((s.williamItemsGiven||0)+(s.williamItemsReceived||0)+(s.williamDanceParties||0)+(s.williamStatisticsMentions||0))>0
    ].filter(Boolean).length},
    {id:'cozy-completionist',category:'Grand Tour',icon:'🏡',title:'Cozy Completionist',desc:'Own all recipes, decor, accessories, and max the bakery equipment.',goal:4,value:s=>[
      (s.unlockedRecipes||[]).length>=recipes.length,(s.ownedDecor||[]).length>=decor.length,(s.ownedAccessories||[]).length>=accessories.length,(s.equipmentLevel||1)>=5
    ].filter(Boolean).length},
    {id:'bake-and-catch',category:'Grand Tour',icon:'🍪',title:'Bake & Bait',desc:'Complete 25 bakes and catch 25 fish.',goal:2,value:s=>[(s.totalBakes||0)>=25,(s.fishCaught||0)>=25].filter(Boolean).length}
  ];

  const toppings = ['🍓','✨','🌸','🍫','🫐','🤍'];
  // Keep this key stable: every release since v1 stored progress here.
  const saveKey = 'whiskersAndWhisksSaveV1';
  const safetyBackupKey = 'whiskersAndWhisksSaveBackupV134';
  const saveSchemaVersion = 2;
  const fresh = () => ({
    coins:35, unlockedRecipes:['cookie'], ownedAccessories:['none'], equippedAccessory:'none',
    ownedDecor:['classic'], equippedDecor:'classic', equipmentLevel:1, friendships:{}, bakes:{}, totalBakes:0,
    memories:[], sound:true, currentCat:'mochi', slotBet:5, slotSpins:0, slotWon:0, slotWins:0,
    slotLast:['🐾','🍪','🍓'], slotLastPayout:0, slotLastBet:5,
    bait:5, fishingRodLevel:1, fishingReelLevel:1, fishCaught:0,
    fishingLast:null, fishingEarned:0, fishRecords:[],
    williamItemsGiven:0, williamItemsReceived:0, williamDanceParties:0, williamStatisticsMentions:0,
    relaxCatName:'', playerCatColor:'#c58f62', playerCatPreset:'solid', relaxPetSessions:0, relaxPetTimeMs:0,
    unlockedAchievements:{},
    ingredientStock:{pantry:5,fresh:0,choice:0,clover:0,moonlit:0}, lastIngredientGrade:'pantry',
    qualityCounts:{homey:0,cozy:0,fancy:0,purrfect:0,'cats-meow':0}, clerkPats:0
  });

  let state = load();
  let selectedRecipe = null;
  let selectedIngredientGrade = ingredientGrades.find(g=>g.id===state.lastIngredientGrade) || ingredientGrades[0];
  let currentBakeQuality = bakeQualities[0];
  let currentCat = cats.find(c => c.id === state.currentCat) || cats[0];
  let addedIngredients = new Set();
  let mixValue = 0;
  let lastMixPoint = null;
  let ovenValue = 0;
  let ovenTimer = null;
  let kneadValue = 0;
  let kneadTap = 0;
  let pressValue = 0;
  let chosenToppings = [];
  let toastTimer = null;
  let audioCtx = null;
  let slotSpinning = false;
  let slotTimers = [];
  let fishingState = 'idle';
  let fishingTimer = null;
  let pendingCatch = null;
  let relaxPetting = false;
  let relaxLastPoint = null;
  let relaxStrokeCount = 0;
  let relaxPurr = null;
  let relaxPetStartedAt = null;
  let crowDanceTimer = null;
  let crowDanceBeatTimer = null;
  let crowDanceEmojiTimer = null;

  function validSaveData(candidate){
    return candidate && typeof candidate==='object' && !Array.isArray(candidate) &&
      ['coins','unlockedRecipes','totalBakes','ownedDecor','friendships','memories','slotSpins','fishCaught','relaxCatName'].some(key=>Object.prototype.hasOwnProperty.call(candidate,key));
  }
  function nonnegativeNumber(value, fallback=0){
    const numeric=Number(value);
    return Number.isFinite(numeric) ? Math.max(0,numeric) : fallback;
  }
  function normalizeSave(candidate){
    const defaults=fresh();
    if(!validSaveData(candidate))return defaults;
    // Preserve unknown keys for forward compatibility while validating those required by this game.
    const next=Object.assign({},defaults,candidate);
    for(const key of ['coins','totalBakes','equipmentLevel','slotBet','slotSpins','slotWon','slotWins','slotLastPayout','slotLastBet','bait','fishingRodLevel','fishingReelLevel','fishCaught','fishingEarned','williamItemsGiven','williamItemsReceived','williamDanceParties','williamStatisticsMentions','relaxPetSessions','relaxPetTimeMs','clerkPats']){
      next[key]=nonnegativeNumber(candidate[key],defaults[key]);
    }
    next.coins=Math.floor(next.coins);
    next.equipmentLevel=Math.max(1,Math.min(equipmentLevels.length,Math.floor(next.equipmentLevel)));
    next.fishingRodLevel=Math.max(1,Math.min(fishingRods.length,Math.floor(next.fishingRodLevel)));
    next.fishingReelLevel=Math.max(1,Math.min(fishingReels.length,Math.floor(next.fishingReelLevel)));
    next.sound=typeof candidate.sound==='boolean'?candidate.sound:defaults.sound;
    next.relaxCatName=typeof candidate.relaxCatName==='string'?candidate.relaxCatName.slice(0,24):'';
    next.playerCatColor=typeof candidate.playerCatColor==='string'?candidate.playerCatColor:defaults.playerCatColor;
    next.playerCatPreset=['solid','silver-tabby','tuxedo','cow'].includes(candidate.playerCatPreset)?candidate.playerCatPreset:'solid';
    next.unlockedRecipes=Array.isArray(candidate.unlockedRecipes)?[...new Set(['cookie',...candidate.unlockedRecipes.filter(x=>typeof x==='string'&&x.length<=64)])]:defaults.unlockedRecipes.slice();
    next.ownedAccessories=Array.isArray(candidate.ownedAccessories)?[...new Set(['none',...candidate.ownedAccessories.filter(x=>typeof x==='string'&&x.length<=64)])]:defaults.ownedAccessories.slice();
    next.ownedDecor=Array.isArray(candidate.ownedDecor)?[...new Set(['classic',...candidate.ownedDecor.filter(x=>typeof x==='string'&&x.length<=64)])]:defaults.ownedDecor.slice();
    if(!next.ownedAccessories.includes(next.equippedAccessory))next.equippedAccessory='none';
    if(!next.ownedDecor.includes(next.equippedDecor))next.equippedDecor='classic';
    next.currentCat=cats.some(c=>c.id===candidate.currentCat)?candidate.currentCat:defaults.currentCat;
    const dict=(source,base)=>source&&typeof source==='object'&&!Array.isArray(source)?Object.assign({},base,source):Object.assign({},base);
    next.ingredientStock=dict(candidate.ingredientStock,defaults.ingredientStock);
    next.qualityCounts=dict(candidate.qualityCounts,defaults.qualityCounts);
    next.friendships=dict(candidate.friendships,defaults.friendships);
    next.bakes=dict(candidate.bakes,defaults.bakes);
    next.unlockedAchievements=dict(candidate.unlockedAchievements,defaults.unlockedAchievements);
    for(const key of Object.keys(defaults.ingredientStock))next.ingredientStock[key]=Math.floor(nonnegativeNumber(next.ingredientStock[key],defaults.ingredientStock[key]));
    for(const key of Object.keys(defaults.qualityCounts))next.qualityCounts[key]=Math.floor(nonnegativeNumber(next.qualityCounts[key],0));
    for(const key of Object.keys(next.friendships))next.friendships[key]=Math.max(0,Math.min(5,nonnegativeNumber(next.friendships[key],0)));
    for(const key of Object.keys(next.bakes))next.bakes[key]=Math.floor(nonnegativeNumber(next.bakes[key],0));
    next.memories=Array.isArray(candidate.memories)?candidate.memories.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).slice(0,200).map(x=>Object.assign({},x,{toppings:Array.isArray(x.toppings)?x.toppings.filter(v=>typeof v==='string').slice(0,12):[]})):[];
    next.fishRecords=Array.isArray(candidate.fishRecords)?candidate.fishRecords.filter(x=>x&&typeof x==='object'&&Number.isFinite(Number(x.sizeLb))).slice(0,3):[];
    next.fishingLast=candidate.fishingLast&&typeof candidate.fishingLast==='object'&&!Array.isArray(candidate.fishingLast)?candidate.fishingLast:null;
    next.slotLast=Array.isArray(candidate.slotLast)&&candidate.slotLast.length===3?candidate.slotLast:defaults.slotLast.slice();
    next.lastIngredientGrade=ingredientGrades.some(g=>g.id===candidate.lastIngredientGrade)?candidate.lastIngredientGrade:defaults.lastIngredientGrade;
    next.saveSchemaVersion=saveSchemaVersion;
    return next;
  }
  function writeSafetyBackup(raw){
    if(typeof raw!=='string'||raw.length===0)return;
    try{localStorage.setItem(safetyBackupKey,raw);}catch{}
  }
  function load(){
    const raw=localStorage.getItem(saveKey);
    if(!raw)return fresh();
    try{
      const candidate=JSON.parse(raw);
      if(!validSaveData(candidate)){writeSafetyBackup(raw);return fresh();}
      if(candidate.saveSchemaVersion!==saveSchemaVersion)writeSafetyBackup(raw);
      return normalizeSave(candidate);
    }catch{
      writeSafetyBackup(raw);
      return fresh();
    }
  }
  function achievementProgress(achievement){
    const value=Math.max(0,Number(achievement.value(state))||0);
    const goal=Math.max(1,Number(achievement.goal)||1);
    return {value,goal,ratio:clamp(value/goal,0,1),unlocked:value>=goal};
  }
  function evaluateAchievements(showNotice=true){
    state.unlockedAchievements=state.unlockedAchievements&&typeof state.unlockedAchievements==='object'?state.unlockedAchievements:{};
    const newly=[];
    achievements.forEach(achievement=>{
      const progress=achievementProgress(achievement);
      if(progress.unlocked&&!state.unlockedAchievements[achievement.id]){
        state.unlockedAchievements[achievement.id]=Date.now();
        newly.push(achievement);
      }
    });
    if(showNotice&&newly.length){
      setTimeout(()=>{
        ding('heart');
        toast(newly.length===1?`Achievement: ${newly[0].title}`:`${newly.length} achievements unlocked!`);
      },0);
    }
    return newly;
  }
  function save(){
    const newly=evaluateAchievements(false);
    try{localStorage.setItem(saveKey, JSON.stringify(state));}catch{toast('Browser storage is full — export your save');}
    updateAll();
    if(newly.length)setTimeout(()=>{ding('heart');toast(newly.length===1?`Achievement: ${newly[0].title}`:`${newly.length} achievements unlocked!`);},0);
  }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function formatCoins(n){ return Math.floor(n).toLocaleString(); }
  function equipmentInfo(){ return equipmentLevels.find(e=>e.level===Number(state.equipmentLevel)) || equipmentLevels[0]; }
  function equipmentMultiplier(){ return equipmentInfo().multiplier; }
  function equipmentBonusPercent(){ return Math.round((equipmentMultiplier()-1)*100); }
  function baseRecipePayout(recipe){ return Math.round(recipe.reward*equipmentMultiplier()); }
  function ingredientGrade(id=state.lastIngredientGrade){ return ingredientGrades.find(g=>g.id===id) || ingredientGrades[0]; }
  function ingredientStock(id){ return Math.max(0,Number(state.ingredientStock?.[id]||0)); }
  function rollBakeQuality(grade){
    const score=Math.random()*100+grade.qualityBonus;
    let quality=bakeQualities[0];
    for(const q of bakeQualities) if(score>=q.min) quality=q;
    return quality;
  }
  function getAudioContext(){
    try{
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if(!AudioContextClass)return null;
      audioCtx=audioCtx||new AudioContextClass();
      return audioCtx;
    }catch{return null;}
  }
  function unlockAudio(){
    const ctx=getAudioContext();
    if(!ctx)return;
    if(ctx.state==='suspended'){
      try{
        const resumed=ctx.resume();
        if(resumed&&typeof resumed.then==='function'){
          resumed.then(()=>{
            try{
              const buffer=ctx.createBuffer(1,1,22050);
              const source=ctx.createBufferSource();
              source.buffer=buffer; source.connect(ctx.destination); source.start(0);
            }catch{}
          }).catch(()=>{});
        }
      }catch{}
    }
  }
  function ding(type='soft'){
    if(!state.sound) return;
    const ctx=getAudioContext();
    if(!ctx)return;
    const play=()=>{
      try{
        const now=ctx.currentTime;
        const osc=ctx.createOscillator(); const gain=ctx.createGain();
        osc.type='sine'; osc.frequency.setValueAtTime(type==='coin'?660:type==='heart'?520:420,now);
        if(type==='coin')osc.frequency.exponentialRampToValueAtTime(880,now+.12);
        if(type==='heart')osc.frequency.exponentialRampToValueAtTime(650,now+.16);
        gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.075,now+.015); gain.gain.exponentialRampToValueAtTime(.0001,now+.22);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now+.24);
      }catch{}
    };
    if(ctx.state==='suspended'){
      try{ctx.resume().then(play).catch(()=>{});}catch{}
    }else play();
  }
  // iOS Safari/WebKit requires Web Audio to be resumed from a real user gesture.
  // Keep these listeners active because iOS may suspend the context again after app switching.
  document.addEventListener('pointerdown',unlockAudio,{capture:true,passive:true});
  document.addEventListener('touchend',unlockAudio,{capture:true,passive:true});
  document.addEventListener('keydown',unlockAudio,{capture:true});

  function toast(msg){
    const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>el.classList.remove('show'),1500);
  }

  function playerCatColor(){
    const value=String(state.playerCatColor||'').trim();
    return /^#[0-9a-f]{6}$/i.test(value)?value:'#c58f62';
  }
  function playerCatPreset(){
    const value=String(state.playerCatPreset||'solid').trim();
    return ['solid','silver-tabby','tuxedo','cow'].includes(value)?value:'solid';
  }
  function playerCatLook(){
    const preset=playerCatPreset();
    if(preset==='silver-tabby') return {color:'#bcc3ca', preset};
    if(preset==='tuxedo') return {color:'#2f3137', preset};
    if(preset==='cow') return {color:'#f7f4ef', preset};
    return {color:playerCatColor(), preset:'solid'};
  }
  function applyLookToElement(el, look){
    if(!el) return;
    el.style.setProperty('--cat', look.color);
    if(look.preset && look.preset!=='solid') el.dataset.look=look.preset;
    else delete el.dataset.look;
  }
  function applyPlayerCatColor(){
    const look=playerCatLook();
    const app=$('#app'); if(app)app.style.setProperty('--baker-cat',look.color);
    document.documentElement.style.setProperty('--baker-cat',look.color);
  }
  function updateAll(){
    ['#coin-count','#coin-count-bake','#coin-count-shop','#coin-count-slots','#coin-count-vacation'].forEach(id=>{ const e=$(id); if(e)e.textContent=formatCoins(state.coins); });
    $('#sound-btn').textContent=state.sound?'♪':'♩';
    $('#sound-btn').setAttribute('aria-pressed',String(state.sound));
    currentCat=cats.find(c=>c.id===state.currentCat) || currentCat || cats[0];
    applyPlayerCatColor();
    const active=$('.screen.active')?.id;
    $$('.nav-btn').forEach(btn=>{const selected=btn.dataset.screen===active;btn.classList.toggle('active',selected);if(selected)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
    if(active==='bakery-screen'){renderBakery();renderHomeDashboard();}
    if(active==='shop-screen')renderShop();
    if(active==='slots-screen')renderSlots();
    if(active==='vacation-screen')renderVacation();
    if(active==='relax-screen')renderRelax();
    if(active==='crow-screen')renderCrow();
    if(active==='book-screen')renderBook();
  }
  function closestAchievement(){
    return achievements.filter(a=>!state.unlockedAchievements?.[a.id]).map(a=>({achievement:a,progress:achievementProgress(a)}))
      .sort((a,b)=>b.progress.ratio-a.progress.ratio||a.progress.goal-b.progress.goal)[0]||null;
  }
  function renderHomeDashboard(){
    const name=(state.relaxCatName||'').trim() || 'Your baker';
    $('#home-cat-name').textContent=`${name}'s cozy bakery`;
    $('#home-bakery-subtitle').textContent=`${equipmentInfo().name} · ${state.unlockedRecipes.length} recipes ready`;
    $('#home-bakes').textContent=formatCoins(state.totalBakes);
    $('#home-friends').textContent=Object.values(state.friendships).filter(x=>x>=5).length;
    $('#home-badges').textContent=achievements.filter(a=>state.unlockedAchievements?.[a.id]).length;
    const next=closestAchievement();
    $('#home-next-title').textContent=next?next.achievement.title:'Every badge unlocked!';
    $('#home-next-description').textContent=next?next.achievement.desc:'You have done it all. Enjoy your bakery!';
    $('#home-next-progress').style.width=`${next?Math.round(next.progress.ratio*100):100}%`;
  }

  function setCatVisual(el, cat){ if(el) el.style.setProperty('--cat',cat.color); }
  function renderBakery(){
    $('#customer-name').textContent=currentCat.name;
    const fav=recipes.find(r=>r.id===currentCat.favorite);
    $('#customer-wish').textContent=(fav && state.unlockedRecipes.includes(fav.id)) ? `would love ${(/^[aeiou]/i.test(fav.name)?'an ':'a ')+fav.name.toLowerCase()}` : 'is happy with anything warm';
    setCatVisual($('#customer-cat'),currentCat);
    const playerLook=playerCatLook();
    applyLookToElement($('#baker-cat'),playerLook);
    const bakerWrap=$('.baker-wrap'); if(bakerWrap){ if(playerLook.preset!=='solid') bakerWrap.dataset.look=playerLook.preset; else delete bakerWrap.dataset.look; bakerWrap.style.setProperty('--cat',playerLook.color); }
    const hearts=clamp(state.friendships[currentCat.id]||0,0,5);
    $('#friendship-row').innerHTML=Array.from({length:5},(_,i)=>`<span class="${i<hearts?'filled':''}">♥</span>`).join('');
    const acc=accessories.find(a=>a.id===state.equippedAccessory)||accessories[0];
    const accEl=$('#baker-accessory');
    accEl.className='accessory';
    accEl.style.left='';
    accEl.style.top='';
    accEl.style.transform='';
    accEl.style.transformOrigin='';
    accEl.innerHTML='';
    if(acc.id!=='none'){
      accEl.classList.add(`accessory-${acc.id}`);
      const pos=accessoryPositions[acc.id] || defaultAccessoryPositions[acc.id];
      if(pos){
        accEl.style.left=`${pos.x}px`;
        accEl.style.top=`${pos.y}px`;
        accEl.style.transformOrigin='top left';
        accEl.style.transform=`scale(${Number.isFinite(Number(pos.scale))&&Number(pos.scale)>0?Number(pos.scale):1})`;
      }
      if(acc.image){
        const image=document.createElement('img');
        image.src=`${acc.image}?v=${editableAssetVersion}`;
        image.alt='';
        image.draggable=false;
        accEl.appendChild(image);
      }
    }
    for(const side of ['left','right']){
      const paw=$(`.baker-paw.${side}`);
      const pos=bakerPawPositions[side] || defaultBakerPawPositions[side];
      if(paw && pos){
        paw.style.left=`${pos.x}px`;
        paw.style.right='auto';
        paw.style.top=`${pos.y}px`;
      }
    }
    const scene=$('#bakery-scene'); scene.className='bakery-scene'; if(state.equippedDecor!=='classic')scene.classList.add(`theme-${state.equippedDecor}`);
    const last=state.memories[0]; $('#pastry-display').textContent=last ? (recipes.find(r=>r.id===last.recipe)?.emoji || '🍪') : '🍪';
  }

  function showScreen(id){
    if(id!=='relax-screen') endRelaxPetting();
    if(id!=='crow-screen') stopWilliamDance(false);
    $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
    window.scrollTo(0,0);
    const target=$(`#${id}`);if(target)target.scrollTop=0;
    updateAll();
  }
  $$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screen)));

  $('#sound-btn').addEventListener('click',()=>{state.sound=!state.sound;save(); if(state.sound)ding();});
  $('#bake-btn').addEventListener('click',startBake);
  $('#bake-back').addEventListener('click',()=>{ stopOven(); showScreen('bakery-screen'); });

  function startBake(){
    selectedRecipe=null; selectedIngredientGrade=ingredientGrade(); currentBakeQuality=bakeQualities[0]; chosenToppings=[]; addedIngredients.clear(); mixValue=0; ovenValue=0; kneadValue=0; pressValue=0;
    showScreen('bake-screen'); showStage('recipe-stage'); renderRecipes();
  }
  function showStage(id){ $$('.stage').forEach(s=>s.classList.toggle('active-stage',s.id===id)); window.scrollTo(0,0); }
  function setStepSubtitle(step){
    const steps=selectedRecipe?.steps || [];
    const index=steps.indexOf(step);
    $('#bake-subtitle').textContent=index>=0 ? `Step ${index+1} of ${steps.length}` : '';
  }
  function advanceStep(step, delay=0){
    const steps=selectedRecipe?.steps || [];
    const next=steps[steps.indexOf(step)+1];
    const preparers={mix:prepareMix,knead:prepareKnead,press:preparePress,bake:prepareOven,decorate:prepareDecorate};
    if(next && preparers[next]) setTimeout(preparers[next],delay);
  }
  function renderRecipes(){
    $('#bake-title').textContent='Bake something'; $('#bake-subtitle').textContent='Choose a recipe';
    $('#recipe-grid').innerHTML=recipes.map(r=>{
      const unlocked=state.unlockedRecipes.includes(r.id);
      return `<button class="recipe-card ${unlocked?'':'locked'}" data-recipe="${r.id}"><span class="emoji">${r.emoji}</span><strong>${r.name}</strong><small>${unlocked?`${baseRecipePayout(r)}+ coins`:`Unlock in shop · ${r.price}`}</small>${unlocked?'':'<span class="lock">🔒</span>'}</button>`;
    }).join('');
    $$('.recipe-card').forEach(btn=>btn.addEventListener('click',()=>{
      const r=recipes.find(x=>x.id===btn.dataset.recipe);
      if(!state.unlockedRecipes.includes(r.id)){ toast('That recipe is still tucked away'); return; }
      selectedRecipe=r; ding(); prepareSupplies();
    }));
  }
  function prepareSupplies(){
    $('#bake-title').textContent=selectedRecipe.name;
    $('#bake-subtitle').textContent='Choose ingredient quality';
    const summary=$('#supply-choice-summary');
    if(summary) summary.innerHTML=`<strong>${selectedRecipe.emoji} ${selectedRecipe.name}</strong><span>One basket is used per bake.</span>`;
    const grid=$('#supply-choice-grid');
    grid.innerHTML=ingredientGrades.map(g=>{
      const stock=ingredientStock(g.id);
      const disabled=stock<=0;
      return `<button class="supply-choice ${disabled?'empty':''}" data-grade="${g.id}" ${disabled?'disabled':''}>
        <span class="supply-choice-icon">${g.emoji}</span>
        <span class="supply-choice-copy"><strong>${g.name}</strong><small>${stock} bake${stock===1?'':'s'} left · Quality +${g.qualityBonus} · ×${g.payout.toFixed(2)} coins · ♥ +${g.friendship}</small></span>
      </button>`;
    }).join('');
    $$('.supply-choice',grid).forEach(btn=>btn.addEventListener('click',()=>{
      const grade=ingredientGrade(btn.dataset.grade);
      if(ingredientStock(grade.id)<=0){toast('That basket is empty');return;}
      selectedIngredientGrade=grade; state.lastIngredientGrade=grade.id; ding(); prepareIngredients();
    }));
    showStage('supplies-stage');
  }
  $('#pantry-shortcut').addEventListener('click',()=>{
    activeShopTab='pantry';
    $$('#shop-tabs .tab').forEach(t=>t.classList.toggle('active',t.dataset.tab==='pantry'));
    showScreen('shop-screen'); renderShop();
  });

  function prepareIngredients(){
    $('#bake-title').textContent=selectedRecipe.name; setStepSubtitle('ingredients');
    const ingredientHeading=$('#ingredient-stage .section-title p');
    if(ingredientHeading) ingredientHeading.textContent=`Using ${selectedIngredientGrade.name}. Tap each one into the bowl.`;
    addedIngredients.clear(); $('#ingredient-bowl').classList.remove('full');
    $('#ingredient-grid').innerHTML=selectedRecipe.ingredients.map(([name,emoji],i)=>`<button class="ingredient-btn" data-i="${i}"><span>${emoji}</span>${name}</button>`).join('');
    $$('.ingredient-btn').forEach(btn=>btn.addEventListener('click',()=>addIngredient(btn)));
    showStage('ingredient-stage');
  }
  function addIngredient(btn){
    const i=Number(btn.dataset.i); if(addedIngredients.has(i))return;
    addedIngredients.add(i); btn.classList.add('done');
    const ingredientStage=$('#ingredient-stage'); ingredientStage.classList.remove('paw-boop'); void ingredientStage.offsetWidth; ingredientStage.classList.add('paw-boop');
    const emoji=selectedRecipe.ingredients[i][1], pop=$('#ingredient-pop'); pop.textContent=emoji; pop.classList.remove('pop'); void pop.offsetWidth; pop.classList.add('pop'); ding();
    if(addedIngredients.size===selectedRecipe.ingredients.length){
      $('#ingredient-bowl').classList.add('full'); advanceStep('ingredients',650);
    }
  }
  function prepareMix(){
    mixValue=0; lastMixPoint=null; $('#mix-progress').style.width='0%'; setStepSubtitle('mix'); showStage('mix-stage');
  }
  const mixZone=$('#mix-zone');
  mixZone.addEventListener('pointerdown',e=>{mixZone.setPointerCapture(e.pointerId);lastMixPoint={x:e.clientX,y:e.clientY};});
  mixZone.addEventListener('pointermove',e=>{
    if(!lastMixPoint || mixValue>=100)return;
    const dx=e.clientX-lastMixPoint.x,dy=e.clientY-lastMixPoint.y,dist=Math.hypot(dx,dy); lastMixPoint={x:e.clientX,y:e.clientY};
    if(dist<2)return; mixValue=clamp(mixValue+dist*.055,0,100); $('#mix-progress').style.width=`${mixValue}%`;
    const rot=(mixValue*10)%360; $('#spoon').style.transform=`rotate(${Math.sin(rot*Math.PI/180)*24}deg)`; $('#mix-batter').style.transform=`scale(${1+Math.sin(rot*.07)*.018})`;
    if(mixValue>=100){ding('heart');advanceStep('mix',400);}
  });
  mixZone.addEventListener('pointerup',()=>lastMixPoint=null); mixZone.addEventListener('pointercancel',()=>lastMixPoint=null);

  function prepareKnead(){
    kneadValue=0; kneadTap=0; $('#knead-progress').style.width='0%'; $('#knead-marks').innerHTML=''; $('#knead-dough').className='knead-dough'; setStepSubtitle('knead'); showStage('knead-stage');
  }
  $('#knead-zone').addEventListener('click',e=>{
    if(kneadValue>=100)return;
    kneadTap++; kneadValue=clamp(kneadValue+10,0,100); $('#knead-progress').style.width=`${kneadValue}%`;
    const zone=$('#knead-zone'), rect=zone.getBoundingClientRect();
    const mark=document.createElement('span'); mark.className='knead-mark'; mark.style.left=`${clamp(e.clientX-rect.left,58,rect.width-58)}px`; mark.style.top=`${clamp(e.clientY-rect.top,72,rect.height-46)}px`; $('#knead-marks').appendChild(mark);
    if($('#knead-marks').children.length>9)$('#knead-marks').firstChild.remove();
    const side=kneadTap%2?'left':'right'; const paw=$(`#knead-zone .knead-paw.${side}`); paw.classList.remove('tap'); void paw.offsetWidth; paw.classList.add('tap');
    $('#knead-dough').classList.toggle('squish-a',kneadTap%2===1); $('#knead-dough').classList.toggle('squish-b',kneadTap%2===0); ding();
    if(kneadValue>=100){ding('heart');advanceStep('knead',420);}
  });

  function preparePress(){
    pressValue=0; $('#press-progress').style.width='0%'; $('#press-marks').innerHTML=''; setStepSubtitle('press'); showStage('press-stage');
  }
  $('#press-zone').addEventListener('click',e=>{
    if(pressValue>=100)return;
    pressValue=clamp(pressValue+12.5,0,100); $('#press-progress').style.width=`${pressValue}%`;
    const zone=$('#press-zone'), rect=zone.getBoundingClientRect();
    const mark=document.createElement('span'); mark.className='press-mark'; mark.style.left=`${clamp(e.clientX-rect.left,54,rect.width-54)}px`; mark.style.top=`${clamp(e.clientY-rect.top,54,rect.height-54)}px`; $('#press-marks').appendChild(mark);
    const paw=$('#press-zone .press-paw'); paw.style.left=`${clamp(e.clientX-rect.left-28,24,rect.width-80)}px`; paw.style.top=`${clamp(e.clientY-rect.top-44,20,rect.height-86)}px`; paw.classList.remove('tap'); void paw.offsetWidth; paw.classList.add('tap'); ding();
    if(pressValue>=100){ding('heart');advanceStep('press',420);}
  });

  function prepareOven(){
    ovenValue=0; $('#oven-progress').style.width='0%'; $('#oven-pastry').textContent=selectedRecipe.emoji; setStepSubtitle('bake'); showStage('oven-stage');
  }
  function startOven(){
    if(ovenTimer || ovenValue>=100)return; $('.oven').classList.add('baking'); $('#oven-stage').classList.add('baker-pressing');
    const started=performance.now(), initial=ovenValue;
    ovenTimer=setInterval(()=>{
      ovenValue=clamp(initial+(performance.now()-started)/22,0,100); $('#oven-progress').style.width=`${ovenValue}%`;
      if(ovenValue>=100){stopOven();ding('coin');advanceStep('bake',350);}
    },30);
  }
  function stopOven(){ if(ovenTimer){clearInterval(ovenTimer);ovenTimer=null;} const o=$('.oven');if(o)o.classList.remove('baking'); const s=$('#oven-stage');if(s)s.classList.remove('baker-pressing'); }
  const ovenHold=$('#oven-hold');
  ovenHold.addEventListener('pointerdown',e=>{
    e.preventDefault();
    try{ovenHold.setPointerCapture(e.pointerId);}catch{}
    startOven();
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>ovenHold.addEventListener(ev,e=>{e.preventDefault();stopOven();}));

  function prepareDecorate(){
    chosenToppings=[]; $('#decorations').innerHTML=''; $('#decor-pastry').textContent=selectedRecipe.emoji; $('#serve-name').textContent=currentCat.name; setStepSubtitle('decorate');
    $('#topping-grid').innerHTML=toppings.map((t,i)=>`<button class="topping-btn" data-i="${i}" aria-label="Add decoration">${t}</button>`).join('');
    $$('.topping-btn').forEach(btn=>btn.addEventListener('click',()=>addTopping(Number(btn.dataset.i))));
    showStage('decorate-stage');
  }
  function addTopping(i){
    const t=toppings[i]; chosenToppings.push(t); if(chosenToppings.length>14)chosenToppings.shift();
    const deco=document.createElement('span'); deco.className='decoration'; deco.textContent=t;
    const angle=Math.random()*Math.PI*2,rad=25+Math.random()*67; deco.style.left=`calc(50% + ${Math.cos(angle)*rad}px - 13px)`; deco.style.top=`calc(50% + ${Math.sin(angle)*rad*.58}px - 14px)`;
    $('#decorations').appendChild(deco); if($('#decorations').children.length>14)$('#decorations').firstChild.remove(); ding();
  }
  $('#serve-btn').addEventListener('click',serve);
  function serve(){
    const grade=selectedIngredientGrade || ingredientGrade();
    if(ingredientStock(grade.id)<=0){ toast('That ingredient basket is empty'); prepareSupplies(); return; }
    state.ingredientStock[grade.id]=ingredientStock(grade.id)-1;
    currentBakeQuality=rollBakeQuality(grade);
    const favorite=selectedRecipe.id===currentCat.favorite;
    const bonus=favorite?4:0, decorBonus=Math.min(3,Math.floor(chosenToppings.length/3));
    const rawReward=selectedRecipe.reward+bonus+decorBonus;
    const reward=Math.max(1,Math.round(rawReward*equipmentMultiplier()*grade.payout*currentBakeQuality.multiplier));
    const oldFriendship=clamp(state.friendships[currentCat.id]||0,0,5);
    const friendshipGain=Math.min(grade.friendship,5-oldFriendship);
    state.coins+=reward; state.totalBakes++; state.bakes[selectedRecipe.id]=(state.bakes[selectedRecipe.id]||0)+1;
    state.friendships[currentCat.id]=clamp(oldFriendship+friendshipGain,0,5);
    state.qualityCounts[currentBakeQuality.id]=(state.qualityCounts[currentBakeQuality.id]||0)+1;
    state.memories.unshift({recipe:selectedRecipe.id,cat:currentCat.id,toppings:chosenToppings.slice(0,4),when:Date.now(),quality:currentBakeQuality.id,ingredients:grade.id}); state.memories=state.memories.slice(0,18);
    $('#result-pastry').textContent=selectedRecipe.emoji; $('#result-title').textContent=`${currentCat.name} loved it!`;
    const qbadge=$('#quality-badge'); qbadge.textContent=currentBakeQuality.name; qbadge.className=`quality-badge quality-${currentBakeQuality.id}`;
    const favoriteText=favorite?`${selectedRecipe.name} is ${currentCat.name}'s favorite.`:selectedRecipe.note;
    $('#result-note').textContent=`${favoriteText} ${grade.name} made this a ${currentBakeQuality.name.toLowerCase()} bake.`;
    $('#reward-coins').textContent=`+${reward}`;
    $('#heart-reward').textContent=(state.friendships[currentCat.id]>=5)?(friendshipGain?`♥ best bakery friend · +${friendshipGain}`:'♥ best bakery friend'):`♥ friendship +${friendshipGain}`;
    setCatVisual($('#result-cat'),currentCat); save(); ding('coin'); showStage('result-stage');
  }
  $('#done-btn').addEventListener('click',()=>{
    const options=cats.filter(c=>c.id!==currentCat.id); currentCat=options[Math.floor(Math.random()*options.length)]; state.currentCat=currentCat.id; save(); showScreen('bakery-screen'); ding('heart');
  });

  let activeShopTab='recipes';
  $$('#shop-tabs .tab').forEach(tab=>tab.addEventListener('click',()=>{activeShopTab=tab.dataset.tab;$$('#shop-tabs .tab').forEach(t=>t.classList.toggle('active',t===tab));renderShop();}));
  function renderShop(){
    const list=$('#shop-list'); if(!list)return;
    if(activeShopTab==='pantry'){
      list.innerHTML=`
        <div class="pantry-clerk-card">
          <div class="pantry-clerk-copy"><strong>Biscuit's Pantry</strong><small>Pat Biscuit's head for ${ingredientGrades[0].pack} free Pantry Basics baskets.</small></div>
          <button class="clerk-cat" id="clerk-cat" aria-label="Pat Biscuit the shop cat"><span class="clerk-ear left"></span><span class="clerk-ear right"></span><span class="clerk-face">• ᴗ •</span></button>
          <div class="clerk-pat-count">Pats: ${state.clerkPats||0}</div>
        </div>
        ${ingredientGrades.map(g=>{
          const stock=ingredientStock(g.id);
          if(g.id==='pantry') return `<div class="shop-item pantry-item"><div class="shop-icon">${g.emoji}</div><div class="shop-text"><strong>${g.name}</strong><small>${g.desc} Stock: ${stock} bakes.</small></div><button class="shop-buy pantry-free" id="free-pantry-btn">Pat</button></div>`;
          return `<div class="shop-item pantry-item"><div class="shop-icon">${g.emoji}</div><div class="shop-text"><strong>${g.name}</strong><small>${g.desc} Quality +${g.qualityBonus} · +${Math.round((g.payout-1)*100)}% payout · ♥ ${g.friendship}. Stock: ${stock}.</small></div><button class="shop-buy" data-kind="ingredients" data-id="${g.id}">● ${g.price}<br><small>×${g.pack}</small></button></div>`;
        }).join('')}
        <div class="quality-guide">
          <strong>Bake quality</strong><small>Better ingredients push your bake toward rarer results. Quality adds another coin bonus.</small>
          <div class="quality-guide-row"><span class="quality-dot quality-homey">Homey</span><span class="quality-dot quality-cozy">Cozy</span><span class="quality-dot quality-fancy">Fancy</span><span class="quality-dot quality-purrfect">Purrfect</span><span class="quality-dot quality-cats-meow">Cat's Meow</span></div>
        </div>`;
      const pat=()=>{state.ingredientStock.pantry=ingredientStock('pantry')+ingredientGrades[0].pack;state.clerkPats=(state.clerkPats||0)+1;save();ding('heart');toast(`Biscuit gave you ${ingredientGrades[0].pack} basic baskets`);};
      $('#clerk-cat')?.addEventListener('click',pat); $('#free-pantry-btn')?.addEventListener('click',pat);
      $$('.shop-buy[data-kind="ingredients"]',list).forEach(btn=>btn.addEventListener('click',()=>buyOrEquip(btn.dataset.kind,btn.dataset.id)));
      return;
    }
    if(activeShopTab==='equipment'){
      const current=equipmentInfo();
      const next=equipmentLevels.find(e=>e.level===current.level+1);
      const bonus=equipmentBonusPercent();
      const rod=fishingRodInfo(), reel=fishingReelInfo();
      const nextRod=fishingRods.find(x=>x.level===rod.level+1), nextReel=fishingReels.find(x=>x.level===reel.level+1);
      list.innerHTML=`
        <div class="shop-item equipment-card current-equipment">
          <div class="shop-icon">⚙️</div>
          <div class="shop-text"><strong>Equipment Level ${current.level}</strong><small>${current.name} · ${bonus?`+${bonus}%`:'Base'} coin payout</small></div>
          <div class="equipment-multiplier">×${current.multiplier.toFixed(2)}</div>
        </div>
        ${next?`<div class="shop-item equipment-card upgrade-equipment">
          <div class="shop-icon">🧰</div>
          <div class="shop-text"><strong>Upgrade to Level ${next.level}</strong><small>${next.desc} Payout becomes +${Math.round((next.multiplier-1)*100)}%.</small></div>
          <button class="shop-buy" data-kind="equipment" data-id="${next.level}">● ${next.price}</button>
        </div>`:`<div class="shop-item equipment-card max-equipment"><div class="shop-icon">✨</div><div class="shop-text"><strong>Equipment maxed</strong><small>Your bakery earns the full +${bonus}% equipment bonus.</small></div><button class="shop-buy owned" disabled>Max</button></div>`}
        <div class="shop-section-label">Fishing Gear</div>
        <div class="shop-item equipment-card">
          <div class="shop-icon">🎣</div>
          <div class="shop-text"><strong>${rod.name} · Lv. ${rod.level}</strong><small>${rod.level<5?`Can find fish up to tier ${rod.maxTier}. Better rods unlock rarer catches.`:'Every fish in the lake is now within reach.'}</small></div>
          <button class="shop-buy ${nextRod?'':'owned'}" data-action="rod-upgrade" ${nextRod?'': 'disabled'}>${nextRod?`● ${nextRod.price}`:'Max'}</button>
        </div>
        <div class="shop-item equipment-card">
          <div class="shop-icon">🧵</div>
          <div class="shop-text"><strong>${reel.name} · Lv. ${reel.level}</strong><small>${reel.level<5?`Catch value ×${reel.multiplier.toFixed(2)}. Better reels also shorten the wait.`:`Catch value ×${reel.multiplier.toFixed(2)} with the smoothest reel.`}</small></div>
          <button class="shop-buy ${nextReel?'':'owned'}" data-action="reel-upgrade" ${nextReel?'': 'disabled'}>${nextReel?`● ${nextReel.price}`:'Max'}</button>
        </div>
        <div class="shop-item equipment-card">
          <div class="shop-icon">🪱</div>
          <div class="shop-text"><strong>Bait Supply</strong><small>You have ${state.bait||0} bait. Pick up more before your next lake day.</small></div>
          <div class="equipment-bait-actions">
            <button class="shop-buy compact" data-action="buy-bait" data-bait="1" data-price="6">+1 · 6</button>
            <button class="shop-buy compact" data-action="buy-bait" data-bait="5" data-price="25">+5 · 25</button>
            <button class="shop-buy compact" data-action="buy-bait" data-bait="20" data-price="80">+20 · 80</button>
          </div>
        </div>
      `;
      $$('.shop-buy[data-kind="equipment"]',list).forEach(btn=>btn.addEventListener('click',()=>buyOrEquip(btn.dataset.kind,btn.dataset.id)));
      $$('[data-action="rod-upgrade"]',list).forEach(btn=>btn.addEventListener('click',buyRodUpgrade));
      $$('[data-action="reel-upgrade"]',list).forEach(btn=>btn.addEventListener('click',buyReelUpgrade));
      $$('[data-action="buy-bait"]',list).forEach(btn=>btn.addEventListener('click',()=>buyBait(Number(btn.dataset.bait)||0, Number(btn.dataset.price)||0)));
      return;
    }
    let data=[];
    if(activeShopTab==='recipes') data=recipes.filter(r=>r.price>0).map(r=>({kind:'recipe',id:r.id,name:r.name,emoji:r.emoji,price:r.price,desc:`Earn ${baseRecipePayout(r)}+ coins with your current equipment.`,owned:state.unlockedRecipes.includes(r.id)}));
    if(activeShopTab==='accessories') data=accessories.map(a=>({kind:'accessory',...a,owned:state.ownedAccessories.includes(a.id),equipped:state.equippedAccessory===a.id}));
    if(activeShopTab==='decor') data=decor.map(d=>({kind:'decor',...d,owned:state.ownedDecor.includes(d.id),equipped:state.equippedDecor===d.id}));
    list.innerHTML=data.map(x=>{
      const label=x.equipped?'Equipped':x.owned?(x.kind==='recipe'?'Owned':'Use'):`● ${x.price}`;
      const icon=x.image?`<img src="${x.image}?v=${editableAssetVersion}" alt="" draggable="false">`:x.emoji;
      return `<div class="shop-item"><div class="shop-icon">${icon}</div><div class="shop-text"><strong>${x.name}</strong><small>${x.desc}</small></div><button class="shop-buy ${x.equipped?'equipped':x.owned?'owned':''}" data-kind="${x.kind}" data-id="${x.id}">${label}</button></div>`;
    }).join('');
    $$('.shop-buy',list).forEach(btn=>btn.addEventListener('click',()=>buyOrEquip(btn.dataset.kind,btn.dataset.id)));
  }
  function buyOrEquip(kind,id){
    let item,owned=false;
    if(kind==='equipment'){
      item=equipmentLevels.find(x=>x.level===Number(id));
      if(!item || item.level!==equipmentInfo().level+1){toast('Upgrade one level at a time');return;}
    }
    if(kind==='ingredients'){
      item=ingredientGrades.find(x=>x.id===id);
      if(!item || item.price<=0){toast('Pat Biscuit for the free ingredients');return;}
    }
    if(kind==='recipe'){item=recipes.find(x=>x.id===id);owned=state.unlockedRecipes.includes(id);if(owned){toast('Already in your recipe book');return;}}
    if(kind==='accessory'){item=accessories.find(x=>x.id===id);owned=state.ownedAccessories.includes(id);if(owned){state.equippedAccessory=id;save();ding();toast('Outfit updated');return;}}
    if(kind==='decor'){item=decor.find(x=>x.id===id);owned=state.ownedDecor.includes(id);if(owned){state.equippedDecor=id;save();ding();toast('Bakery redecorated');return;}}
    if(state.coins<item.price){toast('A few more bakes will do it');return;}
    state.coins-=item.price;
    if(kind==='ingredients')state.ingredientStock[id]=ingredientStock(id)+item.pack;
    if(kind==='recipe')state.unlockedRecipes.push(id);
    if(kind==='accessory'){state.ownedAccessories.push(id);state.equippedAccessory=id;}
    if(kind==='decor'){state.ownedDecor.push(id);state.equippedDecor=id;}
    if(kind==='equipment')state.equipmentLevel=item.level;
    save(); ding('coin');
    if(kind==='equipment')toast(`Equipment Level ${item.level} · +${Math.round((item.multiplier-1)*100)}% coins`);
    else if(kind==='ingredients')toast(`${item.name} ×${item.pack} added to the pantry`);
    else toast(kind==='recipe'?'New recipe unlocked!':'New cozy thing unlocked!');
  }

  function weightedSlotSymbol(){
    const total=slotSymbols.reduce((sum,s)=>sum+s.weight,0);
    let roll=Math.random()*total;
    for(const symbol of slotSymbols){
      roll-=symbol.weight;
      if(roll<0)return symbol.emoji;
    }
    return slotSymbols[0].emoji;
  }
  function randomSlotVisual(){ return slotSymbols[Math.floor(Math.random()*slotSymbols.length)].emoji; }
  function renderSlots(){
    const spin=$('#slot-spin');
    if(!spin)return;
    if(!slotBets.includes(Number(state.slotBet)))state.slotBet=5;
    $$('.slot-bet').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.bet)===Number(state.slotBet)));
    spin.textContent=`Spin for ${state.slotBet}`;
    spin.disabled=slotSpinning || state.coins<state.slotBet;
    const spinsMini=$('#slots-played-mini');if(spinsMini)spinsMini.textContent=formatCoins(state.slotSpins);
    const winsMini=$('#slots-won-mini');if(winsMini)winsMini.textContent=formatCoins(state.slotWins);
    if(!slotSpinning){
      const last=Array.isArray(state.slotLast)&&state.slotLast.length===3?state.slotLast:['🐾','🍪','🍓'];
      last.forEach((symbol,i)=>{const reel=$(`#slot-reel-${i+1}`);if(reel)reel.textContent=symbol;});
      const result=$('#slot-result');
      if(result){
        result.classList.remove('win');
        if(!state.slotSpins)result.textContent='Pick a bet and give it a spin.';
        else if(state.slotLastPayout>(state.slotLastBet||5)){result.textContent=`You won ${formatCoins(state.slotLastPayout)} coins!`;result.classList.add('win');}
        else if(state.slotLastPayout===(state.slotLastBet||5))result.textContent='Matching pair — your bet came back.';
        else result.textContent='No match this time. The house cat looks pleased.';
      }
    }
  }
  $$('.slot-bet').forEach(btn=>btn.addEventListener('click',()=>{
    if(slotSpinning)return;
    state.slotBet=Number(btn.dataset.bet);
    save();
    ding();
  }));
  $('#slot-spin')?.addEventListener('click',spinSlots);
  function spinSlots(){
    if(slotSpinning)return;
    const bet=Number(state.slotBet)||5;
    if(state.coins<bet){toast('Bake a little more first');return;}
    slotSpinning=true;
    state.coins-=bet;
    try{localStorage.setItem(saveKey,JSON.stringify(state));}catch{toast('Storage is full; back up your save');}
    const result=$('#slot-result');
    if(result){result.classList.remove('win');result.textContent='The lucky paws are spinning…';}
    const final=[weightedSlotSymbol(),weightedSlotSymbol(),weightedSlotSymbol()];
    slotTimers.forEach(t=>{clearInterval(t);clearTimeout(t);});slotTimers=[];
    [650,900,1150].forEach((stopAt,i)=>{
      const reel=$(`#slot-reel-${i+1}`);
      if(!reel)return;
      reel.classList.add('spinning');
      const interval=setInterval(()=>{reel.textContent=randomSlotVisual();},70+i*12);
      slotTimers.push(interval);
      const timeout=setTimeout(()=>{
        clearInterval(interval);
        reel.textContent=final[i];
        reel.classList.remove('spinning');
        ding();
        if(i===2)finishSlotSpin(final,bet);
      },stopAt);
      slotTimers.push(timeout);
    });
    updateAll();
  }
  function finishSlotSpin(final,bet){
    const counts={};final.forEach(s=>counts[s]=(counts[s]||0)+1);
    let payout=0;
    const triple=Object.entries(counts).find(([,count])=>count===3);
    const pair=Object.values(counts).some(count=>count===2);
    if(triple){
      const info=slotSymbols.find(s=>s.emoji===triple[0]);
      payout=bet*(info?.multiplier||2);
    }else if(pair)payout=bet;
    state.coins+=payout;
    state.slotSpins=(state.slotSpins||0)+1;
    state.slotWon=(state.slotWon||0)+payout;
    if(payout>bet)state.slotWins=(state.slotWins||0)+1;
    state.slotLast=final;
    state.slotLastPayout=payout;
    state.slotLastBet=bet;
    slotSpinning=false;
    slotTimers=[];
    save();
    if(payout>bet)ding('coin');
  }

  function fishingRodInfo(){ return fishingRods.find(x=>x.level===Number(state.fishingRodLevel)) || fishingRods[0]; }
  function fishingReelInfo(){ return fishingReels.find(x=>x.level===Number(state.fishingReelLevel)) || fishingReels[0]; }
  function rollFishSize(fish){
    const min=Number(fish.minLb)||0.1, max=Math.max(min,Number(fish.maxLb)||min);
    return Math.round((min+Math.random()*(max-min))*100)/100;
  }
  function formatFishSize(lb){
    const n=Number(lb)||0;
    return n<1?`${Math.max(1,Math.round(n*16))} oz`:`${n.toFixed(2)} lb`;
  }
  function recordFish(caught,sizeLb){
    const entry={id:caught.id,name:caught.name,emoji:caught.emoji,sizeLb:Number(sizeLb),when:Date.now()};
    const records=Array.isArray(state.fishRecords)?state.fishRecords.slice():[];
    records.push(entry);
    records.sort((a,b)=>(Number(b.sizeLb)||0)-(Number(a.sizeLb)||0));
    const placed=records.indexOf(entry);
    state.fishRecords=records.slice(0,3);
    return placed>=0&&placed<3?placed+1:0;
  }
  function rollFish(){
    const maxTier=fishingRodInfo().maxTier;
    const pool=fishTable.filter(f=>f.tier<=maxTier);
    const total=pool.reduce((sum,f)=>sum+f.weight,0);
    let roll=Math.random()*total;
    for(const fish of pool){roll-=fish.weight;if(roll<0)return fish;}
    return pool[0];
  }
  function renderVacation(){
    const bait=$('#bait-count');
    if(!bait)return;
    applyLookToElement($('.fishing-cat'),playerCatLook());
    const rod=fishingRodInfo(), reel=fishingReelInfo();
    bait.textContent=state.bait||0;
    const rodLevelEl=$('#rod-level'), reelLevelEl=$('#reel-level');
    if(rodLevelEl)rodLevelEl.textContent=`Lv. ${rod.level}`;
    if(reelLevelEl)reelLevelEl.textContent=`Lv. ${reel.level}`;
    const action=$('#fishing-action'), message=$('#fishing-message'), scene=$('#lake-scene');
    scene.classList.toggle('line-out',fishingState==='waiting'||fishingState==='ready');
    scene.classList.toggle('fish-biting',fishingState==='ready');
    if(fishingState==='waiting'){
      action.textContent='Waiting for a bite…'; action.disabled=true;
      message.textContent='The bobber drifts quietly on the water.';
    }else if(fishingState==='ready'){
      action.textContent='Reel it in!'; action.disabled=false;
      message.textContent='A little tug! Something has the bait.';
    }else{
      action.textContent='Cast line · 1 bait'; action.disabled=(state.bait||0)<1;
      message.textContent=(state.bait||0)>0?'The lake is calm. Cast whenever you feel like it.':'Out of bait. The tackle shop has more below.';
    }
    const last=state.fishingLast;
    if(last){
      $('#last-catch-icon').textContent=last.emoji||'🐟';
      $('#last-catch-name').textContent=last.name||'Fish';
      const sizeNote=Number(last.sizeLb)>0?` · ${formatFishSize(last.sizeLb)}`:'';
      $('#last-catch-note').textContent=`Last catch${sizeNote} · +${formatCoins(last.payout||0)} coins · ${formatCoins(state.fishCaught||0)} caught total`;
    }else{
      $('#last-catch-icon').textContent='🐟'; $('#last-catch-name').textContent='No catches yet'; $('#last-catch-note').textContent='There is plenty of time.';
    }
    const board=$('#fish-records');
    if(board){
      const records=Array.isArray(state.fishRecords)?state.fishRecords.slice(0,3):[];
      board.innerHTML=Array.from({length:3},(_,i)=>{
        const r=records[i];
        if(!r)return `<div class="fish-record empty"><span class="record-rank">${i+1}</span><span class="record-fish">—</span><div><strong>Waiting for a catch</strong><small>No record yet</small></div></div>`;
        return `<div class="fish-record"><span class="record-rank">${i+1}</span><span class="record-fish">${r.emoji||'🐟'}</span><div><strong>${r.name||'Fish'}</strong><small>${formatFishSize(r.sizeLb)}</small></div></div>`;
      }).join('');
    }
  }
  $('#fishing-action')?.addEventListener('click',()=>{
    if(fishingState==='ready'){reelFishingCatch();return;}
    if(fishingState!=='idle')return;
    if((state.bait||0)<1){toast('Pick up some bait first');return;}
    state.bait=Math.max(0,(state.bait||0)-1);
    localStorage.setItem(saveKey,JSON.stringify(state));
    fishingState='waiting'; pendingCatch=null; renderVacation(); ding();
    const reel=fishingReelInfo();
    fishingTimer=setTimeout(()=>{
      pendingCatch=rollFish(); fishingState='ready'; fishingTimer=null; renderVacation(); ding('heart');
    },reel.wait);
  });
  function reelFishingCatch(){
    if(fishingState!=='ready'||!pendingCatch)return;
    const reel=fishingReelInfo();
    const payout=Math.max(1,Math.round(pendingCatch.value*reel.multiplier));
    const caught=pendingCatch;
    const sizeLb=rollFishSize(caught);
    state.coins+=payout; state.fishCaught=(state.fishCaught||0)+1; state.fishingEarned=(state.fishingEarned||0)+payout;
    state.fishingLast={id:caught.id,name:caught.name,emoji:caught.emoji,payout,sizeLb,when:Date.now()};
    const recordPlace=recordFish(caught,sizeLb);
    pendingCatch=null; fishingState='idle';
    save(); ding(recordPlace===1?'heart':'coin');
    toast(recordPlace?`#${recordPlace} lake record · ${formatFishSize(sizeLb)}`:`${caught.name} · ${formatFishSize(sizeLb)} · +${formatCoins(payout)}`);
  }
  function buyRodUpgrade(){
    const current=fishingRodInfo(), next=fishingRods.find(x=>x.level===current.level+1);
    if(!next)return;
    if(state.coins<next.price){toast('A few more coins will do it');return;}
    state.coins-=next.price; state.fishingRodLevel=next.level; save(); ding('coin'); toast(`${next.name} equipped`);
  }
  function buyReelUpgrade(){
    const current=fishingReelInfo(), next=fishingReels.find(x=>x.level===current.level+1);
    if(!next)return;
    if(state.coins<next.price){toast('A few more coins will do it');return;}
    state.coins-=next.price; state.fishingReelLevel=next.level; save(); ding('coin'); toast(`${next.name} equipped`);
  }
  function buyBait(amount, price){
    if(state.coins<price){toast('Not quite enough coins');return;}
    state.coins-=price; state.bait=(state.bait||0)+amount; save(); ding('coin'); toast(`+${amount} bait`);
  }

  function renderRelax(){
    const catEl=$('#relax-cat');
    if(!catEl)return;
    applyLookToElement(catEl,playerCatLook());
    const room=$('.relax-room');
    if(room){
      room.className='relax-room';
      if(state.equippedDecor!=='classic')room.classList.add(`theme-${state.equippedDecor}`);
    }
    const relaxName=(state.relaxCatName||'').trim() || currentCat.name;
    const name=$('#relax-cat-name'); if(name)name.textContent=`${relaxName} is relaxing.`;
    const nameInput=$('#relax-name-input');
    if(nameInput && document.activeElement!==nameInput)nameInput.value=state.relaxCatName||'';
    const color=playerCatColor();
    const preset=playerCatPreset();
    const colorInput=$('#fur-color-input'); if(colorInput && document.activeElement!==colorInput)colorInput.value=color;
    $$('.fur-swatch[data-fur]').forEach(btn=>btn.classList.toggle('active',preset==='solid' && String(btn.dataset.fur).toLowerCase()===color.toLowerCase()));
    $$('.fur-swatch[data-preset]').forEach(btn=>btn.classList.toggle('active',String(btn.dataset.preset)===preset));
    const presetColors=$$('.fur-swatch[data-fur]').map(btn=>String(btn.dataset.fur).toLowerCase());
    const custom=$('.fur-custom'); if(custom)custom.classList.toggle('active',preset==='solid' && !presetColors.includes(color.toLowerCase()));
    const petsMini=$('#relax-pets-mini');if(petsMini)petsMini.textContent=formatCoins(state.relaxPetSessions);
    const relaxTimeMini=$('#relax-time-mini');if(relaxTimeMini)relaxTimeMini.textContent=formatRelaxTime(state.relaxPetTimeMs);
    const sound=$('#relax-sound-btn'); if(sound)sound.textContent=state.sound?'♪':'♩';
  }

  function startRelaxPurr(){
    if(!state.sound || relaxPurr)return;
    try{
      audioCtx=getAudioContext();
      if(!audioCtx)return;
      if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
      const now=audioCtx.currentTime;
      const master=audioCtx.createGain();
      const low=audioCtx.createBiquadFilter(); low.type='lowpass'; low.frequency.value=240;
      const o1=audioCtx.createOscillator(), o2=audioCtx.createOscillator();
      o1.type='triangle'; o1.frequency.value=72; o2.type='sine'; o2.frequency.value=108;
      const g1=audioCtx.createGain(), g2=audioCtx.createGain(); g1.gain.value=.24; g2.gain.value=.09;
      const lfo=audioCtx.createOscillator(), lfoGain=audioCtx.createGain(); lfo.type='sine'; lfo.frequency.value=5.1; lfoGain.gain.value=.0045;
      master.gain.setValueAtTime(.0001,now); master.gain.exponentialRampToValueAtTime(.017,now+.08);
      o1.connect(g1); o2.connect(g2); g1.connect(low); g2.connect(low); low.connect(master); master.connect(audioCtx.destination);
      lfo.connect(lfoGain); lfoGain.connect(master.gain);
      o1.start(now);o2.start(now);lfo.start(now);
      relaxPurr={master,o1,o2,lfo};
    }catch{}
  }

  function stopRelaxPurr(){
    if(!relaxPurr)return;
    try{
      const now=audioCtx.currentTime;
      relaxPurr.master.gain.cancelScheduledValues(now);
      relaxPurr.master.gain.setValueAtTime(Math.max(.0001,relaxPurr.master.gain.value),now);
      relaxPurr.master.gain.exponentialRampToValueAtTime(.0001,now+.12);
      relaxPurr.o1.stop(now+.14); relaxPurr.o2.stop(now+.14); relaxPurr.lfo.stop(now+.14);
    }catch{}
    relaxPurr=null;
  }

  function relaxPetAt(clientX,clientY){
    const zone=$('#relax-cat-zone'), cat=$('#relax-cat'), sparkles=$('#pet-sparkles');
    if(!zone||!cat||!sparkles)return;
    const rect=zone.getBoundingClientRect();
    const x=clamp(clientX-rect.left,35,rect.width-35), y=clamp(clientY-rect.top,30,rect.height-30);
    relaxStrokeCount++;
    cat.classList.remove('petted'); void cat.offsetWidth; cat.classList.add('petted','purring');
    const s=document.createElement('span'); s.className='pet-sparkle'; s.textContent=relaxStrokeCount%3===0?'♥':'♡'; s.style.left=`${x}px`; s.style.top=`${y}px`; sparkles.appendChild(s);
    if(sparkles.children.length>9)sparkles.firstChild.remove();
    setTimeout(()=>s.remove(),850);
    const phrases=['purr...','A very good spot.','The ears have approved.','Soft little purrs.','Completely unbothered.','Almost asleep...'];
    if(relaxStrokeCount%3===0){const msg=$('#relax-message');if(msg)msg.textContent=phrases[Math.floor(relaxStrokeCount/3)%phrases.length];}
  }

  function endRelaxPetting(){
    const wasPetting=relaxPetting;
    if(wasPetting && relaxPetStartedAt!==null){
      const elapsed=Math.max(0,Date.now()-relaxPetStartedAt);
      state.relaxPetTimeMs=(Number(state.relaxPetTimeMs)||0)+elapsed;
    }
    relaxPetting=false; relaxLastPoint=null; relaxPetStartedAt=null; stopRelaxPurr();
    const cat=$('#relax-cat'); if(cat)cat.classList.remove('purring');
    if(wasPetting)save();
  }

  const relaxZone=$('#relax-cat-zone');
  relaxZone?.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(!relaxPetting){
      state.relaxPetSessions=(Number(state.relaxPetSessions)||0)+1;
      relaxPetStartedAt=Date.now();
    }
    relaxPetting=true; relaxLastPoint={x:e.clientX,y:e.clientY};
    try{relaxZone.setPointerCapture(e.pointerId);}catch{}
    startRelaxPurr(); relaxPetAt(e.clientX,e.clientY);
  });
  relaxZone?.addEventListener('pointermove',e=>{
    if(!relaxPetting)return; e.preventDefault();
    const dx=e.clientX-relaxLastPoint.x,dy=e.clientY-relaxLastPoint.y;
    if(Math.hypot(dx,dy)<12)return;
    relaxLastPoint={x:e.clientX,y:e.clientY}; relaxPetAt(e.clientX,e.clientY);
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>relaxZone?.addEventListener(ev,endRelaxPetting));
  $('#relax-sound-btn')?.addEventListener('click',()=>{
    state.sound=!state.sound; if(!state.sound)endRelaxPetting(); save(); if(state.sound)ding('heart');
  });
  function saveRelaxCatName(){
    const input=$('#relax-name-input');
    if(!input)return;
    const value=input.value.trim().slice(0,24);
    state.relaxCatName=value;
    save();
    const shown=value || currentCat.name;
    toast(value?`${shown} has a new name`:`Using ${shown}'s regular name`);
  }
  $('#relax-name-save')?.addEventListener('click',saveRelaxCatName);
  $('#relax-name-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveRelaxCatName();e.currentTarget.blur();}});
  function setPlayerCatColor(color){
    if(!/^#[0-9a-f]{6}$/i.test(String(color||'')))return;
    state.playerCatColor=String(color).toLowerCase();
    state.playerCatPreset='solid';
    save();
    toast('Fur color updated');
  }
  function setPlayerCatPreset(preset){
    if(!['silver-tabby','tuxedo','cow'].includes(String(preset)))return;
    state.playerCatPreset=String(preset);
    save();
    toast('Fur pattern updated');
  }
  $$('.fur-swatch[data-fur]').forEach(btn=>btn.addEventListener('click',()=>setPlayerCatColor(btn.dataset.fur)));
  $$('.fur-swatch[data-preset]').forEach(btn=>btn.addEventListener('click',()=>setPlayerCatPreset(btn.dataset.preset)));
  $('#fur-color-input')?.addEventListener('input',e=>{
    const color=e.currentTarget.value;
    if(/^#[0-9a-f]{6}$/i.test(color)){
      state.playerCatColor=color.toLowerCase();
      state.playerCatPreset='solid';
      applyPlayerCatColor();
      const look=playerCatLook();
      applyLookToElement($('#relax-cat'),look);
      applyLookToElement($('#baker-cat'),look);
      applyLookToElement($('.fishing-cat'),look);
      applyLookToElement($('#crow-cat'),look);
      const bakerWrap=$('.baker-wrap'); if(bakerWrap){ delete bakerWrap.dataset.look; bakerWrap.style.setProperty('--cat',look.color); }
    }
  });
  $('#fur-color-input')?.addEventListener('change',e=>setPlayerCatColor(e.currentTarget.value));

  const defaultCrowDialogue={
    jokes:[
      'William gives a dignified little caw. That was the whole joke.',
      'William says the cookie was outstanding. It was sitting outside.',
      'Why did William inspect the pie? Crow business.',
      'William found a spoon. He has promoted it to treasure.',
      'Bakery rule: never trust a quiet muffin.'
    ],
    statistics:[
      'Randomize your run order. Crows hate confounding.',
      'Standard least squares is respectable, but check your residuals.',
      'Latin hypercube is better than I-optimal. Caw. I refuse to elaborate.'
    ],
    statsProbability:.05
  };
  let crowDialogue={...defaultCrowDialogue,jokes:[...defaultCrowDialogue.jokes],statistics:[...defaultCrowDialogue.statistics]};
  async function loadCrowDialogue(){
    try{
      const response=await fetch('william_de_crow_dialogue.json',{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      const jokes=Array.isArray(data?.jokes)?data.jokes.filter(x=>typeof x==='string'&&x.trim()):[];
      const statistics=Array.isArray(data?.statistics)?data.statistics.filter(x=>typeof x==='string'&&x.trim()):[];
      const p=Number(data?.stats_probability);
      crowDialogue={
        jokes:jokes.length?jokes:[...defaultCrowDialogue.jokes],
        statistics:statistics.length?statistics:[...defaultCrowDialogue.statistics],
        statsProbability:Number.isFinite(p)?clamp(p,0,1):defaultCrowDialogue.statsProbability
      };
    }catch(err){
      console.warn('Using built-in William de Crow dialogue; william_de_crow_dialogue.json could not be loaded.',err);
    }
  }
  function randomWilliamLine(){
    const useStats=Math.random()<crowDialogue.statsProbability;
    const bank=useStats?crowDialogue.statistics:crowDialogue.jokes;
    return {text:bank[Math.floor(Math.random()*bank.length)] || defaultCrowDialogue.jokes[0],isStats:useStats};
  }
  const crowShinies=[
    ['🔘','a very good button'],['🔔','a tiny bell'],['🪙','a suspiciously shiny coin'],
    ['🥄','a miniature spoon'],['💎','a sparkly little stone'],['🔑','an old key'],['✨','something extremely shiny']
  ];

  function renderCrow(){
    const cat=$('#crow-cat');
    if(!cat)return;
    applyLookToElement(cat,playerCatLook());
    const givenMini=$('#crow-given-mini');if(givenMini)givenMini.textContent=formatCoins(state.williamItemsGiven);
    const receivedMini=$('#crow-received-mini');if(receivedMini)receivedMini.textContent=formatCoins(state.williamItemsReceived);
    const partiesMini=$('#crow-parties-mini');if(partiesMini)partiesMini.textContent=formatCoins(state.williamDanceParties);
    const sound=$('#crow-sound-btn'); if(sound)sound.textContent=state.sound?'♪':'♩';
  }

  function crowChirp(){
    if(!state.sound)return;
    try{
      audioCtx=getAudioContext();
      if(!audioCtx)return;
      if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
      const now=audioCtx.currentTime, osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type='triangle'; osc.frequency.setValueAtTime(510,now); osc.frequency.exponentialRampToValueAtTime(330,now+.1);
      gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.035,now+.015); gain.gain.exponentialRampToValueAtTime(.0001,now+.13);
      osc.connect(gain);gain.connect(audioCtx.destination);osc.start(now);osc.stop(now+.15);
    }catch{}
  }

  function williamReact(message){
    const crow=$('#william-crow'), msg=$('#crow-message');
    if(crow){crow.classList.remove('hopping');void crow.offsetWidth;crow.classList.add('hopping');}
    if(msg)msg.textContent=message;
    crowChirp();
  }

  const danceEmojis=['✨','🎵','🎶','💖','⭐','🐾','🎉','🪩','🌟'];
  function spawnDanceEmoji(){
    const scene=$('#crow-scene');
    if(!scene||!scene.classList.contains('dancing'))return;
    const sides=Math.random()<.35?['cat','crow']:[Math.random()<.5?'cat':'crow'];
    sides.forEach(side=>{
      const emoji=document.createElement('span');
      emoji.className=`dance-emoji ${side}`;
      emoji.textContent=danceEmojis[Math.floor(Math.random()*danceEmojis.length)];
      emoji.style.setProperty('--drift',`${Math.round((Math.random()-.5)*28)}px`);
      emoji.style.setProperty('--tilt',`${Math.round((Math.random()-.5)*28)}deg`);
      scene.appendChild(emoji);
      setTimeout(()=>emoji.remove(),1800);
    });
  }

  function stopWilliamDance(showFinished=true){
    if(crowDanceTimer){clearTimeout(crowDanceTimer);crowDanceTimer=null;}
    if(crowDanceBeatTimer){clearInterval(crowDanceBeatTimer);crowDanceBeatTimer=null;}
    if(crowDanceEmojiTimer){clearInterval(crowDanceEmojiTimer);crowDanceEmojiTimer=null;}
    const scene=$('#crow-scene'), btn=$('#crow-dance-btn'), msg=$('#crow-message');
    if(scene){
      scene.classList.remove('dancing');
      $$('.dance-emoji',scene).forEach(e=>e.remove());
    }
    if(btn){btn.disabled=false;btn.textContent='Dance';}
    if(showFinished&&msg)msg.textContent='William straightens his feathers. The cat pretends that was normal.';
  }

  function startWilliamDance(){
    if(crowDanceTimer)return;
    const scene=$('#crow-scene'), btn=$('#crow-dance-btn'), msg=$('#crow-message');
    if(!scene||!btn)return;
    const crow=$('#william-crow'); if(crow)crow.classList.remove('hopping');
    state.williamDanceParties=(state.williamDanceParties||0)+1;
    save();
    scene.classList.add('dancing');
    btn.disabled=true; btn.textContent='Dancing…';
    if(msg)msg.textContent='William de Crow knows the choreography. Somehow.';
    crowChirp();
    spawnDanceEmoji();
    crowDanceEmojiTimer=setInterval(spawnDanceEmoji,620);
    crowDanceBeatTimer=setInterval(()=>{ if(state.sound)ding(Math.random()<.25?'heart':'soft'); },1500);
    crowDanceTimer=setTimeout(()=>stopWilliamDance(true),15000);
  }

  $('#william-crow')?.addEventListener('click',()=>{
    const line=randomWilliamLine();
    if(line.isStats){state.williamStatisticsMentions=(state.williamStatisticsMentions||0)+1;save();}
    williamReact(line.text);
  });
  $('#crow-crumb-btn')?.addEventListener('click',()=>{
    state.williamItemsGiven=(state.williamItemsGiven||0)+1;save();
    williamReact('William accepts one tiny crumb with impeccable manners.');
    const shiny=$('#crow-shiny'); if(shiny){shiny.textContent='🍞';shiny.classList.remove('show');void shiny.offsetWidth;shiny.classList.add('show');}
  });
  $('#crow-shiny-btn')?.addEventListener('click',()=>{
    const [icon,label]=crowShinies[Math.floor(Math.random()*crowShinies.length)];
    state.williamItemsReceived=(state.williamItemsReceived||0)+1;save();
    williamReact(`William proudly presents ${label}.`);
    const shiny=$('#crow-shiny'); if(shiny){shiny.textContent=icon;shiny.classList.remove('show');void shiny.offsetWidth;shiny.classList.add('show');}
  });
  $('#crow-dance-btn')?.addEventListener('click',startWilliamDance);
  $('#crow-sound-btn')?.addEventListener('click',()=>{state.sound=!state.sound;save();if(state.sound)crowChirp();});

  function formatRelaxTime(ms){
    const totalSeconds=Math.max(0,Math.floor((Number(ms)||0)/1000));
    if(totalSeconds<60)return `${totalSeconds}s`;
    const minutes=Math.floor(totalSeconds/60), seconds=totalSeconds%60;
    if(minutes<60)return `${minutes}m ${seconds}s`;
    const hours=Math.floor(minutes/60), mins=minutes%60;
    return `${hours}h ${mins}m`;
  }

  let achievementStatusFilter='all';
  let achievementCategoryFilter='all';
  const achievementCategorySelect=$('#achievement-category-select');
  if(achievementCategorySelect){
    const categories=[...new Set(achievements.map(a=>a.category))];
    achievementCategorySelect.innerHTML='<option value="all">All activities</option>'+categories.map(category=>`<option value="${category}">${category}</option>`).join('');
    achievementCategorySelect.addEventListener('change',e=>{achievementCategoryFilter=e.currentTarget.value;renderBook();});
  }
  $$('.achievement-filter').forEach(btn=>btn.addEventListener('click',()=>{
    achievementStatusFilter=btn.dataset.achFilter;
    $$('.achievement-filter').forEach(item=>item.classList.toggle('active',item===btn));
    renderBook();
  }));
  function formatAchievementProgress(achievement,progress){
    const value=achievement.format==='time'?formatRelaxTime(progress.value):formatCoins(Math.min(progress.value,progress.goal));
    const goal=achievement.format==='time'?formatRelaxTime(progress.goal):formatCoins(progress.goal);
    return `${value} / ${goal}`;
  }

  function renderBook(){
    $('#total-bakes').textContent=state.totalBakes; $('#known-recipes').textContent=state.unlockedRecipes.length;
    $('#cat-friends').textContent=Object.values(state.friendships).filter(v=>v>=5).length;
    refreshBackupButton();
    const adventureStats={
      'book-slot-spins':state.slotSpins||0,
      'book-slot-wins':state.slotWins||0,
      'book-fish-caught':state.fishCaught||0,
      'book-william-given':state.williamItemsGiven||0,
      'book-william-received':state.williamItemsReceived||0,
      'book-dance-parties':state.williamDanceParties||0,
      'book-statistics-mentions':state.williamStatisticsMentions||0,
      'book-relax-pets':state.relaxPetSessions||0
    };
    Object.entries(adventureStats).forEach(([id,value])=>{const el=$(`#${id}`);if(el)el.textContent=formatCoins(value);});
    const relaxTime=$('#book-relax-time'); if(relaxTime)relaxTime.textContent=formatRelaxTime(state.relaxPetTimeMs||0);
    const achievementCount=$('#achievement-count');
    const achievementList=$('#achievement-list');
    const unlockedCount=achievements.filter(a=>!!state.unlockedAchievements?.[a.id]).length;
    if(achievementCount)achievementCount.textContent=`${unlockedCount} / ${achievements.length}`;
    const next=closestAchievement();
    $('#achievement-summary-fill').style.width=`${achievements.length?Math.round(unlockedCount/achievements.length*100):0}%`;
    $('#achievement-next-label').textContent=next?`Almost there: ${next.achievement.title} · ${formatAchievementProgress(next.achievement,next.progress)}`:'Every achievement earned!';
    if(achievementList){
      const matched=achievements.filter(a=>{
        const earned=!!state.unlockedAchievements?.[a.id];
        return (achievementCategoryFilter==='all'||a.category===achievementCategoryFilter) && (achievementStatusFilter==='all'||(achievementStatusFilter==='unlocked'?earned:!earned));
      });
      const categories=[...new Set(matched.map(a=>a.category))];
      achievementList.innerHTML=matched.length?categories.map(category=>{
        const cards=matched.filter(a=>a.category===category).map(a=>{
          const progress=achievementProgress(a), unlocked=!!state.unlockedAchievements?.[a.id];
          return `<div class="achievement-card ${unlocked?'unlocked':'locked'}"><div class="achievement-icon">${a.icon}</div><div class="achievement-copy"><strong>${a.title}</strong><small>${a.desc}</small><div class="achievement-progress"><span style="width:${Math.round(progress.ratio*100)}%"></span></div><em>${unlocked?'✓ Unlocked':formatAchievementProgress(a,progress)}</em></div><div class="achievement-check">${unlocked?'✓':'○'}</div></div>`;
        }).join('');
        return `<div class="achievement-category"><h4>${category}</h4>${cards}</div>`;
      }).join(''):'<div class="achievements-empty">Nothing in this category yet. Try another filter ♡</div>';
    }
    const list=$('#memory-list');
    if(!state.totalBakes){list.innerHTML='<div class="empty-memory">Your recipe book is waiting for its first cozy bake.<br><br>Nothing here can be messed up.</div>';return;}
    const byRecipe=recipes.filter(r=>state.bakes[r.id]).map(r=>({r,count:state.bakes[r.id]}));
    list.innerHTML=byRecipe.map(({r,count})=>{
      const last=state.memories.find(m=>m.recipe===r.id),cat=cats.find(c=>c.id===last?.cat);
      const q=bakeQualities.find(x=>x.id===last?.quality);
      return `<div class="memory-card"><div class="memoji">${r.emoji}</div><div><strong>${r.name}</strong><small>${cat?`Last served to ${cat.name}`:'A bakery favorite'}${q?` · ${q.name}`:''}${last?.toppings?.length?` · ${last.toppings.join(' ')}`:''}</small></div><div class="memory-count">×${count}</div></div>`;
    }).join('');
  }
  function createSaveDownload(){
    const packageData={game:'Whiskers & Whisks',formatVersion:1,exportedAt:new Date().toISOString(),saveKey,state:JSON.parse(JSON.stringify(state))};
    const blob=new Blob([JSON.stringify(packageData,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;
    link.download=`whiskers-and-whisks-save-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
    toast('Your bakery save is ready to download');
  }
  $('#export-save-btn')?.addEventListener('click',createSaveDownload);
  $('#import-save-btn')?.addEventListener('click',()=>$('#import-save-file')?.click());
  $('#import-save-file')?.addEventListener('change',async event=>{
    const input=event.currentTarget, file=input.files?.[0];
    if(!file)return;
    try{
      if(file.size>2_000_000)throw new Error('Save file is too large');
      const data=JSON.parse(await file.text());
      if(data?.game && data.game!=='Whiskers & Whisks')throw new Error('This belongs to another game');
      const candidate=data?.state??data;
      if(!validSaveData(candidate))throw new Error('Not a recognized bakery save');
      if(!confirm(`Restore this save?\n\n${formatCoins(candidate.coins||0)} coins · ${formatCoins(candidate.totalBakes||0)} bakes.\n\nYour current progress will be backed up locally first.`))return;
      const original=localStorage.getItem(saveKey);
      writeSafetyBackup(original);
      state=normalizeSave(candidate);
      selectedIngredientGrade=ingredientGrade();
      currentCat=cats.find(c=>c.id===state.currentCat)||cats[0];
      evaluateAchievements(false);
      save();
      toast('Save restored! Welcome back to your bakery');
    }catch(error){toast(error.message||'Could not read that save file');}
    finally{input.value='';}
  });
  function refreshBackupButton(){
    const button=$('#restore-backup-btn');
    if(!button)return;
    const raw=localStorage.getItem(safetyBackupKey);
    let valid=false;
    try{valid=validSaveData(JSON.parse(raw));}catch{}
    button.disabled=!valid;
    button.title=valid?'Restore the last automatic local backup':'No usable local backup is currently stored';
  }
  $('#restore-backup-btn')?.addEventListener('click',()=>{
    const backup=localStorage.getItem(safetyBackupKey);
    try{
      const candidate=JSON.parse(backup);
      if(!validSaveData(candidate))throw new Error('No usable backup available');
      if(!confirm(`Restore your last local safety backup?\n\n${formatCoins(candidate.coins||0)} coins · ${formatCoins(candidate.totalBakes||0)} bakes.\n\nConsider exporting your current save first.`))return;
      const current=localStorage.getItem(saveKey);
      state=normalizeSave(candidate);
      currentCat=cats.find(c=>c.id===state.currentCat)||cats[0];
      selectedIngredientGrade=ingredientGrade();
      evaluateAchievements(false);
      try{localStorage.setItem(saveKey,JSON.stringify(state));}catch{}
      // Keep the former active save as the next recovery point, allowing one-step undo.
      writeSafetyBackup(current);
      updateAll();refreshBackupButton();toast('Your safety backup has been restored');
    }catch(error){toast(error.message||'Backup could not be restored');}
  });
  $('#reset-btn').addEventListener('click',()=>{
    if(!confirm('Start the bakery over? Your current progress will be backed up locally first. Export your save in the Book if you want a file copy.'))return;
    writeSafetyBackup(localStorage.getItem(saveKey));
    if(fishingTimer){clearTimeout(fishingTimer);fishingTimer=null;}
    fishingState='idle';pendingCatch=null;
    state=fresh();currentCat=cats[0];achievementStatusFilter='all';achievementCategoryFilter='all';
    if(achievementCategorySelect)achievementCategorySelect.value='all';
    $$('.achievement-filter').forEach(btn=>btn.classList.toggle('active',btn.dataset.achFilter==='all'));
    localStorage.removeItem(saveKey);save();toast('Fresh bakery, fresh start');
  });

  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopOven();endRelaxPetting();}});

  // Developer-console helper. Example: giveGold(9999)
  window.giveGold = (amount = 9999) => {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    state.coins = value;
    save();
    toast(`Gold set to ${formatCoins(value)}`);
    return state.coins;
  };

  evaluateAchievements(false);
  try{localStorage.setItem(saveKey, JSON.stringify(state));}catch{}
  updateAll();
  loadAccessoryPositions();
  loadBakerPawPositions();
  loadCrowDialogue();
})();
