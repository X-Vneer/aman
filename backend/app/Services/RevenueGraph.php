<?php


namespace App\Services;

use App\Enums\Lang;
use App\Models\UserVideo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RevenueGraph
{
    private $day = 0;
    private $month = 0;
    private $year = 0;
    public $hourly = [];
    public $daily = [];
    public $weekly = [];
    public $monthly = [];
    public $yearly = [];
    public $items = null;
    private $langs = [];
    private $y_langs = [];

    function __construct()
    {
        $this->day = Carbon::now()->format('d');
        $this->month = Carbon::now()->format('m');
        $this->year = Carbon::now()->format('y');
        $this->langs = array_map(fn($case) => $case->value, Lang::cases());

        foreach($this->langs as $lang){
            $this->y_langs["y_$lang"] = 0;
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
    }

    function itemsInit() {
        $this->items = UserVideo::query()->where('status', 'Accepted');
    }

    private function findHourly() {
        $startOfDay = Carbon::parse("$this->year-$this->month-$this->day")->startOfDay();
        $endOfDay = Carbon::parse("$this->year-$this->month-$this->day")->endOfDay();

        for ($i = 0; $i < 24; $i++) {
            $time = Carbon::createFromFormat('H', $i)->startOfHour();
            $this->hourly[$i] = ['x' => $time->format('h:i A'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->select(DB::raw('HOUR(created_at) as hour'), DB::raw('sum(paid) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfDay, $endOfDay])
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            foreach ($items as $item) {
                $this->hourly[$item->hour]["y_$lang"] = (int) $item->y;
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
            $items = $this->items->select(DB::raw('DAY(created_at) as day'), DB::raw('sum(paid) as y'))
            ->where('lang', $lang)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

            foreach ($items as $item) {
                $this->daily[$item->day -1]["y_$lang"] = (int) $item->y;
                $this->daily[$item->day -1]["y"] = $this->findTotal($this->daily[$item->day -1]);
            }
        }
    }

    private function findWeekly() {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        for ($i = 0; $i <7; $i++) {
            $this->weekly[$i] = ['x' => Carbon::now()->subDays(7-$i)->format('l'),  'y' => 0] + $this->y_langs;
        }


        foreach($this->langs as $lang){
            $items = $this->items->select(DB::raw('WEEKDAY(created_at) as weekday'), DB::raw('sum(paid) as y'))
            ->where('lang', $lang)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('weekday')
            ->orderBy('weekday')
            ->get();

            foreach ($items as $item) {
                $this->weekly[$item->weekday]["y_$lang"] = (int) $item->y;
                $this->weekly[$item->weekday]["y"] = $this->findTotal($this->weekly[$item->weekday]);
            }
        }
    }


    private function findMonthly() {
        $startOfYear = \Carbon\Carbon::parse("$this->year-01-01")->startOfYear();
        $endOfYear = \Carbon\Carbon::parse("$this->year-12-31")->endOfYear();

        for ($i = 0; $i < 12; $i++) {
            $this->monthly[$i] = ['x' => Carbon::parse("$this->year-".($i+1) . "-01")->format('Y-M'), 'y' => 0] + $this->y_langs;
        }

        foreach($this->langs as $lang){
            $items = $this->items->select(DB::raw('MONTH(created_at) as month'), DB::raw('sum(paid) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            foreach ($items as $item) {
                $this->monthly[$item->month -1]["y_$lang"] = (int) $item->y;
                $this->monthly[$item->month -1]["y"] = $this->findTotal($this->monthly[$item->month -1]);
            }
        }
    }

    private function findYearly() {
        $startOfFiveYearsAgo = \Carbon\Carbon::now()->subYears(2)->startOfYear();
        $endOfNow = \Carbon\Carbon::now()->endOfYear();

        $years = 2;
        for ($i = 0; $i <= $years; $i++) {
            $this->yearly[$i] = ['x' => now()->year - $years + $i ] + $this->y_langs;
        }

        foreach($this->langs as $lang){

            $items = $this->items->select(DB::raw('YEAR(created_at) as year'), DB::raw('sum(paid) as y'))
                ->where('lang', $lang)
                ->whereBetween('created_at', [$startOfFiveYearsAgo, $endOfNow])
                ->groupBy('year')
                ->orderBy('year')
                ->get();


            foreach ($items as $item) {
                $this->yearly[Carbon::now()->year - $item->year + $years -1]["y_$lang"] = (int) $item->y;
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
