/* main.js
   - initial loader goes 0 -> 67% and is ~0.5s slower
   - parallax mouse movement
   - sound toggle: AudioContext created/resumed only after explicit user gesture (click sound toggle)
   - mini loader: animate 0 -> 67% on viewport enter (larger loader)
*/

(function () {
    /* ---------- Loader (0 -> 67 simulated, slightly slower) ---------- */
    const progressEl = document.getElementById('progress');
    const percentEl = document.getElementById('percent');
    const loader = document.getElementById('loader');
    const main = document.getElementById('mainContent');

    const TARGET_PERCENT = 67; // stops at 67%
    let start = null;
    // base duration increased by 500ms to be "malko sporije za pola sec"
    let duration = 1800 + Math.random() * 1200 + 500; // ~2.3s - 3.5s
    const eased = t => 1 - Math.pow(1 - t, 2.2);
    let current = 0;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const t = Math.min(1, elapsed / duration);
        const value = Math.round(eased(t) * TARGET_PERCENT);
        if (value !== current) {
            current = value;
            progressEl.style.transform = `scaleX(${current / 100})`;
            progressEl.setAttribute('aria-valuenow', current);
            percentEl.textContent = current + '%';
            progressEl.style.boxShadow = current < TARGET_PERCENT ? '0 6px 24px rgba(96,165,250,0.08)' : '0 10px 40px rgba(186,246,112,0.14)';
        }
        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            // finish at TARGET_PERCENT
            progressEl.style.transform = `scaleX(${TARGET_PERCENT / 100})`;
            percentEl.textContent = TARGET_PERCENT + '%';
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.setAttribute('aria-hidden', 'true');
                main.style.opacity = 1;
                main.style.transform = 'translateY(0)';
            }, 260);
        }
    }

    requestAnimationFrame(step);

    window.addEventListener('load', () => {
        // fast finish to TARGET_PERCENT if page loads earlier (shorter)
        start = null;
        duration = 300 + 500; // quick but still +0.5s slower: 800ms
        requestAnimationFrame(step);
    });

    /* ---------- Parallax (mouse / touch) ---------- */
    (function () {
        const bgGrid = document.getElementById('bgGrid');
        const bgPixels = document.getElementById('bgPixels');
        const bgScan = document.getElementById('bgScan');
        const container = document.querySelector('.container');
        const logo = document.getElementById('logo');

        const gridFactor = 0.02;
        const pixelsFactor = 0.04;
        const scanFactor = 0.01;

        function handleMove(e) {
            const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? window.innerWidth / 2;
            const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY) ?? window.innerHeight / 2;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const x = (clientX - w / 2) / (w / 2);
            const y = (clientY - h / 2) / (h / 2);

            bgGrid.style.transform = `translate3d(${-x * 40 * gridFactor}px, ${-y * 40 * gridFactor}px, 0)`;
            bgPixels.style.transform = `translate3d(${-x * 80 * pixelsFactor}px, ${-y * 80 * pixelsFactor}px, 0)`;
            bgScan.style.transform = `translate3d(${-x * 20 * scanFactor}px, ${-y * 20 * scanFactor}px, 0)`;

            container.style.transform = `translate3d(${x * 6}px, ${y * 6}px, 0)`;
            logo.style.transform = `rotateX(${y * 3}deg) rotateY(${-x * 3}deg) translateZ(0)`;
        }

        window.addEventListener('mousemove', handleMove, { passive: true });
        window.addEventListener('touchmove', (ev) => {
            if (ev.touches && ev.touches[0]) handleMove(ev.touches[0]);
        }, { passive: true });
    })();

    /* ---------- Sound (blips + chime) - create/resume AudioContext only after user gesture ---------- */
    (function () {
        const soundToggle = document.getElementById('soundToggle');
        let audioCtx = null;
        let soundEnabled = false; // start disabled until user clicks

        function createAudioContext() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => { });
            }
            return audioCtx;
        }

        function playBlip(frequency = 880, duration = 0.06, gain = 0.02) {
            if (!soundEnabled) return;
            const ctx = createAudioContext();
            if (!ctx) return;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = frequency;
            g.gain.value = gain;
            o.connect(g); g.connect(ctx.destination);
            o.start();
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            o.stop(ctx.currentTime + duration + 0.01);
        }

        function playChime() {
            if (!soundEnabled) return;
            const ctx = createAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const freqs = [660, 880, 1320];
            freqs.forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.value = f;
                g.gain.value = 0.02 / (i + 1);
                o.connect(g); g.connect(ctx.destination);
                o.start(now + i * 0.06);
                g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.18);
                o.stop(now + i * 0.06 + 0.22);
            });
        }

        // play small blip on each loader progress update (observe style changes)
        const progressNode = document.getElementById('progress');
        let lastPercent = 0;
        let chimed = false;
        const mo = new MutationObserver(() => {
            const style = window.getComputedStyle(progressNode);
            const transform = style.transform;
            let scaleX = 0;
            if (transform && transform !== 'none') {
                const values = transform.match(/matrix.*\((.+)\)/);
                if (values && values[1]) {
                    const parts = values[1].split(',').map(s => parseFloat(s.trim()));
                    scaleX = parts[0];
                }
            }
            const pct = Math.round((scaleX || 0) * 100);
            if (pct > lastPercent) {
                const pitch = 400 + Math.round(pct * 6);
                playBlip(pitch, 0.05, 0.015);
                lastPercent = pct;
            }
            if (!chimed && pct >= TARGET_PERCENT) {
                playChime();
                chimed = true;
            }
        });
        mo.observe(progressNode, { attributes: true, attributeFilter: ['style'] });

        // Toggle button: create/resume AudioContext only on explicit click
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.classList.toggle('on', soundEnabled);
            soundToggle.textContent = soundEnabled ? '🔊' : '🔈';
            soundToggle.setAttribute('aria-pressed', String(soundEnabled));
            if (soundEnabled) {
                // create/resume audio context on user gesture
                try {
                    createAudioContext();
                } catch (e) {
                    // ignore; browsers may still block until further gesture
                }
            } else {
                // do not close audioCtx; just disable sound
            }
        });

        // Do not create AudioContext on passive events; only on explicit user gesture (soundToggle click)
        // For extra safety, also allow first user click anywhere to enable audio if user hasn't toggled
        function enableOnFirstGesture(e) {
            if (!soundEnabled) return;
            try { createAudioContext(); } catch (e) { }
            window.removeEventListener('click', enableOnFirstGesture);
            window.removeEventListener('touchstart', enableOnFirstGesture);
        }
        window.addEventListener('click', enableOnFirstGesture, { passive: true });
        window.addEventListener('touchstart', enableOnFirstGesture, { passive: true });
    })();

    /* ---------- Mini loader: animate 0 -> 67% on viewport enter (larger) ---------- */
    (function () {
        const block = document.getElementById('pixelBlock');
        if (!block) return;
        const miniProgress = block.querySelector('.mini-progress');
        const miniFill = block.querySelector('.mini-fill');
        const miniPercent = block.querySelector('.mini-percent');

        const targetPct = 67;
        const duration = 900;
        const easeOut = t => 1 - Math.pow(1 - t, 2.2);

        function animateTo(target, ms) {
            const start = performance.now();
            const from = 0;
            const to = target / 100;
            function frame(now) {
                const elapsed = now - start;
                const t = Math.min(1, elapsed / ms);
                const v = from + (to - from) * easeOut(t);
                miniFill.style.transform = `scaleX(${v})`;
                miniPercent.textContent = Math.round(v * 100) + '%';
                miniProgress.setAttribute('aria-valuenow', String(Math.round(v * 100)));
                if (t < 1) {
                    requestAnimationFrame(frame);
                } else {
                    miniProgress.classList.add('paused');
                }
            }
            requestAnimationFrame(frame);
        }

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    miniProgress.classList.remove('paused');
                    miniFill.style.transform = 'scaleX(0)';
                    miniPercent.textContent = '0%';
                    miniProgress.setAttribute('aria-valuenow', '0');
                    animateTo(targetPct, duration);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        io.observe(block);
    })();
})();
