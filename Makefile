exoskeleton:
	cat lib/{header,utils,dom-utils,events,model,collection,view,sync,router,history,footer}.js > exoskeleton.js

noutils:
	cat lib/{header,events,model,collection,view,sync,router,history,footer}.js > exoskeleton.js

min:
	uglifyjs -m < exoskeleton.js > exoskeleton.min.js
	wc exoskeleton.js
	gzip -9 < exoskeleton.js | wc
	gzip -9 < exoskeleton.min.js | wc
