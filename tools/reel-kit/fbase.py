import json,asyncio,os,re
ROOT='/home/claude/build';NM=f'file://{ROOT}/node_modules/@fontsource'
FONTS="".join(f'<link rel="stylesheet" href="{NM}/{p}">' for p in ["instrument-serif/400.css","inter/300.css","inter/400.css","inter/500.css","amiri/400.css","amiri/700.css","ibm-plex-sans-arabic/300.css","ibm-plex-sans-arabic/400.css"])
INK="#1A1410";ESP="#1C1511";RED="#B8231B";RDK="#E2402F";CREAM="#F4EEE6"
GRAIN=("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")
CSS=f"""*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden;background:transparent}}
.s{{position:relative;width:1080px;height:1920px;overflow:hidden}}.grain{{position:absolute;inset:0;background:{GRAIN};opacity:.2;mix-blend-mode:overlay}}
.h{{position:absolute;left:90px;right:90px;top:250px;direction:rtl;text-align:right;font-family:Amiri,serif;font-size:96px;line-height:1.3}}
.h b{{font-weight:400}}.sub{{position:absolute;left:90px;right:90px;direction:rtl;text-align:right;font-family:'IBM Plex Sans Arabic';font-weight:300;font-size:44px;line-height:1.6}}
.note{{position:absolute;direction:rtl;font-family:Amiri,serif;font-size:62px;transform:rotate(-3deg);white-space:nowrap}}
.lab{{font-family:'IBM Plex Sans Arabic';font-size:40px;direction:rtl}}"""
page=lambda b:f"<!doctype html><html><head><meta charset='utf-8'>{FONTS}<style>{CSS}</style></head><body>{b}</body></html>"
def H(t,dark,top=250,size=96):
    t=re.sub(r"\*(.+?)\*",lambda m:f"<span style='color:{RDK if dark else RED}'>{m.group(1)}</span>",t)
    return f"<div class='h' style='top:{top}px;font-size:{size}px;color:{CREAM if dark else INK}'>{t}</div>"
def note(t,dark,css): return f"<div class='note' style='{css};color:{RDK if dark else RED}'>{t}</div>"
def sub(t,dark,top): return f"<div class='sub' style='top:{top}px;color:{CREAM if dark else '#3a322c'}'>{t}</div>"
def bg(dark,inner):
    b=ESP if dark else '#fff'
    pap="" if dark else "<div style='position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#fffdf9 55%,#f3ece3 100%)'></div>"
    return page(f"<div class='s' style='background:{b}'>{pap}{inner}<div class='grain'></div></div>")
# bodygraph
CEN={"head":"150,10 112,62 188,62","ajna":"112,76 188,76 150,128","g":"150,204 184,238 150,272 116,238","ego":"192,262 226,244 226,282","spleen":"34,298 34,374 88,336","solar":"266,298 266,374 212,336"}
SQ={"throat":(124,142),"sacral":(124,306),"root":(124,384)}
LN={"ajna-throat":(150,128,150,142),"throat-g":(150,194,150,204),"g-sacral":(150,272,150,306),"sacral-root":(150,358,150,384),"sacral-spleen":(124,332,88,336),"root-spleen":(124,410,70,360),"root-solar":(176,410,230,360),"throat-spleen":(124,180,60,310),"throat-solar":(176,180,240,310),"g-ego":(184,238,200,262),"sacral-solar":(176,332,212,336),"head-ajna":(150,62,150,76)}
def bodygraph(w,ink,filled={},lines={},dim=False):
    o=.35 if dim else 1
    s=f"<svg width='{w}' viewBox='-10 0 320 450' style='overflow:visible;opacity:{o}'>"
    for k,(a,b,c,d) in LN.items():
        col=lines.get(k)
        if col=='striped':
            s+=f"<line x1='{a}' y1='{b}' x2='{c}' y2='{d}' stroke='{ink}' stroke-width='9'/><line x1='{a}' y1='{b}' x2='{c}' y2='{d}' stroke='{RED}' stroke-width='9' stroke-dasharray='5 5'/>"
        elif col: s+=f"<line x1='{a}' y1='{b}' x2='{c}' y2='{d}' stroke='{RED if col=='red' else ink}' stroke-width='9'/>"
        else: s+=f"<line x1='{a}' y1='{b}' x2='{c}' y2='{d}' stroke='{ink}' stroke-width='2' opacity='.3'/>"
    for k,p in CEN.items():
        f=filled.get(k); s+=f"<polygon points='{p}' fill='{f or 'none'}' stroke='{ink}' stroke-width='2.5' opacity='{1 if f else .6}'/>"
    for k,(x,y) in SQ.items():
        f=filled.get(k); s+=f"<rect x='{x}' y='{y}' width='52' height='52' rx='4' fill='{f or 'none'}' stroke='{ink}' stroke-width='2.5' opacity='{1 if f else .6}'/>"
    return s+"</svg>"
