<?php


namespace App\Services;

use App\Models\UserVideo;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VideoGraph
{
    private $day = 0;
    private $month = 0;
    private $year = 0;
    public $date_from = null;
    public $date_to = null;
    public $references = [];
    public $hourly = [];
    public $daily = [];
    public $weekly = [];
    public $monthly = [];
    public $yearly = [];
    public $custom = [];
    private $videos = [];
    private $y_video_ids = [];
    private $items = null;
    private $video_ids = null;

    function __construct($date_from = null, $date_to = null, $video_ids = null)
    {
        $this->day = Carbon::now()->format('d');
        $this->month = Carbon::now()->format('m');
        $this->year = Carbon::now()->format('y');
        $this->date_from = $date_from;
        $this->date_to = $date_to;
        $this->video_ids = $video_ids;

        $this->videos = Video::all();
        $this->references['y'] = trans('Total');
        foreach($this->videos as $video){
            $this->references[$video->id]['label'] = $video->title;
            $this->references[$video->id]['color'] = $video->color;
            $this->y_video_ids["$video->id"] = 0;
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
            // $this->custom = $diff_in_days; return ;

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
        $this->items = UserVideo::query()->where('status', 'Accepted');
        if($this->video_ids){
            $this->items = $this->items->whereIn('video_id', $this->video_ids);
        }
    }

    private function findHourly() {
        $startOfDay = Carbon::parse("$this->year-$this->month-$this->day")->startOfDay();
        $endOfDay = Carbon::parse("$this->year-$this->month-$this->day")->endOfDay();

        for ($i = 0; $i < 24; $i++) {
            $time = Carbon::createFromFormat('H', $i)->startOfHour();
            $this->hourly[$i] = ['x' => $time->format('h:i A'), 'y' => 0] + $this->y_video_ids;
        }

        foreach($this->videos as $video){
            $items = $this->items->clone()->select(DB::raw('HOUR(created_at) as hour'), DB::raw('sum(paid) as y'))
                ->where('video_id', $video->id)
                ->whereBetween('created_at', [$startOfDay, $endOfDay])
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            foreach ($items as $item) {
                $this->hourly[$item->hour][$video->id] = (int) $item->y;
                $this->hourly[$item->hour]["y"] = $this->findTotal($this->hourly[$item->hour]);
            }
        }
    }

    private function findDaily() {
        $startOfMonth = Carbon::parse("$this->year-$this->month-01")->startOfMonth();
        $endOfMonth = Carbon::parse("$this->year-$this->month-01")->endOfMonth();

        for ($i = 0; $i < $endOfMonth->format('d'); $i++) {
            $this->daily[$i] = ['x' => Carbon::parse("$this->year-$this->month-".($i+1))->format('Y-M-d'), 'y' => 0] + $this->y_video_ids;
        }

        foreach($this->videos as $video){
            $items = $this->items->clone()->select(DB::raw('DAY(created_at) as day'), DB::raw('sum(paid) as y'))
            ->where('video_id', $video->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

            foreach ($items as $item) {
                $this->daily[$item->day - 1][$video->id] = (int) $item->y;
                $this->daily[$item->day - 1]["y"] = $this->findTotal($this->daily[$item->day - 1]);
            }
        }
    }

    private function findWeekly() {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        for ($i = 0; $i < 7; $i++) {
            $this->weekly[$i] = ['x' => Carbon::now()->subDays(7-$i)->format('l'), 'y' => 0] + $this->y_video_ids;
        }


        foreach($this->videos as $video){
            $items = $this->items->clone()->select(DB::raw('WEEKDAY(created_at) as weekday'), DB::raw('sum(paid) as y'))
            ->where('video_id', $video->id)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('weekday')
            ->orderBy('weekday')
            ->get();

            foreach ($items as $item) {
                $this->weekly[$item->weekday][$video->id] = (int) $item->y;
                $this->weekly[$item->weekday]["y"] = $this->findTotal($this->weekly[$item->weekday]);
            }
        }
    }


    private function findMonthly() {
        $startOfYear = \Carbon\Carbon::parse("$this->year-01-01")->startOfYear();
        $endOfYear = \Carbon\Carbon::parse("$this->year-12-31")->endOfYear();

        for ($i = 0; $i < 12; $i++) {
            $this->monthly[$i] = ['x' => Carbon::parse("$this->year-".($i+1) . "-01")->format('Y-M'), 'y' => 0] + $this->y_video_ids;
        }

        foreach($this->videos as $video){
            $items = $this->items->clone()->select(DB::raw('MONTH(created_at) as month'), DB::raw('sum(paid) as y'))
                ->where('video_id', $video->id)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            foreach ($items as $item) {
                $this->monthly[$item->month -1][$video->id] = (int) $item->y;
                $this->monthly[$item->month -1]["y"] = $this->findTotal($this->monthly[$item->month -1]);
            }
        }
    }

    private function findYearly() {
        $startOfFiveYearsAgo = \Carbon\Carbon::now()->subYears(2)->startOfYear();
        $endOfNow = \Carbon\Carbon::now()->endOfYear();

        $years = 2;
        for ($i = 0; $i <= $years; $i++) {
            $this->yearly[$i] = ['x' => now()->year - $years + $i ] + $this->y_video_ids;
        }

        foreach($this->videos as $video){

            $items = $this->items->clone()->select(DB::raw('YEAR(created_at) as year'), DB::raw('sum(paid) as y'))
                ->where('video_id', $video->id)
                ->whereBetween('created_at', [$startOfFiveYearsAgo, $endOfNow])
                ->groupBy('year')
                ->orderBy('year')
                ->get();


            foreach ($items as $item) {
                $this->yearly[Carbon::now()->year - $item->year + $years -1][$video->id] = (int) $item->y;
                $this->yearly[Carbon::now()->year - $item->year + $years -1]["y"] = $this->findTotal($this->yearly[Carbon::now()->year - $item->year + $years -1]);
            }
        }
    }



    function findTotal($array){
        $total = 0;
        foreach ($this->videos as $video) {
           $total += $array[$video->id]?? 0;
        }
        return $total;
    }
}
