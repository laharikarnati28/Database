"""
Predictive Maintenance Engine (Rule-Based & Statistical Estimation)
==================================================================
Project: Vehicle Service Booking & Tracking System
Course: Database Systems Engineering & Distributed Backend Development

Description:
Transparent, deterministic predictive maintenance calculator based on vehicle
service intervals, cumulative mileage, vehicle age, and historical service records.
No "black-box" or deceptive AI claims: uses explicit OEM maintenance schedule
thresholds and multi-parameter degradation scoring.

Usage:
    python predictive_maintenance.py --mileage 42500 --age 3 --last-service-months 7 --type CAR
"""

import sys
import json
import argparse
from datetime import datetime

# Standard OEM Recommended Service Thresholds
OEM_MAINTENANCE_INTERVALS = {
    "ENGINE_OIL": {"interval_km": 10000, "interval_months": 6, "weight": 0.30},
    "BRAKE_PADS": {"interval_km": 25000, "interval_months": 24, "weight": 0.25},
    "AIR_FILTER": {"interval_km": 15000, "interval_months": 12, "weight": 0.15},
    "COOLANT": {"interval_km": 40000, "interval_months": 24, "weight": 0.15},
    "SPARK_PLUGS": {"interval_km": 30000, "interval_months": 24, "weight": 0.15}
}

def calculate_vehicle_health(mileage: int, age_years: int, months_since_last_service: int, vehicle_type: str):
    """
    Computes a transparent health score (0-100) and actionable maintenance alerts.
    """
    urgent_services = []
    recommended_services = []
    total_degradation = 0.0

    # 1. Base Degradation based on time since last service
    if months_since_last_service > 12:
        urgent_services.append("Annual Periodic Inspection Overdue")
        total_degradation += 35.0
    elif months_since_last_service > 6:
        recommended_services.append("Scheduled Semi-Annual Checkup Due")
        total_degradation += 15.0

    # 2. Mileage-based threshold checks
    for component, specs in OEM_MAINTENANCE_INTERVALS.items():
        km_cycle = mileage % specs["interval_km"]
        pct_used = (km_cycle / specs["interval_km"]) * 100.0

        if pct_used > 85.0 or (mileage > specs["interval_km"] and months_since_last_service >= specs["interval_months"]):
            urgent_services.append(f"Replace/Inspect {component.replace('_', ' ').title()} (Wear Index: {pct_used:.1f}%)")
            total_degradation += (specs["weight"] * 40.0)
        elif pct_used > 60.0:
            recommended_services.append(f"Upcoming {component.replace('_', ' ').title()} Service (Wear Index: {pct_used:.1f}%)")
            total_degradation += (specs["weight"] * 20.0)

    # 3. Vehicle Age Factor (depreciation of rubber seals, battery, hoses)
    age_penalty = min(age_years * 2.5, 20.0)
    total_degradation += age_penalty

    # Compute overall score (clamped between 10 and 100)
    health_score = max(10.0, min(100.0, 100.0 - total_degradation))

    if health_score >= 80.0:
        status = "EXCELLENT"
        action = "Vehicle is in prime condition. Continue periodic maintenance."
    elif health_score >= 60.0:
        status = "GOOD"
        action = "Vehicle is operating normally. Schedule minor upcoming services."
    elif health_score >= 40.0:
        status = "NEEDS_ATTENTION"
        action = "Key components are nearing expiration. Book a maintenance visit soon."
    else:
        status = "CRITICAL"
        action = "Immediate workshop service recommended to avoid mechanical failure."

    # Next estimated service milestone
    next_milestone_km = ((mileage // 10000) + 1) * 10000

    return {
        "vehicle_type": vehicle_type,
        "mileage_km": mileage,
        "age_years": age_years,
        "months_since_last_service": months_since_last_service,
        "health_score": round(health_score, 1),
        "status": status,
        "recommended_action": action,
        "next_service_due_km": next_milestone_km,
        "km_remaining_to_next_service": max(0, next_milestone_km - mileage),
        "urgent_replacements": urgent_services,
        "recommended_inspections": recommended_services
    }

def main():
    parser = argparse.ArgumentParser(description="Vehicle Predictive Maintenance Engine")
    parser.add_argument("--mileage", type=int, default=32000, help="Current odometer reading in kilometers")
    parser.add_argument("--age", type=int, default=3, help="Vehicle age in years")
    parser.add_argument("--last-service-months", type=int, default=7, help="Months elapsed since last complete service")
    parser.add_argument("--type", type=str, default="CAR", choices=["CAR", "BIKE", "SUV", "TRUCK"], help="Vehicle category")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")

    args = parser.parse_args()
    report = calculate_vehicle_health(args.mileage, args.age, args.last_service_months, args.type)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print("=" * 60)
        print(" VEHICLE PREDICTIVE MAINTENANCE REPORT")
        print("=" * 60)
        print(f" Vehicle Category     : {report['vehicle_type']}")
        print(f" Current Odometer     : {report['mileage_km']:,} km")
        print(f" Vehicle Age          : {report['age_years']} years")
        print(f" Last Service Elapsed : {report['months_since_last_service']} months ago")
        print("-" * 60)
        print(f" Health Score         : {report['health_score']} / 100 [{report['status']}]")
        print(f" Next Major Service   : At {report['next_service_due_km']:,} km ({report['km_remaining_to_next_service']} km remaining)")
        print(f" Recommended Action   : {report['recommended_action']}")
        print("-" * 60)
        if report['urgent_replacements']:
            print(" [!] URGENT ATTENTION REQUIRED:")
            for item in report['urgent_replacements']:
                print(f"     - {item}")
        if report['recommended_inspections']:
            print(" [*] UPCOMING SCHEDULED MAINTENANCE:")
            for item in report['recommended_inspections']:
                print(f"     - {item}")
        print("=" * 60)

if __name__ == "__main__":
    main()

