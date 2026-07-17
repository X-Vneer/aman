<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Validation\Rule;

class BlogRequest extends CustomFormRequest
{
    /** @var list<string> */
    private const LOCALES = ['ar', 'en'];

    public function rules(): array
    {
        $rules = [
            'slug' => [
                'nullable',
                'string',
                'max:191',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('blogs', 'slug')->ignore($this->route('blog')),
            ],
            'publish_date' => 'required|date',
            'logo' => 'nullable|string|max:191',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:191',
        ];

        foreach (self::LOCALES as $locale) {
            $rules["title.$locale"] = 'required|string|max:191';
            $rules["short_description.$locale"] = 'required|string|max:500';
            $rules["content.$locale"] = 'required|string';
        }

        return $rules;
    }
}
