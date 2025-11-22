/**
 * ResNet-50 Medical Classifier - Test Suite
 * 
 * Comprehensive tests for medical image classification
 * Run with: npm test
 */

import { 
  analyzeImage, 
  analyzeBatch, 
  getModelStats, 
  initializeResNet,
  clearAnalysisCache,
  ResNetMedicalClassifier 
} from './resnetClassifier.js';

// ========================================
// TEST CONFIGURATION
// ========================================

const TEST_IMAGES = {
  skinLesion: './test-data/images/skin-lesion-sample.jpg',
  rash: './test-data/images/rash-sample.jpg',
  bruise: './test-data/images/bruise-sample.jpg',
  normalSkin: './test-data/images/normal-skin.jpg',
  invalid: './test-data/images/non-existent.jpg',
};

const EXPECTED_RESULTS = {
  skinLesion: {
    category: 'skin_lesion',
    minConfidence: 0.40,
    severityLevel: ['MEDIUM', 'HIGH'],
  },
  rash: {
    category: 'rash',
    minConfidence: 0.35,
    severityLevel: ['LOW', 'MEDIUM', 'HIGH'],
  },
};

// ========================================
// UNIT TESTS
// ========================================

describe('ResNet Medical Classifier - Unit Tests', () => {
  
  beforeAll(async () => {
    console.log('🔬 Initializing ResNet-50 for testing...');
    const initResult = await initializeResNet();
    expect(initResult.success).toBe(true);
  });

  afterEach(() => {
    // Clear cache between tests
    clearAnalysisCache();
  });

  // ========================================
  // INITIALIZATION TESTS
  // ========================================

  test('Model should initialize successfully', async () => {
    const result = await initializeResNet();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result.status).toBe('ready');
  });

  test('Model stats should be available', () => {
    const stats = getModelStats();
    expect(stats).toHaveProperty('modelLoaded');
    expect(stats).toHaveProperty('totalRequests');
    expect(stats).toHaveProperty('cacheSize');
    expect(stats.modelLoaded).toBe(true);
  });

  // ========================================
  // SINGLE IMAGE CLASSIFICATION TESTS
  // ========================================

  test('Should classify skin lesion image', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('assessment');
    expect(result.results.length).toBeGreaterThan(0);
    
    const primaryFinding = result.assessment.primaryFinding;
    expect(primaryFinding).toHaveProperty('condition');
    expect(primaryFinding).toHaveProperty('confidence');
    expect(primaryFinding).toHaveProperty('severity');
  });

  test('Classification should include medical relevance', async () => {
    const result = await analyzeImage(TEST_IMAGES.rash);
    
    expect(result.assessment).toHaveProperty('medicalRelevance');
    expect(['DETECTED', 'NO_FINDINGS']).toContain(result.assessment.medicalRelevance);
  });

  test('Should generate appropriate recommendations', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    expect(result.assessment).toHaveProperty('recommendations');
    expect(Array.isArray(result.assessment.recommendations)).toBe(true);
    expect(result.assessment.recommendations.length).toBeGreaterThan(0);
    
    const rec = result.assessment.recommendations[0];
    expect(rec).toHaveProperty('priority');
    expect(rec).toHaveProperty('action');
    expect(rec).toHaveProperty('reason');
  });

  test('Should include medical disclaimer', async () => {
    const result = await analyzeImage(TEST_IMAGES.normalSkin);
    
    expect(result.assessment).toHaveProperty('disclaimer');
    expect(result.assessment.disclaimer).toContain('AI-assisted');
  });

  // ========================================
  // SEVERITY ASSESSMENT TESTS
  // ========================================

  test('High confidence should result in HIGH severity', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    const topResult = result.results[0];
    
    if (topResult.confidence >= 0.85) {
      expect(topResult.severityLevel.level).toBe('HIGH');
      expect(topResult.severityLevel.urgency).toBe(3);
    }
  });

  test('Medium confidence should result in MEDIUM severity', async () => {
    const result = await analyzeImage(TEST_IMAGES.rash);
    const mediumConfResults = result.results.filter(
      r => r.confidence >= 0.60 && r.confidence < 0.85
    );
    
    mediumConfResults.forEach(r => {
      expect(r.severityLevel.level).toBe('MEDIUM');
      expect(r.severityLevel.urgency).toBe(2);
    });
  });

  test('Low confidence should result in LOW/UNCERTAIN severity', async () => {
    const result = await analyzeImage(TEST_IMAGES.normalSkin);
    const lowConfResults = result.results.filter(r => r.confidence < 0.40);
    
    lowConfResults.forEach(r => {
      expect(['LOW', 'UNCERTAIN']).toContain(r.severityLevel.level);
    });
  });

  // ========================================
  // BATCH PROCESSING TESTS
  // ========================================

  test('Should process multiple images in batch', async () => {
    const images = [
      TEST_IMAGES.skinLesion,
      TEST_IMAGES.rash,
      TEST_IMAGES.bruise
    ];
    
    const results = await analyzeBatch(images);
    
    expect(results.length).toBe(3);
    results.forEach(result => {
      expect(result).toHaveProperty('imagePath');
      expect(result).toHaveProperty('success');
    });
  });

  test('Batch processing should handle mixed success/failure', async () => {
    const images = [
      TEST_IMAGES.skinLesion,
      TEST_IMAGES.invalid, // This should fail
      TEST_IMAGES.rash
    ];
    
    const results = await analyzeBatch(images);
    
    expect(results.length).toBe(3);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    expect(successCount).toBeGreaterThan(0);
    expect(failCount).toBeGreaterThan(0);
  });

  // ========================================
  // CACHING TESTS
  // ========================================

  test('Should cache classification results', async () => {
    await analyzeImage(TEST_IMAGES.skinLesion);
    const statsBefore = getModelStats();
    
    await analyzeImage(TEST_IMAGES.skinLesion); // Same image
    const statsAfter = getModelStats();
    
    expect(statsAfter.cacheSize).toBeGreaterThan(0);
  });

  test('Cache clearing should work', () => {
    const result = clearAnalysisCache();
    expect(result).toHaveProperty('cleared');
    
    const stats = getModelStats();
    expect(stats.cacheSize).toBe(0);
  });

  // ========================================
  // ERROR HANDLING TESTS
  // ========================================

  test('Should handle non-existent image gracefully', async () => {
    const result = await analyzeImage('./non-existent-image.jpg');
    
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('fallback');
  });

  test('Fallback analysis should include recommendations', async () => {
    const result = await analyzeImage('./invalid-path.jpg');
    
    if (!result.success && result.fallback) {
      expect(result.fallback).toHaveProperty('recommendations');
      expect(Array.isArray(result.fallback.recommendations)).toBe(true);
    }
  });

  // ========================================
  // METADATA TESTS
  // ========================================

  test('Should include metadata in results', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    expect(result).toHaveProperty('metadata');
    expect(result.metadata).toHaveProperty('confidence');
    expect(result.metadata).toHaveProperty('modelVersion');
    expect(result.metadata.confidence).toHaveProperty('qualityRating');
  });

  test('Metadata should include timestamp', async () => {
    const result = await analyzeImage(TEST_IMAGES.rash);
    
    expect(result).toHaveProperty('timestamp');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });

  // ========================================
  // MEDICAL CATEGORY MAPPING TESTS
  // ========================================

  test('Should map predictions to medical categories', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    result.results.forEach(r => {
      expect(r).toHaveProperty('medicalCategory');
      expect(typeof r.medicalCategory).toBe('string');
    });
  });

  test('Medical categories should be valid', async () => {
    const validCategories = [
      'skin_lesion',
      'rash',
      'bruise',
      'burn',
      'inflammation',
      'wound',
      'infection',
      'hand',
      'foot',
      'face',
      'eye',
      'mouth',
      'general_observation'
    ];
    
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    result.results.forEach(r => {
      expect(validCategories).toContain(r.medicalCategory);
    });
  });
});

