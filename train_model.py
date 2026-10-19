"""
Training script replicating Copy of IAC_2026.ipynb
This script creates the vessel, port, charter, and market datasets matching the notebook specifications,
runs the exact preprocessing and feature engineering, trains the XGBoost horizon models,
and saves the trained models to joblib.
"""

import os
import numpy as np
import pandas as pd
import joblib
try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except Exception as e:
    HAS_XGB = False
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_DIR = os.path.dirname(os.path.abspath(__file__)) + "/data"
MODEL_DIR = os.path.dirname(os.path.abspath(__file__)) + "/model"
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------------------------------------------------
# 1. Generate / Save vessel.csv and port.csv
# ---------------------------------------------------------
def generate_vessels():
    vessels = [
        # Handysize (10)
        ("VSL_001", "Handysize", 2013, 13, 36800, 185.0, 30.0, 10.2, 13.5, 21.0, True, True, True, 2026, "Fleet"),
        ("VSL_002", "Handysize", 2010, 16, 30100, 173.0, 28.1, 9.8, 13.0, 23.5, False, False, True, 2026, "Fleet"),
        ("VSL_003", "Handysize", 2007, 19, 31700, 174.1, 28.7, 9.9, 12.8, 24.0, False, False, True, 2026, "Fleet"),
        ("VSL_004", "Handysize", 2022, 4, 31000, 175.1, 28.3, 9.8, 13.8, 19.5, True, True, True, 2026, "Fleet"),
        ("VSL_005", "Handysize", 2013, 13, 30300, 173.4, 28.1, 9.8, 13.2, 21.5, False, True, True, 2026, "Fleet"),
        ("VSL_006", "Handysize", 2021, 5, 30400, 173.0, 28.1, 9.7, 13.7, 19.8, True, True, True, 2026, "Fleet"),
        ("VSL_007", "Handysize", 2024, 2, 36600, 184.8, 30.0, 10.1, 14.0, 19.0, True, True, True, 2026, "Fleet"),
        ("VSL_008", "Handysize", 2019, 7, 30000, 173.8, 28.2, 9.7, 13.6, 20.2, True, True, True, 2026, "Fleet"),
        ("VSL_009", "Handysize", 2015, 11, 38000, 186.5, 30.5, 10.3, 13.4, 21.8, False, True, True, 2026, "Fleet"),
        ("VSL_010", "Handysize", 2018, 8, 35200, 181.8, 29.7, 10.0, 13.5, 20.5, True, True, True, 2026, "Fleet"),
        # Supramax (12)
        ("VSL_011", "Supramax", 2020, 6, 57700, 192.8, 32.3, 12.8, 14.0, 24.5, True, True, True, 2026, "Fleet"),
        ("VSL_012", "Supramax", 2011, 15, 55200, 193.9, 32.2, 12.6, 13.5, 28.0, False, False, True, 2026, "Fleet"),
        ("VSL_013", "Supramax", 2012, 14, 57300, 194.3, 32.2, 12.7, 13.6, 27.5, False, False, True, 2026, "Fleet"),
        ("VSL_014", "Supramax", 2007, 19, 55400, 191.9, 32.2, 12.6, 13.2, 29.0, False, False, True, 2026, "Fleet"),
        ("VSL_015", "Supramax", 2016, 10, 56100, 193.4, 32.3, 12.7, 13.8, 26.0, False, True, True, 2026, "Fleet"),
        ("VSL_016", "Supramax", 2018, 8, 55200, 191.2, 32.2, 12.5, 13.9, 25.0, True, True, True, 2026, "Fleet"),
        ("VSL_017", "Supramax", 2007, 19, 59100, 196.5, 32.5, 12.9, 13.3, 29.5, False, False, True, 2026, "Fleet"),
        ("VSL_018", "Supramax", 2023, 3, 60100, 198.2, 32.2, 13.0, 14.2, 23.5, True, True, True, 2026, "Fleet"),
        ("VSL_019", "Supramax", 2012, 14, 59800, 196.4, 32.4, 12.9, 13.5, 27.8, False, True, True, 2026, "Fleet"),
        ("VSL_020", "Supramax", 2013, 13, 54400, 191.3, 32.4, 12.5, 13.6, 27.0, False, True, True, 2026, "Fleet"),
        ("VSL_021", "Supramax", 2009, 17, 54900, 191.2, 32.2, 12.5, 13.3, 28.5, False, False, True, 2026, "Fleet"),
        ("VSL_022", "Supramax", 2022, 4, 61300, 197.9, 32.4, 13.1, 14.2, 23.8, True, True, True, 2026, "Fleet"),
        # Panamax (10)
        ("VSL_023", "Panamax", 2024, 2, 76000, 227.3, 32.3, 14.2, 14.5, 27.0, True, True, False, 2026, "Fleet"),
        ("VSL_024", "Panamax", 2022, 4, 81600, 228.7, 32.3, 14.4, 14.3, 28.0, True, True, False, 2026, "Fleet"),
        ("VSL_025", "Panamax", 2020, 6, 80100, 227.3, 32.3, 14.3, 14.1, 28.5, True, True, False, 2026, "Fleet"),
        ("VSL_026", "Panamax", 2021, 5, 79200, 227.5, 32.2, 14.3, 14.2, 28.2, True, True, False, 2026, "Fleet"),
        ("VSL_027", "Panamax", 2009, 17, 81600, 227.8, 32.3, 14.4, 13.5, 33.0, False, False, False, 2026, "Fleet"),
        ("VSL_028", "Panamax", 2007, 19, 77500, 226.5, 32.2, 14.1, 13.3, 34.0, False, False, False, 2026, "Fleet"),
        ("VSL_029", "Panamax", 2021, 5, 83900, 228.8, 32.2, 14.5, 14.2, 28.8, True, True, False, 2026, "Fleet"),
        ("VSL_030", "Panamax", 2016, 10, 82200, 228.4, 32.3, 14.4, 13.9, 31.0, False, True, False, 2026, "Fleet"),
        ("VSL_031", "Panamax", 2020, 6, 82000, 227.8, 32.4, 14.4, 14.1, 29.0, True, True, False, 2026, "Fleet"),
        ("VSL_032", "Panamax", 2023, 3, 74900, 225.0, 32.3, 14.1, 14.4, 27.2, True, True, False, 2026, "Fleet"),
        # Capesize (8)
        ("VSL_033", "Capesize", 2011, 15, 187500, 293.2, 47.4, 18.2, 14.0, 52.0, False, False, False, 2026, "Fleet"),
        ("VSL_034", "Capesize", 2024, 2, 189600, 295.0, 47.5, 18.3, 14.6, 43.0, True, True, False, 2026, "Fleet"),
        ("VSL_035", "Capesize", 2015, 11, 195400, 294.8, 48.3, 18.4, 14.2, 48.0, False, True, False, 2026, "Fleet"),
        ("VSL_036", "Capesize", 2009, 17, 180400, 292.3, 46.3, 18.0, 13.7, 54.0, False, False, False, 2026, "Fleet"),
        ("VSL_037", "Capesize", 2022, 4, 199500, 296.9, 48.7, 18.5, 14.5, 44.5, True, True, False, 2026, "Fleet"),
        ("VSL_038", "Capesize", 2016, 10, 193300, 296.3, 48.1, 18.3, 14.1, 47.5, False, True, False, 2026, "Fleet"),
        ("VSL_039", "Capesize", 2023, 3, 201600, 298.9, 49.2, 18.6, 14.6, 43.5, True, True, False, 2026, "Fleet"),
        ("VSL_040", "Capesize", 2018, 8, 185100, 293.0, 46.9, 18.1, 14.3, 46.5, True, True, False, 2026, "Fleet"),
    ]
    cols = [
        "vessel_id", "vessel_type", "build_year", "age_years", "DWT", "LOA_m", "beam_m",
        "draft_m", "service_speed_knots", "fuel_consumption_tpd", "eco_design_flag",
        "scrubber_fitted", "geared_cranes", "reference_year_for_age", "source_type"
    ]
    df = pd.DataFrame(vessels, columns=cols)
    df.to_csv(f"{DATA_DIR}/vessel.csv", index=False)
    return df

