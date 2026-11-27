import asyncio, json, os, re, sys
exec(open('/home/claude/reel1/fbase.py').read())
exec(open('/home/claude/reel1/seal.py').read())
FONTS += f'<link rel="stylesheet" href="{NM}/amiri/400-italic.css">'
page = lambda b: f"<!doctype html><html><head><meta charset='utf-8'>{FONTS}<style>{CSS}</style></head><body>{b}</body></html>"

# ---------------- Cici's real chart: 7 Jan 1991, 18:30, Beirut (hd-engine) ----------------
PGL = "☉ ⊕ ☊ ☋ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇".split()
PER = "54.2 53.2 60.2 56.2 57.1 11.3 41.2 8.4 33.4 60.1 38.1 38.6 43.1".split()
DES = "57.4 51.4 41.3 31.3 31.4 48.3 48.5 35.3 33.3 54.5 58.3 38.3 1.4".split()
PG = {int(v.split('.')[0]) for v in PER}; DG = {int(v.split('.')[0]) for v in DES}
def gstate(g):
    p, d = g in PG, g in DG
    return 'both' if p and d else 'black' if p else 'red' if d else None
DEFINED = {'ajna', 'throat', 'g'}

GP = {64:(175,95),61:(200,95),63:(225,95),
 47:(175,125),24:(200,125),4:(225,125),17:(172,160),11:(228,160),43:(200,195),
 62:(178,235),23:(200,235),56:(222,235),16:(160,252),20:(160,280),35:(240,250),12:(240,268),45:(240,290),31:(180,315),8:(200,315),33:(220,315),
 1:(200,345),7:(180,365),13:(220,365),10:(140,405),25:(260,405),15:(180,445),46:(220,445),2:(200,465),
 21:(305,430),51:(280,446),26:(292,462),40:(328,462),
 5:(178,520),14:(200,520),29:(222,520),34:(160,537),27:(160,582),59:(240,582),42:(178,600),3:(200,600),9:(222,600),
 53:(178,635),60:(200,635),52:(222,635),54:(160,655),38:(160,677),58:(160,699),19:(240,655),39:(240,677),41:(240,699),
 48:(34,490),57:(55,505),44:(80,522),50:(110,545),32:(80,580),28:(55,598),18:(34,612),
 36:(366,490),22:(345,505),37:(320,522),6:(290,545),49:(320,580),55:(345,598),30:(366,612)}
CH = [(1,8),(2,14),(3,60),(4,63),(5,15),(6,59),(7,31),(9,52),(10,20),(10,34),(10,57),(11,56),(12,22),(13,33),(16,48),(17,62),(18,58),(19,49),(20,34),(20,57),(21,45),(23,43),(24,61),(25,51),(26,44),(27,50),(28,38),(29,46),(30,41),(32,54),(34,57),(35,36),(37,40),(39,55),(42,53),(47,64)]
CSHAPE = {'head':"200,15 150,95 250,95",'ajna':"150,125 250,125 200,205",'g':"200,345 260,405 200,465 140,405",
 'heart':"275,447 336,414 331,470",'spleen':"28,478 28,622 122,550",'solar':"372,478 372,622 278,550"}
CSQ = {'throat':(160,235),'sacral':(160,520),'root':(160,635)}
CENTROID = {'head':(200,68),'ajna':(200,150),'throat':(200,275),'g':(200,405),'heart':(314,444),'sacral':(200,560),'root':(200,675),'spleen':(60,550),'solar':(340,550)}
GC = {}
for c, gs in {'head':[64,61,63],'ajna':[47,24,4,17,43,11],'throat':[62,23,56,35,12,45,33,8,31,20,16],'g':[7,1,13,10,25,46,2,15],'heart':[21,40,26,51],'spleen':[48,57,44,50,32,28,18],'solar':[6,37,22,36,30,55,49],'sacral':[5,14,29,59,9,3,42,27,34],'root':[53,60,52,19,39,41,58,38,54]}.items():
    for g in gs: GC[g] = c
BEND = {(20,34):(118,405)}

