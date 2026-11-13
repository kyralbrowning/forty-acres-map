/* Forty Acres Housing Map app. Place data is NOT in this file: it loads from Supabase after sign-in. */

const APTS = (window.__APTS||[]);
const CHECKED = "Oct 23 – Nov 12, 2026";

/* ---------- Projection (1 world px = 4 m at zoom 1) ---------- */
const LAT0=30.405, LNG0=-97.865, KY=27750, KX=KY*Math.cos(30.28*Math.PI/180);
const P=(lng,lat)=>[(lng-LNG0)*KX,(LAT0-lat)*KY];
const WORLD_W=(-97.615-LNG0)*KX, WORLD_H=(LAT0-30.165)*KY;
const MILE_PX = 1609.34/4;

/* ---------- Reference points on campus ---------- */
const REFS=[
 {id:"edge",name:"Closest edge of campus",lng:-97.73935,lat:30.28612},
 {id:"tower",name:"UT Tower (Main Building)",lng:-97.73935,lat:30.28612},
 {id:"pcl",name:"PCL Library",lng:-97.7381,lat:30.2827},
 {id:"mccombs",name:"McCombs (GSB)",lng:-97.7378,lat:30.2842},
 {id:"gdc",name:"Gates Dell Complex (GDC)",lng:-97.7366,lat:30.2862},
 {id:"uta",name:"UTA Building (iSchool)",lng:-97.7426,lat:30.2795},
 {id:"moody",name:"Moody College (CMA)",lng:-97.7406,lat:30.2891},
 {id:"jester",name:"Jester / Speedway",lng:-97.7365,lat:30.2827},
 {id:"gregory",name:"Gregory Gym",lng:-97.7367,lat:30.2843}
];

/* ---------- Map geometry ([lng,lat]) ---------- */
const G={
 lake:[[-97.8450,30.3560],[-97.8350,30.3470],[-97.8250,30.3360],[-97.8150,30.3250],[-97.8050,30.3160],[-97.7990,30.3110],[-97.7930,30.3060],[-97.7880,30.3000],[-97.7850,30.2950],[-97.7835,30.2905],[-97.7800,30.2860],[-97.7770,30.2810],[-97.7745,30.2765],[-97.7715,30.2730],[-97.7680,30.2705],[-97.7630,30.2685],[-97.7580,30.2670],[-97.7535,30.2660],[-97.7490,30.2643],[-97.7450,30.2618],[-97.7410,30.2590],[-97.7385,30.2555],[-97.7370,30.2515],[-97.7330,30.2485],[-97.7270,30.2470],[-97.7210,30.2465],[-97.7160,30.2490]],
 river:[[-97.7160,30.2490],[-97.7100,30.2510],[-97.7020,30.2505],[-97.6940,30.2480],[-97.6850,30.2455],[-97.6750,30.2440],[-97.6550,30.2420],[-97.6300,30.2390],[-97.6100,30.2380]],
 creeks:[
  [[-97.7520,30.2668],[-97.7525,30.2720],[-97.7530,30.2780],[-97.7522,30.2830],[-97.7535,30.2880],[-97.7545,30.2950],[-97.7530,30.3020],[-97.7500,30.3100],[-97.7470,30.3200],[-97.7440,30.3300]],
  [[-97.7385,30.2570],[-97.7380,30.2650],[-97.7375,30.2720],[-97.7360,30.2790],[-97.7345,30.2850],[-97.7330,30.2900],[-97.7300,30.2960],[-97.7270,30.3050],[-97.7240,30.3150]],
  [[-97.7710,30.2645],[-97.7745,30.2640],[-97.7800,30.2620],[-97.7860,30.2600],[-97.7930,30.2560],[-97.8000,30.2530],[-97.8100,30.2500]],
  [[-97.7220,30.2470],[-97.7190,30.2420],[-97.7150,30.2380],[-97.7100,30.2340],[-97.7040,30.2290]]
 ],
 parks:[
  {n:"Zilker Park",p:[[-97.7790,30.2700],[-97.7680,30.2695],[-97.7645,30.2655],[-97.7700,30.2618],[-97.7770,30.2625],[-97.7805,30.2660]],l:[-97.7735,30.2668]},
  {n:"Pease Park",p:[[-97.7565,30.2785],[-97.7518,30.2785],[-97.7512,30.2880],[-97.7535,30.2905],[-97.7562,30.2892]],l:null},
  {n:"",p:[[-97.7535,30.2645],[-97.7470,30.2625],[-97.7462,30.2608],[-97.7535,30.2628]],l:null},
  {n:"Waterloo Park",p:[[-97.7378,30.2742],[-97.7352,30.2742],[-97.7352,30.2792],[-97.7378,30.2792]],l:null},
  {n:"Mueller Lake Park",p:[[-97.7065,30.2982],[-97.7005,30.2982],[-97.7005,30.3018],[-97.7065,30.3018]],l:[-97.7035,30.2965]},
  {n:"Camp Mabry",p:[[-97.7705,30.3075],[-97.7600,30.3075],[-97.7600,30.3205],[-97.7705,30.3205]],l:[-97.7652,30.3140]},
  {n:"",p:[[-97.7292,30.2638],[-97.7248,30.2638],[-97.7248,30.2682],[-97.7292,30.2682]],l:null},
  {n:"Guerrero Park",p:[[-97.7145,30.2472],[-97.7050,30.2475],[-97.7030,30.2420],[-97.7120,30.2418]],l:[-97.7095,30.2445]},
  {n:"Lions Golf Course",p:[[-97.7825,30.2895],[-97.7725,30.2898],[-97.7705,30.2962],[-97.7805,30.2982]],l:[-97.7765,30.2935]},
  {n:"",p:[[-97.7300,30.2928],[-97.7272,30.2928],[-97.7272,30.2948],[-97.7300,30.2948]],l:null},
  {n:"Barton Creek Greenbelt",p:[[-97.7850,30.2620],[-97.7980,30.2570],[-97.8120,30.2520],[-97.8150,30.2480],[-97.8000,30.2520],[-97.7850,30.2580]],l:[-97.8020,30.2560]},
  {n:"Walnut Creek Park",p:[[-97.6950,30.4000],[-97.6800,30.4000],[-97.6800,30.4100],[-97.6950,30.4100]],l:null},
  {n:"Mabry",p:[[-97.7600,30.3075],[-97.7590,30.3075],[-97.7590,30.3080],[-97.7600,30.3080]],l:null},
  {n:"Shoal Creek Greenbelt",p:[[-97.7545,30.2905],[-97.7525,30.2905],[-97.7520,30.3000],[-97.7505,30.3080],[-97.7525,30.3085],[-97.7548,30.2990]],l:null}
 ],
 extraParks:0,
 campus:[[-97.7420,30.2896],[-97.7420,30.2812],[-97.7398,30.2810],[-97.7392,30.2772],[-97.7345,30.2740],[-97.7318,30.2752],[-97.7300,30.2800],[-97.7284,30.2838],[-97.7270,30.2868],[-97.7298,30.2878],[-97.7340,30.2893],[-97.7380,30.2896]],
 buildings:[
  ["Main Building (Tower)",-97.7394,30.2861,2,1.3],["Texas Union",-97.7411,30.2866,1.2,1],["Student Activity Center (SAC)",-97.7360,30.2849,1.3,1],
  ["PCL Library",-97.7381,30.2827,1.4,1.3],["Gregory Gym",-97.7367,30.2843,1.2,1],["McCombs (GSB/CBA)",-97.7378,30.2842,1.2,1],
  ["Rowling Hall",-97.7404,30.2802,1.2,1],["Gates Dell Complex (GDC)",-97.7366,30.2862,1.3,1],["Welch Hall",-97.7376,30.2868,1.4,.9],
  ["RLM (Physics/Math)",-97.7365,30.2890,1,1],["EER (Engineering)",-97.7354,30.2880,1.2,1],["Moody College (CMA/BMC)",-97.7404,30.2894,1.3,1],
  ["Kinsolving",-97.7395,30.2903,1,1],["Jester Center",-97.7368,30.2826,1.4,1],["DKR Stadium",-97.7325,30.2837,2.6,3.4],
  ["Moody Center",-97.7323,30.2807,2,1.8],["LBJ Library",-97.7292,30.2858,1.5,1.2],["Blanton Museum",-97.7375,30.2805,1.4,1],
  ["Gregory Plaza / Rec Center",-97.7329,30.2817,1.2,1],["UTA Building (iSchool)",-97.7426,30.2795,.9,.9],["Dell Medical School",-97.7335,30.2765,1.5,1.2],
  ["Bass Concert Hall",-97.7310,30.2860,1.4,1.2],["Law School (Jamail)",-97.7305,30.2885,1.4,1.1],["Littlefield Fountain",-97.7398,30.2838,.6,.6],
  ["Burdine Hall",-97.7383,30.2888,1,.8],["Norman Hackerman (NHB)",-97.7380,30.2875,1,.8],["Union Coffee / West Mall",-97.7405,30.2855,.8,.6]
 ],
 capitol:[[-97.7420,30.2728],[-97.7385,30.2728],[-97.7385,30.2772],[-97.7420,30.2772]],
 hwy:[
  [[-97.7880,30.1600],[-97.7780,30.1800],[-97.7680,30.1950],[-97.7600,30.2050],[-97.7560,30.2150],[-97.7500,30.2260],[-97.7440,30.2350],[-97.7395,30.2430],[-97.7370,30.2500],[-97.7365,30.2580],[-97.7365,30.2660],[-97.7350,30.2720],[-97.7300,30.2790],[-97.7270,30.2850],[-97.7240,30.2920],[-97.7210,30.3000],[-97.7170,30.3080],[-97.7130,30.3160],[-97.7085,30.3250],[-97.7040,30.3350],[-97.6990,30.3450],[-97.6930,30.3600],[-97.6850,30.3800],[-97.6780,30.4000],[-97.6720,30.4100]],
  [[-97.8400,30.1650],[-97.8250,30.1850],[-97.8120,30.1980],[-97.8050,30.2050],[-97.7980,30.2200],[-97.7880,30.2350],[-97.7800,30.2480],[-97.7740,30.2600],[-97.7705,30.2700],[-97.7690,30.2800],[-97.7650,30.2900],[-97.7610,30.3000],[-97.7570,30.3100],[-97.7545,30.3200],[-97.7520,30.3320],[-97.7500,30.3450],[-97.7470,30.3600],[-97.7400,30.3800],[-97.7320,30.3980],[-97.7260,30.4100]],
  [[-97.8650,30.2380],[-97.8400,30.2370],[-97.8150,30.2340],[-97.7950,30.2290],[-97.7800,30.2230],[-97.7650,30.2185],[-97.7500,30.2170],[-97.7350,30.2165],[-97.7200,30.2180],[-97.7050,30.2200],[-97.6900,30.2210],[-97.6550,30.2215],[-97.6300,30.2180],[-97.6100,30.2150]],
  [[-97.7085,30.3250],[-97.6950,30.3270],[-97.6800,30.3290],[-97.6550,30.3300],[-97.6300,30.3320]],
  [[-97.7010,30.3420],[-97.7120,30.3460],[-97.7250,30.3520],[-97.7380,30.3600],[-97.7500,30.3690],[-97.7620,30.3820],[-97.7720,30.3960],[-97.7800,30.4100]]
 ],
 major:[
  [[-97.7800,30.2050],[-97.7760,30.2200],[-97.7720,30.2380],[-97.7640,30.2520],[-97.7580,30.2600],[-97.7540,30.2660],[-97.7535,30.2720],[-97.7545,30.2780],[-97.7530,30.2850],[-97.7510,30.2920],[-97.7490,30.2990],[-97.7460,30.3060],[-97.7420,30.3130],[-97.7370,30.3200],[-97.7310,30.3280],[-97.7250,30.3360],[-97.7200,30.3450]],
  [[-97.7465,30.2640],[-97.7450,30.2700],[-97.7430,30.2760],[-97.7420,30.2810],[-97.7418,30.2900],[-97.7412,30.2960],[-97.7395,30.3030],[-97.7375,30.3100],[-97.7345,30.3180],[-97.7310,30.3260]],
  [[-97.7650,30.2050],[-97.7600,30.2200],[-97.7580,30.2250],[-97.7530,30.2400],[-97.7490,30.2530],[-97.7455,30.2610],[-97.7430,30.2680],[-97.7404,30.2745]],
  [[-97.7720,30.2100],[-97.7650,30.2300],[-97.7590,30.2450],[-97.7530,30.2580],[-97.7495,30.2640]],
  [[-97.7440,30.3180],[-97.7425,30.3280],[-97.7410,30.3450]],
  [[-97.6990,30.2600],[-97.7000,30.2660],[-97.7030,30.2760],[-97.7060,30.2860],[-97.7080,30.2960],[-97.7120,30.3060],[-97.7180,30.3150],[-97.7210,30.3240],[-97.7230,30.3330],[-97.7245,30.3450]],
  [[-97.7680,30.2722],[-97.7600,30.2692],[-97.7530,30.2672],[-97.7460,30.2645],[-97.7400,30.2625],[-97.7330,30.2590],[-97.7250,30.2560],[-97.7150,30.2540],[-97.7000,30.2530],[-97.6800,30.2520]],
  [[-97.7560,30.2620],[-97.7500,30.2600],[-97.7450,30.2580],[-97.7390,30.2500],[-97.7340,30.2440],[-97.7270,30.2410],[-97.7200,30.2390],[-97.7120,30.2350],[-97.7040,30.2300],[-97.6950,30.2260],[-97.6850,30.2225],[-97.6750,30.2200]],
  [[-97.7800,30.2445],[-97.7650,30.2420],[-97.7550,30.2400],[-97.7450,30.2380],[-97.7350,30.2350],[-97.7250,30.2330],[-97.7150,30.2310],[-97.7050,30.2290]],
  [[-97.7730,30.2640],[-97.7650,30.2635],[-97.7560,30.2620]],
  [[-97.7700,30.2815],[-97.7620,30.2800],[-97.7545,30.2785],[-97.7450,30.2780],[-97.7380,30.2775],[-97.7330,30.2765]],
  [[-97.7545,30.2832],[-97.7470,30.2818],[-97.7420,30.2815],[-97.7370,30.2810],[-97.7300,30.2800],[-97.7200,30.2795],[-97.7100,30.2790],[-97.7000,30.2785],[-97.6850,30.2780]],
  [[-97.7530,30.2900],[-97.7420,30.2900],[-97.7360,30.2898],[-97.7300,30.2895],[-97.7240,30.2890],[-97.7150,30.2870],[-97.7060,30.2860],[-97.6900,30.2860]],
  [[-97.7600,30.3038],[-97.7470,30.3050],[-97.7390,30.3045],[-97.7300,30.3040],[-97.7205,30.3030]],
  [[-97.7600,30.3182],[-97.7450,30.3175],[-97.7350,30.3170],[-97.7250,30.3165],[-97.7140,30.3160],[-97.7060,30.3155]],
  [[-97.7330,30.3245],[-97.7200,30.3240],[-97.7080,30.3230],[-97.6950,30.3200]],
  [[-97.7650,30.2742],[-97.7535,30.2712],[-97.7450,30.2690],[-97.7360,30.2668],[-97.7250,30.2640],[-97.7100,30.2610]],
  [[-97.7545,30.2760],[-97.7440,30.2742],[-97.7360,30.2725],[-97.7250,30.2710],[-97.7120,30.2700]],
  [[-97.7680,30.3020],[-97.7560,30.3030],[-97.7480,30.3032]],
  [[-97.7650,30.2770],[-97.7652,30.2950],[-97.7640,30.3060]],
  [[-97.7215,30.2200],[-97.7200,30.2400],[-97.7190,30.2520],[-97.7180,30.2650]],
  [[-97.7365,30.2830],[-97.7365,30.2900],[-97.7355,30.3000],[-97.7345,30.3100],[-97.7335,30.3190]],
  [[-97.7320,30.2905],[-97.7300,30.3000],[-97.7280,30.3100],[-97.7260,30.3200],[-97.7245,30.3300]],
  [[-97.7360,30.2640],[-97.7350,30.2720],[-97.7322,30.2800],[-97.7300,30.2862]],
  [[-97.7200,30.3450],[-97.7130,30.3600],[-97.7050,30.3800],[-97.6960,30.4000],[-97.6900,30.4100]],
  [[-97.7410,30.3450],[-97.7330,30.3650],[-97.7250,30.3850],[-97.7200,30.4000],[-97.7170,30.4100]],
  [[-97.7650,30.3590],[-97.7450,30.3575],[-97.7300,30.3560],[-97.7150,30.3545],[-97.7000,30.3530]],
  [[-97.7450,30.3290],[-97.7250,30.3270],[-97.7080,30.3250]],
  [[-97.7450,30.3290],[-97.7600,30.3380],[-97.7800,30.3500],[-97.7950,30.3600]],
  [[-97.7800,30.2050],[-97.7900,30.1900],[-97.8000,30.1750]],
  [[-97.7650,30.2050],[-97.7700,30.1900],[-97.7760,30.1700]],
  [[-97.7720,30.2100],[-97.7800,30.1900],[-97.7860,30.1700]],
  [[-97.8300,30.1960],[-97.8000,30.1920],[-97.7700,30.1890],[-97.7500,30.1880],[-97.7300,30.1860]],
  [[-97.8100,30.2080],[-97.7900,30.2060],[-97.7700,30.2040],[-97.7450,30.2010],[-97.7250,30.1990]],
  [[-97.6750,30.2200],[-97.6600,30.2150],[-97.6400,30.2080]],
  [[-97.7215,30.2200],[-97.7240,30.2050],[-97.7270,30.1900]],
  [[-97.7020,30.2420],[-97.6980,30.2300],[-97.6940,30.2180],[-97.6900,30.2050]],
  [[-97.6900,30.2860],[-97.6750,30.2900],[-97.6550,30.2950]],
  [[-97.6950,30.3200],[-97.6750,30.3150],[-97.6550,30.3100]],
  [[-97.7700,30.2800],[-97.7850,30.2900],[-97.7950,30.2980],[-97.8100,30.3080]],
  [[-97.7650,30.2742],[-97.7850,30.2700],[-97.8050,30.2650],[-97.8250,30.2620]],
  [[-97.7700,30.3550],[-97.7850,30.3600],[-97.8000,30.3680]],
  [[-97.6990,30.2600],[-97.6950,30.2450]],
  [[-97.6850,30.2780],[-97.6650,30.2760],[-97.6450,30.2740]],
  [[-97.7150,30.2540],[-97.6900,30.2560],[-97.6700,30.2580]],
  [[-97.7000,30.3530],[-97.6800,30.3510],[-97.6650,30.3490]],
  [[-97.6900,30.3000],[-97.6700,30.3020],[-97.6500,30.3040]],
  [[-97.8000,30.2250],[-97.7950,30.2400],[-97.7900,30.2550],[-97.7850,30.2620]],
 ]
};
/* procedural street grids: [lngMin,lngMax,latMin,latMax,stepLng,stepLat,angleDeg] */
const GRIDS=[
 [-97.7525,-97.7420,30.2812,30.2938,0,0,0,"wc"],
 [-97.7525,-97.7370,30.2628,30.2792,0.0016,0.0011,0],
 [-97.7400,-97.7225,30.2945,30.3210,0.0022,0.0024,0],
 [-97.7340,-97.7040,30.2555,30.2785,0.0024,0.0013,0],
 [-97.7520,-97.7360,30.2340,30.2580,0.0019,0.0015,-12],
 [-97.7710,-97.7540,30.2390,30.2600,0.0020,0.0015,-8],
 [-97.7690,-97.7560,30.2700,30.2865,0.0018,0.0014,0],
 [-97.7520,-97.7340,30.3080,30.3340,0.0021,0.0022,0],
 [-97.7270,-97.6980,30.2190,30.2400,0.0030,0.0022,28],
 [-97.7180,-97.6940,30.2880,30.3120,0.0028,0.0026,0],
 [-97.7900,-97.7720,30.2930,30.3150,0.0024,0.0022,-6],
 [-97.7900,-97.7760,30.2400,30.2600,0.0024,0.0020,0],
 [-97.7330,-97.7120,30.3000,30.3150,0.0025,0.0024,0],
 [-97.7330,-97.7180,30.2380,30.2540,0.0022,0.0018,20],
 [-97.7420,-97.7150,30.3350,30.3700,0.0026,0.0024,0],
 [-97.7580,-97.7360,30.3300,30.3560,0.0024,0.0022,-8],
 [-97.7380,-97.7050,30.3720,30.4060,0.0030,0.0028,-15],
 [-97.7720,-97.7500,30.3420,30.3700,0.0026,0.0024,-10],
 [-97.7900,-97.7650,30.2150,30.2450,0.0026,0.0022,-10],
 [-97.7620,-97.7400,30.2000,30.2340,0.0024,0.0022,-10],
 [-97.7380,-97.7100,30.1950,30.2300,0.0028,0.0024,15],
 [-97.7020,-97.6720,30.2980,30.3260,0.0028,0.0026,0],
 [-97.7200,-97.6900,30.2480,30.2620,0.0026,0.0018,0],
 [-97.7000,-97.6780,30.2180,30.2420,0.0026,0.0022,30],
 [-97.8150,-97.7900,30.2180,30.2420,0.0028,0.0024,-12],
 [-97.8200,-97.7950,30.2650,30.2950,0.0028,0.0026,-20],
 [-97.6880,-97.6500,30.2650,30.2950,0.0030,0.0026,0],
 [-97.6950,-97.6600,30.3300,30.3600,0.0032,0.0028,0],
 [-97.7000,-97.6700,30.3650,30.3950,0.0032,0.0028,-20],
 [-97.7350,-97.7150,30.3150,30.3330,0.0024,0.0022,0]
];
const WC_NS=[-97.7432,-97.7445,-97.7457,-97.7469,-97.7482,-97.7497,-97.7508,-97.7520];
const WC_EW=[30.2826,30.2838,30.2849,30.2861,30.2873,30.2886,30.2910,30.2922,30.2934];

