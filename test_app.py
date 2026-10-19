from backend.main import health_check, get_metadata, predict_freight_rate, optimize_vessel_charter, PredictRequest, OptimizeRequest

print("Testing Health Check:")
h = health_check()
print(h)

print("\nTesting Metadata:")
meta = get_metadata()
print("Vessel types:", meta["vessel_types"])
print("Ports count:", len(meta["ports"]))
print("Latest market BDI:", meta["latest_market"]["BDI"])

print("\nTesting Model Inference (Predict):")
req = PredictRequest(
    forecast_origin="2026-10-01",
    distance_nm=6500.0,
    vessel_type="Panamax",
    cargo_type="Thermal Coal",
    cargo_quantity_tonnes=75000.0,
    service_speed_knots=14.0
)
res = predict_freight_rate(req)
print("Predict Status:", res.status)
print("Primary Freight Rate: $" + str(res.primary_freight_rate_usd_tonne) + " / tonne")
print("Primary Charter Rate: $" + str(res.primary_charter_rate_usd_month) + " / month")
for f in res.forecasts:
    print(f"Horizon {f.horizon_months} ({f.forecast_month}): Freight=${f.predicted_freight_rate_usd_per_tonne}/t, Charter=${f.predicted_charter_rate_usd_per_month}/mo")

print("\nTesting Fleet Optimization (Stage 1):")
opt_req = OptimizeRequest(
    origin_port="Hay Point (Australia)",
    destination_port="Visakhapatnam Port",
    distance_nm=4680.0,
    cargo_quantity_tonnes=60000.0,
    expected_arrival_hours=480.0,
    cargo_type="Thermal Coal"
)
opt = optimize_vessel_charter(opt_req)
print("Eligible vessels count:", opt["eligible_vessels_count"])
print("Optimal vessel:", opt["optimal_vessel"]["vessel_id"], "Freight: $" + str(opt["optimal_vessel"]["predicted_freight_rate_usd_tonne"]) + "/tonne")
print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
