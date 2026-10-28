const BASE_BLOCK = "p-3 rounded border bg-slate-900/60 border-slate-800 transition-colors";
const PASS = ['border-emerald-500/30', 'bg-emerald-500/5'];
const FAIL = "p-3 rounded border bg-red-500/5 border-red-500/40";
const OUT_BASE = "p-4 rounded border text-center font-bold text-sm transition-colors ";
const OUT_OK = OUT_BASE + "bg-emerald-500/10 border-emerald-500 text-emerald-400";
const OUT_BAD = OUT_BASE + "bg-red-500/10 border-red-500 text-red-400";

const SCENARIOS = {
  human: {
    input: "UA: Mozilla/5.0 Chrome/120 | Body: clean data | Inter-arrival: 4.2s (Human speed)",
    t1: ["pass", "User-Agent check PASS. Handshake signature evaluation PASS. Forwarding down-chain."],
    t2: ["pass", "Cadence check PASS (CV: 0.85). Semantic parsing scoring value: 0/100 points. Action: ALLOW."],
    out: [OUT_OK, "OUTCOME: HTTP 200 ALLOWED (Forwarded cleanly to application origin node)"],
  },
  playwright: {
    input: "UA: Playwright/1.40 Headless Engine | Body: normal comments | Routing vector: active",
    t1: ["fail", "MATCH DETECTED: Inline Automation Engine Substring Found. Injecting immediate local kill vector."],
    t2: ["skip", "Bypassed entirely. Edge context issued async out-of-band report token down-stream to state engine database."],
    out: [OUT_BAD, "OUTCOME: HTTP 403 FORBIDDEN | Header: [x-bouncer-blocked: tier1] (Dropped at edge)"],
  },
  timing: {
    input: "UA: Mozilla/5.0 Chrome/120 (Spoofed) | Body: clean data | Inter-arrival history: [2.00s, 2.01s, 1.99s, 2.00s]",
    t1: ["pass", "User-Agent check PASS. Spoofed network layer signatures mimic desktop environments. Evaluating Tier 2."],
    t2: ["fail", "TIMING THREAT DETECTED: Coefficient of variation < 0.01 (Constant Rhythm Bot). Scored 70 pts. Evicting IP."],
    out: [OUT_BAD, "OUTCOME: HTTP 403 FORBIDDEN | State: IP blocklisted in Redis memory layer (1-Hour TTL)"],
  },
  sqli: {
    input: "UA: Mozilla/5.0 Firefox/118 | Body: {'data': '; system(\"cat /etc/passwd\");'} | Dynamic attack footprint",
    t1: ["pass", "Initial structural network footprint metrics conform to criteria limits. Routing payload upstream."],
    t2: ["fail", "SEMANTIC EXPLOIT DETECTED: RCE system string payload match triggered. Evaluation score: 80/100 points."],
    out: [OUT_BAD, "OUTCOME: HTTP 403 FORBIDDEN | Action: Malicious injection blocked prior to database persistence execution layers"],
  },
};

let simTimers = [];

function paint(el, textEl, [state, text]) {
  if (state === "pass") el.classList.add(...PASS);
  else if (state === "fail") el.className = FAIL;
  else if (state === "skip") el.classList.add("opacity-40");
  textEl.textContent = text;
}

function runSimulation(type, btn) {
  document.querySelectorAll('#simulator button').forEach(b => {
    b.classList.remove('bg-slate-800', 'text-slate-200', 'border-slate-700');
    b.classList.add('bg-slate-900', 'text-slate-400', 'border-transparent');
  });
  btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-transparent');
  btn.classList.add('bg-slate-800', 'text-slate-200', 'border-slate-700');

  simTimers.forEach(clearTimeout);
  simTimers = [];

  const s = SCENARIOS[type];
  const inputBlock = document.getElementById('sim-input');
  const t1 = document.getElementById('sim-t1');
  const t2 = document.getElementById('sim-t2');
  const out = document.getElementById('sim-outcome');

  [inputBlock, t1, t2].forEach(el => el.className = BASE_BLOCK);
  document.getElementById('txt-t1').textContent = "Idle.";
  document.getElementById('txt-t2').textContent = "Idle.";
  out.className = OUT_BASE + "bg-slate-900/60 border-slate-800";
  out.textContent = "OUTCOME: PROCESSING REQUEST PROFILE...";
  document.getElementById('txt-input').textContent = s.input;

  simTimers.push(setTimeout(() => paint(t1, document.getElementById('txt-t1'), s.t1), 400));
  simTimers.push(setTimeout(() => paint(t2, document.getElementById('txt-t2'), s.t2), 800));
  simTimers.push(setTimeout(() => { out.className = s.out[0]; out.textContent = s.out[1]; }, 1200));
}

function handleWaitlistSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn');
  btn.classList.add('opacity-50', 'pointer-events-none');
  btn.textContent = "TRANSMITTING SIGNALS...";
  // TODO: replace with a real POST to your waitlist endpoint
  setTimeout(() => {
    document.getElementById('waitlist-form').classList.add('hidden');
    document.getElementById('form-success').classList.remove('hidden');
  }, 1000);
}