const LABELS=[
 {t:"West Campus",c:"hood",at:[-97.7488,30.2943],z:1.1},{t:"North Campus",c:"hood",at:[-97.7320,30.2985],z:1.0},
 {t:"Hyde Park",c:"hood",at:[-97.7300,30.3110],z:.6},{t:"Downtown",c:"hood",at:[-97.7470,30.2705],z:.6},
 {t:"East Austin",c:"hood",at:[-97.7200,30.2660],z:.6},{t:"Travis Heights",c:"hood",at:[-97.7440,30.2470],z:.6},
 {t:"Zilker",c:"hood",at:[-97.7720,30.2560],z:.6},{t:"Clarksville",c:"hood",at:[-97.7640,30.2830],z:.8},
 {t:"East Riverside",c:"hood",at:[-97.7140,30.2300],z:.5},{t:"Mueller",c:"hood",at:[-97.7020,30.3060],z:.5},
 {t:"North Loop",c:"hood",at:[-97.7300,30.3280],z:.5},{t:"Rosedale",c:"hood",at:[-97.7480,30.3240],z:.6},
 {t:"Bouldin",c:"hood",at:[-97.7630,30.2500],z:.8},{t:"Tarrytown",c:"hood",at:[-97.7790,30.3050],z:.6},
 {t:"Crestview",c:"hood",at:[-97.7290,30.3420],z:.35},{t:"Allandale",c:"hood",at:[-97.7470,30.3430],z:.35},
 {t:"The Domain",c:"hood",at:[-97.7230,30.4010],z:.25},{t:"Brentwood",c:"hood",at:[-97.7330,30.3330],z:.45},
 {t:"St. Edward's",c:"hood",at:[-97.7550,30.2290],z:.35},{t:"South Lamar",c:"hood",at:[-97.7800,30.2400],z:.35},
 {t:"South Congress",c:"hood",at:[-97.7560,30.2150],z:.3},{t:"Windsor Park",c:"hood",at:[-97.6850,30.3120],z:.35},
 {t:"Montopolis",c:"hood",at:[-97.6880,30.2330],z:.35},{t:"Northwest Hills",c:"hood",at:[-97.7700,30.3620],z:.3},
 {t:"Barton Hills",c:"hood",at:[-97.7980,30.2460],z:.35},{t:"Highland",c:"hood",at:[-97.7100,30.3400],z:.35},
 {t:"Govalle",c:"hood",at:[-97.6950,30.2680],z:.4},{t:"West Lake Hills",c:"hood",at:[-97.8200,30.2850],z:.3},
 {t:"US 183",c:"shield",at:[-97.7500,30.3700],z:.3},{t:"I-35",c:"shield",at:[-97.6870,30.3750],z:.3},{t:"MoPac",c:"shield",at:[-97.8060,30.2200],z:.3},
 {t:"Burnet Rd",c:"road",at:[-97.7290,30.3750],z:.7,r:-66},{t:"N Lamar Blvd",c:"road",at:[-97.7090,30.3700],z:.7,r:-66},
 {t:"Anderson Ln",c:"road",at:[-97.7520,30.3584],z:.8},{t:"S Lamar Blvd",c:"road",at:[-97.7700,30.2350],z:.7,r:-62},
 {t:"Lady Bird Lake",c:"water",at:[-97.7620,30.2662],z:.6,r:-14},{t:"Lake Austin",c:"water",at:[-97.7990,30.3080],z:.5,r:-40},
 {t:"Colorado River",c:"water",at:[-97.6900,30.2448],z:.6,r:6},
 {t:"Zilker Park",c:"park",at:[-97.7765,30.2662],z:.8},{t:"Pease Park",c:"park",at:[-97.7590,30.2850],z:1.4},
 {t:"Camp Mabry",c:"park",at:[-97.7680,30.3140],z:.8},{t:"Mueller Lake Park",c:"park",at:[-97.7075,30.2965],z:1.2},
 {t:"Texas Capitol",c:"lm",at:[-97.7445,30.2752],z:.8},{t:"DKR Stadium",c:"lm",at:[-97.7330,30.2837],z:1.8},
 
 {t:"I-35",c:"shield",at:[-97.7270,30.2860],z:.5},{t:"I-35",c:"shield",at:[-97.7385,30.2420],z:.5},{t:"I-35",c:"shield",at:[-97.7150,30.3120],z:.8},
 {t:"MoPac",c:"shield",at:[-97.7660,30.2885],z:.5},{t:"US 290",c:"shield",at:[-97.7550,30.2172],z:.5},
 {t:"Lamar Blvd",c:"road",at:[-97.7493,30.3000],z:1.6,r:-68},{t:"Guadalupe St",c:"road",at:[-97.7407,30.3005],z:1.7,r:-78},
 {t:"MLK Jr Blvd",c:"road",at:[-97.7220,30.2799],z:1.3},{t:"Dean Keaton St",c:"road",at:[-97.7290,30.2894],z:2.2},
 {t:"Riverside Dr",c:"road",at:[-97.7250,30.2395],z:1.1,r:16},{t:"Cesar Chavez St",c:"road",at:[-97.7300,30.2575],z:1.6,r:14},
 {t:"45th St",c:"road",at:[-97.7290,30.3168],z:1.2},{t:"38th St",c:"road",at:[-97.7330,30.3043],z:1.5},
 {t:"Airport Blvd",c:"road",at:[-97.7120,30.3070],z:1.1,r:-62},{t:"S Congress Ave",c:"road",at:[-97.7505,30.2460],z:1.1,r:-72},
 {t:"Oltorf St",c:"road",at:[-97.7600,30.2412],z:1.2,r:4},{t:"Manor Rd",c:"road",at:[-97.7120,30.2867],z:1.4,r:4},
 {t:"Speedway",c:"road",at:[-97.7350,30.3060],z:2.2,r:-85},{t:"24th St",c:"road",at:[-97.7520,30.2873],z:3},
 {t:"Rio Grande St",c:"road",at:[-97.7459,30.2905],z:3.2,r:-90},{t:"San Antonio St",c:"road",at:[-97.7434,30.2830],z:3.2,r:-90}
];

