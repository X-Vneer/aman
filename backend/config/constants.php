<?php

return [
    'per_page' => 20,
    'list_validations' => [
        'per_page' => 'nullable|numeric|min:1|max:100',
        'page' => 'nullable|numeric|min:1|max:1000',
        'sort_direction' => 'nullable|in:ASC,DESC',
        'date_from' => 'nullable|date_format:Y-m-d\TH:i:s.v\Z',
        'date_to' => 'nullable|date_format:Y-m-d\TH:i:s.v\Z', 
    ],
    
    'otpDelay' => 0,

    'gender' => ['Male', 'Female'],
];