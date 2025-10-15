// Plan-based feature restrictions and limits
export interface PlanLimits {
  maxConversations: number | 'unlimited';
  imageAnalysis: boolean;
  voiceInput: boolean;
  exportConversations: boolean;
  customLearningPaths: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  teamManagement: boolean;
  analyticsDashboard: boolean;
  customIntegrations: boolean;
  dedicatedSupport: boolean;
}

export interface PlanFeatures {
  name: string;
  limits: PlanLimits;
  features: string[];
  price: string;
  period: string;
}

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  Basic: {
    name: 'Basic',
    limits: {
      maxConversations: 100,
      imageAnalysis: false,
      voiceInput: false,
      exportConversations: false,
      customLearningPaths: false,
      prioritySupport: false,
      apiAccess: false,
      teamManagement: false,
      analyticsDashboard: false,
      customIntegrations: false,
      dedicatedSupport: false,
    },
    features: [
      '100 AI conversations/month',
      'Basic image analysis',
      'Text input only',
      'Email support',
      'Standard response time'
    ],
    price: 'Free',
    period: 'forever'
  },
  Pro: {
    name: 'Pro',
    limits: {
      maxConversations: 'unlimited',
      imageAnalysis: true,
      voiceInput: true,
      exportConversations: true,
      customLearningPaths: true,
      prioritySupport: true,
      apiAccess: false,
      teamManagement: false,
      analyticsDashboard: false,
      customIntegrations: false,
      dedicatedSupport: false,
    },
    features: [
      'Unlimited AI conversations',
      'Advanced image analysis',
      'Voice input & transcription',
      'Priority support',
      'Export conversations',
      'Custom learning paths'
    ],
    price: '₹99',
    period: 'per month'
  },
  Enterprise: {
    name: 'Enterprise',
    limits: {
      maxConversations: 'unlimited',
      imageAnalysis: true,
      voiceInput: true,
      exportConversations: true,
      customLearningPaths: true,
      prioritySupport: true,
      apiAccess: true,
      teamManagement: true,
      analyticsDashboard: true,
      customIntegrations: true,
      dedicatedSupport: true,
    },
    features: [
      'Everything in Pro',
      'Team management',
      'Analytics dashboard',
      'API access',
      'Custom integrations',
      'Dedicated support'
    ],
    price: '₹299',
    period: 'per month'
  }
};

export function getPlanFeatures(plan: string): PlanFeatures {
  return PLAN_FEATURES[plan] || PLAN_FEATURES.Basic;
}

export function canUseFeature(plan: string, feature: keyof PlanLimits): boolean {
  const planFeatures = getPlanFeatures(plan);
  return planFeatures.limits[feature] === true;
}

export function getConversationLimit(plan: string): number | 'unlimited' {
  const planFeatures = getPlanFeatures(plan);
  return planFeatures.limits.maxConversations;
}

export function hasReachedConversationLimit(plan: string, currentUsage: number): boolean {
  const limit = getConversationLimit(plan);
  if (limit === 'unlimited') return false;
  return currentUsage >= limit;
}

export function getRemainingConversations(plan: string, currentUsage: number): number | 'unlimited' {
  const limit = getConversationLimit(plan);
  if (limit === 'unlimited') return 'unlimited';
  return Math.max(0, limit - currentUsage);
}

