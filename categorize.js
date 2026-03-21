const rooms = [
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:443,y:197}, {x:489,y:278}, {x:449,y:301}, {x:398,y:223}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:437,y:293}, {x:397,y:221}, {x:347,y:253}, {x:389,y:324}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:289,y:286}, {x:328,y:358}, {x:386,y:325}, {x:347,y:251}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:447,y:324}, {x:453,y:340}, {x:439,y:349}, {x:431,y:332}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:465,y:357}, {x:455,y:340}, {x:439,y:349}, {x:448,y:365}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:475,y:373}, {x:466,y:358}, {x:449,y:369}, {x:459,y:383}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:474,y:375}, {x:484,y:392}, {x:468,y:401}, {x:459,y:383}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:485,y:391}, {x:495,y:409}, {x:477,y:419}, {x:467,y:401}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:497,y:408}, {x:505,y:427}, {x:489,y:437}, {x:481,y:418}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:505,y:429}, {x:516,y:448}, {x:501,y:454}, {x:491,y:437}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:522,y:632}, {x:541,y:649}, {x:529,y:663}, {x:510,y:645}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:507,y:645}, {x:526,y:662}, {x:515,y:675}, {x:499,y:657}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:495,y:657}, {x:513,y:675}, {x:503,y:687}, {x:485,y:671}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:483,y:672}, {x:501,y:686}, {x:490,y:701}, {x:471,y:683}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:470,y:685}, {x:488,y:701}, {x:475,y:715}, {x:455,y:697}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:455,y:699}, {x:474,y:716}, {x:463,y:729}, {x:443,y:711}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:441,y:712}, {x:462,y:730}, {x:449,y:742}, {x:430,y:725}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:427,y:725}, {x:449,y:746}, {x:435,y:757}, {x:417,y:737}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:419,y:745}, {x:435,y:758}, {x:421,y:769}, {x:410,y:755}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:273,y:603}, {x:261,y:592}, {x:247,y:603}, {x:259,y:618}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:247,y:579}, {x:259,y:589}, {x:245,y:601}, {x:235,y:591}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:233,y:565}, {x:245,y:577}, {x:230,y:587}, {x:220,y:577}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:220,y:550}, {x:232,y:561}, {x:218,y:575}, {x:205,y:563}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:212,y:541}, {x:217,y:549}, {x:204,y:559}, {x:184,y:541}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:555,y:277}, {x:631,y:280}, {x:631,y:341}, {x:555,y:340}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:554,y:610}, {x:632,y:612}, {x:630,y:672}, {x:551,y:672}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:631,y:671}, {x:633,y:736}, {x:553,y:731}, {x:551,y:674}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:633,y:740}, {x:631,y:793}, {x:551,y:790}, {x:551,y:732}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:54,y:496}, {x:135,y:498}, {x:136,y:558}, {x:53,y:559}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:53,y:561}, {x:137,y:562}, {x:137,y:623}, {x:51,y:621}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:54,y:675}, {x:134,y:674}, {x:133,y:734}, {x:54,y:734}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:56,y:736}, {x:119,y:736}, {x:120,y:789}, {x:54,y:788}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:413,y:786}, {x:454,y:826}, {x:396,y:882}, {x:357,y:838}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:452,y:850}, {x:486,y:841}, {x:501,y:896}, {x:461,y:904}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:262,y:640}, {x:274,y:652}, {x:263,y:664}, {x:249,y:650}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:248,y:651}, {x:261,y:664}, {x:243,y:682}, {x:231,y:669}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:229,y:670}, {x:242,y:684}, {x:226,y:698}, {x:213,y:685}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:205,y:697}, {x:218,y:708}, {x:207,y:720}, {x:191,y:707}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:174,y:726}, {x:186,y:740}, {x:175,y:748}, {x:161,y:736}] },
    { id:'GR.A101', name:'Group Room A1', type:'group', hub:'A',
      shape:'poly', points:[{x:161,y:738}, {x:173,y:750}, {x:159,y:764}, {x:148,y:750}] }
];

function getPolygonArea(pts) {
    let area = 0;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        area += (pts[j].x + pts[i].x) * (pts[j].y - pts[i].y);
    }
    return Math.abs(area / 2.0);
}

const classified = rooms.map(room => {
    const area = getPolygonArea(room.points);
    return { ...room, area };
});

// Sort by area to find a threshold
classified.sort((a,b) => a.area - b.area);

let groupIdx = 1;
let classIdx = 1;

const finalRooms = classified.map(r => {
    // Threshold from earlier calculations (around 3000 distinguishes small vs large well based on samples)
    if (r.area > 2000) {
        return {
            ...r,
            type: 'classroom',
            id: `C1${String(classIdx).padStart(2, '0')}`,
            name: `Classroom C1${String(classIdx).padStart(2, '0')}`,
            info: `26-seat classroom (${Math.round(r.area)}px).`,
            features: ['projector','whiteboard','capacity-26']
        };
    } else {
         return {
            ...r,
            type: 'group',
            id: `GR.${String(groupIdx).padStart(3, '0')}`,
            name: `Group Room ${String(groupIdx).padStart(3, '0')}`,
            info: `4-person group room (${Math.round(r.area)}px).`,
            features: ['tv','whiteboard','capacity-4']
        };
    }
});

// Resequence counters properly
groupIdx = 1;
classIdx = 1;

let output = '[\n';
for (const r of finalRooms) {
    if (r.type === 'classroom') {
         r.id = `C1${String(classIdx).padStart(2, '0')}`;
         r.name = `Classroom 1${String(classIdx).padStart(2, '0')}`;
         classIdx++;
    } else {
         r.id = `GR.${String(groupIdx).padStart(3, '0')}`;
         r.name = `Group Room ${groupIdx}`;
         groupIdx++;
    }
    const ptStr = r.points.map(p => `{x:${p.x},y:${p.y}}`).join(',');
    output += `    { id:'${r.id}', name:'${r.name}', type:'${r.type}', hub:'${r.hub}', shape:'poly', points:[${ptStr}], info:'${r.info}', features: ${JSON.stringify(r.features)} },\n`;
}
output += ']';

const fs = require('fs');
fs.writeFileSync('output.js', output);
console.log('Complete. Output written to output.js. Classrooms:', classIdx - 1, 'Group rooms:', groupIdx - 1);