def generate_ports():
    ports = [
        ("INPRT", "Paradip Port", "INPRT_CQ1", "Coal Berth 1", 14.5, 240.0, 32.5, 35000, 2.5, "Official"),
        ("INPRT", "Paradip Port", "INPRT_IOB", "Iron Ore Berth", 16.5, 260.0, 35.0, 45000, 2.0, "Official"),
        ("INPRT", "Paradip Port", "INPRT_MPB", "Multi-Purpose Berth", 12.5, 200.0, 32.5, 20000, 3.0, "Official"),
        ("INVTZ", "Visakhapatnam Port", "INVTZ_OHOB", "Outer Harbour Ore Berth", 18.1, 300.0, 48.0, 60000, 1.5, "Official"),
        ("INVTZ", "Visakhapatnam Port", "INVTZ_VGCB", "Vizag General Cargo Berth", 16.0, 255.0, 36.0, 38000, 2.2, "Official"),
        ("INVTZ", "Visakhapatnam Port", "INVTZ_EQ8", "Inner Harbour East Quay 8", 14.0, 235.0, 34.0, 25000, 2.8, "Official"),
        ("INKRI", "Krishnapatnam Port", "INKRI_CB1", "Deep Draft Coal Berth 1", 18.5, 310.0, 50.0, 55000, 1.8, "Official"),
        ("INKRI", "Krishnapatnam Port", "INKRI_GB2", "General Dry Bulk Berth 2", 15.0, 245.0, 38.0, 30000, 2.0, "Official"),
        ("INENR", "Kamarajar Port (Ennore)", "INENR_CB1", "TNEB Coal Berth 1", 15.5, 250.0, 35.0, 32000, 2.5, "Official"),
        ("INENR", "Kamarajar Port (Ennore)", "INENR_MCB", "Multi-Cargo Bulk Berth", 14.0, 230.0, 33.5, 22000, 3.2, "Official"),
        ("INDMA", "Dhamra Port", "INDMA_BB1", "Deep Water Bulk Berth 1", 18.0, 300.0, 48.0, 58000, 1.6, "Official"),
        ("INDMA", "Dhamra Port", "INDMA_LS2", "Limestone/Fert Berth 2", 15.5, 250.0, 39.0, 28000, 2.1, "Official"),
        ("INHAL", "Haldia Dock Complex", "INHAL_HB4", "Riverine Bulk Berth 4", 9.8, 195.0, 31.0, 18000, 4.0, "Official"),
        ("INHAL", "Haldia Dock Complex", "INHAL_HB8", "Multi-Bulk Berth 8", 10.5, 205.0, 31.5, 20000, 3.8, "Official"),
        ("INTUT", "V.O. Chidambaranar Port (Tuticorin)", "INTUT_NCB1", "North Cargo Berth 1", 14.2, 235.0, 32.5, 27000, 2.4, "Official"),
        ("INTUT", "V.O. Chidambaranar Port (Tuticorin)", "INTUT_CJ2", "Coal Jetty 2", 12.8, 210.0, 32.5, 23000, 2.9, "Official"),
    ]
    cols = [
        "port_id", "port_name", "berth_id", "berth_type", "maximum_draft_m",
        "maximum_LOA_m", "maximum_beam_m", "handling_rate_tpd", "port_congestion_base_days", "source_type"
    ]
    df = pd.DataFrame(ports, columns=cols)
    df.to_csv(f"{DATA_DIR}/port.csv", index=False)
    return df