G.buildings.forEach(([n,lng,lat])=>{if(!/Tower|DKR/.test(n))LABELS.push({t:n,c:"bldl",at:[lng,lat+0.00042],z:3.6})});
LABELS.push({t:"UT Austin campus",c:"campus",at:[-97.7330,30.2878],z:.35,r:0});
/* ---------- Helpers ---------- */
function stars(r){if(r==null)return "";const full=Math.round(r*2)/2;let s="";for(let i=1;i<=5;i++){s+=i<=full?"★":(i-.5===full?"⯪":"☆")}return s}
function ratingHtml(a,big){if(a.rating==null)return big?'<span class="rt-none">No rating found yet</span>':"";const c=a.ratingCount?` (${Number(a.ratingCount).toLocaleString("en-US")})`:"";
  return `<span class="rating${big?" big":""}"><b>${Number(a.rating).toFixed(1)}</b><span class="st" aria-hidden="true">${stars(+a.rating)}</span><span class="rc">${c}${big&&a.ratingSource?" · "+esc(a.ratingSource):""}</span></span>`}
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const money=n=>n==null?null:"$"+Math.round(n).toLocaleString("en-US");
function hav(a,b){const R=3958.8,t=x=>x*Math.PI/180;const dLa=t(b.lat-a.lat),dLo=t(b.lng-a.lng);const h=Math.sin(dLa/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const HOOD_COLORS={"West Campus":["#bf5700","#e8893c"],"North Campus":["#2f6fd6","#5fa0ff"],"Hyde Park":["#2c8a6b","#54c09a"],"Riverside":["#7a4cc2","#a77de6"],"Downtown":["#3c4b64","#6f84a8"],"North Loop":["#a2456b","#d7709a"],"Far West":["#6b7a2c","#9db04c"],"East Austin":["#b2483a","#e07a6b"],"South Austin":["#c2410c","#f08a4b"],"North Austin":["#0f766e","#2bb5a6"],"Mueller":["#4d7c0f","#84b832"],"Clarksville":["#8a5a2b","#c08a52"],"UT Campus":["#bf5700","#d9822b"],"Other":["#5f6670","#8c949e"]};
const hc=h=>HOOD_COLORS[h]||HOOD_COLORS.Other;
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}

/* ---------- Data prep ---------- */
APTS.forEach(a=>{a.perApt=/per (apartment|unit)|whole[- ]apartment|whole[- ]unit|not per person|per-apartment|per-unit/i.test(a.priceNote||"")&&!/per[- ](person|bed)\b(?!.*not)/i.test((a.priceNote||"").split(/[.;]/)[0]);a.id=slug(a.name);a.plans=(a.plans||[]).map(p=>String(p).toLowerCase())});
/* Floor plans with a bath for every bedroom (studio, 1x1, 2x2, 4x4…) mean at least some units give you your own bathroom. */
APTS.forEach(a=>{if(a.privateBath==null&&a.plans.some(p=>{if(p==="studio")return true;const m=/^(\d)x(\d(?:\.\d)?)$/.exec(p);return m&&parseFloat(m[2])>=+m[1]}))a.privateBath="some"});
/* Price per person for your OWN bedroom (Kyra, Nov 12): the filter, sort and labels use this, not the cheapest shared room. */
const OWN_MIN={"The Standard at Austin":1307,"Sterling House (The Quarters)":1398,"Villas on Rio":1509,"Eastside Station":1629,"Taos Co-op":1080,"21st Street Co-op":1080,"Pearl Street Co-op":1080,"Halstead Co-op":1190};
APTS.forEach(a=>{a.own=null;if(a.priceMin==null)return;if(OWN_MIN[a.name]!=null){a.own=OWN_MIN[a.name];return}if(/\(ICC\)/.test(a.name)){a.own=1075;return}if(a.kind==="house"){const m=/\((\d+)BR/.exec(a.name);a.beds=m?+m[1]:null;a.own=a.beds?Math.round(a.priceMin/a.beds):null;return}a.own=a.priceMin});
const SHARED_MIN={"Villas on Rio":959,"The Block":889};APTS.forEach(a=>{a.shared=SHARED_MIN[a.name]??((OWN_MIN[a.name]!=null||/\(ICC\)/.test(a.name))&&a.priceMin<a.own?a.priceMin:null);if(a.name in SHARED_MIN&&a.name==="The Block")a.own=null});
function PR(a){const r=S.room||"own";if(r==="shared")return a.shared;if(r==="any")return a.shared!=null&&(a.own==null||a.shared<a.own)?a.shared:a.own;return a.own}
function ownTxt(a){const p=PR(a);if(p==null)return"Price not listed";return"From "+money(p)+"/mo"+(p===a.shared?" (shared room)":a.kind==="house"?" each":a.perApt?" (whole apt)":"")}
const PLAN_CHIPS=[["studio","Studio"],["1x1","1x1"],["2x2","2x2"],["3x3","3x3"],["4x4","4x4"],["5x5","5x5+"],["shared","Shared-bath plans"]];
const isShared=p=>{const m=/^(\d)x(\d(?:\.\d)?)$/.exec(p);return m&&parseFloat(m[2])<+m[1]};
const AMEN=[
 ["pool","Pool",a=>a.pool],["rooftop","Rooftop pool",a=>a.rooftopPool],
 ["bath","Private bathroom",a=>a.privateBath===true||a.privateBath==="some"?true:a.privateBath],
 ["win","Window in every bedroom",a=>a.windowsEveryBedroom],
 ["furn","Furnished",a=>a.furnished==null?null:a.furnished!==false],
 ["pets","Pet friendly",a=>a.petFriendly],["match","Roommate matching",a=>a.roommateMatching],
 ["wd","In-unit washer/dryer",a=>a.inUnitLaundry],
 ["util","All bills paid",a=>a.utilitiesIncluded==null?null:/all utilities|all bills/i.test(a.utilitiesIncluded)],
 ["school","School-year lease",a=>a.leaseTerm==null?null:/9-month|academic|school|semester/i.test(a.leaseTerm)],
 ["park","Parking $100 or less",a=>a.parkingPerMonth==null?null:a.parkingPerMonth<=100]
];
const HOODS=[...new Set(APTS.map(a=>a.neighborhood||"Other"))].sort((a,b)=>APTS.filter(x=>x.neighborhood===b).length-APTS.filter(x=>x.neighborhood===a).length);

const TAGS={
 pool:["Pool","Pools & wellness"],rooftop_pool:["Rooftop pool","Pools & wellness"],hot_tub:["Hot tub","Pools & wellness"],sauna:["Sauna","Pools & wellness"],steam_room:["Steam room","Pools & wellness"],cold_plunge:["Cold plunge","Pools & wellness"],tanning:["Tanning","Pools & wellness"],spa_room:["Spa room","Pools & wellness"],massage_chairs:["Massage chairs","Pools & wellness"],
 gym:["Gym","Fitness"],yoga_studio:["Yoga studio","Fitness"],spin_studio:["Spin studio","Fitness"],fitness_classes:["Fitness classes","Fitness"],basketball_court:["Basketball court","Fitness"],volleyball_court:["Volleyball court","Fitness"],pickleball_court:["Pickleball court","Fitness"],rock_wall:["Climbing wall","Fitness"],
 grills:["Grills","Outdoor & social"],outdoor_kitchen:["Outdoor kitchen","Outdoor & social"],courtyard:["Courtyard / patio","Outdoor & social"],sundeck:["Sundeck","Outdoor & social"],rooftop_deck:["Rooftop deck","Outdoor & social"],sky_lounge:["Sky lounge","Outdoor & social"],fire_pit:["Fire pit","Outdoor & social"],hammocks:["Hammocks","Outdoor & social"],outdoor_tv:["Outdoor TV","Outdoor & social"],
 game_room:["Game room","Games & hangout"],pool_table:["Pool table","Games & hangout"],ping_pong:["Ping pong","Games & hangout"],arcade:["Arcade","Games & hangout"],golf_simulator:["Golf simulator","Games & hangout"],theater:["Theater room","Games & hangout"],gaming_lounge:["Gaming lounge","Games & hangout"],karaoke:["Karaoke","Games & hangout"],resident_events:["Resident events","Games & hangout"],
 study_rooms:["Study rooms","Study"],computer_lab:["Computer lab","Study"],printing:["Printing","Study"],conference_room:["Conference room","Study"],coffee_bar:["Coffee bar","Study"],free_coffee:["Free coffee","Study"],
 pet_friendly:["Pet friendly","Pets"],dog_park:["Dog park","Pets"],pet_spa:["Pet spa / wash","Pets"],
 garage_parking:["Garage parking","Building"],ev_charging:["EV charging","Building"],bike_storage:["Bike storage","Building"],package_lockers:["Package lockers","Building"],controlled_access:["Controlled access","Building"],elevator:["Elevator","Building"],on_shuttle_route:["On UT shuttle / bus route","Building"],retail_onsite:["Shops / food on site","Building"],"24hr_staff":["24-hour staff","Building"],valet_trash:["Valet trash","Building"],
 in_unit_laundry:["Washer/dryer in unit","In your apartment"],furnished:["Furnished","In your apartment"],smart_tv:["Smart TV","In your apartment"],private_bathrooms:["Private bathrooms","In your apartment"],windows_every_bedroom:["Window in every bedroom","In your apartment"],walk_in_closets:["Walk-in closets","In your apartment"],granite_or_quartz:["Granite / quartz counters","In your apartment"],stainless_appliances:["Stainless appliances","In your apartment"],hardwood_style_floors:["Wood-style floors","In your apartment"],high_ceilings:["High ceilings","In your apartment"],floor_to_ceiling_windows:["Floor-to-ceiling windows","In your apartment"],roommate_matching:["Roommate matching","In your apartment"],internet_included:["Internet included","In your apartment"],utilities_included:["Utilities included","In your apartment"]
};
const GROUP_ORDER=["Pools & wellness","Fitness","Outdoor & social","Games & hangout","Study","Pets","Building","In your apartment"];
const BALC={personal:"Personal balcony (off your bedroom)",apartment:"Apartment balcony (shared with roommates)","some units":"Balconies in some units","community only":"No unit balconies, shared terraces only",none:"No balconies"};
APTS.forEach(a=>{const s=new Set((a.tags||[]).filter(k=>TAGS[k]));const add=(c,k)=>{if(c)s.add(k)};
 add(a.pool,"pool");add(a.rooftopPool,"rooftop_pool");add(a.gym,"gym");add(a.studyRooms,"study_rooms");add(a.petFriendly,"pet_friendly");add(a.inUnitLaundry,"in_unit_laundry");
 add(a.furnished===true,"furnished");add(a.roommateMatching,"roommate_matching");add(a.windowsEveryBedroom===true,"windows_every_bedroom");add(a.privateBath===true,"private_bathrooms");
 a.tagSet=s;a.researched=Array.isArray(a.tags);
 if(!a.balconyType){a.balconyType=a.balcony==="private"?"apartment":a.balcony==="shared"?"apartment":a.balcony==="some units"?"some units":a.balcony==="none"?"none":null}
 if(a.balconyType==="personal"||a.balconyType==="apartment"||a.balconyType==="some units"){a.balcony=a.balcony||"some units"}
 a.special=(a.special||[]).filter(x=>typeof x==="string"&&x.length<120).slice(0,10)});
const AMEN_FILTERS=["gym","hot_tub","sauna","yoga_studio","grills","courtyard","sundeck","rooftop_deck","sky_lounge","fire_pit","game_room","pool_table","golf_simulator","theater","coffee_bar","study_rooms","dog_park","pet_spa","garage_parking","ev_charging","package_lockers","walk_in_closets","on_shuttle_route"];
const BALC_FILTERS=[["every","Balcony in every unit"],["some","Balcony in some units"],["any","Any balcony (private or shared)"]];
/* ---------- Recommendations ("For you") ---------- */
const plansOf=a=>new Set(a.plans.map(p=>p==="studio"?"1x1":p.replace(/\..*$/,"")));
function jac(A,B){if(!A.size&&!B.size)return null;let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i||1)}
const hasBalc=a=>["personal","apartment","some units"].includes(a.balconyType);
function balcKind(a){const bt=a.balconyType;if(bt==="personal"||bt==="apartment")return"every";if(bt==="some units")return"some";if(bt==="community only"||a.tagSet.has("rooftop_deck")||a.tagSet.has("sky_lounge"))return"shared";return null}
const BALC_LABEL={every:"Balcony: every unit",some:"Balcony: some units",shared:"Balcony: shared"};
function sim(a,b){
  let s=0,w=0;const add=(v,wt)=>{if(v==null)return;s+=v*wt;w+=wt};
  if(a.priceMin!=null&&b.priceMin!=null&&!!a.perApt===!!b.perApt&&(a.kind||"apartment")===(b.kind||"apartment"))add(1-Math.min(Math.abs(a.priceMin-b.priceMin)/Math.max(a.priceMin,b.priceMin)*2.5,1),.26);
  add(1-Math.min(Math.abs(dist(a).walk-dist(b).walk)/15,1),.2);
  add(jac(a.tagSet,b.tagSet),.2);
  add(jac(plansOf(a),plansOf(b)),.1);
  add((a.kind||"apartment")===(b.kind||"apartment")?1:0,.1);
  add(a.neighborhood===b.neighborhood?1:0,.08);
  if(hasBalc(b))add(hasBalc(a)?1:0,.06);
  return w?s/w:0;
}
function whyLike(c,b){const r=[];const both=k=>c.tagSet.has(k)&&b.tagSet.has(k);
  if(both("pool"))r.push(both("rooftop_pool")?"rooftop pool":"pool");
  if(c.privateBath===true&&b.privateBath===true)r.push("own bathroom");
  if(hasBalc(c)&&hasBalc(b))r.push("balcony");
  if(both("windows_every_bedroom"))r.push("windows in every bedroom");
  const pl=[...plansOf(c)].filter(p=>plansOf(b).has(p)&&/^[3-9]x/.test(p));if(pl.length)r.push(pl.sort().reverse()[0]);
  if(c.priceMin!=null&&b.priceMin!=null&&!!c.perApt===!!b.perApt&&Math.abs(c.priceMin-b.priceMin)<=150)r.push("similar price");
  if(Math.abs(dist(c).walk-dist(b).walk)<=4)r.push("similar walk");
  for(const k of ["gym","hot_tub","sauna","sundeck","rooftop_deck","game_room","furnished","pet_friendly","roommate_matching"])if(both(k)&&r.length<5)r.push(TAGS[k][0].toLowerCase());
  return r.slice(0,4)}
let PREFS=(()=>{const p=store("fahm.prefs");return p&&typeof p==="object"?p:null})();let prefsRef=null,prefsEdit=false;
let PMETA={welcomed:false,views:{}};
function prPref(a,room){const r=room||"own";if(r==="shared")return a.shared;if(r==="any")return a.shared!=null&&(a.own==null||a.shared<a.own)?a.shared:a.own;return a.own}
/* checks: each one says whether a place fits one preference */
function prefChecks(a,p){const c=[],d=dist(a);
  if(p.max){const pr=prPref(a,p.room);c.push(pr!=null&&pr<=p.max)}
  if(p.walk)c.push(d.walk<=p.walk);
  if(p.drive)c.push(d.drive<=p.drive);
  for(const k of p.must||[]){const f=AMEN.find(x=>x[0]===k);if(f)c.push(f[2](a)===true);else if(k==="balc")c.push(!!balcKind(a))}
  if((p.hoods||[]).length)c.push(p.hoods.includes(a.neighborhood));
  if((p.kinds||[]).length)c.push(p.kinds.includes(a.kind||"apartment"));
  if((p.plans||[]).length)c.push(p.plans.some(x=>x==="shared"?a.plans.some(isShared):x==="5x5"?a.plans.some(y=>/^[5-9]x/.test(y)):a.plans.includes(x)));
  if((p.balc||[]).length){const k=balcKind(a);c.push(p.balc.some(b=>b==="any"?k!=null:b===k))}
  if(p.minRating)c.push(a.rating!=null&&a.rating>=p.minRating);
  if(p.room==="shared")c.push(a.shared!=null);
  return c}
function prefFit(a){if(!PREFS)return 1;const c=prefChecks(a,PREFS);return c.length?c.filter(Boolean).length/c.length:1}
function prefOK(a){const p=PREFS;if(!p||!p.strict)return true;return prefChecks(a,p).every(Boolean)}
/* trends: what this person keeps saving and opening (doesn't change their preferences) */
function trends(){const w=new Map();for(const id of hearts)w.set(id,(w.get(id)||0)+3);
  for(const [id,n] of Object.entries(PMETA.views||{}))w.set(id,(w.get(id)||0)+Math.min(n,3));
  const items=[...w].map(([id,k])=>[APTS.find(a=>a.id===id),k]).filter(x=>x[0]);const tot=items.reduce((s,x)=>s+x[1],0);if(items.length<2)return null;
  const share=f=>items.reduce((s,[a,k])=>s+(f(a)?k:0),0)/tot;
  const hoods={};items.forEach(([a,k])=>{const h=a.neighborhood||"Other";hoods[h]=(hoods[h]||0)+k});const topH=Object.entries(hoods).sort((x,y)=>y[1]-x[1]).filter(([,k])=>k/tot>=.4).map(([h])=>h).slice(0,2);
  const prices=items.map(([a])=>a.own).filter(x=>x!=null).sort((x,y)=>x-y);const med=prices.length?prices[Math.floor(prices.length/2)]:null;
  const am=AMEN.filter(([k,,f])=>share(a=>f(a)===true)>=.6).map(([k,l])=>[k,l]).slice(0,4);
  const pl={};items.forEach(([a,k])=>(a.plans||[]).forEach(x=>pl[x]=(pl[x]||0)+k));const topP=Object.entries(pl).sort((x,y)=>y[1]-x[1]).filter(([,k])=>k/tot>=.5).map(([x])=>x).slice(0,2);
  const walks=items.map(([a])=>dist(a).walk).sort((x,y)=>x-y);const mw=walks[Math.floor(walks.length/2)];
  return{hoods:topH,price:med,am,plans:topP,walk:mw,n:items.length}}
function trendText(t){return [t.hoods.join(" / "),t.price?"around "+money(t.price):null,t.walk?"~"+t.walk+" min walk":null,...t.am.map(x=>x[1].toLowerCase()),t.plans.join(", ")].filter(Boolean).join(" · ")}
function trendBonus(a,t){if(!t)return 0;let b=0;if(t.hoods.includes(a.neighborhood))b+=.04;b+=t.am.filter(([k])=>{const f=AMEN.find(x=>x[0]===k);return f&&f[2](a)===true}).length*.015;if(t.price&&a.own!=null)b+=Math.max(0,.04-Math.abs(a.own-t.price)/t.price*.1);return b}
let viewSave=null;function bumpView(id){const v=PMETA.views||(PMETA.views={});v[id]=(v[id]||0)+1;const keys=Object.keys(v);if(keys.length>150){keys.sort((x,y)=>v[x]-v[y]).slice(0,keys.length-150).forEach(k=>delete v[k])}
  clearTimeout(viewSave);viewSave=setTimeout(()=>{recCache=null;writePrefs()},3000)}
function k_bal(p){return (p.must||[]).includes("balc")}
function recommend(){
  const saved=APTS.filter(a=>hearts.has(a.id));if(!saved.length&&!PREFS)return[];
  const TR=trends();const out=[];for(const c of APTS){if(hearts.has(c.id)||!prefOK(c))continue;let best=0,bestB=null,sum=0;
    for(const b of saved){const v=sim(c,b);sum+=v;if(v>best){best=v;bestB=b}}
    const pr=PR(c),w=dist(c).walk;let fit=0.5;
    if(PREFS){const pf=PREFS.max&&pr!=null?Math.max(0,1-Math.abs(PREFS.max*0.9-pr)/PREFS.max):0.5;const wf=1-Math.min(w/Math.max(PREFS.walk||30,10),1);fit=(pf*.5+wf*.5)*.4+prefFit(c)*.6}
    const score=(saved.length?best*.55+(sum/saved.length)*.2:0)+fit*(saved.length?.25:1)+(c.rating?(c.rating-3.5)*.03:0)+trendBonus(c,TR);
    out.push({a:c,score,because:saved.length?bestB:null})}
  out.sort((x,y)=>y.score-x.score);return out.slice(0,30)}
function similarTo(a,n){return APTS.filter(c=>c.id!==a.id).map(c=>({c,s:sim(c,a)})).sort((x,y)=>y.s-x.s).slice(0,n)}
let recCache=null;
/* ---------- State ---------- */
const DEF={mode:"walk",refV:2,kinds:[],perBed:false,minRating:0,tags:[],balc:[],drive:30,walk:95,price:2100,room:"own",plans:[],am:[],hoods:[],unknown:false,sort:"walk",ref:"edge",rings:true};
let S=Object.assign({},DEF,store("fahm.filters")||{});S.unknown=false;S.perBed=false;S.balc=(S.balc||[]).filter(b=>["every","some","any"].includes(b));S.kinds=S.kinds||[];if(S.refV!==2){S.ref="edge";S.refV=2}S.tags=S.tags||[];S.balc=S.balc||[];S.am=(S.am||[]).filter(k=>["pool","rooftop","bath","win","furn","pets","match","wd","util","school","park"].includes(k));if(S.drive==null)S.drive=30;if(S.walk===65)S.walk=95;
let tab="all", query="", selected=null, filtersOpen=false;
let hearts=new Set(store("fahm.hearts")||[]);
let heartsMode="local", heartsRef=null, writeChain=Promise.resolve();
let DB=null, assetsApi=null, photos={}, photoChain=Promise.resolve(), uploading=0, photoErr="";
const photoUrls=id=>(photos[id]||[]).map(x=>"/_blob/"+x);

const refPt=()=>REFS.find(r=>r.id===S.ref)||REFS[0];
let CAMPUS_W=null;
function edgeMiles(a){if(!CAMPUS_W)CAMPUS_W=G.campus.map(p=>P(p[0],p[1]));const [x,y]=P(a.lng,a.lat);const poly=CAMPUS_W;let inside=false,best=1e12;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;
    const dx=xj-xi,dy=yj-yi,l2=dx*dx+dy*dy;let u=l2?((x-xi)*dx+(y-yi)*dy)/l2:0;u=Math.max(0,Math.min(1,u));const ex=xi+u*dx-x,ey=yi+u*dy-y;best=Math.min(best,ex*ex+ey*ey)}
  return inside?0:Math.sqrt(best)/MILE_PX}
const tt=d=>S.mode==="drive"?`${d.drive} min drive`:S.mode==="both"?`${d.walk} min walk · ${d.drive} min drive`:`${d.walk} min walk`;
const DIST=new Map();function dist(a){const k=a.id+"|"+S.ref;let v=DIST.get(k);if(v)return v;v=dist0(a);DIST.set(k,v);return v}
function dist0(a){const mi=S.ref==="edge"?edgeMiles(a):hav(refPt(),a);const route=mi*1.25;return{mi,route,walk:Math.max(1,Math.round(route*20)),bike:Math.max(1,Math.round(route*6)),drive:Math.max(3,Math.round(3+route*2.2))}}

