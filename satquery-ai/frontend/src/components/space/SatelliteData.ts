export interface SatelliteSpec {
  label: string;
  value: string;
}

export interface SatelliteInfo {
  id: "sentinel-2" | "sentinel-1" | "landsat-9" | "worldview-3";
  name: string;
  category: string;
  badge: string;
  tagline: string;
  shortDesc: string;
  detailDesc: string;
  macroDesc: string;
  specs: SatelliteSpec[];
  suggestedQueries: string[];
  presetMode: "single" | "optical_sar" | "before_after";
  accentColor: string;
  sensorType: "Optical Multispectral" | "C-Band SAR Radar" | "Thermal & Multispectral" | "Sub-Meter VHR Optical";
}

export const SATELLITES: SatelliteInfo[] = [
  {
    id: "sentinel-2",
    name: "SENTINEL-2",
    category: "MULTISPECTRAL CONSTELLATION",
    badge: "OPTICAL MSI",
    tagline: "THE MULTISPECTRAL OBSERVER",
    shortDesc:
      "Sentinel-2 delivers high-resolution optical imagery for global land monitoring. Equipped with the 13-band MultiSpectral Instrument (MSI), it provides operational monitoring of vegetation health, soil moisture, and coastal waters with a 5-day revisit rate.",
    detailDesc:
      "Operating at a sun-synchronous orbit of 786 km, Sentinel-2 samples 13 spectral bands across the visible, near-infrared, and short-wave infrared spectrums. Its twin satellites provide a 5-day revisit time at the equator, enabling real-time vegetation indices (NDVI, EVI), wildfire tracking, and urban growth mapping.",
    macroDesc:
      "Our AI orchestrator ingests Sentinel-2 Level-2A surface reflectance data, executing automated land-use classification, biophysical index calculation, and visual question answering grounded in peer-reviewed scientific spectral equations.",
    specs: [
      { label: "ORBIT", value: "786 km Sun-Synchronous" },
      { label: "PAYLOAD", value: "13-Band MultiSpectral (MSI)" },
      { label: "RESOLUTION", value: "10m, 20m, 60m Ground Sampling" },
      { label: "REVISIT", value: "5 Days (2A + 2B Constellation)" },
      { label: "SWATH", value: "290 km Field of View" },
      { label: "SPECTRAL", value: "VNIR + SWIR Bands" },
    ],
    suggestedQueries: [
      "Find water bodies and segment reservoir boundaries",
      "Calculate NDVI vegetation loss and crop stress",
      "Identify built-up urban infrastructure and road networks",
      "Highlight forest canopy changes and clearcuts",
    ],
    presetMode: "single",
    accentColor: "#48A9A6",
    sensorType: "Optical Multispectral",
  },
  {
    id: "sentinel-1",
    name: "SENTINEL-1",
    category: "SYNTHETIC APERTURE RADAR",
    badge: "C-BAND SAR",
    tagline: "THE ALL-WEATHER RADAR",
    shortDesc:
      "Sentinel-1 provides all-weather, day-and-night radar imaging through clouds and darkness. Operating a C-band SAR with a 12m antenna array, it penetrates dense cloud cover to detect floods, maritime vessels, ground subsidence, and structural deformation.",
    detailDesc:
      "Equipped with an advanced 12.3-meter C-band Synthetic Aperture Radar (5.405 GHz), Sentinel-1 observes the Earth's surface regardless of weather, atmospheric cloud occlusion, or solar illumination. Its dual-polarization (VV+VH) backscatter enables flood inundation mapping and soil moisture analysis.",
    macroDesc:
      "Coupled with optical data in our Optical + SAR fusion engine, Sentinel-1 radar backscatter penetrates monsoon cloud covers to uncover flooded terrain and maritime vessels that are invisible to optical sensors.",
    specs: [
      { label: "ORBIT", value: "693 km Sun-Synchronous" },
      { label: "PAYLOAD", value: "C-Band SAR (12.3m Antenna)" },
      { label: "RESOLUTION", value: "5m x 20m Interferometric Wide" },
      { label: "POLARIZATION", value: "Dual Pol (VV + VH / HH + HV)" },
      { label: "ALL-WEATHER", value: "100% Cloud & Night Penetration" },
      { label: "SWATH", value: "250 km (IW Mode)" },
    ],
    suggestedQueries: [
      "Filter cloud cover using SAR penetration",
      "Analyze optical and SAR jointly for flood extent",
      "Detect all-weather maritime vessels and oil slicks",
      "Measure surface roughness and urban double-bounce",
    ],
    presetMode: "optical_sar",
    accentColor: "#648DB5",
    sensorType: "C-Band SAR Radar",
  },
  {
    id: "landsat-9",
    name: "LANDSAT-9",
    category: "LAND SURFACE IMAGING",
    badge: "OLI-2 + TIRS-2",
    tagline: "THE THERMAL & SURFACE EYE",
    shortDesc:
      "Landsat-9 continues NASA and USGS's 50-year unbroken record of Earth observation. With the OLI-2 multispectral sensor and TIRS-2 thermal infrared instrument, it enables precision agriculture, bi-temporal change detection, and surface temperature modeling.",
    detailDesc:
      "Landsat-9 carries the Operational Land Imager 2 (OLI-2) capturing 14-bit radiometric precision across 9 spectral bands, paired with the Thermal Infrared Sensor 2 (TIRS-2) measuring land surface temperature in 2 thermal bands for drought and evapotranspiration assessment.",
    macroDesc:
      "The platform's deep historical calibration powers SatQuery's Bi-Temporal Change Detection engine, computing exact surface divergence, urbanization sprawl, and water body shrinkage across multi-year temporal pairs.",
    specs: [
      { label: "ORBIT", value: "705 km Sun-Synchronous" },
      { label: "PAYLOAD", value: "OLI-2 (9 Bands) + TIRS-2 (2 Thermal)" },
      { label: "RESOLUTION", value: "15m Pan / 30m Multi / 100m Thermal" },
      { label: "RADIOMETRY", value: "14-bit Precision Quantization" },
      { label: "TEMPORAL", value: "50-Year Calibrated Baseline" },
      { label: "REVISIT", value: "8 Days (with Landsat-8)" },
    ],
    suggestedQueries: [
      "What changed between the two dates?",
      "Has the built-up area increased significantly?",
      "Segment newly constructed roads and infrastructure",
      "Estimate surface vegetation loss percentage",
    ],
    presetMode: "before_after",
    accentColor: "#6BA88B",
    sensorType: "Thermal & Multispectral",
  },
  {
    id: "worldview-3",
    name: "WORLDVIEW-3",
    category: "COMMERCIAL HIGH-RESOLUTION",
    badge: "0.31m VHR",
    tagline: "THE SUB-METER PRECISION EYE",
    shortDesc:
      "WorldView-3 delivers sub-meter commercial remote sensing at 31cm panchromatic resolution. Operating across 8 VNIR, 8 SWIR, and 12 CAVIS bands, it uncovers fine-grained infrastructure details, vehicle footprints, and atmospheric aerosol penetration.",
    detailDesc:
      "Featuring a 1.1-meter aperture Cassegrain optical telescope, WorldView-3 provides the highest commercial spatial resolution from space (31cm panchromatic, 1.24m multispectral, and 3.7m shortwave infrared), unlocking individual building, vessel, and infrastructure grounding.",
    macroDesc:
      "Integrated with SatQuery's Visual Question Answering and Text-Guided Grounding specialist models, WorldView-3 imagery allows users to identify specific industrial assets, aircraft, and high-density urban structures with pixel-level bounding masks.",
    specs: [
      { label: "ORBIT", value: "617 km Sun-Synchronous" },
      { label: "PAYLOAD", value: "1.1m Optical Telescope + SWIR + CAVIS" },
      { label: "RESOLUTION", value: "31cm Pan / 1.24m Multi / 3.7m SWIR" },
      { label: "BANDS", value: "29 Total Spectral Channels" },
      { label: "SLEW RATE", value: "Precision Control Moment Gyros" },
      { label: "SWATH", value: "13.1 km at Nadir" },
    ],
    suggestedQueries: [
      "Are there industrial containers or vehicles in this scene?",
      "Locate and count shipping vessels at port",
      "Ground and highlight aircraft on the runway",
      "Inspect roof structural damage after severe weather",
    ],
    presetMode: "single",
    accentColor: "#D3A35C",
    sensorType: "Sub-Meter VHR Optical",
  },
];

