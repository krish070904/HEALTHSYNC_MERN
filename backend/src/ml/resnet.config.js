/**
 * ResNet-50 Medical Classifier Configuration
 * 
 * Central configuration for medical image analysis
 * Modify these settings based on your deployment environment
 */

export const RESNET_CONFIG = {
  // ========================================
  // API CONFIGURATION
  // ========================================
  api: {
    provider: "HuggingFace",
    endpoint: "https://api-inference.huggingface.co/models/microsoft/resnet-50",
    timeout: parseInt(process.env.RESNET_TIMEOUT) || 30000,
    maxRetries: parseInt(process.env.RESNET_MAX_RETRIES) || 3,
    retryDelay: 2000,
  },

  // ========================================
  // MEDICAL THRESHOLDS
  // ========================================
  severity: {
    // Confidence thresholds for severity levels
    thresholds: {
      HIGH: 0.85,        // 85%+ confidence = HIGH urgency
      MEDIUM: 0.60,      // 60-85% confidence = MEDIUM urgency
      LOW: 0.40,         // 40-60% confidence = LOW urgency
      UNCERTAIN: 0.40,   // <40% confidence = UNCERTAIN
    },
    
    // Time before medical consultation (hours)
    consultationDeadlines: {
      HIGH: 2,           // Within 2 hours
      MEDIUM: 24,        // Within 24 hours
      LOW: 168,          // Within 1 week
      UNCERTAIN: null,   // No specific deadline
    },
  },

  // ========================================
  // IMAGE PROCESSING
  // ========================================
  imageProcessing: {
    // Supported image formats
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    
    // Max file size in MB
    maxFileSize: 10,
    
    // Recommended dimensions
    recommendedSize: {
      width: 224,
      height: 224,
    },
    
    // Auto-resize images
    autoResize: true,
    
    // Image quality for processing
    quality: 85,
  },

  // ========================================
  // MEDICAL LABEL MAPPINGS
  // ========================================
  medicalMapping: {
    // Map ImageNet labels to medical categories
    categories: {
      "skin_lesion": {
        keywords: ["mole", "nevus", "melanoma", "carcinoma", "lesion", "spot"],
        priority: "HIGH",
        specialistRequired: "dermatologist",
        description: "Abnormal skin growth or discoloration",
      },
      
      "rash": {
        keywords: ["rash", "erythema", "dermatitis", "eczema", "hives"],
        priority: "MEDIUM",
        specialistRequired: "dermatologist",
        description: "Skin irritation or inflammation",
      },
      
      "bruise": {
        keywords: ["bruise", "contusion", "hematoma", "ecchymosis"],
        priority: "LOW",
        specialistRequired: null,
        description: "Skin discoloration from trauma",
      },
      
      "burn": {
        keywords: ["burn", "scald", "thermal_injury", "blister"],
        priority: "HIGH",
        specialistRequired: "emergency_medicine",
        description: "Thermal or chemical skin damage",
      },
      
      "inflammation": {
        keywords: ["inflammation", "swelling", "edema", "cellulitis"],
        priority: "MEDIUM",
        specialistRequired: "general_practitioner",
        description: "Tissue swelling and redness",
      },
      
      "wound": {
        keywords: ["wound", "laceration", "cut", "abrasion", "ulcer"],
        priority: "MEDIUM",
        specialistRequired: "general_practitioner",
        description: "Break in skin integrity",
      },
      
      "infection": {
        keywords: ["infection", "abscess", "pustule", "pus", "sepsis"],
        priority: "HIGH",
        specialistRequired: "infectious_disease",
        description: "Bacterial or viral infection",
      },
    },
    
    // Body part context
    bodyParts: {
      "hand": ["hand", "palm", "finger", "wrist"],
      "foot": ["foot", "toe", "heel", "ankle"],
      "face": ["face", "facial", "cheek", "forehead"],
      "eye": ["eye", "ocular", "eyelid"],
      "mouth": ["mouth", "oral", "lip", "tongue"],
      "arm": ["arm", "elbow", "forearm"],
      "leg": ["leg", "thigh", "calf", "knee"],
      "torso": ["chest", "abdomen", "back", "torso"],
    },
  },

  // ========================================
  // CACHING & PERFORMANCE
  // ========================================
  performance: {
    // Enable result caching
    enableCache: true,
    
    // Cache TTL in seconds (1 hour)
    cacheTTL: 3600,
    
    // Max cache size (number of entries)
    maxCacheSize: 1000,
    
    // Enable batch processing
    enableBatch: true,
    
    // Max images per batch
    maxBatchSize: 10,
    
    // Concurrent API requests
    maxConcurrent: 3,
  },

  // ========================================
  // LOGGING & MONITORING
  // ========================================
  logging: {
    // Log level: 'debug', 'info', 'warn', 'error'
    level: process.env.LOG_LEVEL || 'info',
    
    // Log classification results
    logResults: true,
    
    // Log API calls
    logApiCalls: true,
    
    // Log errors
    logErrors: true,
    
    // Store classification history
    saveHistory: false,
    
    // History storage location
    historyPath: './logs/resnet-classifications.json',
  },

  // ========================================
  // MEDICAL RECOMMENDATIONS
  // ========================================
  recommendations: {
    // Auto-generate recommendations
    autoGenerate: true,
    
    // Include general health advice
    includeGeneralAdvice: true,
    
    // Recommendation templates
    templates: {
      HIGH_SEVERITY: [
        "Seek immediate medical attention",
        "Visit emergency room or urgent care",
        "Do not delay treatment",
        "Contact your healthcare provider immediately",
      ],
      
      MEDIUM_SEVERITY: [
        "Schedule a doctor's appointment within 24 hours",
        "Consult a healthcare professional",
        "Monitor symptoms closely",
        "Take photos to track progression",
      ],
      
      LOW_SEVERITY: [
        "Monitor the condition",
        "Self-care may be sufficient",
        "Contact doctor if symptoms worsen",
        "Document any changes",
      ],
      
      UNCERTAIN: [
        "Unable to determine severity",
        "Professional medical evaluation recommended",
        "Provide more information to your doctor",
        "Consider getting a second opinion",
      ],
    },
  },

  // ========================================
  // ALERTS & NOTIFICATIONS
  // ========================================
  alerts: {
    // Auto-trigger alerts based on severity
    autoTrigger: true,
    
    // Minimum severity to trigger alert
    minSeverityForAlert: "MEDIUM",
    
    // Alert channels
    channels: {
      HIGH: ["email", "sms", "app"],
      MEDIUM: ["email", "app"],
      LOW: ["app"],
      UNCERTAIN: ["app"],
    },
    
    // Alert templates
    templates: {
      HIGH: "🚨 URGENT: High-severity medical condition detected. Seek immediate medical attention.",
      MEDIUM: "⚠️ ATTENTION: Medical condition detected. Please consult a healthcare professional.",
      LOW: "ℹ️ INFO: Minor condition detected. Monitor and track your symptoms.",
    },
  },

  // ========================================
  // COMPLIANCE & DISCLAIMERS
  // ========================================
  compliance: {
    // Include medical disclaimers
    includeDisclaimers: true,
    
    // Standard disclaimer text
    disclaimer: "⚠️ This is an AI-assisted analysis and should not replace professional medical diagnosis. Always consult a qualified healthcare provider for medical advice.",
    
    // HIPAA compliance mode (additional safeguards)
    hipaaMode: false,
    
    // Store patient data
    storePatientData: false,
    
    // Anonymize results
    anonymizeResults: true,
  },

  // ========================================
  // DEVELOPMENT & DEBUGGING
  // ========================================
  development: {
    // Enable debug mode
    debug: process.env.NODE_ENV !== 'production',
    
    // Use mock responses (for testing)
    useMockResponses: false,
    
    // Mock response delay (ms)
    mockDelay: 1000,
    
    // Verbose logging
    verbose: false,
    
    // Save API responses for debugging
    saveApiResponses: false,
    
    // API response save path
    apiResponsePath: './debug/api-responses',
  },

  // ========================================
  // FEATURE FLAGS
  // ========================================
  features: {
    // Enable AI image analysis
    enableImageAnalysis: true,
    
    // Enable medical category mapping
    enableMedicalMapping: true,
    
    // Enable severity assessment
    enableSeverityAssessment: true,
    
    // Enable recommendation generation
    enableRecommendations: true,
    
    // Enable batch processing
    enableBatchProcessing: true,
    
    // Enable result caching
    enableCaching: true,
    
    // Enable auto-retry on failure
    enableAutoRetry: true,
    
    // Enable fallback analysis
    enableFallback: true,
  },
};

