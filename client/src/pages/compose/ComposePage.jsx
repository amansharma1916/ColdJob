import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuX, LuPlus, LuUpload, LuSend, LuEye, LuSparkles, LuUserPlus, LuFileDown } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/modals/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { isValidEmail } from '@/utils/validateEmail';
import { useEmails } from '@/hooks/useEmails';
import { useTemplates } from '@/hooks/useTemplates';
import { useResumes } from '@/hooks/useResumes';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const composeSchema = z.object({
  recipientEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactId: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject too long'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  templateId: z.string().optional(),
  resumeId: z.string().optional(),
  sendMode: z.enum(['now', 'bulk']),
  contactIds: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.sendMode === 'bulk') {
    return data.contactIds && data.contactIds.length > 0;
  }
  return data.recipientEmail || data.contactId;
}, {
  message: 'Select a recipient or enter an email address',
  path: ['recipientEmail'],
});

export function ComposePage() {
  const navigate = useNavigate();
  const { send, sendBulk, preview } = useEmails();
  const { list: templatesList } = useTemplates();
  const { list: resumesList } = useResumes();
  const { list: contactsList } = useContacts();
  const { user } = useAuth();

  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [manualEmailList, setManualEmailList] = useState([]);
  const [manualEmailInput, setManualEmailInput] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const bodyRef = useRef(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      recipientEmail: '',
      contactId: '',
      subject: '',
      body: '',
      templateId: '',
      resumeId: '',
      sendMode: 'now',
      contactIds: [],
    },
  });

  const subject = watch('subject');
  const body = watch('body');
  const templateId = watch('templateId');
  const contactId = watch('contactId');
  const recipientEmail = watch('recipientEmail');
  const sendMode = watch('sendMode');

  const templates = templatesList?.data?.data?.data?.data || [];
  const resumes = resumesList?.data?.data?.data?.data || [];
  const contacts = contactsList?.data?.data?.data?.data || [];

  // Auto-select default template and resume on load
  useEffect(() => {
    if (templates.length > 0 && !watch('templateId')) {
      const defaultTemplate = templates.find((t) => t.isDefault);
      if (defaultTemplate) {
        handleTemplateSelect(defaultTemplate._id || defaultTemplate.id);
      }
    }
    if (resumes.length > 0 && !watch('resumeId')) {
      const defaultResume = resumes.find((r) => r.isDefault);
      if (defaultResume) {
        setValue('resumeId', defaultResume._id || defaultResume.id);
      }
    }
  }, [templates.length, resumes.length]);

  const handleTemplateSelect = (id) => {
    setValue('templateId', id);
    if (id) {
      const template = templates.find((t) => t._id === id || t.id === id);
      if (template) {
        if (template.subject && !watch('subject')) {
          setValue('subject', template.subject);
        }
        if (template.body) {
          setValue('body', template.body);
        }
      }
    }
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('#email-body');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentBody = watch('body') || '';
      const newBody = currentBody.substring(0, start) + `{{${variable}}}` + currentBody.substring(end);
      setValue('body', newBody);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const extractVariables = (text) => {
    if (!text) return [];
    const matches = text.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/\{|\}/g, '')))];
  };

  const variables = extractVariables(watch('body'));

  const handlePreview = async () => {
    try {
      const payload = {
        templateId: watch('templateId') || '',
        contactId: contactId || '',
        recipientEmail: recipientEmail?.trim() || '',
      };
      const result = await preview.mutateAsync(payload);
      setPreviewData(result);
    } catch {
      // Error handled by hook
    }
  };

  const handleSendClick = () => {
    if (sendMode === 'bulk') {
      if (selectedContactIds.length === 0 && manualEmailList.length === 0) {
        toast.error('Add at least one recipient (contact or manual email)');
        return;
      }
      setShowConfirmSend(true);
    } else {
      if (!recipientEmail?.trim() && !contactId) {
        toast.error('Select a recipient or enter an email');
        return;
      }
      setShowConfirmSend(true);
    }
  };

  const buildPayload = (overrides = {}) => {
    const payload = {
      ...(recipientEmail?.trim() ? { recipientEmail: recipientEmail.trim() } : {}),
      ...(contactId ? { contactId } : {}),
      subject: watch('subject'),
      body: watch('body'),
    };

    const templateId = watch('templateId');
    const resumeId = watch('resumeId');
    if (templateId) payload.templateId = templateId;
    if (resumeId) payload.resumeId = resumeId;

    return { ...payload, ...overrides };
  };

  const doSend = async () => {
    setIsSending(true);
    try {
      await send.mutateAsync(buildPayload());
      reset();
      setValue('recipientEmail', '');
      setValue('contactId', '');
      navigate('/history');
    } catch {
      // Error handled by hook
    } finally {
      setIsSending(false);
      setShowConfirmSend(false);
    }
  };

  const doSendBulk = async () => {
    setIsSending(true);
    try {
      await sendBulk.mutateAsync(buildPayload({
        contactIds: selectedContactIds,
        manualEmails: manualEmailList,
      }));
      reset();
      setSelectedContactIds([]);
      setManualEmailList([]);
      setValue('contactIds', []);
      navigate('/history');
    } catch {
      // Error handled by hook
    } finally {
      setIsSending(false);
      setShowConfirmSend(false);
    }
  };

  const handleContactSelect = (contact) => {
    if (sendMode === 'bulk') {
      if (!selectedContactIds.includes(contact._id || contact.id)) {
        const newIds = [...selectedContactIds, contact._id || contact.id];
        setSelectedContactIds(newIds);
        setValue('contactIds', newIds);
      }
    } else {
      setValue('contactId', contact._id || contact.id);
      if (contact.email) {
        setValue('recipientEmail', contact.email);
      }
    }
    setShowContactModal(false);
  };

  const removeSelectedContact = (contactId) => {
    const newIds = selectedContactIds.filter((id) => id !== contactId);
    setSelectedContactIds(newIds);
    setValue('contactIds', newIds);
  };

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader title="Compose Email" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <div className="space-y-6">
            {/* Send Mode */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      value="now"
                      {...register('sendMode')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Send to one recipient
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      value="bulk"
                      {...register('sendMode')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Bulk send to contacts
                  </label>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              {sendMode === 'now' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                    <Input
                      placeholder="recipient@example.com"
                      error={errors.recipientEmail?.message}
                      {...register('recipientEmail')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or select from contacts</label>
                    <Select
                      placeholder="Select contact"
                      options={contacts.map((c) => ({
                        value: c._id || c.id,
                        label: `${c.firstName} ${c.lastName} (${c.email})`,
                      }))}
                      value={contactId}
                      onChange={(e) => {
                        setValue('contactId', e.target.value);
                        const contact = contacts.find((c) => (c._id || c.id) === e.target.value);
                        if (contact?.email) {
                          setValue('recipientEmail', contact.email);
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manual Email Input</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address"
                        value={manualEmailInput}
                        onChange={(e) => setManualEmailInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const email = manualEmailInput.trim();
                          if (!email) return;
                          if (!isValidEmail(email)) {
                            toast.error('Invalid email address');
                            return;
                          }
                          if (manualEmailList.includes(email)) {
                            toast.error('Email already added');
                            return;
                          }
                          setManualEmailList((prev) => [...prev, email]);
                          setManualEmailInput('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {manualEmailList.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {manualEmailList.map((email) => (
                          <span key={email} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md">
                            {email}
                            <button type="button" onClick={() => setManualEmailList((prev) => prev.filter((e) => e !== email))} className="hover:text-purple-900" aria-label={`Remove ${email}`}>
                              <LuX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or select from contacts</label>
                    <button
                      type="button"
                      onClick={() => setShowContactModal(true)}
                      className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {selectedContactIds.length === 0 ? 'Choose contacts...' : `${selectedContactIds.length} contact(s) selected`}
                    </button>
                    {selectedContactIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedContactIds.map((id) => {
                          const contact = contacts.find((c) => (c._id || c.id) === id);
                          return (
                            <span key={id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
                              {contact ? `${contact.firstName} ${contact.lastName}` : id}
                              <button type="button" onClick={() => removeSelectedContact(id)} className="hover:text-blue-900" aria-label={`Remove ${id}`}>
                                <LuX className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Email Configuration */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="relative">
                <Input
                  label="Subject"
                  placeholder="Enter email subject..."
                  error={errors.subject?.message}
                  {...register('subject')}
                />
                {subject && subject.length > 100 && (
                  <span className="absolute right-3 bottom-2 text-xs text-gray-400">
                    {subject.length}/200
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Template"
                  placeholder="No template"
                  options={templates.map((t) => ({
                    value: t._id || t.id,
                    label: t.name,
                  }))}
                  value={templateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                />
                <Select
                  label="Resume"
                  placeholder="No resume"
                  options={resumes.map((r) => ({
                    value: r._id || r.id,
                    label: r.name,
                  }))}
                  value={watch('resumeId')}
                  onChange={(e) => setValue('resumeId', e.target.value)}
                />
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="relative">
                <Textarea
                  id="email-body"
                  label="Email Body"
                  placeholder="Write your email here..."
                  className="min-h-[240px] font-mono text-sm"
                  error={errors.body?.message}
                  {...register('body')}
                />
                {body && body.length > 100 && (
                  <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {body.length}/50000
                  </span>
                )}
              </div>

              {variables.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Variables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {variables.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {'{{'}{v}{'}}'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={LuSparkles}
                onClick={() => toast('Coming soon', { icon: '✨' })}
              >
                Use AI to improve
              </Button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              {/* <Button type="button" variant="outline" leftIcon={LuEye} onClick={handlePreview}>
                Preview
              </Button> */}
              <Button
                type="button"
                leftIcon={LuSend}
                isLoading={isSending}
                disabled={sendMode === 'bulk' ? (selectedContactIds.length === 0 && manualEmailList.length === 0) : !recipientEmail?.trim() && !contactId}
                onClick={handleSendClick}
              >
                {sendMode === 'bulk' ? 'Send Bulk' : 'Send'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right - Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Preview</h3>
            {previewData ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Subject:</span> {previewData.subject}
                </div>
                <hr className="border-gray-100" />
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {previewData.body}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">From:</span> {user?.email || 'connected@gmail.com'}
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">To:</span>{' '}
                  {sendMode === 'bulk' ? `${selectedContactIds.length + manualEmailList.length} recipients` : (recipientEmail || contactId ? (contacts.find(c => (c._id || c.id) === contactId)?.email || recipientEmail) : 'recipient@example.com')}
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Subject:</span>{' '}
                  {subject || 'Email subject'}
                </div>
                <hr className="border-gray-100" />
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {body || 'Your email content will appear here...'}
                </div>
                {watch('resumeId') && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-md p-2">
                    <LuFileDown className="h-3 w-3" />
                    Resume attached
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Selection Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Select Contacts" size="lg">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No contacts found</p>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact._id || contact.id}
                type="button"
                onClick={() => handleContactSelect(contact)}
                className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">
                  {contact.firstName} {contact.lastName}
                </p>
                <p className="text-xs text-gray-500">{contact.email}</p>
              </button>
            ))
          )}
        </div>
      </Modal>

      {/* Send Confirmation */}
      <ConfirmDialog
        isOpen={showConfirmSend}
        onClose={() => setShowConfirmSend(false)}
        onConfirm={sendMode === 'bulk' ? doSendBulk : doSend}
        title="Send Email"
        message={sendMode === 'bulk' ? `Send email to ${selectedContactIds.length + manualEmailList.length} recipients?` : 'Send this email?'}
        confirmLabel="Send"
        isLoading={isSending}
      />
    </motion.div>
  );
}