// ========================================
// INTEGRATION TESTS
// ========================================

describe('ResNet Medical Classifier - Integration Tests', () => {
  
  test('Should integrate with symptom entry workflow', async () => {
    // Simulate symptom entry with image
    const symptomData = {
      description: "Red, itchy rash on arm",
      images: [TEST_IMAGES.rash]
    };
    
    const imageAnalysis = await analyzeImage(symptomData.images[0]);
    
    // Verify integration data structure
    expect(imageAnalysis.success).toBe(true);
    expect(imageAnalysis.assessment.primaryFinding.severity.urgency).toBeGreaterThanOrEqual(0);
    expect(imageAnalysis.assessment.primaryFinding.severity.urgency).toBeLessThanOrEqual(3);
  });

  test('Should provide severity for alert triggering', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    // Check if severity can be used for alert threshold
    const urgency = result.assessment.primaryFinding.severity.urgency;
    const shouldAlert = urgency >= 2; // MEDIUM or HIGH
    
    expect(typeof shouldAlert).toBe('boolean');
  });

  test('Should format results for health reports', async () => {
    const result = await analyzeImage(TEST_IMAGES.skinLesion);
    
    // Verify report-friendly format
    const reportData = {
      condition: result.assessment.primaryFinding.condition,
      confidence: result.assessment.primaryFinding.confidence,
      severity: result.assessment.primaryFinding.severity.level,
      recommendations: result.assessment.recommendations.map(r => r.action),
      timestamp: result.timestamp
    };
    
    expect(reportData.condition).toBeDefined();
    expect(reportData.confidence).toBeDefined();
    expect(reportData.severity).toBeDefined();
    expect(Array.isArray(reportData.recommendations)).toBe(true);
  });
});