GL="☉ ⊕ ☽ ☊ ☋ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇".split()
DES="41.3 31.3 7.5 30.2 29.2 60.1 19.4 54.6 13.2 49.1 26.4 10.6 58.3".split()
PER="1.2 2.2 8.4 14.5 8.5 43.1 34.6 20.3 56.2 11.5 25.1 51.3 44.2".split()
def col(vals,color,op=1,hi=False):
    box=f"border:4px solid {color};border-radius:14px;" if hi else "border:4px solid transparent;"
    rows="".join(f"<div style='display:flex;gap:14px;align-items:center;font-family:Inter;font-size:34px;line-height:1.45;color:{color}'><span style=\"font-family:'DejaVu Sans';font-size:30px\">{g}</span><b style='font-weight:500'>{v}</b></div>" for g,v in zip(GL,vals))
    return f"<div style='opacity:{op};padding:14px 18px;{box}'>{rows}</div>"
FILL={"throat":"#8a7f76","g":"#8a7f76","ajna":"#8a7f76","sacral":"#8a7f76","spleen":"#8a7f76"}
def chart(mode,dark=False,top=620):
    ink=CREAM if dark else INK
    rc=col(DES,RED,1 if mode in('both','red') else .25,mode=='red')
    bc=col(PER,ink,1 if mode in('both','black') else .25,mode=='black')
    lines={"throat-g":'black',"sacral-spleen":'red',"g-sacral":'striped',"ajna-throat":'black'} if mode!='plain' else {}
    return f"<div style='position:absolute;top:{top}px;left:40px;right:40px;display:flex;justify-content:space-between;align-items:center'>{rc}<div>{bodygraph(430,ink,{},lines)}</div>{bc}</div>"
def bubble(t,side,top,dark=False):
    bgc='#efe7dc' if side=='l' else INK; fg=INK if side=='l' else CREAM
    pos='left:110px' if side=='l' else 'right:110px'
    return f"<div style='position:absolute;{pos};top:{top}px;max-width:720px;background:{bgc};color:{fg};border-radius:40px;padding:26px 40px;direction:rtl;font-family:\"IBM Plex Sans Arabic\";font-size:48px'>{t}</div>"
