const fs=require('fs');const vm=require('vm');
const source=fs.readFileSync(require('path').resolve(__dirname,'../game.js'),'utf8');
function buildScenario(input, active='bakery-screen'){
 const values=new Map();if(input!==undefined)values.set('whiskersAndWhisksSaveV1', typeof input==='string'?input:JSON.stringify(input));
 const elements=new Map();const callbacks=new Map();let screen=active;
 function el(selector){
  if(selector==='.screen.active')return {id:screen};
  if(!elements.has(selector)){
   const classTokens=new Set();
   const node={id:selector.startsWith('#')?selector.slice(1):'',dataset:{},style:{setProperty(k,v){this[k]=v;}},classList:{add(k){classTokens.add(k)},remove(k){classTokens.delete(k)},contains(k){return classTokens.has(k)},toggle(k,v){if(v===undefined)v=!classTokens.has(k);if(v)classTokens.add(k);else classTokens.delete(k);return v;}},innerHTML:'',textContent:'',value:'',files:[],disabled:false,appendChild(){},setAttribute(){},removeAttribute(){},getAttribute(){},focus(){},blur(){},addEventListener(k,cb){callbacks.set(selector+':'+k,cb)},click(){const cb=callbacks.get(selector+':click');if(cb)cb({currentTarget:this})}};
   elements.set(selector,node);
  }
  return elements.get(selector);
 }
 const doc={querySelector:el,querySelectorAll(){return []},createElement(){return el(`created-${elements.size}`)},documentElement:{style:{setProperty(){}}},addEventListener(){},body:{appendChild(){}}};
 const storage={getItem(k){return values.has(k)?values.get(k):null;},setItem(k,v){values.set(k,String(v));},removeItem(k){values.delete(k);}};
 const window={innerHeight:844,addEventListener(){},visualViewport:null,scrollTo(){},AudioContext:null,webkitAudioContext:null};
 const context={document:doc,window,localStorage:storage,console,requestAnimationFrame(fn){fn();return 1},cancelAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},Date,Math,Number,JSON,Set,Object,String,Array,URL,Blob,fetch(){return Promise.reject(Error('no network'))},confirm(){return true}};
 context.globalThis=context;
 vm.createContext(context);
 try{vm.runInContext(source,context,{timeout:4000});}catch(e){throw new Error('startup '+e.stack)}
 return {context,values,elements,callbacks,setScreen(x){screen=x;},save(){return JSON.parse(values.get('whiskersAndWhisksSaveV1'))}};
}
let failures=0;function check(desc,condition){if(!condition){console.error('FAIL',desc);failures++;}else console.log('PASS',desc);}
function exercise(desc,sample,expected){try{const run=buildScenario(sample);const data=run.save();for(const [key,value] of Object.entries(expected))check(`${desc}: ${key}`,JSON.stringify(data[key])===JSON.stringify(value));check(`${desc}: backup`,!!run.values.get('whiskersAndWhisksSaveBackupV134'));}catch(e){console.error('FAIL',desc,e);failures++;}}
exercise('v1.0 sparse',{coins:827,totalBakes:21,unlockedRecipes:['cookie','cupcake'],friendships:{mochi:4}}, {coins:827,totalBakes:21,unlockedRecipes:['cookie','cupcake'],friendships:{mochi:4},fishCaught:0,relaxPetTimeMs:0});
exercise('v1.33 advanced',{coins:2475,totalBakes:118,slotSpins:12,slotWins:4,fishCaught:16,fishRecords:[{id:'bass',sizeLb:7.1}],relaxCatName:'Bootsie',playerCatColor:'#abcdef',playerCatPreset:'tuxedo',relaxPetSessions:15,relaxPetTimeMs:245000,ownedDecor:['classic','mint'],equippedDecor:'mint',ownedAccessories:['none','chef'],equippedAccessory:'chef',unlockedAchievements:{'first-batch':170000}}, {coins:2475,totalBakes:118,slotWins:4,fishCaught:16,relaxCatName:'Bootsie',playerCatPreset:'tuxedo',relaxPetTimeMs:245000,ownedDecor:['classic','mint'],equippedDecor:'mint',equippedAccessory:'chef'});
exercise('malformed fields',{coins:-2,totalBakes:'invalid',unlockedRecipes:'bad',friendships:'no',memories:[{recipe:'cookie',toppings:'not an array'}],ingredientStock:{pantry:-8,choice:24}}, {coins:0,totalBakes:0,unlockedRecipes:['cookie'],friendships:{},ingredientStock:{pantry:0,fresh:0,choice:24,clover:0,moonlit:0}});
const empty=buildScenario();check('fresh save',empty.save().coins===35);check('fresh no startup badges',Object.keys(empty.save().unlockedAchievements||{}).length===0);check('stable save key',empty.values.has('whiskersAndWhisksSaveV1'));
const old=buildScenario('{bad json');check('corrupted backup preserved',old.values.get('whiskersAndWhisksSaveBackupV134')==='{bad json');
const redraw=buildScenario({coins:9999,totalBakes:4,unlockedRecipes:['cookie'],bakes:{cookie:4},memories:[{recipe:'cookie',toppings:'invalid'}]});redraw.setScreen('book-screen');
try{redraw.context.window.giveGold(5000);check('book rendering with legacy memories',redraw.save().coins===5000)}catch(e){console.error('FAIL book view',e);failures++;}
console.log('\nFAILURES',failures);process.exit(failures?1:0)
