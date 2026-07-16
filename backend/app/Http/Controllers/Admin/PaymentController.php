<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VideoPaymentStatus;
use App\Helpers\CustomLogger;
use App\Http\Controllers\BaseApiController;
use App\Models\PaymentCallbackLog;
use App\Models\Transaction;
use App\Models\UserVideo;
use App\Models\Video;
use App\Services\EdfaPayStatusService;
use Illuminate\Http\Request;

class PaymentController extends BaseApiController {

    protected $edfaPayCallback = 'edfaPayCallback.log';
    function __construct()
    {
        parent::__construct(Video::class);
    }

    /**
     * Normalize transaction response to array of history and append a new entry.
     *
     * @return array<int, mixed>
     */
    private function appendResponseHistory(Transaction $transaction, array $newResponse): array
    {
        $existing = $transaction->response;
        $responses = is_array($existing) && array_is_list($existing)
            ? $existing
            : ($existing !== null ? [$existing] : []);
        $responses[] = $newResponse;
        return array_values($responses);
    }

    function edfaPayCallback(Request $request) {
        // CustomLogger::logInfo($this->edfaPayCallback, 'Request',  ['request' => $request->all()]);

        // Log callback to payment_callback_logs table
        $requestData = $request->all();
        PaymentCallbackLog::create([
            'request_data' => $requestData,
            'action' => $request->action ?? null,
            'result' => $request->result ?? null,
            'status' => $request->status ?? null,
            'order_id' => $request->order_id ?? null,
            'trans_id' => $request->trans_id ?? null,
            'trans_date' => $request->trans_date ?? null,
            'amount' => $request->amount ?? null,
            'currency' => $request->currency ?? null,
            'hash' => $request->hash ?? null,
            'rrn' => $request->rrn ?? null,
            'card_brand' => $request->card_brand ?? null,
            'merchant_name' => $request->merchant_name ?? null,
            'transaction_identifier' => $request->transaction_identifier ?? null,
            'processor_mid' => $request->processor_mid ?? null,
            'methods' => $request->methods ?? null,
            'redirect_url' => $request->redirect_url ?? null,
            'redirect_params' => is_string($request->redirect_params) ? $request->redirect_params : json_encode($request->redirect_params ?? null),
            'redirect_method' => $request->redirect_method ?? null,
            'card' => $request->card ?? null,
            'card_expiration_date' => $request->card_expiration_date ?? null,
            'sessionId' => $request->sessionId ?? null,
            'decline_reason' => $request->decline_reason ?? null,
        ]);

        $transaction = Transaction::where('order_id', $request->order_id)
            ->first();


        if($transaction){
            $transaction->update([
                'trans_id' => $request->trans_id,
                'result' =>  $request->result,
                'status' =>  $request->status,
                'card' =>  $request->card?? null,
                'response' => $this->appendResponseHistory($transaction, $request->all()),
            ]);


            if(strtolower($request->status) == 'settled') {
                // Query EdfaPay to verify the payment status
                $service = new EdfaPayStatusService();
                $response = $service->checkPaymentStatus($transaction->hash, $transaction->order_id);

                // If EdfaPay confirms the status is settled | success, update the user_video status
                if (isset($response['statusCode']) && $response['statusCode'] === 200) {
                    $responseBody = $response['responseBody'];
                    if (strtolower($responseBody['status']) === 'settled' || strtolower($responseBody['status']) == 'success') {
                        $transaction->userVideo->update(['status' => VideoPaymentStatus::Accepted->value]);
                    }
                }
            }
        }

        return $this->sendResponse(true, ['item' => 'done'], 'Received Response Success', null, 200, $request);
    }

