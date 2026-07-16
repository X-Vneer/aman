<?php

namespace App\Services;

use App\Models\UserVideo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CouponGraph
{
    private $day = 0;
    private $month = 0;
    private $year = 0;
    public $references = [];
    public $all_time = [];
    public $hourly = [];
    public $daily = [];
    public $weekly = [];
    public $monthly = [];
    public $yearly = [];
    public $custom = null;
    private $items = null;
    private $coupon_id;
    private $date_from = null;
    private $date_to = null;

    function __construct($coupon_id, $date_from = null, $date_to = null)
    {
        $this->coupon_id = $coupon_id;
        $this->date_from = $date_from;
        $this->date_to = $date_to;

        $this->day = Carbon::now()->format('d');
        $this->month = Carbon::now()->format('m');
        $this->year = Carbon::now()->format('Y');

        $this->references = [
            "1" => trans('totalDiscountAmount'),
            "2" => trans('totalPaidAfterDiscount'),
            "3" => trans('numberOfUsers'),
        ];

        $this->itemsInit();
        $this->findTotal();
        $this->itemsInit();
        $this->findHourly();
        $this->itemsInit();
        $this->findDaily();
        $this->itemsInit();
        $this->findWeekly();
        $this->itemsInit();
        $this->findMonthly();
        $this->itemsInit();
        $this->findYearly();

        if ($this->date_from && $this->date_to) {
            $this->findCustom();
        }
    }

    function itemsInit() {
        $this->items =  UserVideo::query()->where('status', 'Accepted');;
    }

    private function findTotal()
    {
        $this->all_time = [['x' => 'All Time', '1' => 0, '2' => 0, '3' => 0]];

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->select(
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(paid) as user_count')
            )
            ->first();

        if ($items) {
            $this->all_time[0][1] = $items->sum_discount_value ?? 0;
            $this->all_time[0][2] = $items->sum_paid ?? 0;
            $this->all_time[0][3] = $items->user_count ?? 0;
        }
    }

    private function findHourly()
    {
        $start = Carbon::parse("$this->year-$this->month-$this->day")->startOfDay();
        $end = Carbon::parse("$this->year-$this->month-$this->day")->endOfDay();

        for ($i = 0; $i < 24; $i++) {
            $time = Carbon::createFromTime($i)->format('h:i A');
            $this->hourly[$i] = ['x' => $time, '1' => 0, '2' => 0, '3' => 0];
        }

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(id) as user_count')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        foreach ($items as $item) {
            $this->hourly[$item->hour][1] = $item->sum_discount_value;
            $this->hourly[$item->hour][2] = $item->sum_paid;
            $this->hourly[$item->hour][3] = $item->user_count;
        }
    }

    private function findDaily()
    {
        $start = Carbon::parse("$this->year-$this->month-01")->startOfMonth();
        $end = Carbon::parse("$this->year-$this->month-01")->endOfMonth();

        for ($i = 0; $i < $end->day; $i++) {
            $date = $start->copy()->addDays($i)->format('Y-m-d');
            $this->daily[$i] = ['x' => $date, '1' => 0, '2' => 0, '3' => 0];
        }

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('DAY(created_at) as day'),
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(id) as user_count')
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        foreach ($items as $item) {
            $index = $item->day - 1;
            $this->daily[$index][1] = $item->sum_discount_value;
            $this->daily[$index][2] = $item->sum_paid;
            $this->daily[$index][3] = $item->user_count;
        }
    }

    private function findWeekly()
    {
        $start = Carbon::now()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        for ($i = 0; $i < 7; $i++) {
            $this->weekly[$i] = ['x' => $daysOfWeek[$i], '1' => 0, '2' => 0, '3' => 0];
        }

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('WEEKDAY(created_at) as weekday'),
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(id) as user_count')
            )
            ->groupBy('weekday')
            ->orderBy('weekday')
            ->get();

        foreach ($items as $item) {
            $this->weekly[$item->weekday][1] = $item->sum_discount_value;
            $this->weekly[$item->weekday][2] = $item->sum_paid;
            $this->weekly[$item->weekday][3] = $item->user_count;
        }
    }

    private function findMonthly()
    {
        $start = Carbon::parse("$this->year-01-01")->startOfYear();
        $end = Carbon::parse("$this->year-12-31")->endOfYear();

        for ($i = 0; $i < 12; $i++) {
            $monthName = Carbon::createFromDate($this->year, $i + 1, 1)->format('Y-M');
            $this->monthly[$i] = ['x' => $monthName, '1' => 0, '2' => 0, '3' => 0];
        }

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(id) as user_count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        foreach ($items as $item) {
            $index = $item->month - 1;
            $this->monthly[$index][1] = $item->sum_discount_value;
            $this->monthly[$index][2] = $item->sum_paid;
            $this->monthly[$index][3] = $item->user_count;
        }
    }

    private function findYearly()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 2;

        for ($i = 0; $i <= 2; $i++) {
            $year = $startYear + $i;
            $this->yearly[$i] = ['x' => $year, '1' => 0, '2' => 0, '3' => 0];
        }

        $items = $this->items->where('coupon_id', $this->coupon_id)
            ->whereBetween('created_at', [Carbon::create($startYear)->startOfYear(), Carbon::now()->endOfYear()])
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(discount_value) as sum_discount_value'),
                DB::raw('SUM(paid) as sum_paid'),
                DB::raw('COUNT(id) as user_count')
            )
            ->groupBy('year')
            ->orderBy('year')
            ->get();

        foreach ($items as $item) {
            $index = $item->year - $startYear;
            $this->yearly[$index][1] = $item->sum_discount_value;
            $this->yearly[$index][2] = $item->sum_paid;
            $this->yearly[$index][3] = $item->user_count;
        }
    }

    private function findCustom()
    {
        $dateFrom = Carbon::parse($this->date_from);
        $dateTo = Carbon::parse($this->date_to);
        $diffInDays = $dateFrom->diffInDays($dateTo);
        $diffInMonths = $dateFrom->diffInMonths($dateTo);

        if ($diffInDays <= 1) {
            $this->custom = array_slice($this->hourly, (int) $dateFrom->format('H'), (int) $dateTo->format('H') + 1);
        } elseif ($diffInMonths <= 1 && $diffInDays <= 31) {
            $this->custom = array_slice($this->daily, $dateFrom->format('d') - 1, $dateTo->format('d') - $dateFrom->format('d') + 1);
        } elseif ($diffInMonths <= 12) {
            $this->custom = array_slice($this->monthly, $dateFrom->format('m') - 1, $dateTo->format('m') - $dateFrom->format('m') + 1);
        } else {
            $this->custom = $this->yearly;
        }
    }
}
