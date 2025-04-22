
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateTicketFormProps {
  onSubmit: (subject: string, message: string) => Promise<boolean>;
}

export function CreateTicketForm({ onSubmit }: CreateTicketFormProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit(subject, message);
    if (success) {
      setSubject('');
      setMessage('');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="What's your issue about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Describe your issue in detail..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
      </Button>
    </form>
  );
}
