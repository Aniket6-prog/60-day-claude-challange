// --- Game Configuration & Data ---
const GAME_DURATION = 180; // seconds

const ALERT_DB = [
    {
        type: 'Port Congestion',
        desc: 'Vessels delayed at primary origin port by 7 days due to labor strike.',
        priorities: ['Critical', 'High'],
        baseTtl: 20,
        actions: [
            { label: 'Reroute Ships', impact: { cost: 8000, trans: 2, service: -2, score: 50 }, correct: true, log: 'Rerouted to secondary port. Slight delay, manageable cost.' },
            { label: 'Air Freight Urgent', impact: { cost: 25000, trans: -5, service: 5, csat: 2, rev: 15000, score: 30 }, correct: true, log: 'Air freight approved. Very expensive but saved key customer.' },
            { label: 'Wait it out', impact: { cost: 0, trans: -10, service: -15, csat: -10, score: -50 }, correct: false, log: 'Waited on congestion. Severe delays angered customers.' }
        ]
    },
    {
        type: 'Supplier Delay',
        desc: 'Key component supplier facing raw material shortage. Production halting.',
        priorities: ['High', 'Medium'],
        baseTtl: 15,
        actions: [
            { label: 'Use Backup Supplier', impact: { cost: 5000, inv: 5, service: 2, score: 60 }, correct: true, log: 'Backup supplier activated. Margins hit slightly but production saved.' },
            { label: 'Expedite Materials', impact: { cost: 12000, inv: 2, service: 0, score: 20 }, correct: true, log: 'Expedited raw materials. Costly fix.' },
            { label: 'Ignore', impact: { cost: 0, inv: -15, service: -10, csat: -5, score: -60 }, correct: false, log: 'Ignored supplier delay. Factory lines stopped.' }
        ]
    },
    {
        type: 'Truck Breakdown',
        desc: 'LTL carrier broke down on highway carrying high-value electronics.',
        priorities: ['Medium'],
        baseTtl: 12,
        actions: [
            { label: 'Dispatch Rescue Team', impact: { cost: 2000, trans: 5, service: 2, rev: 5000, score: 40 }, correct: true, log: 'Rescue truck secured high-value cargo.' },
            { label: 'Wait for Carrier Fix', impact: { cost: 0, trans: -5, service: -5, csat: -2, score: -20 }, correct: false, log: 'Carrier took 24hrs to fix truck. Delivery missed.' }
        ]
    },
    {
        type: 'Warehouse Stockout',
        desc: 'Regional DC ran out of top-selling SKU during promotion.',
        priorities: ['Critical'],
        baseTtl: 15,
        actions: [
            { label: 'Transfer Inventory', impact: { cost: 3000, inv: 5, trans: -2, rev: 10000, score: 50 }, correct: true, log: 'Inventory cross-docked from neighboring DC.' },
            { label: 'Cancel Backorders', impact: { cost: 0, inv: -5, csat: -15, rev: -5000, score: -80 }, correct: false, log: 'Cancelled orders. Customers furious, revenue lost.' }
        ]
    },
    {
        type: 'Customs Inspection',
        desc: 'Flagship container held at customs for random intensive exam.',
        priorities: ['High', 'Medium'],
        baseTtl: 18,
        actions: [
            { label: 'Expedite Broker Docs', impact: { cost: 500, service: 2, trans: 2, score: 40 }, correct: true, log: 'Broker cleared docs fast. Container released.' },
            { label: 'Delay Decision', impact: { cost: 0, service: -2, csat: -2, score: 0 }, correct: null, delayed: true, log: 'Delayed customs decision. Storage fees accumulating.' },
            { label: 'Do Nothing', impact: { cost: 1500, trans: -10, service: -10, score: -40 }, correct: false, log: 'Customs held container for a week. High demurrage costs.' }
        ]
    },
    {
        type: 'Demand Spike',
        desc: 'Viral social media trend caused 300% spike in orders.',
        priorities: ['Critical', 'High'],
        baseTtl: 12,
        actions: [
            { label: 'Approve Overtime', impact: { cost: 10000, inv: 5, service: 5, rev: 25000, score: 80 }, correct: true, log: 'Factory OT approved. Captured massive revenue upside.' },
            { label: 'Ration Stock', impact: { cost: 0, inv: 2, csat: -5, rev: 5000, score: 10 }, correct: true, log: 'Stock rationed. Saved inventory but missed sales potential.' },
            { label: 'Ignore', impact: { cost: 0, inv: -20, csat: -15, score: -60 }, correct: false, log: 'Ignored demand spike. Massive stockouts and site crashes.' }
        ]
    },
    {
        type: 'Weather Disruption',
        desc: 'Hurricane closing major southeast transit corridors.',
        priorities: ['Critical'],
        baseTtl: 20,
        actions: [
            { label: 'Pre-position Stock', impact: { cost: 6000, trans: 5, service: 8, rev: 8000, score: 70 }, correct: true, log: 'Moved stock ahead of storm. Customers supplied perfectly.' },
            { label: 'Halt Operations', impact: { cost: 0, trans: -5, service: -5, score: 10 }, correct: null, log: 'Halted ops for safety. Minor delays but no losses.' },
            { label: 'Risk Transit', impact: { cost: 12000, trans: -15, service: -10, csat: -5, score: -50 }, correct: false, log: 'Trucks stuck in storm. Damaged goods and huge delays.' }
        ]
    },
    {
        type: 'Factory Machine Failure',
        desc: 'Main packaging line down. Repair part is 2 days away.',
        priorities: ['High'],
        baseTtl: 15,
        actions: [
            { label: 'Manual Packaging', impact: { cost: 4000, inv: -2, service: 2, score: 40 }, correct: true, log: 'Shifted to manual labor. Slower but kept line moving.' },
            { label: 'Air Freight Part', impact: { cost: 8000, inv: 5, service: 5, score: 50 }, correct: true, log: 'Part flown in overnight. Line restored quickly.' },
            { label: 'Wait for Part', impact: { cost: 0, inv: -15, service: -10, score: -40 }, correct: false, log: 'Line down for 2 days. Severe backlog created.' }
        ]
    }
];

