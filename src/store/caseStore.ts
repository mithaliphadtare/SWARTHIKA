import { create } from 'zustand';
import { CaseRecord, RiskLevel, CaseStatus, SupportedLanguage } from '../types/case';
import { mockApi } from '../lib/mockApi';

interface CaseState {
  cases: CaseRecord[];
  selectedCaseId: string | null;
  isLoading: boolean;
  filterRisk: RiskLevel | 'ALL';
  filterStatus: CaseStatus | 'ALL';
  filterLanguage: SupportedLanguage | 'ALL';
  filterSOSOnly: boolean;
  filterDemoOnly: boolean;
  searchQuery: string;
  sortBy: 'risk' | 'time' | 'svi';

  // Actions
  loadCases: () => Promise<void>;
  selectCase: (id: string | null) => void;
  updateStatus: (id: string, status: CaseStatus, performedBy?: string, notes?: string) => Promise<void>;
  overrideRisk: (id: string, newRisk: RiskLevel, reason: string, performedBy?: string) => Promise<void>;
  assignCounsellor: (id: string, name: string) => Promise<void>;
  addCase: (record: CaseRecord) => void;
  triggerSOSOnCase: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  setFilterRisk: (risk: RiskLevel | 'ALL') => void;
  setFilterStatus: (status: CaseStatus | 'ALL') => void;
  setFilterLanguage: (lang: SupportedLanguage | 'ALL') => void;
  setFilterSOSOnly: (val: boolean) => void;
  setFilterDemoOnly: (val: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'risk' | 'time' | 'svi') => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  selectedCaseId: null,
  isLoading: false,
  filterRisk: 'ALL',
  filterStatus: 'ALL',
  filterLanguage: 'ALL',
  filterSOSOnly: false,
  filterDemoOnly: false,
  searchQuery: '',
  sortBy: 'risk',

  loadCases: async () => {
    set({ isLoading: true });
    try {
      const cases = await mockApi.fetchCases();
      set({
        cases,
        isLoading: false,
        selectedCaseId: get().selectedCaseId || (cases.length > 0 ? cases[0].id : null),
      });
    } catch (err) {
      console.error('Failed to load cases:', err);
      set({ isLoading: false });
    }
  },

  selectCase: (id) => set({ selectedCaseId: id }),

  updateStatus: async (id, status, performedBy, notes) => {
    const updated = await mockApi.updateCaseStatus(id, status, performedBy, notes);
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? updated : c)),
    }));
  },

  overrideRisk: async (id, newRisk, reason, performedBy) => {
    const updated = await mockApi.overrideRiskLevel(id, newRisk, reason, performedBy);
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? updated : c)),
    }));
  },

  assignCounsellor: async (id, name) => {
    const updated = await mockApi.assignCounsellor(id, name);
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? updated : c)),
    }));
  },

  addCase: (record) => {
    set((state) => ({
      cases: [record, ...state.cases],
      selectedCaseId: record.id,
    }));
  },

  triggerSOSOnCase: async (id) => {
    const updated = await mockApi.triggerEmergencySOS(id);
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? updated : c)),
    }));
  },

  resetToDefaults: async () => {
    set({ isLoading: true });
    const resetCases = await mockApi.resetToDefaults();
    set({
      cases: resetCases,
      selectedCaseId: resetCases[0]?.id || null,
      isLoading: false,
    });
  },

  setFilterRisk: (filterRisk) => set({ filterRisk }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setFilterLanguage: (filterLanguage) => set({ filterLanguage }),
  setFilterSOSOnly: (filterSOSOnly) => set({ filterSOSOnly }),
  setFilterDemoOnly: (filterDemoOnly) => set({ filterDemoOnly }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
