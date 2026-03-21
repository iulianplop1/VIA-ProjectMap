/**
 * data.js — VIA Campus Map Data
 *
 * Floor 1 uses REAL polygon coordinates traced from the actual floor plan image.
 * All rooms use shape:'poly' with {x,y} point arrays matching the image coordinate space.
 * Floors 2-8 use simplified grid-based room definitions.
 */

// ─── STATUS ENGINE ───────────────────────────────────────────────────────────
function pseudoRandom(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    const x = Math.sin(h + (Date.now() / 3600000 | 0)) * 10000;
    return x - Math.floor(x);
}
function roomStatus(id, type) {
    if (type === 'facility') return 'facility';
    if (type === 'event')    return 'event';
    return pseudoRandom(id) > 0.45 ? 'available' : 'occupied';
}

// ─── FLOOR 1 — REAL POLYGONS traced from floor plan image ───────────────────
// Image: first floor.png
// Coordinate space: natural image pixel dimensions (826×945 approx)

const FLOOR1_ROOMS = [

    // ── Key Facilities (traced by user) ───────────────
    { id:'CANTEEN.1', name:'Kantine', type:'facility', hub:'A', shape:'poly',
      points:[{x:245,y:737}, {x:287,y:777}, {x:146,y:922}, {x:143,y:865}, {x:115,y:865}, {x:119,y:809}, {x:164,y:803}, {x:207,y:770}],
      info:'Daily hot meals, salads, soups, sandwiches. Open 08:00–15:30.',
      features:['food','seating-120','wifi'], special:'canteen' },

    { id:'AUD.A1', name:'Auditorium A1', type:'event', hub:'A', shape:'poly',
      points:[{x:510,y:682}, {x:596,y:683}, {x:598,y:832}, {x:509,y:829}],
      info:'Main auditorium — stage, HD projector, sound system.',
      features:['projector','mic','seating-220','stage'], reservable:true },

    { id:'AUD.A2', name:'Auditorium A2', type:'event', hub:'A', shape:'poly',
      points:[{x:524,y:833}, {x:597,y:835}, {x:597,y:924}, {x:539,y:937}, {x:521,y:882}],
      info:'Secondary auditorium — dual screens, recording setup.',
      features:['projector','recording','seating-140'], reservable:true },

    { id:'MAKER.1', name:'MakerSpace', type:'facility', hub:'A', shape:'poly',
      points:[{x:463,y:681}, {x:495,y:711}, {x:493,y:728}, {x:449,y:777}, {x:441,y:783}, {x:420,y:761}, {x:413,y:728}],
      info:'3D printing, laser cutting, electronics workbenches. Open 09:00–20:00.',
      features:['3d-printer','laser-cutter','workbench','wifi'], special:'makerspace' },

    { id:'DRAMA.1', name:'Dramatorium', type:'event', hub:'A', shape:'poly',
      points:[{x:405,y:843}, {x:450,y:889}, {x:463,y:953}, {x:398,y:965}, {x:342,y:910}],
      info:'Creative performance and workshop space.',
      features:['stage','lighting'], reservable:true },

    { id:'RECEPTION.1', name:'Reception', type:'facility', hub:'A', shape:'poly',
      points:[{x:329,y:566}, {x:366,y:567}, {x:367,y:603}, {x:327,y:600}],
      info:'Main reception, information desk, lockers. WiFi hotspot.',
      features:['reception','wifi','lockers'], quickTarget:['entrance'] }
];