def hd_chart(w, dark=False, focus=None, fill_def=True, nums=True):
    """focus: None (all), 'black', 'red', 'both' -> dims the other colours."""
    ink = CREAM if dark else INK; red = RDK if dark else RED
    lo = .14
    def op(st): return 1 if focus is None or st == focus else lo
    s = f"<svg width='{w}' viewBox='10 0 380 730' style='overflow:visible'>"
    # empty channels
    for a, b in CH:
        (x1,y1),(x2,y2) = GP[a], GP[b]
        if (a,b) in BEND:
            bx,by = BEND[(a,b)]; d = f"M{x1},{y1} Q{bx},{by} {x2},{y2}"
        else: d = f"M{x1},{y1} L{x2},{y2}"
        s += f"<path d='{d}' stroke='{ink}' stroke-opacity='{.45 if dark else .38}' stroke-width='11' fill='none'/>"
        s += f"<path d='{d}' stroke='{ESP if dark else '#fffdf9'}' stroke-width='7.5' fill='none'/>"
    # coloured halves (half channel from each activated gate)
    def half(g, other, st):
        (x1,y1),(x2,y2) = GP[g], GP[other]
        mx,my = (x1+x2)/2,(y1+y2)/2
        o = op(st)
        if st == 'black': return f"<line x1='{x1}' y1='{y1}' x2='{mx}' y2='{my}' stroke='{ink}' stroke-width='8' opacity='{o}'/>"
        if st == 'red': return f"<line x1='{x1}' y1='{y1}' x2='{mx}' y2='{my}' stroke='{red}' stroke-width='8' opacity='{o}'/>"
        return (f"<g opacity='{o}'><line x1='{x1}' y1='{y1}' x2='{mx}' y2='{my}' stroke='{ink}' stroke-width='8'/>"
                f"<line x1='{x1}' y1='{y1}' x2='{mx}' y2='{my}' stroke='{red}' stroke-width='8' stroke-dasharray='5 5'/></g>")
    for a, b in CH:
        for g, o_ in ((a,b),(b,a)):
            st = gstate(g)
            if st: s += half(g, o_, 'both' if st == 'both' else st)
    # centres
    fdef = ('#6b5546' if dark else '#D9C6AE')
    for k, p in CSHAPE.items():
        f = fdef if (fill_def and k in DEFINED) else ('none' if dark else '#fffdf9')
        s += f"<polygon points='{p}' fill='{f}' stroke='{ink}' stroke-width='2.4' stroke-linejoin='round'/>"
    for k, (x, y) in CSQ.items():
        f = fdef if (fill_def and k in DEFINED) else ('none' if dark else '#fffdf9')
        s += f"<rect x='{x}' y='{y}' width='80' height='80' rx='6' fill='{f}' stroke='{ink}' stroke-width='2.4'/>"
    if nums:
        for g, (x, y) in GP.items():
            cx, cy = CENTROID[GC[g]]; dx, dy = cx-x, cy-y; L = (dx*dx+dy*dy) ** .5 or 1
            tx, ty = x + dx/L*12, y + dy/L*12 + 3.5
            st = gstate(g)
            hl = st is not None and (focus is None or (st == focus))
            s += f"<text x='{tx:.1f}' y='{ty:.1f}' text-anchor='middle' font-family='Inter' font-size='9.5' font-weight='{600 if hl else 400}' fill='{ink}' opacity='{1 if hl else .5}'>{g}</text>"
    return s + "</svg>"

def colv(vals, color, op=1, hi=False, side='l'):
    box = f"border:4px solid {color};border-radius:16px;" if hi else "border:4px solid transparent;"
    rows = "".join(f"<div style='display:flex;gap:12px;align-items:center;font-family:Inter;font-size:33px;line-height:1.46;color:{color}'><span style=\"font-family:'DejaVu Sans';font-size:28px;width:30px;text-align:center\">{g}</span><b style='font-weight:500'>{v}</b></div>" for g, v in zip(PGL, vals))
    return f"<div style='opacity:{op};padding:12px 16px;{box}'>{rows}</div>"
