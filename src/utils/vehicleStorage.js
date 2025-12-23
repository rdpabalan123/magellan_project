const STORAGE_KEY = 'crm_vehicles';

export function seedVehicles() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const vehicles = [
    // ================= RAM =================
    { stockNo:'162255', year:2026, make:'RAM', model:'2500 TRADE', body:'PICKUP', color:'WHITE', trim:'', engine:'8 6.4L V8', transmission:'A', miles:0, price:0, image:'https://cdn.jdpower.com/Models/640x480/2026-Ram-2500-Tradesman.jpg' },

    { stockNo:'649761', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'WHITE', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:65500, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
    { stockNo:'550876', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'WHITE', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:68500, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
    { stockNo:'555635', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'BILLETS', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:64900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
    { stockNo:'555130', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'BILLETS', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:64900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
    { stockNo:'565269', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'WHITE', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:68900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
    { stockNo:'554771', year:2025, make:'RAM', model:'1500 BIG H', body:'PICKUP', color:'SILVER', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:68900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },

    { stockNo:'654848', year:2025, make:'RAM', model:'1500 TRADE', body:'PICKUP', color:'WHITE', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:63900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
    { stockNo:'654896', year:2025, make:'RAM', model:'1500 TRADE', body:'NIGHT EDIT', color:'BRIGHT W', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:69900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
    { stockNo:'654849', year:2025, make:'RAM', model:'1500 TRADE', body:'PICKUP', color:'WHITE', trim:'', engine:'6 3.6L V6', transmission:'A', miles:0, price:63900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },

    { stockNo:'88033', year:2025, make:'RAM', model:'700', body:'PICKUP', color:'SILVER', trim:'LAR', engine:'3 1.0L', transmission:'A', miles:0, price:38900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-700.jpg' },
    { stockNo:'99878', year:2025, make:'RAM', model:'RAMPAGE', body:'TRUCK', color:'SILVER', trim:'', engine:'4 2.0', transmission:'A', miles:0, price:58900, image:'https://cdn.jdpower.com/Models/640x480/2025-Ram-Rampage.jpg' },

    // ================= JEEP =================
    { stockNo:'653057', year:2025, make:'JEEP', model:'RENEGADE', body:'SUV', color:'BRANCO P', trim:'', engine:'4 1.3L', transmission:'A', miles:0, price:42500, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
    { stockNo:'664387', year:2025, make:'JEEP', model:'RENEGADE', body:'SUV', color:'WHITE', trim:'', engine:'4 1.3', transmission:'A', miles:0, price:42900, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
    { stockNo:'664762', year:2025, make:'JEEP', model:'RENEGADE', body:'SUV', color:'GRANITE', trim:'', engine:'4 1.3', transmission:'A', miles:0, price:42900, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },

    { stockNo:'565448', year:2025, make:'JEEP', model:'WRANGLER', body:'SUV', color:'41 DRAB', trim:'SPO', engine:'4 2.0L L4', transmission:'A', miles:0, price:77500, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
    { stockNo:'565449', year:2025, make:'JEEP', model:'WRANGLER', body:'SUV', color:'MOJITO G', trim:'SPO', engine:'4 2.0L L4', transmission:'A', miles:0, price:75900, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
    { stockNo:'507882', year:2025, make:'JEEP', model:'WRANGLER', body:'SUV', color:'BRIGHT W', trim:'SPO', engine:'4 2.0L L4', transmission:'A', miles:0, price:75900, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
    { stockNo:'591753', year:2025, make:'JEEP', model:'WRANGLER S', body:'WAGON 4DO', color:'ORANGE', trim:'', engine:'4 2.0L L4', transmission:'A', miles:0, price:75900, image:'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },

    // ================= SUZUKI =================
    { stockNo:'252801', year:2026, make:'SUZUKI', model:'JIMNY', body:'SUV', color:'GREEN', trim:'', engine:'0', transmission:'A', miles:0, price:0, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },
    { stockNo:'271285', year:2025, make:'SUZUKI', model:'CARRY', body:'TRUCK', color:'WHITE', trim:'', engine:'0', transmission:'A', miles:0, price:0, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },
    { stockNo:'271282', year:2025, make:'SUZUKI', model:'CARRY', body:'TRUCK', color:'WHITE', trim:'', engine:'0', transmission:'A', miles:0, price:0, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },

    { stockNo:'492884', year:2025, make:'SUZUKI', model:'FRONX HYB', body:'SUV', color:'GRANDEUR', trim:'', engine:'0 1.5', transmission:'A', miles:0, price:33500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Fronx.jpg' },
    { stockNo:'104389', year:2025, make:'SUZUKI', model:'GRAND VITA', body:'SUV', color:'SPLENDID', trim:'', engine:'0 1.5', transmission:'A', miles:0, price:38900, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Grand-Vitara.jpg' },
    { stockNo:'187453', year:2025, make:'SUZUKI', model:'JIMNY', body:'SUV', color:'KINETIC', trim:'', engine:'0', transmission:'A', miles:0, price:39500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },

    { stockNo:'337175', year:2025, make:'SUZUKI', model:'SUPER CARRY', body:'PICK UPTR', color:'WHITE', trim:'', engine:'3 1.2L', transmission:'A', miles:0, price:27500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
    { stockNo:'316532', year:2025, make:'SUZUKI', model:'SUPER CARRY', body:'TRUCK', color:'WHITE', trim:'', engine:'0', transmission:'A', miles:0, price:27500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
    { stockNo:'337208', year:2025, make:'SUZUKI', model:'SUPERCARRY', body:'TRUCK', color:'WHITE', trim:'', engine:'3 1.2L', transmission:'A', miles:0, price:27500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
    { stockNo:'337355', year:2025, make:'SUZUKI', model:'SUPERCARRY', body:'TRUCK', color:'WHITE', trim:'', engine:'3 1.2L', transmission:'A', miles:0, price:27500, image:'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },

    // ================= TOYOTA =================
    { stockNo:'239516', year:2025, make:'TOYOTA', model:'HILUX', body:'DOUBLECAB', color:'WHITE', trim:'', engine:'0 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'240102', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK DOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'855986', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCKSING', color:'WHITE', trim:'', engine:'0 2.4', transmission:'A', miles:0, price:41900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'239960', year:2025, make:'TOYOTA', model:'HILUX', body:'DOUBLE CAB', color:'WHITE', trim:'', engine:'0', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'558431', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK DOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'855988', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK SING', color:'WHITE', trim:'', engine:'0 2.4', transmission:'A', miles:0, price:41900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'239799', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK DOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'558120', year:2025, make:'TOYOTA', model:'HILUX', body:'DOUBLECA', color:'WHITE', trim:'', engine:'0 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'557914', year:2025, make:'TOYOTA', model:'HILUX', body:'DOUBLE CAB', color:'WHITE', trim:'', engine:'0', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'238864', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK DOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'558262', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCKDOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
    { stockNo:'558428', year:2025, make:'TOYOTA', model:'HILUX', body:'TRUCK DOUB', color:'WHITE', trim:'', engine:'4 2.4', transmission:'A', miles:0, price:53900, image:'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

export function getVehicles() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