function passes(a){
  const d=dist(a);
  if(S.walk<95&&d.walk>S.walk)return false;
  if(S.drive<30&&d.drive>S.drive)return false;
  if(S.room==="shared"&&a.shared==null)return false;
  if(S.price<2100){const p=PR(a);if(p==null){if(!S.unknown)return false}else if(p>S.price)return false}
  if(S.plans.length){const ok=S.plans.some(p=>p==="shared"?a.plans.some(isShared):p==="5x5"?a.plans.some(x=>/^[5-9]x/.test(x)):a.plans.includes(p));if(!ok)return false}
  for(const k of S.am){const f=AMEN.find(x=>x[0]===k);const v=f[2](a);if(v===true)continue;if(v==null&&S.unknown)continue;return false}
  if(S.hoods.length&&!S.hoods.includes(a.neighborhood))return false;
  if(S.kinds&&S.kinds.length&&!S.kinds.includes(a.kind||"apartment"))return false;
  if(S.perBed&&a.perApt)return false;
  if(S.minRating){if(a.rating==null){if(!S.unknown)return false}else if(a.rating<S.minRating)return false}
  for(const k of S.tags){if(a.tagSet.has(k))continue;if(S.unknown&&!a.researched)continue;return false}
  if(S.balc.length){const k=balcKind(a);const ok=S.balc.some(b=>b==="any"?k!=null:b===k);if(!ok)return false}
  return true;
}
function matchesQuery(a){if(!query)return true;const q=query.toLowerCase();return (a.name+" "+a.address+" "+a.neighborhood).toLowerCase().includes(q)}
function visible(){
  if(tab==="for"){recCache=recommend();return recCache.map(r=>r.a).filter(passes).filter(matchesQuery)}
  let arr=tab==="saved"?APTS.filter(a=>hearts.has(a.id)):APTS.filter(passes);
  arr=arr.filter(matchesQuery);
  const k=S.sort;
  arr.sort((x,y)=>k==="rating"?((y.rating??-1)-(x.rating??-1)||dist(x).walk-dist(y).walk):k==="hood"?(x.neighborhood.localeCompare(y.neighborhood)||dist(x).walk-dist(y).walk):k==="price"?((PR(x)??1e9)-(PR(y)??1e9)):k==="name"?x.name.localeCompare(y.name):dist(x).walk-dist(y).walk);
  return arr;
}
function saveFilters(){store("fahm.filters",S)}
function activeFilterCount(){return ((S.kinds||[]).length?1:0)+(S.perBed?1:0)+(S.minRating>0)+S.tags.length+S.balc.length+(S.drive<30)+(S.walk<95)+(S.price<2100)+((S.room||"own")!=="own")+S.plans.length+S.am.length+S.hoods.length}

/* ---------- Map view (pan/zoom) ---------- */
const mapEl=$("#map"),svg=$("#base"),world=$("#world"),pinsEl=$("#pins"),labelsEl=$("#labels"),tip=$("#tip");
let V={s:1,tx:0,ty:0};
const SMIN=.07,SMAX=6;
function setView(s,tx,ty){V.s=Math.min(SMAX,Math.max(SMIN,s));V.tx=tx;V.ty=ty;schedule()}
function fitBounds(lng1,lat1,lng2,lat2){
  const r=mapEl.getBoundingClientRect();const [x1,y1]=P(lng1,lat2),[x2,y2]=P(lng2,lat1);
  const pad=panelPad();const w=r.width-pad.l-pad.r-40,h=r.height-pad.t-pad.b-40;
  const s=Math.min(w/(x2-x1),h/(y2-y1));
  setView(s,pad.l+20+(w-(x2-x1)*s)/2-x1*s,pad.t+20+(h-(y2-y1)*s)/2-y1*s);
}
function panelPad(){const narrow=innerWidth<=720;const pr=$("#panel").getBoundingClientRect();return narrow?{l:0,r:0,t:56,b:Math.min(pr.height,innerHeight*.45)}:{l:pr.right,r:60,t:0,b:0}}
function zoomAt(f,cx,cy){const s=Math.min(SMAX,Math.max(SMIN,V.s*f));const k=s/V.s;setView(s,cx-(cx-V.tx)*k,cy-(cy-V.ty)*k)}
function centerOn(lng,lat,s){const pad=panelPad();const r=mapEl.getBoundingClientRect();const [x,y]=P(lng,lat);const ss=s||V.s;const cx=pad.l+(r.width-pad.l-pad.r)/2,cy=pad.t+(r.height-pad.t-pad.b)/2;setView(ss,cx-x*ss,cy-y*ss)}

let raf=0;function schedule(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;drawView()})}
let BASE=null,lastMinor=-1;
function drawView(){
  world.setAttribute("transform",`matrix(${V.s},0,0,${V.s},${V.tx},${V.ty})`);
  const z=V.s;
  // While panning (no zoom change), just slide the pins and labels instead of laying them out again.
  if(mapEl.classList.contains("dragging")&&BASE&&BASE.s===z){const t=`translate3d(${(V.tx-BASE.tx).toFixed(1)}px,${(V.ty-BASE.ty).toFixed(1)}px,0)`;pinsEl.style.transform=t;labelsEl.style.transform=t;if(hoverId)tip.hidden=true;return}
  pinsEl.style.transform="";labelsEl.style.transform="";BASE={s:z,tx:V.tx,ty:V.ty};
  svg.style.setProperty("--k",Math.sqrt(V.s).toFixed(3));
  // minor streets fade in when zoomed
  const mo=Math.round((z<.25?.35:z<.8?.35+.65*(z-.25)/.55:1)*50)/50;if(mo!==lastMinor){lastMinor=mo;world.querySelectorAll(".minor").forEach(e=>e.style.opacity=mo)}
  placeLabels();placePins();placeRings();updateScale();
  if(hoverId)showTip(hoverId);
}
const sx=x=>x*V.s+V.tx, sy=y=>y*V.s+V.ty;

/* pointer handling */
const ptrs=new Map();let drag=null,pinch=null,moved=false;
mapEl.addEventListener("pointerdown",e=>{if(e.button>0)return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;
  if(ptrs.size===1){drag={x:e.clientX,y:e.clientY,tx:V.tx,ty:V.ty}}
  if(ptrs.size===2){moved=true;mapEl.classList.remove("dragging");try{mapEl.setPointerCapture(e.pointerId)}catch(x){}const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:V.s,tx:V.tx,ty:V.ty,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2};drag=null}});
mapEl.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const r=mapEl.getBoundingClientRect();
  if(pinch&&ptrs.size>=2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const s=Math.min(SMAX,Math.max(SMIN,pinch.s*d/pinch.d));const k=s/pinch.s;const cx=pinch.cx-r.left,cy=pinch.cy-r.top;const ncx=(a.x+b.x)/2-r.left,ncy=(a.y+b.y)/2-r.top;setView(s,ncx-(cx-pinch.tx)*k,ncy-(cy-pinch.ty)*k);moved=true}
  else if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!moved&&Math.hypot(dx,dy)<(e.pointerType==="mouse"?4:9))return;
    if(!moved){moved=true;mapEl.classList.add("dragging");try{mapEl.setPointerCapture(e.pointerId)}catch(x){}}setView(V.s,drag.tx+dx,drag.ty+dy)}});
const endPtr=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(ptrs.size===0){drag=null;if(mapEl.classList.contains("dragging")){mapEl.classList.remove("dragging");schedule()}}else if(ptrs.size===1){const p=[...ptrs.values()][0];drag={x:p.x,y:p.y,tx:V.tx,ty:V.ty}}};
mapEl.addEventListener("pointerup",endPtr);mapEl.addEventListener("pointercancel",endPtr);
mapEl.addEventListener("wheel",e=>{e.preventDefault();const r=mapEl.getBoundingClientRect();const f=Math.exp(-e.deltaY*(e.ctrlKey?.012:.0022));zoomAt(f,e.clientX-r.left,e.clientY-r.top)},{passive:false});
mapEl.addEventListener("dblclick",e=>{if(e.target.closest(".pin"))return;const r=mapEl.getBoundingClientRect();zoomAt(2,e.clientX-r.left,e.clientY-r.top)});
$("#zin").onclick=()=>{const r=mapEl.getBoundingClientRect();zoomAt(1.6,r.width/2,r.height/2)};
$("#zout").onclick=()=>{const r=mapEl.getBoundingClientRect();zoomAt(1/1.6,r.width/2,r.height/2)};
$("#home").onclick=()=>fitBounds(-97.7560,30.2770,-97.7240,30.3000);
$("#all").onclick=()=>fitBounds(-97.845,30.185,-97.640,30.392);
$("#rings").onclick=()=>{S.rings=!S.rings;saveFilters();$("#rings").setAttribute("aria-pressed",S.rings);placeRings()};

