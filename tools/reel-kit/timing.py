import json,re
sil=[(0,0),(1.916,2.293),(6.099,6.542),(9.611,10.186),(11.294,11.685),(13.29,13.677),(15.983,16.47),(18.36,18.722),(22.713,23.248),(25.199,25.671),(28.918,29.333),(32.076,32.605),(35.822,36.186),(37.992,38.576),(40.804,41.274),(43.14,43.653),(44.301,44.66),(46.201,46.707),(50.151,50.546),(52.93,53.463),(57.533,57.893),(59.104,59.525),(61.411,62.234),(63.941,64.394),(66.606,67.027)]
END=68.83
# clauses: (arabic, english subtitle, frame)
C=[
("خريطتك انحسبت مرّتين.","Your chart was calculated twice.","1a"),
("مرّة بلحظة ولادتك،","Once at the moment you were born,","1b"),
("ومرّة قبل بحوالي تلات أشهر،","and once about three months earlier,","1b"),
("لما كنت بعدك ولا شي والعيلة عم تتخانق عالإسم.","when you weren't even a thing yet and the family was fighting over your name.","1c"),
("شوف الـ chart تبعك.","Look at your chart.","2a"),
("في عمودين أرقام عالجنب.","There are two columns of numbers on the sides.","2a"),
("العمود الأسود اسمو الـ Personality.","The black column is called the Personality.","2b"),
("هيدا محسوب بلحظة ولادتك،","It's calculated at the moment you were born,","2b"),
("وهوّي الجزء يلي بتعرفو عن حالك وبتقدر توصلّو بوعيك.","and it's the part of you that you know and can reach consciously.","2b"),
("العمود الأحمر اسمو الـ Design.","The red column is called the Design.","3a"),
("انحسب لما الشمس كانت 88 درجة لورا،","It was calculated when the Sun was 88 degrees back,","3b"),
("يعني حوالي 88 يوم قبل الولادة.","so about 88 days before you were born.","3b"),
("هيدا جسمك،","This is your body,","3c"),
("الشغلات يلي بتعملها بلا ما تقرّر،","the things you do without deciding to,","3c"),
("والناس بيشوفوها فيك قبلك.","and people see them in you before you do.","3c"),
("وكل خط ملوّن بالـ chart إلو لون.","And every coloured line on your chart has a colour.","4a"),
("إذا أسود، إنت واعي عليه.","If it's black, you're aware of it.","4a"),
("إذا أحمر، هوّي فيك بس ما بتشوفو.","If it's red, it's in you, but you don't see it.","4b"),
("وإذا مخطّط أحمر وأسود، يعني موجود بالجهتين،","And if it's striped red and black, it's on both sides,","4c"),
("وغالبًا هوّي من أقوى الشغلات فيك.","and it's often one of the strongest things about you.","4c"),
("فإذا في شي الكل بيقلّك إنك هيك،","So if everyone tells you you're like this,","5a"),
("وإنت مقتنع إنك لأ،","and you're convinced you're not,","5a"),
("روح تطّلع عالأحمر.","go look at the red.","5b"),
("غالبًا معن حق. للأسف.","They're probably right. Sorry.","5b"),
("الفكرة مش إنك تختار جهة.","The point isn't to pick a side.","6"),
("الفكرة إنك تتعرّف عالجهتين، لأنو الاتنين إنت.","It's to get to know both, because both are you.","6"),
]
wc=lambda s:len(s.split())
tot=sum(wc(a) for a,_,_ in C)
speech_start=sil[0][1]
# speech time excluding internal silences
gaps=sil[1:]
def speech_to_time(x):
    # x in [0,1] fraction of speech; map onto timeline skipping gaps
    total=END-speech_start-sum(e-s for s,e in gaps)
    t=speech_start; rem=x*total
    for s,e in gaps:
        if t+rem<=s: return t+rem
        rem-= (s-t); t=e
    return min(t+rem,END)
mids=[(s+e)/2 for s,e in gaps]
cum=0;bounds=[speech_start]
for a,_,_ in C:
    cum+=wc(a); t=speech_to_time(cum/tot)
    # snap to nearest silence midpoint within 1.2s
    near=min(mids,key=lambda m:abs(m-t))
    if abs(near-t)<1.2: t=near
    bounds.append(t)
bounds[-1]=END
rows=[]
for i,(a,en,f) in enumerate(C):
    rows.append(dict(ar=a,en=en,frame=f,start=round(bounds[i],2),end=round(bounds[i+1],2)))
for r in rows: print(r['start'],r['end'],r['frame'],r['en'][:40])
json.dump(rows,open('timeline.json','w'),ensure_ascii=False,indent=1)
