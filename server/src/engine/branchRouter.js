/**
 * Haversine formula to calculate distance between two coordinates in km
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * NPA-Aware Branch Router
 * 
 * @param {Object} userLocation {lat, lng}
 * @param {Array} matchedSchemes Array of matched scheme IDs
 * @param {Array} branches Array of branch objects
 * @returns {Array} Top 5 branches sorted by composite score
 */
export function routeToBranches(userLocation, matchedSchemes, branches) {
  const schemeIds = matchedSchemes.map(m => m.scheme?.id || m.id);
  const maxDistance = 100; // Define a max reasonable distance for normalization (100km)
  
  const scoredBranches = branches.map(branch => {
    // Distance
    const distanceKm = userLocation.lat && userLocation.lng && branch.lat && branch.lng
      ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, branch.lat, branch.lng)
      : 50; // default distance if coords missing

    const distanceScore = Math.max(0, 100 - (distanceKm / maxDistance * 100));

    // Scheme Compatibility
    const supportedMatch = schemeIds.filter(id => branch.supportedSchemes?.includes(id)).length;
    const schemeScore = schemeIds.length > 0 ? (supportedMatch / schemeIds.length) * 100 : 100;

    // Fund Availability
    const fundScore = branch.fundAvailability || 0;

    // NPA Ratio (Inverse - lower NPA is better)
    // Assuming max bad NPA is 0.25 (25%)
    const npaRatio = branch.npaRatio || 0;
    const npaScore = Math.max(0, 100 - (npaRatio / 0.25 * 100));

    // TAT Days (Inverse - lower TAT is better)
    // Assuming max bad TAT is 30 days
    const tatDays = branch.avgTATDays || 30;
    const tatScore = Math.max(0, 100 - (tatDays / 30 * 100));

    // Weights: Distance(30%) + SchemeCompat(25%) + FundAvail(20%) + LowNPA(15%) + FastTAT(10%)
    const compositeScore = (
      (distanceScore * 0.30) +
      (schemeScore * 0.25) +
      (fundScore * 0.20) +
      (npaScore * 0.15) +
      (tatScore * 0.10)
    );

    return {
      branch,
      distance_km: parseFloat(distanceKm.toFixed(1)),
      composite_score: parseFloat(compositeScore.toFixed(2)),
      breakdown: {
        distanceScore: parseFloat(distanceScore.toFixed(2)),
        schemeScore: parseFloat(schemeScore.toFixed(2)),
        fundScore: parseFloat(fundScore.toFixed(2)),
        npaScore: parseFloat(npaScore.toFixed(2)),
        tatScore: parseFloat(tatScore.toFixed(2))
      }
    };
  });

  return scoredBranches
    .sort((a, b) => b.composite_score - a.composite_score)
    .slice(0, 5); // Return top 5
}
