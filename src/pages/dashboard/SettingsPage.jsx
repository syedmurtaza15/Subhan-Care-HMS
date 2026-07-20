import { Bell, Lock, Globe, Palette } from 'lucide-react';
import { Card, Input } from '../../components/ui';
import { INPUT_TYPES } from '../../constants/ui';
import './SettingsPage.css';

const SettingsPage = () => {
  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <div>
          <span className="placeholder-page__eyebrow">Account</span>
          <h1>Settings</h1>
          <p>Personalize how Subhan Care looks and notifies you.</p>
        </div>
      </header>

      <div className="settings-grid">
        <Card title="Notifications" subtitle="Decide which alerts reach you.">
          <ul className="settings-list">
            <li className="settings-list__row">
              <span className="settings-list__icon" aria-hidden="true">
                <Bell size={16} />
              </span>
              <div>
                <p className="settings-list__title">Email notifications</p>
                <p className="settings-list__sub">Daily digest at 8:00 AM</p>
              </div>
              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </li>
            <li className="settings-list__row">
              <span className="settings-list__icon" aria-hidden="true">
                <Bell size={16} />
              </span>
              <div>
                <p className="settings-list__title">Appointment reminders</p>
                <p className="settings-list__sub">SMS / push 30 min before</p>
              </div>
              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </li>
          </ul>
        </Card>

        <Card title="Security" subtitle="Two-factor and password rotation.">
          <ul className="settings-list">
            <li className="settings-list__row">
              <span className="settings-list__icon" aria-hidden="true">
                <Lock size={16} />
              </span>
              <div>
                <p className="settings-list__title">Two-factor authentication</p>
                <p className="settings-list__sub">Add an extra step on sign-in</p>
              </div>
              <label className="settings-switch">
                <input type="checkbox" />
                <span />
              </label>
            </li>
          </ul>
          <div className="settings-fields">
            <Input
              label="New password"
              type={INPUT_TYPES.PASSWORD}
              placeholder="Choose a strong password"
              helperText="Pick something you'll remember, but hard to guess."
            />
          </div>
        </Card>

        <Card title="Preferences" subtitle="Look-and-feel personalization.">
          <ul className="settings-list">
            <li className="settings-list__row">
              <span className="settings-list__icon" aria-hidden="true">
                <Globe size={16} />
              </span>
              <div>
                <p className="settings-list__title">Language</p>
                <p className="settings-list__sub">English (US) selected</p>
              </div>
            </li>
            <li className="settings-list__row">
              <span className="settings-list__icon" aria-hidden="true">
                <Palette size={16} />
              </span>
              <div>
                <p className="settings-list__title">Accent color</p>
                <p className="settings-list__sub">Subhan Care blue · #2563EB</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
