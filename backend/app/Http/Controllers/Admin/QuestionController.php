<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\QuestionStoreRequest;
use App\Http\Resources\QuestionEditResource;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\Question;
use App\Models\UserAnswer;
use App\Models\UserVideo;
use App\Models\Video;
use Illuminate\Support\Facades\DB;

class QuestionController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(Question::class);
    }

    function index(Request $request) {
        return $this->indexInit($request, null, [], false, null, null);
    }

    function show($id) {
        return $this->showInit($id, null, false);
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

    public function store(QuestionStoreRequest $request)
    {
        // try {
            $inputs = $request->validated();
            DB::beginTransaction();
            $item = $this->model::create($inputs);
            $video = Video::withTrashed()->where('id', $request->video_id)->first();
            $this->resetUserVideosForVideo($video);
            DB::commit();
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function edit($id) {
        $this->resource = QuestionEditResource::class;
         return $this->editInit($id, null, false);
    }

    public function update(QuestionStoreRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::find($id);
            $video = Video::withTrashed()->where('id', $item->video_id)->first();

            $this->resetUserVideosForVideo($video);
            $item->update($inputs);
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    protected function resetUserVideosForVideo(Video $video): void
    {
        $userVideoIds = UserVideo::whereNull('certificate_number')
            ->where('video_id', $video->id)
            ->pluck('id')->toArray();

        UserAnswer::whereIn('user_video_id', $userVideoIds)->delete();
        UserVideo::whereIn('id', $userVideoIds)->update([
            'answer_average' => '00:00:00',
            'hearts' => 5,
            'total_questions' => $video->questions->count(),
            'correct_answers' => 0,
            'progress' => 0,
            'current_time' => '00:00:00',
            'last_question_id' => null,
        ]);
    }

    function destroy($id) {
        return $this->destroyInit($id, null, false);
    }

    function toggleActive($id, $state) {
        return $this->toggleActiveInit($id, $state, null, false);
    }

}