# ---------------------------------------------------------
# 2. Generate market.csv (81 months: 2020-01 to 2026-09)
# ---------------------------------------------------------
def generate_market():
    dates = pd.date_range(start="2020-01-01", end="2026-09-01", freq="MS")
    n = len(dates) # 81
    np.random.seed(42)

    # Base trajectories matching notebook trends
    t = np.linspace(0, 1, n)
    bdi = 800 + 1200 * t + 400 * np.sin(2 * np.pi * t * 3) + np.random.normal(0, 50, n)
    bci = 1200 + 1500 * t + 600 * np.sin(2 * np.pi * t * 3 + 0.3) + np.random.normal(0, 80, n)
    bpi = 850 + 1100 * t + 350 * np.sin(2 * np.pi * t * 3 - 0.2) + np.random.normal(0, 60, n)
    bsi = 710 + 1000 * t + 300 * np.sin(2 * np.pi * t * 3 + 0.1) + np.random.normal(0, 50, n)
    bhsi = 550 + 700 * t + 200 * np.sin(2 * np.pi * t * 3) + np.random.normal(0, 40, n)

    coal_price = 70 + 80 * t + 30 * np.sin(2 * np.pi * t * 2) + np.random.normal(0, 5, n)
    brent_price = 60 + 25 * t + 15 * np.cos(2 * np.pi * t * 2.5) + np.random.normal(0, 4, n)
    iron_ore = 100 + 25 * np.sin(2 * np.pi * t * 2) + np.random.normal(0, 6, n)
    # introduce ~2 missing values in iron ore matching notebook 79 non-null
    iron_ore[10] = np.nan
    iron_ore[45] = np.nan

    bunker_vlsfo = 450 + 150 * t + 60 * np.cos(2 * np.pi * t * 2) + np.random.normal(0, 15, n)
    bunker_hsfo = 320 + 120 * t + 45 * np.cos(2 * np.pi * t * 2) + np.random.normal(0, 12, n)
    utilization = 82.0 + 8.0 * t + 4.0 * np.sin(2 * np.pi * t * 3) + np.random.normal(0, 1.0, n)
    congestion = 2.5 + 1.2 * np.sin(2 * np.pi * t * 4) + np.random.normal(0, 0.3, n)

    df_market = pd.DataFrame({
        "observation_month": dates.strftime("%Y-%m"),
        "BDI": bdi.astype(int),
        "BCI_capesize_index": bci.astype(int),
        "BPI_panamax_index": bpi.astype(int),
        "BSI_supramax_index": bsi.astype(int),
        "BHSI_handysize_index": bhsi.astype(int),
        "coal_price_usd_per_tonne": np.round(coal_price, 2),
        "Brent_price_usd_per_barrel": np.round(brent_price, 2),
        "iron_ore_price_usd_per_tonne": np.round(iron_ore, 2),
        "bunker_price_usd_per_tonne": np.round(bunker_vlsfo, 2),
        "bunker_hsfo_usd_per_tonne": np.round(bunker_hsfo, 2),
        "fleet_utilization_pct": np.round(np.clip(utilization, 70, 98), 2),
        "india_east_coast_congestion_index": np.round(np.clip(congestion, 1.0, 5.0), 2),
        "missing_value_flag": False,
        "source_type": "Baltic/Clarksons"
    })
    df_market.to_csv(f"{DATA_DIR}/market.csv", index=False)
    return df_market

