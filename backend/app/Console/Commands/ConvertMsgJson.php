<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ConvertMsgJson extends Command
{
    protected $signature = 'lang:cmj'; // convert-msg-json
    protected $description = 'Convert msg.json in all locales to msg.php';

    public function handle()
    {
        $langDir = base_path('lang');

        // Get all folders inside lang (locales like ar, en, etc.)
        $locales = array_filter(scandir($langDir), function ($item) use ($langDir) {
            return $item !== '.' && $item !== '..' && is_dir($langDir . '/' . $item);
        });

        $count = 0;

        foreach ($locales as $locale) {
            $jsonPath = "$langDir/$locale/msg.json";
            $phpPath  = "$langDir/$locale/msg.php";

            if (!File::exists($jsonPath)) {
                $this->line("❌ Skipped: $locale/msg.json not found.");
                continue;
            }

            $json = File::get($jsonPath);
            $array = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->error("❌ Invalid JSON in $locale/msg.json.");
                continue;
            }

            $exported = "<?php\n\nreturn " . var_export($array, true) . ";\n";
            File::put($phpPath, $exported);

            $this->info("✅ Converted: $locale/msg.json → msg.php");
            $count++;
        }

        $this->line("✨ Conversion complete. ($count file(s) converted)");
        return 0;
    }
}
