<?php

namespace App\Http\Requests;

use App\Enums\VideoStatus;
use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class VideoStoreRequest extends CustomFormRequest
{
    protected $roles = [
        "video_url" => "array",
        "video_url.ar" => "required|url|min:1|max:500",
        "video_url.en" => "required|url|min:1|max:500",
        "logo" => "required|min:1|max:500",
        "title" => "array",
        "title.ar" => "required|min:1|max:500",
        "title.en" => "required|min:1|max:500",
        "description" => "array",
        "description.ar" => "required|min:1|max:1000",
        "description.en" => "required|min:1|max:1000",
        "length" => ["required", "time_format", "max:191"],
        "color" => "required|min:1|max:10",
        "is_new" => "nullable|integer|in:0,1",
    ];

    public function rules()
    {
        return array_merge($this->roles, [
            "status" => [
                "nullable",
                "string",
                Rule::in(
                    array_map(
                        fn(VideoStatus $c) => $c->value,
                        VideoStatus::cases(),
                    ),
                ),
            ],
        ]);
    }

    /**
     * Accept true/false/1/0 (and string "1"/"0"/"true"/"false"); null becomes 0.
     * Omitted key stays omitted so updates can leave the column unchanged.
     */
    protected function normalizeIsNew(): void
    {
        if (!$this->has("is_new")) {
            return;
        }

        $v = $this->input("is_new");
        if ($v === null) {
            $this->merge(["is_new" => 0]);

            return;
        }

        if ($v === true || $v === 1 || $v === "1") {
            $this->merge(["is_new" => 1]);

            return;
        }

        if ($v === false || $v === 0 || $v === "0") {
            $this->merge(["is_new" => 0]);

            return;
        }

        if (is_string($v)) {
            $lower = strtolower($v);
            if ($lower === "true") {
                $this->merge(["is_new" => 1]);

                return;
            }
            if ($lower === "false") {
                $this->merge(["is_new" => 0]);
            }
        }
    }

    protected function normalizeStatus(): void
    {
        if (!$this->has("status")) {
            return;
        }

        $v = $this->input("status");
        if ($v === null || $v === "") {
            $this->merge(["status" => null]);
        }
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        $this->normalizeIsNew();
        $this->normalizeStatus();
        if ($this->isMethod("put")) {
            $this->merge(["id" => $this->route("video")]);
            $this->roles["id"] = "required|exists:videos,id";
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {});
    }
}