/* ---------- Draw base map ---------- */
const NS="http://www.w3.org/2000/svg";
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);(parent||world).appendChild(e);return e}
const path=pts=>pts.map((p,i)=>{const [x,y]=P(p[0],p[1]);return (i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}).join("");
function smooth(pts){const q=pts.map(p=>P(p[0],p[1]));if(q.length<3)return path(pts);let d=`M${q[0][0].toFixed(1)} ${q[0][1].toFixed(1)}`;for(let i=1;i<q.length-1;i++){const mx=(q[i][0]+q[i+1][0])/2,my=(q[i][1]+q[i+1][1])/2;d+=`Q${q[i][0].toFixed(1)} ${q[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`}const l=q[q.length-1];return d+`L${l[0].toFixed(1)} ${l[1].toFixed(1)}`}
function drawBase(){
  const css=document.createElementNS(NS,"style");css.textContent=`
   .ns{vector-effect:non-scaling-stroke;fill:none;stroke-linecap:round;stroke-linejoin:round}
   .minor{stroke:var(--minor);stroke-width:calc(1.6px * var(--k,1))}
   .mj-case{stroke:var(--road-case);stroke-width:calc(5px * var(--k,1))}
   .mj{stroke:var(--road);stroke-width:calc(3.6px * var(--k,1))}
   .hw-case{stroke:var(--hwy-case);stroke-width:calc(7px * var(--k,1))}
   .hw{stroke:var(--hwy);stroke-width:calc(5px * var(--k,1))}
   .creek{stroke:var(--water);stroke-width:calc(2px * var(--k,1))}
   .ring{fill:none;stroke:var(--accent);stroke-width:1.5px;stroke-dasharray:6 6;vector-effect:non-scaling-stroke;opacity:.85}
   .ringfill{fill:var(--accent);opacity:.05}
   .campus-edge{stroke:var(--campus-ink);stroke-width:2.2px;stroke-dasharray:7 4;opacity:.9}
   .bld{fill:var(--campus-bld);stroke:var(--campus-ink);stroke-width:.6px;vector-effect:non-scaling-stroke;opacity:.55}
   .ring.drive{stroke:var(--campus-ink);stroke-dasharray:2 7;stroke-width:2px;opacity:.9}`;svg.prepend(css);
  el("rect",{x:-4000,y:-4000,width:WORLD_W+8000,height:WORLD_H+8000,fill:"var(--land)"});
  // subtle blocks for texture
  const gG=el("g",{class:"minor-wrap"});
  for(const g of GRIDS){
    const [l1,l2,a1,a2,sl,sa,ang,kind]=g;
    let d="";
    const cx=(l1+l2)/2,cy=(a1+a2)/2,[px,py]=P(cx,cy),rad=ang*Math.PI/180;
    const rot=(x,y)=>{const dx=x-px,dy=y-py;return[px+dx*Math.cos(rad)-dy*Math.sin(rad),py+dx*Math.sin(rad)+dy*Math.cos(rad)]};
    const lines=[];
    if(kind==="wc"){WC_NS.forEach(x=>lines.push([[x,a1],[x,a2]]));WC_EW.forEach(y=>lines.push([[l1,y],[l2,y]]))}
    else{for(let x=l1;x<=l2+1e-9;x+=sl)lines.push([[x,a1],[x,a2]]);for(let y=a1;y<=a2+1e-9;y+=sa)lines.push([[l1,y],[l2,y]])}
    for(const ln of lines){const [x1,y1]=rot(...P(...ln[0])),[x2,y2]=rot(...P(...ln[1]));d+=`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`}
    el("path",{d,class:"ns minor"},gG);
  }
  for(const p of G.parks)el("path",{d:path(p.p)+"Z",fill:"var(--park)"});
  el("path",{d:path(G.campus)+"Z",fill:"var(--campus)"});
  el("path",{d:path(G.capitol)+"Z",fill:"var(--campus)",opacity:.7});
  el("path",{d:path(G.campus)+"Z",class:"ns campus-edge"});
  const bG=el("g",{id:"bldG"});
  for(const [n,lng,lat,w,h] of G.buildings){const [x,y]=P(lng,lat);const W=w*9,H=h*9;el("rect",{x:x-W/2,y:y-H/2,width:W,height:H,rx:2,class:"bld"},bG)}
  // water drawn in world units
  el("path",{d:smooth(G.lake),fill:"none",stroke:"var(--water)","stroke-width":48,"stroke-linecap":"round","stroke-linejoin":"round"});
  el("path",{d:smooth(G.river),fill:"none",stroke:"var(--water)","stroke-width":30,"stroke-linecap":"round","stroke-linejoin":"round"});
  for(const c of G.creeks)el("path",{d:smooth(c),class:"ns creek"});
  const mj=G.major.map(smooth);
  mj.forEach(d=>el("path",{d,class:"ns mj-case"}));mj.forEach(d=>el("path",{d,class:"ns mj"}));
  const hw=G.hwy.map(smooth);
  hw.forEach(d=>el("path",{d,class:"ns hw-case"}));hw.forEach(d=>el("path",{d,class:"ns hw"}));
  // ring group
  el("g",{id:"ringG"});
  world.querySelectorAll(".minor").forEach(e=>e.classList.add("minor"));
}

/* ---------- Labels ---------- */
let labelEls=[];
function buildLabels(){
  labelsEl.innerHTML="";labelEls=[];
  for(const L of LABELS){const d=document.createElement("div");d.className="lbl "+(L.c==="shield"?"road":L.c);
    if(L.c==="shield")d.innerHTML=`<span class="shield">${esc(L.t)}</span>`;else d.textContent=L.t;
    labelsEl.appendChild(d);labelEls.push([L,d])}
  const tw=document.createElement("div");tw.className="tower";tw.innerHTML=`<div class="tw" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3h2v4h-1v11h3v2H7v-2h3V9H9V5h2z"/></svg></div><div class="tl" id="refName"></div>`;labelsEl.appendChild(tw);
  for(const m of [10,20,30]){const d=document.createElement("div");d.className="lbl ring-lbl";d.dataset.ring=m;d.textContent=m+" min walk";labelsEl.appendChild(d)}
  for(const m of [5,10]){const d=document.createElement("div");d.className="lbl ring-lbl drive";d.dataset.ring="d"+m;d.textContent="~"+m+" min drive";labelsEl.appendChild(d)}
  {const d=document.createElement("div");d.className="lbl ring-lbl drive";d.dataset.ring="drive";d.textContent="~20 min drive";labelsEl.appendChild(d)}
}
function placeLabels(){
  const z=V.s;
  for(const [L,d] of labelEls){const show=z>=L.z*.5&&(L.c!=="hood"||z<L.z*4.5);if(!show){d.hidden=true;continue}d.hidden=false;
    const [x,y]=P(...L.at);if(!d._w){d._w=d.offsetWidth;d._h=d.offsetHeight}const w=d._w,h=d._h;
    d.style.transform=`translate(${(sx(x)).toFixed(1)}px,${(sy(y)).toFixed(1)}px) rotate(${L.r||0}deg) translate(${-w/2}px,${-h/2}px)`}
  const r=refPt();const [x,y]=P(r.lng,r.lat);const tw=labelsEl.querySelector(".tower");tw.style.transform=`translate(${sx(x)-15}px,${sy(y)-15}px)`;
  $("#refName").textContent=S.ref==="edge"?"UT Tower":r.name;
}
let RING_KEY="";const lsz=d=>{if(!d._w){d._w=d.offsetWidth;d._h=d.offsetHeight}return [d._w,d._h]};
function placeRings(){
  const g=$("#ringG");const key=S.ref+"|"+S.rings+"|"+S.mode;const rebuild=key!==RING_KEY;RING_KEY=key;if(rebuild)g.innerHTML="";const r=refPt();const [x,y]=P(r.lng,r.lat);
  const el0=el;{const el=(...a)=>rebuild?el0(...a):null;
  const W=S.mode!=="drive",DR=S.mode==="drive"?[5,10,20]:S.mode==="both"?[20]:[];
  labelsEl.querySelectorAll("[data-ring]").forEach(d=>{const r=d.dataset.ring,isD=r==="drive"||r[0]==="d";d.hidden=!S.rings||(isD?!DR.includes(r==="drive"?20:+r.slice(1)):!W)});
  if(!S.rings)return;
  if(!W){}else if(S.ref==="edge"){const d=path(G.campus)+"Z";let top=1e9;for(const p of G.campus){const [,py]=P(p[0],p[1]);top=Math.min(top,py)}
    const cx=P(-97.7340,30.29)[0];
    for(const m of [30,20,10]){const rad=(m/20/1.25)*MILE_PX;el("path",{d,fill:"var(--accent)","fill-opacity":.025,stroke:"var(--accent)","stroke-opacity":.045,"stroke-width":rad*2,"stroke-linejoin":"round"},g);
      const lb=labelsEl.querySelector(`[data-ring="${m}"]`);const [w,h]=lsz(lb);lb.style.transform=`translate(${sx(cx)-w/2}px,${sy(top-rad)-h/2}px)`}
    el("path",{d,fill:"none",stroke:"var(--accent)","stroke-width":1.5,"stroke-dasharray":"6 6","vector-effect":"non-scaling-stroke",opacity:.6},g);
  }else
  for(const m of [10,20,30]){const rad=(m/20/1.25)*MILE_PX;
    el("circle",{cx:x,cy:y,r:rad,class:"ringfill"},g);el("circle",{cx:x,cy:y,r:rad,class:"ring"},g);
    const d=labelsEl.querySelector(`[data-ring="${m}"]`);const [w,h]=lsz(d);
    d.style.transform=`translate(${sx(x)-w/2}px,${sy(y-rad)-h/2}px)`}
  for(const m of DR){const rad=((m-3)/2.2/1.25)*MILE_PX;el("circle",{cx:x,cy:y,r:rad,class:"ring drive"},g);
   const d=labelsEl.querySelector(m===20?'[data-ring="drive"]':`[data-ring="d${m}"]`);const [w,h]=lsz(d);d.style.transform=`translate(${sx(x)-w/2}px,${sy(y-rad)-h/2}px)`}
}}
function updateScale(){const target=[.1,.25,.5,1,2,5];const pxPerMi=MILE_PX*V.s;let mi=target.find(t=>t*pxPerMi>=60)||5;$("#scaleBar").style.width=(mi*pxPerMi).toFixed(0)+"px";$("#scaleTxt").textContent=mi<1?mi+" mi":mi+" mi"}

/* ---------- Pins ---------- */
const HEART='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
let pinEls=new Map(), hoverId=null, shown=[];
function buildPins(){
  pinsEl.innerHTML="";pinEls.clear();
  shown=visible();
  for(const a of shown){
    const b=document.createElement("button");b.className="pin";b.type="button";b.dataset.id=a.id;
    b.setAttribute("aria-label",`${a.name}, ${ownTxt(a)}, about ${dist(a).walk} minute walk`);
    const [c1]=a.kind==="dorm"?["#7c3aed"]:a.kind==="house"?["#0e7490"]:hc(a.neighborhood);
    b.innerHTML=`<div class="bub"><span class="dot" style="background:${c1}">${a.kind==="dorm"?'<svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M3 21V9l9-6 9 6v12h-7v-5h-4v5zM8 11h2v2H8zm6 0h2v2h-2z"/></svg>':a.kind==="house"?'<svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M3 11 12 3l9 8h-3v10h-5v-6h-2v6H6V11z"/></svg>':a.pool?'<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5V19c-2 0-2 1.5-4 1.5s-2-1.5-4-1.5-2 1.5-4 1.5-2-1.5-4-1.5-2 1.5-4 1.5zM7 4h2v9H7zm8 0h2v9h-2zM9 7h6v2H9z"/></svg>':'<svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M4 21V8l8-5 8 5v13h-6v-6h-4v6z"/></svg>'}</span><span class="pr">${PR(a)!=null?money(PR(a)):"Price?"}</span>${hearts.has(a.id)?'<span class="h">'+HEART+'</span>':""}</div><div class="tail"></div>`;
    b.addEventListener("click",ev=>{ev.stopPropagation();if(moved)return;openCard(a.id,true)});
    b.addEventListener("pointerenter",()=>{hoverId=a.id;placePins();showTip(a.id)});
    b.addEventListener("pointerleave",()=>{hoverId=null;tip.hidden=true});
    b.addEventListener("focus",()=>{hoverId=a.id;showTip(a.id)});b.addEventListener("blur",()=>{hoverId=null;tip.hidden=true});
    pinsEl.appendChild(b);pinEls.set(a.id,b);
  }
  placePins();
}
function placePins(){
  const z=V.s;
  const W=mapEl.clientWidth,H=mapEl.clientHeight;
  const items=[];for(const a of shown){const [x,y]=P(a.lng,a.lat);const X=sx(x),Y=sy(y);const b=pinEls.get(a.id);if(!b)continue;
    if(X<-300||X>W+300||Y<-300||Y>H+300){b.style.display="none";continue}b.style.display="";items.push({a,x:X,y:Y})}
  // priority: selected, hovered, saved, then closest walk
  const pri=it=>(it.a.id===selected?0:it.a.id===hoverId?1:hearts.has(it.a.id)?2:3)*1000+dist(it.a).walk;
  const order=[...items].sort((p,q)=>pri(p)-pri(q));const boxes=[];
  for(const it of order){const b=pinEls.get(it.a.id);if(!b)continue;
    if(b._w==null){b.classList.remove("dotonly");b._w=b.offsetWidth;b._h=b.offsetHeight}
    const box={l:it.x-b._w/2-3,r:it.x+b._w/2+3,t:it.y-b._h-2,b:it.y+2};
    const hit=boxes.some(o=>!(box.r<o.l||box.l>o.r||box.b<o.t||box.t>o.b));
    const full=it.a.id===selected||it.a.id===hoverId||!hit;
    b.classList.toggle("dotonly",!full);if(full)boxes.push(box);it.full=full}
  items.sort((p,q)=>(p.full-q.full)||(p.y-q.y)).forEach((it,i)=>{const b=pinEls.get(it.a.id);if(!b)return;const sel=it.a.id===selected;b.classList.toggle("sel",sel);
    const w=it.full?b._w:22,h=it.full?b._h:26;b.style.transform=`translate(${(it.x-w/2).toFixed(1)}px,${(it.y-h).toFixed(1)}px) scale(${sel?1.08:1})`;b.style.zIndex=sel?999:i+1})
}
function showTip(id){const a=APTS.find(x=>x.id===id);if(!a)return;const b=pinEls.get(id);if(!b){tip.hidden=true;return}
  const d=dist(a);const r=b.getBoundingClientRect(),m=mapEl.getBoundingClientRect();
  tip.innerHTML=`<b>${esc(a.name)}</b>${a.rating!=null?ratingHtml(a)+"<br>":""}<span>${ownTxt(a)} · ${tt(d)}</span><br><span>${esc([a.pool?"Pool":null,a.windowsEveryBedroom?"Windows in every bedroom":null,balcKind(a)?BALC_LABEL[balcKind(a)]:null,a.tagSet.has("gym")?"Gym":null].filter(Boolean).join(" · ")||a.neighborhood)}</span>`;
  tip.hidden=false;let x=r.left-m.left+r.width/2-tip.offsetWidth/2,y=r.top-m.top-tip.offsetHeight-8;x=Math.max(8,Math.min(m.width-tip.offsetWidth-8,x));if(y<8)y=r.bottom-m.top+8;tip.style.left=x+"px";tip.style.top=y+"px"}
mapEl.addEventListener("click",e=>{if(moved||e.target.closest(".pin"))return;if(selected){closeCard()}});

/* ---------- Hearts (account-synced when available, else this browser) ---------- */
function persistHearts(){store("fahm.hearts",[...hearts]);if(heartsRef){const ids=[...hearts];writeChain=writeChain.then(()=>heartsRef.set({ids,updatedAt:Date.now()})).catch(()=>{heartsMode="local";heartsRef=null;renderList()})}}
function toggleHeart(id){hearts.has(id)?hearts.delete(id):hearts.add(id);persistHearts();buildPins();renderList();if(selected===id)renderCard()}
(async()=>{try{if(!window.claude||!window.claude.use)return;const [db,user,as]=await Promise.all([window.claude.use("db"),window.claude.use("user"),window.claude.use("assets")]);
  if(db){DB=db;assetsApi=as||null;db.collection("photos").onSnapshot(s=>{const m={};s.docs.forEach(d=>{const ids=(d.data()||{}).ids;if(Array.isArray(ids)&&ids.length)m[d.id]=ids.filter(x=>/^[A-Za-z0-9_-]{8,64}$/.test(x))});photos=m;renderList();if(selected)renderCard()},()=>{});if(selected)renderCard()}
  if(!db||!user)return;const uid=await user.id();if(!uid)return;
  const ref=db.doc("data/users/"+uid+"/hearts");let first=true;
  ref.onSnapshot(snap=>{if(snap.exists){const ids=(snap.data().ids||[]).filter(i=>APTS.some(a=>a.id===i));hearts=new Set(ids);store("fahm.hearts",ids)}
    else if(first&&hearts.size){const ids=[...hearts];writeChain=writeChain.then(()=>ref.set({ids,updatedAt:Date.now()})).catch(()=>{})}
    first=false;heartsRef=ref;heartsMode="account";buildPins();renderList();if(selected)renderCard()},()=>{heartsRef=null;heartsMode="local";renderList()});
 }catch(e){}})();

/* ---------- List ---------- */
function thumb(a){const [c1,c2]=hc(a.neighborhood);const ph=photoUrls(a.id)[0];const ini=a.name.replace(/^the\s+/i,"").split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();return `<div class="thumb" style="background:linear-gradient(135deg,${c1},${c2})" aria-hidden="true">${esc(ini)}${ph?`<img src="${esc(ph)}" alt="" loading="lazy">`:""}</div>`}
function priceTxt(a){if(a.priceMin==null)return"Price not listed";return money(a.priceMin)+(a.priceMax&&a.priceMax!==a.priceMin?"–"+money(a.priceMax):"+")}
function renderList(){
  $("#cAll").textContent=APTS.filter(passes).length;$("#cSaved").textContent=hearts.size;
  const n=activeFilterCount();$("#fCount").hidden=!n;$("#fCount").textContent=n;
  const arr=visible();const ul=$("#list");
  const hidden=APTS.length-arr.length;
  if(tab==="for"){$("#metaTxt").textContent=(PREFS||hearts.size)?"Based on "+[PREFS&&"your preferences",hearts.size&&`your ${hearts.size} saved place${hearts.size>1?"s":""}`].filter(Boolean).join(" and "):"";
    if(!hearts.size&&!PREFS){ul.innerHTML="";return}}
  else $("#metaTxt").innerHTML=tab==="saved"?(hearts.size?`${arr.length} saved · ${heartsMode==="account"?"synced to your account":"saved in this browser"}`:""):
    (hidden&&(n||query)?`${arr.length} of ${APTS.length} places · <button class="linkbtn" id="clearAll" style="font-size:12px;padding:0">Show all ${APTS.length}</button>`:`All ${APTS.length} places`);
  const ca=$("#clearAll");if(ca)ca.onclick=()=>{const keep={ref:S.ref,sort:S.sort,rings:S.rings};S=Object.assign({},DEF,keep);query="";$("#q").value="";refresh()};
  if(!arr.length){ul.innerHTML=tab==="saved"?`<li class="empty"><b>No saved apartments yet</b>Tap the heart on any place to save it here. Your hearts show up on the map too.</li>`:`<li class="empty"><b>No places match</b>Try a longer walk, a higher price, or remove a filter.</li>`;return}
  ul.innerHTML=arr.map(a=>{const d=dist(a);const tags=[a.tagSet.has("pool")&&"Pool",balcKind(a)&&BALC_LABEL[balcKind(a)],a.tagSet.has("gym")&&"Gym",a.windowsEveryBedroom&&"Windows",a.privateBath===true&&"Own bath",(a.tagSet.has("hot_tub")||a.tagSet.has("sauna"))&&"Hot tub/sauna",(a.tagSet.has("game_room")||a.tagSet.has("pool_table"))&&"Game room"].filter(Boolean).slice(0,4);
   const rec=tab==="for"&&recCache?recCache.find(r=>r.a.id===a.id):null;const why=rec&&rec.because?whyLike(a,rec.because):[];
   return `<li class="res${a.id===selected?" sel":""}" data-id="${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)}">${thumb(a)}<div class="rt"><b>${esc(a.name)}</b>${rec&&rec.because?`<span class="why">Like ${esc(rec.because.name)}${why.length?": "+esc(why.join(", ")):""}</span>`:""}<span>${a.rating!=null?ratingHtml(a)+" · ":""}${a.kind==="dorm"?"Dorm · ":a.kind==="house"?"House · ":""}${esc(a.neighborhood)} · ${tt(d)} · ${d.mi.toFixed(1)} mi</span><div class="tags">${tags.map(t=>`<span class="tag ok">${t}</span>`).join("")}</div></div>
   <div class="rp"><b>${PR(a)!=null?money(PR(a)):"—"}</b><span>${PR(a)!=null?(PR(a)===a.shared?"/mo shared room":a.kind==="house"?"/mo each":a.perApt?"/mo whole apt":"/mo"):"not listed"}</span><button class="icon-btn${hearts.has(a.id)?" on":""}" data-heart="${a.id}" aria-label="${hearts.has(a.id)?"Remove from saved":"Save"} ${esc(a.name)}" aria-pressed="${hearts.has(a.id)}">${hearts.has(a.id)?HEART.replace('width="11" height="11"','width="18" height="18"'):'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>'}</button></div></li>`}).join("");
}
$("#list").addEventListener("click",e=>{const h=e.target.closest("[data-heart]");if(h){e.stopPropagation();toggleHeart(h.dataset.heart);return}const li=e.target.closest(".res");if(li)openCard(li.dataset.id,false)});
$("#list").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const li=e.target.closest(".res");if(li&&!e.target.closest("[data-heart]")){e.preventDefault();openCard(li.dataset.id,false)}}});
$("#list").addEventListener("pointerover",e=>{const li=e.target.closest(".res");document.querySelectorAll(".pin.hl").forEach(p=>p.classList.remove("hl"));if(li){const p=pinEls.get(li.dataset.id);if(p){hoverId=li.dataset.id;showTip(li.dataset.id)}}});
$("#list").addEventListener("pointerleave",()=>{hoverId=null;tip.hidden=true});