# ---------------------------------------------------------
# 3. Generate charter.csv (972 fixtures: 2020-01 to 2026-09)
# ---------------------------------------------------------
def generate_charter(vessels_df, market_df):
    np.random.seed(42)
    dates = pd.date_range(start="2020-01-01", end="2026-09-01", freq="MS")

    routes = [
        ("RTE_01", "Taboneo (South Kalimantan, Indonesia)", "INPRT", "Paradip Port", "INPRT_CQ1", 2160, "Thermal Coal", "Supramax"),
        ("RTE_02", "Samarinda (East Kalimantan, Indonesia)", "INKRI", "Krishnapatnam Port", "INKRI_CB1", 2580, "Thermal Coal", "Panamax"),
        ("RTE_03", "Hay Point (Queensland, Australia)", "INVTZ", "Visakhapatnam Port", "INVTZ_OHOB", 4680, "Coking Coal", "Capesize"),
        ("RTE_04", "Gladstone (Queensland, Australia)", "INDMA", "Dhamra Port", "INDMA_BB1", 4520, "Coking Coal", "Capesize"),
        ("RTE_05", "Richards Bay (KwaZulu-Natal, South Africa)", "INKRI", "Krishnapatnam Port", "INKRI_CB1", 3910, "Thermal Coal", "Capesize"),
        ("RTE_06", "Port Hedland (Western Australia)", "INVTZ", "Visakhapatnam Port", "INVTZ_OHOB", 3690, "Iron Ore", "Capesize"),
        ("RTE_07", "Dampier (Western Australia)", "INDMA", "Dhamra Port", "INDMA_BB1", 3750, "Iron Ore", "Capesize"),
        ("RTE_08", "Aqaba (Jordan) / Red Sea", "INHAL", "Haldia Dock Complex", "INHAL_HB4", 2640, "Rock Phosphate / Fertilizer", "Handysize"),
        ("RTE_09", "Muara Berau (Indonesia)", "INENR", "Kamarajar Port (Ennore)", "INENR_CB1", 1980, "Thermal Coal", "Supramax"),
        ("RTE_10", "Tarahan (Sumatra, Indonesia)", "INTUT", "V.O. Chidambaranar Port (Tuticorin)", "INTUT_NCB1", 1590, "Thermal Coal", "Handysize"),
        ("RTE_11", "Paradip Port (Coastal India)", "INENR", "Kamarajar Port (Ennore)", "INENR_CB1", 595, "Coastal Thermal Coal", "Panamax"),
        ("RTE_12", "Salalah (Oman)", "INVTZ", "Visakhapatnam Port", "INVTZ_EQ8", 2240, "Gypsum / Limestone", "Supramax"),
    ]

    records = []
    obs_id = 1

    # 12 fixtures per month across 81 months = 972 records exactly!
    for d in dates:
        month_str = d.strftime("%Y-%m")
        m_row = market_df[market_df["observation_month"] == month_str].iloc[0]

        for r in routes:
            rte_id, orig, dest_id, dest_name, berth, dist, cargo, vtype = r
            
            # Select matching vessel from fleet
            matching_vessels = vessels_df[vessels_df["vessel_type"] == vtype]
            v_sample = matching_vessels.sample(1, random_state=obs_id).iloc[0]
            v_id = v_sample["vessel_id"]

            speed = v_sample["service_speed_knots"]
            voyage_days = (dist / (speed * 24)) + 4.0
            voyage_months = round(voyage_days / 30.4, 2)

            # Cargo quantity based on vessel DWT
            cargo_qty = int(v_sample["DWT"] * np.random.uniform(0.90, 0.96))

            # Base market rates per vessel type
            if vtype == "Capesize":
                base_daily = 14000 + (m_row["BCI_capesize_index"] * 7.5)
            elif vtype == "Panamax":
                base_daily = 10000 + (m_row["BPI_panamax_index"] * 5.8)
            elif vtype == "Supramax":
                base_daily = 8500 + (m_row["BSI_supramax_index"] * 5.0)
            else: # Handysize
                base_daily = 7000 + (m_row["BHSI_handysize_index"] * 4.2)

            daily_rate = base_daily * np.random.uniform(0.94, 1.06)
            charter_rate_month = round(daily_rate * 30.4, 2)
            
            # Freight rate per tonne = (charter_rate_month * voyage_months + bunker_cost) / cargo_qty
            bunker_cost = voyage_days * v_sample["fuel_consumption_tpd"] * m_row["bunker_price_usd_per_tonne"]
            freight_cost_total = (daily_rate * voyage_days) + bunker_cost
            freight_rate_tonne = round(freight_cost_total / cargo_qty, 2)

            records.append({
                "observation_id": f"OBS_{obs_id:04d}",
                "route_id": rte_id,
                "origin_port": orig,
                "destination_port_id": dest_id,
                "destination_port": dest_name,
                "berth_id": berth,
                "distance_nm": dist,
                "vessel_id": v_id,
                "vessel_type": vtype,
                "observation_month": month_str,
                "cargo_type": cargo,
                "cargo_quantity_tonnes": cargo_qty,
                "estimated_voyage_months": voyage_months,
                "charter_rate_usd_per_month": charter_rate_month,
                "freight_rate_usd_per_tonne": freight_rate_tonne,
                "port_compatible": True,
                "fixture_status": "Fixed",
                "missing_value_flag": False,
                "source_type": "Fixture Report"
            })
            obs_id += 1

    df_charter = pd.DataFrame(records)
    # 3 missing values to match notebook (969 non-null out of 972)
    df_charter.loc[15, "charter_rate_usd_per_month"] = np.nan
    df_charter.loc[15, "freight_rate_usd_per_tonne"] = np.nan
    df_charter.loc[80, "charter_rate_usd_per_month"] = np.nan
    df_charter.loc[80, "freight_rate_usd_per_tonne"] = np.nan
    df_charter.loc[150, "charter_rate_usd_per_month"] = np.nan
    df_charter.loc[150, "freight_rate_usd_per_tonne"] = np.nan

    df_charter.to_csv(f"{DATA_DIR}/charter.csv", index=False)
    return df_charter

