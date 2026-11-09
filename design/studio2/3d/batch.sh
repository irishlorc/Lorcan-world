cd /tmp/claude-0/r3d
r(){ timeout 400 python3 shoot.py $1 out/f-$2.png "$3" $4 $5 || echo FAIL $2; }
r wadden3d.html w-wide "shot=wide&w=2400&h=1350&exp=1.15" 2400 1350
r wadden3d.html w-hero "shot=hero&w=2400&h=1350&exp=1.2" 2400 1350
r wadden3d.html w-low "shot=low&w=2400&h=1350&exp=1.2" 2400 1350
r wadden3d.html w-crest "shot=crest&w=2400&h=1350&exp=1.15" 2400 1350
r wadden3d.html w-top "shot=top&w=1600&h=1600&exp=1.15" 1600 1600
r wadden3d.html w-prod "shot=product&w=2200&h=1500" 2200 1500
r wadden3d.html w-prodside "shot=product-side&w=2200&h=1200" 2200 1200
r rune.html r-hero "shot=hero&w=2400&h=1500" 2400 1500
r rune.html r-hero-silver "shot=hero&finish=silver&w=2400&h=1500&shadow=.25&env=.6" 2400 1500
r rune.html r-side "shot=side&w=1800&h=1800" 1800 1800
r rune.html r-front "shot=front&w=1800&h=1800" 1800 1800
r rune.html r-macro "shot=macro&bg=111113&w=2400&h=1500&env=.4" 2400 1500
r rune.html r-plinth "shot=hero&set=plinth&bg=555&exp=.9&w=2400&h=1500" 2400 1500
r rune.html r-plinth2 "shot=low&set=plinth&bg=555&exp=.85&w=1600&h=2000&fov=34" 1600 2000
r rune.html r-violet "shot=hero&finish=violet&w=2400&h=1500" 2400 1500
r spk.html r-spk "what=speakers&w=2400&h=1500" 2400 1500
r spk.html r-col "what=column&w=1500&h=2000" 1500 2000
r spk.html r-stone "what=stone&w=2000&h=1400" 2000 1400
r spk.html r-box "what=box&bg=2a2a2d&w=2400&h=1500" 2400 1500
r spk.html r-box-light "what=box&bg=dcd8d2&w=2400&h=1500&shadow=.25" 2400 1500
echo ALLDONE
