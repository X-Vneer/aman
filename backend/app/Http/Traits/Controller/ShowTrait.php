<?php


namespace App\Http\Traits\Controller;

use Illuminate\Support\Facades\Validator;

trait ShowTrait
{
    public function showInit($id, $callBack=null, $deleted_at=true)
    {
        // try {
            $validator = Validator::make([$this->primaryKey => $id], [
                $this->primaryKey => 'required|exists:' . $this->table . ',' . $this->primaryKey,
            ]);

            $check = $this->checkValidator($validator);
            if ($check) return $check;

            $items = $this->model::select();
            if($deleted_at){
                $items = $items->withTrashed();
            }

            $item = $items->where($this->primaryKey, $id)->first();
            if(!$item){
                return $this->sendResponse(false, [
                ], trans('This Item is Inactive'), null, 403);
            }

            if($callBack){
                $response = $callBack($item);
                if($response[0] === false) return $response[1];
                $item = $response[0];
            }


            return $this->sendResponse(true, [
                'item' => new $this->resource($item),
            ], trans('show'));
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }
}
