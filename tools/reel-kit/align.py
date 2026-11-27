"""Align the script to the real word timings (words.json from Whisper) and build
timeline.json (frames) + subs.json (short subtitle chunks timed to actual Arabic word onsets)."""
import json, re, difflib
exec(open('timing.py').read().split('wc=lambda')[0])   # gives C, END
W = json.load(open('words.json'))

DIA = re.compile(r'[ً-ْٰـ]')
def norm(t):
    t = DIA.sub('', t)
    t = re.sub('[أإآ]', 'ا', t).replace('ة', 'ه').replace('ى', 'ي').replace('ؤ', 'و').replace('ئ', 'ي')
    t = t.replace('ال', '') if False else t
    return re.sub(r'[^\w]', '', t.lower())

# char stream of ASR with a time per char
asr_chars, asr_t = [], []
for w in W:
    n = norm(w['w'])
    for i, ch in enumerate(n):
        asr_chars.append(ch); asr_t.append(w['s'] + (w['e'] - w['s']) * i / max(1, len(n)))
# script words
sw = []  # (clause index, word)
for ci, (a, _, _) in enumerate(C):
    for w in a.split(): sw.append((ci, w))
scr_chars, scr_word = [], []
for wi, (_, w) in enumerate(sw):
    for ch in norm(w): scr_chars.append(ch); scr_word.append(wi)
sm = difflib.SequenceMatcher(None, scr_chars, asr_chars, autojunk=False)
m = {}
for b in sm.get_matching_blocks():
    for k in range(b.size): m[b.a + k] = b.b + k
# word onset = time of the first matched char of that word; interpolate gaps
onset = [None] * len(sw)
for ci_, wi in enumerate(scr_word):
    if onset[wi] is None and ci_ in m: onset[wi] = asr_t[m[ci_]]
for i in range(len(onset)):
    if onset[i] is None:
        j = i + 1
        while j < len(onset) and onset[j] is None: j += 1
        prev = onset[i - 1] if i else 0.0
        nxt = onset[j] if j < len(onset) else END
        onset[i] = prev + (nxt - prev) * 0.5
# word end for the last word of a clause: the ASR end of the matched word
def asr_end_at(t):
    best = min(W, key=lambda w: abs(w['s'] - t)); return best['e']
clause_words = {}
for wi, (ci, _) in enumerate(sw): clause_words.setdefault(ci, []).append(wi)
rows = []
for ci, (a, en, f) in enumerate(C):
    ws = clause_words[ci]
    st = onset[ws[0]]; en_t = asr_end_at(onset[ws[-1]])
    rows.append(dict(ar=a, en=en, frame=f, start=round(st, 2), end=round(en_t, 2), onsets=[round(onset[w], 2) for w in ws]))
json.dump(rows, open('timeline.json', 'w'), ensure_ascii=False, indent=1)

# ---- subtitle chunks ("|" splits, *word* = emphasis in red) ----
CH = [
 "Your chart was calculated | *twice*.",
 "Once, the moment | you were born,",
 "and once, about | *three months* earlier,",
 "when you weren't | even a thing yet | and the family was | fighting over *your name*.",
 "Look at | *your chart*.",
 "Two columns | of numbers | on the sides.",
 "The *black* column | is your *Personality*.",
 "Calculated the moment | you were born,",
 "it's the part of you | you *know* | and can reach | *consciously*.",
 "The *red* column | is your *Design*.",
 "Calculated when the Sun | was *88 degrees* back,",
 "so about | *88 days* | before you were born.",
 "This is | *your body*,",
 "the things you do | *without deciding*,",
 "and people see them in you | *before you do*.",
 "And every line | on your chart | has a *colour*.",
 "*Black*? | You're aware of it.",
 "*Red*? | It's in you, | but you *don't see it*.",
 "*Striped* red and black? | It's on *both sides*,",
 "and often | one of the *strongest* | things about you.",
 "So if everyone | tells you | *you're like this*,",
 "and you're convinced | you're *not*,",
 "go look | at the *red*.",
 "They're probably *right*. | *Sorry*.",
 "The point isn't | to *pick a side*.",
 "It's to know *both*, | because both | are *you*.",
]
assert len(CH) == len(C)
subs = []
for r, line in zip(rows, CH):
    parts = [p.strip() for p in line.split('|')]
    on = r['onsets']; n = len(on)
    ewc = [len(p.split()) for p in parts]; tot = sum(ewc); cum = 0
    for p, k in zip(parts, ewc):
        idx = min(n - 1, round(cum / tot * n)); cum += k
        subs.append(dict(text=p, start=on[idx], frame=r['frame']))
    subs[-1]['clause_end'] = r['end']
for i, s in enumerate(subs):
    nxt = subs[i + 1]['start'] if i + 1 < len(subs) else END
    end = s.get('clause_end', nxt)
    if 'clause_end' in s:
        end = min(nxt, end + 0.45)   # hold a beat after the clause, never into the next line
    s['end'] = round(max(end, s['start'] + 0.3), 2)
    s['start'] = round(max(0, s['start'] - 0.05), 2)
for i in range(len(subs) - 1):
    subs[i]['end'] = round(min(subs[i]['end'], subs[i + 1]['start'] - 0.04), 2)
json.dump(subs, open('subs.json', 'w'), ensure_ascii=False, indent=1)
for r in rows: print(f"{r['start']:6.2f}-{r['end']:6.2f} {r['frame']:3} {r['ar']}")
print(len(subs), 'subtitle chunks')
