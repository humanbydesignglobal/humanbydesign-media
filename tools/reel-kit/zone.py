import numpy as np, sys
from PIL import Image
B={'l':np.asarray(Image.open('fr/_blank_l.png').convert('L'),float),'d':np.asarray(Image.open('fr/_blank_d.png').convert('L'),float),'w':np.asarray(Image.open('fr/_blank_w.png').convert('L'),float)}
KIND={'1a':'w','6':'d'}
ZT,ZB=int(sys.argv[1]) if len(sys.argv)>1 else 1350,1560
bad=0
for k in ['1a','1b','1c','2a','2b','3a','3b','3c','4a','4b','4c','5a','5b','6']:
    a=np.asarray(Image.open(f'fr/{k}.png').convert('L'),float); d=np.abs(a-B[KIND.get(k,'l')])>35
    rows=np.where(d.any(1))[0]
    z=d[ZT:ZB].any(1).sum()
    print(k,'content y',rows.min(),'-',rows.max(),' rows in sub zone:',z); bad+=z>0
print('BAD',bad)
