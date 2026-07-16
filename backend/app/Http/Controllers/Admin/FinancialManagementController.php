<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\UpdateVideosPriceRequest;
use App\Http\Resources\UserInformationResource;
use App\Http\Traits\Controller\IndexTrait;
use App\Models\User;
use App\Models\UserVideo;
use App\Models\Video;
use App\Services\VideoGraph;
use Carbon\Carbon;
use DragonCode\Contracts\Cashier\Auth\Auth;
use Illuminate\Http\Request;

class FinancialManagementController extends BaseApiController {

    use IndexTrait;

    function __construct()
    {
        parent::__construct(UserVideo::class);
    }

    function statistics(Request $request) {
         try {
            $items = UserVideo::query()->where('status', 'Accepted');
            if($request->video_ids){
                $items = $items->whereIn('video_id', $request->video_ids);
            }
            if($request->dates && !$request->date_from && !$request->date_to){
                if($request->dates == 'hourly'){
                    $request->merge(['date_from' => Carbon::now()->startOfDay()]);
                }else if($request->dates == 'daily'){
                    $request->merge(['date_from' => Carbon::now()->startOfMonth()]);
                }else if($request->dates == 'weekly'){
                    $request->merge(['date_from' => Carbon::now()->startOfWeek()]);
                }else if($request->dates == 'monthly'){
                    $request->merge(['date_from' => Carbon::now()->startOfYear()]);
                }else if($request->dates == 'yearly'){
                    $request->merge(['date_from' => Carbon::now()->subYears(3)]);
                }
            }


            if ($request->date_from) {

                $items =  $items->where('created_at', '>=', Carbon::parse($request->date_from));
            }

            if ($request->date_to) {
                $items =  $items->where('created_at', '<=', Carbon::parse($request->date_to));
            }

            $total_revenue =$items->clone();
            $total_revenue = (string) $total_revenue->sum('final_price');
            $total_tax_value =$items->clone();
            $total_tax_value = (string) $total_tax_value->sum('tax_value');
            $total_discount_value =$items->clone();
            $total_discount_value = (string) $total_discount_value->sum('discount_value');

            $videos = Video::all();
            $videos_revenue = [];
            foreach ($videos as $video) {
                if($request->video_ids && !in_array($video->id, $request->video_ids)){
                    continue;
                }
                $clone = $items->clone();

                $videos_revenue[] = [
                    'video_id' => $video->id,
                    'price_original' => $video->getRawOriginal('price'),
                    'price' => $video->price,
                    'title' => $video->title,
                    'revenue' => number_format($clone->where('video_id', $video->id)->sum('final_price'), 2),
                    'tax_value' => number_format($clone->where('video_id', $video->id)->sum('tax_value'), 2),
                    'discount_value' => number_format($clone->where('video_id', $video->id)->sum('discount_value'), 2),
                ];
            }

            return $this->sendResponse(true, [
                'total_revenue' => number_format($total_revenue, 2),
                'total_tax_value' => number_format($total_tax_value, 2),
                'total_discount_value' => number_format($total_discount_value, 2),
                'videos_revenue' => $videos_revenue,
            ], trans('Listed'), null, 201, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function videoGraph(Request $request)
    {
        try {
             $graph =  new VideoGraph($request->date_from, $request->date_to, $request->video_ids);
            return $this->sendResponse(true, ['graph' => $graph] );

        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    function updatePrice(UpdateVideosPriceRequest $request) {
         try {
             foreach ($request->prices as $price) {
                $video = Video::find($price['video_id']);
                $video->update(['price' => $price['price']]);
             }

            return $this->statistics(new Request());
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }


    function userInformation(Request $request) {
        $clean_path = parse_url(request()->getRequestUri(), PHP_URL_PATH);
        $this->resource = UserInformationResource::class;
        $this->resourceExport = UserInformationResource::class;
        $this->model = User::class;

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
            // id — use qualified name to avoid ambiguity in multi-table JOIN
            'id' => fn($q, $dir) => $q->orderBy('user_videos.id', $dir),

            // user name — users.full_name is a MySQL virtual CONCAT column
            'user_name' => fn($q, $dir) => $q
                ->orderBy('users.full_name', $dir)
                ->orderBy('user_videos.id', 'asc'),

            // program — videos.title is Spatie JSON; sort by ar locale
            'program' => fn($q, $dir) => $q
                ->orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(videos.title, '$.ar')) $dir")
                ->orderBy('user_videos.id', 'asc'),

            // payment status — business order: UnderReview(1) < Accepted(2) < Rejected(3)
            'status' => fn($q, $dir) => $q
                ->orderByRaw("CASE user_videos.status
                    WHEN 'UnderReview' THEN 1
                    WHEN 'Accepted'    THEN 2
                    WHEN 'Rejected'    THEN 3
                    ELSE 99
                END $dir")
                ->orderBy('user_videos.id', 'asc'),

            // order_id — NULLs sort last in both directions
            'order_id' => fn($q, $dir) => $q
                ->orderByRaw("CASE WHEN transactions.order_id IS NULL THEN 1 ELSE 0 END ASC, transactions.order_id $dir")
                ->orderBy('user_videos.id', 'asc'),

            // coupon code — NULL/empty rows sort last in both directions
            'coupon_code' => fn($q, $dir) => $q
                ->orderByRaw("CASE WHEN user_videos.coupon_code IS NULL OR user_videos.coupon_code = '' THEN 1 ELSE 0 END ASC, user_videos.coupon_code $dir")
                ->orderBy('user_videos.id', 'asc'),

            // payment method — mirrors PHP resource logic: Coupon(1) < Card(2) < ApplePay(3)
            'payment_method' => fn($q, $dir) => $q
                ->orderByRaw("CASE
                    WHEN user_videos.final_price = 0              THEN 1
                    WHEN transactions.card IS NOT NULL             THEN 2
                    ELSE 3
                END $dir")
                ->orderBy('user_videos.id', 'asc'),

            // money columns — real DB columns on user_videos
            'price'          => fn($q, $dir) => $q->orderBy('user_videos.price', $dir)->orderBy('user_videos.id', 'asc'),
            'discount_value' => fn($q, $dir) => $q->orderBy('user_videos.discount_value', $dir)->orderBy('user_videos.id', 'asc'),
            'tax_value'      => fn($q, $dir) => $q->orderBy('user_videos.tax_value', $dir)->orderBy('user_videos.id', 'asc'),
            'paid'           => fn($q, $dir) => $q->orderBy('user_videos.paid', $dir)->orderBy('user_videos.id', 'asc'),

            // transaction date — user_videos.created_at (with id tiebreaker)
            'created_at' => fn($q, $dir) => $q->orderBy('user_videos.created_at', $dir)->orderBy('user_videos.id', 'asc'),
        ];

        return $this->indexInit($request, function ($items) use($request, $clean_path)  {

            $items = $items->rightJoin('user_videos', 'user_videos.user_id', '=', 'users.id')
            ->rightJoin('videos', 'videos.id', '=', 'user_videos.video_id')
            ->leftJoin('transactions', 'transactions.id', '=', 'user_videos.transaction_id')
            ->select(
                'users.id as user_id',
                'videos.title',
                'videos.color',
                'user_videos.id as id',
                'user_videos.status',
                'user_videos.price',
                'user_videos.final_price',
                'user_videos.discount_value',
                'user_videos.coupon_code',
                'user_videos.created_at',
                'user_videos.video_id',
                'user_videos.tax_value',
                'user_videos.paid',
                'transactions.card',
                'transactions.result',
                'transactions.order_id',
                'transactions.response',
                'users.lang',
                'users.full_name',
                'users.mobile',
                'users.first_name',
                'users.last_name',
                'users.certificate_count',
                'users.email',
                'users.deleted_at',
                'users.created_at as user_created_at',
            );

        if(in_array($request->q, ['دفع مباشر', 'No Coupon'])){
            $items = $items->where('user_videos.paid', '>', 0);
        }else if(in_array($request->q, [ 'Coupon 100%', 'Coupon'])){
            $items = $items->where('user_videos.paid', '=', 0);
        }else if ($request->q) {
            $items = $items->where(function ($query) use ($request) {
                $query->where('users.full_name', 'LIKE', "%{$request->q}%")
                      ->orWhere('users.email', 'LIKE', "%{$request->q}%")
                      ->orWhere('users.mobile', 'LIKE', "%{$request->q}%")
                      ->orWhere('videos.title', 'LIKE', "%{$request->q}%")
                      ->orWhere('user_videos.status', 'LIKE', "%{$request->q}%")
                      ->orWhere('transactions.order_id', 'LIKE', "%{$request->q}%");
            });
        }

        if($request->video_ids){
            $items = $items->whereIn('user_videos.video_id', $request->video_ids);
        }

        if(in_array($clean_path, ['/admin/financial-management/user-information'])){
            $items = $items->whereNotNull('user_videos.video_id');
        }

        if($request->statuses){
            $items = $items->whereIn('user_videos.status', $request->statuses);
        }

        if ($request->filled('coupon')) {
            $coupon = trim((string) $request->coupon);
            $items = $items->where('user_videos.coupon_code', $coupon);
        }

        $presence = $request->input('coupon_presence', []);
        if (! is_array($presence)) {
            $presence = $presence !== null && $presence !== '' ? [(string) $presence] : [];
        }
        $presence = array_values(array_intersect($presence, ['with', 'without']));
        if (count($presence) === 1) {
            if ($presence[0] === 'with') {
                $items = $items->where(function ($q) {
                    $q->whereNotNull('user_videos.coupon_code')
                        ->where('user_videos.coupon_code', '!=', '');
                });
            } else {
                $items = $items->where(function ($q) {
                    $q->whereNull('user_videos.coupon_code')
                        ->orWhere('user_videos.coupon_code', '=', '');
                });
            }
        }

            // Hardcoded orderBy removed — IndexTrait applies sort after the callback.
            // Default (no sort_column): orderBy('id','DESC') → resolves to user_videos.id as id.

            return [$items];
        }, [], auth('admin')->check(), function ($items){

            return [$items];
        }, null, null, false, 'user_videos.created_at', $sortAllowed);
    }

    function transactionDetails($id) {
        try {
            // Try to find by ID first, if not found try by order_id
            $transaction = \App\Models\Transaction::with(['paymentCallbackLogs', 'userVideo', 'user', 'video'])
                ->where(function($query) use ($id) {
                    $query->where('id', $id)
                          ->orWhere('order_id', $id);
                })
                ->firstOrFail();

            return $this->sendResponse(true, [
                'transaction' => [
                    'id' => $transaction->id,
                    'order_id' => $transaction->order_id,
                    'trans_id' => $transaction->trans_id,
                    'hash' => $transaction->hash,
                    'status' => $transaction->status,
                    'result' => $transaction->result,
                    'card' => $transaction->card,
                    'request' => $transaction->request,
                    'response' => $transaction->response,
                    'created_at' => $transaction->created_at,
                    'updated_at' => $transaction->updated_at,
                ],
                'payment_callback_logs' => $transaction->paymentCallbackLogs->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'result' => $log->result,
                        'status' => $log->status,
                        'order_id' => $log->order_id,
                        'trans_id' => $log->trans_id,
                        'trans_date' => $log->trans_date,
                        'amount' => $log->amount,
                        'currency' => $log->currency,
                        'hash' => $log->hash,
                        'rrn' => $log->rrn,
                        'card_brand' => $log->card_brand,
                        'merchant_name' => $log->merchant_name,
                        'transaction_identifier' => $log->transaction_identifier,
                        'processor_mid' => $log->processor_mid,
                        'methods' => $log->methods,
                        'redirect_url' => $log->redirect_url,
                        'redirect_params' => $log->redirect_params,
                        'redirect_method' => $log->redirect_method,
                        'card' => $log->card,
                        'card_expiration_date' => $log->card_expiration_date,
                        'sessionId' => $log->sessionId,
                        'decline_reason' => $log->decline_reason,
                        'request_data' => $log->request_data,
                        'created_at' => $log->created_at,
                    ];
                }),
            ], 'Transaction details retrieved successfully', null, 200);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, 'Transaction not found', null, 404);
        }
    }


}
