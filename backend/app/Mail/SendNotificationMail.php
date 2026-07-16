<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class SendNotificationMail extends Mailable
{
    public $to_email;
    public $title;
    public $body;
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct($to_email, $title, $body)
    {
        $this->title = $title;
        $this->body = $body;
        $this->to_email = $to_email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('info@inaash.edu.sa', 'Inaash'),
            to: [$this->to_email],
            subject: 'Inaash: ' . $this->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.send-notification',
            with: [
                'title' => $this->title,
                'body' => $this->body
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
