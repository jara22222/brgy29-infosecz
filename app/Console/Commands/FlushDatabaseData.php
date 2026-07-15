<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FlushDatabaseData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:flush-database-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flush all data from database tables without dropping tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('This will delete ALL data from your database tables!');
        $this->warn('Tables will remain intact, only data will be removed.');
        
        if (!$this->confirm('Are you sure you want to continue? This action cannot be undone.')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Get all table names
        $tables = DB::select('SHOW TABLES');
        
        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            
            // Skip migrations table if you want to preserve migration history
            if ($tableName === 'migrations') {
                $this->info("Skipping table: {$tableName}");
                continue;
            }
            
            // Truncate the table (delete all data)
            DB::table($tableName)->truncate();
            $this->info("Flushed data from table: {$tableName}");
        }

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('Database data has been successfully flushed!');
        $this->info('Tables remain intact with their structure.');
        
        return 0;
    }
}
