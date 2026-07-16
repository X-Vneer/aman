<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

trait SyncsArticleTags
{
    /**
     * @param  Model&object{ tags(): MorphToMany }  $article
     * @param  array<int, string>  $tagNames
     */
    protected function syncArticleTags(Model $article, array $tagNames): void
    {
        $tagIds = [];
        foreach ($tagNames as $tagName) {
            $tagName = trim((string) $tagName);
            if ($tagName === '') {
                continue;
            }
            $slug = Str::slug($tagName);
            $tag = Tag::where('slug', $slug)->first();
            if (! $tag) {
                $tag = Tag::where('name', $tagName)->first();
            }
            if (! $tag) {
                $tag = Tag::create([
                    'name' => $tagName,
                    'slug' => $slug,
                ]);
            }
            $tagIds[] = $tag->id;
        }
        $article->tags()->sync($tagIds);
    }
}
