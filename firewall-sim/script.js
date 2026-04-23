// State
let rules = [
    { id: 1, src: '*', dst: '192.168.1.10', port: '80', proto: 'TCP', action: 'ALLOW' },
    { id: 2, src: '10.0.0.5', dst: '*', port: '*', proto: 'ICMP', action: 'DENY' }
];
let ruleIdCounter = 3;

// DOM Elements
const rulesBody = document.getElementById('rules-body');
const addRuleForm = document.getElementById('add-rule-form');
const sendPacketForm = document.getElementById('send-packet-form');
const btnRandom = document.getElementById('btn-random');
const logList = document.getElementById('log-list');
const animationContainer = document.getElementById('animation-container');

// Initialization
function init() {
    renderRules();
    
    addRuleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addRule();
    });

    sendPacketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendManualPacket();
    });

    btnRandom.addEventListener('click', sendRandomPacket);
}

// Rule Management
function renderRules() {
    rulesBody.innerHTML = '';
    rules.forEach(rule => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rule.src}</td>
            <td>${rule.dst}</td>
            <td>${rule.port}</td>
            <td>${rule.proto}</td>
            <td class="action-${rule.action.toLowerCase()}">${rule.action}</td>
            <td><button class="btn-delete" onclick="deleteRule(${rule.id})" title="Delete Rule">×</button></td>
        `;
        rulesBody.appendChild(tr);
    });
}

function addRule() {
    const src = document.getElementById('rule-src').value.trim();
    const dst = document.getElementById('rule-dst').value.trim();
    const port = document.getElementById('rule-port').value.trim();
    const proto = document.getElementById('rule-proto').value;
    const action = document.getElementById('rule-action').value;

    rules.push({ id: ruleIdCounter++, src, dst, port, proto, action });
    renderRules();
    addRuleForm.reset();
}

window.deleteRule = function(id) {
    rules = rules.filter(r => r.id !== id);
    renderRules();
};

// Firewall Engine Logic
function evaluatePacket(packet) {
    for (let rule of rules) {
        let srcMatch = (rule.src === '*' || rule.src === packet.src);
        let dstMatch = (rule.dst === '*' || rule.dst === packet.dst);
        let portMatch = (rule.port === '*' || rule.port === packet.port);
        let protoMatch = (rule.proto === '*' || rule.proto === packet.proto);

        if (srcMatch && dstMatch && portMatch && protoMatch) {
            return { action: rule.action, reason: `Matched Rule: ${rule.src} -> ${rule.dst} on port ${rule.port}` };
        }
    }
    return { action: 'DENY', reason: 'Default Deny (No match)' };
}

// Packet Generation & Animation
function sendManualPacket() {
    const packet = {
        src: document.getElementById('pkt-src').value.trim(),
        dst: document.getElementById('pkt-dst').value.trim(),
        port: document.getElementById('pkt-port').value.trim(),
        proto: document.getElementById('pkt-proto').value
    };
    processPacket(packet);
}

function sendRandomPacket() {
    const protocols = ['TCP', 'UDP', 'ICMP'];
    const ports = ['80', '443', '22', '53', '3306'];
    const sources = ['8.8.8.8', '1.1.1.1', '10.0.0.5', '203.0.113.1'];
    
    const packet = {
        src: sources[Math.floor(Math.random() * sources.length)],
        dst: '192.168.1.10',
        port: ports[Math.floor(Math.random() * ports.length)],
        proto: protocols[Math.floor(Math.random() * protocols.length)]
    };
    
    // Update inputs to show what was generated
    document.getElementById('pkt-src').value = packet.src;
    document.getElementById('pkt-port').value = packet.port;
    document.getElementById('pkt-proto').value = packet.proto;

    processPacket(packet);
}

function processPacket(packet) {
    const result = evaluatePacket(packet);
    animatePacket(packet, result);
    logTraffic(packet, result);
}

function animatePacket(packet, result) {
    const pktEl = document.createElement('div');
    pktEl.className = `packet ${packet.proto.toLowerCase()}`;
    pktEl.textContent = packet.proto;
    
    // Start at left
    pktEl.style.left = '0%';
    animationContainer.appendChild(pktEl);

    // Trigger reflow
    void pktEl.offsetWidth;

    // Move to firewall (center)
    pktEl.style.left = '45%';

    setTimeout(() => {
        if (result.action === 'ALLOW') {
            // Continue to local network
            pktEl.style.left = '95%';
            setTimeout(() => pktEl.remove(), 2000);
        } else {
            // Block at firewall
            showBurst(pktEl);
            pktEl.remove();
            flashFirewall();
        }
    }, 2000); // Wait for packet to reach middle (matches CSS transition)
}

function showBurst(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = animationContainer.getBoundingClientRect();
    
    const burst = document.createElement('div');
    burst.className = 'packet-burst';
    burst.style.left = `${rect.left - containerRect.left + rect.width/2}px`;
    burst.style.top = `${rect.top - containerRect.top + rect.height/2}px`;
    burst.style.backgroundColor = 'var(--danger)';
    
    animationContainer.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
}

function flashFirewall() {
    const wall = document.querySelector('.firewall-wall');
    wall.style.backgroundColor = 'var(--danger)';
    wall.style.boxShadow = '0 0 30px var(--danger)';
    setTimeout(() => {
        wall.style.backgroundColor = '';
        wall.style.boxShadow = '';
    }, 300);
}

// Logging
function logTraffic(packet, result) {
    const li = document.createElement('li');
    li.className = result.action === 'ALLOW' ? 'log-allow' : 'log-deny';
    
    const time = new Date().toLocaleTimeString();
    
    li.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-details">${packet.src} -> ${packet.dst}:${packet.port} (${packet.proto})</span>
        <span class="log-status">${result.action}</span>
    `;
    
    logList.insertBefore(li, logList.firstChild);
    
    // Keep log clean
    if (logList.children.length > 50) {
        logList.lastChild.remove();
    }
}

// Start
init();
