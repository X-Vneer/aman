<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class CollectionExport implements FromCollection, WithHeadings, WithColumnFormatting, WithEvents
{
    protected $collection;
    protected $heading;
    protected $averages;

    public function __construct($collection, $heading, $averages = null)
    {
        $this->collection = $collection;
        $this->heading = $heading;
        $this->averages = $averages;
    }

    public function collection()
    {
        return $this->collection;
    }

    public function headings(): array
    {
        return $this->heading;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                if ($this->averages) {
                    $sheet = $event->sheet->getDelegate();
                    $averageRow = 2;

                    // Create average row data matching the heading structure
                    $averageData = [];
                    $rateColumns = []; // Track which columns are rate columns for formatting
                    $firstColumn = true;
                    $columnIndex = 0;

                    foreach ($this->heading as $key) {
                        if ($key === 'rate_1' && isset($this->averages['rate_1'])) {
                            $averageData[] = (string)number_format($this->averages['rate_1'], 2, '.', '');
                            $rateColumns[] = $columnIndex;
                        } elseif ($key === 'rate_2' && isset($this->averages['rate_2'])) {
                            $averageData[] = (string)number_format($this->averages['rate_2'], 2, '.', '');
                            $rateColumns[] = $columnIndex;
                        } elseif ($key === 'rate_3' && isset($this->averages['rate_3'])) {
                            $averageData[] = (string)number_format($this->averages['rate_3'], 2, '.', '');
                            $rateColumns[] = $columnIndex;
                        } elseif ($key === 'rate_4' && isset($this->averages['rate_4'])) {
                            $averageData[] = (string)number_format($this->averages['rate_4'], 2, '.', '');
                            $rateColumns[] = $columnIndex;
                        } else {
                            // For other columns, use empty string or "Average" label for first column
                            if ($firstColumn) {
                                $averageData[] = 'Average';
                                $firstColumn = false;
                            } else {
                                $averageData[] = '';
                            }
                        }
                        $columnIndex++;
                    }

                    // Insert average row after heading
                    $sheet->insertNewRowBefore($averageRow, 1);
                    $sheet->fromArray([$averageData], null, 'A' . $averageRow);

                    // Style the average row
                    $highestColumn = $sheet->getHighestColumn();
                    $sheet->getStyle('A' . $averageRow . ':' . $highestColumn . $averageRow)
                        ->getFont()
                        ->setBold(true);

                    $sheet->getStyle('A' . $averageRow . ':' . $highestColumn . $averageRow)
                        ->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                    // Format rate columns in average row as text to prevent rounding
                    foreach ($rateColumns as $colIndex) {
                        $columnLetter = Coordinate::stringFromColumnIndex($colIndex + 1); // +1 because column indices are 1-based
                        $cell = $columnLetter . $averageRow;

                        // Set format to text
                        $sheet->getStyle($cell)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);
                        // Force as string by setting value explicitly as string type
                        $sheet->setCellValueExplicit($cell, $averageData[$colIndex], \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                    }
                }
            },
        ];
    }

    public function columnFormats(): array
    {
        $formats = [];
        $letters = range('A', 'Z');

        for ($i=0; $i < count($this->heading) -1 ; $i++) {
            $A = $i>22? 'A' : '';
            $ii = $i%22;
            $formats[$A . $letters[$ii]] = NumberFormat::FORMAT_NUMBER;
        }

        return $formats;
    }
}
