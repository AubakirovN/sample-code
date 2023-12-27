<?php

namespace App\Http\Controllers\Good;

use App\Enums\ServiceNameEnum;
use App\Http\Controllers\Controller;
use App\Services\CrudService\CrudService;
use App\Services\GoodService\GoodService;
use Illuminate\Http\Request;

class GoodController extends Controller
{
    const SLUG = ServiceNameEnum::Good;

    public function __construct(
        protected GoodService $goodService,
        protected CrudService $crudService
    ) {}

    public function index(Request $request)
    {
        return $this->crudService->getAll(self::SLUG->value,  $request);
    }

    public function show($id, Request $request)
    {
        return $this->crudService->getById($id, self::SLUG->value, $request);
    }

    public function update($id, Request $request)
    {
        return $this->crudService->update($id, $request, self::SLUG->value);
    }

    public function destroy($id)
    {
        return $this->crudService->delete($id, self::SLUG->value);
    }

    public function uploadGoods(Request $request)
    {
        return $this->goodService->uploadGoods($request);
    }

    public function getGoodsBySearch(Request $request)
    {
        return $this->goodService->getGoodsBySearch($request);
    }

    public function getAllGoods(Request $request)
    {
        return $this->goodService->getAllGoods($request);
    }
}