    function edfaPayCallback2(Request $request) {
        // CustomLogger::logInfo($this->edfaPayCallback, 'Request',  ['request' => $request->all()]);

        $responseBody = null;
        // Log callback to payment_callback_logs table
        $requestData = $request->all();
        // PaymentCallbackLog::create([
        //     'request_data' => $requestData,
        //     'action' => $request->action ?? null,
        //     'result' => $request->result ?? null,
        //     'status' => $request->status ?? null,
        //     'order_id' => $request->order_id ?? null,
        //     'trans_id' => $request->trans_id ?? null,
        //     'trans_date' => $request->trans_date ?? null,
        //     'amount' => $request->amount ?? null,
        //     'currency' => $request->currency ?? null,
        //     'hash' => $request->hash ?? null,
        //     'rrn' => $request->rrn ?? null,
        //     'card_brand' => $request->card_brand ?? null,
        //     'merchant_name' => $request->merchant_name ?? null,
        //     'transaction_identifier' => $request->transaction_identifier ?? null,
        //     'processor_mid' => $request->processor_mid ?? null,
        //     'methods' => $request->methods ?? null,
        //     'redirect_url' => $request->redirect_url ?? null,
        //     'redirect_params' => is_string($request->redirect_params) ? $request->redirect_params : json_encode($request->redirect_params ?? null),
        //     'redirect_method' => $request->redirect_method ?? null,
        //     'card' => $request->card ?? null,
        //     'card_expiration_date' => $request->card_expiration_date ?? null,
        //     'sessionId' => $request->sessionId ?? null,
        //     'decline_reason' => $request->decline_reason ?? null,
        // ]);

        $transaction = Transaction::where('order_id', $request->order_id)
            ->first();


        if($transaction){
            $transaction->update([
                'trans_id' => $request->trans_id,
                'result' =>  $request->result,
                'status' =>  $request->status,
                'card' =>  $request->card?? null,
                // 'response' => $this->appendResponseHistory($transaction, $request->all()),
            ]);


            if(strtolower($request->status) == 'settled') {
                // Query EdfaPay to verify the payment status
                $service = new EdfaPayStatusService();
                $response = $service->checkPaymentStatus($transaction->hash, $transaction->order_id);

                // If EdfaPay confirms the status is settled, update the user_video status
                if (isset($response['statusCode']) && $response['statusCode'] === 200) {
                    $responseBody = $response['responseBody'];
                    if (strtolower($responseBody['status']) === 'settled' || strtolower($responseBody['status']) == 'success') {
                        $transaction->userVideo->update(['status' => VideoPaymentStatus::Accepted->value]);
                    }
                }
            }
        }

        return $this->sendResponse(true, ['item' => 'done', 'response' => $responseBody], 'Received Response Success', null, 200, $request);
    }

    public function checkPaymentStatus()
    {
        $minDate = now()->subMinutes(10)->format('Y-m-d H:i:s');
        $count = UserVideo::where('status', VideoPaymentStatus::UnderReview->value)
                ->whereNull('transaction_id')
                // ->where('final_price', '>', 0)
                ->where('created_at', '<=', $minDate)->count();

        // return $this->sendResponse(true, ['count' => $count, 'min-date' => $minDate], 'Count of items', null, 200);

        UserVideo::where('status', VideoPaymentStatus::UnderReview->value)
                ->whereNull('transaction_id')
                // ->where('final_price', '>', 0)
                ->where('created_at', '<=', $minDate)
                ->update(['status' => VideoPaymentStatus::Rejected->value]);

        $items = UserVideo::where('status', VideoPaymentStatus::UnderReview->value)
                ->whereHas('transaction')
                ->where('final_price', '>', 0)
                ->where('created_at', '<=', $minDate)
                ->get();

        foreach ($items as $item) {
            $service = new EdfaPayStatusService();
            $response = $service->checkPaymentStatus($item->transaction?->hash, $item->transaction->order_id);

            if (isset($response['error']) && $response['error'] === true) {
                $item->update([
                    'status' => VideoPaymentStatus::Rejected->value,
                ]);
                continue;
            }

            if (isset($response['statusCode']) && $response['statusCode'] === 200) {
                $responseBody = $response['responseBody'];
                $status = (strtolower($responseBody['status']) === 'settled' || strtolower($responseBody['status']) == 'success') ? VideoPaymentStatus::Accepted->value : VideoPaymentStatus::Rejected->value;

                if ($item->transaction && $item->status == VideoPaymentStatus::UnderReview->value) {
                    $item->transaction->update([
                        'status' => strtoupper($responseBody['status']),
                        'response' => $this->appendResponseHistory($item->transaction, $responseBody),
                    ]);
                }

                $item->update([
                    'status' => $status,
                ]);
            }
        }

        return $this->sendResponse(true, null, "Payment statuses updated successfully.");
    }

