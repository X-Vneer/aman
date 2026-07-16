<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CouponType;
use App\Enums\VideoPaymentStatus;
use App\Enums\Lang;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\CheckCouponRequest;
use App\Http\Requests\CouponRequest;
use App\Http\Resources\CouponUserVideoResource;
use App\Http\Resources\UserVideoResource;
use App\Models\Coupon;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\UserVideo;
use App\Models\Video;
use App\Services\CouponGraph;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CouponController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(Coupon::class, ['video_ids', 'langs', 'status']);
    }
    function index(Request $request) {
        return $this->indexInit($request, function ($items) use($request){
            if($request->statuses){
                // `status` is computed (no physical column on MySQL); filter on the CASE expression.
                $items = $items->whereIn(DB::raw('('.Coupon::STATUS_SQL.')'), $request->statuses);
            }

            if($request->video_ids){
                $videoIds =$request->video_ids;
                $items = $items->where(function ($q) use ($videoIds) {
                    foreach ($videoIds as $id) {
                        $q->orWhereJsonContains('video_ids', $id);
                    }
                });
            }

            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            $loads = $items->load(['userVideos']);
            $items->data = $loads;
            return [$items];
        }, null, null, true, 'created_at', [
            // `status` is computed (no physical column on MySQL); sort on the CASE expression.
            'status' => fn($q, $dir) => $q->orderByRaw('('.Coupon::STATUS_SQL.') '.$dir),
        ]);
    }

    function couponUsers(Request $request, $id) {
        $this->model = UserVideo::class;
        $this->resource = CouponUserVideoResource::class;
        $this->resourceExport = CouponUserVideoResource::class;
        $this->columns = ['price', 'discount_value', 'created_at'];
        if($request->dates && !$request->date_from && !$request->date_to){
            if($request->dates == 'hourly'){
                $request->merge(['dateFrom' => Carbon::now()->startOfDay()]);
            }else if($request->dates == 'daily'){
                $request->merge(['dateFrom' => Carbon::now()->startOfMonth()]);
            }else if($request->dates == 'weekly'){
                $request->merge(['dateFrom' => Carbon::now()->startOfWeek()]);
            }else if($request->dates == 'monthly'){
                $request->merge(['dateFrom' => Carbon::now()->startOfYear()]);
            }else if($request->dates == 'yearly'){
                $request->merge(['dateFrom' => Carbon::now()->subYears(3)]);
            }
        }


        if($request->date_from)$request->merge(['dateFrom'=> $request->date_from]);
        if($request->date_to)$request->merge(['dateTo'=> $request->date_to]);

        $sortAllowed = [
            'user_name' => fn($q, $dir) => $q->orderBy(
                \App\Models\User::select('full_name')
                    ->whereColumn('users.id', 'user_videos.user_id')
                    ->withTrashed()
                    ->limit(1),
                $dir
            ),
            'user_mobile' => fn($q, $dir) => $q->orderBy(
                \App\Models\User::select('mobile')
                    ->whereColumn('users.id', 'user_videos.user_id')
                    ->withTrashed()
                    ->limit(1),
                $dir
            ),
            'video_title' => fn($q, $dir) => $q->orderByRaw(
                "(SELECT JSON_UNQUOTE(JSON_EXTRACT(title, '$.ar')) FROM videos WHERE videos.id = user_videos.video_id LIMIT 1) $dir"
            ),
            'number_of_time_used' => fn($q, $dir) => $q->orderByRaw("count(coupon_code) $dir"),
            'percentage' => fn($q, $dir) => $q->orderByRaw(
                "CASE WHEN price > 0 THEN discount_value / price ELSE 0 END $dir"
            ),
        ];

        return $this->indexInit($request, function ($items) use($request, $id){
            if($request->statuses){
                $items = $items->whereIn('status', $request->statuses);
            }

            $items = $items->where('coupon_id', $id)
                ->where('status', VideoPaymentStatus::Accepted->value)
                 ->select(
                    'id',
                    'video_id',
                    'user_id',
                    'price',
                    'discount_value',
                    'created_at',
                    DB::raw('count(coupon_code) as number_of_time_used')
                )
                ->groupBy('user_id', 'coupon_code', 'id', 'video_id', 'price', 'discount_value', 'created_at')
                ->whereHas('user', function ($q) use($request){
                    if($request->q){
                        $q = $q->likeStart('full_name', $request->q);
                        $q = $q->orLikeStart('mobile', $request->q);
                    }
                    return $q;
                });


            return [$items];
        }, [], false, function ($items) {
            $loads = $items->load(['user', 'video']);
            return [$items];
        }, null, null, true, 'created_at', $sortAllowed);
    }

    function couponGraph(Request $request, $coupon)
    {
        // try {
            $graph =  new CouponGraph($coupon, $request->date_from, $request->date_to);
            return $this->sendResponse(true, ['graph' => $graph] );

        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }

    function show($id) {
        return $this->showInit($id, null, auth('admin')->check());
    }


    public function create()
    {
        try {
            return $this->sendResponse(true, [

            ], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(CouponRequest $request)
    {
        // try {
            $inputs = $request->validated();
            if(!$request->langs){
                $inputs['langs'] = array_map(fn($case) => $case->value, Lang::cases());
            }
            $item = $this->model::create($inputs);
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function edit($id) {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(CouponRequest $request, $id)
    {

        try {
            $inputs = $request->validated();
            if(!$request->langs){
                $inputs['langs'] = array_map(fn($case) => $case->value, Lang::cases());
            }
            $item = $this->model::find($id);
            $item->update($inputs);
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id) {
        $item = Coupon::findOrFail($id);
        if($item?->userVideos->count()>0){
            return $this->sendResponse(false, null, __('msg.can-not-delete-coupon-having-payment'), null, 429, null);
        }
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function toggleActive($id, $state) {

        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

    public function checkCoupon(CheckCouponRequest $request)
    {
        try {
            $coupon = $this->model::where('code', $request->coupon)->first();
            $video = Video::find($request->video_id);

            $price = (float) $video->price;
            $discount = 0;
            if($coupon->type == CouponType::Fixed->value){
                $discount = (float) $coupon->amount;
            }else{
                $discount = (float) $coupon->amount/100 * $price;
            }

            $price = $price - $discount;
            return $this->sendResponse(true, [
                'price' => $price,
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
