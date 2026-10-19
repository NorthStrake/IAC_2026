export const ENDPOINT = 'http://localhost:8000/predict';
export const PORTS = [
  ['Newcastle','Australia'],['Port Hedland','Australia'],['Gladstone','Australia'],
  ['Samarinda','Indonesia'],['Banjarmasin','Indonesia'],['Tanjung Bara','Indonesia'],
  ['Richards Bay','South Africa'],['Saldanha Bay','South Africa'],['Maputo','Mozambique'],
  ['Beira','Mozambique'],['Norfolk','United States'],['New Orleans','United States'],['Mina Saqr','United Arab Emirates'],
  ['Paradip','India'],['Visakhapatnam','India'],['Gangavaram','India'],['Dhamra','India'],['Haldia','India'],['Gopalpur','India'],['Krishnapatnam','India'],
].map(([name = '',country = ''], i) => ({name,country,id:`PRT_${String(i+1).padStart(3,'0')}`}));
export const DEFAULTS = {
 origin_port_id:'PRT_001', destination_port_id:'PRT_014',route_id:'RTE_001',distance_nm:10000,current_month:'2026-10',
 type_of_cargo:'Coal',quantity_mt:60000,vessel_type:'Panamax',deadweight_tonnage_dwt:82406,speed_knots:14,
 idle_cost_per_day:1000,reposition_cost_per_distance:1.5,expected_arrival_hours:2400,
 bunker_fuel_price_usd_per_tonne:620,fuel_price_usd_per_tonne:682.18,brent_crude_price_usd_per_barrel:82.5,
 coal_price_usd_per_tonne:95,iron_ore_price_usd_per_tonne:88,wheat_price_usd_per_tonne:225,usd_inr_exchange_rate:84.5,
 shipping_market_index:1650,global_bulk_cargo_demand_index:1.05,global_shipping_capacity_index:0.98,seasonal_demand_index:1,
 origin_congestion_index:0.32,destination_congestion_index:0.45,synthetic_rate_reference:15,
};
export type Form = typeof DEFAULTS;
export type NumKey = {[K in keyof Form]: Form[K] extends number ? K : never}[keyof Form];
export const LIMITS = {distance_nm:[100,20000,100],quantity_mt:[1000,180000,1000],deadweight_tonnage_dwt:[20000,200000,1],speed_knots:[10,20,0.1],expected_arrival_hours:[24,30000,24],idle_cost_per_day:[500,10000,100],reposition_cost_per_distance:[0.5,5,0.05]} as const;
export const MARKET: [NumKey,string,number,number,number,string][] = [
 ['bunker_fuel_price_usd_per_tonne','Bunker fuel price',400,750,0.01,'USD / tonne'],
 ['fuel_price_usd_per_tonne','Vessel fuel price',450,750,0.01,'USD / tonne'],
 ['brent_crude_price_usd_per_barrel','Brent crude price',50,110,0.5,'USD / barrel'],
 ['coal_price_usd_per_tonne','Coal price',70,180,1,'USD / tonne'],
 ['iron_ore_price_usd_per_tonne','Iron ore price',70,150,1,'USD / tonne'],
 ['wheat_price_usd_per_tonne','Wheat price',150,350,1,'USD / tonne'],
 ['usd_inr_exchange_rate','USD / INR exchange rate',80,95,0.1,'INR'],
 ['shipping_market_index','Shipping market index',500,3000,10,'Index'],
 ['global_bulk_cargo_demand_index','Bulk demand index',0.5,1.5,0.01,'Index'],
 ['global_shipping_capacity_index','Shipping capacity index',0.5,1.5,0.01,'Index'],
 ['seasonal_demand_index','Seasonal demand index',0.5,1.5,0.01,'Index'],
 ['origin_congestion_index','Origin congestion',0.1,0.8,0.01,'Index'],
 ['destination_congestion_index','Destination congestion',0.1,0.8,0.01,'Index'],
];
export function payloadFor(form: Form) { return {...form,current_month:`${form.current_month}-01`,quantity_kg:form.quantity_mt*1000}; }
export function validateForm(form: Form): boolean {
 return Object.entries(LIMITS).every(([key,[min,max]]) => {const v=form[key as keyof typeof LIMITS]; return Number.isFinite(v) && v>=min && v<=max;}) && /^\d{4}-\d{2}$/.test(form.current_month) && PORTS.some(p=>p.id===form.origin_port_id) && PORTS.some(p=>p.id===form.destination_port_id) && form.route_id.trim().length>0;
}