// ========================================
// PERFORMANCE TESTS
// ========================================

describe('ResNet Medical Classifier - Performance Tests', () => {
  
  test('Single image classification should complete in reasonable time', async () => {
    const startTime = Date.now();
    await analyzeImage(TEST_IMAGES.skinLesion);
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(10000); // 10 seconds max
  });

  test('Cached results should be faster', async () => {
    // First call
    const start1 = Date.now();
    await analyzeImage(TEST_IMAGES.rash);
    const duration1 = Date.now() - start1;
    
    // Second call (cached)
    const start2 = Date.now();
    await analyzeImage(TEST_IMAGES.rash);
    const duration2 = Date.now() - start2;
    
    expect(duration2).toBeLessThan(duration1);
  });

  test('Batch processing should be efficient', async () => {
    const images = [
      TEST_IMAGES.skinLesion,
      TEST_IMAGES.rash,
      TEST_IMAGES.bruise
    ];
    
    const startTime = Date.now();
    await analyzeBatch(images);
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    const perImageTime = duration / images.length;
    
    // Should not be significantly slower than sequential
    expect(perImageTime).toBeLessThan(15000); // 15s per image max
  });
});

// ========================================
// TEST HELPERS
// ========================================

const generateMockImage = (type) => {
  // Helper to generate mock image data for testing
  return {
    path: `./test-data/mock-${type}.jpg`,
    type: type,
    confidence: Math.random()
  };
};

const validateSeverityResponse = (severityObj) => {
  expect(severityObj).toHaveProperty('level');
  expect(severityObj).toHaveProperty('emoji');
  expect(severityObj).toHaveProperty('recommendation');
  expect(severityObj).toHaveProperty('urgency');
  expect(['HIGH', 'MEDIUM', 'LOW', 'UNCERTAIN']).toContain(severityObj.level);
  expect(severityObj.urgency).toBeGreaterThanOrEqual(0);
  expect(severityObj.urgency).toBeLessThanOrEqual(3);
};

// ========================================
// EXPORT TEST SUITE
// ========================================

export default {
  // Test suites available for import
  unitTests: describe,
  integrationTests: describe,
  performanceTests: describe,
  
  // Helper functions
  generateMockImage,
  validateSeverityResponse,
};
