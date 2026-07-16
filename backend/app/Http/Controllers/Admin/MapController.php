<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Lang;

class MapController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Country statistics for map visualizations: keyed by ISO 3166-1 numeric id (string),
     * matching topojson/world-atlas geometry `id` (see resources/data/world-atlas/countries-110m.json).
     *
     * `Value` is either log10-scaled (see `map.is_value_log_multiplier`) or equals `ValueRaw`.
     * When log-scaled, `Value` is never less than `ValueRaw`.
     * `ValueRaw` is the configured count. Palestine is also exposed under `376` for the same stats.
     *
     * Response `data` shape:
     * { "682": { "Name": { "en": "...", "ar": "...", "fil": "...", "ur": "...", "fr": "...", "id": "..." }, ... }, ... }
     *
     * Cached 1 month; change `map.cache_code` to invalidate.
     */
    public function countryStatistics(Request $request)
    {
        $cacheCode = (string) config('map.cache_code', '0');
        $cacheKey = 'map.country_statistics.v1.'.$cacheCode;

        $items = Cache::remember($cacheKey, now()->addMonth(), fn () => $this->buildCountryStatisticsItems());

        return $this->sendResponse(true, $items, trans('Listed'), null, 200, $request);
    }

    /**
     * @return array<string, array{Name: array<string, string>, Id: string, Flag: string, Value: int, ValueRaw: int}>
     */
    private function buildCountryStatisticsItems(): array
    {
        $flagTemplate = config('map.flag_url_template', 'https://flagcdn.com/{alpha2}.svg');
        $logMultiplier = (float) config('map.value_log_multiplier', 1000);
        $useLogMultiplier = (bool) config('map.is_value_log_multiplier', true);

        $items = [];
        foreach (config('map.countries', []) as $row) {
            $id = (string) $row['id'];
            $alpha2 = $row['alpha2'] ?? null;
            $flag = $alpha2 !== null && $alpha2 !== ''
                ? str_replace('{alpha2}', strtolower((string) $alpha2), $flagTemplate)
                : '';

            $valueRaw = (int) $row['value'];
            $items[$id] = $this->mapCountryPayload($id, $this->countryNamesByLocale($id), $flag, $valueRaw, $logMultiplier, $useLogMultiplier);
        }

        // World-atlas uses 376 for Israel geometry: surface same Palestine stats + ps flag for that feature id
        if (isset($items['275']) && ! isset($items['376'])) {
            $p = $items['275'];
            $items['376'] = $this->mapCountryPayload('376', $p['Name'], $p['Flag'], (int) $p['ValueRaw'], $logMultiplier, $useLogMultiplier);
        }

        return $items;
    }

    /**
     * Labels for every entry in `config('app.supported_languages')`, using `lang/{locale}/map_countries.php`
     * (en, ar, fil, fr, id, ur). Falls back to English only if a key is missing in that locale file.
     *
     * @return array<string, string>
     */
    private function countryNamesByLocale(string $id): array
    {
        $names = [];
        $key = "map_countries.{$id}";
        foreach (config('app.supported_languages', ['en']) as $locale) {
            $line = Lang::get($key, [], $locale);
            $names[$locale] = ($line === $key)
                ? Lang::get($key, [], 'en')
                : $line;
        }

        return $names;
    }

    /**
     * @param  array<string, string>  $name
     * @return array{Name: array<string, string>, Id: string, Flag: string, Value: int, ValueRaw: int}
     */
    private function mapCountryPayload(string $id, array $name, string $flag, int $valueRaw, float $logMultiplier, bool $useLogMultiplier): array
    {
        $value = $useLogMultiplier
            ? max($valueRaw, (int) round(log10($valueRaw + 1) * $logMultiplier))
            : $valueRaw;

        return [
            'Name' => $name,
            'Id' => $id,
            'Flag' => $flag,
            'Value' => $value,
            'ValueRaw' => $valueRaw,
        ];
    }
}