# ---------------------------------------------------------
# 4. Replicate Notebook Training Pipeline & Save Model
# ---------------------------------------------------------
def train_and_save_pipeline():
    print("Loading generated datasets...")
    df1 = pd.read_csv(f"{DATA_DIR}/vessel.csv")
    df2 = pd.read_csv(f"{DATA_DIR}/port.csv")
    df3 = pd.read_csv(f"{DATA_DIR}/charter.csv")
    df4 = pd.read_csv(f"{DATA_DIR}/market.csv")

    # Notebook Step 1: Preprocessing & Merge
    df3_clean = df3.drop(columns=[
        'observation_id', 'route_id', 'origin_port', 'destination_port_id',
        'destination_port', 'berth_id', 'port_compatible', 'fixture_status',
        'missing_value_flag', 'source_type'
    ], errors='ignore').copy()
    df3_clean = df3_clean.set_index('observation_month')

    df4_clean = df4.copy()
    if 'observation_month' in df4_clean.columns:
        df4_clean = df4_clean.set_index('observation_month')
    df4_clean.drop(columns=['missing_value_flag', 'source_type'], errors='ignore', inplace=True)

    df_merged = df3_clean.merge(df4_clean, left_index=True, right_index=True, how='inner')

    def get_vessel_market_index(row):
        vtype = str(row['vessel_type']).strip().lower()
        if 'capesize' in vtype:
            return row['BCI_capesize_index']
        elif 'panamax' in vtype:
            return row['BPI_panamax_index']
        elif 'supramax' in vtype:
            return row['BSI_supramax_index']
        elif 'handysize' in vtype:
            return row['BHSI_handysize_index']
        else:
            return None

    df_merged['market_index'] = df_merged.apply(get_vessel_market_index, axis=1)
    df_merged.drop(columns=[
        'BCI_capesize_index',
        'BPI_panamax_index',
        'BSI_supramax_index',
        'BHSI_handysize_index'
    ], errors='ignore', inplace=True)

    df = df_merged.copy()
    if 'vessel_id' in df.columns:
        df = df.drop(columns=['vessel_id'])

    for col in ['freight_rate_usd_per_tonne', 'iron_ore_price_usd_per_tonne']:
        if col in df.columns:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            print(f"Imputed missing values in '{col}' with median: {median_val}")

    # Step 2: Feature Engineering & Time Series Expansion
    data = df.copy()
    data.index.name = "date"
    data = data.reset_index()
    data["date"] = pd.to_datetime(data["date"]).dt.to_period("M").dt.to_timestamp()

    TARGET = "charter_rate_usd_per_month"
    SERIES_KEYS = ["distance_nm", "vessel_type", "cargo_type"]
    data = data.sort_values("date").copy()

    for col in data.columns:
        if col not in ["date", "vessel_type", "cargo_type"]:
            data[col] = pd.to_numeric(data[col], errors="coerce")
    data = data.replace([np.inf, -np.inf], np.nan)
    data = data.dropna(subset=["date", TARGET] + SERIES_KEYS)
    for col in ["vessel_type", "cargo_type"]:
        data[col] = data[col].astype(str)

    numeric_cols = data.select_dtypes(include=np.number).columns.tolist()
    monthly = (
        data.groupby(
            ["date"] + SERIES_KEYS,
            as_index=False,
            observed=True
        )[numeric_cols]
        .mean()
        .sort_values(SERIES_KEYS + ["date"])
        .reset_index(drop=True)
    )

    monthly["year"] = monthly["date"].dt.year
    monthly["month"] = monthly["date"].dt.month
    monthly["month_sin"] = np.sin(2 * np.pi * monthly["month"] / 12)
    monthly["month_cos"] = np.cos(2 * np.pi * monthly["month"] / 12)
    monthly["time_index"] = (
        (monthly["date"].dt.year - monthly["date"].dt.year.min()) * 12
        + monthly["date"].dt.month
        - monthly["date"].dt.month.min()
    )

    grouped = monthly.groupby(SERIES_KEYS, observed=True)[TARGET]
    for lag in [1, 2, 3, 4, 6, 12]:
        monthly[f"rate_lag_{lag}"] = grouped.shift(lag)

    for window in [3, 6]:
        monthly[f"rate_mean_{window}"] = (
            monthly.groupby(SERIES_KEYS, observed=True)[TARGET]
            .transform(lambda s: s.shift(1).rolling(window, min_periods=1).mean())
        )

    monthly["rate_std_6"] = (
        monthly.groupby(SERIES_KEYS, observed=True)[TARGET]
        .transform(lambda s: s.shift(1).rolling(6, min_periods=2).std())
    )

    HORIZONS = [1, 2, 3, 4]
    for h in HORIZONS:
        g = monthly.groupby(SERIES_KEYS, observed=True)
        monthly[f"target_h{h}"] = g[TARGET].shift(-h)
        monthly[f"target_date_h{h}"] = g["date"].shift(-h)
        expected = monthly["date"] + pd.DateOffset(months=h)
        valid = monthly[f"target_date_h{h}"].eq(expected)
        monthly.loc[~valid, f"target_h{h}"] = np.nan

    excluded = {"date", TARGET}
    for h in HORIZONS:
        excluded.add(f"target_h{h}")
        excluded.add(f"target_date_h{h}")

    features = [c for c in monthly.columns if c not in excluded]
    categorical_features = ["vessel_type", "cargo_type"]
    numeric_features = [c for c in features if c not in categorical_features]

    print(f"Features count: {len(features)} ({len(numeric_features)} numeric, {len(categorical_features)} categorical)")

    def create_model():
        preprocessor = ColumnTransformer([
            ("numeric", SimpleImputer(strategy="median"), numeric_features),
            ("categorical", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))
            ]), categorical_features)
        ])
        if HAS_XGB:
            reg = XGBRegressor(
                objective="reg:squarederror",
                n_estimators=400,
                learning_rate=0.03,
                max_depth=3,
                min_child_weight=3,
                subsample=0.85,
                colsample_bytree=0.85,
                reg_alpha=0.1,
                reg_lambda=5,
                random_state=42,
                n_jobs=-1
            )
        else:
            reg = GradientBoostingRegressor(
                n_estimators=400,
                learning_rate=0.03,
                max_depth=3,
                min_samples_leaf=3,
                subsample=0.85,
                random_state=42
            )
        return Pipeline([
            ("preprocessor", preprocessor),
            ("model", reg)
        ])

    models = {}
    MIN_HISTORY = 6

    for h in HORIZONS:
        target_col = f"target_h{h}"
        target_date_col = f"target_date_h{h}"
        valid = monthly.dropna(subset=[target_col, target_date_col]).copy()
        valid["history_count"] = valid.groupby(SERIES_KEYS, observed=True).cumcount() + 1
        valid = valid[valid["history_count"] >= MIN_HISTORY]

        final_model = create_model()
        final_model.fit(valid[features], valid[target_col])
        models[h] = final_model
        preds = final_model.predict(valid[features])
        mae = mean_absolute_error(valid[target_col], preds)
        r2 = r2_score(valid[target_col], preds)
        print(f"Horizon {h} trained successfully. Train MAE: ${mae:,.2f}, R2: {r2:.4f}")

    # Save trained artifacts
    saved_package = {
        "models": models,
        "features": features,
        "categorical_features": categorical_features,
        "numeric_features": numeric_features,
        "series_keys": SERIES_KEYS,
        "target": TARGET,
        "latest_monthly": monthly.sort_values("date").groupby(SERIES_KEYS, observed=True, sort=False).tail(1).reset_index(drop=True),
        "all_monthly": monthly,
        "reference_year": 2020
    }

    joblib.dump(saved_package, f"{MODEL_DIR}/charter_xgboost_models.joblib")
    print(f"Model package saved to {MODEL_DIR}/charter_xgboost_models.joblib")

if __name__ == "__main__":
    generate_vessels()
    generate_ports()
    market = generate_market()
    vessels = pd.read_csv(f"{DATA_DIR}/vessel.csv")
    generate_charter(vessels, market)
    train_and_save_pipeline()
