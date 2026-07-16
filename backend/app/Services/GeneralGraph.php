<?php


namespace App\Services;

use App\Enums\Lang;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GeneralGraph
{
    private $day = 0;
    private $month = 0;
    private $year = 0;
    public $hourly = [];
    public $daily = [];
    public $weekly = [];
    public $monthly = [];
    public $yearly = [];
    public $custom = null;
    private $langs = [];
    private $y_langs = [];
    private $items = null;

    private $langs_filter = null;
    private $video_ids = null;
    private $date_from = null;
    private $date_to = null;
    private $coupon = null;
    private $payment_method = null;

    function __construct($langs_filter = null, $video_ids = null, $date_from = null, $date_to = null, $coupon = null, $payment_method = null)
    {
        $this->langs_filter = $langs_filter;
        $this->video_ids = $video_ids;
        $this->date_from = $date_from;
        $this->date_to = $date_to;
        $this->coupon = $coupon;
        $this->payment_method = $payment_method;
        $this->day = Carbon::now()->format('d');
        $this->month = Carbon::now()->format('m');
        $this->year = Carbon::now()->format('y');
        $this->langs = array_map(fn($case) => $case->value, Lang::cases());

        foreach($this->langs as $lang){
            $this->y_langs["y_$lang"] = 0;
        }


        if($date_from && $date_to){
            $this->itemsInit();
        }

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

        if($date_from && $date_to){
            $this->itemsInit();
            $dateFrom = Carbon::parse($date_from);
            $dateTo = Carbon::parse($date_to);
            $diff_in_days = $dateFrom->diffInDays($dateTo);
            $diff_in_months = $dateFrom->diffInMonths($dateTo);
            $this->day = $dateFrom->format('d');
            $this->month = $dateFrom->format('m');
            $this->year = $dateFrom->format('y');
            $temp = null;

            if($diff_in_days <= 1){
                $temp = $this->hourly;
                $this->findHourly();
                $this->custom = array_slice($this->hourly, (int) $dateFrom->format('H'), (int) $dateTo->format('H')+1);
                $this->hourly = $temp;
            }else if($diff_in_months <= 1 && $diff_in_days <=31){
                $temp = $this->daily;
                $this->findDaily();
                $this->custom = array_slice($this->daily, $this->day-1, $dateTo->format('d'));
                $this->daily = $temp;
            }else if($diff_in_months <= 12){
                $temp = $this->monthly;
                $this->findMonthly();
                $this->custom = array_slice($this->monthly, $this->month-1, $dateTo->format('m'));
                $this->monthly = $temp;
            }else{
                $temp = $this->yearly;
                $this->findYearly();
                $this->custom = $this->custom = $this->yearly;
                $this->yearly = $temp;
            }
        }
    }

    function itemsInit() {
        $this->items = User::query();

        if($this->video_ids || $this->coupon){
            $video_ids = $this->video_ids;
            $coupon = $this->coupon?? null;
            $payment_method = $this->payment_method?? null;
            $this->items =  $this->items->whereHas('userVideos', function ($q) use($video_ids, $coupon, $payment_method) {
               if($video_ids){
                    $q = $q->whereIn('video_id', $video_ids);
               }
               if($coupon){
                    $q = $q->where('coupon_code', $coupon);
               }
               if($payment_method == 'coupon'){
                    $q = $q->whereNotNull('coupon_code');
               }else if($payment_method == 'card'){
                    $q = $q->whereNull('coupon_code');
               }
               return $q;
            });
        }
    }

    private function findHourly() {
        $startOfDay = Carbon::now()->startOfDay();
        $endOfDay = Carbon::now()->endOfDay();

        for ($i = 0; $i < 24; $i++) {
            $time = Carbon::createFromFormat('H', $i)->startOfHour();
            $this->hourly[$i] = ['x' => $time->format('h:i A'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->clone();
            $items = $items->select(DB::raw('HOUR(created_at) as hour'), DB::raw('count(id) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfDay, $endOfDay])
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            foreach ($items as $item) {
                $this->hourly[$item->hour]["y_$lang"] = $item->y;
                $this->hourly[$item->hour]["y"] = $this->findTotal($this->hourly[$item->hour]);
            }
        }

    }

    private function findDaily() {
        $startOfMonth = Carbon::parse("$this->year-$this->month-01")->startOfMonth();
        $endOfMonth = Carbon::parse("$this->year-$this->month-01")->endOfMonth();

        for ($i = 0; $i < $endOfMonth->format('d'); $i++) {
            $this->daily[$i] = ['x' => Carbon::parse("$this->year-$this->month-".($i+1))->format('Y-M-d'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->clone();
            $items = $items->select(DB::raw('DAY(created_at) as day'), DB::raw('count(id) as y'))
            ->where('lang', $lang)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

            foreach ($items as $item) {
                $this->daily[$item->day -1]["y_$lang"] = $item->y;
                $this->daily[$item->day -1]["y"] = $this->findTotal($this->daily[$item->day -1]);
            }
        }
    }

    private function findWeekly() {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        for ($i = 0; $i < 7; $i++) {
            $this->weekly[$i] = ['x' => Carbon::now()->subDays(7-$i)->format('l'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->clone();
            $items = $items->select(DB::raw('WEEKDAY(created_at) as weekday'), DB::raw('count(id) as y'))
            ->where('lang', $lang)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('weekday')
            ->orderBy('weekday')
            ->get();

            foreach ($items as $item) {
                $this->weekly[$item->weekday]["y_$lang"] = $item->y;
                $this->weekly[$item->weekday]["y"] = $this->findTotal($this->weekly[$item->weekday]);
            }
        }
    }


    private function findMonthly() {
        $startOfYear = Carbon::parse("$this->year-01-01")->startOfYear();
        $endOfYear = Carbon::parse("$this->year-12-31")->endOfYear();

        for ($i = 0; $i < 12; $i++) {
            $this->monthly[$i] = ['x' => Carbon::parse("$this->year-".($i+1) . "-01")->format('Y-M'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->clone();
            $items = $items->select(DB::raw('MONTH(created_at) as month'), DB::raw('count(id) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            foreach ($items as $item) {
                $this->monthly[$item->month -1]["y_$lang"] = $item->y;
                $this->monthly[$item->month -1]["y"] = $this->findTotal($this->monthly[$item->month -1]);
            }
        }
    }



    private function findYearly() {
        $startOfFiveYearsAgo = Carbon::now()->subYears(2)->startOfYear();
        $endOfNow = Carbon::now()->endOfYear();
        $years = 2;
        for ($i = 0; $i <= $years; $i++) {
            $this->yearly[$i] = ['x' => now()->year - $years + $i ] + $this->y_langs;
        }

        foreach($this->langs as $lang){

            $items = $this->items->clone();
            $items = $items->select(DB::raw('YEAR(created_at) as year'), DB::raw('count(id) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfFiveYearsAgo, $endOfNow])
                ->groupBy('year')
                ->orderBy('year', 'ASC')
                ->get();


            foreach ($items as $item) {
                $this->yearly[Carbon::now()->year - $item->year + $years -1]["y_$lang"] = $item->y;
                $this->yearly[Carbon::now()->year - $item->year + $years -1]["y"] = $this->findTotal($this->yearly[Carbon::now()->year - $item->year + $years -1]);
            }
        }

    }


    function findTotal($array){
        $total = 0;
        foreach ($this->langs as $lang) {
           $total += $array["y_$lang"]?? 0;
        }
        return $total;
    }
}
