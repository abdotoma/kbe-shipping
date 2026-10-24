// Product dimensions and weights extracted from the supplied GoodWe datasheets.
// Dimensions are equipment dimensions in millimetres (W x H x D), not carton dimensions.
// Values marked < or <= in the source are stored as conservative upper-bound numbers.
const product = (sku, name, category, width, height, depth, weight, extra = {}) => ({
  id: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  sku,
  name,
  category,
  width,
  height,
  depth,
  weight,
  ...extra,
})

export const products = [
  product('CHSM72N(DG)/F-BH-590W', 'ASTRO N5 Bifacial PV Panel 590W', 'PV Panels', 1134, 2278, 30, 32.1, { packSize: 36, packWeight: 1207, palletLength: 2278, palletWidth: 1134, palletHeight: 1230, unitsPer40HC: 720 }),
  product('CHSM66RN(DG)/F-BH-610W', 'ASTRO N7 Bifacial PV Panel 610W', 'PV Panels', 1134, 2382, 30, 31.65, { packSize: 36, packWeight: 1190, palletLength: 2382, palletWidth: 1134, palletHeight: 1230, unitsPer40HC: 720 }),
  product('CHSM66RN(DG)/F-BH-620W', 'ASTRO N7 Bifacial PV Panel 620W', 'PV Panels', 1134, 2382, 30, 31.65, { packSize: 36, packWeight: 1190, palletLength: 2382, palletWidth: 1134, palletHeight: 1230, unitsPer40HC: 720 }),
  product('CHSM66RN(DG)/F-BH-640W', 'ASTRO N7 Pro Bifacial PV Panel 640W', 'PV Panels', 1134, 2382, 30, 31.65, { packSize: 36, packWeight: 1190, palletLength: 2382, palletWidth: 1134, palletHeight: 1230, unitsPer40HC: 720 }),
  product('CHSM66N(DG)/F-BH-710W', 'ASTRO N8 Bifacial PV Panel 710W', 'PV Panels', 1303, 2384, 33, 38, { packSize: 33, packWeight: 1295, palletLength: 2384, palletWidth: 1303, palletHeight: 1239, unitsPer40HC: 594 }),

  product('GW61.4-BAT-AC-G10', 'BAT Outdoor Battery 61.4kWh', 'High-Voltage Batteries', 1055, 2000, 1055, 950, { weightNote: 'Less than 950 kg' }),
  product('GW102.4-BAT-AC-G10', 'BAT Outdoor Battery 102.4kWh', 'High-Voltage Batteries', 1055, 2000, 1055, 1310, { weightNote: 'Less than 1310 kg' }),
  product('GW112.6-BAT-AC-G10', 'BAT Outdoor Battery 112.6kWh', 'High-Voltage Batteries', 1055, 2000, 1055, 1400, { weightNote: 'Less than 1400 kg' }),
  product('GW25.6-BAT-I-G10', 'BAT Indoor Battery 25.6kWh', 'High-Voltage Batteries', 481, 925, 552, 248),
  product('GW30.7-BAT-I-G10', 'BAT Indoor Battery 30.7kWh', 'High-Voltage Batteries', 481, 1063, 552, 293),
  product('GW35.8-BAT-I-G10', 'BAT Indoor Battery 35.8kWh', 'High-Voltage Batteries', 481, 1201, 552, 338),
  product('GW40.9-BAT-I-G10', 'BAT Indoor Battery 40.9kWh', 'High-Voltage Batteries', 481, 1339, 552, 383),
  product('GW46.0-BAT-I-G10', 'BAT Indoor Battery 46.0kWh', 'High-Voltage Batteries', 481, 1477, 552, 428),
  product('GW51.2-BAT-I-G10', 'BAT Indoor Battery 51.2kWh', 'High-Voltage Batteries', 481, 1615, 552, 472),
  product('GW56.3-BAT-I-G10', 'BAT Indoor Battery 56.3kWh', 'High-Voltage Batteries', 481, 1753, 552, 517),

  product('GW16.1-BAT-LV-G10', 'Lynx A G4 Battery 16.1kWh', 'Low-Voltage Batteries', 470, 895, 245, 122, { weightNote: 'Up to 122 kg', dimensionNote: 'Maximum dimensions, base excluded' }),
  product('LX A5.0-10', 'Lynx A Battery 5.0kWh', 'Low-Voltage Batteries', 483, 133, 452, 40, { dimensionNote: 'Hanger included' }),
  product('GW5.0-BAT-LVI-G10', 'Lynx A G4 Battery 5.0kWh', 'Low-Voltage Batteries', 450, 450, 233, 45, { dimensionNote: 'Maximum dimensions' }),
  product('GW10.0-BAT-LV-G10', 'Lynx A G4 Battery 10.0kWh', 'Low-Voltage Batteries', 470, 755, 266, 85, { dimensionNote: 'Maximum dimensions' }),

  product('GW25K-ET-10', 'ET Hybrid Inverter 25kW', 'Hybrid Inverters - High Voltage', 520, 660, 260, 62),
  product('GW30K-ET-10', 'ET Hybrid Inverter 30kW', 'Hybrid Inverters - High Voltage', 520, 660, 260, 62),
  product('GW40K-ET-10', 'ET Hybrid Inverter 40kW', 'Hybrid Inverters - High Voltage', 520, 660, 260, 62),
  product('GW50K-ET-10', 'ET Hybrid Inverter 50kW', 'Hybrid Inverters - High Voltage', 520, 660, 260, 65),
  product('GW75K-ET-G10', 'ET Hybrid Inverter 75kW', 'Hybrid Inverters - High Voltage', 995, 758, 358, 97),
  product('GW80K-ET-G10', 'ET Hybrid Inverter 80kW', 'Hybrid Inverters - High Voltage', 995, 758, 358, 97),
  product('GW99.99K-ET-G10', 'ET Hybrid Inverter 99.99kW', 'Hybrid Inverters - High Voltage', 995, 758, 358, 97),
  product('GW100K-ET-G10', 'ET Hybrid Inverter 100kW', 'Hybrid Inverters - High Voltage', 995, 758, 358, 97),

  product('GW3000-ES-C10', 'ES Uniq Hybrid Inverter 3kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 415, 204, 14.5),
  product('GW3600-ES-C10', 'ES Uniq Hybrid Inverter 3.6kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 415, 204, 15.5),
  product('GW5000-ES-C10', 'ES Uniq Hybrid Inverter 5kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 415, 204, 15.5),
  product('GW6000-ES-C10', 'ES Uniq Hybrid Inverter 6kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 415, 204, 15.5),
  product('GW8000-ES-C10', 'ES Uniq Hybrid Inverter 8kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 444.5, 226, 27),
  product('GW10K-ES-C10', 'ES Uniq Hybrid Inverter 10kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 444.5, 226, 29),
  product('GW12K-ES-C10', 'ES Uniq Hybrid Inverter 12kW Single Phase', 'Hybrid Inverters - LV Single Phase', 560, 444.5, 226, 29),

  product('GW5K-ET-L-G10', 'ET LV Hybrid Inverter 5kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 42.2),
  product('GW6K-ET-L-G10', 'ET LV Hybrid Inverter 6kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 42.2),
  product('GW8K-ET-L-G10', 'ET LV Hybrid Inverter 8kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 42.2),
  product('GW10K-ET-L-G10', 'ET LV Hybrid Inverter 10kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 45.3),
  product('GW12K-ET-L-G10', 'ET LV Hybrid Inverter 12kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 45.3),
  product('GW15K-ET-L-G10', 'ET LV Hybrid Inverter 15kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 49.7),
  product('GW20K-ET-L-G10', 'ET LV Hybrid Inverter 20kW Three Phase', 'Hybrid Inverters - LV Three Phase', 756, 551, 258, 51.2),

  product('GW50KS-MT', 'SMT On-Grid Inverter 50kW', 'On-Grid Inverters', 520, 660, 220, 55),
  product('GW60KS-MT', 'SMT On-Grid Inverter 60kW', 'On-Grid Inverters', 520, 660, 220, 55),
  product('GW75K-GT-LV-G10', 'GT On-Grid Inverter 75kW LV', 'On-Grid Inverters', 930, 650, 300, 88),
  product('GW100K-GT', 'GT On-Grid Inverter 100kW', 'On-Grid Inverters', 930, 650, 300, 85),
  product('GW110K-GT', 'GT On-Grid Inverter 110kW', 'On-Grid Inverters', 930, 650, 300, 88),
  product('GW125K-GT', 'GT On-Grid Inverter 125kW', 'On-Grid Inverters', 930, 650, 300, 88),
  product('GW150K-GT-G10', 'GT On-Grid Inverter 150kW', 'On-Grid Inverters', 995, 758, 358, 99, { weightNote: 'Up to 99 kg' }),

  product('STS200-80-10', 'STS Static Transfer Switch Box', 'STS Transfer Switches', 510, 425, 156, 16.5),
  product('GW125K-STS-G10', 'STS Static Transfer Switch 125kW', 'STS Transfer Switches', 680, 620, 165, 21),
  product('GW500K-STS-PCS-G10', 'STS Static Transfer Switch 500kW', 'STS Transfer Switches', 1100, 2010, 1000, 750, { weightNote: 'Less than 750 kg' }),

  product('GW3K-EO-G20', 'EO G2 Off-Grid Inverter 3kW', 'Off-Grid Inverters', 337, 456, 201, 13, { weightNote: 'Less than 13 kg' }),
  product('GW3.6K-EO-G20', 'EO G2 Off-Grid Inverter 3.6kW', 'Off-Grid Inverters', 337, 456, 201, 13, { weightNote: 'Less than 13 kg' }),
  product('GW5K-EO-G20', 'EO G2 Off-Grid Inverter 5kW', 'Off-Grid Inverters', 337, 456, 201, 13, { weightNote: 'Less than 13 kg' }),
  product('GW6K-EO-G20', 'EO G2 Off-Grid Inverter 6kW', 'Off-Grid Inverters', 337, 456, 201, 13, { weightNote: 'Less than 13 kg' }),
]

export const categories = [...new Set(products.map((item) => item.category))]
