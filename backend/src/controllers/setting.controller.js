const { pool } = require('../config/database');

const categoryMappings = {
    system: {
        appName: 'sys_app_name',
        systemTimezone: 'sys_timezone',
        copyrightDetails: 'sys_copyright',
        currency: 'sys_currency',
        companyAddress: 'sys_company_address',
        sellerSupportEmail: 'sys_seller_support_email',
        sellerSupportNumber: 'sys_seller_support_phone',
        checkoutType: 'sys_checkout_type',
        minimumCartAmount: 'sys_min_cart_amount',
        maximumItemsAllowedInCart: 'sys_max_cart_items',
        lowStockLimit: 'sys_low_stock_limit',
        welcomeWalletBalanceAmount: 'sys_welcome_wallet_balance',
        sellerAppMaintenanceMode: 'sys_seller_maintenance',
        sellerAppMaintenanceMessage: 'sys_seller_maintenance_msg',
        webMaintenanceMode: 'sys_web_maintenance',
        webMaintenanceMessage: 'sys_web_maintenance_msg',
        demoMode: 'sys_demo_mode',
        adminDemoModeMessage: 'sys_demo_admin_msg',
        sellerDemoModeMessage: 'sys_demo_seller_msg',
        customerDemoModeMessage: 'sys_demo_customer_msg',
        customerLocationDemoModeMessage: 'sys_demo_customer_loc_msg',
        deliveryBoyDemoModeMessage: 'sys_demo_delivery_msg'
    },
    web: {
        siteName: 'web_site_name',
        siteCopyright: 'web_site_copyright',
        address: 'web_address',
        shortDescription: 'web_short_desc',
        defaultLatitude: 'web_lat',
        defaultLongitude: 'web_lng',
        enableCountryValidation: 'web_country_validation',
        allowedCountries: 'web_allowed_countries',
        metaKeywords: 'web_meta_keywords',
        metaDescription: 'web_meta_description',
        supportEmail: 'web_support_email',
        supportNumber: 'web_support_phone',
        googleMapKey: 'web_google_map_key',
        mapIframe: 'web_map_iframe',
        facebookLink: 'web_facebook',
        instagramLink: 'web_instagram',
        xLink: 'web_x',
        youtubeLink: 'web_youtube',
        appSectionTitle: 'web_app_section_title',
        appSectionTagline: 'web_app_section_tagline',
        appSectionPlaystoreLink: 'web_play_store_link',
        appSectionAppstoreLink: 'web_app_store_link',
        appSectionShortDescription: 'web_app_section_desc',
        shippingFeatureSection: 'web_ship_feat',
        shippingFeatureSectionTitle: 'web_ship_feat_title',
        shippingFeatureSectionDescription: 'web_ship_feat_desc',
        returnFeatureSection: 'web_ret_feat',
        returnFeatureSectionTitle: 'web_ret_feat_title',
        returnFeatureSectionDescription: 'web_ret_feat_desc',
        safetySecurityFeatureSection: 'web_safe_feat',
        safetySecurityFeatureSectionTitle: 'web_safe_feat_title',
        safetySecurityFeatureSectionDescription: 'web_safe_feat_desc',
        supportFeatureSection: 'web_sup_feat',
        supportFeatureSectionTitle: 'web_sup_feat_title',
        supportFeatureSectionDescription: 'web_sup_feat_desc',
        returnRefundPolicy: 'web_return_policy',
        shippingPolicy: 'web_shipping_policy',
        privacyPolicy: 'web_privacy_policy',
        termsCondition: 'web_terms_conditions',
        aboutUs: 'web_about_us',
        pwaName: 'web_pwa_name',
        pwaDescription: 'web_pwa_desc',
        headerScript: 'web_header_script',
        footerScript: 'web_footer_script'
    },
    app: {
        customerAppstoreLink: 'customer_app_store_link',
        customerPlaystoreLink: 'customer_play_store_link',
        customerAppScheme: 'customer_app_scheme',
        sellerAppstoreLink: 'seller_app_store_link',
        sellerPlaystoreLink: 'seller_play_store_link',
        sellerAppScheme: 'seller_app_scheme',
        appDomainName: 'app_domain_name'
    },
    home_general_settings: {
        title: 'home_category_title',
        searchLabels: 'home_search_labels',
        backgroundType: 'home_bg_type',
        fontColor: 'home_font_color'
    },
    email: {
        smtpHost: 'smtp_host',
        smtpPort: 'smtp_port',
        smtpEmail: 'smtp_email',
        smtpPassword: 'smtp_password',
        smtpEncryption: 'smtp_encryption',
        smtpContentType: 'smtp_content_type'
    },
    notification: {
        firebaseProjectId: 'notify_firebase_project_id'
    },
    payment: {
        stripePayment: 'payment_stripe_enabled',
        razorpayPayment: 'payment_razorpay_enabled',
        paystackPayment: 'payment_paystack_enabled',
        flutterwavePayment: 'payment_flutterwave_enabled',
        walletPayment: 'payment_wallet_enabled',
        cod: 'payment_cod_enabled'
    },
    authentication: {
        customSms: 'auth_custom_sms_enabled',
        customSmsUrl: 'auth_custom_sms_url',
        customSmsMethod: 'auth_custom_sms_method',
        customSmsTokenAccountSid: 'auth_custom_sms_token',
        customSmsAuthToken: 'auth_custom_sms_auth_token',
        customSmsTextFormatData: 'auth_custom_sms_format_data',
        googleRecaptchaSiteKey: 'auth_google_recaptcha_site_key',
        googleApiKey: 'auth_google_api_key',
        firebase: 'auth_firebase_enabled',
        fireBaseApiKey: 'auth_firebase_api_key',
        fireBaseAuthDomain: 'auth_firebase_auth_domain',
        fireBaseDatabaseURL: 'auth_firebase_database_url',
        fireBaseProjectId: 'auth_firebase_project_id',
        fireBaseStorageBucket: 'auth_firebase_storage_bucket',
        fireBaseMessagingSenderId: 'auth_firebase_messaging_sender_id',
        fireBaseAppId: 'auth_firebase_app_id',
        fireBaseMeasurementId: 'auth_firebase_measurement_id',
        appleLogin: 'auth_social_apple_enabled',
        googleLogin: 'auth_social_google_enabled'
    },
    delivery_boy: {
        termsCondition: 'db_terms',
        privacyPolicy: 'db_privacy'
    },
    seller: {
        termsCondition: 'seller_terms',
        privacyPolicy: 'seller_privacy'
    }
};

