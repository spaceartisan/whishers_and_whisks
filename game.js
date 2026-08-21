(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const recipes = [
    { id:'cookie', name:'Butter Cookie', emoji:'🍪', price:0, reward:8, ingredients:[['Flour','🌾'],['Butter','🧈'],['Sugar','🧂'],['Egg','🥚']], note:'A warm little classic.' },
    { id:'cupcake', name:'Berry Cupcake', emoji:'🧁', price:45, reward:13, ingredients:[['Flour','🌾'],['Milk','🥛'],['Berry','🍓'],['Egg','🥚']], note:'Soft, sweet, and berry cozy.' },
    { id:'bread', name:'Cat Loaf', emoji:'🍞', price:85, reward:18, ingredients:[['Flour','🌾'],['Milk','🥛'],['Butter','🧈'],['Yeast','✨']], note:'A loaf shaped with love.' },
    { id:'roll', name:'Cinnamon Roll', emoji:'🥐', price:140, reward:25, ingredients:[['Flour','🌾'],['Butter','🧈'],['Cinnamon','🤎'],['Sugar','🧂']], note:'Warm swirls for a quiet day.' },
    { id:'pie', name:'Strawberry Pie', emoji:'🥧', price:220, reward:34, ingredients:[['Flour','🌾'],['Butter','🧈'],['Berry','🍓'],['Sugar','🧂']], note:'A little celebration in a crust.' },
    { id:'cake', name:'Cloud Cake', emoji:'🎂', price:340, reward:48, ingredients:[['Flour','🌾'],['Milk','🥛'],['Cream','☁️'],['Berry','🍓']], note:'Fluffy enough to nap on.' }
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

  const toppings = ['🍓','✨','🌸','🍫','🫐','🤍'];
  const saveKey = 'whiskersAndWhisksSaveV1';
  const fresh = () => ({
    coins:35, unlockedRecipes:['cookie'], ownedAccessories:['none'], equippedAccessory:'none',
    ownedDecor:['classic'], equippedDecor:'classic', friendships:{}, bakes:{}, totalBakes:0,
    memories:[], sound:true, currentCat:'mochi'
  });

  let state = load();
  let selectedRecipe = null;
  let currentCat = cats.find(c => c.id === state.currentCat) || cats[0];
  let addedIngredients = new Set();
  let mixValue = 0;
  let lastMixPoint = null;
  let ovenValue = 0;
  let ovenTimer = null;
  let chosenToppings = [];
  let toastTimer = null;
  let audioCtx = null;

  function load(){
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey));
      return Object.assign(fresh(), parsed || {});
    } catch { return fresh(); }
  }
  function save(){ localStorage.setItem(saveKey, JSON.stringify(state)); updateAll(); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function formatCoins(n){ return Math.floor(n).toLocaleString(); }
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
    ['#coin-count','#coin-count-bake','#coin-count-shop'].forEach(id=>{ const e=$(id); if(e)e.textContent=formatCoins(state.coins); });
    $('#sound-btn').textContent=state.sound?'♪':'♩';
    currentCat = cats.find(c=>c.id===state.currentCat) || currentCat || cats[0];
    renderBakery(); renderShop(); renderBook();
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
    $('#baker-accessory').textContent=acc.emoji;
    const scene=$('#bakery-scene'); scene.className='bakery-scene'; if(state.equippedDecor!=='classic')scene.classList.add(`theme-${state.equippedDecor}`);
    const last=state.memories[0]; $('#pastry-display').textContent=last ? (recipes.find(r=>r.id===last.recipe)?.emoji || '🍪') : '🍪';
  }

  function showScreen(id){
    $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
    window.scrollTo(0,0);
    updateAll();
  }
  $$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screen)));

  $('#sound-btn').addEventListener('click',()=>{state.sound=!state.sound;save(); if(state.sound)ding();});
  $('#bake-btn').addEventListener('click',startBake);
  $('#bake-back').addEventListener('click',()=>{ stopOven(); showScreen('bakery-screen'); });

  function startBake(){
    selectedRecipe=null; chosenToppings=[]; addedIngredients.clear(); mixValue=0; ovenValue=0;
    showScreen('bake-screen'); showStage('recipe-stage'); renderRecipes();
  }
  function showStage(id){ $$('.stage').forEach(s=>s.classList.toggle('active-stage',s.id===id)); window.scrollTo(0,0); }
  function renderRecipes(){
    $('#bake-title').textContent='Bake something'; $('#bake-subtitle').textContent='Choose a recipe';
    $('#recipe-grid').innerHTML=recipes.map(r=>{
      const unlocked=state.unlockedRecipes.includes(r.id);
      return `<button class="recipe-card ${unlocked?'':'locked'}" data-recipe="${r.id}"><span class="emoji">${r.emoji}</span><strong>${r.name}</strong><small>${unlocked?`${r.reward} coins`:`Unlock in shop · ${r.price}`}</small>${unlocked?'':'<span class="lock">🔒</span>'}</button>`;
    }).join('');
    $$('.recipe-card').forEach(btn=>btn.addEventListener('click',()=>{
      const r=recipes.find(x=>x.id===btn.dataset.recipe);
      if(!state.unlockedRecipes.includes(r.id)){ toast('That recipe is still tucked away'); return; }
      selectedRecipe=r; ding(); prepareIngredients();
    }));
  }
  function prepareIngredients(){
    $('#bake-title').textContent=selectedRecipe.name; $('#bake-subtitle').textContent='Step 1 of 4';
    addedIngredients.clear(); $('#ingredient-bowl').classList.remove('full');
    $('#ingredient-grid').innerHTML=selectedRecipe.ingredients.map(([name,emoji],i)=>`<button class="ingredient-btn" data-i="${i}"><span>${emoji}</span>${name}</button>`).join('');
    $$('.ingredient-btn').forEach(btn=>btn.addEventListener('click',()=>addIngredient(btn)));
    showStage('ingredient-stage');
  }
  function addIngredient(btn){
    const i=Number(btn.dataset.i); if(addedIngredients.has(i))return;
    addedIngredients.add(i); btn.classList.add('done');
    const emoji=selectedRecipe.ingredients[i][1], pop=$('#ingredient-pop'); pop.textContent=emoji; pop.classList.remove('pop'); void pop.offsetWidth; pop.classList.add('pop'); ding();
    if(addedIngredients.size===selectedRecipe.ingredients.length){
      $('#ingredient-bowl').classList.add('full'); setTimeout(prepareMix,650);
    }
  }
  function prepareMix(){
    mixValue=0; lastMixPoint=null; $('#mix-progress').style.width='0%'; $('#bake-subtitle').textContent='Step 2 of 4'; showStage('mix-stage');
  }
  const mixZone=$('#mix-zone');
  mixZone.addEventListener('pointerdown',e=>{mixZone.setPointerCapture(e.pointerId);lastMixPoint={x:e.clientX,y:e.clientY};});
  mixZone.addEventListener('pointermove',e=>{
    if(!lastMixPoint || mixValue>=100)return;
    const dx=e.clientX-lastMixPoint.x,dy=e.clientY-lastMixPoint.y,dist=Math.hypot(dx,dy); lastMixPoint={x:e.clientX,y:e.clientY};
    if(dist<2)return; mixValue=clamp(mixValue+dist*.055,0,100); $('#mix-progress').style.width=`${mixValue}%`;
    const rot=(mixValue*10)%360; $('#spoon').style.transform=`rotate(${Math.sin(rot*Math.PI/180)*24}deg)`; $('#mix-batter').style.transform=`scale(${1+Math.sin(rot*.07)*.018})`;
    if(mixValue>=100){ding('heart');setTimeout(prepareOven,400);}
  });
  mixZone.addEventListener('pointerup',()=>lastMixPoint=null); mixZone.addEventListener('pointercancel',()=>lastMixPoint=null);

  function prepareOven(){
    ovenValue=0; $('#oven-progress').style.width='0%'; $('#oven-pastry').textContent=selectedRecipe.emoji; $('#bake-subtitle').textContent='Step 3 of 4'; showStage('oven-stage');
  }
  function startOven(){
    if(ovenTimer || ovenValue>=100)return; $('.oven').classList.add('baking');
    const started=performance.now(), initial=ovenValue;
    ovenTimer=setInterval(()=>{
      ovenValue=clamp(initial+(performance.now()-started)/22,0,100); $('#oven-progress').style.width=`${ovenValue}%`;
      if(ovenValue>=100){stopOven();ding('coin');setTimeout(prepareDecorate,350);}
    },30);
  }
  function stopOven(){ if(ovenTimer){clearInterval(ovenTimer);ovenTimer=null;} const o=$('.oven');if(o)o.classList.remove('baking'); }
  ['pointerdown','touchstart'].forEach(ev=>$('#oven-hold').addEventListener(ev,e=>{e.preventDefault();startOven();},{passive:false}));
  ['pointerup','pointercancel','pointerleave','touchend','touchcancel'].forEach(ev=>$('#oven-hold').addEventListener(ev,e=>{e.preventDefault();stopOven();},{passive:false}));

  function prepareDecorate(){
    chosenToppings=[]; $('#decorations').innerHTML=''; $('#decor-pastry').textContent=selectedRecipe.emoji; $('#serve-name').textContent=currentCat.name; $('#bake-subtitle').textContent='Step 4 of 4';
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
    const reward=selectedRecipe.reward+bonus+decorBonus;
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
    let data=[];
    if(activeShopTab==='recipes') data=recipes.filter(r=>r.price>0).map(r=>({kind:'recipe',id:r.id,name:r.name,emoji:r.emoji,price:r.price,desc:`Earn ${r.reward} coins when served.`,owned:state.unlockedRecipes.includes(r.id)}));
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
    if(kind==='recipe'){item=recipes.find(x=>x.id===id);owned=state.unlockedRecipes.includes(id);if(owned){toast('Already in your recipe book');return;}}
    if(kind==='accessory'){item=accessories.find(x=>x.id===id);owned=state.ownedAccessories.includes(id);if(owned){state.equippedAccessory=id;save();ding();toast('Outfit updated');return;}}
    if(kind==='decor'){item=decor.find(x=>x.id===id);owned=state.ownedDecor.includes(id);if(owned){state.equippedDecor=id;save();ding();toast('Bakery redecorated');return;}}
    if(state.coins<item.price){toast('A few more bakes will do it');return;}
    state.coins-=item.price;
    if(kind==='recipe')state.unlockedRecipes.push(id);
    if(kind==='accessory'){state.ownedAccessories.push(id);state.equippedAccessory=id;}
    if(kind==='decor'){state.ownedDecor.push(id);state.equippedDecor=id;}
    save(); ding('coin'); toast(kind==='recipe'?'New recipe unlocked!':'New cozy thing unlocked!');
  }

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
    state=fresh();currentCat=cats[0];localStorage.removeItem(saveKey);save();toast('Fresh bakery, fresh start');
  });

  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopOven();});
  updateAll();
})();