def chart(mode, dark=False, top=545):
    ink = CREAM if dark else INK
    rc = colv(DES, RED, 1 if mode in ('both','red') else .25, mode == 'red')
    bc = colv(PER, ink, 1 if mode in ('both','black') else .25, mode == 'black')
    focus = {'red':'red','black':'black'}.get(mode)
    return (f"<div style='position:absolute;top:{top}px;left:30px;right:30px;display:flex;justify-content:space-between;align-items:center'>"
            f"{rc}<div>{hd_chart(330, dark, focus)}</div>{bc}</div>"
            f"<div style='position:absolute;top:{top-58}px;left:0;right:0;display:flex;justify-content:space-between;padding:0 64px;font-family:Inter;font-size:24px;letter-spacing:.14em'><span style='color:{RED}'>DESIGN</span><span style='color:{ink}'>PERSONALITY</span></div>")

def caption(t, top, dark=False):
    return f"<div style='position:absolute;left:0;right:0;top:{top}px;text-align:center;font-family:Inter;font-size:26px;letter-spacing:.12em;color:{'#a99d93' if dark else '#8a7f76'}'>{t}</div>"

def arrow(x, y, rot=0, s=1, color=RED):
    return (f"<svg style='position:absolute;left:{x}px;top:{y}px;transform:rotate({rot}deg) scale({s});transform-origin:0 0' width='160' height='120' viewBox='0 0 120 90'>"
            f"<path d='M8 12 C 40 10, 80 30, 100 70' stroke='{color}' stroke-width='4.5' fill='none' stroke-linecap='round'/>"
            f"<path d='M84 64 L101 73 L104 52' stroke='{color}' stroke-width='4.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")

def arr(x1,y1,x2,y2,color=RED,bend=.25):
    import math
    mx,my=(x1+x2)/2,(y1+y2)/2; dx,dy=x2-x1,y2-y1
    cx,cy=mx-dy*bend,my+dx*bend
    a=math.atan2(y2-cy,x2-cx); h=22
    p1=(x2-h*math.cos(a-.45),y2-h*math.sin(a-.45)); p2=(x2-h*math.cos(a+.45),y2-h*math.sin(a+.45))
    return (f"<svg style='position:absolute;left:0;top:0' width='1080' height='1920'><path d='M{x1},{y1} Q{cx},{cy} {x2},{y2}' stroke='{color}' stroke-width='5' fill='none' stroke-linecap='round'/>"
            f"<path d='M{p1[0]:.0f},{p1[1]:.0f} L{x2},{y2} L{p2[0]:.0f},{p2[1]:.0f}' stroke='{color}' stroke-width='5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")
def n2(t, css, size=56):
    return f"<div style='position:absolute;direction:rtl;text-align:center;font-family:Amiri,serif;font-size:{size}px;line-height:1.25;transform:rotate(-4deg);color:{RED};{css}'>{t}</div>"
LTR=lambda t:f"<span dir='ltr' style='unicode-bidi:isolate'>{t}</span>"
def dark_bg(inner):
    return page(f"<div class='s' style='background:#2A1E17'><div style='position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%, rgba(255,190,120,.24), rgba(0,0,0,.6) 78%)'></div>{inner}<div class='grain' style='opacity:.28'></div></div>")

# ---------------- 1a: note card on the warm dark backdrop ----------------
card = f"""<div style='position:absolute;left:130px;top:250px;width:820px;height:900px;background:#fff;transform:rotate(2deg);box-shadow:0 40px 80px rgba(0,0,0,.55)'>
 <div style='position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%, #fffdf9 60%, #efe6da 100%)'></div>
 <div style='position:absolute;right:90px;top:120px;direction:rtl;font-family:Amiri,serif;font-size:58px;color:{RED};transform:rotate(-5deg);white-space:nowrap'>(مش غلطة مطبعية)</div>
 <div style='position:absolute;left:60px;right:90px;top:320px;direction:rtl;text-align:right;white-space:nowrap;font-family:Amiri,serif;font-size:136px;line-height:1.35;color:{INK}'>خريطتك<br>انحسبت <span style=\"padding-bottom:0;background:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 30' preserveAspectRatio='none'><path d='M4 20 C 70 8, 160 26, 296 12' stroke='%23B8231B' stroke-width='8' fill='none' stroke-linecap='round'/></svg>&quot;) no-repeat left 97%/100% 30px\">مرّتين</span>.</div>
 <div style='position:absolute;right:80px;bottom:80px;font-family:Inter;font-size:24px;letter-spacing:.12em;color:#8a7f76'>humanbydesign.global</div>
</div>
<div style='position:absolute;left:60px;top:930px;transform:rotate(10deg)'>{wax_seal(340,'s1',21)}</div>"""
F['1a'] = dark_bg(card)
cov=card.replace("left:130px;top:250px;width:820px;height:900px","left:130px;top:500px;width:820px;height:900px").replace("left:60px;top:930px;transform:rotate(10deg)","left:60px;top:1180px;transform:rotate(10deg)")
cov=cov[:cov.index("<div style='position:absolute;left:60px;top:1180px")]
F['cover'] = dark_bg(cov)