const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT variable, value FROM settings');
        const settingsMap = {};
        
        for (const row of rows) {
            settingsMap[row.variable] = row.value;
            // Try parsing as JSON to spread keys
            try {
                const parsed = JSON.parse(row.value);
                if (parsed && typeof parsed === 'object') {
                    // Spread raw keys
                    for (const [pk, pv] of Object.entries(parsed)) {
                        settingsMap[pk] = pv;
                    }
                    // Spread mapped keys
                    const mapping = categoryMappings[row.variable];
                    if (mapping) {
                        for (const [jsonKey, reactKey] of Object.entries(mapping)) {
                            if (parsed[jsonKey] !== undefined) {
                                let val = parsed[jsonKey];
                                if (Array.isArray(val)) {
                                    val = val.join(',');
                                }
                                settingsMap[reactKey] = val;
                            }
                        }
                    }
                }
            } catch (e) {
                // Not JSON, just keep the raw variable value
            }
        }

        res.json({
            success: true,
            data: settingsMap
        });
    } catch (error) {
        console.error('getSettings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings: ' + error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const settingsToUpdate = req.body;
        
        if (!settingsToUpdate || typeof settingsToUpdate !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid payload. Expected object of key-value pairs.' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // First, fetch the current JSON variables from the database
            const [rows] = await connection.query('SELECT variable, value FROM settings');
            const currentSettings = {};
            for (const row of rows) {
                currentSettings[row.variable] = row.value;
            }

            // We will collect updates for each JSON category variable
            const categoryUpdates = {};

            // For each flat key in the incoming payload:
            for (const [key, value] of Object.entries(settingsToUpdate)) {
                // Find if this key maps to any JSON category
                let mapped = false;
                for (const [category, mapping] of Object.entries(categoryMappings)) {
                    for (const [jsonKey, reactKey] of Object.entries(mapping)) {
                        if (key === reactKey || key === jsonKey) {
                            mapped = true;
                            if (!categoryUpdates[category]) {
                                categoryUpdates[category] = {};
                                // Parse existing JSON value if present
                                if (currentSettings[category]) {
                                    try {
                                        categoryUpdates[category] = JSON.parse(currentSettings[category]);
                                    } catch (e) {
                                        // Ignore parsing error, start fresh
                                    }
                                }
                            }
                            // Set the value in both types: convert boolean strings if appropriate
                            let valToSet = value;
                            if (value === 'true') valToSet = true;
                            if (value === 'false') valToSet = false;

                            // Special array conversions for specific keys
                            if (reactKey === 'home_search_labels' || reactKey === 'web_allowed_countries') {
                                if (typeof value === 'string') {
                                    valToSet = value.split(',').map(s => s.trim()).filter(Boolean);
                                }
                            }

                            categoryUpdates[category][jsonKey] = valToSet;
                        }
                    }
                }

                // Also save the flat key directly in settings (ON DUPLICATE KEY UPDATE)
                const stringValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
                await connection.query(
                    `INSERT INTO settings (variable, value, created_at, updated_at) 
                     VALUES (?, ?, NOW(), NOW()) 
                     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
                    [key, stringValue]
                );
            }

            // Now, save the updated JSON objects back to settings
            for (const [category, objValue] of Object.entries(categoryUpdates)) {
                const jsonString = JSON.stringify(objValue);
                await connection.query(
                    `INSERT INTO settings (variable, value, created_at, updated_at) 
                     VALUES (?, ?, NOW(), NOW()) 
                     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
                    [category, jsonString]
                );
            }

            await connection.commit();
            res.json({ success: true, message: 'Settings updated successfully' });
        } catch (txnError) {
            await connection.rollback();
            throw txnError;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('updateSettings error:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings: ' + error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