    public function devCheckPaymentStatus()
    {
        $items = Transaction::select('id', 'hash', 'order_id', 'status', 'created_at')->where('id', '>=', 150)->where('id', '<=', 200)->get();
        $log = 'dev/checkPaymentStatus-2.log';
        $logError = 'dev/checkPaymentStatusError-2.log';

        foreach ($items as $item) {
            $service = new EdfaPayStatusService();
            $response = $service->checkPaymentStatus($item->hash, $item->order_id);

            if (isset($response['error']) && $response['error'] === true) {
                CustomLogger::logInfo($logError, 'Error',  [
                    'item' => $item,
                    'response' => $response
                ]);

                $item->update([
                    'status' => $item->status == 'init' ? 'init' : VideoPaymentStatus::Rejected->value,
                    'result' => 'REDIRECT',
                    'response' => $this->appendResponseHistory($item, $response),
                ]);
                continue;
            }

            if (isset($response['statusCode']) && $response['statusCode'] === 200) {
                $responseBody = $response['responseBody'];
                $result = $responseBody['status']?? $item->result;
                $status = in_array(strtolower($result), ['settled', 'pending']) ? VideoPaymentStatus::Accepted->value : VideoPaymentStatus::Rejected->value;

                CustomLogger::logInfo($log, 'Success',  [
                    'status' => $status,
                    'result' => $result,
                    'item' => $item,
                    'response' => $responseBody
                ]);

                $item->update([
                    'status' => $status,
                    'result' => $result,
                    'response' => $this->appendResponseHistory($item, $response),
                ]);
                continue;
            }else{

                $item->update([
                    'status' => VideoPaymentStatus::UnderReview->value,
                    'result' => 'REDIRECT',
                    'response' => $this->appendResponseHistory($item, $response),
                ]);
                CustomLogger::logInfo($log, 'Error',  [
                    'item' => $item,
                    'response' => $response
                ]);
            }


        }

        return $this->sendResponse(true, null, "Payment statuses.");
    }

    public function devCheckPaymentStatusById(Request $request, $id = null)
    {
        if($request->hash && $request->order_id){
            $hash = $request->hash;
            $order_id = $request->order_id;
        }else{
            if($id){
                $item= Transaction::select('id', 'hash', 'order_id', 'status', 'created_at')->where('id', $id)->first();
                $hash = $item->hash;
                $order_id = $item->order_id;
            }
        }

        $service = new EdfaPayStatusService();
        $response = $service->checkPaymentStatus($hash, $order_id);

        return $this->sendResponse(true, [
            'response' => $response,
            'hash' => $hash,
            'order_id' => $order_id,
        ], "Payment statuses.");
    }

    public function paymentStatus($id)
    {
        // return "test";
        $item = UserVideo::whereHas('transaction')
            ->where('id', $id)
            ->first();

        if (!$item) {
            return $this->sendResponse(false, null, "item has not transaction or not found");
        }

        $service = new EdfaPayStatusService();
        $response = $service->checkPaymentStatus($item->transaction?->hash, $item->transaction->order_id);
        return $this->sendResponse(true, [$response], "Response");
    }

    function redirectPayment($local, $id) {
        $item = UserVideo::findOrFail($id);

        if($item->status == VideoPaymentStatus::UnderReview->value){
            sleep(3);
            $item = UserVideo::find($id);
        }

        if($item->status == VideoPaymentStatus::UnderReview->value) {
            $service = new EdfaPayStatusService();
            $response = $service->checkPaymentStatus($item->transaction?->hash, $item->transaction->order_id);

            if (isset($response['error']) && $response['error'] === true) {
                $item->update([
                    'status' => VideoPaymentStatus::Rejected->value,
                ]);
            } else if (isset($response['statusCode']) && $response['statusCode'] === 200) {
                $responseBody = $response['responseBody'];
                $status = ($responseBody['status'] === 'settled' || $responseBody['status'] == 'pending') ? VideoPaymentStatus::Accepted->value : VideoPaymentStatus::Rejected->value;

                if ($item->transaction && $item->status == VideoPaymentStatus::UnderReview->value) {
                    $item->transaction->update([
                        'status' => strtoupper($responseBody['status']),
                        'response' => $this->appendResponseHistory($item->transaction, $responseBody),
                    ]);
                }

                $item->update([
                    'status' => $status,
                ]);
            }
        }

        $is_success = ($item->status == VideoPaymentStatus::Accepted->value)? 1 : 0;
        return redirect()->away(config("app.platform") .$local."/payment/".$item->video->id."?success=$is_success");
    }
}
