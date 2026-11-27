import math, random
# trimmed from content/brand-kit.py + content/wax-seal.py (real-wax seal, tree of life)
def tree_paths(c, r, seed=11):
    random.seed(seed)
    segs, leaves = [], []
    gy = c + r * 0.10; top = c - r * 0.18
    def grow(x, y, ang, ln, w, depth, up):
        if depth == 0 or ln < r * 0.03:
            if up:
                for _ in range(5):
                    leaves.append((x + random.uniform(-6, 6), y + random.uniform(-6, 6), random.uniform(r*.022, r*.04)))
            return
        x2 = x + ln * math.cos(ang); y2 = y + ln * math.sin(ang)
        bend = random.uniform(-.25, .25)
        mx = (x + x2) / 2 + ln * .15 * math.cos(ang + math.pi / 2) * bend
        my = (y + y2) / 2 + ln * .15 * math.sin(ang + math.pi / 2) * bend
        segs.append((f"M{x:.1f},{y:.1f} Q{mx:.1f},{my:.1f} {x2:.1f},{y2:.1f}", w))
        if up and depth <= 3:
            for _ in range(3):
                leaves.append((x2 + random.uniform(-7, 7), y2 + random.uniform(-7, 7), random.uniform(r*.02, r*.036)))
        n = 2 if depth > 1 else 3
        spread = (.42 if up else .55)
        for i in range(n):
            a = ang + spread * (i - (n - 1) / 2) * 1.6 + random.uniform(-.18, .18)
            grow(x2, y2, a, ln * random.uniform(.68, .80), max(w * .7, r*.012), depth - 1, up)
    segs.append((f"M{c:.1f},{gy:.1f} C{c-3:.1f},{(gy+top)/2:.1f} {c+3:.1f},{(gy+top)/2:.1f} {c:.1f},{top:.1f}", r * .13))
    for a in (-math.pi/2 - 1.05, -math.pi/2 - .45, -math.pi/2, -math.pi/2 + .45, -math.pi/2 + 1.05):
        grow(c, top, a, r * .31, r * .075, 6, True)
    for a in (math.pi/2 - 1.1, math.pi/2 - .5, math.pi/2, math.pi/2 + .5, math.pi/2 + 1.1):
        grow(c, gy, a, r * .27, r * .065, 5, False)
    return segs, leaves, gy

def lumpy(cx, cy, r, seed, n=40):
    random.seed(seed)
    ph = [random.uniform(0, 6.28) for _ in range(4)]
    bulges = [(random.uniform(0, 6.28), random.uniform(.05, .10), random.uniform(.25, .45)) for _ in range(5)]
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + .035 * math.sin(3 * a + ph[0]) + .025 * math.sin(5 * a + ph[1]) + .015 * math.sin(8 * a + ph[2])
        for ba, bh, bw in bulges:
            d = math.atan2(math.sin(a - ba), math.cos(a - ba))
            k += bh * math.exp(-(d / bw) ** 2)
        pts.append((cx + r * k * math.cos(a), cy + r * k * math.sin(a)))
    d = f"M{(pts[0][0]+pts[1][0])/2:.1f},{(pts[0][1]+pts[1][1])/2:.1f} "
    for i in range(1, n + 1):
        p0 = pts[i % n]; p1 = pts[(i + 1) % n]
        d += f"Q{p0[0]:.1f},{p0[1]:.1f} {(p0[0]+p1[0])/2:.1f},{(p0[1]+p1[1])/2:.1f} "
    return d + "Z"

def wobbly_circle(cx, cy, r, seed, amp=.025):
    random.seed(seed); ph = [random.uniform(0, 6.28) for _ in range(3)]
    n = 48; pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + amp * math.sin(2 * a + ph[0]) + amp * .6 * math.sin(5 * a + ph[1])
        pts.append((cx + r * k * math.cos(a), cy + r * k * math.sin(a)))
    d = f"M{(pts[0][0]+pts[1][0])/2:.1f},{(pts[0][1]+pts[1][1])/2:.1f} "
    for i in range(1, n + 1):
        p0 = pts[i % n]; p1 = pts[(i + 1) % n]
        d += f"Q{p0[0]:.1f},{p0[1]:.1f} {(p0[0]+p1[0])/2:.1f},{(p0[1]+p1[1])/2:.1f} "
    return d + "Z"

H_BLOB, H_RIM, H_DISH, H_MOTIF = "#8f8f8f", "#b4b4b4", "#5a5a5a", "#9a9a9a"
def motif_height(c, ri):
    segs, leaves, gy = tree_paths(c, ri * .66)
    p = "".join(f"<path d='{d}' stroke='{H_MOTIF}' stroke-width='{w*1.15:.2f}' fill='none' stroke-linecap='round'/>" for d, w in segs)
    p += "".join(f"<circle cx='{x:.1f}' cy='{y:.1f}' r='{rr*1.1:.1f}' fill='{H_MOTIF}'/>" for x, y, rr in leaves)
    p += f"<line x1='{c-ri}' y1='{gy:.1f}' x2='{c+ri}' y2='{gy:.1f}' stroke='{H_MOTIF}' stroke-width='{ri*.055:.1f}'/>"
    return p

