const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/dylan/Downloads/study-spot/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:4189/';
let checks=0;
function check(value,message){assert.ok(value,message); checks++; console.log('PASS '+message);}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);
 check((await page.locator('h1').innerText()).includes('Glass repair & installation in Caro, Michigan'),'clear local hero');
 const text=await page.locator('body').innerText();
 check(!/three generations|3 generations|1,000s|licensed|insured|same.week|same.day|subcontract|single morning|one visit|insurance|family.owned|family.run|coming soon/i.test(text),'no unsupported claims or placeholders');
 check(await page.locator('meta[name=robots]').getAttribute('content')==='noindex,nofollow','draft remains noindex');
 check(await page.locator('#services article').count()===4,'four concise services');
 check(await page.locator('#service-commercial img').getAttribute('src')===await page.locator('.hero-photo img').getAttribute('src'),'commercial card uses the banner photo');
 check(await page.locator('#extras article').count()===6,'six other services');
 check((await page.locator('#service-auto img').getAttribute('src')).endsWith('img-0268.jpg'),'clean windshield photo belongs to auto');
 check((await page.locator('#service-residential img').getAttribute('src')).includes('seal-failure'),'residential uses actual fogged window');
 check(await page.locator('.gallery-grid').first().locator('a').count()===6,'six initial project images');
 for(const label of ['Services','Our Work','About','Contact']) check(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:label,exact:true}).count()===1,'navigation '+label);
 for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:1000});
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
 const rects=await page.locator('.brand, .header-actions').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}}));
 check(rects[0].right<=rects[1].x||rects[0].bottom<=rects[1].y,'brand and actions do not overlap '+width);
 if(width<=390){
 check(Math.abs((rects[0].y+rects[0].bottom)/2-(rects[1].y+rects[1].bottom)/2)<4,'brand and actions share compact row '+width);
 check(await page.locator('header').evaluate(e=>e.getBoundingClientRect().height<=120),'mobile header stays compact '+width);
 check(await page.locator('nav a, .header-actions a').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),'mobile navigation tap heights '+width);
 const cards=await page.locator('.contact-card').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {y:r.y,bottom:r.bottom}}));
 check(cards[0].bottom<=cards[1].y,'contact cards stack '+width);
 check(await page.locator('.contact-phone').evaluate(e=>getComputedStyle(e).whiteSpace==='nowrap'),'phone nowrap '+width);
 }
 }
 const photo=page.locator('#work .photo-link').first();
 await photo.focus(); await page.keyboard.press('Enter');
 check(await page.locator('#lightbox').evaluate(e=>e.open),'gallery opens with keyboard');
 check(await page.locator('#lightbox img').getAttribute('src')===await photo.getAttribute('href'),'lightbox displays full scene');
 await page.keyboard.press('Tab');
 check(await page.evaluate(()=>document.activeElement.closest('dialog')!==null),'lightbox traps keyboard focus');
 await page.keyboard.press('Escape');
 check(!await page.locator('#lightbox').evaluate(e=>e.open),'Escape closes lightbox');
 check(await photo.evaluate(e=>e===document.activeElement),'lightbox restores focus');
 await photo.click(); await page.getByRole('button',{name:'Close enlarged photo'}).click();
 check(await photo.evaluate(e=>e===document.activeElement),'close button restores focus');
 check(await page.locator('.draft-tools').isVisible(),'email copy fallback available without mail app');
 await page.getByRole('button',{name:'Open email draft',exact:true}).click();
 check(await page.locator('#qf-name').evaluate(e=>!e.validity.valid),'required fields validate before email draft');
 await page.locator('#qf-name').fill('Test & QA'); await page.locator('#qf-phone').fill('989-555-0100');
 await page.locator('#qf-zip').fill('123');
 check(await page.locator('#qf-zip').evaluate(e=>!e.validity.valid),'ZIP validation');
 await page.locator('#qf-zip').fill('48723'); await page.locator('#qf-msg').fill('Glass & frame?\nPlease quote.');
 const payload=await page.evaluate(()=>window.buildQuoteDraft(document.querySelector('#quoteForm')));
 const mail=new URL(payload.href); const body=mail.searchParams.get('body');
 check(mail.protocol==='mailto:' && mail.pathname==='office@davesglassllc.com','email recipient is correct');
 check(body.includes('Test & QA')&&body.includes('Glass & frame?\nPlease quote.')&&body.includes('48723'),'email payload preserves fields and special characters');
 check(!/davesglassllc.com website|davesglass.biz/.test(body)&&body.includes('Prepared using the Dave’s Glass website'),'email body avoids obsolete domain attribution');
 // Intercept the external launch only: exercise actual submit without opening an app or sending.
 await page.evaluate(()=>{window.openQuoteEmail=href=>{window.testMailto=href;};});
 await page.getByRole('button',{name:'Open email draft',exact:true}).click();
 check(await page.evaluate(()=>window.testMailto)===payload.href,'submit builds the expected draft without sending');
 check(await page.locator('#qf-msg').inputValue()==='Glass & frame?\nPlease quote.','form preserves fields');
 check((await page.locator('#draft-status').innerText()).includes('Nothing has been sent'),'no fake delivery confirmation');
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.getByRole('button',{name:'Copy message instead'}).click();
 check((await page.evaluate(()=>navigator.clipboard.readText())).includes('Test & QA'),'copy fallback contains complete message');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
 await page.getByRole('button',{name:'Copy message instead'}).click();
 check((await page.locator('#draft-status').innerText()).includes('Select and copy'),'denied clipboard offers manual copy');
 const manifest=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../assets/photos/manifest.json'),'utf8'));
 check(manifest.length===29 && manifest.every(p=>!p.source.includes('23-23-22')&&p.full[0]<=p.original[0]&&p.full[1]<=p.original[1]),'29 supplied photos, no screenshot or upscaling');
 for(const entry of manifest) check(await page.locator(`a[href="assets/photos/${entry.name}.webp"]`).count()>0,'full scene reachable: '+entry.name);
 await page.locator('.more-photos summary').click(); await page.locator('.service-photos summary').click();
 for(const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(e=>e.decode()); }
 check(await page.locator('main img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),'all lazy images load after expansion and scroll');
 for(const a of await page.locator('a[href^="#"]').all())check(await a.evaluate(e=>!!document.querySelector(e.getAttribute('href'))),'internal link target exists');
 check(await page.locator('a[href^="tel:"]').evaluateAll(es=>es.length>0&&es.every(e=>e.getAttribute('href')==='tel:+19896733828')),'all telephone links match supplied number');
 check((await page.locator('#contact').innerText()).includes('Saturday & Sunday · call to confirm'),'weekend hours call to confirm');
 check((await page.locator('a[href*="maps/dir"]').getAttribute('href')).includes('1900+W+Caro+Rd+Caro+MI+48723'),'directions use supplied address');
 const contrast=async()=>page.locator('.primary').evaluateAll(es=>es.map(e=>{
 const s=getComputedStyle(e),lum=c=>{const v=c.match(/\d+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return .2126*v[0]+.7152*v[1]+.0722*v[2]};const a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}));
 check((await contrast()).every(n=>n>=4.5),'gold buttons have >=4.5 normal contrast');
 for(const button of await page.locator('.primary').all()){await button.hover();check((await contrast()).every(n=>n>=4.5),'gold hover contrast >=4.5');}
 await page.goto(base);
 const output=process.env.SCREENSHOT_DIR||require('node:path').join(__dirname,'../tests');fs.mkdirSync(output,{recursive:true});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});await page.screenshot({path:`${output}/audit-${width}.png`,fullPage:true});await page.screenshot({path:`${output}/audit-${width}-viewport.png`});}
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const native=await nojs.newPage();await native.goto(base);
 await native.locator('.more-photos summary').click();check(await native.locator('.more-photos').evaluate(e=>e.open),'no-JS more photos disclosure works');
 await Promise.all([native.waitForURL('**/*.webp'),native.locator('#work .photo-link').first().click()]);check(native.url().endsWith('.webp'),'no-JS gallery opens native image');await nojs.close();
 check(errors.length===0,'no JavaScript errors');
 console.log(`RESULT: ${checks} checks passed`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
