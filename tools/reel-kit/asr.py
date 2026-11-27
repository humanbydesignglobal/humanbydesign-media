import json
from faster_whisper import WhisperModel
exec(open('timing.py').read().split('wc=lambda')[0])
prompt=" ".join(a for a,_,_ in C)
m=WhisperModel('/tmp/wm/model',device='cpu',compute_type='int8',cpu_threads=2)
import soundfile as sf;a,_=sf.read('voice16.wav',dtype='float32');segs,info=m.transcribe(a,language='ar',word_timestamps=True,initial_prompt=prompt,beam_size=5,vad_filter=False)
W=[]
for s in segs:
    for w in s.words: W.append(dict(w=w.word.strip(),s=round(w.start,2),e=round(w.end,2),p=round(w.probability,2)))
json.dump(W,open('words.json','w'),ensure_ascii=False,indent=0)
print(len(W)); print(" ".join(f"{x['w']}[{x['s']}]" for x in W))
