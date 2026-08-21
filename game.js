(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

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
    { id:'none', name:'No accessory', emoji:'', price:0, desc:'Simple and comfy.' },
    { id:'chef', name:'Tiny Chef Hat', emoji:'👨‍🍳', price:70, desc:'Official bakery business.' },
    { id:'bow', name:'Pink Bow', emoji:'🎀', price:95, desc:'For very important baking.' },
    { id:'flower', name:'Daisy', emoji:'🌼', price:125, desc:'Fresh from the windowsill.' },
    { id:'glasses', name:'Round Glasses', emoji:'🤓', price:180, desc:'Serious recipe research.' },
    { id:'crown', name:'Bakery Crown', emoji:'👑', price:300, desc:'For the ruler of pastries.' }
  ];

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
    { id:'minnow', name:'Pond Minnow', emoji:'🐟', value:8, weight:38, tier:0 },
    { id:'bluegill', name:'Bluegill', emoji:'🐠', value:12, weight:28, tier:1 },
    { id:'perch', name:'Sunny Perch', emoji:'🐟', value:18, weight:18, tier:1 },
    { id:'bass', name:'Lake Bass', emoji:'🐟', value:28, weight:12, tier:2 },
    { id:'trout', name:'Rainbow Trout', emoji:'🐟', value:45, weight:7, tier:3 },
    { id:'koi', name:'Vacation Koi', emoji:'🐠', value:75, weight:3, tier:4 },
    { id:'golden', name:'Golden Fish', emoji:'✨', value:150, weight:1, tier:5 }
  ];

  const toppings = ['🍓','✨','🌸','🍫','🫐','🤍'];
  const saveKey = 'whiskersAndWhisksSaveV1';
  const fresh = () => ({
    coins:35, unlockedRecipes:['cookie'], ownedAccessories:['none'], equippedAccessory:'none',
    ownedDecor:['classic'], equippedDecor:'classic', equipmentLevel:1, friendships:{}, bakes:{}, totalBakes:0,
    memories:[], sound:true, currentCat:'mochi', slotBet:5, slotSpins:0, slotWon:0,
    slotLast:['🐾','🍪','🍓'], slotLastPayout:0, slotLastBet:5,
    bait:5, fishingRodLevel:1, fishingReelLevel:1, fishCaught:0,
    fishingLast:null, fishingEarned:0
  });

  let state = load();
  let selectedRecipe = null;
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

  function load(){
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey));
      return Object.assign(fresh(), parsed || {});
    } catch { return fresh(); }
  }
  function save(){ localStorage.setItem(saveKey, JSON.stringify(state)); updateAll(); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function formatCoins(n){ return Math.floor(n).toLocaleString(); }
  function equipmentInfo(){ return equipmentLevels.find(e=>e.level===Number(state.equipmentLevel)) || equipmentLevels[0]; }
  function equipmentMultiplier(){ return equipmentInfo().multiplier; }
  function equipmentBonusPercent(){ return Math.round((equipmentMultiplier()-1)*100); }
  function baseRecipePayout(recipe){ return Math.round(recipe.reward*equipmentMultiplier()); }
  function ding(type='soft'){
    if(!state.sound) return;
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(type==='coin'?660:type==='heart'?520:420, now);
      if(type==='coin') osc.frequency.exponentialRampToValueAtTime(880, now+.12);
      if(type==='heart') osc.frequency.exponentialRampToValueAtTime(650, now+.16);
      gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.055,now+.015); gain.gain.exponentialRampToValueAtTime(.0001,now+.22);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now+.24);
    }catch{}
  }
  function toast(msg){
    const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>el.classList.remove('show'),1500);
  }

  function updateAll(){
    ['#coin-count','#coin-count-bake','#coin-count-shop','#coin-count-slots','#coin-count-vacation'].forEach(id=>{ const e=$(id); if(e)e.textContent=formatCoins(state.coins); });
    $('#sound-btn').textContent=state.sound?'♪':'♩';
    currentCat = cats.find(c=>c.id===state.currentCat) || currentCat || cats[0];
    renderBakery(); renderShop(); renderSlots(); renderVacation(); renderRelax(); renderBook();
  }

  function setCatVisual(el, cat){ if(el) el.style.setProperty('--cat',cat.color); }
  function renderBakery(){
    $('#customer-name').textContent=currentCat.name;
    const fav=recipes.find(r=>r.id===currentCat.favorite);
    $('#customer-wish').textContent=(fav && state.unlockedRecipes.includes(fav.id)) ? `would love ${(/^[aeiou]/i.test(fav.name)?'an ':'a ')+fav.name.toLowerCase()}` : 'is happy with anything warm';
    setCatVisual($('#customer-cat'),currentCat);
    setCatVisual($('#baker-cat'),{color:'#c58f62'});
    const hearts=clamp(state.friendships[currentCat.id]||0,0,5);
    $('#friendship-row').innerHTML=Array.from({length:5},(_,i)=>`<span class="${i<hearts?'filled':''}">♥</span>`).join('');
    const acc=accessories.find(a=>a.id===state.equippedAccessory)||accessories[0];
    const accEl=$('#baker-accessory');
    accEl.className='accessory';
    if(acc.id!=='none') accEl.classList.add(`accessory-${acc.id}`);
    accEl.textContent='';
    const scene=$('#bakery-scene'); scene.className='bakery-scene'; if(state.equippedDecor!=='classic')scene.classList.add(`theme-${state.equippedDecor}`);
    const last=state.memories[0]; $('#pastry-display').textContent=last ? (recipes.find(r=>r.id===last.recipe)?.emoji || '🍪') : '🍪';
  }

  function showScreen(id){
    if(id!=='relax-screen') endRelaxPetting();
    $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
    window.scrollTo(0,0);
    updateAll();
  }
  $$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screen)));

  $('#sound-btn').addEventListener('click',()=>{state.sound=!state.sound;save(); if(state.sound)ding();});
  $('#bake-btn').addEventListener('click',startBake);
  $('#bake-back').addEventListener('click',()=>{ stopOven(); showScreen('bakery-screen'); });

  function startBake(){
    selectedRecipe=null; chosenToppings=[]; addedIngredients.clear(); mixValue=0; ovenValue=0; kneadValue=0; pressValue=0;
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
      selectedRecipe=r; ding(); prepareIngredients();
    }));
  }
  function prepareIngredients(){
    $('#bake-title').textContent=selectedRecipe.name; setStepSubtitle('ingredients');
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
  ['pointerdown','touchstart'].forEach(ev=>$('#oven-hold').addEventListener(ev,e=>{e.preventDefault();startOven();},{passive:false}));
  ['pointerup','pointercancel','pointerleave','touchend','touchcancel'].forEach(ev=>$('#oven-hold').addEventListener(ev,e=>{e.preventDefault();stopOven();},{passive:false}));

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
    const favorite=selectedRecipe.id===currentCat.favorite;
    const bonus=favorite?4:0, decorBonus=Math.min(3,Math.floor(chosenToppings.length/3));
    const rawReward=selectedRecipe.reward+bonus+decorBonus;
    const reward=Math.round(rawReward*equipmentMultiplier());
    state.coins+=reward; state.totalBakes++; state.bakes[selectedRecipe.id]=(state.bakes[selectedRecipe.id]||0)+1;
    state.friendships[currentCat.id]=clamp((state.friendships[currentCat.id]||0)+1,0,5);
    state.memories.unshift({recipe:selectedRecipe.id,cat:currentCat.id,toppings:chosenToppings.slice(0,4),when:Date.now()}); state.memories=state.memories.slice(0,18);
    $('#result-pastry').textContent=selectedRecipe.emoji; $('#result-title').textContent=`${currentCat.name} loved it!`;
    $('#result-note').textContent=favorite?`${selectedRecipe.name} is ${currentCat.name}'s favorite.`:(chosenToppings.length?`${selectedRecipe.note} And very nicely decorated.`:selectedRecipe.note);
    $('#reward-coins').textContent=`+${reward}`; $('#heart-reward').textContent=(state.friendships[currentCat.id]>=5)?'♥ best bakery friend':'♥ friendship +1';
    setCatVisual($('#result-cat'),currentCat); save(); ding('coin'); showStage('result-stage');
  }
  $('#done-btn').addEventListener('click',()=>{
    const options=cats.filter(c=>c.id!==currentCat.id); currentCat=options[Math.floor(Math.random()*options.length)]; state.currentCat=currentCat.id; save(); showScreen('bakery-screen'); ding('heart');
  });

  let activeShopTab='recipes';
  $$('#shop-tabs .tab').forEach(tab=>tab.addEventListener('click',()=>{activeShopTab=tab.dataset.tab;$$('#shop-tabs .tab').forEach(t=>t.classList.toggle('active',t===tab));renderShop();}));
  function renderShop(){
    const list=$('#shop-list'); if(!list)return;
    if(activeShopTab==='equipment'){
      const current=equipmentInfo();
      const next=equipmentLevels.find(e=>e.level===current.level+1);
      const bonus=equipmentBonusPercent();
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
      `;
      $$('.shop-buy[data-kind="equipment"]',list).forEach(btn=>btn.addEventListener('click',()=>buyOrEquip(btn.dataset.kind,btn.dataset.id)));
      return;
    }
    let data=[];
    if(activeShopTab==='recipes') data=recipes.filter(r=>r.price>0).map(r=>({kind:'recipe',id:r.id,name:r.name,emoji:r.emoji,price:r.price,desc:`Earn ${baseRecipePayout(r)}+ coins with your current equipment.`,owned:state.unlockedRecipes.includes(r.id)}));
    if(activeShopTab==='accessories') data=accessories.map(a=>({kind:'accessory',...a,owned:state.ownedAccessories.includes(a.id),equipped:state.equippedAccessory===a.id}));
    if(activeShopTab==='decor') data=decor.map(d=>({kind:'decor',...d,owned:state.ownedDecor.includes(d.id),equipped:state.equippedDecor===d.id}));
    list.innerHTML=data.map(x=>{
      const label=x.equipped?'Equipped':x.owned?(x.kind==='recipe'?'Owned':'Use'):`● ${x.price}`;
      return `<div class="shop-item"><div class="shop-icon">${x.emoji}</div><div class="shop-text"><strong>${x.name}</strong><small>${x.desc}</small></div><button class="shop-buy ${x.equipped?'equipped':x.owned?'owned':''}" data-kind="${x.kind}" data-id="${x.id}">${label}</button></div>`;
    }).join('');
    $$('.shop-buy',list).forEach(btn=>btn.addEventListener('click',()=>buyOrEquip(btn.dataset.kind,btn.dataset.id)));
  }
  function buyOrEquip(kind,id){
    let item,owned=false;
    if(kind==='equipment'){
      item=equipmentLevels.find(x=>x.level===Number(id));
      if(!item || item.level!==equipmentInfo().level+1){toast('Upgrade one level at a time');return;}
    }
    if(kind==='recipe'){item=recipes.find(x=>x.id===id);owned=state.unlockedRecipes.includes(id);if(owned){toast('Already in your recipe book');return;}}
    if(kind==='accessory'){item=accessories.find(x=>x.id===id);owned=state.ownedAccessories.includes(id);if(owned){state.equippedAccessory=id;save();ding();toast('Outfit updated');return;}}
    if(kind==='decor'){item=decor.find(x=>x.id===id);owned=state.ownedDecor.includes(id);if(owned){state.equippedDecor=id;save();ding();toast('Bakery redecorated');return;}}
    if(state.coins<item.price){toast('A few more bakes will do it');return;}
    state.coins-=item.price;
    if(kind==='recipe')state.unlockedRecipes.push(id);
    if(kind==='accessory'){state.ownedAccessories.push(id);state.equippedAccessory=id;}
    if(kind==='decor'){state.ownedDecor.push(id);state.equippedDecor=id;}
    if(kind==='equipment')state.equipmentLevel=item.level;
    save(); ding('coin');
    if(kind==='equipment')toast(`Equipment Level ${item.level} · +${Math.round((item.multiplier-1)*100)}% coins`);
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
    localStorage.setItem(saveKey,JSON.stringify(state));
    renderSlots();
    ding();
  }));
  $('#slot-spin')?.addEventListener('click',spinSlots);
  function spinSlots(){
    if(slotSpinning)return;
    const bet=Number(state.slotBet)||5;
    if(state.coins<bet){toast('Bake a little more first');return;}
    slotSpinning=true;
    state.coins-=bet;
    localStorage.setItem(saveKey,JSON.stringify(state));
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
    const rod=fishingRodInfo(), reel=fishingReelInfo();
    bait.textContent=state.bait||0;
    $('#rod-level').textContent=`Lv. ${rod.level}`;
    $('#reel-level').textContent=`Lv. ${reel.level}`;
    $('#rod-name').textContent=rod.name;
    $('#reel-name').textContent=reel.name;
    $('#rod-desc').textContent=rod.level<5?`Can find fish up to tier ${rod.maxTier}. Better rods unlock rarer catches.`:'Every fish in the lake is now within reach.';
    $('#reel-desc').textContent=reel.level<5?`Catch value ×${reel.multiplier.toFixed(2)}. Better reels also shorten the wait.`:`Catch value ×${reel.multiplier.toFixed(2)} with the smoothest reel.`;
    const nextRod=fishingRods.find(x=>x.level===rod.level+1), nextReel=fishingReels.find(x=>x.level===reel.level+1);
    const rodBtn=$('#rod-upgrade'), reelBtn=$('#reel-upgrade');
    rodBtn.textContent=nextRod?`● ${nextRod.price}`:'Max'; rodBtn.disabled=!nextRod;
    reelBtn.textContent=nextReel?`● ${nextReel.price}`:'Max'; reelBtn.disabled=!nextReel;
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
      $('#last-catch-note').textContent=`Last catch · +${formatCoins(last.payout||0)} coins · ${formatCoins(state.fishCaught||0)} caught total`;
    }else{
      $('#last-catch-icon').textContent='🐟'; $('#last-catch-name').textContent='No catches yet'; $('#last-catch-note').textContent='There is plenty of time.';
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
    state.coins+=payout; state.fishCaught=(state.fishCaught||0)+1; state.fishingEarned=(state.fishingEarned||0)+payout;
    state.fishingLast={id:pendingCatch.id,name:pendingCatch.name,emoji:pendingCatch.emoji,payout,when:Date.now()};
    const caught=pendingCatch; pendingCatch=null; fishingState='idle';
    save(); ding('coin'); toast(`${caught.name} · +${formatCoins(payout)} coins`);
  }
  $('#rod-upgrade')?.addEventListener('click',()=>{
    const current=fishingRodInfo(), next=fishingRods.find(x=>x.level===current.level+1);
    if(!next)return;
    if(state.coins<next.price){toast('A few more coins will do it');return;}
    state.coins-=next.price; state.fishingRodLevel=next.level; save(); ding('coin'); toast(`${next.name} equipped`);
  });
  $('#reel-upgrade')?.addEventListener('click',()=>{
    const current=fishingReelInfo(), next=fishingReels.find(x=>x.level===current.level+1);
    if(!next)return;
    if(state.coins<next.price){toast('A few more coins will do it');return;}
    state.coins-=next.price; state.fishingReelLevel=next.level; save(); ding('coin'); toast(`${next.name} equipped`);
  });
  $$('.bait-buy').forEach(btn=>btn.addEventListener('click',()=>{
    const amount=Number(btn.dataset.bait)||0, price=Number(btn.dataset.price)||0;
    if(state.coins<price){toast('Not quite enough coins');return;}
    state.coins-=price; state.bait=(state.bait||0)+amount; save(); ding('coin'); toast(`+${amount} bait`);
  }));

  function renderRelax(){
    const catEl=$('#relax-cat');
    if(!catEl)return;
    setCatVisual(catEl,currentCat);
    const name=$('#relax-cat-name'); if(name)name.textContent=`${currentCat.name} is relaxing.`;
    const sound=$('#relax-sound-btn'); if(sound)sound.textContent=state.sound?'♪':'♩';
  }

  function startRelaxPurr(){
    if(!state.sound || relaxPurr)return;
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if(audioCtx.state==='suspended')audioCtx.resume();
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
    relaxPetting=false; relaxLastPoint=null; stopRelaxPurr();
    const cat=$('#relax-cat'); if(cat)cat.classList.remove('purring');
  }

  const relaxZone=$('#relax-cat-zone');
  relaxZone?.addEventListener('pointerdown',e=>{
    e.preventDefault(); relaxPetting=true; relaxLastPoint={x:e.clientX,y:e.clientY};
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

  function renderBook(){
    $('#total-bakes').textContent=state.totalBakes; $('#known-recipes').textContent=state.unlockedRecipes.length;
    $('#cat-friends').textContent=Object.values(state.friendships).filter(v=>v>=5).length;
    const list=$('#memory-list');
    if(!state.totalBakes){list.innerHTML='<div class="empty-memory">Your recipe book is waiting for its first cozy bake.<br><br>Nothing here can be messed up.</div>';return;}
    const byRecipe=recipes.filter(r=>state.bakes[r.id]).map(r=>({r,count:state.bakes[r.id]}));
    list.innerHTML=byRecipe.map(({r,count})=>{
      const last=state.memories.find(m=>m.recipe===r.id),cat=cats.find(c=>c.id===last?.cat);
      return `<div class="memory-card"><div class="memoji">${r.emoji}</div><div><strong>${r.name}</strong><small>${cat?`Last served to ${cat.name}`:'A bakery favorite'}${last?.toppings?.length?` · ${last.toppings.join(' ')}`:''}</small></div><div class="memory-count">×${count}</div></div>`;
    }).join('');
  }
  $('#reset-btn').addEventListener('click',()=>{
    if(!confirm('Start the bakery over from the beginning?'))return;
    if(fishingTimer){clearTimeout(fishingTimer);fishingTimer=null;}
    fishingState='idle';pendingCatch=null;
    state=fresh();currentCat=cats[0];localStorage.removeItem(saveKey);save();toast('Fresh bakery, fresh start');
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

  updateAll();
})();