// --- Game State ---
let state = {
    time: GAME_DURATION,
    isPlaying: false,
    isPaused: false,
    loopInterval: null,
    alerts: [], // currently active alerts
    alertCounter: 0,
    stats: {
        resolved: 0,
        correct: 0,
        wrong: 0,
        missed: 0
    },
    kpis: {
        service: { val: 90, format: '%' },
        csat: { val: 85, format: '%' },
        inventory: { val: 80, format: '%' },
        transport: { val: 80, format: '%' },
        cost: { val: 50000, format: '$' },
        revenue: { val: 0, format: '$' },
        score: { val: 0, format: '' }
    }
};

// --- DOM Elements ---
const els = {
    time: document.getElementById('timer'),
    btnStart: document.getElementById('btn-start'),
    btnPause: document.getElementById('btn-pause'),
    btnHelp: document.getElementById('btn-help'),
    btnRestart: document.getElementById('btn-restart'),
    alertsContainer: document.getElementById('alerts-container'),
    logContainer: document.getElementById('log-container'),
    alertsCount: document.getElementById('active-alerts-count'),
    modals: {
        intro: document.getElementById('intro-modal'),
        end: document.getElementById('end-modal')
    }
};

// --- Initialization & Flow ---
function init() {
    els.btnStart.addEventListener('click', startGame);
    els.btnRestart.addEventListener('click', resetGame);
    els.btnPause.addEventListener('click', togglePause);
    els.btnHelp.addEventListener('click', () => { els.modals.intro.classList.add('active'); togglePause(true); });
    updateKpiUI(true);
}

function startGame() {
    els.modals.intro.classList.remove('active');
    if(state.isPaused) {
        togglePause(false);
        return;
    }
    state.isPlaying = true;
    logEvent('System Online. Head of Ops shift started.', 'success');
    state.loopInterval = setInterval(gameTick, 1000);
}

