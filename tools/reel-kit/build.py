import json,subprocess
T=json.load(open('timeline.json'));S=json.load(open('subs.json'));END=68.83;FPS=30
LEAD=0.05
segs=[]
for r in T:
    s=max(0,r['start']-LEAD)
    if segs and segs[-1][0]==r['frame']: continue
    segs.append([r['frame'],s])
segs[0][1]=0
clips=[]
for i,(f,s) in enumerate(segs):
    e=segs[i+1][1] if i+1<len(segs) else END+0.2
    n=round(e*FPS)-round(s*FPS)
    out=f'c{i:02d}.mp4';clips.append(out)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-loop','1','-i',f'fr/{f}.png','-vf',f"scale=2160:3840,zoompan=z='1+0.04*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s=1080x1920:fps={FPS},format=yuv420p",'-frames:v',str(n),'-c:v','libx264','-preset','veryfast','-crf','18',out],check=True)
open('list.txt','w').write("".join(f"file '{c}'\n" for c in clips))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list.txt','-c','copy','bg.mp4'],check=True)
inputs=['-i','bg.mp4'];fc=[];last='[0:v]'
for i,s in enumerate(S):
    inputs+=['-i',f'sub2/{i:02d}.png']
    fc.append(f"{last}[{i+1}:v]overlay=0:0:enable='between(t,{s['start']:.2f},{s['end']-0.01:.2f})'[v{i}]");last=f'[v{i}]'
inputs+=['-i','voice.mp3']
subprocess.run(['ffmpeg','-y','-loglevel','error']+inputs+['-filter_complex',';'.join(fc),'-map',last,'-map',f'{len(S)+1}:a','-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart','reel.mp4'],check=True)
for f,s in segs: print(f,round(s,2))
