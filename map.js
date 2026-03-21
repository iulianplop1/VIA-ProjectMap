/**
 * map.js — VIA Campus Map Renderer
 *
 * For Floor 1: loads the real floor plan image as an SVG <image> background,
 * then draws coloured interactive polygon overlays for each room.
 *
 * For Floors 2-8: draws a clean architectural SVG diagram.
 *
 * All rooms use shape:'poly' with {x,y} point arrays.
 * The SVG viewBox is set to match the floor plan image dimensions.
 */

(function () {
    'use strict';

    const svg     = document.getElementById('floorSvg');
    const tooltip = document.getElementById('mapTooltip');

    // Natural dimensions of the floor plan image (detected on load for F1)
    // For upper floors we use a simpler fixed viewBox
    const UPPER_VB = '0 0 650 400';

    // Status → fill colour (semi-transparent overlays)
    const STATUS_FILL = {
        available: 'rgba(34,197,94,.50)',
        occupied:  'rgba(239,68,68,.50)',
        facility:  'rgba(245,158,11,.48)',
        event:     'rgba(139,92,246,.52)',
    };
    const STATUS_STROKE = {
        available: '#16a34a',
        occupied:  '#dc2626',
        facility:  '#d97706',
        event:     '#7c3aed',
    };

    let pathElements = [];
    let currentFloor = 1;

    // ─── SVG HELPERS ──────────────────────────────────────────────────────────
    const NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs = {}) {
        const e = document.createElementNS(NS, tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    }
    function pts(points) {
        return points.map(p => `${p.x},${p.y}`).join(' ');
    }

    // ─── MAIN DRAW ENTRY ──────────────────────────────────────────────────────
    function drawFloor(floorNum) {
        currentFloor = floorNum;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        pathElements = [];

        const floorData = FLOOR_DATA[floorNum];
        if (!floorData) return;

        if (floorData.imgSrc) {
            drawImageFloor(floorData);
        } else {
            drawSchematicFloor(floorNum, floorData);
        }
    }

    // ─── FLOOR 1: real image + polygon overlays ────────────────────────────────
    function drawImageFloor(floorData) {
        const img = new Image();
        img.onload = () => {
            const W = img.naturalWidth;
            const H = img.naturalHeight;
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

            // White background
            svg.appendChild(el('rect', { x:0, y:0, width:W, height:H, fill:'#FAFAF8' }));

            // The actual floor plan image
            const imgEl = el('image', {
                href: floorData.imgSrc,
                x: 0, y: 0, width: W, height: H,
                preserveAspectRatio: 'xMidYMid meet',
            });
            svg.appendChild(imgEl);

            // Draw rooms on top
            floorData.rooms.forEach(room => drawRoom(room));
        };
        img.onerror = () => {
            // Image failed to load — fall back to schematic
            drawSchematicFloor(currentFloor, floorData);
        };
        img.src = floorData.imgSrc;
    }

    // ─── FLOORS 2-8: schematic diagram ────────────────────────────────────────
    function drawSchematicFloor(floorNum, floorData) {
        svg.setAttribute('viewBox', UPPER_VB);

        // Background
        svg.appendChild(el('rect', { x:0, y:0, width:650, height:400, fill:'#F4F6FB' }));

        // Grid lines (subtle)
        for (let x=0; x<650; x+=50) {
            const l = el('line', { x1:x, y1:0, x2:x, y2:400, stroke:'#DDE4F0', 'stroke-width':'0.5' });
            svg.appendChild(l);
        }
        for (let y=0; y<400; y+=50) {
            const l = el('line', { x1:0, y1:y, x2:650, y2:y, stroke:'#DDE4F0', 'stroke-width':'0.5' });
            svg.appendChild(l);
        }

        // Floor label watermark
        const wm = el('text', {
            x:325, y:230, 'text-anchor':'middle',
            fill:'rgba(0,87,183,.04)', 'font-size':'200', 'font-weight':'900',
            'font-family':'Inter,sans-serif', 'pointer-events':'none',
        });
        wm.textContent = floorNum;
        svg.appendChild(wm);

        // Draw rooms
        floorData.rooms.forEach(room => drawRoom(room));
    }

    // ─── DRAW ONE ROOM ────────────────────────────────────────────────────────
    function drawRoom(room) {
        const status = roomStatus(room.id, room.type);
        const fill   = STATUS_FILL[status]   || STATUS_FILL.facility;
        const stroke = STATUS_STROKE[status] || STATUS_STROKE.facility;

        const shape = el('polygon', {
            points: pts(room.points),
            fill, stroke, 'stroke-width': '1.5',
            rx: '2', cursor: 'pointer',
            style: 'transition: opacity .12s; opacity: 0.9;',
        });

        // Centroid for label
        const cx = room.points.reduce((a,p) => a+p.x, 0) / room.points.length;
        const cy = room.points.reduce((a,p) => a+p.y, 0) / room.points.length;

        // Size of room (bounding box diagonal) for font-size choice
        const xs  = room.points.map(p=>p.x);
        const ys  = room.points.map(p=>p.y);
        const bw  = Math.max(...xs) - Math.min(...xs);
        const bh  = Math.max(...ys) - Math.min(...ys);
        const big = Math.min(bw,bh) > 40;

        const lbl = el('text', {
            x: cx, y: cy + 3,
            'text-anchor':'middle',
            fill: 'rgba(0,0,0,.82)',
            'font-size': big ? '9' : '7',
            'font-weight': '700',
            'font-family': 'Inter,sans-serif',
            'pointer-events': 'none',
        });
        lbl.textContent = big ? shortName(room.name) : room.id;

        // Status dot
        const dotClr = status==='available'?'#16a34a':status==='occupied'?'#dc2626':status==='facility'?'#d97706':'#7c3aed';
        const dot = el('circle', {
            cx: cx, cy: cy - 6,
            r: big ? '4' : '0',
            fill: dotClr, 'pointer-events':'none',
        });

        // ── Hover ──
        shape.addEventListener('mouseenter', e => {
            shape.style.opacity = '0.7';
            shape.setAttribute('stroke-width','2.5');
            showTip(e, room, status);
        });
        shape.addEventListener('mousemove', e => moveTip(e));
        shape.addEventListener('mouseleave', () => {
            shape.style.opacity = '0.9';
            shape.setAttribute('stroke-width','1.5');
            hideTip();
        });

        // ── Click ──
        shape.addEventListener('click', () => window.openPanel(room, status));

        const g = el('g', { class: 'room-group' });
        g.appendChild(shape);
        g.appendChild(dot);
        g.appendChild(lbl);
        svg.appendChild(g);
        
        pathElements.push({ el: shape, groupEl: g, room, status });
    }

    // ─── TOOLTIP ──────────────────────────────────────────────────────────────
    function showTip(e, room, status) {
        const feats = room.features || [];
        const hasTV = feats.includes('tv');
        const cap   = feats.find(f=>f.startsWith('capacity-'));
        tooltip.innerHTML = `
            <div class="tooltip-name">${room.name}</div>
            ${room.info ? `<div style="color:var(--text-soft);font-size:11px;margin:2px 0 3px;">${room.info.slice(0,90)}${room.info.length>90?'…':''}</div>` : ''}
            ${hasTV ? '<div style="font-size:11px;">📺 TV Screen</div>' : ''}
            ${cap   ? `<div style="font-size:11px;">👥 ${cap.replace('capacity-','')} seats</div>` : ''}
            <span class="tooltip-tag ${status}">${statusTag(status, room.type)}</span>
        `;
        tooltip.style.left = (e.clientX + 16) + 'px';
        tooltip.style.top  = (e.clientY + 16) + 'px';
        tooltip.classList.remove('hidden');
    }
    function moveTip(e) {
        tooltip.style.left = (e.clientX + 16) + 'px';
        tooltip.style.top  = (e.clientY + 16) + 'px';
    }
    function hideTip() { tooltip.classList.add('hidden'); }

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    function shortName(name) {
        if (name.length <= 13) return name;
        const w = name.split(' ');
        if (w[0]==='Group')     return 'Rm '    + w[w.length-1];
        if (w[0]==='Classroom') return 'Cls '   + w[w.length-1];
        if (w[0]==='Auditorium')return 'Aud. '  + w[w.length-1];
        return name.slice(0,12)+'…';
    }
    function statusTag(status, type) {
        if (type==='facility') return '🏢 facility';
        if (type==='event')    return '🎪 event';
        return status==='available' ? '✓ free' : '✕ busy';
    }

    // ─── NAV PATH ─────────────────────────────────────────────────────────────
    function drawNavPath(fromId, toId) {
        svg.querySelectorAll('.nav-path').forEach(e=>e.remove());
        let fromRoom = null, toRoom = null;

        pathElements.forEach(({el:rEl, room}) => {
            rEl.style.filter = '';
            if (room.id === fromId) fromRoom = room;
            if (room.id === toId || room.name.toLowerCase().includes(toId.toLowerCase())) {
                toRoom = room;
                // Pulsing glow on destination
                rEl.style.filter = 'drop-shadow(0 0 8px cyan)';
                rEl.setAttribute('stroke-width','3');
                setTimeout(()=>{ rEl.style.filter=''; rEl.setAttribute('stroke-width','1.5'); }, 4000);
            }
        });

        if (fromRoom && toRoom) {
            const cx1 = fromRoom.points.reduce((a,p)=>a+p.x,0)/fromRoom.points.length;
            const cy1 = fromRoom.points.reduce((a,p)=>a+p.y,0)/fromRoom.points.length;
            const cx2 = toRoom.points.reduce((a,p)=>a+p.x,0)/toRoom.points.length;
            const cy2 = toRoom.points.reduce((a,p)=>a+p.y,0)/toRoom.points.length;
            const mx  = (cx1+cx2)/2, my = (cy1+cy2)/2 - Math.abs(cy2-cy1)*0.3;

            const path = el('path',{
                d:`M${cx1},${cy1} Q${mx},${my} ${cx2},${cy2}`,
                class:'nav-path',
                fill:'none', stroke:'#4F8EF7', 'stroke-width':'3',
                'stroke-dasharray':'10 6', 'stroke-linecap':'round',
            });
            svg.appendChild(path);
        }
    }

    // ─── QUICK HIGHLIGHT ──────────────────────────────────────────────────────
    function highlightByTarget(target) {
        pathElements.forEach(({el:rEl, room}) => {
            if ((room.quickTarget||[]).includes(target)) {
                rEl.style.filter = 'drop-shadow(0 0 10px gold)';
                rEl.setAttribute('stroke-width','3');
                setTimeout(()=>{ rEl.style.filter=''; rEl.setAttribute('stroke-width','1.5'); }, 2500);
            }
        });
    }

    // ─── PUBLIC API ───────────────────────────────────────────────────────────
    window.MapAPI = {
        load(floor)           { drawFloor(floor); },
        highlight(target)     { highlightByTarget(target); },
        navigate(fromId,toId) { drawNavPath(fromId, toId); },
        getPathElements()     { return pathElements; },
    };

    // Initial draw
    drawFloor(1);

})();