// ─── FLOOR 2 — REAL POLYGONS traced from floor plan image ───────────────────
const FLOOR2_ROOMS = [
    { id:'PW.201', name:'Picture Workshop 1', type:'classroom', hub:'A', shape:'poly', points:[{x:396,y:820}, {x:440,y:865}, {x:458,y:945}, {x:603,y:913}, {x:602,y:859}, {x:512,y:860}, {x:511,y:840}, {x:437,y:863}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'GR.201', name:'Group Room 201', type:'group', hub:'A', shape:'poly', points:[{x:480,y:791}, {x:499,y:807}, {x:484,y:821}, {x:466,y:804}], info:'Small 4-person group room.', features:['tv','whiteboard'] },
    { id:'PW.202', name:'Picture Workshop 2', type:'classroom', hub:'A', shape:'poly', points:[{x:464,y:804}, {x:485,y:821}, {x:471,y:835}, {x:452,y:815}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'LIB.A', name:'Library Main', type:'facility', hub:'A', shape:'poly', points:[{x:195,y:704}, {x:124,y:780}, {x:124,y:848}, {x:30,y:849}, {x:30,y:913}, {x:119,y:912}, {x:209,y:821}, {x:175,y:789}, {x:224,y:739}], info:'Main library study area.', special:'library', features:['wifi','silent','computers'] },
    { id:'LIB.B', name:'Library Extension', type:'facility', hub:'A', shape:'poly', points:[{x:313,y:721}, {x:367,y:773}, {x:330,y:804}, {x:278,y:755}], info:'Library books and quiet study zone.', special:'library', features:['wifi','silent'] },
    { id:'GR.202', name:'Group Room 202', type:'group', hub:'A', shape:'poly', points:[{x:191,y:777}, {x:204,y:791}, {x:192,y:803}, {x:176,y:788}], info:'Small 4-person group room.', features:['tv','whiteboard'] },
    { id:'PW.203', name:'Picture Workshop 3', type:'classroom', hub:'A', shape:'poly', points:[{x:208,y:794}, {x:225,y:807}, {x:208,y:822}, {x:193,y:803}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'PW.204', name:'Picture Workshop 4', type:'classroom', hub:'A', shape:'poly', points:[{x:226,y:741}, {x:259,y:770}, {x:226,y:803}, {x:191,y:775}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'GR.203', name:'Group Room 203', type:'group', hub:'A', shape:'poly', points:[{x:144,y:596}, {x:165,y:604}, {x:160,y:620}, {x:137,y:612}], info:'Small 4-person group room.', features:['tv','whiteboard'] },
    { id:'PW.205', name:'Picture Workshop 5', type:'classroom', hub:'A', shape:'poly', points:[{x:137,y:614}, {x:162,y:621}, {x:152,y:638}, {x:131,y:628}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'CAFE.2', name:'Cafe Shop', type:'facility', hub:'A', shape:'poly', points:[{x:359,y:412}, {x:374,y:430}, {x:346,y:457}, {x:328,y:434}], info:'Coffee, pastries, and sandwiches.', special:'cafe', features:['coffee','wifi','seating-40'] },
    { id:'GR.204', name:'Group Room 204', type:'group', hub:'A', shape:'poly', points:[{x:420,y:369}, {x:428,y:387}, {x:411,y:396}, {x:402,y:378}], info:'Small 4-person group room.', features:['tv','whiteboard'] },
    { id:'PW.206', name:'Picture Workshop 6', type:'classroom', hub:'A', shape:'poly', points:[{x:432,y:390}, {x:441,y:404}, {x:424,y:415}, {x:414,y:397}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'PW.207', name:'Picture Workshop 7', type:'classroom', hub:'A', shape:'poly', points:[{x:450,y:426}, {x:469,y:458}, {x:454,y:465}, {x:434,y:431}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'PW.208', name:'Picture Workshop 8', type:'classroom', hub:'A', shape:'poly', points:[{x:472,y:463}, {x:478,y:476}, {x:462,y:485}, {x:456,y:467}], info:'Creative picture workshop.', features:['whiteboard','flexible-layout'] },
    { id:'PW.209', name:'Picture Workshop 9', type:'classroom', hub:'A', shape:'poly', points:[{x:504,y:318}, {x:575,y:278}, {x:603,y:318}, {x:528,y:360}], info:'Large picture workshop.', features:['whiteboard','projector','capacity-30'] }
];

// ─── UPPER FLOORS (3-8) — simplified polygon rooms ───────────────────────────
function makeUpperFloor(f) {
    const rooms = [];
    const cols  = [60,155,250,345,440,535];
    const rows  = [60,140,220,300];
    const classNames = ['A','B','C','D','E','F'];

    // 6 classrooms, 2 rows × 3 cols
    for (let r=0;r<2;r++) for (let c=0;c<3;c++) {
        const x=cols[c], y=rows[r], w=85, h=70;
        rooms.push({ id:`C${f}0${r*3+c+1}`, name:`Classroom ${f}0${r*3+c+1}`,
            type:'classroom', hub:'A', shape:'poly',
            points:[{x},{y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],
            info:`Classroom — ${24+c*2} seats, projector.`,
            features:['projector','whiteboard',`capacity-${24+c*2}`] });
    }
    // 6 group rooms
    for (let i=0;i<6;i++) {
        const x=cols[3+(i%3)], y=rows[Math.floor(i/3)], w=80, h=70;
        rooms.push({ id:`GR.${f}${classNames[i]}`, name:`Group Room ${classNames[i]}`,
            type:i%3===2?'facility':'group', hub:'A', shape:'poly',
            points:[{x},{y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],
            info:`${i<2?'6':'4'}-person group room.`,
            features:['whiteboard',...(i<3?['tv']:[])] });
    }
    // Facilities
    for (const [id,name,qt,x,y] of [
        [`WC.${f}`,'Restrooms','bathroom',60,300],
        [`COFFEE.${f}`,'Coffee','coffee',145,300],
        [`TRASH.${f}`,'Recycling','trash',230,300],
        [`EXIT.${f}`,'Exit','exit',315,300],
    ]) {
        rooms.push({ id, name, type:'facility', hub:'A', shape:'poly',
            points:[{x},{y},{x:x+75,y},{x:x+75,y:y+60},{x,y:y+60}],
            quickTarget:[qt] });
    }

    const sfx=['st','nd','rd','th','th','th','th','th'][f-1];
    return { label:`${f}${sfx} Floor`, rooms };
}

// Data for upper image-based map clones (3F, 4F, 5F)
const UPPER_IMAGE_ROOMS = [
    { id:'GR.001', name:'Group Room 1', type:'group', hub:'A', shape:'poly', points:[{x:247,y:579},{x:259,y:589},{x:245,y:601},{x:235,y:591}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.002', name:'Group Room 2', type:'group', hub:'A', shape:'poly', points:[{x:174,y:726},{x:186,y:740},{x:175,y:748},{x:161,y:736}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.003', name:'Group Room 3', type:'group', hub:'A', shape:'poly', points:[{x:233,y:565},{x:245,y:577},{x:230,y:587},{x:220,y:577}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.004', name:'Group Room 4', type:'group', hub:'A', shape:'poly', points:[{x:419,y:745},{x:435,y:758},{x:421,y:769},{x:410,y:755}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.005', name:'Group Room 5', type:'group', hub:'A', shape:'poly', points:[{x:262,y:640},{x:274,y:652},{x:263,y:664},{x:249,y:650}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.006', name:'Group Room 6', type:'group', hub:'A', shape:'poly', points:[{x:447,y:324},{x:453,y:340},{x:439,y:349},{x:431,y:332}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.007', name:'Group Room 7', type:'group', hub:'A', shape:'poly', points:[{x:205,y:697},{x:218,y:708},{x:207,y:720},{x:191,y:707}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.008', name:'Group Room 8', type:'group', hub:'A', shape:'poly', points:[{x:161,y:738},{x:173,y:750},{x:159,y:764},{x:148,y:750}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.009', name:'Group Room 9', type:'group', hub:'A', shape:'poly', points:[{x:212,y:541},{x:217,y:549},{x:204,y:559},{x:184,y:541}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.010', name:'Group Room 10', type:'group', hub:'A', shape:'poly', points:[{x:505,y:429},{x:516,y:448},{x:501,y:454},{x:491,y:437}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.011', name:'Group Room 11', type:'group', hub:'A', shape:'poly', points:[{x:220,y:550},{x:232,y:561},{x:218,y:575},{x:205,y:563}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.012', name:'Group Room 12', type:'group', hub:'A', shape:'poly', points:[{x:273,y:603},{x:261,y:592},{x:247,y:603},{x:259,y:618}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.013', name:'Group Room 13', type:'group', hub:'A', shape:'poly', points:[{x:475,y:373},{x:466,y:358},{x:449,y:369},{x:459,y:383}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.014', name:'Group Room 14', type:'group', hub:'A', shape:'poly', points:[{x:474,y:375},{x:484,y:392},{x:468,y:401},{x:459,y:383}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.015', name:'Group Room 15', type:'group', hub:'A', shape:'poly', points:[{x:465,y:357},{x:455,y:340},{x:439,y:349},{x:448,y:365}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.016', name:'Group Room 16', type:'group', hub:'A', shape:'poly', points:[{x:497,y:408},{x:505,y:427},{x:489,y:437},{x:481,y:418}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.017', name:'Group Room 17', type:'group', hub:'A', shape:'poly', points:[{x:507,y:645},{x:526,y:662},{x:515,y:675},{x:499,y:657}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.018', name:'Group Room 18', type:'group', hub:'A', shape:'poly', points:[{x:495,y:657},{x:513,y:675},{x:503,y:687},{x:485,y:671}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.019', name:'Group Room 19', type:'group', hub:'A', shape:'poly', points:[{x:229,y:670},{x:242,y:684},{x:226,y:698},{x:213,y:685}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.020', name:'Group Room 20', type:'group', hub:'A', shape:'poly', points:[{x:485,y:391},{x:495,y:409},{x:477,y:419},{x:467,y:401}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.021', name:'Group Room 21', type:'group', hub:'A', shape:'poly', points:[{x:483,y:672},{x:501,y:686},{x:490,y:701},{x:471,y:683}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.022', name:'Group Room 22', type:'group', hub:'A', shape:'poly', points:[{x:455,y:699},{x:474,y:716},{x:463,y:729},{x:443,y:711}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.023', name:'Group Room 23', type:'group', hub:'A', shape:'poly', points:[{x:248,y:651},{x:261,y:664},{x:243,y:682},{x:231,y:669}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.024', name:'Group Room 24', type:'group', hub:'A', shape:'poly', points:[{x:441,y:712},{x:462,y:730},{x:449,y:742},{x:430,y:725}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.025', name:'Group Room 25', type:'group', hub:'A', shape:'poly', points:[{x:522,y:632},{x:541,y:649},{x:529,y:663},{x:510,y:645}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.026', name:'Group Room 26', type:'group', hub:'A', shape:'poly', points:[{x:427,y:725},{x:449,y:746},{x:435,y:757},{x:417,y:737}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'GR.027', name:'Group Room 27', type:'group', hub:'A', shape:'poly', points:[{x:470,y:685},{x:488,y:701},{x:475,y:715},{x:455,y:697}], info:'4-person group room.', features: ["tv","whiteboard","capacity-4"] },
    { id:'C101', name:'Classroom 101', type:'classroom', hub:'A', shape:'poly', points:[{x:452,y:850},{x:486,y:841},{x:501,y:896},{x:461,y:904}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C102', name:'Classroom 102', type:'classroom', hub:'A', shape:'poly', points:[{x:56,y:736},{x:119,y:736},{x:120,y:789},{x:54,y:788}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C103', name:'Classroom 103', type:'classroom', hub:'A', shape:'poly', points:[{x:633,y:740},{x:631,y:793},{x:551,y:790},{x:551,y:732}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C104', name:'Classroom 104', type:'classroom', hub:'A', shape:'poly', points:[{x:413,y:786},{x:454,y:826},{x:396,y:882},{x:357,y:838}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C105', name:'Classroom 105', type:'classroom', hub:'A', shape:'poly', points:[{x:443,y:197},{x:489,y:278},{x:449,y:301},{x:398,y:223}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C106', name:'Classroom 106', type:'classroom', hub:'A', shape:'poly', points:[{x:555,y:277},{x:631,y:280},{x:631,y:341},{x:555,y:340}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C107', name:'Classroom 107', type:'classroom', hub:'A', shape:'poly', points:[{x:54,y:675},{x:134,y:674},{x:133,y:734},{x:54,y:734}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C108', name:'Classroom 108', type:'classroom', hub:'A', shape:'poly', points:[{x:554,y:610},{x:632,y:612},{x:630,y:672},{x:551,y:672}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C109', name:'Classroom 109', type:'classroom', hub:'A', shape:'poly', points:[{x:437,y:293},{x:397,y:221},{x:347,y:253},{x:389,y:324}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C110', name:'Classroom 110', type:'classroom', hub:'A', shape:'poly', points:[{x:631,y:671},{x:633,y:736},{x:553,y:731},{x:551,y:674}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C111', name:'Classroom 111', type:'classroom', hub:'A', shape:'poly', points:[{x:54,y:496},{x:135,y:498},{x:136,y:558},{x:53,y:559}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C112', name:'Classroom 112', type:'classroom', hub:'A', shape:'poly', points:[{x:53,y:561},{x:137,y:562},{x:137,y:623},{x:51,y:621}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
    { id:'C113', name:'Classroom 113', type:'classroom', hub:'A', shape:'poly', points:[{x:289,y:286},{x:328,y:358},{x:386,y:325},{x:347,y:251}], info:'26-seat classroom.', features: ["projector","whiteboard","capacity-26"] },
];

function cloneImageFloor(f) {
    const sfx=['st','nd','rd','th','th','th','th','th'][f-1];
    
    const newRooms = UPPER_IMAGE_ROOMS.map(r => {
        const points = r.points.map(p => ({...p}));
        let newId = r.id;
        let newName = r.name;
        
        if (r.type === 'classroom') {
            newId = newId.replace('C1', 'C' + f);
            newName = newName.replace('Classroom 1', 'Classroom ' + f);
        } else if (r.type === 'group') {
            newId = newId.replace('GR.0', 'GR.' + f + '0');
            newName = newName.replace('Group Room ', 'Group Room ' + f + '-');
        }
        
        let info = r.info || '';
        if (r.type === 'group') {
            info = info.replace('4-person', (f % 2 === 0 ? '6' : '4') + '-person');
        } else if (r.type === 'classroom') {
            info = info.replace('26-seat', (26 + f * 2) + '-seat');
        }
        
        return { ...r, id: newId, name: newName, info: info, points: points };
    });

    return { 
        label: `${f}${sfx} Floor`, 
        // Use the original Gemini generated image for these upper cloned floors
        imgSrc: 'Gemini_Generated_Image_lwvgptlwvgptlwvg.png', 
        rooms: newRooms 
    };
}

// ─── MASTER FLOOR MAP ─────────────────────────────────────────────────────────
const FLOOR_DATA = {
    1: { label:'1st Floor', imgSrc:'first floor.png', rooms: FLOOR1_ROOMS },
    2: { label:'2nd Floor', imgSrc:'second floor.png', rooms: FLOOR2_ROOMS },
    3: cloneImageFloor(3),
    4: cloneImageFloor(4),
    5: cloneImageFloor(5),
};

// ─── CANTEEN MENU ─────────────────────────────────────────────────────────────
const CANTEEN_MENU = {
    'Hot Meals': [
        {name:'Pasta Bolognese + Garlic Bread', price:'55 kr'},
        {name:'Chicken Curry + Rice',           price:'55 kr'},
        {name:'Beef Burger + Fries',            price:'65 kr'},
        {name:'Fish & Chips',                   price:'60 kr'},
        {name:'Veggie Lasagne',                 price:'50 kr'},
        {name:'Meatballs + Mashed Potato',      price:'55 kr'},
    ],
    'Soups': [
        {name:'Tomato Soup + Bread',            price:'35 kr'},
        {name:'Chicken Noodle Soup',            price:'35 kr'},
        {name:'Lentil Soup + Bread',            price:'30 kr'},
    ],
    'Sandwiches & Wraps': [
        {name:'Chicken Caesar Wrap',            price:'45 kr'},
        {name:'Tuna Melt Sandwich',             price:'40 kr'},
        {name:'BLT Sandwich',                   price:'40 kr'},
        {name:'Falafel Wrap',                   price:'40 kr'},
    ],
    'Salads': [
        {name:'Caesar Salad',                   price:'40 kr'},
        {name:'Greek Salad',                    price:'40 kr'},
        {name:'Pasta Salad',                    price:'35 kr'},
    ],
};

const CAFE_MENU = {
    'Coffee & Drinks': [
        {name:'Espresso',               price:'22 kr'},
        {name:'Flat White',             price:'35 kr'},
        {name:'Cappuccino',             price:'32 kr'},
        {name:'Cold Brew',              price:'38 kr'},
        {name:'Matcha Latte',           price:'42 kr'},
        {name:'Hot Chocolate',          price:'28 kr'},
    ],
    'Food': [
        {name:'Avocado Toast',          price:'55 kr'},
        {name:'Croissant',              price:'24 kr'},
        {name:'Smørrebrød — Salmon',    price:'65 kr'},
        {name:'Granola Bowl',           price:'45 kr'},
        {name:'Club Sandwich',          price:'60 kr'},
    ],
};

const PRINTERS = [
    {id:'P1', name:'Prusa MK4 #1',   status:'free', remaining:0,  material:'PLA Black',  progress:100},
    {id:'P2', name:'Prusa MK4 #2',   status:'busy', remaining:34, material:'PLA White',  progress:62},
    {id:'P3', name:'Bambu X1C #1',   status:'busy', remaining:18, material:'PETG Blue',  progress:78},
    {id:'P4', name:'Bambu X1C #2',   status:'free', remaining:0,  material:'--',         progress:100},
    {id:'P5', name:'Form3 Resin #1', status:'busy', remaining:67, material:'Grey Resin', progress:28},
    {id:'P6', name:'Form3 Resin #2', status:'free', remaining:0,  material:'--',         progress:100},
];
