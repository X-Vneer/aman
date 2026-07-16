<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\SyncsArticleTags;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\NewsRequest;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends BaseApiController
{
    use DestroyTrait, EditTrait, IndexTrait, ShowTrait, ToggleActiveTrait;
    use SyncsArticleTags;

    public function __construct()
    {
        parent::__construct(News::class);
    }

    public function index(Request $request)
    {
        return $this->indexInit($request, function ($items) {
            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            return [$items];
        });
    }

    public function show($idOrSlug)
    {
        $id = $this->resolveIdOrSlug($idOrSlug);
        if ($id === null) {
            return $this->sendResponse(false, [], trans('This Item is Inactive'), null, 404);
        }

        return $this->showInit($id, function ($item) {
            $item->load('tags');

            return [$item];
        }, auth('admin')->check());
    }

    protected function resolveIdOrSlug(mixed $value): ?int
    {
        $key = $this->primaryKey;

        $bySlug = $this->model::withTrashed()->where('slug', (string) $value)->value($key);
        if ($bySlug !== null) {
            return (int) $bySlug;
        }

        if (ctype_digit((string) $value)) {
            $byId = $this->model::withTrashed()->where($key, (int) $value)->value($key);

            return $byId === null ? null : (int) $byId;
        }

        return null;
    }

    public function create()
    {
        try {
            return $this->sendResponse(true, [], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(NewsRequest $request)
    {
        $inputs = $request->validated();
        $tagNames = $inputs['tags'] ?? [];
        unset($inputs['tags']);

        $item = $this->model::create($inputs);

        if (! empty($tagNames)) {
            $this->syncArticleTags($item, $tagNames);
        }

        return $this->sendResponse(true, [
            'item' => new $this->resource($item->refresh()->load('tags')),
        ], trans('Created'), null, 201, $request);
    }

    public function edit($id)
    {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(NewsRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $tagNames = $inputs['tags'] ?? [];
            unset($inputs['tags']);

            $item = $this->model::withTrashed()->findOrFail($id);
            $item->update($inputs);

            if ($request->has('tags')) {
                $this->syncArticleTags($item, $tagNames);
            }

            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()->load('tags')),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function destroy($id)
    {
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    public function toggleActive($id, $state)
    {
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }
}