# ---------------- WhatsApp screenshot ----------------
DOODLE = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>"
 "<g fill='none' stroke='%23cfc4b6' stroke-width='2' stroke-linecap='round' opacity='.55'>"
 "<circle cx='30' cy='30' r='12'/><path d='M80 20 l10 18 l-20 0 z'/><path d='M150 25 c10 -12 25 0 12 12 c-8 8 -20 2 -12 -12'/>"
 "<rect x='175' y='60' width='22' height='16' rx='3'/><path d='M20 95 q15 -15 30 0 t30 0'/><path d='M120 85 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2 z'/>"
 "<circle cx='185' cy='130' r='7'/><path d='M40 150 h26 v20 h-26 z M44 150 v-6 h18 v6'/><path d='M100 160 c0 -14 22 -14 22 0 c0 10 -11 16 -11 22 c0 -6 -11 -12 -11 -22'/>"
 "<path d='M160 190 l20 -10 l-6 20'/><circle cx='20' cy='205' r='5'/><path d='M70 205 q10 -10 20 0'/></g></svg>\")")
def wa_bubble(text, out, name=None, ncol=None, time="٩:٤١ م", react=None, first=True):
    bg = '#D9FDD3' if out else '#FFFFFF'
    side = 'flex-end' if out else 'flex-start'   # RTL: incoming on the right (start), outgoing on the left (end)
    tail_side = 'left' if out else 'right'
    tail = (f"<svg width='16' height='22' viewBox='0 0 16 22' style='position:absolute;top:0;{tail_side}:-12px;transform:{'scaleX(-1)' if out else 'none'}'>"
            f"<path d='M0 0 H16 C10 4 6 10 3 22 Z' fill='{bg}'/></svg>") if first else ""
    ticks = ("<svg width='26' height='16' viewBox='0 0 26 16' style='margin-right:6px'><path d='M1 8 l5 5 L15 3' stroke='#53BDEB' stroke-width='2.2' fill='none'/><path d='M9 13 L19 3' stroke='#53BDEB' stroke-width='2.2' fill='none'/></svg>") if out else ""
    nm = f"<div style='font-weight:600;font-size:27px;color:{ncol};margin-bottom:2px'>{name}</div>" if name else ""
    rc = (f"<div style='position:absolute;bottom:-30px;{'right' if out else 'left'}:20px;background:#fff;border-radius:22px;padding:2px 10px;font-size:28px;box-shadow:0 1px 3px rgba(0,0,0,.18);border:2px solid #EFE7DE'>{react}</div>") if react else ""
    return (f"<div style='display:flex;justify-content:{side};margin:{18 if first else 6}px 0 {38 if react else 0}px'>"
            f"<div style='position:relative;max-width:560px;background:{bg};border-radius:{'0 18px 18px 18px' if out and first else '18px 0 18px 18px' if first else '18px'};padding:12px 20px 10px;box-shadow:0 1px 1px rgba(0,0,0,.13);font-family:\"IBM Plex Sans Arabic\",\"Noto Color Emoji\";color:#111B21'>"
            f"{tail}{nm}<div style='font-size:40px;line-height:1.35'>{text}<span style='display:inline-flex;align-items:center;font-family:Inter;font-size:20px;color:#667781;margin-right:18px;vertical-align:-10px;direction:ltr'>{time}{ticks}</span></div>{rc}</div></div>")