/* ---------- Card ---------- */
function allAmen(a){const groups={};for(const k of a.tagSet){const [l,g]=TAGS[k];(groups[g]=groups[g]||[]).push(l)}
  const hasAny=Object.keys(groups).length||a.special.length;if(!hasAny)return "";
  return `<div class="sec"><h4>Everything they have</h4><div class="agroups">${GROUP_ORDER.filter(g=>groups[g]).map(g=>`<div class="ag"><small>${esc(g)}</small><div class="plans">${groups[g].map(l=>`<span>${esc(l)}</span>`).join("")}</div></div>`).join("")}
  ${a.special.length?`<div class="ag"><small>Special</small><ul class="special">${a.special.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`:""}</div>${a.researched?"":'<div class="note">Full amenity list not confirmed yet.</div>'}</div>`}
function yn(v){return v===true?"y":v===false?"n":"u"}
function amRow(label,v,extra){const c=yn(v);return `<div class="${c}"><i>${c==="y"?"✓":c==="n"?"✕":"?"}</i><span>${esc(label)}${extra?` <span style="color:var(--fg2)">${esc(extra)}</span>`:""}${c==="u"?' <span style="color:var(--fg3)">(not listed)</span>':""}</span></div>`}
function bldHero(a){let h="";const seed=[...a.id].reduce((s,c)=>s*31+c.charCodeAt(0)>>>0,7);for(let i=0;i<5;i++){const w=22+((seed>>(i*3))&15),ht=40+((seed>>(i*4))&63);h+=`<i style="width:${w}px;height:${ht}px"></i>`}return h}
function openCard(id,fromMap){selected=id;try{bumpView(id)}catch(e){}tip.hidden=true;renderCard();$("#listView").hidden=true;$("#filters").hidden=true;filtersOpen=false;$("#fToggle").setAttribute("aria-expanded","false");$("#card").hidden=false;$("#scroll").scrollTop=0;
  const a=APTS.find(x=>x.id===id);if(!fromMap)centerOn(a.lng,a.lat,Math.max(V.s,1.4));if(innerWidth<=720)$("#panel").classList.remove("min");placePins();}
function closeCard(){selected=null;$("#card").hidden=true;$("#listView").hidden=false;renderList();placePins()}
function renderCard(){
  const a=APTS.find(x=>x.id===selected);if(!a)return;const d=dist(a);const [c1,c2]=hc(a.neighborhood);const on=hearts.has(a.id);
  const pics=photoUrls(a.id);
  const gal=(pics.length||assetsApi)?`<div class="gal" aria-label="Photos">${pics.map((u,i)=>`<button data-ph="${i}" aria-label="Open photo ${i+1} of ${pics.length}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join("")}${assetsApi?`<button class="add" id="addPh"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Add photos</button>`:""}</div>${uploading?`<div class="uploading">Uploading ${uploading} photo${uploading>1?"s":""}…</div>`:""}${photoErr?`<div class="photo-note" style="color:var(--bad)">${esc(photoErr)}</div>`:""}${!pics.length&&assetsApi?`<div class="photo-note">Add photos from a tour or screenshots from the listing. They show up here and in the list.</div>`:""}`:"";
  const plans=a.plans.length?a.plans.map(p=>`<span class="${isShared(p)?"":"pb"}" title="${isShared(p)?"Shares bathrooms":"A bathroom for each bedroom"}">${esc(p==="studio"?"Studio":p)}</span>`).join(""):'<span style="color:var(--fg2);font-weight:500">Not listed</span>';
  $("#card").innerHTML=`
  ${(()=>{return ""})()}<div class="hero"><div class="sky" style="background:linear-gradient(160deg,${c2},${c1})"></div>${pics.length?`<img class="cover" src="${esc(pics[0])}" alt="${esc(a.name)} photo"><div class="shade"></div>`:`<div class="bld" aria-hidden="true">${bldHero(a)}</div>`}
    <div class="top"><button class="round" id="cBack" aria-label="Back to list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="round${on?" on":""}" id="cHeart" aria-pressed="${on}" aria-label="${on?"Remove from saved":"Save this apartment"}"><svg width="16" height="16" viewBox="0 0 24 24" fill="${on?"currentColor":"none"}" stroke="currentColor" stroke-width="2.2"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg></button></div>
    <h2>${esc(a.name)}</h2></div>
  ${gal}
  <div class="cbody">
    ${a.addedByAI?`<div class="aibadge">Added with AI${a.addedAt?" on "+new Date(a.addedAt).toLocaleDateString():""}. Double-check details on the official site.</div>`:""}
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:-2px">${ratingHtml(a,true)}${a.ratingUrl?`<a class="linkbtn" style="font-size:12.5px;text-decoration:none" href="${esc(a.ratingUrl)}" target="_blank" rel="noopener">Read reviews</a>`:""}</div>
    <div class="sub">${a.kind==="dorm"?"Dorm · ":a.kind==="house"?"House for rent · ":""}${esc(a.neighborhood)} · ${esc(a.address)}</div>
    <div class="actions" style="grid-template-columns:repeat(4,1fr)">
      <a class="act tour" href="${esc(a.tourUrl||a.website)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>${a.tourUrl&&!a.tourIsListing?"Book tour":"Tour / contact"}</a>
      <a class="act" href="${esc(a.photosUrl||a.website)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/></svg>Photos</a>
      <a class="act" href="${esc(a.website)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>Website</a>
      <button class="act${on?" on":""}" id="cHeart2" aria-pressed="${on}"><svg viewBox="0 0 24 24" fill="${on?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>${on?"Saved":"Save"}</button>
    </div>
    <div class="stats"><div class="stat"><small>Walk</small><b>${d.walk} min</b></div><div class="stat"><small>Bike</small><b>${d.bike} min</b></div><div class="stat"><small>Drive</small><b>${d.drive} min</b></div></div>
    <div style="font-size:12px;color:var(--fg2);margin-top:-8px">${S.ref==="edge"?(d.mi===0?"On campus":`To the closest edge of campus · ${d.mi.toFixed(2)} mi straight line`):`To ${esc(refPt().name)} · ${d.mi.toFixed(2)} mi straight line`}</div>
    <div class="sec"><h4>${a.kind==="house"?"Rent for the whole house":a.kind==="dorm"?"Price per person (monthly equivalent)":a.perApt?"Price for the whole apartment":"Price per person"}</h4><div class="price">${esc(PR(a)!=null?"From "+money(PR(a)):"Price not listed")}${PR(a)!=null?'<span style="font-size:13px;font-weight:500;color:var(--fg2)"> /mo</span>':""}</div>${a.kind==="house"&&a.own!=null?`<div class="note"><b>About ${money(a.own)}/mo each if all ${a.beds} bedrooms are filled</b></div>`:a.shared!=null?`<div class="note"><b>Your own bedroom: ${a.own!=null?"from "+money(a.own)+"/mo":"price not listed"} · Shared bedroom: from ${money(a.shared)}/mo</b></div>`:""}${a.priceMax&&a.priceMax!==a.priceMin?`<div class="note">All units: ${esc(priceTxt(a))}/mo</div>`:""}<div class="note">${esc(a.priceNote||"")}</div></div>
    ${a.deadlineOrSpecial?`<div class="callout deal"><b>Deal or deadline:</b> ${esc(a.deadlineOrSpecial)}</div>`:""}
    <div class="sec"><h4>Floor plans</h4><div class="plans">${plans}</div><div class="note">Green plans have a bathroom for every bedroom.</div></div>
    <div class="sec"><h4>Availability</h4><dl class="kv"><dt>Status</dt><dd>${esc(a.availability||"Not listed")}</dd><dt>Lease</dt><dd>${esc(a.leaseTerm||"Not listed")}</dd><dt>Utilities</dt><dd>${esc(a.utilitiesIncluded||"Not listed")}</dd><dt>Parking</dt><dd>${a.parkingPerMonth!=null?money(a.parkingPerMonth)+"/mo":"Not listed"}</dd></dl></div>
    <div class="sec"><h4>Amenities</h4><div class="am">
      ${amRow("Pool",a.pool,a.rooftopPool?"rooftop":"")}
      ${amRow("Private bathroom",a.privateBath===true?true:a.privateBath==="some"?true:a.privateBath,a.privateBath==="some"?"some plans":"")}
      ${amRow("Window in every bedroom",a.windowsEveryBedroom)}
      ${amRow("Balcony",balcKind(a)?true:a.balconyType==="none"?false:null,balcKind(a)?{every:"every unit",some:"some units",shared:"shared"}[balcKind(a)]:"")}
      ${amRow("Furnished",a.furnished==null?null:a.furnished!==false,a.furnished==="optional"?"optional":"")}
      ${amRow("Pet friendly",a.petFriendly)}
      ${amRow("Roommate matching",a.roommateMatching)}
      ${amRow("Washer/dryer in unit",a.inUnitLaundry)}
      ${amRow("Gym",a.tagSet.has("gym")?true:a.gym)}
      ${amRow("Study rooms",a.tagSet.has("study_rooms")?true:a.studyRooms)}
    </div></div>
    
    ${allAmen(a)}
    ${a.notes?`<div class="callout">${esc(a.notes)}</div>`:""}
    <div class="sec"><h4>Similar places</h4><div class="simrow">${similarTo(a,6).map(({c})=>`<button class="simc" data-sim="${c.id}"><b>${esc(c.name)}</b><span>${c.priceMin!=null?money(c.priceMin)+(c.perApt?" /apt":""):"Price not listed"} · ${tt(dist(c))}</span></button>`).join("")}</div></div>
    <div class="sec src"><h4>Where this info came from</h4>${(a.sources||[]).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\/(www\.)?/,"").slice(0,70))}</a>`).join("")}
      <div class="note">${a.coordsEstimated?"Map pin placed from the street address. ":""}Info gathered ${esc(CHECKED)}. Prices and availability change, so confirm with the property before signing.</div></div>
  </div>`;
  $("#card").querySelectorAll("[data-sim]").forEach(b=>b.onclick=()=>openCard(b.dataset.sim,false));
  $("#card").querySelectorAll("[data-ph]").forEach(b=>b.onclick=()=>openLb(a.id,+b.dataset.ph));
  const ap=$("#addPh");if(ap)ap.onclick=()=>{$("#photoIn").dataset.apt=a.id;$("#photoIn").click()};
  $("#cBack").onclick=closeCard;$("#cHeart").onclick=()=>toggleHeart(a.id);$("#cHeart2").onclick=()=>toggleHeart(a.id);
}

/* ---------- Photos: upload (editors), lightbox ---------- */
function shrink(file){return new Promise((res,rej)=>{const img=new Image();const u=URL.createObjectURL(file);img.onload=()=>{const m=1600,k=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(new Error("encode")),"image/jpeg",.85)};img.onerror=()=>{URL.revokeObjectURL(u);rej(new Error("read"))};img.src=u})}
$("#photoIn").onchange=async e=>{const files=[...e.target.files];const apt=e.target.dataset.apt;e.target.value="";if(!files.length||!assetsApi||!DB||!apt)return;
  photoErr="";uploading+=files.length;renderCard();const newIds=[];
  for(const f of files){try{const blob=await shrink(f);const r=await assetsApi.upload(blob,{type:"image/jpeg"});newIds.push(r.id)}catch(err){photoErr=err&&err.code==="too_large"?"That photo is too big. Try a smaller one.":err&&err.code==="quota_or_state"?"Photo storage is full.":err&&err.code==="rate_limited"?"Too many uploads at once. Wait a moment and try again.":"A photo couldn't be uploaded. Try again.";}
    uploading--;renderCard()}
  if(newIds.length){const ids=[...(photos[apt]||[]),...newIds];photos[apt]=ids;renderCard();renderList();photoChain=photoChain.then(()=>DB.doc("photos/"+apt).set({ids,updatedAt:Date.now()})).catch(()=>{photoErr="Photos uploaded but couldn't be saved to the list. Try again.";renderCard()})}};
let lbState=null;
function openLb(apt,i){lbState={apt,i,confirm:false};drawLb()}
function drawLb(){const lb=$("#lb");if(!lbState){lb.hidden=true;lb.innerHTML="";return}const pics=photoUrls(lbState.apt);if(!pics.length){lbState=null;return drawLb()}
  lbState.i=(lbState.i+pics.length)%pics.length;const a=APTS.find(x=>x.id===lbState.apt);
  lb.innerHTML=`<div class="lbbar"><span>${esc(a.name)} · ${lbState.i+1} of ${pics.length}</span><span class="confirm">${assetsApi?(lbState.confirm?`Delete this photo? <button class="del" id="lbDel2">Delete</button><button class="keep" id="lbKeep">Keep</button>`:`<button class="keep" id="lbDel">Delete photo</button>`):""}<button class="round" id="lbX" aria-label="Close photos">✕</button></span></div>
   <img src="${esc(pics[lbState.i])}" alt="${esc(a.name)} photo ${lbState.i+1}">
   ${pics.length>1?`<button class="round nav prev" id="lbP" aria-label="Previous photo">‹</button><button class="round nav next" id="lbN" aria-label="Next photo">›</button>`:""}`;
  lb.hidden=false;
  const g=s=>lb.querySelector(s);g("#lbX").onclick=()=>{lbState=null;drawLb()};
  if(g("#lbP"))g("#lbP").onclick=()=>{lbState.i--;lbState.confirm=false;drawLb()};if(g("#lbN"))g("#lbN").onclick=()=>{lbState.i++;lbState.confirm=false;drawLb()};
  if(g("#lbDel"))g("#lbDel").onclick=()=>{lbState.confirm=true;drawLb()};if(g("#lbKeep"))g("#lbKeep").onclick=()=>{lbState.confirm=false;drawLb()};
  if(g("#lbDel2"))g("#lbDel2").onclick=async()=>{const apt=lbState.apt;const id=(photos[apt]||[])[lbState.i];if(!id)return;const ids=(photos[apt]||[]).filter(x=>x!==id);photos[apt]=ids;lbState.confirm=false;drawLb();renderCard();renderList();
    photoChain=photoChain.then(()=>DB.doc("photos/"+apt).set({ids,updatedAt:Date.now()})).then(()=>assetsApi.delete(id)).catch(()=>{})};
  lb.onclick=e=>{if(e.target===lb){lbState=null;drawLb()}};
}
document.addEventListener("keydown",e=>{if(!lbState)return;if(e.key==="Escape"){lbState=null;drawLb()}else if(e.key==="ArrowRight"){lbState.i++;drawLb()}else if(e.key==="ArrowLeft"){lbState.i--;drawLb()}},true);

/* ---------- Filters UI ---------- */
function chip(label,on,data){return `<button class="chip" aria-pressed="${on}" ${data}>${esc(label)}</button>`}
function renderFilters(){
  $("#fWalk").value=S.walk;$("#oWalk").textContent=S.walk>=95?"Any":S.walk+" min";
  $("#fDrive").value=S.drive;$("#oDrive").textContent=S.drive>=30?"Any":S.drive+" min";
  $("#fPrice").value=S.price;$("#oPrice").textContent=S.price>=2100?"Any":money(S.price);
  $("#fPlans").innerHTML=PLAN_CHIPS.map(([k,l])=>chip(l,S.plans.includes(k),`data-plan="${k}"`)).join("");
  $("#fAm").innerHTML=AMEN.map(([k,l])=>chip(l,S.am.includes(k),`data-am="${k}"`)).join("");
  $("#lPrice").textContent={own:"Max price for your own bedroom",shared:"Max price for a shared bedroom",any:"Max price"}[S.room||"own"];   $("#fRoom").innerHTML=[["own","My own bedroom"],["shared","Shared bedroom"],["any","Either"]].map(([k,l])=>chip(l,(S.room||"own")===k,`data-room="${k}"`)).join("");   $("#fKind").innerHTML=[["apartment","Apartments"],["dorm","Dorms"],["house","Houses"]].map(([k,l])=>chip(l+" ("+APTS.filter(a=>(a.kind||"apartment")===k).length+")",(S.kinds||[]).includes(k),`data-kind="${k}"`)).join("");
  $("#fRate").innerHTML=[[0,"Any"],[3.5,"3.5+ ★"],[4,"4.0+ ★"],[4.5,"4.5+ ★"]].map(([v,l])=>chip(l,(S.minRating||0)===v,`data-rate="${v}"`)).join("");
  $("#fBalc").innerHTML=BALC_FILTERS.map(([k,l])=>chip(l,S.balc.includes(k),`data-balc="${k}"`)).join("");
  $("#fTags").innerHTML=AMEN_FILTERS.map(k=>chip(TAGS[k][0],S.tags.includes(k),`data-tag="${k}"`)).join("");
  $("#fHood").innerHTML=HOODS.map(h=>chip(h,S.hoods.includes(h),`data-hood="${esc(h)}"`)).join("");
  $("#fUnknown").checked=S.unknown;$("#fPerBed").checked=!!S.perBed;$("#sort").value=S.sort;$("#rings").setAttribute("aria-pressed",S.rings);
}
function refresh(){saveFilters();renderFilters();renderList();buildPins()}
const tog=(arr,v)=>arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];
$("#fWalk").oninput=e=>{S.walk=+e.target.value;$("#oWalk").textContent=S.walk>=95?"Any":S.walk+" min";renderList();buildPins();saveFilters()};
$("#fDrive").oninput=e=>{S.drive=+e.target.value;$("#oDrive").textContent=S.drive>=30?"Any":S.drive+" min";renderList();buildPins();saveFilters()};
$("#fPrice").oninput=e=>{S.price=+e.target.value;$("#oPrice").textContent=S.price>=2100?"Any":money(S.price);renderList();buildPins();saveFilters()};
$("#filters").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;if(b.dataset.plan)S.plans=tog(S.plans,b.dataset.plan);if(b.dataset.am)S.am=tog(S.am,b.dataset.am);if(b.dataset.hood)S.hoods=tog(S.hoods,b.dataset.hood);if(b.dataset.tag)S.tags=tog(S.tags,b.dataset.tag);if(b.dataset.rate!=null)S.minRating=+b.dataset.rate;if(b.dataset.kind)S.kinds=tog(S.kinds||[],b.dataset.kind);if(b.dataset.balc)S.balc=tog(S.balc,b.dataset.balc);if(b.dataset.room)S.room=b.dataset.room;refresh()});
$("#fUnknown").onchange=e=>{S.unknown=e.target.checked;refresh()};
$("#fPerBed").onchange=e=>{S.perBed=e.target.checked;refresh()};
$("#fReset").onclick=()=>{const keep={ref:S.ref,sort:S.sort,rings:S.rings};S=Object.assign({},DEF,keep);refresh()};
$("#fDone").onclick=()=>toggleFilters(false);
$("#sort").onchange=e=>{S.sort=e.target.value;saveFilters();renderList()};
function toggleFilters(open){filtersOpen=open??!filtersOpen;$("#filters").hidden=!filtersOpen;$("#fToggle").setAttribute("aria-expanded",filtersOpen);if(filtersOpen){if(selected)closeCard();$("#scroll").scrollTop=0;if(innerWidth<=720)$("#panel").classList.remove("min")}}
$("#fToggle").onclick=()=>toggleFilters();
$("#ref").innerHTML=REFS.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join("");
if($("#mode")){$("#mode").value=S.mode||"walk";$("#mode").onchange=e=>{S.mode=e.target.value;saveFilters();renderList();buildPins();placeRings();if(selected)renderCard()}}
$("#ref").onchange=e=>{S.ref=e.target.value;saveFilters();renderList();buildPins();placeLabels();placeRings();if(selected)renderCard()};
$("#q").oninput=e=>{query=e.target.value.trim();renderList();buildPins()};
function setTab(t){tab=t;$("#tabAll").setAttribute("aria-pressed",t==="all");$("#tabSaved").setAttribute("aria-pressed",t==="saved");$("#tabFor").setAttribute("aria-pressed",t==="for");$("#fToggle").hidden=t==="saved";if(t==="saved")toggleFilters(false);if(selected)closeCard();renderList();buildPins()}
$("#tabAll").onclick=()=>setTab("all");$("#tabSaved").onclick=()=>setTab("saved");$("#tabFor").onclick=()=>setTab("for");
if(!window.FAH_SHEET)$("#grab").onclick=()=>$("#panel").classList.toggle("min");
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(selected)closeCard();else if(filtersOpen)toggleFilters(false)}});

/* ---------- Boot ---------- */
drawBase();buildLabels();if(innerWidth<=720)$("#panel").classList.add("min");
$("#ref").value=S.ref;renderFilters();renderList();buildPins();
requestAnimationFrame(()=>{fitBounds(-97.800,30.225,-97.685,30.355)});
let rT;addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(schedule,80)});
/* ---------- Shared folders (Kyra, Nov 12): named lists two people can both edit, shared by link ---------- */
const SITE=(typeof window!=="undefined"&&window.FAH_SITE)||"https://claude.ai/artifact/SdYcitbApo5cx7Zqs1fszD";
let folders=(()=>{const x=store("fahm.folderData");return x&&typeof x==="object"?x:{}})();
let myFolders=new Set((store("fahm.folders")||[]).filter(f=>/^[a-z0-9]{8,40}$/.test(f)));
let newKind="shared",openFolder=null,myFoldersRef=null,folderMsg="",foldEdit=null,foldLinkShown=null,linkExtra=null;
const folderSubs=new Set(),folderChains={};
const nameSlug=n=>slug(n).slice(0,40);
const unslugName=s=>{const t=s.replace(/-/g," ").trim();return t?t.charAt(0).toUpperCase()+t.slice(1):"Shared folder"};
function cacheFolders(){const o={};for(const f of Object.keys(folders))if(folders[f]&&(myFolders.has(f)||folders[f].parent))o[f]={name:folders[f].name,ids:folders[f].ids,private:!!folders[f].private,parent:folders[f].parent||null,kids:folders[f].kids||[]};store("fahm.folderData",o)}
function saveMyFolders(){store("fahm.folders",[...myFolders]);cacheFolders();if(myFoldersRef){const ids=[...myFolders];myFoldersRef.set({ids,updatedAt:Date.now()}).catch(()=>{})}}
function folderIds(f){return (folders[f]&&folders[f].ids)||[]}
let foldLinkVal="";
function folderLink(f){const ids=folderIds(f).filter(id=>APTS.some(a=>a.id===id));return SITE+"#folder-"+f+"--title-"+nameSlug(folders[f].name||"shared")+(ids.length?"--"+ids.join("--"):"")}
function newFid(){const a=new Uint8Array(10);crypto.getRandomValues(a);return [...a].map(b=>"abcdefghijklmnopqrstuvwxyz0123456789"[b%36]).join("")}
function subFolder(f){if(!DB||folderSubs.has(f))return;folderSubs.add(f);
  DB.doc("folders/"+f).onSnapshot(d=>{if(folders[f]&&folders[f].localOnly)return;if(d.exists){const x=d.data()||{};folders[f]={name:String(x.name||"Shared folder").slice(0,40),ids:(Array.isArray(x.ids)?x.ids:[]).filter(i=>typeof i==="string"&&i.length<80).slice(0,300),live:true,
      private:!!x.private,parent:x.parent||null,kids:Array.isArray(x.kids)?x.kids:[],people:Array.isArray(x.people)?x.people:[],notes:x.notes&&typeof x.notes==="object"?x.notes:{},addedBy:x.addedBy||{}};
      for(const k of folders[f].kids){if(!folders[k.code])folders[k.code]={name:k.name,ids:[],parent:f,live:false};else folders[k.code].name=k.name;subFolder(k.code)}}
    else if(folders[f]){folders[f].live=true;writeFolder(f)}
    cacheFolders();renderList();buildPins();if(selected)renderCard()},()=>{})}
function writeFolder(f){cacheFolders();if(!DB)return;const x=folders[f];if(!x)return;
  folderChains[f]=(folderChains[f]||Promise.resolve()).then(()=>DB.doc("folders/"+f).set({name:x.name,ids:x.ids,private:!!x.private,parent:x.parent||null,updatedAt:Date.now()})).catch(()=>{x.live=false;x.localOnly=true;cacheFolders();renderList()})}
function createFolder(name,firstId,opt){opt=opt||{};const f=newFid();folders[f]={name:(name||"Our places").slice(0,40),ids:firstId?[firstId]:[],live:!!DB,private:!!opt.private&&!opt.parent,parent:opt.parent||null,kids:[],notes:{}};
  if(opt.parent){const P=folders[opt.parent];if(P){P.kids=[...(P.kids||[]),{code:f,name:folders[f].name}]}}else{myFolders.add(f);saveMyFolders()}
  writeFolder(f);subFolder(f);return f}
const isSharedF=f=>folders[f]&&!folders[f].private&&!folders[f].parent;
function folderTitle(f){const x=folders[f];if(!x)return"";return x.parent&&folders[x.parent]?folders[x.parent].name+" › "+x.name:x.name}
function allFolderCodes(){const out=[];for(const f of myFolders){if(!folders[f])continue;out.push(f);for(const k of folders[f].kids||[])if(folders[k.code])out.push(k.code)}return out}
function notesFor(f,id){return ((folders[f]&&folders[f].notes)||{})[id]||[]}
const NOTE_SVG='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>';
function openNote(f,id){const a=APTS.find(x=>x.id===id),x=folders[f];if(!a||!x)return;let d=$("#noteDlg");if(!d){d=document.createElement("div");d.id="noteDlg";document.body.appendChild(d)}
  const ns=notesFor(f,id),mine=ns.find(n=>n.mine),others=ns.filter(n=>!n.mine);
  d.innerHTML=`<div class="nbox" role="dialog" aria-label="Notes"><div class="nhd"><div><b>${esc(a.name)}</b><span>Notes in ${esc(folderTitle(f))}</span></div><button type="button" id="nX" aria-label="Close">✕</button></div>
    ${others.map(n=>`<div class="nitem"><b>${esc(n.name)}</b><p>${esc(n.text)}</p><span>${new Date(n.at).toLocaleDateString([],{month:"short",day:"numeric"})}</span></div>`).join("")}
    <label class="nlbl" for="nTxt">${others.length?"Your note":"Note"}${x.private?"":` <span>(everyone in this folder can see it)</span>`}</label>
    <textarea id="nTxt" maxlength="500" rows="4" placeholder="Like: ask about the 4x4 with a balcony, tour Saturday">${esc(mine?mine.text:"")}</textarea>
    <div class="nbtns"><button type="button" class="fb pri" id="nSave">Save note</button>${mine?'<button type="button" class="fb" id="nDel">Delete my note</button>':""}<span id="nMsg"></span></div></div>`;
  d.hidden=false;const close=()=>{d.hidden=true};d.querySelector("#nX").onclick=close;d.onclick=e=>{if(e.target===d)close()};
  const save=async t=>{$("#nMsg").textContent="Saving…";try{await window.FAH_NOTES.set(f,id,t);close()}catch(e){$("#nMsg").textContent="Couldn't save. Try again."}};
  d.querySelector("#nSave").onclick=()=>save($("#nTxt").value);const del=d.querySelector("#nDel");if(del)del.onclick=()=>save("");setTimeout(()=>$("#nTxt").focus(),50)}
window.FAH_FOLDERS={list:()=>allFolderCodes().map(f=>({code:f,name:folderTitle(f),private:!!folders[f].private,shared:isSharedF(f),sub:!!folders[f].parent,count:folderIds(f).length})),
  create:(name,ids,opt)=>{const f=createFolder(name,null,opt);folders[f].ids=[...new Set(ids||[])];writeFolder(f);renderList();buildPins();return f},
  add:(f,ids)=>{const x=folders[f];if(!x)return false;x.ids=[...new Set([...x.ids,...ids])];writeFolder(f);renderList();buildPins();return true},
  remove:(f,ids)=>{const x=folders[f];if(!x)return false;x.ids=x.ids.filter(i=>!ids.includes(i));writeFolder(f);renderList();buildPins();return true},
  note:(f,id,t)=>window.FAH_NOTES.set(f,id,t),
  heart:(ids,on)=>{for(const id of ids){if(on!==hearts.has(id))toggleHeart(id)}},
  saved:()=>[...hearts],
  places:()=>APTS.map(a=>({id:a.id,name:a.name})),
  open:id=>openCard(id,false)};

function toggleInFolder(f,id){const x=folders[f];if(!x)return;x.ids=x.ids.includes(id)?x.ids.filter(i=>i!==id):[...x.ids,id];writeFolder(f);renderList();buildPins();if(selected)renderCard()}
function readHash(){let h="";try{h=decodeURIComponent(location.hash.slice(1))}catch(e){return}
  const m=/^folder-([a-z0-9]{8,40})((?:--[a-z0-9-]+)*)$/.exec(h);if(!m)return;const f=m[1];
  const parts=m[2].split("--").filter(Boolean);let nm=null;const ids=[];for(const p of parts){if(p.startsWith("title-"))nm=unslugName(p.slice(6));else ids.push(p)}
  if(!folders[f])folders[f]={name:nm||"Shared folder",ids,live:false};else{const have=new Set(folderIds(f));const extra=ids.filter(i=>!have.has(i)&&APTS.some(a=>a.id===i));if(extra.length)linkExtra={f,ids:extra}}
  myFolders.add(f);saveMyFolders();subFolder(f);openFolder=f;setTab("saved")}
addEventListener("hashchange",readHash);

/* folder bar in the Saved tab */
(function(){const ul=$("#list");const d=document.createElement("div");d.id="fold";ul.parentNode.insertBefore(d,ul)})();
const _visible=visible;visible=function(){if(tab==="saved"&&openFolder){const ids=new Set(folderIds(openFolder));return APTS.filter(a=>ids.has(a.id)).filter(matchesQuery)}return _visible()};
const _renderList=renderList;renderList=function(){_renderList();renderFolderBar();
  if(tab==="saved"&&openFolder&&folders[openFolder]){const x=folders[openFolder];document.querySelectorAll("#list .res").forEach(li=>{const id=li.dataset.id,ns=notesFor(openFolder,id),by=(x.addedBy||{})[id];const rt=li.querySelector(".rt");if(!rt)return;
    const b=document.createElement("button");b.type="button";b.className="nicon"+(ns.length?" has":"");b.dataset.noteF=openFolder;b.dataset.noteId=id;b.setAttribute("aria-label",ns.length?"Read notes":"Add a note");
    b.innerHTML=NOTE_SVG+(ns.length?`<span>${esc(ns[0].text.slice(0,60))}${ns.length>1?` +${ns.length-1}`:""}</span>`:"<span>Add note</span>");rt.appendChild(b);
    if(by&&!x.private){const s2=document.createElement("span");s2.className="addedby";s2.textContent="Added by "+by;rt.appendChild(s2)}})}};
$("#list").addEventListener("click",e=>{const b=e.target.closest(".nicon");if(!b)return;e.stopPropagation();e.preventDefault();openNote(b.dataset.noteF,b.dataset.noteId)},true);
function renderFolderBar(){const el=$("#fold");if(!el)return;if(tab==="for"){renderPrefs(el);return}if(tab!=="saved"){el.innerHTML="";return}
  const msg=folderMsg?`<div class="fnote warn">${esc(folderMsg)}</div>`:"";
  const editBox=(val,btn,ph)=>`<div class="frow"><input id="fName" maxlength="40" value="${esc(val)}" placeholder="${esc(ph||"Folder name")}" aria-label="Folder name"><button class="fb pri" id="fSave">${btn}</button><button class="fb" id="fCancel">Cancel</button></div>`;
  if(openFolder&&folders[openFolder]){const f=openFolder,x=folders[f];const n=folderIds(f).filter(id=>APTS.some(a=>a.id===id)).length;const sub=!!x.parent,P=sub?folders[x.parent]:null;
    const people=(sub&&P?P.people:x.people)||[];const others=people.filter(p=>p!=="You"&&p);
    const who=x.private?"Just you":others.length?"With "+others.join(", "):"Only you so far. Send the link to share it.";
    const back=sub&&P?`‹ ${esc(P.name)}`:"‹ My saves";
    const btns=foldEdit===f?editBox(x.name,"Save"):`<div class="frow">${(!x.private&&!sub)?'<button class="fb pri" id="fCopy">Copy link to send</button>':""}<button class="fb" id="fRename">Rename</button>${sub||x.private?'<button class="fb" id="fDelete">Delete folder</button>':'<button class="fb" id="fLeave">Remove from my list</button>'}</div>`;
    const kids=(!x.private&&!sub)?`<div class="fnote">Folders inside</div><div class="chips">${(x.kids||[]).map(k=>`<button class="chip" data-open-fold="${k.code}">📁 ${esc(k.name)} <span style="color:var(--fg2)">${folderIds(k.code).length||""}</span></button>`).join("")}<button class="chip" id="fNewIn">+ New folder inside</button></div>${foldEdit==="newin"?editBox("","Create","Like “Pool places” or “Tour list”"):""}`:"";
    el.innerHTML=`<div class="fbar"><div class="fhead"><button class="fb" id="fBack" aria-label="Back">${back}</button><b>${x.private?"🔒":"📁"} ${esc(x.name)}</b><span>${n} place${n===1?"":"s"}</span></div>
      <div class="fnote">${esc(who)}</div>${btns}
      ${foldLinkShown===f?`<div class="frow"><input id="fLink" readonly value="${esc(foldLinkVal||folderLink(f))}" aria-label="Folder link"></div><div class="fnote">Copied (if not, select the link above and copy it). Paste it into a text. ${window.FAH_AUTH&&window.FAH_AUTH.isAdmin?"New people make an account, you approve them, then the folder opens for them.":"They'll need an account the site owner has approved."}</div>`:""}
      ${linkExtra&&linkExtra.f===f?`<div class="frow"><span class="fnote" style="flex:1">The link you opened has ${linkExtra.ids.length} place${linkExtra.ids.length===1?"":"s"} that ${linkExtra.ids.length===1?"isn't":"aren't"} in your copy yet.</span><button class="fb pri" id="fMerge">Add ${linkExtra.ids.length===1?"it":"them"}</button></div>`:""}
      ${kids}
      ${n?`<div class="fnote">Tap the note icon on a place to leave a note${x.private?"":" everyone in the folder can see"}.</div>`:`<div class="fnote">Empty for now. Open any place and tap <b>${esc(x.name)}</b> under Folders to add it.</div>`}${msg}</div>`}
  else{const list=[...myFolders].filter(f=>folders[f]);const mine=list.filter(f=>folders[f].private),shared=list.filter(f=>!folders[f].private);
    const chip=f=>`<button class="chip" data-open-fold="${f}">${folders[f].private?"🔒":"📁"} ${esc(folders[f].name)} <span style="color:var(--fg2)">${folderIds(f).length}</span></button>`;
    el.innerHTML=`<div class="fbar"><div class="fhead"><b>Folders</b><span>${list.length?"":"Organize your saves, or plan with roommates"}</span></div>
      ${mine.length?`<div class="fnote">Just me</div><div class="chips">${mine.map(chip).join("")}</div>`:""}
      ${shared.length?`<div class="fnote">Shared</div><div class="chips">${shared.map(chip).join("")}</div>`:""}
      <div class="chips" style="margin-top:6px"><button class="chip" id="fNew" data-kind="private">+ New folder (just me)</button><button class="chip" id="fNew2" data-kind="shared">+ New shared folder</button></div>
      ${foldEdit==="new"?`<div class="fnote">${newKind==="private"?"🔒 Just for you. Nobody else can see it.":"📁 Shared. You'll get a link to send to roommates."}</div>`+editBox("","Create",newKind==="private"?"Like “Top picks”":"Like “Kyra + Sam”"):""}${msg}</div>
      <div class="fnote" style="padding:2px 14px 6px">Your hearts below are just yours.</div>`}
}
$("#listView").addEventListener("click",async e=>{const t=e.target.closest("button");if(!t||!t.closest("#fold")||tab!=="saved")return;folderMsg="";
  if(t.dataset.openFold){openFolder=t.dataset.openFold;foldEdit=null;foldLinkShown=null;foldLinkVal="";subFolder(openFolder)}
  else if(t.id==="fNew"||t.id==="fNew2"){foldEdit="new";newKind=t.dataset.kind||"shared"}
  else if(t.id==="fNewIn"){foldEdit="newin"}
  else if(t.id==="fBack"){const x=folders[openFolder];openFolder=x&&x.parent&&folders[x.parent]?x.parent:null;foldEdit=null;foldLinkShown=null}
  else if(t.id==="fDelete"){const x=folders[openFolder];if(!confirm(`Delete “${x.name}”${x.parent?"":" for everyone in it"}?`))return;const f=openFolder;try{await window.FAH_NOTES.remove(f)}catch(err){folderMsg="Only the person who made it can delete it.";renderList();return}
    if(x.parent&&folders[x.parent])folders[x.parent].kids=(folders[x.parent].kids||[]).filter(k=>k.code!==f);myFolders.delete(f);delete folders[f];saveMyFolders();openFolder=x.parent||null}
  else if(t.id==="fRename"){foldEdit=openFolder}
  else if(t.id==="fCancel"){foldEdit=null}
  else if(t.id==="fSave"){const v=($("#fName").value||"").trim().slice(0,40);if(!v){folderMsg="Give the folder a name.";renderList();return}
    if(foldEdit==="new"){openFolder=createFolder(v,null,{private:newKind==="private"})}else if(foldEdit==="newin"){openFolder=createFolder(v,null,{parent:openFolder})}else if(folders[foldEdit]){folders[foldEdit].name=v;writeFolder(foldEdit);const P=folders[folders[foldEdit].parent];if(P)(P.kids||[]).forEach(k=>{if(k.code===foldEdit)k.name=v})}foldEdit=null}
  else if(t.id==="fCopy"){foldLinkShown=openFolder;const link=folderLink(openFolder);foldLinkVal=link;try{await navigator.clipboard.writeText(link)}catch(err){}}
  else if(t.id==="fMerge"&&linkExtra){const x=folders[linkExtra.f];x.ids=[...x.ids,...linkExtra.ids];writeFolder(linkExtra.f);linkExtra=null}
  else if(t.id==="fLeave"){myFolders.delete(openFolder);saveMyFolders();openFolder=null;foldLinkShown=null}
  renderList();buildPins();if(t.id==="fCopy"){const i=$("#fLink");if(i){i.focus();i.select()}}
  if(t.id==="fNew"||t.id==="fRename"){const i=$("#fName");if(i)i.focus()}});
$("#listView").addEventListener("keydown",e=>{if(e.target.id==="fName"&&e.key==="Enter"){e.preventDefault();const b=$("#fSave");if(b)b.click()}});

/* folder buttons on each place's card */
const _renderCard=renderCard;renderCard=function(){_renderCard();const a=APTS.find(x=>x.id===selected);if(!a)return;
  const secs=$("#card").querySelectorAll(".sec");const last=secs[secs.length-1];if(!last)return;const list=allFolderCodes();const inF=list.filter(f=>folderIds(f).includes(a.id));
  last.insertAdjacentHTML("afterend",`<div class="sec" id="cardFold"><h4>Folders</h4><div class="chips">${list.map(f=>{const on=folderIds(f).includes(a.id);return `<button class="chip" aria-pressed="${on}" data-fold-toggle="${f}">${on?"✓ ":""}${folders[f].private?"🔒":"📁"} ${esc(folderTitle(f))}</button>`}).join("")}<button class="chip" data-fold-new="1">+ New folder with this place</button></div>
    ${inF.length?`<div class="cnotes">${inF.map(f=>{const ns=notesFor(f,a.id);return `<button type="button" class="cnote" data-note-f="${f}">${NOTE_SVG}<span><b>${esc(folderTitle(f))}</b>${ns.length?ns.map(n=>`<i>${esc(n.name)}: ${esc(n.text)}</i>`).join(""):"<i>Add a note</i>"}</span></button>`}).join("")}</div>`:""}</div>`)};
$("#card").addEventListener("click",e=>{const nb=e.target.closest("[data-note-f]");if(nb){e.stopPropagation();openNote(nb.dataset.noteF,selected);return}const t=e.target.closest("[data-fold-toggle],[data-fold-new]");if(!t)return;e.stopPropagation();
  if(t.dataset.foldToggle)toggleInFolder(t.dataset.foldToggle,selected);
  else{const f=createFolder("Our places",selected);openFolder=f;foldEdit=f;renderCard()}});

/* connect folders to the shared database (needs Claude sign-in; otherwise folders stay view-only/local) */
(async()=>{try{if(!window.claude||!window.claude.use)return;const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);if(!db)return;DB=DB||db;
  for(const f of myFolders)subFolder(f);if(openFolder)subFolder(openFolder);
  if(!user)return;const uid=await user.id();if(!uid)return;myFoldersRef=db.doc("data/users/"+uid+"/folders");let first=true;
  myFoldersRef.onSnapshot(s=>{const ids=s.exists?(s.data().ids||[]).filter(f=>typeof f==="string"&&/^[a-z0-9]{8,40}$/.test(f)):[];const before=myFolders.size;ids.forEach(f=>myFolders.add(f));
    if(first&&myFolders.size>ids.length)saveMyFolders();first=false;store("fahm.folders",[...myFolders]);for(const f of myFolders){if(!folders[f])folders[f]={name:"Shared folder",ids:[],live:false};subFolder(f)}renderList()},()=>{})}catch(e){}})();
setTimeout(readHash,0);
/* ---------- "For you" preferences (Kyra, Nov 12) ---------- */
const PREF_MUST=[["pool","Pool"],["bath","Own bathroom"],["win","Window in every bedroom"],["balc","Balcony"],["furn","Furnished"],["pets","Pet friendly"],["wd","Washer/dryer in unit"],["park","Cheap parking"]];
function renderPrefs(el){const p=PREFS||{};const editing=prefsEdit||(!PREFS&&!hearts.size);const t=trends();
  const trendHtml=t?`<div class="ptrend"><b>What you've been liking</b><span>${esc(trendText(t))}</span><i>From your saves and the places you open. This doesn't change your preferences.</i></div>`:"";
  if(!editing){el.innerHTML=`<div class="fbar"><div class="fhead"><b>Your preferences</b><span>${PREFS?esc(prefSummary()):"Not set"}</span></div>${PREFS?`<div class="fnote">${PREFS.strict?"Only showing places that match.":"Used as a guide. Places that don't match can still show up."}</div>`:""}<div class="frow"><button class="fb pri" id="pEdit">${PREFS?"Edit preferences":"Set preferences"}</button></div>${trendHtml}<div class="fnote">Picks are ranked by your preferences, the places you save, and what you've been looking at.</div></div>`;return}
  const chips=(arr,key,sel)=>arr.map(([k,l])=>`<button class="chip" aria-pressed="${sel.includes(k)}" data-p${key}="${esc(k)}">${esc(l)}</button>`).join("");
  const one=(arr,key,v)=>arr.map(([k,l])=>`<button class="chip" aria-pressed="${String(v)===String(k)}" data-p${key}="${esc(k)}">${esc(l)}</button>`).join("");
  const MUST=[...AMEN.map(([k,l])=>[k,l]),["balc","Balcony"]];
  el.innerHTML=`<div class="fbar pform"><div class="fhead"><b>Your preferences</b><span>Saved to your account</span></div>${prefFields(p)}
   <div class="frow"><button class="fb pri" id="pSave">Save and show my picks</button>${PREFS?'<button class="fb" id="pCancel">Cancel</button><button class="fb" id="pClear">Clear</button>':""}</div>
   ${trendHtml}</div>`;el.dataset.pbox="1";el._draft=draftOf(p)}
