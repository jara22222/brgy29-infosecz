<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasUlids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'documentName',
        'documentType',
        'documentPurpose',
        'commonUse',
        'physicalRequirements',
        'status'
    ];
    
    protected $casts = [
        'status' => 'string',
    ];
    
    protected $attributes = [
        'status' => 'active',
    ];
}