def whatsapp(title, members, avatar_bg, avatar, msgs, height=980):
    status = ("<div style='height:56px;display:flex;justify-content:space-between;align-items:center;padding:0 46px;direction:ltr;font-family:Inter;font-weight:600;font-size:26px;color:#000'>"
              "<span>9:41</span><span style='display:flex;gap:10px;align-items:center'>"
              "<svg width='30' height='18' viewBox='0 0 30 18'><rect x='0' y='12' width='5' height='6' rx='1' fill='#000'/><rect x='8' y='8' width='5' height='10' rx='1' fill='#000'/><rect x='16' y='4' width='5' height='14' rx='1' fill='#000'/><rect x='24' y='0' width='5' height='18' rx='1' fill='#000'/></svg>"
              "<svg width='26' height='18' viewBox='0 0 26 18'><path d='M13 17 l4 -5 a6 6 0 0 0 -8 0 z' fill='#000'/><path d='M4 8 a13 13 0 0 1 18 0' stroke='#000' stroke-width='2.6' fill='none'/><path d='M0 4 a19 19 0 0 1 26 0' stroke='#000' stroke-width='2.6' fill='none'/></svg>"
              "<svg width='40' height='19' viewBox='0 0 40 19'><rect x='1' y='1' width='34' height='17' rx='5' stroke='#000' stroke-opacity='.4' stroke-width='2' fill='none'/><rect x='4' y='4' width='24' height='11' rx='2.5' fill='#000'/><rect x='37' y='6' width='2.5' height='7' rx='1' fill='#000' fill-opacity='.4'/></svg></span></div>")
    nav = (f"<div style='height:96px;display:flex;align-items:center;gap:16px;padding:0 24px;direction:rtl;border-bottom:1px solid #d9d9d9'>"
           f"<svg width='22' height='38' viewBox='0 0 22 38'><path d='M4 3 L18 19 L4 35' stroke='#007AFF' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>"
           f"<span style='font-family:Inter;font-size:30px;color:#007AFF;margin-left:-6px'>12</span>"
           f"<div style='width:64px;height:64px;border-radius:50%;background:{avatar_bg};display:flex;align-items:center;justify-content:center;font-size:34px;font-family:\"Noto Color Emoji\"'>{avatar}</div>"
           f"<div style='flex:1;font-family:\"IBM Plex Sans Arabic\",\"Noto Color Emoji\";line-height:1.2'><div style='font-size:31px;font-weight:600;color:#000'>{title}</div><div style='font-size:22px;color:#8a8a8e;white-space:nowrap;overflow:hidden'>{members}</div></div>"
           f"<svg width='46' height='30' viewBox='0 0 46 30'><rect x='2' y='4' width='28' height='22' rx='5' stroke='#007AFF' stroke-width='3' fill='none'/><path d='M32 12 l11 -6 v18 l-11 -6 z' stroke='#007AFF' stroke-width='3' fill='none' stroke-linejoin='round'/></svg>"
           f"<svg width='34' height='34' viewBox='0 0 24 24' style='margin-right:18px'><path d='M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z' stroke='#007AFF' stroke-width='1.7' fill='none'/></svg></div>")
    chip = "<div style='display:flex;justify-content:center;margin:20px 0 6px'><span style='background:#fff;border-radius:14px;padding:6px 22px;font-family:\"IBM Plex Sans Arabic\";font-size:24px;color:#54656F;box-shadow:0 1px 1px rgba(0,0,0,.1)'>اليوم</span></div>"
    body = "".join(msgs)
    inp = ("<div style='position:absolute;left:0;right:0;bottom:0;height:116px;background:#F6F6F6;border-top:1px solid #ddd;display:flex;align-items:center;gap:20px;padding:0 26px 14px;direction:rtl'>"
           "<span style='font-family:Inter;font-size:52px;color:#007AFF;font-weight:300'>+</span>"
           "<div style='flex:1;height:58px;border-radius:30px;background:#fff;border:1px solid #ddd'></div>"
           "<svg width='40' height='34' viewBox='0 0 40 34'><rect x='2' y='7' width='36' height='25' rx='6' stroke='#007AFF' stroke-width='3' fill='none'/><circle cx='20' cy='19' r='7' stroke='#007AFF' stroke-width='3' fill='none'/><path d='M13 7 l3 -5 h8 l3 5' stroke='#007AFF' stroke-width='3' fill='none'/></svg>"
           "<svg width='28' height='40' viewBox='0 0 28 40'><rect x='7' y='2' width='14' height='24' rx='7' stroke='#007AFF' stroke-width='3' fill='none'/><path d='M2 18 a12 12 0 0 0 24 0 M14 30 v8' stroke='#007AFF' stroke-width='3' fill='none'/></svg></div>")
    return (f"<div style='position:relative;width:840px;padding-bottom:130px;border-radius:34px;overflow:hidden;background:#EFE7DE;box-shadow:0 34px 70px rgba(40,25,15,.32),0 0 0 1px rgba(0,0,0,.06)'>"
            f"<div style='position:absolute;inset:0;background:{DOODLE};background-size:220px'></div>"
            f"<div style='position:relative;background:#F6F6F6'>{status}{nav}</div>"
            f"<div style='position:relative;padding:4px 34px;direction:rtl'>{chip}{body}</div>{inp}</div>")