function resetGame() {
    clearInterval(state.loopInterval);
    els.modals.end.classList.remove('active');
    
    // Reset State
    state.time = GAME_DURATION;
    state.isPlaying = false;
    state.isPaused = false;
    state.alerts = [];
    state.alertCounter = 0;
    state.stats = { resolved: 0, correct: 0, wrong: 0, missed: 0 };
    state.kpis = {
        service: { val: 90, format: '%' },
        csat: { val: 85, format: '%' },
        inventory: { val: 80, format: '%' },
        transport: { val: 80, format: '%' },
        cost: { val: 50000, format: '$' },
        revenue: { val: 0, format: '$' },
        score: { val: 0, format: '' }
    };
    
    // Reset UI
    els.alertsContainer.innerHTML = '';
    els.logContainer.innerHTML = '';
    els.btnPause.innerText = 'Pause';
    document.getElementById('system-status').innerText = 'System Online';
    document.querySelector('.dot').style.background = 'var(--alert-green)';
    document.querySelector('.dot').style.animation = 'pulse-green 2s infinite';
    
    updateKpiUI(true);
    updateTimeUI();
    startGame();
}

function togglePause(forcePause = null) {
    if(!state.isPlaying) return;
    
    if (forcePause !== null) {
        state.isPaused = forcePause;
    } else {
        state.isPaused = !state.isPaused;
    }
    
    if(state.isPaused) {
        els.btnPause.innerText = 'Resume';
        document.getElementById('system-status').innerText = 'System Paused';
        document.querySelector('.dot').style.animation = 'none';
        document.querySelector('.dot').style.background = 'var(--alert-orange)';
    } else {
        els.btnPause.innerText = 'Pause';
        document.getElementById('system-status').innerText = 'System Online';
        document.querySelector('.dot').style.animation = 'pulse-green 2s infinite';
        document.querySelector('.dot').style.background = 'var(--alert-green)';
        els.modals.intro.classList.remove('active'); // in case help was open
    }
}

// --- Core Game Loop ---
function gameTick() {
    if (!state.isPlaying || state.isPaused) return;

    state.time--;
    updateTimeUI();

    // Handle active alerts (countdown)
    for (let i = state.alerts.length - 1; i >= 0; i--) {
        let alert = state.alerts[i];
        alert.timeLeft--;
        
        updateAlertUI(alert);

        if (alert.timeLeft <= 0) {
            // Time ran out on alert
            failAlert(alert);
            state.alerts.splice(i, 1);
            removeAlertUI(alert.id);
        }
    }

    // Spawn new alerts logic
    // Difficulty curve: Base 12% chance per sec, increases as time runs low. Max ~40%.
    const progress = 1 - (state.time / GAME_DURATION); // 0.0 to 1.0
    const spawnChance = 0.12 + (progress * 0.28); 
    
    if (state.alerts.length < 5 && Math.random() < spawnChance) {
        spawnAlert();
    }

    els.alertsCount.innerText = `${state.alerts.length} Active`;

    if (state.time <= 0) {
        endGame();
    }
}

// --- Alert Mechanics ---
function spawnAlert() {
    const template = ALERT_DB[Math.floor(Math.random() * ALERT_DB.length)];
    const priority = template.priorities[Math.floor(Math.random() * template.priorities.length)];
    
    // Adjust TTL based on priority and game progress
    const progress = 1 - (state.time / GAME_DURATION);
    let ttl = template.baseTtl - Math.floor(progress * 5); // gets slightly faster
    if(priority === 'Critical') ttl -= 2;
    if(ttl < 8) ttl = 8; // floor

    state.alertCounter++;
    const newAlert = {
        id: `alert-${state.alertCounter}`,
        type: template.type,
        desc: template.desc,
        priority: priority,
        maxTime: ttl,
        timeLeft: ttl,
        actions: template.actions
    };

    state.alerts.push(newAlert);
    createAlertUI(newAlert);
}

function handleAction(alertId, actionIndex) {
    if(state.isPaused) return;

    const alertIndex = state.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) return; // already handled/expired

    const alert = state.alerts[alertIndex];
    const action = alert.actions[actionIndex];

    // Apply Impact
    applyImpact(action.impact);
    
    // Log & Stats
    state.stats.resolved++;
    let msgType = 'warning';
    if (action.correct === true) {
        state.stats.correct++;
        msgType = 'success';
    } else if (action.correct === false) {
        state.stats.wrong++;
        msgType = 'error';
    }

    logEvent(`[${alert.type}] ${action.log}`, msgType);

    // Handle Delayed Effects (simple implementation: timeout)
    if(action.delayed) {
        setTimeout(() => {
            if(state.isPlaying) {
                applyImpact({ csat: -5, cost: 2000, score: -10 });
                logEvent(`Delayed fallout from [${alert.type}]: Storage fees incurred.`, 'error');
            }
        }, 8000);
    }

    // Remove Alert
    state.alerts.splice(alertIndex, 1);
    removeAlertUI(alertId);
    els.alertsCount.innerText = `${state.alerts.length} Active`;
}

