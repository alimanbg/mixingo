from modules import MODULES

def generate_heatmap_from_signals(warmup_signals: dict) -> list:
    """
    Generate a heatmap based on warm-up error distribution.
    Returns a list of {module_id, area, severity} where severity is:
    0 = low risk (green)
    1 = medium (yellow)
    2 = high (red)
    """
    error_dist = warmup_signals.get("error_distribution", {})
    
    # Map areas to modules (simplified: if a module's area has errors, increase severity)
    # For demo, we'll create a deterministic mapping based on error counts per area.
    area_severity = {}
    for area, count in error_dist.items():
        if count == 0:
            area_severity[area] = 0
        elif count <= 2:
            area_severity[area] = 1
        else:
            area_severity[area] = 2
    
    # Build heatmap for all modules
    heatmap = []
    for module in MODULES:
        area = module["area"]
        severity = area_severity.get(area, 0)  # default 0 if no errors in that area
        heatmap.append({
            "module_id": module["id"],
            "area": area,
            "severity": severity
        })
    return heatmap