<?php

namespace App\Http\Controllers\User;

use App\Enums\VideoPaymentStatus;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\RateStoreRequest;
use App\Http\Requests\RateUpdateRequest;
use App\Models\Rate;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\UserVideo;
use App\Jobs\GenerateCertificate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RateController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(Rate::class, ['rate_1', 'rate_2', 'rate_3', 'rate_4']);
    }

    /**
     * Admin guard: include soft-deleted rates. User/guest: only non-deleted.
     */
    protected function ratesIncludeTrashed(): bool
    {
        return auth('admin')->check();
    }

    function index(Request $request) {
        // Build the same filtered query to calculate averages (mirror index listing scope)
        $averagesQuery = $this->ratesIncludeTrashed()
            ? Rate::withTrashed()
            : Rate::query();



        // Apply the same filters that will be applied in the callback
        if(auth('user')->check()){
            $averagesQuery = $averagesQuery->where('user_id', Auth::id());
        }

        // Apply additional filters from request (same as indexInit does)
        // Handle both dateFrom and date_from (indexInit converts date_from to dateFrom)
        $dateFrom = $request->dateFrom ?? $request->date_from;
        $dateTo = $request->dateTo ?? $request->date_to;

        if ($dateFrom) {
            $averagesQuery = $averagesQuery->where('created_at', '>=', Carbon::parse($dateFrom));
        }
        if ($dateTo) {
            $averagesQuery = $averagesQuery->where('created_at', '<=', Carbon::parse($dateTo));
        }

        // Apply column filters
        foreach ($this->columns as $column) {
            if ($request->$column) {
                $where = (Str::contains($column, '_id') || $column == "id")? 'where' : 'likeStart';
                $averagesQuery = $averagesQuery->$where($column, $request->$column);
            }
        }

        // Apply search query
        if($request->q){
            $searchable = $this->columns;
            $averagesQuery = $averagesQuery->where(function ($q) use($request, $searchable) {
                foreach ($searchable as $column) {
                    $q = $q->orLike($column, $request->q);
                }
                return $q;
            });
        }

        // Calculate averages from filtered results
        $allRates = $averagesQuery->get();
        $calculatedAverages = [
            'rate_1' => $allRates->count() == 0 ? 0 : round($allRates->sum('rate_1') / $allRates->count(), 2),
            'rate_2' => $allRates->count() == 0 ? 0 : round($allRates->sum('rate_2') / $allRates->count(), 2),
            'rate_3' => $allRates->count() == 0 ? 0 : round($allRates->sum('rate_3') / $allRates->count(), 2),
            'rate_4' => $allRates->count() == 0 ? 0 : round($allRates->sum('rate_4') / $allRates->count(), 2),
        ];

        $sortAllowed = [
            'user_name' => fn($q, $dir) => $q
                ->leftJoin('users', 'users.id', '=', 'rates.user_id')
                ->select('rates.*')
                ->orderBy('users.first_name', $dir),
        ];

        return $this->indexInit($request, function ($items, $request) {

            if($request->rate_1){
                $items = $items->whereIn('rate_1', explode(',', $request->rate_1));
            }
            if($request->rate_2){
                $items = $items->whereIn('rate_2', explode(',', $request->rate_2));
            }
            if($request->rate_3){
                $items = $items->whereIn('rate_3', explode(',', $request->rate_3));
            }
            if($request->rate_4){
                $items = $items->whereIn('rate_4', explode(',', $request->rate_4));
            }

            if(auth('user')->check()){
                $items = $items->where('user_id', Auth::id());
            }

            if($request->user_name || $request->user_mobile || $request->user_email){
                $items = $items->whereHas('user', function ($q) use($request) {
                    if($request->user_name){
                        $q->where('full_name', 'LIKE', "%{$request->user_name}%");
                    }
                    if($request->user_mobile){
                        $q->where('mobile', 'LIKE', "%{$request->user_mobile}%");
                    }
                    if($request->user_email){
                        $q->where('email', 'LIKE', "%{$request->user_email}%");
                    }
                    return $q;
                });
            }

            if($request->video_ids){
                $video_ids = $request->video_ids;
                $has_not_video = in_array(0, $video_ids)? true : false;

                $items= $items->where(function ($q) use($video_ids, $has_not_video) {
                    $q = $q->whereHas('userVideo', function ($qq) use($video_ids, $has_not_video) {
                            $statuses = [VideoPaymentStatus::Accepted->value];
                            if($has_not_video){
                                 array_push($statuses, VideoPaymentStatus::Rejected->value);
                            }
                            $qq->whereIn('video_id', $video_ids)->whereIn('status', $statuses);
                            return $qq;
                        });

                    if($has_not_video){
                        $q = $q->orWhereDoesntHave('userVideo');
                    }
                    return $q;
                });
            }

            if($request->langs){
                $items = $items->whereHas('userVideo', function ($qq) use($request) {
                    $qq->whereIn('lang', $request->langs);
                    return $qq;
                });
            }


            return [$items];
        }, [], $this->ratesIncludeTrashed(), function ($items) {
            $loads = $items->load(['userVideo', 'user', 'video' => function($query) {
                $query->withTrashed();
            }]);
            $items->data = $loads;
            return [$items];
        }, [
            'averages' => $calculatedAverages
        ], null, true, 'created_at', $sortAllowed);
    }

    function show($id) {
        return $this->showInit($id, null, $this->ratesIncludeTrashed());
    }


    public function create()
    {
        try {
            return $this->sendResponse(true, [], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function edit($id)
    {
        return $this->editInit($id, null, $this->ratesIncludeTrashed());
    }

    public function update(RateUpdateRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = ($this->ratesIncludeTrashed()
                ? $this->model::withTrashed()
                : $this->model::query())->findOrFail($id);
            $item->update($inputs);

            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function destroy($id)
    {
        return $this->destroyInit($id, null, $this->ratesIncludeTrashed());
    }

    public function toggleActive($id, $state)
    {
        return $this->toggleActiveInit($id, $state, null, $this->ratesIncludeTrashed());
    }


    public function store(RateStoreRequest $request)
    {
        // try {
            // Rate THE canonical (finished) enrollment — the same row show()/lastShow() resolve.
            // Previously registered()->latest() could pick a newer stale progress=0 row, writing
            // is_rated/certificate_number to the wrong row while the claim page (reading the finished
            // row) stayed stuck on the rating step forever.
            $user_video = UserVideo::canonicalFor(Auth::id(), $request->video_id)->first();

            if (! $user_video) {
                return $this->sendResponse(false, null, trans('msg.notFound'), null, 404, $request);
            }

            DB::beginTransaction();

            $item = $this->model::withTrashed()->updateOrCreate([
                'video_id' => $request->video_id,
                'user_id' => Auth::id(),
                'user_video_id' => $user_video->id,
            ], [
                'video_id' => $request->video_id,
                'user_id' => Auth::id(),
                'user_video_id' => $user_video->id,
                'rate_1' => $request->rate_1,
                'rate_2' => $request->rate_2,
                'rate_3' => $request->rate_3,
                'rate_4' => $request->rate_4,
                'comment' => $request->comment,
                // current date time
                'deleted_at' => Carbon::now(),
            ]);

            if (!$item->code_number) {
                $item = set_code_number($item, 'RATE');
            }

            $user_video->update([
                'is_rated' => 1,
                'certificate_number' => 'CERT' . $user_video->id,
                'certificate_url' => url('storage/certificates/CERT' . $user_video->id . '.pdf'),
            ]);

            $user_video->refresh();

            DB::commit();
            if($user_video->isApplicableForCertificate()){
                dispatch(new GenerateCertificate($user_video->id, $user_video->user?->email, $user_video->user?->full_name, $user_video->video?->title, $user_video->certificate_number))->afterResponse();
            }


            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     DB::rollBack();
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }
}
