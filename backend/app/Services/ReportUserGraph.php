<?php

namespace App\Services;

use App\Enums\VideoPaymentStatus;
use App\Models\User;
use App\Models\UserVideo;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportUserGraph
{
    private $month = 0;
    private $year = 0;
    public $references = [];
    public $total = [];
    public $hourly = [];
    public $daily = [];
    public $weekly = [];
    public $monthly = [];
    public $yearly = [];
    public $custom = null;
    private $items = null;
    private $users = null;
    private $videos = [];


    private $langs_filter = null;
    private $video_ids = null;
    private $date_from = null;
    private $date_to = null;
    function __construct($langs_filter = null, $video_ids = null, $date_from = null, $date_to = null)
    {
        $this->langs_filter = $langs_filter;
        $this->video_ids = $video_ids;
        $this->date_from = $date_from;
        $this->date_to = $date_to;
        $this->month = Carbon::now()->format('m');
        $this->year = Carbon::now()->format('y');
        $this->videos = Video::all();

        $this->references[0]['label'] = __('msg.hasNotCertificate');
        $this->references[0]['color'] = '#000000';

        foreach ($this->videos as $video) {
            $this->references[$video->id]['label'] = $video->title;
            $this->references[$video->id]['color'] = $video->color;
            $this->total[$video->id] = 0;
            $this->hourly[$video->id] = 0;
            $this->daily[$video->id] = 0;
            $this->weekly[$video->id] = 0;
            $this->monthly[$video->id] = 0;
            $this->yearly[$video->id] = 0;
            $this->custom[$video->id] = 0;

        }
        $this->references['total'] = trans('Total');

        if($date_from && $date_to){
            $this->itemsInit();
        }

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
        $this->itemsInit();
        $this->findCustom();
    }

    function itemsInit() {
        $this->items = UserVideo::query()->where('status', 'Accepted')->where('status', VideoPaymentStatus::Accepted->value);
        $this->users = User::query();

        if($this->video_ids){
            if(count($this->video_ids)> 0){
                $video_ids = $this->video_ids;
                $this->items =  $this->items->whereIn('video_id', $video_ids);
                $this->users =  $this->users->whereHas('userVideos', function ($q) use($video_ids) {
                    $q = $q->whereIn('video_id', $video_ids);
                    return $q;
                });
            }
        }

        if($this->langs_filter){
            if(count($this->langs_filter)> 0){
                $this->items =  $this->items->whereIn('lang', $this->langs_filter);
            }

            if(count($this->langs_filter)> 0){
                $this->users =  $this->users->whereIn('lang', $this->langs_filter);
            }
        }

    }

    private function findTotal()
    {
        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->total[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->total['total'] = $this->users->clone()->count();
        $this->total[0] = $this->users->clone()->whereDoesntHave('userVideos')->count();
    }

    private function findHourly()
    {
        $start = Carbon::now()->startOfDay();
        $end = Carbon::now()->endOfDay();

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->hourly[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->hourly['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->hourly[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
    }

    private function findDaily()
    {
        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->daily[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->daily['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->daily[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
    }

    private function findWeekly()
    {
        $start = Carbon::now()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->weekly[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->weekly['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->weekly[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
    }

    private function findMonthly()
    {
        $start = Carbon::now()->startOfYear();
        $end = Carbon::now()->endOfYear();

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->monthly[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->monthly['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->monthly[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
    }

    private function findYearly()
    {
        $start = Carbon::now()->subYears(3);
        $end = Carbon::now()->endOfYear();

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $this->yearly[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }
        $this->yearly['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->yearly[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
    }

    private function findCustom()
    {
        $start = Carbon::parse($this->date_from);
        $end = Carbon::parse($this->date_to);

        $items = $this->items->select(DB::raw('count(user_id) as user_counts'), 'video_id')
            ->whereBetween('created_at', [$start, $end])
            ->whereNotNull('certificate_number')
            ->where('is_certificate_generated', 1)
            ->groupBy('video_id')
            ->orderBy('video_id')
            ->get();

        $total = 0;
        
        foreach ($items as $item) {
            $this->custom[$item->video_id] = $item->user_counts;
            $total += $item->user_counts;
        }

        $this->custom['total'] = $this->users->clone()->whereBetween('created_at', [$start, $end])->count();
        $this->custom[0] = $this->users->clone()->whereBetween('created_at', [$start, $end])->whereDoesntHave('userVideos')->count();
     }
}
