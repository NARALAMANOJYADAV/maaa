var c = document.getElementById('c'), ctx = c.getContext('2d'),
    w = c.width = window.innerWidth, h = c.height = window.innerHeight,
    letters = [], opts = { strings: ['HAPPY', 'BIRTHDAY', 'AMMA'], charSpacing: w < 600 ? 50 : 100, lineHeight: w < 600 ? 80 : 130 };

// 1. Initial Letter Animation
function Letter(char, x, y) {
    this.char = char; this.x = x; this.y = y;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
}

Letter.prototype.step = function() {
    this.y -= 4;
    ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, w < 600 ? 18 : 30, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `bold ${w < 600 ? '16px' : '28px'} Arial`;
    ctx.fillText(this.char, this.x - (w < 600 ? 6 : 10), this.y + (w < 600 ? 6 : 10));
};

function anim() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0,0,w,h);
    ctx.save(); ctx.translate(w/2, h/2);
    let allOut = true;
    letters.forEach(l => { l.step(); if (l.y > -h) allOut = false; });
    ctx.restore();

    if (allOut && letters.length > 0) {
        document.getElementById('gift-container').style.display = 'flex';
        initGiftLogic();
        return;
    }
    requestAnimationFrame(anim);
}

// 2. Gift Box Logic
function initGiftLogic() {
    const wrapper = document.getElementById('gift-wrapper');
    const bike = document.getElementById('delivery-bike');
    wrapper.onclick = () => {
        wrapper.classList.add('open-lid');
        setTimeout(() => {
            bike.classList.add('bike-go');
            setTimeout(() => {
                document.getElementById('gift-container').style.display = 'none';
                document.getElementById('final-scene').style.display = 'flex';
                setupInteractions();
                startRain();
            }, 6000); 
        }, 800);
    };
}

// 3. Rain & Burst Logic
function startRain() {
    const items = ['❤️', '💎', '⭐', '✨', '💖'];
    setInterval(() => {
        const el = document.createElement('div');
        el.className = 'rain-item';
        el.innerText = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 100 + 'vw';
        const dur = Math.random() * 3 + 4;
        el.style.animationDuration = dur + 's';
        el.style.opacity = Math.random();
        document.body.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000);
    }, 400);
}

function setupInteractions() {
    const panels = document.querySelectorAll('.floating-panel');
    const overlay = document.getElementById('fullview-overlay');
    const imgContainer = document.getElementById('image-container');
    const innerQ = document.getElementById('inner-quote');
    const pops = ['❤️', '💎', '⭐'];

    panels.forEach((p) => {
        p.onclick = (e) => {
            // 3D Burst
            for(let i=0; i<12; i++) {
                const el = document.createElement('div');
                el.className = 'pop-item';
                el.innerText = pops[Math.floor(Math.random() * pops.length)];
                el.style.left = e.clientX + 'px';
                el.style.top = e.clientY + 'px';
                el.style.marginLeft = (Math.random() * 120 - 60) + 'px';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 1200);
            }
            imgContainer.innerHTML = `<img src="${p.querySelector('img').src}" class="full-img-zoom">`;
            innerQ.innerText = p.getAttribute('data-quote');
            overlay.style.display = 'flex';
        };
    });
    overlay.onclick = () => overlay.style.display = 'none';
}

// Start sequence
opts.strings.forEach((str, i) => {
    let rowY = (i - 1) * opts.lineHeight + (h/5);
    for (let j = 0; j < str.length; j++) {
        letters.push(new Letter(str[j], (j - str.length / 2) * opts.charSpacing, rowY));
    }
});
anim();