def wa_slide(head, wa, note_txt, note_css, top=500, rot=-1.5, sc=1):
    return bg(False, H(head, False, 250, 100) + f"<div style='position:absolute;left:120px;top:{top}px;transform:rotate({rot}deg) scale({sc});transform-origin:50% 0'>{wa}</div>" + note(note_txt, False, note_css))

fam = whatsapp("البيبي الجديد 👶", "ماما، بابا، تيتا، خالتو رولا، إنت", "#F3D9C4", "👶", [
    wa_bubble("سمّوها نور! ❤️", False, "تيتا", "#C2185B", "٩:٤١ م"),
    wa_bubble("لأ، ياسمين! 😍", False, "خالتو رولا", "#1E88A8", "٩:٤٢ م"),
    wa_bubble("على إسم ستّها!", False, "تيتا", "#C2185B", "٩:٤٢ م"),
    wa_bubble("ما في حدا بيسمعني؟ 🙄", True, time="٩:٤٣ م", react="😂"),
], 760)
F['1c'] = wa_slide("", fam, "(وإنت ولا خبر عندك)", "left:90px;top:1190px", 250, sc=.92)

frn = whatsapp("الشلّة 💅", "ريم، جاد، نور، إنت", "#E7DCF5", "💅", [
    wa_bubble("إنت كتير عنيد. 😤", False, "ريم", "#7B1FA2", "١١:٠٢ م"),
    wa_bubble("وع فكرة دايمًا بتهتمّ بالكل.", False, "جاد", "#2E7D32", "١١:٠٣ م"),
    wa_bubble("أنا؟ لأ أبدًا. 🙂", True, time="١١:٠٣ م", react="💀"),
], 660)
F['5a'] = wa_slide("الكل بيقلّك *إنك هيك*؟", frn, "(إنكار كامل)", "left:80px;top:385px", 505)

# ---------------- the lines, on Cici's chart ----------------
LEG = {'black': ('أسود', 'إنت واعي عليه', INK), 'red': ('أحمر', 'فيك، بس ما بتشوفو', RED), 'both': ('مخطّط', 'بالجهتين، من أقوى شغلاتك', INK)}
def swatch(kind):
    if kind == 'both':
        return f"<svg width='150' height='22'><line x1='0' y1='11' x2='150' y2='11' stroke='{INK}' stroke-width='16'/><line x1='0' y1='11' x2='150' y2='11' stroke='{RED}' stroke-width='16' stroke-dasharray='14 14'/></svg>"
    return f"<svg width='150' height='22'><line x1='0' y1='11' x2='150' y2='11' stroke='{RED if kind=='red' else INK}' stroke-width='16'/></svg>"
def legrow(kind, on):
    w, d, c = LEG[kind]
    return (f"<div style='display:flex;flex-direction:row-reverse;align-items:center;gap:22px;opacity:{1 if on else .28}'>"
            f"{swatch(kind)}<div style=\"font-family:'IBM Plex Sans Arabic';font-size:44px;direction:rtl;color:{c}\"><b style='font-weight:500'>{w}:</b> {d}</div></div>")