// Make globally available so inline HTML onclick works
window.handleAction = handleAction;

function failAlert(alert) {
    state.stats.missed++;
    state.stats.wrong++;
    
    // Heavy penalty for missing an alert
    let penalty = { service: -5, csat: -5, score: -30 };
    if (alert.priority === 'Critical') {
        penalty = { service: -10, csat: -10, score: -60, cost: 5000 };
    }

    applyImpact(penalty);
    logEvent(`[${alert.type}] Expired! Penalty applied.`, 'error');
}

function applyImpact(impact) {
    if(!impact) return;

    let flashMap = {};

    if(impact.service) { state.kpis.service.val += impact.service; flashMap.service = impact.service > 0; }
    if(impact.csat) { state.kpis.csat.val += impact.csat; flashMap.csat = impact.csat > 0; }
    if(impact.inventory) { state.kpis.inventory.val += impact.inventory; flashMap.inventory = impact.inventory > 0; }
    if(impact.transport) { state.kpis.transport.val += impact.transport; flashMap.transport = impact.transport > 0; }
    if(impact.cost) { state.kpis.cost.val += impact.cost; flashMap.cost = impact.cost < 0; } // Lower cost is good
    if(impact.rev) { state.kpis.revenue.val += impact.rev; flashMap.revenue = impact.rev > 0; }
    if(impact.score) { state.kpis.score.val += impact.score; flashMap.score = impact.score > 0; }

    // Clamp percentages
    ['service', 'csat', 'inventory', 'transport'].forEach(k => {
        if(state.kpis[k].val > 100) state.kpis[k].val = 100;
        if(state.kpis[k].val < 0) state.kpis[k].val = 0;
    });

    updateKpiUI(false, flashMap, impact);
}

// --- UI Updaters ---
function updateTimeUI() {
    const m = Math.floor(state.time / 60).toString().padStart(2, '0');
    const s = (state.time % 60).toString().padStart(2, '0');
    els.time.innerText = `${m}:${s}`;
    
    if(state.time <= 30) {
        els.time.style.color = 'var(--alert-red)';
        els.time.style.borderColor = 'var(--alert-red)';
        els.time.style.boxShadow = 'var(--glow-red)';
    } else {
        els.time.style.color = 'var(--alert-orange)';
        els.time.style.borderColor = 'var(--alert-orange)';
        els.time.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.2)';
    }
}

function updateKpiUI(force = false, flashMap = {}, impact = {}) {
    for(const [key, kpi] of Object.entries(state.kpis)) {
        const elVal = document.getElementById(`val-${key}`);
        const elCard = document.getElementById(`kpi-${key}`);
        const elTrend = document.getElementById(`trend-${key}`);
        
        // Format value
        let displayVal = kpi.val;
        if(kpi.format === '%') displayVal = `${kpi.val}%`;
        if(kpi.format === '$') displayVal = `$${kpi.val.toLocaleString()}`;
        
        if(elVal.innerText !== displayVal || force) {
            elVal.innerText = displayVal;
        }

        // Handle Flash Animations and Trends
        if(flashMap[key] !== undefined) {
            elCard.classList.remove('flash-green', 'flash-red');
            void elCard.offsetWidth; // trigger reflow
            elCard.classList.add(flashMap[key] ? 'flash-green' : 'flash-red');

            if(elTrend && impact[key]) {
                const sign = impact[key] > 0 ? '+' : '';
                let formatSign = kpi.format === '$' ? (impact[key] > 0 ? '+$' : '-$') : sign;
                let absVal = kpi.format === '$' ? Math.abs(impact[key]).toLocaleString() : impact[key];
                let trendText = kpi.format === '$' ? `${formatSign}${absVal}` : `${sign}${absVal}${kpi.format}`;
                
                elTrend.innerText = trendText;
                elTrend.style.color = flashMap[key] ? 'var(--alert-green)' : 'var(--alert-red)';
                elTrend.style.opacity = 1;
                
                setTimeout(() => {
                    if(elTrend) elTrend.style.opacity = 0;
                }, 1500);
            }
        }

        // Global styling logic based on thresholds (for percentages)
        if(kpi.format === '%' && !force) {
            if(kpi.val < 60) elVal.style.color = 'var(--alert-red)';
            else if(kpi.val < 80) elVal.style.color = 'var(--alert-orange)';
            else elVal.style.color = 'var(--text-main)';
        }
    }
}

