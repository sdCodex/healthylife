/**
 * JAK (Jan Arogya Kendra) Data Types
 */

export interface JAKEntry {
  id: number;
  district: string;
  healthBlock: string;
  jakName: string;
  institutionName: string;
  jakCode: string;
  ninid: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  lsgiCode: string;
  constituency: string;
}

/**
 * Get display name for a JAK entry
 */
export function getJAKDisplayName(jak: JAKEntry): string {
  return jak.jakName || jak.institutionName || `JAK ${jak.jakCode}`;
}

/**
 * Check if JAK has valid coordinates for map display
 */
export function hasValidCoordinates(jak: JAKEntry): boolean {
  return (
    jak.latitude !== null &&
    jak.longitude !== null &&
    !isNaN(jak.latitude) &&
    !isNaN(jak.longitude)
  );
}

/**
 * Generate Google Maps URL for a JAK location
 */
export function getGoogleMapsUrl(jak: JAKEntry): string | null {
  if (!hasValidCoordinates(jak)) return null;
  return `https://www.google.com/maps/search/?api=1&query=${jak.latitude},${jak.longitude}`;
}

/**
 * Filter JAK entries by district and search query
 */
export function filterJAKEntries(
  entries: JAKEntry[],
  district: string,
  searchQuery: string
): JAKEntry[] {
  let filtered = entries;

  // Filter by district
  if (district) {
    filtered = filtered.filter(
      (jak) => jak.district.toLowerCase() === district.toLowerCase()
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (jak) =>
        jak.jakName.toLowerCase().includes(query) ||
        jak.institutionName.toLowerCase().includes(query) ||
        jak.jakCode.toLowerCase().includes(query) ||
        jak.healthBlock.toLowerCase().includes(query) ||
        jak.constituency.toLowerCase().includes(query)
    );
  }

  return filtered;
}

