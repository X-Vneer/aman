<?php


namespace App\Http\Traits\Controller;

use Illuminate\Support\Facades\Validator;

trait DestroyTrait
{
    public function destroyInit($id, $callBack= null, $deleted_at=true)
    {
        // try {
            $validator = Validator::make([$this->primaryKey => $id], [
                $this->primaryKey => 'required|exists:' . $this->table . ',' . $this->primaryKey,
            ]);

            $check = $this->checkValidator($validator);
            if ($check) return $check;

            if($deleted_at){
                $item = $this->model::withTrashed()->where($this->primaryKey, $id)->first();
            }else{
                $item = $this->model::where($this->primaryKey, $id)->first();
            }
            
            if(!$item){
                return $this->sendResponse(false, [
                ], trans('This Item is Inactive: ' . $id), null, 403);
            }

            if($callBack){
                $response = $callBack($item);
                if($response[0] === false) return $response[1];
                $item = $response[0];
            }


            $oldItem = $item;
            if($deleted_at){
                $item?->forceDelete();
            }else{
                $item->delete();
            }

            return $this->sendResponse(true, [
                'item' => new $this->resource($oldItem),
            ], trans('Destroyed'), null);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }
}
