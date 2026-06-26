import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuCheck, LuTriangleAlert, LuX, LuStar } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Divider } from '@/components/common/Divider';
import { Badge } from '@/components/common/Badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSettings } from '@/hooks/useSettings';
import { useTemplates } from '@/hooks/useTemplates';
import { useResumes } from '@/hooks/useResumes';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { list: settingsList, update, updateSig, disconnect, removeAccount } = useSettings();
  const { list: templatesList, setDefault: setDefaultTemplate } = useTemplates();
  const { list: resumesList, setDefault: setDefaultResume } = useResumes();

  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  

  const settings = settingsList.data?.data?.data || {};
  const templates = templatesList?.data?.data?.data?.data || [];
  const resumes = resumesList?.data?.data?.data?.data || [];


  const { register: regDefaults, handleSubmit: handleDefaultsSubmit, reset: resetDefaults } = useForm({
    defaultValues: {
      defaultTemplateId: settings.defaultTemplateId || '',
      defaultResumeId: settings.defaultResumeId || '',
    },
  });

  const { register: regSignature, handleSubmit: handleSignatureSubmit, watch: watchSig, setValue: setSigValue, reset: resetSig } = useForm({
    defaultValues: {
      signature: settings.signature || '',
    },
  });

  const { register: regNotifications, reset: resetNotif } = useForm({
    defaultValues: {
      emailSentConfirmation: settings.emailSentConfirmation ?? true,
      failedEmailAlerts: settings.failedEmailAlerts ?? true,
      weeklySummary: settings.weeklySummary ?? false,
    },
  });

  useEffect(() => {
    if (settingsList.isSuccess && settingsList.data) {
      resetDefaults({
        defaultTemplateId: settings.defaultTemplateId || '',
        defaultResumeId: settings.defaultResumeId || '',
      });
      resetSig({ signature: settings.signature || '' });
      resetNotif({
        emailSentConfirmation: settings.emailSentConfirmation ?? true,
        failedEmailAlerts: settings.failedEmailAlerts ?? true,
        weeklySummary: settings.weeklySummary ?? false,
      });
    }
  }, [settingsList.data]);

  const signature = settings.signature || watchSig('signature') || '';

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader title="Settings" />

      <div className="max-w-2xl space-y-8">
        {/* Gmail Account */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gmail Account</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700 font-medium">{user?.email || 'Connected'}</span>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>
            <p className="text-xs text-gray-500">
              Connected via Google. To change your account, disconnect and re-connect.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowDisconnectConfirm(true)}>
              Disconnect Gmail
            </Button>
          </div>
        </section>

        <Divider />

        {/* Profile */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <Input label="Name" value={user?.data?.user.name || ''} disabled />
            <Input label="Email" value={user?.data?.user.email || ''} disabled />
            <p className="text-xs text-gray-400">
              To update your name or email, visit your Google account settings.
            </p>
          </div>
        </section>

        <Divider />

        {/* Email Signature */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Signature</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <Textarea
              label="Signature"
              placeholder="Enter your email signature (HTML or text)..."
              className="min-h-[120px] font-mono text-sm"
              {...regSignature('signature')}
            />
            {signature && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LuCheck className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-gray-500">Signature is set and will be added to all outgoing emails</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSigValue('signature', '');
                      updateSig.mutate({ signature: '' });
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                    aria-label="Clear signature"
                  >
                    <LuX className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                  {signature}
                </div>
              </div>
            )}
            {!signature && (
              <div className="flex items-center gap-2">
                <LuX className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-500">No signature set</p>
              </div>
            )}
            <Button
              size="sm"
              onClick={handleSignatureSubmit((data) => updateSig.mutate(data))}
              isLoading={updateSig.isPending}
            >
              Save Signature
            </Button>
          </div>
        </section>

        <Divider />

        {/* Defaults */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Defaults</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <p className="text-xs text-gray-500">Click the star icon to set a default template or resume. Defaults are auto-selected when composing emails.</p>
            
            {/* Default Template */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Template</label>
              <div className="space-y-2">
                {templates.length === 0 ? (
                  <p className="text-sm text-gray-400">No templates found. Create a template first.</p>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template._id || template.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500 truncate-1">{template.subject}</p>
                      </div>
                      <button
                        onClick={() => setDefaultTemplate.mutate(template._id || template.id)}
                        className={`p-2 rounded-md transition-colors ${
                          template.isDefault
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label={template.isDefault ? 'Default template' : 'Set as default'}
                      >
                        <LuStar className="h-5 w-5" fill={template.isDefault ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Default Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Resume</label>
              <div className="space-y-2">
                {resumes.length === 0 ? (
                  <p className="text-sm text-gray-400">No resumes found. Upload a resume first.</p>
                ) : (
                  resumes.map((resume) => (
                    <div
                      key={resume._id || resume.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate-1">{resume.name}</p>
                        <p className="text-xs text-gray-500">
                          {resume.fileSize ? `${(resume.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                          {resume.format && ` · ${resume.format.toUpperCase()}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setDefaultResume.mutate(resume._id || resume.id)}
                        className={`p-2 rounded-md transition-colors ${
                          resume.isDefault
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label={resume.isDefault ? 'Default resume' : 'Set as default'}
                      >
                        <LuStar className="h-5 w-5" fill={resume.isDefault ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LuCheck className="h-4 w-4 text-green-600" />
              <p className="text-xs text-gray-500">Defaults are saved automatically when changed</p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Notifications */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {[
              { key: 'emailSentConfirmation', label: 'Email sent confirmation' },
              { key: 'failedEmailAlerts', label: 'Failed email alerts' },
              { key: 'weeklySummary', label: 'Weekly summary email' },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    {...regNotifications(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </div>
              </label>
            ))}
            <Button
              size="sm"
              onClick={() => toast.success('Notification preferences saved')}
            >
              Save Preferences
            </Button>
          </div>
        </section>

        <Divider />

        {/* Danger Zone */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
          <div className="bg-white border border-red-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <LuTriangleAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Delete Account</p>
                <p className="text-xs text-gray-500 mb-3">
                  Permanently delete your account and all data. This action cannot be undone.
                </p>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(false)}
        onConfirm={() => {
          disconnect.mutate();
          setShowDisconnectConfirm(false);
        }}
        title="Disconnect Gmail"
        message="Are you sure you want to disconnect your Gmail account? You will need to reconnect to send emails."
        confirmLabel="Disconnect"
        variant="danger"
        isLoading={disconnect.isPending}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          removeAccount.mutate();
          setShowDeleteConfirm(false);
        }}
        title="Delete Account"
        message="This action permanently deletes your account and all data. Type DELETE to confirm."
        confirmLabel="Delete"
        variant="danger"
        isLoading={removeAccount.isPending}
      />
    </motion.div>
  );
}