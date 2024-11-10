document.addEventListener('DOMContentLoaded', async() => {
	const jsdCdn = 'https://jsd.xsawa.us.kg/';
	const qtail = (await import(`${jsdCdn}npm/qtail-js/index.min.mjs`)).default;
	const qtailManifest = await (await fetch(`${jsdCdn}npm/qtail-js/package.json`)).json();
	const qtailJsVersion = qtailManifest.version;

	const cssEntry = document.querySelector('#inpage-css-entry');
	const mainWindow = document.querySelector('main');

	let imgNum = 0;
	let req = await fetch('./assets/images/max');
	const maxImgNum = await req.text();

	function updateBgImg() {
		if(imgNum >= maxImgNum) imgNum = -1;
		return cssEntry.innerHTML = cssEntry.innerHTML.replace(/\.\/assets\/images\/img\d+\.jpg/g, `./assets/images/img${++imgNum}.jpg`);
	}
	async function updateHitokoto() {
		req = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c');
		const hitokoto = await req.json();
		const hitokotoEntry = document.querySelector('#hitokoto');
		hitokotoEntry.innerHTML = `“<a href="https://hitokoto.cn/?uuid=${hitokoto.uuid}" target="_blank" rel="noopener noreferrer">${hitokoto.hitokoto}</a>”<font style="font-size: 0.8em;"> —— ${hitokoto.from_who? `${hitokoto.from_who}(${hitokoto.from})`: hitokoto.from} </font>`;
	}

	function updateResult() {
		const nick = document.querySelector('#nick').value;
		const tail = document.querySelector('#tail').value;
		const result = qtail.generate(nick, tail);
		document.querySelector('#result').value = result;
	}

	function initListeners() {
		// input
		const nickInput = document.querySelector('#nick');
		const tailInput = document.querySelector('#tail');

		nickInput.addEventListener('change', updateResult);
		tailInput.addEventListener('change', updateResult);

		// button
		const minBtn = document.querySelector('#min-btn');
		const maxBtn = document.querySelector('#max-btn');
		const closeBtn = document.querySelector('#close-btn');
		const copyBtn = document.querySelector('#copy-btn');

		copyBtn.addEventListener('click', async function(e) {
			e.preventDefault();
			await navigator.clipboard.writeText(document.querySelector('#result').value);
			this.innerHTML = '<i class="fa-solid fa-check"></i>';
			this.classList.toggle('success');
			setTimeout(() => {
				this.innerHTML = '<i class="fa-solid fa-clipboard"></i>';
				this.classList.toggle('success');
			}, 2500);
		});
		minBtn.addEventListener('click', function(e) {
			e.preventDefault();
			mainWindow.classList.toggle('minimized');
			if(mainWindow.classList.contains('minimized')) {
				minBtn.innerHTML = '<i class="fa-solid fa-window-restore"></i>';
				minBtn.title = '还原';
				clearInterval(window.updateHitokoto);
			} else {
				minBtn.innerHTML = '<i class="fa-solid fa-window-minimize"></i>';
				minBtn.title = '最小化';
				initIntervals('hitokoto');
			}
		});
		maxBtn.addEventListener('click', function(e) {
			e.preventDefault();
		});
		closeBtn.addEventListener('click', function(e) {
			e.preventDefault();
			history.back();
			// window.close(); not work
		});
	}

	function initIntervals(v) {
		if(v === 'bg') window.updateBgImg = setInterval(() => {
			updateBgImg();
		}, 25000);
		if(v === 'hitokoto') window.updateHitokoto = setInterval(() => {
			updateHitokoto();
		}, 30 * 1000);
	}

	(()=>{
	initIntervals('bg');
	initIntervals('hitokoto');
	updateHitokoto();
	initListeners();
	})();

	document.querySelector('#qtail-version').innerHTML = `v${qtailJsVersion}`;
})