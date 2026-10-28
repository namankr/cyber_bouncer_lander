function runSimulation(type) {
    // Select active element indicators
    const buttons = document.querySelectorAll('#simulator button');
    buttons.forEach(btn => {
        btn.className = "px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap";
    });
    
    // Highlight targeted button selection
    event.target.className = "px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition bg-slate-800 text-slate-200 border border-slate-700 whitespace-nowrap";

    // Target elements
    const inputBlock = document.getElementById('sim-input');
    const t1Block = document.getElementById('sim-t1');
    const t2Block = document.getElementById('sim-t2');
    const outcomeBlock = document.getElementById('sim-outcome');

    const txtInput = document.getElementById('txt-input');
    const txtT1 = document.getElementById('txt-t1');
    const txtT2 = document.getElementById('txt-t2');

    // Reset base configurations
    [inputBlock, t1Block, t2Block].forEach(el => el.className = "p-3 rounded border bg-slate-900/60 border-slate-800 transition-colors");
    outcomeBlock.className = "p-4 rounded border text-center font-bold text-sm bg-slate-900/60 border-slate-800 transition-colors";
    outcomeBlock.textContent = "STATUS: VERIFYING INBOUND VISITOR CONTEXT...";

    if (type === 'human') {
        txtInput.textContent = "Browser Type: Normal Chrome Desktop | Activity: Reading page contents | Speed: Human timing (4.2 seconds between actions)";
        setTimeout(() => {
            t1Block.className = "p-3 rounded border border-emerald-500/30 bg-emerald-500/5 transition-colors";
            txtT1.textContent = "Outer Gateway: Looks like a normal web browser. Passing down for timing analysis.";
        }, 400);
        setTimeout(() => {
            t2Block.className = "p-3 rounded border border-emerald-500/30 bg-emerald-500/5 transition-colors";
            txtT2.textContent = "Behavioral Analysis: Traffic speeds vary naturally. Internal parameters are perfectly safe. Threat Score: 0/100.";
        }, 800);
        setTimeout(() => {
            outcomeBlock.className = "p-4 rounded border text-center font-bold text-sm bg-emerald-500/10 border-emerald-500 text-emerald-400";
            outcomeBlock.textContent = "VERDICT: ALLOWED (Inbound user connected straight to your site seamlessly)";
        }, 1200);
    } 
    else if (type === 'playwright') {
        txtInput.textContent = "Browser Type: Automated Testing Framework | Activity: Scraping platform information | Speed: High-velocity execution loop";
        setTimeout(() => {
            t1Block.className = "p-3 rounded border bg-red-500/5 border-red-500/40 transition-colors";
            txtT1.textContent = "Outer Gateway MATCH: Identified signature block of known automated scraping engine. Blocking connection instantly.";
        }, 400);
        setTimeout(() => {
            t2Block.className = "p-3 rounded border border-slate-800 opacity-40 transition-colors";
            txtT2.textContent = "Bypassed. Edge shield already handled isolation loop, cutting down backend processing costs.";
        }, 800);
        setTimeout(() => {
            outcomeBlock.className = "p-4 rounded border text-center font-bold text-sm bg-red-500/10 border-red-500 text-red-400";
            outcomeBlock.textContent = "VERDICT: BLOCKED AT GATEWAY (Connection dropped before it could load your server)";
        }, 1200);
    } 
    else if (type === 'timing') {
        txtInput.textContent = "Browser Type: Spoofed Human Header (Faked Profile) | Activity: Deep link discovery | Speed: Programmed delay (Exactly 2.00 seconds every click)";
        setTimeout(() => {
            t1Block.className = "p-3 rounded border border-emerald-500/30 bg-emerald-500/5 transition-colors";
            txtT1.textContent = "Outer Gateway: Browser metadata claims to be human. Forwarding to behavior engine for rhythmic evaluation.";
        }, 400);
        setTimeout(() => {
            t2Block.className = "p-3 rounded border bg-red-500/5 border-red-500/40 transition-colors";
            txtT2.textContent = "Behavioral Analysis ALERT: Clicks are mathematically perfect. No human moves with zero variation. Bot detected via rhythm fingerprints.";
        }, 800);
        setTimeout(() => {
            outcomeBlock.className = "p-4 rounded border text-center font-bold text-sm bg-red-500/10 border-red-500 text-red-400";
            outcomeBlock.textContent = "VERDICT: BLOCKED (Bot identified and added to temporary blocklist for 1 hour)";
        }, 1200);
    } 
    else if (type === 'sqli') {
        txtInput.textContent = "Browser Type: Normal Firefox User | Activity: Posting comment input | Payload: Contains automated PHP exploit string";
        setTimeout(() => {
            t1Block.className = "p-3 rounded border border-emerald-500/30 bg-emerald-500/5 transition-colors";
            txtT1.textContent = "Outer Gateway: Verified browser handshake framework. Routing message content to payload scanner.";
        }, 400);
        setTimeout(() => {
            t2Block.className = "p-3 rounded border bg-red-500/5 border-red-500/40 transition-colors";
            txtT2.textContent = "Behavioral Analysis ALERT: Malicious PHP execution command detected inside client message layout.";
        }, 800);
        setTimeout(() => {
            outcomeBlock.className = "p-4 rounded border text-center font-bold text-sm bg-red-500/10 border-red-500 text-red-400";
            outcomeBlock.textContent = "VERDICT: MALICIOUS PAYLOAD BLOCKED (Exploit dropped prior to hitting database storage infrastructure)";
        }, 1200);
    }
}

// ---- Google Form waitlist ----
// Same form/entry IDs as simulator.js (see README in landing-page/).
const GOOGLE_FORM = {
    action: "https://docs.google.com/forms/d/e/1FAIpQLSee_c0VoDIZC0Aaat88rPC-PvtRJZSZsBLzc_l9LnGepi3ZLA/formResponse",
    fields: {
        email: "entry.1939952555",      // "Corporate Email Address" question
        framework: "entry.361821576",  // "Primary Infrastructure Framework" question
    },
};

async function handleWaitlistSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('form-btn');
    const err = document.getElementById('form-error');
    err.classList.add('hidden');

    if (Object.values(GOOGLE_FORM.fields).some(id => id.startsWith("entry.0000"))) {
        err.textContent = "Form not configured yet: set GOOGLE_FORM in v2.js.";
        err.classList.remove('hidden');
        return;
    }

    btn.classList.add('opacity-50', 'pointer-events-none');
    btn.textContent = "TRANSMITTING REGISTRATION VECTOR...";

    const body = new URLSearchParams();
    body.append(GOOGLE_FORM.fields.email, document.getElementById('email').value.trim());
    body.append(GOOGLE_FORM.fields.framework, document.getElementById('framework').value);

    try {
        // Google Forms doesn't send CORS headers, so use no-cors (response is opaque).
        await fetch(GOOGLE_FORM.action, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });
        document.getElementById('waitlist-form').classList.add('hidden');
        document.getElementById('form-success').classList.remove('hidden');
    } catch (_) {
        btn.classList.remove('opacity-50', 'pointer-events-none');
        btn.textContent = "GET EARLY ACCESS";
        err.textContent = "Network error. Please try again.";
        err.classList.remove('hidden');
    }
}
