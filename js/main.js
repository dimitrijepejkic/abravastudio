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

// Newsletter form submission

const form = document.getElementById("newsletterForm");
const emailInput = document.getElementById("email");
const error = document.getElementById("emailError");

// RFC približno kompatibilan regex
const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Karakteri koje ne želimo
const forbiddenRegex =
    /['";<>\\]/;

function validateEmail(email) {

    email = email.trim();

    if (email.length === 0) {
        return "Email address is required.";
    }

    if (email.length > 254) {
        return "Email address is too long.";
    }

    if (forbiddenRegex.test(email)) {
        return "Email contains forbidden characters.";
    }

    if (email.includes(" ")) {
        return "Email cannot contain spaces.";
    }

    if (!email.includes("@")) {
        return "Email must contain '@'.";
    }

    if (!email.includes(".")) {
        return "Email must contain a domain (example: .com).";
    }

    if (!emailRegex.test(email)) {
        return "Please enter a valid email (example@example.com).";
    }

    return "";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = emailInput.value.trim();

    const validation = validateEmail(email);

    if (validation) {

        error.textContent = validation;
        emailInput.classList.add("error");
        return;
    }

    error.textContent = "";
    emailInput.classList.remove("error");

    try {

        const response = await fetch(
            "https://n8n-l56q.srv1783263.hstgr.cloud/webhook/06be8f69-924b-4ae5-98db-c9f2f1249a54",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
                })
            }
        );


        const data = await response.json();

        if (data.code === 601) {
            alert("You are already subscribed!");
            return;
        }
        else if (response.ok) {
            alert("Thank you for subscribing!");
            form.reset();
        }

        else {
            alert("Something went wrong.");
        }



    } catch (err) {
        alert("Unable to connect to the server.");
    }

});