// ========================================
// ENVIRONMENT-SPECIFIC OVERRIDES
// ========================================

if (process.env.NODE_ENV === 'production') {
  // Production settings
  RESNET_CONFIG.logging.level = 'warn';
  RESNET_CONFIG.development.debug = false;
  RESNET_CONFIG.development.verbose = false;
  RESNET_CONFIG.compliance.hipaaMode = true;
  RESNET_CONFIG.performance.maxConcurrent = 5;
}

if (process.env.NODE_ENV === 'development') {
  // Development settings
  RESNET_CONFIG.logging.level = 'debug';
  RESNET_CONFIG.development.verbose = true;
  RESNET_CONFIG.performance.enableCache = false; // Disable cache for testing
}

if (process.env.NODE_ENV === 'test') {
  // Test settings
  RESNET_CONFIG.api.timeout = 5000; // Shorter timeout for tests
  RESNET_CONFIG.development.useMockResponses = true;
  RESNET_CONFIG.alerts.autoTrigger = false;
}

// ========================================
// VALIDATION
// ========================================

export const validateConfig = () => {
  const errors = [];
  
  // Check required API settings
  if (!process.env.HF_API_KEY && !RESNET_CONFIG.development.useMockResponses) {
    errors.push('HF_API_KEY environment variable is required');
  }
  
  // Validate thresholds
  const { HIGH, MEDIUM, LOW } = RESNET_CONFIG.severity.thresholds;
  if (HIGH <= MEDIUM || MEDIUM <= LOW) {
    errors.push('Severity thresholds must be in descending order');
  }
  
  // Validate cache settings
  if (RESNET_CONFIG.performance.maxCacheSize < 10) {
    errors.push('maxCacheSize should be at least 10 entries');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ========================================
// CONFIG EXPORTS
// ========================================

export default RESNET_CONFIG;

// Export specific sections for convenience
export const { api, severity, imageProcessing, medicalMapping, performance } = RESNET_CONFIG;