F={}
F['1a']=bg(True,H("خريطتك انحسبت *مرّتين*.",True,560,120)+"<div style='position:absolute;top:1020px;left:0;right:0;display:flex;justify-content:center;gap:120px'><div style='width:150px;height:150px;border-radius:50%;background:#f4eee6'></div><div style='width:150px;height:150px;border-radius:50%;background:#E2402F'></div></div>"+note("(مش غلطة مطبعية)",True,"left:120px;top:1240px"))
tl="<svg width='900' height='300' style='position:absolute;left:90px;top:760px' viewBox='0 0 900 300'><line x1='60' y1='150' x2='840' y2='150' stroke='%s' stroke-width='4'/><circle cx='780' cy='150' r='30' fill='%s'/><circle cx='160' cy='150' r='30' fill='%s'/><path d='M780 110 C 600 0, 340 0, 160 110' stroke='%s' stroke-width='4' fill='none' stroke-dasharray='12 10'/></svg>"%(INK,INK,RED,RED)
F['1b']=bg(False,H("مرّة *بالولادة*،<br>ومرّة قبلها بـ٣ أشهر.",False,250,90)+tl+f"<div class='lab' style='position:absolute;top:960px;right:150px;color:{INK}'>لحظة الولادة</div><div class='lab' style='position:absolute;top:960px;left:110px;color:{RED}'>حوالي ٣ أشهر قبل</div>"+note("(تقريبًا 88 يوم)",False,"right:140px;top:1150px"))
F['1c']=bg(False,H("وإنت بعدك *ولا شي*…",False,250,100)+bubble("سمّوها نور!",'l',620)+bubble("لأ، ياسمين!",'r',800)+bubble("على إسم ستّها!",'l',980)+bubble("ما في حدا بيسمعني؟",'r',1160)+note("(وإنت ولا خبر عندك)",False,"left:150px;top:1340px"))
F['2a']=bg(False,H("*عمودين* أرقام.",False,250,110)+sub("شوف الـ chart تبعك: عمود عاليمين، وعمود عالشمال.",False,420)+chart('both')+note("(شيّك خريطتك هلّق)",False,"right:120px;top:1330px"))
F['2b']=bg(False,H("الأسود = *Personality*",False,250,100)+sub("لحظة ولادتك · يلي بتعرفو عن حالك",False,410)+chart('black')+note("(يلي بتخبّرو بالـ first date)",False,"left:110px;top:1330px"))
F['3a']=bg(False,H("الأحمر = *Design*",False,250,100)+sub("الجهة يلي ما بتشوفها بسهولة",False,410)+chart('red')+note("(الجهة الخفيّة)",False,"right:120px;top:1330px"))
arc=f"<svg width='700' height='700' style='position:absolute;left:190px;top:520px' viewBox='0 0 800 800'><circle cx='400' cy='400' r='300' fill='none' stroke='{INK}' stroke-width='3' opacity='.35'/><path d='M400 100 A300 300 0 0 0 100.4 413' stroke='{RED}' stroke-width='10' fill='none'/><circle cx='400' cy='100' r='44' fill='{INK}'/><circle cx='100' cy='413' r='44' fill='{RED}'/><text x='300' y='290' font-family='Inter' font-size='64' fill='{RED}'>88°</text></svg>"
F['3b']=bg(False,H("الشمس *88 درجة* لورا.",False,250,100)+arc+f"<div class='lab' style='position:absolute;top:560px;right:230px;color:{INK}'>الولادة</div><div class='lab' style='position:absolute;top:960px;left:60px;color:{RED};width:200px'>الـ Design</div>"+sub("يعني تقريبًا 88 يوم قبل ما تطلّ عالدني.",False,1200)+note("(حساب، مش سحر)",False,"left:110px;top:420px"))
F['3c']=bg(False,H("الأحمر هوّي *جسمك*.",False,250,100)+sub("الشغلات يلي بتعملها بلا ما تقرّر،<br>والناس بيشوفوها فيك قبلك.",False,410)+f"<div style='position:absolute;top:640px;left:0;right:0;display:flex;justify-content:center'>{bodygraph(520,INK,{'spleen':RED,'sacral':RED},{'sacral-spleen':'red'})}</div>"+note("(رفقاتك بيعرفو)",False,"right:120px;top:1330px"))
def legend(items):
    out="";y=700
    for col_,lab in items:
        if col_=='striped': ln=f"<svg width='300' height='30'><line x1='0' y1='15' x2='300' y2='15' stroke='{INK}' stroke-width='16'/><line x1='0' y1='15' x2='300' y2='15' stroke='{RED}' stroke-width='16' stroke-dasharray='16 16'/></svg>"
        else: ln=f"<svg width='300' height='30'><line x1='0' y1='15' x2='300' y2='15' stroke='{RED if col_=='red' else INK}' stroke-width='16'/></svg>"
        out+=f"<div style='position:absolute;top:{y}px;left:90px;right:90px;display:flex;flex-direction:row-reverse;align-items:center;gap:40px'>{ln}<div class='lab' style='color:{RED if col_=='red' else INK};font-size:46px'>{lab}</div></div>";y+=230
    return out
L=[('black','أسود: إنت واعي عليه'),('red','أحمر: فيك، بس ما بتشوفو'),('striped','مخطّط: بالجهتين، من أقوى شغلاتك')]
F['4a']=bg(False,H("كل خط *إلو لون*.",False,250,110)+legend(L[:1])+note("(بتعرفو عن حالك)",False,"left:120px;top:1330px"))
F['4b']=bg(False,H("كل خط *إلو لون*.",False,250,110)+legend(L[:2])+note("(النقطة العميا)",False,"left:120px;top:1330px"))
F['4c']=bg(False,H("كل خط *إلو لون*.",False,250,110)+legend(L)+note("(هون القوّة)",False,"left:120px;top:1330px"))
F['5a']=bg(False,H("الكل بيقلّك *إنك هيك*؟",False,250,100)+bubble("إنت كتير عنيد.",'l',620)+bubble("دايمًا بتهتمّ بالكل.",'l',800)+bubble("أنا؟ لأ أبدًا.",'r',990)+note("(إنكار كامل)",False,"right:130px;top:1200px"))
F['5b']=bg(False,H("روح تطّلع *عالأحمر*.",False,250,100)+chart('red',False,560)+note("(للأسف معن حق)",False,"left:110px;top:1300px"))
F['6']=bg(True,H("الاتنين *إنت*.",True,330,140)+f"<div style='position:absolute;top:720px;left:0;right:0;display:flex;justify-content:center'>{bodygraph(500,CREAM,{'g':RDK,'throat':CREAM,'sacral':RDK},{'throat-g':'black','g-sacral':'striped','ajna-throat':'black','sacral-spleen':'red'})}</div><div style='position:absolute;bottom:230px;left:0;right:0;text-align:center;font-family:Inter;font-size:30px;letter-spacing:.12em;color:#a99d93'>humanbydesign.global</div>"+note("(تعرّف عالاتنين)",True,"left:120px;top:560px"))
# fix: striped on dark uses ink=CREAM; fine
