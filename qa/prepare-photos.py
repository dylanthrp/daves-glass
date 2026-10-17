"""Rebuild supplied photo derivatives; originals remain outside this repository."""
from pathlib import Path
from PIL import Image, ImageOps
import json
ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path.home() / 'AppData/Roaming/Hermes/composer-images'
NAMES = ['shop-and-van','roof-skylight','service-counter-window','office-sliding-door','country-view-storefront','commercial-window-band','arched-brick-entry','stained-glass-window','industrial-facade','sawtooth-glass-facade','reflective-entry','corner-curtain-wall','shower-dark-handle','shower-sloped-ceiling','shower-white-subway','shower-wraparound','shower-black-frame','shower-gray-subway','shower-chrome-handle','shower-marble-corner','shower-black-slider','shower-teal-mosaic','mirrors','commercial-door-repair','table-tops','seal-failure','screens','window-repairs','auto-glass-illustration']
CAPTIONS = ['Dave’s Glass service van at a commercial building','Roof skylight','Sliding glass service-counter window','Sliding glass office door','Country View storefront','Horizontal commercial windows','Arched storefront entry in brick','Stained glass window','Industrial glass facade','Glass facade beneath a sawtooth roof','Commercial entry with reflective glass','Reflective corner curtain wall','Glass shower with dark handle and gray-brown tile','Frameless shower beneath a sloped ceiling','White subway tile shower with black handle','Wraparound shower glass above a half wall','Black-framed corner shower','Shower with gray subway tile','Gray tiled shower with chrome handle','Marble-look corner shower','Black sliding shower door','Shower with teal mosaic tile','Bathroom mirror — service illustration','Commercial door repair — service illustration','Glass tabletop — service illustration','Fogged residential window, seal failure — service illustration','Screen rolls — service illustration','Broken window — repair service illustration','Technicians installing a windshield — service illustration']
def main():
    files=sorted(SOURCE.glob('composer_2026-10-17_23-*.png'))
    assert len(files)==30 and '23-23-22' in files[-1].name
    out=ROOT/'assets/photos'; out.mkdir(exist_ok=True)
    manifest=[]
    for source,name,caption in zip(files[:29],NAMES,CAPTIONS):
        original=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        full=original.copy(); full.thumbnail((1600,1600)); full.save(out/f'{name}.webp',quality=85,method=6)
        thumb=original.copy(); thumb.thumbnail((600,600)); thumb.save(out/f'{name}-thumb.webp',quality=80,method=6)
        manifest.append(dict(source=source.name,name=name,caption=caption,original=list(original.size),full=list(full.size),thumbnail=list(thumb.size)))
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(f'Prepared {len(manifest)} supplied photos, full scene + thumbnail; excluded screenshot #30.')
if __name__=='__main__': main()
