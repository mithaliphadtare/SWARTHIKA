import { CaseRecord, RiskLevel, CaseStatus, SupportedLanguage } from '../types/case';
import { INITIAL_MOCK_CASES } from '../mock/mockCases';
import { analyzeMockInput } from '../mock/mockAssessment';
import { SVIResult, AcousticMetrics } from '../types/svi';
import { DetectedIndicatorsMap } from '../types/indicators';
import { RecommendationItem } from '../types/case';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = 'swarthika_cases_db_v1';

export function getStoredCases(): CaseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return INITIAL_MOCK_CASES;
}

export function saveStoredCases(cases: CaseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const mockApi = {
  async fetchCases(): Promise<CaseRecord[]> {
    await delay(250);
    return getStoredCases();
  },

  async getCaseById(id: string): Promise<CaseRecord | null> {
    await delay(150);
    const cases = getStoredCases();
    return cases.find((c) => c.id === id) || null;
  },

  async analyzeText(
    text: string,
    lang: SupportedLanguage = 'en'
  ): Promise<{
    svi: SVIResult;
    acoustic: AcousticMetrics;
    indicators: DetectedIndicatorsMap;
    recommendations: RecommendationItem[];
  }> {
    await delay(400);
    return analyzeMockInput(text, lang);
  },

  async createCase(newCase: Omit<CaseRecord, 'id' | 'timestamp' | 'auditTrail'>): Promise<CaseRecord> {
    await delay(300);
    const cases = getStoredCases();
    const nextNum = 1050 + cases.length;
    const caseId = `SW-${nextNum}`;
    const timestamp = new Date().toISOString();

    const record: CaseRecord = {
      ...newCase,
      id: caseId,
      timestamp,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp,
          action: 'Case Created',
          performedBy: 'SWARTHIKA AI Engine',
          notes: `Initial SVI: ${newCase.sviScore} (${newCase.riskLevel}) via ${newCase.channel} portal.`,
        },
      ],
    };

    if (newCase.isSOS) {
      record.auditTrail.push({
        id: `aud-sos-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Silent SOS Triggered',
        performedBy: 'Citizen Client',
        notes: 'Discreet Silent SOS triggered during intake.',
      });
    }

    const updated = [record, ...cases];
    saveStoredCases(updated);
    return record;
  },

  async updateCaseStatus(
    id: string,
    status: CaseStatus,
    performedBy: string = 'Dr. Anita Sharma',
    notes?: string
  ): Promise<CaseRecord> {
    await delay(200);
    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Case not found');

    const prevStatus = cases[index].status;
    const updated: CaseRecord = {
      ...cases[index],
      status,
      auditTrail: [
        ...cases[index].auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `Status Changed: ${prevStatus} ➔ ${status}`,
          performedBy,
          notes: notes || `Case moved to ${status} state.`,
          previousValue: prevStatus,
          newValue: status,
        },
      ],
    };

    cases[index] = updated;
    saveStoredCases(cases);
    return updated;
  },

  async overrideRiskLevel(
    id: string,
    newRisk: RiskLevel,
    reason: string,
    performedBy: string = 'Dr. Anita Sharma'
  ): Promise<CaseRecord> {
    await delay(250);
    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Case not found');

    const prevRisk = cases[index].riskLevel;
    const updated: CaseRecord = {
      ...cases[index],
      originalRiskLevel: cases[index].originalRiskLevel || prevRisk,
      riskLevel: newRisk,
      isOverridden: true,
      overrideReason: reason,
      auditTrail: [
        ...cases[index].auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `Risk Overridden (${prevRisk} ➔ ${newRisk})`,
          performedBy,
          notes: reason,
          previousValue: prevRisk,
          newValue: newRisk,
        },
      ],
    };

    cases[index] = updated;
    saveStoredCases(cases);
    return updated;
  },

  async assignCounsellor(
    id: string,
    counsellorName: string,
    performedBy: string = 'System Supervisor'
  ): Promise<CaseRecord> {
    await delay(200);
    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Case not found');

    const updated: CaseRecord = {
      ...cases[index],
      counsellorAssigned: counsellorName,
      status: cases[index].status === 'New' ? 'Under Review' : cases[index].status,
      auditTrail: [
        ...cases[index].auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `Counsellor Assigned: ${counsellorName}`,
          performedBy,
          notes: `Assigned case to ${counsellorName}.`,
        },
      ],
    };

    cases[index] = updated;
    saveStoredCases(cases);
    return updated;
  },

  async resetToDefaults(): Promise<CaseRecord[]> {
    await delay(200);
    saveStoredCases(INITIAL_MOCK_CASES);
    return INITIAL_MOCK_CASES;
  },

  async triggerEmergencySOS(id: string): Promise<CaseRecord> {
    await delay(150);
    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Case not found');

    const updated: CaseRecord = {
      ...cases[index],
      isSOS: true,
      sosTimestamp: new Date().toISOString(),
      status: 'Escalated',
      auditTrail: [
        ...cases[index].auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Priority SOS Triggered',
          performedBy: 'Citizen Client',
          notes: 'Emergency beacon activated. Case auto-escalated to supervisor tier.',
        },
      ],
    };

    cases[index] = updated;
    saveStoredCases(cases);
    return updated;
  },

  async fetchDashboardStats() {
    await delay(200);
    const cases = getStoredCases();
    const total = cases.length;
    const critical = cases.filter((c) => c.riskLevel === 'CRITICAL').length;
    const high = cases.filter((c) => c.riskLevel === 'HIGH').length;
    const sosCount = cases.filter((c) => c.isSOS).length;
    const active = cases.filter((c) => c.status === 'New' || c.status === 'Under Review').length;
    const resolved = cases.filter((c) => c.status === 'Resolved').length;

    return {
      total,
      critical,
      high,
      sosCount,
      active,
      resolved,
    };
  },
};
