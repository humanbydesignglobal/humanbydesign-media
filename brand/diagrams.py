# Simple bodygraph diagrams in the brand style (thin ink lines, one centre highlighted in red).
CENTRES = {
 "head":   "<polygon points='150,10 112,62 188,62'/>",
 "ajna":   "<polygon points='112,76 188,76 150,128'/>",
 "throat": "<rect x='124' y='142' width='52' height='52' rx='4'/>",
 "g":      "<polygon points='150,204 184,238 150,272 116,238'/>",
 "ego":    "<polygon points='192,262 226,244 226,282'/>",
 "spleen": "<polygon points='34,298 34,374 88,336'/>",
 "solar":  "<polygon points='266,298 266,374 212,336'/>",
 "sacral": "<rect x='124' y='306' width='52' height='52' rx='4'/>",
 "root":   "<rect x='124' y='384' width='52' height='52' rx='4'/>",
}
LINES = [(150,62,150,76),(150,128,150,142),(150,194,150,204),(150,272,150,306),(150,358,150,384),
         (124,410,70,360),(176,410,230,360),(124,180,60,310),(176,180,240,310),(184,238,200,262),(124,332,88,336),(176,332,212,336)]
def bodygraph(width, ink, red, mode="white", hi="solar"):
    """mode 'white' = highlighted centre open (red outline), 'coloured' = filled red."""
    lines = "".join(f"<line x1='{a}' y1='{b}' x2='{c}' y2='{d}'/>" for a,b,c,d in LINES)
    others = "".join(v for k,v in CENTRES.items() if k != hi)
    fill = red if mode == "coloured" else "none"
    return (f"<svg width='{width}' viewBox='0 0 300 446' style='display:block;overflow:visible'>"
            f"<g stroke='{ink}' stroke-width='2' opacity='.35' fill='none'>{lines}</g>"
            f"<g stroke='{ink}' stroke-width='2.4' opacity='.6' fill='none'>{others}</g>"
            f"<g stroke='{red}' stroke-width='4.5' fill='{fill}' stroke-linejoin='round'>{CENTRES[hi]}</g></svg>")
def pair(ink, red, cap_l, cap_r, ar=False, w=330, cs=32, cls="sans"):
    col = lambda m, c: (f"<div style='flex:1;display:flex;flex-direction:column;align-items:center'>{bodygraph(w, ink, red, m)}"
                        f"<div class='{cls}' style='font-size:{cs}px;line-height:1.4;margin-top:26px;text-align:center'>{c}</div></div>")
    a, b = col("white", cap_l), col("coloured", cap_r)
    return f"<div style='display:flex;gap:60px;margin-top:40px;{'direction:rtl' if ar else ''}'>{a}{b}</div>"
