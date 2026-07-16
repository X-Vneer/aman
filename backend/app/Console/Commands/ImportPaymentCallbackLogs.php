<?php

namespace App\Console\Commands;

use App\Models\PaymentCallbackLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportPaymentCallbackLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:import-callback-logs {--dry-run : Run without inserting data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import payment callback logs from log files into payment_callback_logs table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $logsPath = storage_path('logs');
        $years = ['2025', '2026'];
        $logFileName = 'edfaPayCallback.log';

        $this->info('Starting import of payment callback logs...');
        $this->newLine();

        $totalProcessed = 0;
        $totalInserted = 0;
        $totalSkipped = 0;
        $totalErrors = 0;

        foreach ($years as $year) {
            $yearPath = "{$logsPath}/{$year}";

            if (!File::exists($yearPath)) {
                $this->warn("Directory not found: {$yearPath}");
                continue;
            }

            $this->info("Processing year: {$year}");

            // Find all edfaPayCallback.log files recursively
            $logFiles = $this->findLogFiles($yearPath, $logFileName);

            $this->line("Found " . count($logFiles) . " log file(s) in {$year}");

            foreach ($logFiles as $logFile) {
                $this->line("Processing: " . str_replace($logsPath . '/', '', $logFile));

                $result = $this->processLogFile($logFile);
                $totalProcessed += $result['processed'];
                $totalInserted += $result['inserted'];
                $totalSkipped += $result['skipped'];
                $totalErrors += $result['errors'];
            }
        }

        $this->newLine();
        $this->info('Import completed!');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Lines Processed', $totalProcessed],
                ['Successfully Inserted', $totalInserted],
                ['Skipped (Duplicates)', $totalSkipped],
                ['Errors', $totalErrors],
            ]
        );

        return 0;
    }

    /**
     * Find all log files recursively
     */
    private function findLogFiles($directory, $fileName)
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getFilename() === $fileName) {
                $files[] = $file->getPathname();
            }
        }

        return $files;
    }

    /**
     * Process a single log file
     */
    private function processLogFile($filePath)
    {
        $processed = 0;
        $inserted = 0;
        $skipped = 0;
        $errors = 0;

        if (!File::exists($filePath)) {
            return compact('processed', 'inserted', 'skipped', 'errors');
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $processed++;

            try {
                // Extract JSON from log line
                // Format: [2026-02-03 13:06:26] local.INFO: Request {"request":{...}}
                $jsonStart = strpos($line, '{"request":');

                if ($jsonStart === false) {
                    $errors++;
                    continue;
                }

                $jsonString = substr($line, $jsonStart);
                $data = json_decode($jsonString, true);

                if (json_last_error() !== JSON_ERROR_NONE || !isset($data['request'])) {
                    $errors++;
                    continue;
                }

                $requestData = $data['request'];

                // Check if already exists (by trans_id and order_id combination)
                if (!$this->option('dry-run')) {
                    $exists = PaymentCallbackLog::where('trans_id', $requestData['trans_id'] ?? null)
                        ->where('order_id', $requestData['order_id'] ?? null)
                        ->where('trans_date', $requestData['trans_date'] ?? null)
                        ->exists();

                    if ($exists) {
                        $skipped++;
                        continue;
                    }

                    // Insert into database
                    PaymentCallbackLog::create([
                        'request_data' => $requestData,
                        'action' => $requestData['action'] ?? null,
                        'result' => $requestData['result'] ?? null,
                        'status' => $requestData['status'] ?? null,
                        'order_id' => $requestData['order_id'] ?? null,
                        'trans_id' => $requestData['trans_id'] ?? null,
                        'trans_date' => $requestData['trans_date'] ?? null,
                        'amount' => $requestData['amount'] ?? null,
                        'currency' => $requestData['currency'] ?? null,
                        'hash' => $requestData['hash'] ?? null,
                        'rrn' => $requestData['rrn'] ?? null,
                        'card_brand' => $requestData['card_brand'] ?? null,
                        'merchant_name' => $requestData['merchant_name'] ?? null,
                        'transaction_identifier' => $requestData['transaction_identifier'] ?? null,
                        'processor_mid' => $requestData['processor_mid'] ?? null,
                        'methods' => $requestData['methods'] ?? null,
                        'redirect_url' => $requestData['redirect_url'] ?? null,
                        'redirect_params' => is_string($requestData['redirect_params'] ?? null)
                            ? $requestData['redirect_params']
                            : json_encode($requestData['redirect_params'] ?? null),
                        'redirect_method' => $requestData['redirect_method'] ?? null,
                        'card' => $requestData['card'] ?? null,
                        'card_expiration_date' => $requestData['card_expiration_date'] ?? null,
                        'sessionId' => $requestData['sessionId'] ?? null,
                        'decline_reason' => $requestData['decline_reason'] ?? null,
                    ]);

                    $inserted++;
                } else {
                    // Dry run mode - just count
                    $inserted++;
                }

            } catch (\Exception $e) {
                $errors++;
                $this->error("Error processing line: " . $e->getMessage());
            }
        }

        return compact('processed', 'inserted', 'skipped', 'errors');
    }
}
