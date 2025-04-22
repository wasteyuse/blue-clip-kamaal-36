
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CreateTicketFormProps {
  onSubmit: (subject: string, message: string) => Promise<boolean>;
}

export function CreateTicketForm({ onSubmit }: CreateTicketFormProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ subject: '', message: '' });

  const validateForm = () => {
    const newErrors = { subject: '', message: '' };
    let isValid = true;

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(subject, message);
      if (success) {
        setSubject('');
        setMessage('');
        setErrors({ subject: '', message: '' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="What's your issue about?"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
          }}
          className={errors.subject ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-500">{errors.subject}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Describe your issue in detail..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
          }}
          className={`min-h-[100px] ${errors.message ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Ticket'
        )}
      </Button>
    </form>
  );
}