def wax_seal(size=700, uid="w", seed=21, rot=0):
    c = size / 2; R = c * .80; ri = c * .50; blur_edge = size * .016; k = size / 700
    height = f"""<rect width='{size}' height='{size}' fill='#000'/>
  <path d='{lumpy(c, c, R, seed)}' fill='{H_BLOB}'/>
  <path d='{wobbly_circle(c, c, ri*1.12, seed+1)}' fill='{H_RIM}' filter='url(#soft{uid})'/>
  <path d='{wobbly_circle(c, c, ri, seed+2)}' fill='{H_DISH}'/>
  <g clip-path='url(#dish{uid})' filter='url(#mblur{uid})'>{motif_height(c, ri)}</g>"""
    return f"""<svg width='{size}' height='{size}' viewBox='0 0 {size} {size}' style='overflow:visible'>
 <defs>
  <clipPath id='dish{uid}'><path d='{wobbly_circle(c, c, ri*.97, seed+2)}'/></clipPath>
  <filter id='soft{uid}' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='{6*k:.1f}'/></filter>
  <filter id='mblur{uid}' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='{1.6*k:.1f}'/></filter>
  <filter id='wax{uid}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
   <feTurbulence type='fractalNoise' baseFrequency='{.012/k:.4f}' numOctaves='2' seed='{seed}' result='wob'/>
   <feDisplacementMap in='SourceGraphic' in2='wob' scale='{22*k:.1f}' xChannelSelector='R' yChannelSelector='G' result='disp'/>
   <feColorMatrix in='disp' type='luminanceToAlpha' result='lum'/>
   <feComponentTransfer in='lum' result='mask0'><feFuncA type='discrete' tableValues='0 1 1 1 1 1 1 1 1 1 1 1'/></feComponentTransfer>
   <feGaussianBlur in='mask0' stdDeviation='{1.2*k:.1f}' result='mask'/>
   <feGaussianBlur in='disp' stdDeviation='{blur_edge:.1f}' result='hsoft'/>
   <feGaussianBlur in='disp' stdDeviation='{3.2*k:.1f}' result='hsharp'/>
   <feComposite in='hsoft' in2='hsharp' operator='arithmetic' k2='.45' k3='.55' result='hmix'/>
   <feTurbulence type='fractalNoise' baseFrequency='{.022/k:.4f}' numOctaves='2' seed='{seed+3}' result='mot'/>
   <feComposite in='hmix' in2='mot' operator='arithmetic' k2='1' k3='.022' k4='-.011' result='h'/>
   <feColorMatrix in='h' type='luminanceToAlpha' result='ha'/>
   <feColorMatrix in='hmix' type='luminanceToAlpha' result='hsa0'/><feGaussianBlur in='hsa0' stdDeviation='{4*k:.1f}' result='hsa'/>
   <feDiffuseLighting in='ha' surfaceScale='{14*k:.1f}' diffuseConstant='1.15' lighting-color='#ffd6cc' result='diff'><feDistantLight azimuth='225' elevation='48'/></feDiffuseLighting>
   <feSpecularLighting in='hsa' surfaceScale='{14*k:.1f}' specularConstant='.9' specularExponent='34' lighting-color='#ffd0c0' result='spec'><feDistantLight azimuth='225' elevation='52'/></feSpecularLighting>
   <feFlood flood-color='#7C0E0A' result='red'/>
   <feComposite in='red' in2='diff' operator='arithmetic' k1='1.22' result='lit'/>
   <feColorMatrix in='ha' type='matrix' values='0 0 0 0 .23  0 0 0 0 .02  0 0 0 0 .01  0 0 0 -.9 .9' result='deep'/>
   <feComposite in='deep' in2='lit' operator='over' result='lit2'/>
   <feComposite in='lit' in2='lit2' operator='arithmetic' k2='.55' k3='.45' result='body'/>
   <feComposite in='spec' in2='body' operator='arithmetic' k1='0' k2='.7' k3='1' result='shiny'/>
   <feComposite in='shiny' in2='mask' operator='in' result='seal'/>
   <feGaussianBlur in='mask' stdDeviation='{10*k:.1f}' result='sb'/>
   <feOffset in='sb' dx='{4*k:.1f}' dy='{12*k:.1f}' result='so'/>
   <feColorMatrix in='so' type='matrix' values='0 0 0 0 .1  0 0 0 0 .03  0 0 0 0 .02  0 0 0 .55 0' result='shadow'/>
   <feMerge><feMergeNode in='shadow'/><feMergeNode in='seal'/></feMerge>
  </filter>
 </defs>
 <g filter='url(#wax{uid})' transform='rotate({rot} {c} {c})'>{height}</g>
</svg>"""
