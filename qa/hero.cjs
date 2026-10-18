const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dylan/Downloads/study-spot/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.BASE_URL||'http://127.0.0.1:4189/';
const output=process.env.SCREENSHOT_DIR||'C:/Users/dylan/AppData/Local/hermes/cache/daves-hero';
let checks=0;const check=(value,label)=>{assert.ok(value,label);checks++;console.log('PASS '+label)};
async function geometry(p){return p.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height}};return {hero:rect('.hero'),image:rect('.hero-photo img'),copy:rect('.hero-inner'),next:rect('.heritage')}})}
(async()=>{const browser=await chromium.launch();try{fs.mkdirSync(output,{recursive:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.evaluate(()=>document.fonts.ready);
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo(0,0));await page.locator('.hero-photo img').evaluate(e=>e.decode());let g=await geometry(page);
check(g.image.left<=0&&g.image.right>=width&&g.image.top<=g.hero.top&&g.image.bottom>=g.hero.bottom,'photo covers entire hero '+width);
check(await page.locator('.hero h1').innerText()==='Glass repair & installation in Caro, Michigan','exact heading '+width);
check(await page.locator('.hero .eyebrow').innerText()==='DAVE’S GLASS · CARO, MI','exact eyebrow '+width);
check(await page.locator('.hero .lede').innerText()==='For your home, your business and your vehicle. Tell us what you’re working on.','exact lede '+width);
check(JSON.stringify(await page.locator('.hero a').evaluateAll(es=>es.map(e=>[e.textContent,e.getAttribute('href')])) )===JSON.stringify([['Get a quote','#contact'],['Explore our work →','#work']]),'exact actions '+width);
check(await page.locator('.hero h1').evaluate(e=>{const r=e.getBoundingClientRect();return r.left<innerWidth/4&&document.elementFromPoint(r.left+5,r.top+5)===e}),'foreground remains on left '+width);
check(await page.locator('.hero').evaluate(e=>getComputedStyle(e,'::after').backgroundImage.includes('linear-gradient')),'navy gradient overlay '+width);
check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
await page.screenshot({path:`${output}/hero-${width}.png`});
await page.evaluate(()=>scrollTo(0,180));await page.waitForTimeout(120);const after=await geometry(page);
if(width>768)check(after.image.top-g.image.top>after.copy.top-g.copy.top+20&&after.image.top<g.image.top,'image scrolls slower than foreground');else check(Math.abs((after.image.top-g.image.top)-(after.copy.top-g.copy.top))<1,'small-screen static '+width);
for(const y of [180,320,440]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);const s=await geometry(page);check(s.image.top<=s.hero.top+1&&s.image.bottom>=s.hero.bottom-1,'no parallax gaps '+width+'/'+y);check(Math.abs(s.next.top-s.hero.bottom)<1,'next section meets clipped hero '+width+'/'+y);if(s.next.top>0)check(await page.evaluate(()=>{const r=document.querySelector('.heritage').getBoundingClientRect();return !!document.elementFromPoint(innerWidth-5,r.top+3)?.closest('.heritage')}),'next section covers image '+width+'/'+y)}
await page.screenshot({path:`${output}/hero-${width}-scroll.png`});}
for(const options of [{reducedMotion:'reduce'},{javaScriptEnabled:false}]){const context=await browser.newContext({...options,viewport:{width:1440,height:1000}});const p=await context.newPage();await p.goto(base);await p.locator('.hero-photo img').evaluate(e=>e.decode());const a=await geometry(p);await p.evaluate(()=>scrollTo(0,180));await p.waitForTimeout(100);const b=await geometry(p);check(Math.abs((b.image.top-a.image.top)-(b.copy.top-a.copy.top))<1,'static fallback '+JSON.stringify(options));check(b.image.top<=b.hero.top&&b.image.bottom>=b.hero.bottom,'fallback still full bleed');await context.close()}
check(errors.length===0,'no runtime errors');console.log(`RESULT: ${checks} hero checks passed`);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
