/**
 * Frank Labels - Advanced User Tracking & Analytics System
 * Comprehensive tracking for user engagement, clicks, scrolls, and Google Analytics integration
 */

class FrankLabelsTracker {
    constructor() {
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            clicks: [],
            scrolls: [],
            timeOnSite: 0,
            pagesVisited: [],
            productsViewed: [],
            cartInteractions: [],
            exitIntentTriggered: false,
            satisfactionSurveyCompleted: false
        };
        
        // Load configuration from external config file or use defaults
        this.config = window.FrankLabelsAnalyticsConfig || {
            googleAnalytics: {
                measurementId: 'G-XXXXXXXXXX',
                enabled: true
            },
            tracking: {
                enabled: true,
                scrollThreshold: 25,
                clickDetectionEnabled: true,
                exitIntentDelay: 1000,
                sessionTimeout: 30 * 60 * 1000
            },
            customEndpoint: {
                enabled: false,
                url: '/api/track'
            }
        };
        
        this.init();
    }

    generateSessionId() {
        return 'fl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.setupGoogleAnalytics();
        this.setupEventListeners();
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupExitIntentDetection();
        this.setupPageVisibilityTracking();
        this.setupSessionManagement();
        this.trackPageView();
        
        console.log('Frank Labels Analytics Tracker initialized');
    }

    setupGoogleAnalytics() {
        // Check if tracking is enabled
        if (!this.config.tracking?.enabled || !this.config.googleAnalytics?.enabled) {
            return;
        }

        const gaId = this.config.googleAnalytics.measurementId;
        
        // Google Analytics 4 setup
        if (typeof gtag !== 'undefined') {
            gtag('config', gaId, {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: this.config.googleAnalytics.customDimensions || {
                    'custom_parameter_1': 'session_id',
                    'custom_parameter_2': 'user_engagement_score'
                }
            });
        } else {
            // Load GA4 if not already loaded
            this.loadGoogleAnalytics(gaId);
        }
    }

    loadGoogleAnalytics(gaId) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);

        window.gtag = gtag;
    }

    setupEventListeners() {
        // Track all clicks with enhanced data
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        }, true);

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackFormSubmission(e);
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackPageVisibility();
        });

        // Track before page unload
        window.addEventListener('beforeunload', () => {
            this.trackExit();
        });

        // Track cart interactions
        this.setupCartTracking();
    }

    setupScrollTracking() {
        let scrollTimeout;
        let lastScrollTime = 0;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            // Throttle scroll events to avoid performance issues
            if (now - lastScrollTime > 100) {
                this.trackScroll(scrollPercent);
                lastScrollTime = now;
            }

            // Track scroll milestones
            this.trackScrollMilestones(scrollPercent);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScrollEnd();
            }, 150);
        });
    }

    setupClickTracking() {
        // Enhanced click tracking with element analysis
        document.addEventListener('click', (e) => {
            const element = e.target;
            const clickData = {
                timestamp: Date.now(),
                element: this.getElementInfo(element),
                position: { x: e.clientX, y: e.clientY },
                scrollPosition: window.scrollY,
                viewportSize: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                isScrolling: this.isUserScrolling()
            };

            this.sessionData.clicks.push(clickData);
            this.sendToGoogleAnalytics('click', clickData);
        });
    }

    setupExitIntentDetection() {
        let exitIntentShown = false;
        let mouseLeaveTimer;

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown) {
                mouseLeaveTimer = setTimeout(() => {
                    this.showExitIntentModal();
                    exitIntentShown = true;
                }, this.config.exitIntentDelay);
            }
        });

        document.addEventListener('mouseenter', () => {
            clearTimeout(mouseLeaveTimer);
        });
    }

    setupPageVisibilityTracking() {
        let visibilityChangeTime = Date.now();
        
        document.addEventListener('visibilitychange', () => {
            const now = Date.now();
            
            if (document.hidden) {
                // User left the page
                this.sessionData.timeOnSite += (now - visibilityChangeTime);
                this.trackEvent('page_hidden', {
                    timeOnSite: this.sessionData.timeOnSite,
                    sessionDuration: now - this.sessionData.startTime
                });
            } else {
                // User returned to the page
                visibilityChangeTime = now;
                this.trackEvent('page_visible', {
                    timeOnSite: this.sessionData.timeOnSite
                });
            }
        });
    }

    setupSessionManagement() {
        // Auto-save session data periodically
        setInterval(() => {
            this.saveSessionData();
        }, 30000); // Every 30 seconds

        // Save session data before page unload
        window.addEventListener('beforeunload', () => {
            this.sessionData.timeOnSite += (Date.now() - this.getLastActivityTime());
            this.saveSessionData(true); // Force save
        });
    }

    setupCartTracking() {
        // Track cart interactions
        const cartButtons = document.querySelectorAll('.add-to-cart, .cart-button, .checkout-cart');
        cartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.trackCartInteraction(e.target);
            });
        });

        // Track product views
        this.trackProductViews();
    }

    trackClick(event) {
        const element = event.target;
        const clickData = {
            timestamp: Date.now(),
            element: this.getElementInfo(element),
            position: { x: event.clientX, y: event.clientY },
            scrollPosition: window.scrollY,
            isScrolling: this.isUserScrolling(),
            elementText: element.textContent?.trim().substring(0, 50),
            elementHref: element.href || null,
            elementClass: element.className,
            elementId: element.id
        };

        this.sessionData.clicks.push(clickData);
        
        // Send to Google Analytics
        this.sendToGoogleAnalytics('click', {
            event_category: 'engagement',
            event_label: clickData.element.tagName,
            value: this.sessionData.clicks.length,
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                click_position: clickData.position,
                scroll_position: clickData.scrollPosition
            }
        });

        // Log for debugging
        console.log('Click tracked:', clickData);
    }

    trackScroll(scrollPercent) {
        const scrollData = {
            timestamp: Date.now(),
            scrollPercent: scrollPercent,
            scrollPosition: window.scrollY,
            pageHeight: document.body.scrollHeight,
            viewportHeight: window.innerHeight
        };

        this.sessionData.scrolls.push(scrollData);

        // Send scroll events to GA (throttled)
        if (scrollPercent % 25 === 0) { // Every 25% scroll
            this.sendToGoogleAnalytics('scroll', {
                event_category: 'engagement',
                event_label: `${scrollPercent}%`,
                value: scrollPercent,
                custom_parameters: {
                    session_id: this.sessionData.sessionId,
                    scroll_position: scrollData.scrollPosition
                }
            });
        }
    }

    trackScrollMilestones(scrollPercent) {
        const milestones = [25, 50, 75, 90, 100];
        const milestone = milestones.find(m => scrollPercent >= m && !this.sessionData.scrollMilestones?.includes(m));
        
        if (milestone) {
            if (!this.sessionData.scrollMilestones) {
                this.sessionData.scrollMilestones = [];
            }
            this.sessionData.scrollMilestones.push(milestone);
            
            this.sendToGoogleAnalytics('scroll_milestone', {
                event_category: 'engagement',
                event_label: `${milestone}%_scrolled`,
                value: milestone,
                custom_parameters: {
                    session_id: this.sessionData.sessionId,
                    total_scroll_milestones: this.sessionData.scrollMilestones.length
                }
            });
        }
    }

    trackScrollEnd() {
        const lastScroll = this.sessionData.scrolls[this.sessionData.scrolls.length - 1];
        if (lastScroll) {
            this.sendToGoogleAnalytics('scroll_end', {
                event_category: 'engagement',
                event_label: 'scroll_ended',
                value: lastScroll.scrollPercent,
                custom_parameters: {
                    session_id: this.sessionData.sessionId,
                    max_scroll_percent: Math.max(...this.sessionData.scrolls.map(s => s.scrollPercent))
                }
            });
        }
    }

    trackProductViews() {
        // Track when products come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const productElement = entry.target;
                    const productData = this.extractProductData(productElement);
                    
                    if (productData) {
                        this.sessionData.productsViewed.push({
                            timestamp: Date.now(),
                            product: productData,
                            element: this.getElementInfo(productElement)
                        });

                        this.sendToGoogleAnalytics('view_item', {
                            event_category: 'ecommerce',
                            event_label: productData.name,
                            value: productData.price,
                            custom_parameters: {
                                session_id: this.sessionData.sessionId,
                                product_id: productData.id,
                                product_category: productData.category
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe all product cards
        document.querySelectorAll('.product-card, .shoe-card').forEach(card => {
            observer.observe(card);
        });
    }

    trackCartInteraction(element) {
        const cartData = {
            timestamp: Date.now(),
            action: this.getCartAction(element),
            element: this.getElementInfo(element)
        };

        this.sessionData.cartInteractions.push(cartData);

        this.sendToGoogleAnalytics('cart_interaction', {
            event_category: 'ecommerce',
            event_label: cartData.action,
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                cart_interaction_count: this.sessionData.cartInteractions.length
            }
        });
    }

    showExitIntentModal() {
        if (this.sessionData.exitIntentTriggered) return;
        
        this.sessionData.exitIntentTriggered = true;
        
        const modal = this.createExitIntentModal();
        document.body.appendChild(modal);
        
        this.sendToGoogleAnalytics('exit_intent', {
            event_category: 'engagement',
            event_label: 'exit_intent_shown',
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                time_on_site: this.sessionData.timeOnSite,
                clicks_count: this.sessionData.clicks.length,
                scrolls_count: this.sessionData.scrolls.length
            }
        });
    }

    createExitIntentModal() {
        const modal = document.createElement('div');
        modal.id = 'exitIntentModal';
        modal.innerHTML = `
            <div class="exit-intent-overlay">
                <div class="exit-intent-modal">
                    <div class="exit-intent-header">
                        <h3>Wait! Did you find what you were looking for? 👋</h3>
                        <button class="exit-intent-close">&times;</button>
                    </div>
                    <div class="exit-intent-content">
                        <p>We noticed you're about to leave. Before you go, let us know:</p>
                        <div class="exit-intent-options">
                            <button class="exit-intent-btn" data-satisfaction="yes">
                                ✅ Yes, I found what I needed!
                            </button>
                            <button class="exit-intent-btn" data-satisfaction="no">
                                ❌ Not quite what I was looking for
                            </button>
                            <button class="exit-intent-btn" data-satisfaction="maybe">
                                🤔 Maybe, but I need to think about it
                            </button>
                        </div>
                        <div class="exit-intent-feedback" style="display: none;">
                            <textarea placeholder="Tell us what you were looking for or any suggestions..." rows="3"></textarea>
                            <button class="exit-intent-submit">Submit Feedback</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .exit-intent-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .exit-intent-modal {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }
            
            .exit-intent-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .exit-intent-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.3rem;
            }
            
            .exit-intent-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .exit-intent-close:hover {
                background: #f5f5f5;
            }
            
            .exit-intent-content {
                padding: 1.5rem;
            }
            
            .exit-intent-content p {
                margin-bottom: 1.5rem;
                color: #666;
                text-align: center;
            }
            
            .exit-intent-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .exit-intent-btn {
                padding: 1rem;
                border: 2px solid #e67e22;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s;
                text-align: left;
            }
            
            .exit-intent-btn:hover {
                background: #e67e22;
                color: white;
                transform: translateY(-2px);
            }
            
            .exit-intent-feedback textarea {
                width: 100%;
                padding: 1rem;
                border: 1px solid #ddd;
                border-radius: 8px;
                resize: vertical;
                font-family: inherit;
                margin-bottom: 1rem;
            }
            
            .exit-intent-submit {
                background: #e67e22;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(styles);
        
        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('exit-intent-btn')) {
                const satisfaction = e.target.dataset.satisfaction;
                this.handleExitIntentResponse(satisfaction, modal);
            } else if (e.target.classList.contains('exit-intent-close') || e.target.classList.contains('exit-intent-overlay')) {
                this.closeExitIntentModal(modal);
            } else if (e.target.classList.contains('exit-intent-submit')) {
                this.submitExitIntentFeedback(modal);
            }
        });

        return modal;
    }

    handleExitIntentResponse(satisfaction, modal) {
        this.sessionData.satisfactionSurveyCompleted = true;
        
        this.sendToGoogleAnalytics('exit_intent_response', {
            event_category: 'engagement',
            event_label: `satisfaction_${satisfaction}`,
            value: satisfaction === 'yes' ? 1 : satisfaction === 'no' ? 0 : 0.5,
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                satisfaction_level: satisfaction,
                time_on_site: this.sessionData.timeOnSite,
                engagement_score: this.calculateEngagementScore()
            }
        });

        // Show feedback form if not satisfied
        if (satisfaction !== 'yes') {
            const feedbackDiv = modal.querySelector('.exit-intent-feedback');
            feedbackDiv.style.display = 'block';
            feedbackDiv.dataset.satisfaction = satisfaction;
        } else {
            this.closeExitIntentModal(modal);
        }
    }

    submitExitIntentFeedback(modal) {
        const textarea = modal.querySelector('.exit-intent-feedback textarea');
        const feedback = textarea.value.trim();
        const satisfaction = modal.querySelector('.exit-intent-feedback').dataset.satisfaction;
        
        if (feedback) {
            this.sendToGoogleAnalytics('exit_intent_feedback', {
                event_category: 'feedback',
                event_label: 'user_feedback_submitted',
                custom_parameters: {
                    session_id: this.sessionData.sessionId,
                    satisfaction_level: satisfaction,
                    feedback_text: feedback,
                    feedback_length: feedback.length
                }
            });
        }
        
        this.closeExitIntentModal(modal);
    }

    closeExitIntentModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    trackPageView() {
        this.sessionData.pagesVisited.push({
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer
        });

        this.sendToGoogleAnalytics('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                page_load_time: performance.now(),
                pages_visited_count: this.sessionData.pagesVisited.length
            }
        });
    }

    trackFormSubmission(event) {
        const formData = {
            timestamp: Date.now(),
            formId: event.target.id,
            formClass: event.target.className,
            formAction: event.target.action,
            formMethod: event.target.method
        };

        this.sendToGoogleAnalytics('form_submit', {
            event_category: 'form',
            event_label: formData.formId || 'unknown_form',
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                form_action: formData.formAction
            }
        });
    }

    trackExit() {
        this.sessionData.timeOnSite += (Date.now() - this.getLastActivityTime());
        
        this.sendToGoogleAnalytics('session_end', {
            event_category: 'session',
            event_label: 'session_ended',
            value: this.sessionData.timeOnSite,
            custom_parameters: {
                session_id: this.sessionData.sessionId,
                total_time_on_site: this.sessionData.timeOnSite,
                total_clicks: this.sessionData.clicks.length,
                total_scrolls: this.sessionData.scrolls.length,
                pages_visited: this.sessionData.pagesVisited.length,
                products_viewed: this.sessionData.productsViewed.length,
                cart_interactions: this.sessionData.cartInteractions.length,
                engagement_score: this.calculateEngagementScore(),
                exit_intent_triggered: this.sessionData.exitIntentTriggered,
                satisfaction_survey_completed: this.sessionData.satisfactionSurveyCompleted
            }
        });

        this.saveSessionData(true);
    }

    sendToGoogleAnalytics(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Also send to your own analytics endpoint
        this.sendToCustomEndpoint(eventName, eventData);
    }

    sendToCustomEndpoint(eventName, eventData) {
        // Send to your backend for custom analytics
        if (this.config.trackingEndpoint) {
            fetch(this.config.trackingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: eventName,
                    data: eventData,
                    session: this.sessionData,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            }).catch(error => {
                console.log('Analytics endpoint error:', error);
            });
        }
    }

    saveSessionData(force = false) {
        try {
            localStorage.setItem('frank_labels_session', JSON.stringify({
                ...this.sessionData,
                lastSaved: Date.now()
            }));
        } catch (error) {
            console.log('Failed to save session data:', error);
        }
    }

    // Utility functions
    getElementInfo(element) {
        return {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: element.textContent?.trim().substring(0, 100),
            href: element.href || null,
            src: element.src || null,
            type: element.type || null
        };
    }

    isUserScrolling() {
        return document.body.classList.contains('scrolling') || 
               window.scrollY !== (window.lastScrollY || 0);
    }

    getCartAction(element) {
        if (element.classList.contains('add-to-cart')) return 'add_to_cart';
        if (element.classList.contains('remove-btn')) return 'remove_from_cart';
        if (element.classList.contains('quantity-btn')) return 'update_quantity';
        if (element.classList.contains('checkout-cart')) return 'checkout';
        return 'unknown_cart_action';
    }

    extractProductData(element) {
        const productCard = element.closest('.product-card, .shoe-card');
        if (!productCard) return null;

        return {
            id: productCard.querySelector('[data-id]')?.getAttribute('data-id'),
            name: productCard.querySelector('h3, .product-name, .shoe-name')?.textContent?.trim(),
            price: productCard.querySelector('.price, .shoe-price')?.textContent?.trim(),
            category: productCard.dataset.category || 'unknown',
            image: productCard.querySelector('img')?.src
        };
    }

    calculateEngagementScore() {
        const clicks = this.sessionData.clicks.length;
        const scrolls = this.sessionData.scrolls.length;
        const timeOnSite = this.sessionData.timeOnSite / 1000; // Convert to seconds
        const pagesVisited = this.sessionData.pagesVisited.length;
        const productsViewed = this.sessionData.productsViewed.length;
        
        // Calculate engagement score (0-100)
        const score = Math.min(100, 
            (clicks * 5) + 
            (scrolls * 2) + 
            (timeOnSite / 10) + 
            (pagesVisited * 10) + 
            (productsViewed * 15)
        );
        
        return Math.round(score);
    }

    getLastActivityTime() {
        const activities = [
            ...this.sessionData.clicks.map(c => c.timestamp),
            ...this.sessionData.scrolls.map(s => s.timestamp),
            ...this.sessionData.pagesVisited.map(p => p.timestamp)
        ];
        
        return Math.max(...activities, this.sessionData.startTime);
    }

    trackEvent(eventName, eventData) {
        this.sendToGoogleAnalytics(eventName, eventData);
    }

    // Public API methods
    trackCustomEvent(eventName, eventData) {
        this.trackEvent(eventName, eventData);
    }

    getSessionData() {
        return { ...this.sessionData };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Initialize the tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.frankLabelsTracker = new FrankLabelsTracker();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrankLabelsTracker;
}