function draftOf(p){return{max:p.max||null,walk:p.walk||null,drive:p.drive||null,must:[...(p.must||[])],hoods:[...(p.hoods||[])],kinds:[...(p.kinds||[])],room:p.room||"own",plans:[...(p.plans||[])],balc:[...(p.balc||[])],minRating:p.minRating||0,strict:!!p.strict}}
function prefFields(p){const chips=(arr,key,sel)=>arr.map(([k,l])=>`<button type="button" class="chip" aria-pressed="${sel.includes(k)}" data-p${key}="${esc(k)}">${esc(l)}</button>`).join("");
  const one=(arr,key,v)=>arr.map(([k,l])=>`<button type="button" class="chip" aria-pressed="${String(v)===String(k)}" data-p${key}="${esc(k)}">${esc(l)}</button>`).join("");
  const MUST=[...AMEN.map(([k,l])=>[k,l]),["balc","Balcony"]];
  return `<label class="ptog"><input type="checkbox" id="pStrict" ${p.strict?"checked":""}><span><b>Only show places that match</b><i>Off: your preferences are a guide, and other good places can still show up.</i></span></label>
   <div class="fnote">Type</div><div class="chips">${chips([["apartment","Apartments"],["dorm","Dorms"],["house","Houses"]],"k",p.kinds||[])}</div>
   <div class="fnote">Bedroom</div><div class="chips">${one([["own","My own bedroom"],["shared","Shared bedroom"],["any","Either"]],"r",p.room||"own")}</div>
   <div class="fnote">Max price: <b id="pMaxO">${p.max?money(p.max):"Any"}</b></div><input type="range" id="pMax" min="600" max="2100" step="50" value="${p.max||2100}">
   <div class="fnote">Max walk to campus: <b id="pWalkO">${p.walk?p.walk+" min":"Any"}</b></div><input type="range" id="pWalk" min="5" max="60" step="5" value="${p.walk||60}">
   <div class="fnote">Max drive to campus: <b id="pDriveO">${p.drive?p.drive+" min":"Any"}</b></div><input type="range" id="pDrive" min="5" max="30" step="5" value="${p.drive||30}">
   <div class="fnote">Floor plans</div><div class="chips">${chips(PLAN_CHIPS,"pl",p.plans||[])}</div>
   <div class="fnote">Must have</div><div class="chips">${chips(MUST,"m",p.must||[])}</div>
   <div class="fnote">Balcony</div><div class="chips">${chips(BALC_FILTERS,"b",p.balc||[])}</div>
   <div class="fnote">Rating</div><div class="chips">${one([[0,"Any"],[3.5,"3.5+ ★"],[4,"4.0+ ★"],[4.5,"4.5+ ★"]],"rt",p.minRating||0)}</div>
   <div class="fnote">Neighborhoods</div><div class="chips">${chips(HOODS.map(h=>[h,h]),"h",p.hoods||[])}</div>`}
