import json,asyncio,re
exec(open('fbase.py').read().split('# bodygraph')[0])
FONTS2=FONTS+f'<link rel="stylesheet" href="{NM}/inter/700.css">'
S=json.load(open('subs.json')); DARK={'1a','6'}
def html(s):
    d=s['frame'] in DARK
    col=CREAM if d else INK; em=RDK if d else RED
    t=re.sub(r"\*(.+?)\*",lambda m:f"<span style='color:{em}'>{m.group(1)}</span>",s['text'])
    return (f"<!doctype html><html><head><meta charset='utf-8'>{FONTS2}<style>*{{margin:0}}html,body{{width:1080px;height:1920px;background:transparent}}</style></head><body>"
            f"<div style='position:absolute;left:70px;width:860px;top:1385px;height:170px;display:flex;align-items:center;justify-content:center'>"
            f"<div style='font-family:Inter;font-weight:700;font-size:62px;line-height:1.12;letter-spacing:-.01em;text-align:center;color:{col}'>{t}</div></div></body></html>")
async def main():
    from playwright.async_api import async_playwright
    import os; os.makedirs('sub2',exist_ok=True)
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path='/usr/bin/google-chrome');pg=await b.new_page(viewport={'width':1080,'height':1920})
        for i,s in enumerate(S):
            open('_s.html','w').write(html(s));await pg.goto('file:///home/claude/reel1/_s.html');await pg.evaluate('document.fonts.ready')
            await pg.screenshot(path=f'sub2/{i:02d}.png',omit_background=True)
        await b.close()
asyncio.run(main())
