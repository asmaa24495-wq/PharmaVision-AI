import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Lock, 
  Download, 
  Info,
  ChevronRight,
  Check,
  Camera
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isRtl: boolean;
  userProfile: {
    name: string;
    title: string;
    email: string;
    avatar: string;
  };
  setUserProfile?: (profile: any) => void;
  pushEnabled: boolean;
  setPushEnabled: (val: boolean) => void;
  emailEnabled: boolean;
  setEmailEnabled: (val: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (val: boolean) => void;
}

const SettingsSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-blue-600">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <div className="flex items-center gap-2">
      {children}
    </div>
  </div>
);

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
      enabled ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        enabled ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

export default function SettingsView({ 
  darkMode, 
  setDarkMode, 
  isRtl, 
  userProfile, 
  setUserProfile, 
  pushEnabled, 
  setPushEnabled,
  emailEnabled,
  setEmailEnabled,
  twoFactorEnabled,
  setTwoFactorEnabled
}: SettingsViewProps) {
  const { t, i18n } = useTranslation();
  
  const [localProfile, setLocalProfile] = React.useState(userProfile);
  const [localPushEnabled, setLocalPushEnabled] = React.useState(pushEnabled);
  const [localEmailEnabled, setLocalEmailEnabled] = React.useState(emailEnabled);
  const [localTwoFactorEnabled, setLocalTwoFactorEnabled] = React.useState(twoFactorEnabled);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const handleSave = async () => {
    const loadingToast = toast.loading(isRtl ? 'جاري الحفظ...' : 'Saving changes...');
    try {
      if (setUserProfile) {
        await setUserProfile(localProfile);
      }
      if (setPushEnabled) await setPushEnabled(localPushEnabled);
      if (setEmailEnabled) await setEmailEnabled(localEmailEnabled);
      if (setTwoFactorEnabled) await setTwoFactorEnabled(localTwoFactorEnabled);
      
      toast.success(isRtl ? 'تم حفظ التغييرات بنجاح' : 'Settings saved successfully', { id: loadingToast });
    } catch (error) {
      toast.error(isRtl ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings', { id: loadingToast });
    }
  };

  const handleReset = () => {
    setLocalProfile(userProfile);
    setLocalPushEnabled(pushEnabled);
    setLocalEmailEnabled(emailEnabled);
    setLocalTwoFactorEnabled(twoFactorEnabled);
    
    console.log('Settings reset to defaults');
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({ ...localProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <SettingsSection title={t('profileInfo')} icon={User}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <img src={localProfile.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={handleAvatarChange}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{localProfile.name}</h4>
                <p className="text-xs text-slate-400">{localProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('fullName')}</label>
                <input 
                  type="text" 
                  value={localProfile.name} 
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('jobTitle')}</label>
                <input 
                  type="text" 
                  value={localProfile.title} 
                  onChange={(e) => setLocalProfile({ ...localProfile, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('emailAddress')}</label>
              <input 
                type="email" 
                value={localProfile.email} 
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('notificationPrefs')}</h5>
              <SettingItem 
                label={t('pushNotifications')} 
                description="Receive real-time alerts on your mobile device."
              >
                <Toggle enabled={localPushEnabled} onChange={() => setLocalPushEnabled(!localPushEnabled)} />
              </SettingItem>
              
              <SettingItem 
                label={t('emailAlerts')} 
                description="Daily summary reports and critical market alerts."
              >
                <Toggle enabled={localEmailEnabled} onChange={() => setLocalEmailEnabled(!localEmailEnabled)} />
              </SettingItem>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title={t('securityPrivacy')} icon={Shield}>
          <div className="space-y-6">
            <SettingItem 
              label={t('twoFactorAuth')} 
              description="Add an extra layer of security to your account."
            >
              <button 
                onClick={() => setLocalTwoFactorEnabled(!localTwoFactorEnabled)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  localTwoFactorEnabled ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {localTwoFactorEnabled ? "Enabled" : "Enable"}
              </button>
            </SettingItem>

            <SettingItem 
              label="Password" 
              description="Last changed 3 months ago."
            >
              <button 
                onClick={() => console.log("Password Change Requested", "A secure reset link has been sent to your registered email.")}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Change
              </button>
            </SettingItem>

            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
              <div className="flex gap-3">
                <Lock className="text-blue-600 shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-100">Enterprise Security Active</p>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5">Your data is protected by 256-bit encryption and enterprise-grade firewalls.</p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Appearance & Language */}
        <SettingsSection title={t('languageRegion')} icon={Globe}>
          <div className="space-y-6">
            <SettingItem label={t('languageRegion')}>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <Globe size={16} />
                <span className="uppercase">{i18n.language}</span>
                <ChevronRight size={14} className={cn("text-slate-400", isRtl ? "rotate-180" : "")} />
              </button>
            </SettingItem>

            <SettingItem label={t('themeMode')}>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setDarkMode(false)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    !darkMode ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"
                  )}
                >
                  <Sun size={14} /> Light
                </button>
                <button 
                  onClick={() => setDarkMode(true)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    darkMode ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"
                  )}
                >
                  <Moon size={14} /> Dark
                </button>
              </div>
            </SettingItem>
          </div>
        </SettingsSection>
      </div>

      {/* App Info & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400">
            <Info size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{t('appName')} Enterprise</p>
            <p className="text-xs text-slate-400">{t('appVersion')}: 2.4.0-stable</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            {t('resetDefaults')}
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Check size={18} />
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
