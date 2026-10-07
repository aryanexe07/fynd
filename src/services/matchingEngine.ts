import { Item, MatchClassification, MatchScoreDetails, MatchRecord, PrivateEvidence } from '../types';

/**
 * Calculates deterministic matching score between a Lost Item and a Found Item.
 * Based on Section 11 of the FYND PRD:
 * - Category: 20 pts
 * - Brand: 15 pts
 * - Color: 10 pts
 * - Location: 20 pts
 * - Date proximity: 15 pts
 * - Description & Title text similarity: 10 pts
 * - Protected identifier (serial / imei / hash): 10 pts
 */
export function calculateMatchScore(
  lost: Item,
  found: Item,
  lostEvidence?: PrivateEvidence,
  foundEvidence?: PrivateEvidence
): { totalScore: number; details: MatchScoreDetails; classification: MatchClassification } {
  // If either is not active/matched or same type, score is 0
  if (lost.type === found.type) {
    return {
      totalScore: 0,
      details: {
        categoryScore: 0,
        brandScore: 0,
        colorScore: 0,
        locationScore: 0,
        dateScore: 0,
        textScore: 0,
        identifierScore: 0,
        totalScore: 0,
      },
      classification: 'weak',
    };
  }

  let categoryScore = 0;
  if (lost.category === found.category) {
    categoryScore = 20;
    if (lost.subcategory && found.subcategory && lost.subcategory.toLowerCase() === found.subcategory.toLowerCase()) {
      categoryScore = 20;
    }
  }

  let brandScore = 0;
  if (lost.brand && found.brand) {
    const lBrand = lost.brand.trim().toLowerCase();
    const fBrand = found.brand.trim().toLowerCase();
    if (lBrand === fBrand || lBrand.includes(fBrand) || fBrand.includes(lBrand)) {
      brandScore = 15;
    }
  } else if (!lost.brand && !found.brand) {
    // Both unbranded (e.g. keys or umbrella) - neutral award 5 pts
    brandScore = 5;
  }

  let colorScore = 0;
  if (lost.color && found.color) {
    const lColor = lost.color.trim().toLowerCase();
    const fColor = found.color.trim().toLowerCase();
    if (lColor === fColor || lColor.includes(fColor) || fColor.includes(lColor)) {
      colorScore = 10;
    }
  }

  let locationScore = 0;
  if (lost.locationId === found.locationId) {
    locationScore = 20;
  } else if (
    lost.locationName.toLowerCase().includes(found.locationName.toLowerCase()) ||
    found.locationName.toLowerCase().includes(lost.locationName.toLowerCase())
  ) {
    locationScore = 15;
  } else {
    // Check if within same building/area
    const lLoc = lost.locationName.toLowerCase();
    const fLoc = found.locationName.toLowerCase();
    if (
      (lLoc.includes('library') && fLoc.includes('library')) ||
      (lLoc.includes('cafeteria') && fLoc.includes('cafeteria')) ||
      (lLoc.includes('science') && fLoc.includes('science')) ||
      (lLoc.includes('sports') && fLoc.includes('sports'))
    ) {
      locationScore = 10;
    }
  }

  let dateScore = 0;
  const lostDate = new Date(lost.incidentDate).getTime();
  const foundDate = new Date(found.incidentDate).getTime();
  const diffDays = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) {
    dateScore = 15;
  } else if (diffDays <= 3) {
    dateScore = 12;
  } else if (diffDays <= 7) {
    dateScore = 8;
  } else if (diffDays <= 14) {
    dateScore = 4;
  }

  // Text similarity on Title and Public Description (dice coefficient / keyword overlap)
  let textScore = 0;
  const lostWords = new Set(
    `${lost.title} ${lost.publicDescription}`
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const foundWords = new Set(
    `${found.title} ${found.publicDescription}`
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  let commonCount = 0;
  lostWords.forEach((word) => {
    if (foundWords.has(word)) commonCount++;
  });

  const overlapRatio = commonCount / Math.max(1, Math.min(lostWords.size, foundWords.size));
  if (overlapRatio >= 0.5) {
    textScore = 10;
  } else if (overlapRatio >= 0.25) {
    textScore = 7;
  } else if (overlapRatio > 0.1) {
    textScore = 4;
  }

  // Identifier check (if hashed serial / sticker serial present on both)
  let identifierScore = 0;
  if (lostEvidence?.serialNumber && foundEvidence?.serialNumber) {
    if (lostEvidence.serialNumber.trim().toLowerCase() === foundEvidence.serialNumber.trim().toLowerCase()) {
      identifierScore = 10;
    }
  }

  const totalScore = Math.min(
    100,
    categoryScore + brandScore + colorScore + locationScore + dateScore + textScore + identifierScore
  );

  let classification: MatchClassification = 'weak';
  if (totalScore >= 70) {
    classification = 'strong';
  } else if (totalScore >= 45) {
    classification = 'possible';
  }

  return {
    totalScore,
    details: {
      categoryScore,
      brandScore,
      colorScore,
      locationScore,
      dateScore,
      textScore,
      identifierScore,
      totalScore,
    },
    classification,
  };
}

/**
 * Evaluates an item against all active opposite-type items to find candidate matches
 */
export function generatePotentialMatches(
  newItem: Item,
  existingItems: Item[],
  privateEvidences: Record<string, PrivateEvidence>
): MatchRecord[] {
  const matches: MatchRecord[] = [];
  const isLost = newItem.type === 'lost';

  const candidates = existingItems.filter(
    (item) => item.id !== newItem.id && item.type !== newItem.type && (item.status === 'active' || item.status === 'matched')
  );

  for (const candidate of candidates) {
    const lostItem = isLost ? newItem : candidate;
    const foundItem = isLost ? candidate : newItem;

    const lostEv = privateEvidences[lostItem.id];
    const foundEv = privateEvidences[foundItem.id];

    const result = calculateMatchScore(lostItem, foundItem, lostEv, foundEv);

    // Only create matches if threshold is met (>= 40)
    if (result.totalScore >= 40) {
      matches.push({
        id: `match_${lostItem.id}_${foundItem.id}`,
        lostItemId: lostItem.id,
        foundItemId: foundItem.id,
        score: result.totalScore,
        scoreDetails: result.details,
        classification: result.classification,
        status: 'open',
        createdAt: new Date().toISOString(),
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}