function createAlertUI(alert) {
    const card = document.createElement('div');
    card.className = `alert-card priority-${alert.priority}`;
    card.id = alert.id;

    let actionHtml = '';
    alert.actions.forEach((act, idx) => {
        actionHtml += `<button class="action-btn" onclick="handleAction('${alert.id}', ${idx})">${act.label}</button>`;
    });

    card.innerHTML = `
        <div class="alert-header">
            <div class="alert-title">${alert.type}</div>
            <div class="alert-badge badge-${alert.priority}">${alert.priority}</div>
        </div>
        <div class="alert-desc">${alert.desc}</div>
        <div class="alert-timer-bar">
            <div class="alert-timer-fill" id="bar-${alert.id}"></div>
        </div>
        <div class="alert-actions">
            ${actionHtml}
        </div>
    `;
    
    // Insert at top
    els.alertsContainer.prepend(card);
}

function updateAlertUI(alert) {
    const bar = document.getElementById(`bar-${alert.id}`);
    if(bar) {
        const pct = (alert.timeLeft / alert.maxTime) * 100;
        bar.style.width = `${pct}%`;
        
        if(pct < 30) {
            bar.style.background = 'var(--alert-red)';
        } else if (pct < 60) {
            bar.style.background = 'var(--alert-orange)';
        }
    }
}

function removeAlertUI(alertId) {
    const card = document.getElementById(alertId);
    if(card) {
        card.style.animation = 'slideLeft 0.3s ease reverse';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
    }
}

function logEvent(msg, type = 'info') {
    const m = Math.floor(state.time / 60).toString().padStart(2, '0');
    const s = (state.time % 60).toString().padStart(2, '0');
    
    const el = document.createElement('div');
    el.className = `log-entry ${type}`;
    el.innerHTML = `<span class="log-time">${m}:${s}</span> ${msg}`;
    
    els.logContainer.prepend(el);

    // Limit log size
    if(els.logContainer.children.length > 30) {
        els.logContainer.lastChild.remove();
    }
}

// --- End Game ---
function endGame() {
    clearInterval(state.loopInterval);
    state.isPlaying = false;
    
    // Calculate Final Grade
    let grade = 'D';
    const s = state.kpis.score.val;
    if(s >= 1200) grade = 'S+';
    else if(s >= 800) grade = 'A';
    else if(s >= 500) grade = 'B';
    else if(s >= 200) grade = 'C';
    
    // Edge case failures
    if(state.kpis.service.val < 50 || state.kpis.csat.val < 50) grade = 'F';

    // Generate Summary Text
    let summary = "";
    if (grade === 'S+' || grade === 'A') {
        summary = "Exceptional leadership. Supply chain resilience maintained under heavy disruption.";
    } else if (grade === 'B' || grade === 'C') {
        summary = "Operations survived, but with noticeable impact to margins and customer trust.";
    } else {
        summary = "System failure. Poor decisions and slow response times collapsed the network.";
    }

    // Populate Modal
    document.getElementById('final-grade').innerText = grade;
    
    const gradeEl = document.getElementById('final-grade');
    if(['S+','A'].includes(grade)) { gradeEl.style.color = 'var(--alert-green)'; gradeEl.style.textShadow = 'var(--glow-green)'; }
    else if(['B','C'].includes(grade)) { gradeEl.style.color = 'var(--alert-orange)'; gradeEl.style.textShadow = '0 0 15px rgba(245, 158, 11, 0.4)'; }
    else { gradeEl.style.color = 'var(--alert-red)'; gradeEl.style.textShadow = 'var(--glow-red)'; }

    document.getElementById('end-summary').innerText = summary;
    document.getElementById('final-score').innerText = state.kpis.score.val;
    document.getElementById('final-resolved').innerText = state.stats.resolved;
    document.getElementById('final-correct').innerText = state.stats.correct;
    document.getElementById('final-wrong').innerText = state.stats.wrong + state.stats.missed;

    els.modals.end.classList.add('active');
}

// Bootstrap
window.addEventListener('DOMContentLoaded', init);