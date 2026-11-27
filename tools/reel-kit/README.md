# Reel kit (approved by Cici, 27 Nov 2026: "now its perfect")
Reference build of the Reel «خريطتك انحسبت مرّتين». Copy and adapt per Reel.
Order: asr.py (word timings) -> align.py (timeline.json + subs.json) -> v2.py (frames + cover) -> zone.py (checks nothing sits in the subtitle band) -> subs.py -> build.py.
Fonts: @fontsource (instrument-serif, inter incl. 600/700, amiri, ibm-plex-sans-arabic) in ROOT/node_modules. Chrome at /usr/bin/google-chrome.
Speech model: Whisper small, CTranslate2 int8, from npm @skillninja/shortmovie-telop-model-p0..p3 (concatenate model.bin.part0-3, check model.sha256), run with pip faster-whisper on a 16 kHz wav.
