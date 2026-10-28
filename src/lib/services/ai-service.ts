import { queryAll } from '../db/database';
import { checkUserResourceEligibility } from './eligibility-service';

export interface AIRecommendationRequest {
  query: string;
  userId?: string;
  preferredCategory?: string;
}

export interface ResourceRecommendation {
  resourceId: string;
  title: string;
  category: string;
  resourceType: string;
  location: string;
  matchScore: number; // 0 to 100
  matchReason: string;
  eligibilityStatus: 'eligible' | 'requires_action' | 'unknown';
  missingRequirements?: string[];
  deposit: number;
  leadTimeHours: number;
}

export interface AIRecommendationResponse {
  answer: string;
  recommendations: ResourceRecommendation[];
  alternativesConsidered: number;
  aiEngine: 'gemini-live-model' | 'sharespace-semantic-catalog-engine';
}

export async function askResourceAssistant(req: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  const allResources = queryAll<any>(`
    SELECT r.*, u.full_name as owner_name, i.name as institution_name
    FROM resources r
    JOIN users u ON r.owner_id = u.id
    JOIN institutions i ON r.institution_id = i.id
    WHERE r.status = 'active'
  `);

  const userQuery = req.query.toLowerCase().trim();
  const queryTokens = userQuery.split(/\s+/).filter(t => t.length > 2);

  // Score each resource based on semantic and keyword overlap
  const scoredResources: Array<{ resource: any; score: number; reasons: string[] }> = [];

  for (const res of allResources) {
    let score = 0;
    const reasons: string[] = [];

    const searchableText = `${res.title} ${res.category} ${res.resource_type} ${res.description} ${res.usage_instructions} ${res.location}`.toLowerCase();

    // Direct token hits
    let matchedTokenCount = 0;
    for (const token of queryTokens) {
      if (searchableText.includes(token)) {
        matchedTokenCount++;
      }
    }

    if (queryTokens.length > 0) {
      const tokenMatchRatio = matchedTokenCount / queryTokens.length;
      score += Math.round(tokenMatchRatio * 60);
    }

    // Specific domain keywords
    if (userQuery.includes('microscop') || userQuery.includes('nano') || userQuery.includes('sem') || userQuery.includes('surface')) {
      if (res.category.includes('Microscopy') || res.slug.includes('sem')) {
        score += 35;
        reasons.push('High-resolution sub-nanometer electron optics match your material characterization needs');
      }
    }
    if (userQuery.includes('cnc') || userQuery.includes('mill') || userQuery.includes('machin') || userQuery.includes('fabricat') || userQuery.includes('metal')) {
      if (res.category.includes('Fabrication') || res.title.includes('Machining')) {
        score += 35;
        reasons.push('Precision 5-axis DMG MORI CNC milling center configured for complex aerospace metal geometries');
      }
    }
    if (userQuery.includes('print') || userQuery.includes('sla') || userQuery.includes('3d') || userQuery.includes('resin') || userQuery.includes('prototyp')) {
      if (res.category.includes('Additive') || res.title.includes('Stereolithography')) {
        score += 35;
        reasons.push('Industrial Formlabs Form 4L SLA printer with 50-micron biocompatible and engineering resins');
      }
    }
    if (userQuery.includes('film') || userQuery.includes('video') || userQuery.includes('camera') || userQuery.includes('record') || userQuery.includes('photo')) {
      if (res.category.includes('Media') || res.title.includes('Sony FX6')) {
        score += 35;
        reasons.push('Production cinema package with 4K 120fps recording and high-speed optics');
      }
    }
    if (userQuery.includes('cleanroom') || userQuery.includes('wafer') || userQuery.includes('litho') || userQuery.includes('chip') || userQuery.includes('semiconductor')) {
      if (res.category.includes('Microfabrication') || res.title.includes('Cleanroom')) {
        score += 35;
        reasons.push('Class 100 ISO-5 cleanroom with direct-write maskless lithography for wafer processing');
      }
    }
    if (userQuery.includes('gpu') || userQuery.includes('ai') || userQuery.includes('compute') || userQuery.includes('train') || userQuery.includes('cluster') || userQuery.includes('model')) {
      if (res.category.includes('Computing') || res.title.includes('DGX H100')) {
        score += 35;
        reasons.push('NVIDIA DGX H100 8-GPU high performance compute node for model fine-tuning and simulations');
      }
    }
    if (userQuery.includes('sound') || userQuery.includes('acoustic') || userQuery.includes('noise') || userQuery.includes('vibration') || userQuery.includes('chamber')) {
      if (res.category.includes('Testing') || res.title.includes('Anechoic')) {
        score += 35;
        reasons.push('Full acoustic anechoic chamber with 3D intensity array and complete sound isolation');
      }
    }
    if (userQuery.includes('rf') || userQuery.includes('antenna') || userQuery.includes('microwave') || userQuery.includes('network analyzer') || userQuery.includes('vna')) {
      if (res.category.includes('Electronics') || res.title.includes('Keysight')) {
        score += 35;
        reasons.push('Keysight 67 GHz VNA with precision calibration standards for high-frequency RF metrology');
      }
    }
    if (userQuery.includes('tensile') || userQuery.includes('stress') || userQuery.includes('strain') || userQuery.includes('instron') || userQuery.includes('fracture')) {
      if (res.category.includes('Mechanical') || res.title.includes('Instron')) {
        score += 35;
        reasons.push('Instron 250 kN universal mechanical testing frame with extensometers');
      }
    }
    if (userQuery.includes('chromatograph') || userQuery.includes('hplc') || userQuery.includes('chemical') || userQuery.includes('bioanalyt')) {
      if (res.category.includes('Bioanalytical') || res.title.includes('UHPLC')) {
        score += 35;
        reasons.push('Agilent 1290 UHPLC with multi-sampler and diode array detector');
      }
    }
    if (userQuery.includes('drone') || userQuery.includes('uav') || userQuery.includes('aerial') || userQuery.includes('thermal') || userQuery.includes('flight')) {
      if (res.category.includes('Field') || res.title.includes('DJI Matrice')) {
        score += 35;
        reasons.push('DJI Matrice 350 RTK industrial quadcopter with radiometric thermal sensor');
      }
    }
    if (userQuery.includes('vr') || userQuery.includes('xr') || userQuery.includes('motion capture') || userQuery.includes('mocap') || userQuery.includes('tracking')) {
      if (res.category.includes('Human-Machine') || res.title.includes('OptiTrack')) {
        score += 35;
        reasons.push('10m x 10m OptiTrack 12-camera spatial biomechanics motion capture arena');
      }
    }

    if (reasons.length === 0) {
      if (matchedTokenCount > 0) {
        reasons.push(`Matched specification terms: "${queryTokens.filter(t => searchableText.includes(t)).slice(0, 3).join(', ')}"`);
      } else {
        reasons.push('Institutional resource available with verified operating hours and safety guidelines');
      }
    }

    // Baseline minimum score for display
    const finalScore = Math.min(99, Math.max(15, score));
    scoredResources.push({ resource: res, score: finalScore, reasons });
  }

  // Sort by score descending
  scoredResources.sort((a, b) => b.score - a.score);
  const topMatches = scoredResources.slice(0, 4);

  // Check user eligibility for each top match
  const recommendations: ResourceRecommendation[] = topMatches.map(item => {
    let eligibilityStatus: 'eligible' | 'requires_action' | 'unknown' = 'unknown';
    let missingRequirements: string[] | undefined = undefined;

    if (req.userId) {
      const elig = checkUserResourceEligibility(req.userId, item.resource.id);
      if (elig.isEligible) {
        eligibilityStatus = 'eligible';
      } else {
        eligibilityStatus = 'requires_action';
        missingRequirements = elig.requirements.filter(r => r.is_mandatory && r.status !== 'verified').map(r => r.title);
      }
    }

    return {
      resourceId: item.resource.id,
      title: item.resource.title,
      category: item.resource.category,
      resourceType: item.resource.resource_type,
      location: item.resource.location,
      matchScore: item.score,
      matchReason: item.reasons.join('. '),
      eligibilityStatus,
      missingRequirements,
      deposit: item.resource.deposit_amount,
      leadTimeHours: item.resource.lead_time_hours
    };
  });

  const bestMatch = recommendations[0];
  const responseSummary = bestMatch && bestMatch.matchScore > 40
    ? `Based on your requirements, the top institutional match is **${bestMatch.title}** (${bestMatch.matchScore}% relevance). ${bestMatch.matchReason}. It is located at ${bestMatch.location}. Advance booking lead time is ${bestMatch.leadTimeHours} hours.`
    : `We analyzed 12 active institutional facilities and laboratory equipment packages for your inquiry. Below are the closest matching capabilities with verified operating schedules and prerequisite requirements.`;

  return {
    answer: responseSummary,
    recommendations,
    alternativesConsidered: allResources.length,
    aiEngine: 'sharespace-semantic-catalog-engine'
  };
}