function prefSummary(){const p=PREFS;const L=(arr,ks)=>(ks||[]).map(k=>(arr.find(x=>String(x[0])===String(k))||[,k])[1]);return [...L([["apartment","Apartments"],["dorm","Dorms"],["house","Houses"]],p.kinds),p.room==="shared"?"shared bedroom":null,p.max?"up to "+money(p.max):null,p.walk?"≤"+p.walk+" min walk":null,p.drive?"≤"+p.drive+" min drive":null,...L(PLAN_CHIPS,p.plans),p.minRating?p.minRating+"+ ★":null,...L(BALC_FILTERS,p.balc).map(x=>x.toLowerCase()),...(p.must||[]).map(k=>((AMEN.find(x=>x[0]===k)||PREF_MUST.find(x=>x[0]===k)||[,k])[1]).toLowerCase()),(p.hoods||[]).length?p.hoods.join(", "):null].filter(Boolean).join(" · ")||"anything"}
function writePrefs(){if(prefsRef)prefsRef.set(Object.assign({},PREFS||{cleared:true},{meta:PMETA,updatedAt:Date.now()})).catch(()=>{})}
function savePrefs(p){PREFS=p;store("fahm.prefs",p);writePrefs();recCache=null;renderList();buildPins()}
document.addEventListener("input",e=>{const el=e.target.closest("[data-pbox]");if(!el||!el._draft)return;const o=id=>el.querySelector(id);if(e.target.id==="pMax"){const v=+e.target.value;el._draft.max=v>=2100?null:v;o("#pMaxO").textContent=v>=2100?"Any":money(v)}
  if(e.target.id==="pWalk"){const v=+e.target.value;el._draft.walk=v>=60?null:v;o("#pWalkO").textContent=v>=60?"Any":v+" min"}
  if(e.target.id==="pDrive"){const v=+e.target.value;el._draft.drive=v>=30?null:v;o("#pDriveO").textContent=v>=30?"Any":v+" min"}
  if(e.target.id==="pStrict")el._draft.strict=e.target.checked});
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
  if(t.id==="pEdit"&&t.closest("#fold")){prefsEdit=true;renderList();return}
  const el=t.closest("[data-pbox]");if(!el)return;
  if(el.id==="prefScreen"){if(t.id==="psSkip"){PMETA.welcomed=true;writePrefs();closePrefScreen();return}if(t.id==="psSave"){PMETA.welcomed=true;savePrefs(el._draft);closePrefScreen(true);return}}
  if(t.id==="pCancel"){prefsEdit=false;renderList();return}
  if(t.id==="pClear"){prefsEdit=false;savePrefs(null);return}
  if(t.id==="pSave"&&el._draft){prefsEdit=false;PMETA.welcomed=true;savePrefs(el._draft);$("#scroll").scrollTop=0;return}
  const d=el._draft;if(!d)return;
  if(t.dataset.pm){d.must=d.must.includes(t.dataset.pm)?d.must.filter(x=>x!==t.dataset.pm):[...d.must,t.dataset.pm];t.setAttribute("aria-pressed",d.must.includes(t.dataset.pm))}
  const tg=(f,v)=>{d[f]=d[f].includes(v)?d[f].filter(x=>x!==v):[...d[f],v];t.setAttribute("aria-pressed",d[f].includes(v))};
  if(t.dataset.pk)tg("kinds",t.dataset.pk);if(t.dataset.ppl)tg("plans",t.dataset.ppl);if(t.dataset.pb)tg("balc",t.dataset.pb);
  if(t.dataset.pr){d.room=t.dataset.pr;t.parentNode.querySelectorAll("[data-pr]").forEach(b=>b.setAttribute("aria-pressed",b===t))}
  if(t.dataset.prt!=null){d.minRating=+t.dataset.prt;t.parentNode.querySelectorAll("[data-prt]").forEach(b=>b.setAttribute("aria-pressed",b===t))}
  if(t.dataset.ph){d.hoods=d.hoods.includes(t.dataset.ph)?d.hoods.filter(x=>x!==t.dataset.ph):[...d.hoods,t.dataset.ph];t.setAttribute("aria-pressed",d.hoods.includes(t.dataset.ph))}});
(async()=>{try{if(!window.claude||!window.claude.use)return;const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);if(!db||!user)return;const uid=await user.id();if(!uid)return;
  prefsRef=db.doc("data/users/"+uid+"/prefs");let first=true;prefsRef.onSnapshot(sn=>{if(sn.exists){const d=sn.data()||{};const A_=x=>Array.isArray(x)?x:[];if(d.meta&&typeof d.meta==="object")PMETA={welcomed:!!d.meta.welcomed,views:d.meta.views&&typeof d.meta.views==="object"?d.meta.views:{}};
      if(d.cleared){PREFS=null}else{PREFS={max:d.max||null,walk:d.walk||null,drive:d.drive||null,must:A_(d.must),hoods:A_(d.hoods),kinds:A_(d.kinds),room:d.room||"own",plans:A_(d.plans),balc:A_(d.balc),minRating:d.minRating||0,strict:!!d.strict}}store("fahm.prefs",PREFS)}
    else if(first&&PREFS){prefsRef.set(Object.assign({},PREFS,{updatedAt:Date.now()})).catch(()=>{})}if(first)setTimeout(maybeWelcome,900);first=false;recCache=null;if(tab==="for")renderList()},()=>{})}catch(e){}})();
window.FAH_CTX=()=>{const t=trends();const sv=APTS.filter(a=>hearts.has(a.id));const vw=Object.entries(PMETA.views||{}).sort((x,y)=>y[1]-x[1]).map(([id])=>APTS.find(a=>a.id===id)).filter(a=>a&&!hearts.has(a.id)).slice(0,5);
  return{prefs:PREFS,trends:t,saved:sv.map(a=>a.name),viewed:vw.map(a=>a.name),hoods:HOODS,amen:AMEN.map(([k,l])=>[k,l]),money}};
function maybeWelcome(){if(PREFS||PMETA.welcomed||document.getElementById("welc"))return;const d=document.createElement("div");d.id="welc";
  d.innerHTML=`<div class="wbox" role="dialog" aria-label="Welcome"><b>You're in</b><p>Your account is approved. Next, tell us what you're looking for so <b>For you</b> can pick places that fit.</p><div class="wbtns"><button type="button" class="pri" id="wGo">Continue</button></div></div>`;
  document.body.appendChild(d);d.querySelector("#wGo").onclick=()=>{d.remove();openPrefScreen(true)}}
function openPrefScreen(first){let d=$("#prefScreen");if(!d){d=document.createElement("div");d.id="prefScreen";document.body.appendChild(d)}
  const p=PREFS||{};d.innerHTML=`<div class="pshead"><div><b>${first?"Set your preferences":"Preferences"}</b><span>${first?"You can change these any time in Settings.":"Used for your picks in For you."}</span></div>${first?'<button type="button" class="psskip" id="psSkip">Skip for now</button>':'<button type="button" class="psskip" id="psSkip" aria-label="Close">Cancel</button>'}</div>
    <div class="psbody fbar pform">${prefFields(p)}</div><div class="psfoot"><button type="button" class="fb pri" id="psSave">${first?"Save and see my picks":"Save"}</button></div>`;
  d.dataset.pbox="1";d._draft=draftOf(p);d.hidden=false;document.body.classList.add("noscroll")}
function closePrefScreen(saved){const d=$("#prefScreen");if(d)d.hidden=true;document.body.classList.remove("noscroll");if(saved){setTab("for");const P=$("#panel");if(P)P.classList.remove("min")}}
window.FAH_PREFS={open:()=>openPrefScreen(false)};


