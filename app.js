/**
 * app.js — VIA Campus Map: UI Controller
 */

(function () {
    'use strict';

    // ─── STATE ────────────────────────────────────────────────────────────────
    // ─── STATE ────────────────────────────────────────────────────────────────
    let currentFloor = 1;
    let panelOpen    = false;
    let zoomLevel    = 1;

    // ─── DOM ──────────────────────────────────────────────────────────────────
    const floorBtns       = document.querySelectorAll('.floor-btn');
    const quickBtns       = document.querySelectorAll('.quick-btn');
    const sidebarRight    = document.getElementById('sidebarRight');
    const panelContent    = document.getElementById('panelContent');
    const panelClose      = document.getElementById('panelClose');
    const floorLabelBadge = document.getElementById('floorLabelBadge');
    const toast           = document.getElementById('toast');
    const eventsModal     = document.getElementById('eventsModal');
    const eventsModalClose= document.getElementById('eventsModalClose');
    
    // NEW Floating Directions box
    const floatDirBox     = document.getElementById('floatDirBox');
    const fabDirToggle    = document.getElementById('fabDirToggle');
    const dirGoBtn        = document.getElementById('dirGoBtn');
    const dirTo           = document.getElementById('dirTo');
    const dirResult       = document.getElementById('dirResult');
    const floorSvg        = document.getElementById('floorSvg');

    // ─── CLOCK ────────────────────────────────────────────────────────────────
    // Clock removed since header is removed.

    // ─── FLOOR SWITCH ─────────────────────────────────────────────────────────
    function setFloor(n) {
        currentFloor = n;
        floorBtns.forEach(b => b.classList.toggle('active', +b.dataset.floor === n));
        
        if (n === 0) {
            document.getElementById('welcomeScreen').classList.remove('hidden');
            floorLabelBadge.textContent = 'Welcome Hub';
        } else {
            document.getElementById('welcomeScreen').classList.add('hidden');
            const lbl = FLOOR_DATA[n]?.label || `${n}F`;
            floorLabelBadge.textContent = lbl;
            MapAPI.load(n);
        }
        
        if (!panelOpen) panelContent.innerHTML = welcomeHTML();
    }

    floorBtns.forEach(b => b.addEventListener('click', () => setFloor(+b.dataset.floor)));
    setFloor(0);

    // Hubs removed per user request.

    // ─── PAN + ZOOM (Google Maps style) ──────────────────────────────────────
    let panX = 0, panY = 0;
    let isPanning = false;
    let startX = 0, startY = 0;

    function applyTransform() {
        if (currentFloor === 0) return;
        floorSvg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
        floorSvg.style.transformOrigin = '0 0';
        floorSvg.style.cursor = isPanning ? 'grabbing' : 'grab';
    }

    function applyZoom(newZoom, pivotX, pivotY) {
        if (currentFloor === 0) return;
        const bounded = Math.min(4, Math.max(0.3, newZoom));
        const scale = bounded / zoomLevel;
        // Zoom toward cursor: adjust pan so pivot point stays fixed
        panX = pivotX - scale * (pivotX - panX);
        panY = pivotY - scale * (pivotY - panY);
        zoomLevel = bounded;
        applyTransform();
    }

    function resetView() {
        zoomLevel = 1; panX = 0; panY = 0;
        applyTransform();
    }

    const mapArea = document.getElementById('mapArea');

    // Scroll to zoom toward cursor
    mapArea.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = mapArea.getBoundingClientRect();
        const pivotX = e.clientX - rect.left;
        const pivotY = e.clientY - rect.top;
        applyZoom(zoomLevel * (e.deltaY < 0 ? 1.12 : 0.89), pivotX, pivotY);
    }, { passive: false });

    // Mouse pan
    mapArea.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (e.target.closest('.floating-floor-nav, .fab-bar, .floating-dir-box, .map-branding, #sidebarRight')) return;
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        applyTransform();
    });
    window.addEventListener('mousemove', e => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyTransform();
    });
    window.addEventListener('mouseup', () => {
        if (!isPanning) return;
        isPanning = false;
        applyTransform();
    });

    // Touch pan+zoom
    let lastTouchDist = null;
    let lastTouchMidX = 0, lastTouchMidY = 0;
    mapArea.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isPanning = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
            isPanning = false;
            lastTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            lastTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            lastTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        }
    }, { passive: true });
    mapArea.addEventListener('touchmove', e => {
        if (e.touches.length === 1 && isPanning) {
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
            applyTransform();
        } else if (e.touches.length === 2 && lastTouchDist) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const rect = mapArea.getBoundingClientRect();
            applyZoom(zoomLevel * (dist / lastTouchDist), lastTouchMidX - rect.left, lastTouchMidY - rect.top);
            lastTouchDist = dist;
        }
    }, { passive: true });
    mapArea.addEventListener('touchend', () => { isPanning = false; lastTouchDist = null; }, { passive: true });

    // Reset view when switching floor
    const _origSetFloor = setFloor;
    // (resetView called at end of setFloor already via MapAPI.load)

    // ─── PANEL ────────────────────────────────────────────────────────────────
    window.openPanel = function (room, status) {
        panelOpen = true;
        sidebarRight.classList.add('open');
        panelContent.innerHTML = buildPanelHTML(room, status);
    };

    function closePanel() {
        panelOpen = false;
        sidebarRight.classList.remove('open');
        setTimeout(() => { if (!panelOpen) panelContent.innerHTML = welcomeHTML(); }, 300);
    }
    panelClose.addEventListener('click', closePanel);

    // ─── PANEL CONTENT ────────────────────────────────────────────────────────
    function buildPanelHTML(room, status) {
        if (room.special === 'canteen')    return canteenPanel();
        if (room.special === 'cafe')       return cafePanel();
        if (room.special === 'makerspace') return makerspacePanel();
        if (room.special === 'events')     return eventsPanelHTML();
        return defaultPanel(room, status);
    }

    function statusBadge(status, type) {
        const map = { available:'🟢 Available', occupied:'🔴 Occupied', facility:'🏢 Facility', event:'🎪 Event Space' };
        const s = type === 'facility' ? 'facility' : type === 'event' ? 'event' : status;
        return `<div class="panel-status-badge ${s}">${map[s] || s}</div>`;
    }

    function featureChips(features = []) {
        const icons = { tv:'📺 TV', whiteboard:'🖊️ Whiteboard', projector:'📽️ Projector',
            wifi:'📶 WiFi', coffee:'☕ Coffee', wheelchair:'♿ Accessible',
            smartboard:'🖥️ Smartboard', computers:'💻 PCs', recording:'🎙️ Recording',
            silent:'🔇 Silent', mic:'🎤 Mic', stage:'🎭 Stage',
            '3d-printer':'🖨️ 3D Printer', 'laser-cutter':'⚡ Laser Cutter',
            'flexible-layout':'🔄 Flexible Layout', 'camera':'📹 Camera', camera:'📹 Camera' };
        return features.map(f => {
            if (f.startsWith('capacity-')) return `<span class="chip">👥 ${f.replace('capacity-','')} seats</span>`;
            if (f.startsWith('seating-'))  return `<span class="chip">🪑 ${f.replace('seating-','')} seats</span>`;
            return icons[f] ? `<span class="chip">${icons[f]}</span>` : '';
        }).join('');
    }

    function defaultPanel(room, status) {
        const hasTV = (room.features||[]).includes('tv');
        const cap   = (room.features||[]).find(f => f.startsWith('capacity-'));
        return `
        <div class="panel-header">
            <div class="panel-room-name">${room.name}</div>
            <div class="panel-room-sub">Floor ${currentFloor} · Hub ${room.hub} · ${room.id}</div>
            ${statusBadge(status, room.type)}
        </div>
        ${room.info ? `<p style="font-size:13px;color:var(--text-soft);line-height:1.6;margin-bottom:14px;">${room.info}</p>` : ''}
        ${(room.features||[]).length ? `<div class="detail-section"><h4>Features</h4><div style="display:flex;flex-wrap:wrap;gap:4px;">${featureChips(room.features)}</div></div>` : ''}
        <div class="detail-section">
            <h4>Details</h4>
            <div class="detail-row"><span class="key">TV / Screen</span><span class="val ${hasTV?'yes':'no'}">${hasTV?'✓ Yes':'✕ No'}</span></div>
            ${cap ? `<div class="detail-row"><span class="key">Capacity</span><span class="val">${cap.replace('capacity-','')} people</span></div>` : ''}
            <div class="detail-row"><span class="key">Floor</span><span class="val">${currentFloor}</span></div>
        </div>
        ${room.reservable && status==='available' ? `<button class="reserve-btn" onclick="doReserve('${room.name}')">🗓️ Reserve This Room</button>` : ''}
        <button class="dir-go-btn" style="margin-top:8px;" onclick="doNavTo('${room.id}','${room.name}')">🧭 Get Directions Here</button>
        `;
    }

    function menuHTML(menuObj) {
        return Object.entries(menuObj).map(([cat, items]) => `
            <div class="menu-category">
                <h5>${cat}</h5>
                ${items.map(i => `<div class="menu-item"><span>${i.name}</span><span class="menu-price">${i.price}</span></div>`).join('')}
            </div>`).join('');
    }

    function canteenPanel() {
        return `<div class="panel-header">
            <div class="panel-room-name">🍽️ Main Canteen</div>
            <div class="panel-room-sub">Floor 1 · Open 08:00–15:30</div>
            <div class="panel-status-badge facility">Today's Menu</div>
        </div>${menuHTML(CANTEEN_MENU)}
        <button class="order-btn" onclick="showToast('🛒 Mobile ordering coming soon!')">Order Online →</button>`;
    }

    function cafePanel() {
        return `<div class="panel-header">
            <div class="panel-room-name">☕ Campus Café</div>
            <div class="panel-room-sub">Floor 2 · Open 07:30–18:00</div>
            <div class="panel-status-badge facility">Menu & Order</div>
        </div>${menuHTML(CAFE_MENU)}
        <button class="order-btn" onclick="showToast('☕ Order placed! Ready in ~4 min.')">Order Now →</button>`;
    }

    function makerspacePanel() {
        const cards = PRINTERS.map(p => `
            <div class="printer-card">
                <div class="printer-name">${p.name}</div>
                <div class="printer-status ${p.status}">${p.status==='free'?'✓ Available':`⏳ Busy · ${p.remaining} min · ${p.material}`}</div>
                <div class="printer-progress"><div class="printer-bar" style="width:${p.progress}%"></div></div>
            </div>`).join('');
        return `<div class="panel-header">
            <div class="panel-room-name">🖨️ MakerSpace</div>
            <div class="panel-room-sub">Floor 1 · Open 09:00–20:00</div>
            <div class="panel-status-badge facility">Equipment Status</div>
        </div>
        <div class="detail-section"><h4>3D Printers</h4><div class="printer-list">${cards}</div></div>
        <div class="detail-section"><h4>Other Equipment</h4>
            <div class="detail-row"><span class="key">Laser Cutter</span><span class="val yes">✓ Available</span></div>
            <div class="detail-row"><span class="key">Vinyl Cutter</span><span class="val yes">✓ Available</span></div>
            <div class="detail-row"><span class="key">Soldering Stations</span><span class="val yes">✓ Available</span></div>
        </div>
        <button class="reserve-btn" onclick="showToast('📋 Booking sent to your student email!')">Book a Printer Slot →</button>`;
    }

    function eventsPanelHTML() {
        return `<div class="panel-header">
            <div class="panel-room-name">📅 Events Pillar</div>
            <div class="panel-room-sub">Campus Bulletin Board</div>
            <div class="panel-status-badge event">Upcoming Events</div>
        </div>
        <div class="events-list" style="display:flex;flex-direction:column;gap:8px;">
            <div class="event-card"><div class="event-date">Today 12:00</div><div class="event-title">Tech Talk: AI in Healthcare</div><div class="event-loc">📍 Auditorium A</div><div class="event-tags"><span class="tag tag-open">Open</span></div></div>
            <div class="event-card"><div class="event-date">Today 15:00</div><div class="event-title">Robotics Club Meeting</div><div class="event-loc">📍 MakerSpace</div><div class="event-tags"><span class="tag tag-club">Club</span></div></div>
            <div class="event-card"><div class="event-date">Fri 18:00</div><div class="event-title">International Food Festival</div><div class="event-loc">📍 Canteen</div><div class="event-tags"><span class="tag tag-open">Open</span><span class="tag tag-free">Free</span></div></div>
        </div>
        <button class="order-btn" style="margin-top:12px;" onclick="document.getElementById('eventsModal').classList.remove('hidden')">See All Events →</button>`;
    }

    function welcomeHTML() {
        const rooms = FLOOR_DATA[currentFloor]?.rooms || [];
        const avail    = rooms.filter(r => roomStatus(r.id, r.type) === 'available').length;
        const occupied = rooms.filter(r => roomStatus(r.id, r.type) === 'occupied').length;
        return `<div class="panel-welcome">
            <div class="welcome-icon">🗺️</div>
            <h2>VIA Campus</h2>
            <p>Click any room or area on the map to see details, availability, and more.</p>
            <div class="stats-row">
                <div class="stat-card"><div class="stat-num">${avail}</div><div class="stat-lbl">Rooms Free</div></div>
                <div class="stat-card"><div class="stat-num">${occupied}</div><div class="stat-lbl">Occupied</div></div>
                <div class="stat-card"><div class="stat-num">3</div><div class="stat-lbl">Events Today</div></div>
            </div>
        </div>`;
    }

    // ─── GLOBAL PANEL ACTIONS ────────────────────────────────────────────────
    window.doReserve = name => showToast(`✅ Reservation for ${name} sent to your email!`);
    window.doNavTo   = (id, name) => {
        floatDirBox.classList.remove('hidden');
        dirTo.value = name;
        dirResult.innerHTML = `<strong>🎯 To:</strong> ${name}<br><br><strong>1.</strong> Start at your current location<br><strong>2.</strong> Follow the blue path on the map<br><strong>3.</strong> Arrive at <strong>${name}</strong>`;
        dirResult.style.display = 'block';
        MapAPI.navigate('LOBBY', id);
        showToast(`🧭 Directions to ${name} shown`);
    };

    // ─── QUICK BUTTONS & FAB ──────────────────────────────────────────────────
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const wasActive = btn.classList.contains('active');
            
            // Clear all buttons
            quickBtns.forEach(b => b.classList.remove('active'));
            
            // If it was already active, we just untoggled it -> Restore all rooms
            if (wasActive) {
                MapAPI.getPathElements().forEach(({groupEl}) => {
                    if (groupEl) groupEl.style.display = '';
                });
                return; // Everything is visible again
            }
            
            // Otherwise, activate this button
            btn.classList.add('active');
            
            if (action === 'directions') {
                floatDirBox.classList.remove('hidden');
                dirTo.focus();
                
                // Restore map while using directions
                MapAPI.getPathElements().forEach(({groupEl}) => {
                    if (groupEl) groupEl.style.display = '';
                });
                return;
            }
            floatDirBox.classList.add('hidden');
            
            // Custom Hide/Isolation Filtering Logic
            const paths = MapAPI.getPathElements();
            let count = 0;
            
            paths.forEach(({groupEl, room}) => {
                if (!groupEl) return;
                
                let match = false;
                if (action === 'group')      match = (room.type === 'group');
                if (action === 'classrooms') match = (room.type === 'classroom');
                if (action === 'creative')   match = (room.special === 'makerspace' || room.special === 'library' || (room.id && room.id.startsWith('PW.')));
                
                if (match) {
                    groupEl.style.display = ''; // Show
                    count++;
                } else {
                    groupEl.style.display = 'none'; // Hide if no match
                }
            });
            
            const msgs = { group:`👥 Showing ${count} Group Rooms`, classrooms:`🎓 Showing ${count} Classrooms`, creative:`🎨 Showing ${count} Creative Spaces` };
            showToast(msgs[action] || `Showing ${count} locations`);
        });
    });

    // ─── FLOOR 0 QUICK FEATURES ───────────────────────────────────────────────
    document.getElementById('featMap').addEventListener('click', () => {
        setFloor(1);
    });

    document.getElementById('featCanteen').addEventListener('click', () => {
        setFloor(1); // Canteen is on Floor 1
        const room = FLOOR_DATA[1].rooms.find(r => r.special === 'canteen');
        if (room) setTimeout(() => window.openPanel(room, 'facility'), 100);
    });
    
    document.getElementById('featCafe').addEventListener('click', () => {
        setFloor(2); // Cafe is on Floor 2
        const room = FLOOR_DATA[2].rooms.find(r => r.special === 'cafe');
        if (room) setTimeout(() => window.openPanel(room, 'facility'), 100);
    });
    
    document.getElementById('featMaker').addEventListener('click', () => {
        setFloor(1); // MakerSpace is on Floor 1
        const room = FLOOR_DATA[1].rooms.find(r => r.special === 'makerspace');
        if (room) setTimeout(() => window.openPanel(room, 'facility'), 100);
    });

    // ─── EVENTS MODAL ─────────────────────────────────────────────────────────
    eventsModalClose.addEventListener('click', () => eventsModal.classList.add('hidden'));
    eventsModal.addEventListener('click', e => { if (e.target === eventsModal) eventsModal.classList.add('hidden'); });

    // ─── DIRECTIONS ───────────────────────────────────────────────────────────
    dirGoBtn.addEventListener('click', () => {
        const q = dirTo.value.trim().toLowerCase();
        if (!q) { showToast('⚠️ Enter a destination'); return; }
        
        let found = null, foundFloor = null;
        for (const [fl, fd] of Object.entries(FLOOR_DATA)) {
            const r = fd.rooms.find(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
            if (r) { found = r; foundFloor = +fl; break; }
        }
        
        if (!found) { showToast(`⚠️ "${dirTo.value}" not found`); return; }
        if (foundFloor !== currentFloor) setFloor(foundFloor);
        
        dirResult.innerHTML = `<strong>📍 Destination:</strong> ${found.name}<br><strong>🏢 Floor ${foundFloor}</strong><br><br><strong>1.</strong> Go to Floor ${foundFloor}<br><strong>2.</strong> Enter via Hub ${found.hub || 'A'}<br><strong>3.</strong> Room is highlighted on map ✓`;
        dirResult.style.display = 'block';
        setTimeout(() => MapAPI.navigate('LOBBY', found.id), 350);
        showToast(`🧭 Navigating to ${found.name} on Floor ${foundFloor}`);
    });

    // Dark Mode / Theme toggle removed per user request.

    // ─── TOAST ────────────────────────────────────────────────────────────────
    let toastTimer;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
    }
    window.showToast = showToast;

    // ─── KEYBOARD ─────────────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { 
            closePanel(); 
            eventsModal.classList.add('hidden'); 
            floatDirBox.classList.add('hidden');
        }
        if ((e.key === '+' || e.key === '=') && !e.ctrlKey) applyZoom(zoomLevel + 0.15);
        if (e.key === '-' && !e.ctrlKey) applyZoom(zoomLevel - 0.15);
    });

    // ─── INIT ─────────────────────────────────────────────────────────────────
    panelContent.innerHTML = welcomeHTML();
    setTimeout(() => showToast('💡 Click any room on the map to explore!'), 900);

    // Add .chip style via JS (avoids adding CSS)
    const chipStyle = document.createElement('style');
    chipStyle.textContent = `.chip{display:inline-block;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;margin:2px;}`;
    document.head.appendChild(chipStyle);

})();
