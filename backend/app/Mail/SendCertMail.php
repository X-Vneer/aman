<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class SendCertMail extends Mailable
{
    public $to_email;
    public $name;
    public $video_title;
    public $cert_number;
    public $video_id;
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct($video_id,$to_email, $name, $video_title, $cert_number)
    {
        $this->video_id = $video_id;
        $this->name = $name;
        $this->video_title = $video_title;
        $this->cert_number = $cert_number;
        $this->to_email = $to_email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('info@inaash.edu.sa', 'Inaash'),
            to: [$this->to_email, 'info@inaash.edu.sa'],
            subject: 'Inaash Certificate',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.send-cert',
            with: [
                'name' => $this->name,
                'video_title' => $this->video_title,
                'cert_number' => $this->cert_number,
                'video_id' => $this->video_id,
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
