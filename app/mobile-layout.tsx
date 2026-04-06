'use client';

import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, people, notifications as notifIcon, settings } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

export default function MobileLayout() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [Preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Only load if running in Capacitor environment
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          const { Preferences } = await import('@capacitor/preferences');
          setPreferences(Preferences);
          
          // Load saved language
          try {
            const { value } = await Preferences.get({ key: 'app_language' });
            if (value === 'en' || value === 'ar') {
              setLanguage(value as 'en' | 'ar');
            }
          } catch (err) {
            console.error('Failed to load language preference', err);
          }
        }
        setPreferencesLoaded(true);
      } catch (err) {
        console.error('Failed to load preferences', err);
        setPreferencesLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  const changeLanguage = async (lang: 'en' | 'ar') => {
    setLanguage(lang);
    
    if (Preferences) {
      try {
        await Preferences.set({ key: 'app_language', value: lang });
      } catch (err) {
        console.error('Failed to save language preference', err);
      }
    }

    // Reload all iframes with new language parameter
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const url = new URL(iframe.src);
        url.searchParams.set('lang', lang);
        (iframe as HTMLIFrameElement).src = url.toString();
      } catch (e) {
        console.error('Iframe URL error', e);
      }
    });
  };

  // Show loading while preferences are loading
  if (!preferencesLoaded) {
    return (
      <IonApp>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f8f9fa'
        }}>
          <div>Loading...</div>
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route 
              exact 
              path="/home" 
              render={() => (
                <div style={{ width: '100%', height: '100vh' }}>
                  <iframe
                    src={`https://ashilara.online/?lang=${language}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Home"
                  />
                </div>
              )} 
            />
            <Route 
              exact 
              path="/candidates" 
              render={() => (
                <div style={{ width: '100%', height: '100vh' }}>
                  <iframe
                    src={`https://ashilara.online/#hire?lang=${language}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Candidates"
                  />
                </div>
              )} 
            />
            <Route 
              exact 
              path="/notifications" 
              render={() => (
                <div style={{ padding: '20px', height: '100vh' }}>
                  <h2>Notifications</h2>
                  <p>New CV alerts will appear here.</p>
                </div>
              )} 
            />
            <Route 
              exact 
              path="/settings" 
              render={() => (
                <div style={{ padding: '20px', height: '100vh' }}>
                  <h2>Settings</h2>
                  <button
                    onClick={() => changeLanguage('en')}
                    style={{ 
                      margin: '10px', 
                      padding: '12px 20px', 
                      background: '#3880ff', 
                      color: '#fff', 
                      borderRadius: '8px', 
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    English 🇺🇸
                  </button>
                  <button
                    onClick={() => changeLanguage('ar')}
                    style={{ 
                      margin: '10px', 
                      padding: '12px 20px', 
                      background: '#3880ff', 
                      color: '#fff', 
                      borderRadius: '8px', 
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    العربية 🇸🇦
                  </button>
                  <p style={{ marginTop: '20px' }}>
                    Current language: <b>{language === 'en' ? 'English' : 'Arabic'}</b>
                  </p>
                </div>
              )} 
            />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="candidates" href="/candidates">
              <IonIcon icon={people} />
              <IonLabel>Candidates</IonLabel>
            </IonTabButton>
            <IonTabButton tab="notifications" href="/notifications">
              <IonIcon icon={notifIcon} />
              <IonLabel>Alerts</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}