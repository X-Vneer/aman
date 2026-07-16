<?php


namespace App\Http\Traits\Controller;

use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait IndexTrait
{

    /**
     * $sortAllowed: extra sort keys beyond $this->columns.
     *   - string key + true   → bare column sortable via standard orderBy (e.g. virtual generated columns)
     *   - string key + callable → fn($query, $direction): custom join-based sort
     */
    function indexInit(Request $request, $callBack=null, $validations = [], $deleted_at = true, $afterGet = null, $helpers = null, $with = null, $q=true, $created_at = 'created_at', $sortAllowed = [])
    {
        // try {
            if($request->date_from)$request->merge(['dateFrom'=> $request->date_from]);
            if($request->date_to)$request->merge(['dateTo'=> $request->date_to]);

            $allowedSortColumns = array_unique(array_merge(['id'], $this->columns, array_keys($sortAllowed)));
            $validator = Validator::make($request->all(), [
                ...config('constants.list_validations'),
                'sort_column' => 'nullable|in:' . implode(',', $allowedSortColumns),
                ...$validations,
            ]);

            $check = $this->checkValidator($validator);
            if ($check) return $check;

            $sortColumn    = $request->sort_column ?? $this->primaryKey;
            $sortDirection = $request->sort_direction ?? 'DESC';
            $sortClosure   = (isset($sortAllowed[$sortColumn]) && is_callable($sortAllowed[$sortColumn]))
                ? $sortAllowed[$sortColumn]
                : null;

            if($deleted_at){
                $items = $this->model::withTrashed();
            }else{
                $items = $this->model::query();
            }


            if ($request->dateFrom) {
                $items =  $items->where($created_at, '>=', Carbon::parse($request->dateFrom));
            }

            if ($request->dateTo) {
                $items =  $items->where($created_at, '<=', Carbon::parse($request->dateTo));
            }

            if($callBack){
                $response = $callBack($items, $request);
                if($response[0] === false) return $response[1];
                $items = $response[0];
            }

            foreach ($this->columns as $column) {
                if ($request->$column) {
                    $where = (Str::contains($column, '_id') || $column == "id")? 'where' : 'likeStart';
                    $items = $items->$where($column, $request->$column);
                }
            }

            if($request->is_active){
                if(in_array('1', $request->is_active) && in_array('0', $request->is_active)){

                } else if(in_array("true", $request->is_active) && in_array("false", $request->is_active)){

                } else if(in_array('1', $request->is_active)){
                    $items = $items->isActive();
                } else if(in_array('0', $request->is_active)){
                    $items = $items->isNotActive();
                }else if(in_array("true", $request->is_active)){
                    $items = $items->isActive();
                }else if(in_array("false", $request->is_active)){
                    $items = $items->isNotActive();
                }
            }

            if($request->q && $q){
                $searchable = $this->columns;
                $items = $items->where(function ($q) use($request, $searchable) {
                    foreach ($searchable as $column) {
                        $q = $q->orLike($column, $request->q);
                    }
                    return $q;
                });
            }

            if($with){
                $items = $items->with($with);
            }

            // Apply sort: closure handles its own join+orderBy; otherwise standard orderBy.
            if($sortClosure){
                $items = $sortClosure($items, $sortDirection);
            }else{
                $items = $items->orderBy($sortColumn, $sortDirection);
            }

            if($request->export == true){
                ini_set('memory_limit', '2G');

                $firstRow = clone  $items;
                $headingItem = $firstRow->first();

                if($headingItem){
                    $headingItem = new $this->resourceExport($headingItem);
                    $this->heading = $headingItem->heading();
                }
                $items = $this->resourceExport::collection($items->cursor());

                // Get averages from helpers if available (for RateController)
                $averages = $helpers['averages'] ?? null;

                return $this->export($items, 'Inaash', 'export', $this->heading, $averages);
            }

            $items = $items->paginate($request->per_page ?? config('constants.per_page'));

            if($afterGet){
                $response = $afterGet($items);
                if($response[0] === false) return $response[1];
                $items = $response[0];
            }
            return $this->sendResponse(true, data: ['helpers' => $helpers,  'items' => $this->resource::collection($items)->response()->getData(true)], message: trans('Listed'), request: $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

}
