"""Maintenance helper for static HTML. No build step needed to serve the site."""
from pathlib import Path
import json, html
root=Path(__file__).resolve().parents[1]
photos=json.loads((root/'assets/photos/manifest.json').read_text(encoding='utf-8'))
def image(i,thumb=True):
 p=photos[i]; size=p['thumbnail' if thumb else 'full']; return f'<img src="assets/photos/{p["name"]}{"-thumb" if thumb else ""}.webp" alt="{html.escape(p["caption"])}" width="{size[0]}" height="{size[1]}" loading="lazy">'
def gallery(i):
 p=photos[i]; return f'<figure><a class="photo-link" href="assets/photos/{p["name"]}.webp" aria-label="Enlarge: {html.escape(p["caption"])}">{image(i)}</a><figcaption>{html.escape(p["caption"])}</figcaption></figure>'
featured=[4,12,6,14,11,20]
services=[('commercial','Commercial glass','Storefronts, entrance doors and glass for business spaces.',4),('residential','Residential glass','Window glass replacement and repairs, including fogged panes.',25),('shower','Shower enclosures','Glass enclosures and doors to suit your bathroom.',14),('auto','Auto glass','Windshield replacement and auto glass repairs.',None)]
auto_image='<img src="assets/photos/img-0268.jpg" alt="Auto windshield installation" loading="lazy">'
commercial_image='<img src="assets/photos/country-view-entrance-hero.webp" alt="Country View storefront" width="1098" height="1432" loading="lazy">'
residential_image='<img src="assets/photos/residential-window-condensation.webp" alt="Condensation on a white-framed residential window" width="1543" height="1019" loading="lazy">'
service_html=''.join(f'<article id="service-{key}">{commercial_image if key == "commercial" else residential_image if key == "residential" else image(i) if i is not None else auto_image}<div><h3>{title}</h3><p>{desc}</p></div></article>' for key,title,desc,i in services)
extras=''.join(f'<article>{image(i)}<h3>{title}</h3></article>' for i,title in zip(range(22,28),['Mirrors','Commercial door repair','Glass table tops','Seal failure','Screens','Window repairs']))
page='''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dave's Glass | Glass repair &amp; installation in Caro, Michigan</title>
<meta name="description" content="Commercial, residential, shower and auto glass in Caro, Michigan. Dave's Glass, established 1978, serving the Greater Thumb.">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#0F2640">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap">
<link rel="icon" href="assets/logo.png"><link rel="stylesheet" href="assets/site.css">
<script src="assets/site.js" defer></script></head>
<body id="top"><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap header-inner">
<a class="brand" href="#top"><img src="assets/logo.png" width="56" height="44" alt=""><span>Dave’s <strong>Glass</strong></span></a>
<nav aria-label="Main navigation"><a href="#services">Services</a><a href="#work">Our Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
<div class="header-actions"><a class="btn outline" href="tel:+19896733828">Call</a><a class="btn primary" href="#contact">Get a quote</a></div>
</div></header>
<main id="main">
<section class="hero"><figure class="hero-photo">HERO</figure><div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow">Dave’s Glass · Caro, MI</p>
<h1>Glass repair &amp; installation in Caro, Michigan</h1>
<p class="lede">For your home, your business and your vehicle. Tell us what you’re working on.</p>
<a class="btn primary" href="#contact">Get a quote</a> <a class="text-link" href="#work">Explore our work →</a>
</div></div><p class="hero-caption">Commercial glass · Country View storefront</p></section>
<div class="heritage"><div class="wrap">Established 1978 <span aria-hidden="true">/</span> Serving Michigan’s Greater Thumb</div></div>
<section id="services" class="section wrap"><p class="eyebrow">What we do</p><h2>One glass shop. Four ways to help.</h2>
<p class="section-intro">From a damaged pane to a new glass enclosure, start with a call to our Caro shop.</p>
<div class="service-grid">SERVICES</div><p class="small">Service illustrations shown above. Explore project photos below.</p></section>
<section id="work" class="section work"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Our work</p><h2>A closer look at the glass.</h2></div><p>Storefronts, architectural glass and shower enclosures.<br>Choose a photo to view the full scene.</p></div>
<div class="gallery-grid">FEATURED</div>
<details class="more-photos"><summary>Explore more photos</summary><div class="gallery-grid">MORE</div></details>
</div></section>
<section id="about" class="section wrap about"><div><p class="eyebrow">About Dave’s Glass</p><h2>In Caro since 1978.</h2><p>Dave’s Glass serves Michigan’s Greater Thumb with commercial, residential, shower and auto glass services. Visit the shop on West Caro Road or get in touch to discuss your project.</p></div><figure><a class="photo-link" href="assets/photos/shop-and-van.webp" aria-label="Enlarge: Dave’s Glass service van at a commercial building">SHOP</a><figcaption>Dave’s Glass service van at a commercial building</figcaption></figure></section>
<section id="extras" class="section wrap extras"><p class="eyebrow">Other services</p><h2>It’s not always a whole new window.</h2><div class="extras-grid">EXTRAS</div>
<details class="service-photos"><summary>View service illustrations</summary><p class="small">These labeled images illustrate services, rather than a project portfolio.</p><div class="gallery-grid illustrations">ILLUSTRATIONS</div></details></section>
<section id="contact" class="section contact"><div class="wrap"><p class="eyebrow">Let’s talk glass</p><h2>What can we help you with?</h2>
<div class="contact-layout"><div class="contact-grid">
<div class="contact-card"><h3>Call the shop</h3><a class="contact-phone" href="tel:+19896733828">(989) 673-3828</a><p>Monday–Friday · 8 AM–5 PM<br>Saturday &amp; Sunday · call to confirm</p></div>
<div class="contact-card"><h3>Email</h3><a class="contact-email" href="mailto:office@davesglassllc.com">office@davesglassllc.com</a><p>Share your project details. You can attach photos in your email app.</p></div>
<div class="contact-card"><h3>Visit Dave’s Glass</h3><address>1900 W Caro Rd<br>Caro, MI 48723</address><a href="https://www.google.com/maps/dir/?api=1&amp;destination=1900+W+Caro+Rd+Caro+MI+48723">Get directions →</a></div></div>
<div class="quote-panel"><h3>Start a quote by email</h3><p id="email-help">This form opens your email app. Your message is not sent until you send it there. There is no online submission.</p>
<form id="quoteForm" action="mailto:office@davesglassllc.com" method="post" enctype="text/plain" aria-describedby="email-help">
<div class="form-pair"><label>Name<input id="qf-name" name="name" required autocomplete="name" maxlength="100"></label><label>Phone<input id="qf-phone" name="phone" type="tel" required autocomplete="tel" maxlength="40"></label></div>
<label>ZIP code (optional)<input id="qf-zip" name="zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="postal-code"></label>
<label>What can we help with?<textarea id="qf-msg" name="message" rows="4" required maxlength="2500"></textarea></label>
<button class="btn primary" type="submit">Open email draft</button>
</form>
<noscript><p>You can use the form with your email app, or copy your details into an email to office@davesglassllc.com.</p></noscript>
<div class="draft-tools" hidden><button class="copy-draft text-button" type="button">Copy message instead</button><p class="small">No email app? Copy the message into your webmail and send it to office@davesglassllc.com. Your fields stay here.</p><label for="draft-text">Email text to copy</label><textarea id="draft-text" readonly rows="5"></textarea><p id="draft-status" role="status"></p></div>
</div></div></div></section></main>
<footer><div class="wrap footer-inner"><a class="brand" href="#top"><img src="assets/logo.png" width="56" height="44" alt=""><span>Dave’s <strong>Glass</strong></span></a><p>Established 1978 · Greater Thumb, Michigan</p><a href="#contact">Contact &amp; hours ↑</a></div></footer>
<dialog id="lightbox" aria-label="Enlarged photo"><button class="close-lightbox" type="button" aria-label="Close enlarged photo">Close ×</button><figure><img alt=""><figcaption id="lightbox-caption"></figcaption></figure></dialog>
</body></html>'''
page=page.replace('HERO','<img src="assets/photos/country-view-entrance-hero.webp" alt="Country View storefront" width="1098" height="1432" fetchpriority="high">').replace('SERVICES',service_html).replace('FEATURED',''.join(map(gallery,featured))).replace('MORE',''.join(gallery(i) for i in range(1,22) if i not in featured)).replace('SHOP',image(0)).replace('EXTRAS',extras).replace('ILLUSTRATIONS',''.join(gallery(i) for i in range(22,29)))
(root/'index.html').write_text(page,encoding='utf-8')
