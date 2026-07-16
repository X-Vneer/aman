<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ZipArchive;

class CompressProjectFolders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'project:compress';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compress project folders into a single archive';

    protected $mainFolders = [
        'app',
        'config',
        'database',
        'lang',
        'resources',
        'routes',
        'tests',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting project compression...');

        $folderSizes = [];
        $zipPath = base_path('project_backup.zip');

        // Create new zip archive
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            foreach ($this->mainFolders as $folder) {
                if (File::isDirectory(base_path($folder))) {
                    $this->info("Adding {$folder} folder to archive...");

                    // Calculate folder size before compression
                    $originalSize = $this->calculateFolderSize(base_path($folder));

                    // Add folder to zip
                    $this->addFolderToZip($zip, base_path($folder), $folder);

                    $folderSizes[] = [
                        'folder' => $folder,
                        'size' => $this->formatSize($originalSize)
                    ];
                }
            }

            $zip->close();

            // Get final archive size
            $archiveSize = File::size($zipPath);

            $this->info("\nCompression Summary:");
            $this->table(
                ['Folder', 'Original Size'],
                $folderSizes
            );

            $this->info("\nFinal Archive:");
            $this->table(
                ['Path', 'Total Size'],
                [[
                    'project_backup.zip',
                    $this->formatSize($archiveSize)
                ]]
            );
        } else {
            $this->error("Failed to create zip file");
            return 1;
        }
    }

    protected function addFolderToZip($zip, $path, $relativePath)
    {
        $files = File::allFiles($path);
        foreach ($files as $file) {
            $filePath = $file->getRealPath();
            $relativeName = substr($filePath, strlen(base_path()) + 1);
            $zip->addFile($filePath, $relativeName);
        }
    }

    protected function formatSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, 2) . ' ' . $units[$pow];
    }

    protected function calculateFolderSize($path)
    {
        $size = 0;
        foreach (File::allFiles($path) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }
}
