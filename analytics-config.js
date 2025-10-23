/**
 * Frank Labels Analytics Configuration
 * Customize your tracking settings here
 */

window.FrankLabelsAnalyticsConfig = {
    // Google Analytics 4 Configuration
    googleAnalytics: {
        measurementId: 'G-XXXXXXXXXX', // Replace with your actual GA4 Measurement ID
        enabled: true,
        debugMode: false, // Set to true for testing
        enhancedEcommerce: true,
        customDimensions: {
            sessionId: 'custom_parameter_1',
            engagementScore: 'custom_parameter_2',
            userType: 'custom_parameter_3',
            cartValue: 'custom_parameter_4'
        }
    },

    // Tracking Configuration
    tracking: {
        enabled: true,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        scrollThreshold: 25, // Percentage of page scrolled to trigger event
        clickDetectionEnabled: true,
        exitIntentDelay: 1000, // Delay before showing exit intent (ms)
        autoSaveInterval: 30000, // Auto-save session data every 30 seconds
        maxEventsPerSession: 1000, // Limit events to prevent memory issues
    },

    // Exit Intent Configuration
    exitIntent: {
        enabled: true,
        showDelay: 1000, // ms
        satisfactionSurvey: true,
        feedbackForm: true,
        modalStyle: {
            backgroundColor: '#ffffff',
            primaryColor: '#e67e22',
            borderRadius: '12px',
            maxWidth: '500px'
        }
    },

    // E-commerce Tracking
    ecommerce: {
        enabled: true,
        trackProductViews: true,
        trackCartInteractions: true,
        trackCheckoutSteps: true,
        currency: 'KES',
        enhancedMetrics: true
    },

    // User Engagement Metrics
    engagement: {
        enabled: true,
        trackScrollDepth: true,
        trackTimeOnPage: true,
        trackClicks: true,
        trackFormInteractions: true,
        calculateEngagementScore: true,
        engagementThresholds: {
            low: 25,
            medium: 50,
            high: 75,
            excellent: 90
        }
    },

    // Custom Events Configuration
    customEvents: {
        productView: {
            enabled: true,
            threshold: 0.5, // 50% of product visible
            trackAttributes: ['id', 'name', 'price', 'category', 'brand']
        },
        cartInteraction: {
            enabled: true,
            trackActions: ['add', 'remove', 'update_quantity', 'checkout', 'clear']
        },
        formInteraction: {
            enabled: true,
            trackFieldFocus: true,
            trackFormSubmission: true,
            trackValidationErrors: true
        },
        searchInteraction: {
            enabled: true,
            trackSearchQueries: true,
            trackSearchResults: true,
            trackSearchFilters: true
        }
    },

    // Performance Monitoring
    performance: {
        enabled: true,
        trackPageLoadTime: true,
        trackResourceTiming: true,
        trackUserTiming: true,
        trackCoreWebVitals: true
    },

    // Privacy and Compliance
    privacy: {
        respectDoNotTrack: true,
        anonymizeIP: true,
        dataRetention: 26, // months
        cookieConsent: true,
        gdprCompliant: true
    },

    // Custom Analytics Endpoint
    customEndpoint: {
        enabled: false, // Set to true if you have your own analytics backend
        url: '/api/analytics/track',
        method: 'POST',
        batchSize: 10, // Send events in batches
        retryAttempts: 3,
        timeout: 5000 // ms
    },

    // Debug and Development
    debug: {
        enabled: false, // Set to true for debugging
        logEvents: false,
        logToConsole: false,
        showTrackingInfo: false,
        verbose: false
    }
};

// Helper function to update configuration
window.updateAnalyticsConfig = function(newConfig) {
    window.FrankLabelsAnalyticsConfig = {
        ...window.FrankLabelsAnalyticsConfig,
        ...newConfig
    };
    
    // Notify tracker of config change if it exists
    if (window.frankLabelsTracker) {
        window.frankLabelsTracker.updateConfig(window.FrankLabelsAnalyticsConfig);
    }
};

// Helper function to get current configuration
window.getAnalyticsConfig = function() {
    return window.FrankLabelsAnalyticsConfig;
};

// Helper function to check if tracking is enabled
window.isTrackingEnabled = function() {
    return window.FrankLabelsAnalyticsConfig.tracking.enabled;
};

// Helper function to get Google Analytics ID
window.getGoogleAnalyticsId = function() {
    return window.FrankLabelsAnalyticsConfig.googleAnalytics.measurementId;
};