def lines_slide(kind, shown, note_html):
    legend = "".join(legrow(k, k == kind) for k in shown)
    return bg(False, H("كل خط *إلو لون*.", False, 160, 104)
              + f"<div style='position:absolute;right:90px;top:315px;display:flex;flex-direction:column;align-items:flex-end;gap:14px'>{legend}</div>"
              + f"<div style='position:absolute;top:{CT}px;left:0;right:0;display:flex;justify-content:center'>{hd_chart(CW, False, kind)}</div>"
              + caption("CICI'S CHART  ·  PROJECTOR  ·  2/4", CT+CW*730/380+10) + note_html)
# coordinates helper: chart is 560px wide, viewBox x 10..390 -> scale 560/380
CW, CT = 375, 545
def cpt(gx, gy, nshown):
    s = CW / 380; left = (1080 - CW) / 2; top = CT
    return left + (gx - 10) * s, top + gy * s
x, y = cpt(226, 200, 0)   # 11-56, Ajna to Throat
F['4a'] = lines_slide('black', ['black'], n2("(الـ "+LTR("11-56")+" تبعي،<br>أسود كلّو)", "left:720px;top:600px;width:340px", 50) + arr(880, 730, x+10, y, bend=-.3))
x, y = cpt(200, 330, 0)   # 1-8, G to Throat
F['4b'] = lines_slide('red', ['black', 'red'], n2("(الـ "+LTR("1-8")+":<br>نصّ أحمر، نصّ أسود)", "left:40px;top:640px;width:330px", 50) + arr(220, 790, x-12, y, bend=.3))
x, y = cpt(160, 666, 0)   # 54 / 38 striped, Root
F['4c'] = lines_slide('both', ['black', 'red', 'both'], n2("(هودي<br>بالجهتين)", "left:60px;top:950px;width:280px") + arr(200, 1100, x-6, y, bend=.35))

# ---------------- other chart frames now use Cici's real chart ----------------
F['2a'] = bg(False, H("*عمودين* أرقام.", False, 250, 110) + sub("شوف الـ chart تبعك: عمود عاليمين، وعمود عالشمال.", False, 420) + chart('both') + note("(شيّك خريطتك هلّق)", False, "right:120px;top:1225px"))
F['2b'] = bg(False, H("الأسود = *Personality*", False, 250, 100) + sub("لحظة ولادتك · يلي بتعرفو عن حالك", False, 410) + chart('black') + note("(يلي بتخبّرو بالـ "+LTR("first date")+")", False, "left:110px;top:1225px"))
F['3a'] = bg(False, H("الأحمر = *Design*", False, 250, 100) + sub("الجهة يلي ما بتشوفها بسهولة", False, 410) + chart('red') + note("(الجهة الخفيّة)", False, "right:120px;top:1225px"))
F['3c'] = bg(False, H("الأحمر هوّي *جسمك*.", False, 250, 100) + sub("الشغلات يلي بتعملها بلا ما تقرّر،<br>والناس بيشوفوها فيك قبلك.", False, 410) + f"<div style='position:absolute;top:620px;left:0;right:0;display:flex;justify-content:center'>{hd_chart(330, False, 'red')}</div>" + n2("(رفقاتك<br>بيعرفو)", "left:60px;top:900px;width:300px", 60))
F['5b'] = bg(False, H("روح تطّلع *عالأحمر*.", False, 250, 100) + chart('red', False, 470) + note("(للأسف معن حق)", False, "left:110px;top:1225px"))
F['6'] = bg(True, H("الاتنين *إنت*.", True, 250, 140) + f"<div style='position:absolute;top:560px;left:0;right:0;display:flex;justify-content:center'>{hd_chart(380, True)}</div><div style='position:absolute;top:150px;left:0;right:0;text-align:center;font-family:Inter;font-size:30px;letter-spacing:.12em;color:#a99d93'>humanbydesign.global</div>" + note("(تعرّف عالاتنين)", True, "left:100px;top:440px"))

F['_blank_l']=bg(False,'');F['_blank_d']=bg(True,'');F['_blank_w']=dark_bg('')
ONLY = sys.argv[1:] or list(F)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = await b.new_page(viewport={'width':1080,'height':1920})
        for k in ONLY:
            open('_t.html','w').write(F[k]); await pg.goto('file:///home/claude/reel1/_t.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'fr/{k}.png')
        await b.close()
asyncio.run(main())
