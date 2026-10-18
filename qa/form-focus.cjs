// Checks the CSS trigger for iOS focus zoom; desktop emulation cannot reproduce the native keyboard.
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dylan/Downloads/study-spot/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch();
  try {
    const page=await browser.newPage();
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      await page.goto(process.env.BASE_URL||'http://127.0.0.1:4189/');
      const fields=page.locator('.quote-panel input, .quote-panel textarea');
      assert.ok(await fields.count()>=5,'Expected quote and draft fields');
      for(const field of await fields.all()){
        await field.focus();
        const info=await field.evaluate(e=>({name:e.name||e.id,size:parseFloat(getComputedStyle(e).fontSize)}));
        assert.ok(info.size>=16,`${width}px ${info.name}: ${info.size}px text triggers iOS focus zoom`);
        await field.blur();
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      const viewport=await page.locator('meta[name="viewport"]').getAttribute('content');
      assert.ok(!/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\D|$)/i.test(viewport),'Keep pinch zoom enabled');
      console.log(`PASS ${width}px: all quote/draft fields >=16px, focus/blur, no overflow, pinch zoom unrestricted`);
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
