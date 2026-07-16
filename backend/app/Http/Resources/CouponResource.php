<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        // Set default date_from based on dates selection
        if ($request->dates && !$request->date_from && !$request->date_to) {
            $dateFromOptions = [
                'hourly' => Carbon::now()->startOfDay(),
                'daily'  => Carbon::now()->startOfMonth(),
                'weekly' => Carbon::now()->startOfWeek(),
                'monthly'=> Carbon::now()->startOfYear(),
                'yearly' => Carbon::now()->subYears(3),
            ];

            if (isset($dateFromOptions[$request->dates])) {
                $request->merge(['date_from' => $dateFromOptions[$request->dates]]);
            }
        }

        // Start building the query
        $query = $this->userVideos();

        // Apply date filters if any
        if ($request->date_from && $request->date_to) {
            $query->whereBetween('created_at', [$request->date_from, $request->date_to]);
        } elseif ($request->date_from) {
            $query->where('created_at', '>=', $request->date_from);
        } elseif ($request->date_to) {
            $query->where('created_at', '<=', $request->date_to);
        }

        // Get the data
        $paid_amount_after_discount = $query->sum('final_price');
        $number_of_users = $query->count();
        $paid_amount = $query->sum('price');

        // Build the response
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'type' => $this->type,
            'amount' => $this->amount,
            'date_start' => $this->date_start,
            'date_end' => $this->date_end,
            'max_uses' => $this->max_uses,
            'has_form' => $this->has_form,
            'max_customer_uses' => $this->max_customer_uses,
            'uses_count' => $this->uses_count,
            'paid_amount' => $paid_amount,
            'number_of_users' => $number_of_users,
            'paid_amount_after_discount' => $paid_amount_after_discount,
            'discount_amount' => $this->discount_amount,
            'status' => $this->status,
            'deleted_at' => $this->deleted_at,
        ];


        $data =  toString($data);
        $data['video_ids'] = $this->video_ids;
        $data['langs'] = $this->langs;
        $data['has_form'] = $this->has_form? true : false;
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
