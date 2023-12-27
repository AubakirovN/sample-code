<?php

use App\Http\Controllers\Admin\InfoController;
use App\Http\Controllers\Banners\BannersController;
use App\Http\Controllers\City\CityActiveController;
use App\Http\Controllers\City\CityController;
use App\Http\Controllers\Details\DetailsController;
use App\Http\Controllers\Entities\EntitiesController;
use App\Http\Controllers\FileProperties\FilePropertiesController;
use App\Http\Controllers\Good\GoodController;
use App\Http\Controllers\Kitchen\KitchenController;
use App\Http\Controllers\LanguageStaticTranslation\LanguageStaticTranslationsController;
use App\Http\Controllers\LanguageTranslation\LanguageTranslationsController;
use App\Http\Controllers\Menu\MenuManageController;
use App\Http\Controllers\PageManage\PageManageController;
use App\Http\Controllers\Platforms\PlatformsController;
use App\Http\Controllers\Translation\TranslationController;
use App\Http\Controllers\Vacancy\VacancyController;
use App\Http\Controllers\LanguageCodes\LanguageCodesController;
use App\Http\Controllers\Languages\LanguagesController;
use App\Http\Controllers\Logos\LogosController;
use App\Http\Controllers\MainStock\MainStockController;
use App\Http\Controllers\Menu\AdminMenuController;
use App\Http\Controllers\Admin\ElementsController;
use App\Http\Controllers\Menu\MenuController;
use App\Http\Controllers\News\NewsController;
use App\Http\Controllers\Catalog\CatalogController;
use App\Http\Controllers\GatewayController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\Prize\PrizeController;
use App\Http\Controllers\InnerObjects\InnerObjectsController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Recipe\RecipeIngredientController;
use App\Http\Controllers\Recipe\RecipeMethodController;
use App\Http\Controllers\Sliders\SlidersController;
use App\Http\Controllers\Status\StatusController;
use App\Http\Controllers\Recipe\RecipeCategoriesController;
use App\Http\Controllers\Recipe\RecipeController;
use App\Http\Controllers\Aggregator\AggregatorController;
use App\Http\Controllers\AggregatorShops\AggregatorShopsController;
use App\Http\Controllers\PromotionalGoods\PromotionalGoodsController;
use App\Http\Controllers\Receipt\ReceiptController;
use App\Http\Controllers\ReceiptBody\ReceiptBodyController;
use App\Http\Controllers\SaleTypes\SaleTypesController;
use App\Http\Controllers\ShopTypes\ShopTypesController;
use App\Http\Controllers\Stock\StockController;
use App\Http\Controllers\Shop\ShopController;
use App\Http\Controllers\Stock\Receipt\ReceiptController as ReceiptInStockController;
use App\Http\Controllers\Stock\Winner\WinnersController as WinnersInStockController;
use App\Http\Controllers\StockBrands\StockBrandsController;
use App\Http\Controllers\StockGood\StockGoodController;
use App\Http\Controllers\Winner\WinnerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Media\MediaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

//Route::middleware(['validateToken'])->group(function () {
    Route::resources([
        'news' => NewsController::class,
        'city' => CityController::class,
        'prize' => PrizeController::class,
        'inner-objects' => InnerObjectsController::class,
        'category' => CategoryController::class,
        'stock' => StockController::class,
        'shop' => ShopController::class,
        'receipt' => ReceiptController::class,
        'winner' => WinnerController::class,
        'main-stock' => MainStockController::class,
        'catalog' => CatalogController::class,
        'goods' => GoodController::class,
        'menu-item' => MenuController::class,
        'menu-manage' => MenuManageController::class,
        'page-manage' => PageManageController::class,
        'promotional-goods' => PromotionalGoodsController::class,
        'stock-brands' => StockBrandsController::class,
        'sale-type' => SaleTypesController::class,
        'project' => ProjectController::class,
        'status' => StatusController::class,
        'recipe-categories' => RecipeCategoriesController::class,
        'recipe' => RecipeController::class,
        'recipe-ingredient' => RecipeIngredientController::class,
        'recipe-method' => RecipeMethodController::class,
        'aggregator' => AggregatorController::class,
        'aggregator-shops' => AggregatorShopsController::class,
        'shop-type' => ShopTypesController::class,
        'logos' => LogosController::class,
        'sliders' => SlidersController::class,
        'banners' => BannersController::class,
        'stock-goods' => StockGoodController::class,
        'file-properties' => FilePropertiesController::class,
        'languages' => LanguagesController::class,
        'language-codes' => LanguageCodesController::class,
        'language-translations' => LanguageTranslationsController::class,
        'language-static-translations' => LanguageStaticTranslationsController::class,
        'language-platforms' => PlatformsController::class,
        'language-details' => DetailsController::class,
        'language-entities' => EntitiesController::class,
    ]);

Route::get('/sliders-path', [SlidersController::class, 'getSlidersPath']);
Route::get('/banners-path', [BannersController::class, 'getBannersPath']);
Route::get('/medias/{model_name}/{model_id}', [MediaController::class, 'index']);
Route::get('/media/{model_name}/{model_id}/{media_type}', [MediaController::class, 'index']);
Route::post('/media/{model_name}/{model_id}', [MediaController::class, 'store']);
Route::put('/media/{model_name}/{model_id}/{media_type}/{media_uid}', [MediaController::class, 'update']);
Route::get('/medias/{model_name}', [MediaController::class, 'getByModelName']);

Route::post('/language-static-get-translations', [TranslationController::class, 'index']);

Route::delete('/medias/{model_name}/{model_id}/{media_id}', [MediaController::class, 'destroy']);

Route::post('/file-properties/update-all', [FilePropertiesController::class, 'updateAll']);

Route::put('/delete-all-promotional-goods', [PromotionalGoodsController::class, 'deleteAllPromotionalGoods']);
Route::post('/delete-all-promotional-goods', [PromotionalGoodsController::class, 'getAllDeletingPromotionalGoods']);
//kitchen
Route::get('/kitchen', [KitchenController::class, 'getData']);
Route::put('/kitchen/{id}', [KitchenController::class, 'update']);
Route::post('/kitchen-search', [KitchenController::class, 'search']);

//vacancy - resume
Route::get('/resume', [VacancyController::class, 'getData']);
Route::post('/resume-search/{project}', [VacancyController::class, 'search']);


// Admin settings
// TO DO: middleware check role for admin
Route::post('/admin/menu', [AdminMenuController::class, 'store']);
Route::get('/admin/menu', [AdminMenuController::class, 'getMenu']);
Route::get('/admin/menu/{id}', [AdminMenuController::class, 'show']);
Route::put('/admin/menu/{id}', [AdminMenuController::class, 'activateMenu']);
Route::put('/admin/menu/{id}', [AdminMenuController::class, 'update']);
Route::delete('/admin/menu/{id}', [AdminMenuController::class, 'destroy']);
Route::get('/menu-items/{id}', [MenuController::class, 'showMenuItemsById'])->where('id', '[0-9]+');
Route::get('/menu-items-name/{name}', [MenuController::class, 'showMenuItemsByName']);


Route::post('/admin/elements', [ElementsController::class, 'store']);
Route::get('/admin/elements', [ElementsController::class, 'index']);
Route::put('/admin/elements/{id}', [ElementsController::class, 'update']);
Route::get('/admin/elements-active', [ElementsController::class, 'activeElements']);
Route::delete('/admin/elements/{id}', [ElementsController::class, 'destroy']);


Route::post('/admin/info', [InfoController::class, 'store']);
Route::get('/admin/info', [InfoController::class, 'index']);
Route::put('/admin/info/{id}', [InfoController::class, 'update']);
Route::get('/admin/info-active', [InfoController::class, 'activeInfo']);
Route::get('/admin/info/{location}', [InfoController::class, 'location']);
Route::delete('/admin/info/{id}', [InfoController::class, 'destroy']);


Route::put('/delete-all-promotional-goods', [PromotionalGoodsController::class, 'deleteAllPromotionalGoods']);
Route::post('/delete-all-promotional-goods', [PromotionalGoodsController::class, 'getAllDeletingPromotionalGoods']);

Route::post('/goods-by-search', [GoodController::class, 'getGoodsBySearch']);
Route::get('/all-goods', [GoodController::class, 'getAllGoods']);

Route::get('/receipt-body/{id}', [ReceiptBodyController::class, 'showByReceiptId']);

Route::get('/check-receipt', [ReceiptController::class, 'index']);
Route::get('stock/receipt/{stockId}', [ReceiptInStockController::class, 'index']);
Route::get('stock/goods/{stockId}', [StockGoodController::class, 'getStockGoodsByStockId']);
Route::get('winners/stock/{stockId}', [WinnersInStockController::class, 'index']);
Route::get('/city-active', [CityActiveController::class, 'index']);
Route::get('/inner-objects-active', [InnerObjectsController::class, 'selectedInnerObjects']);
Route::get('/aggregator-active', [AggregatorController::class, 'active']);

Route::post('/upload', [FileUploadController::class, 'upload']);
Route::get('/files/{modelName}/{modelId}', [FileUploadController::class, 'getFiles']);
Route::get('/images/{modelName}/{modelId}', [FileUploadController::class, 'getImages']);
Route::get('/images/{modelName}/{modelId}', [FileUploadController::class, 'getImages']);
Route::delete('/images/{modelId}', [FileUploadController::class, 'deleteImage']);
Route::delete('/images/{modelName}/{modelId}', [FileUploadController::class, 'destroy']);

Route::post('/upload-stock-goods/{stockId}', [StockGoodController::class, 'uploadStockGoods']);
Route::post('/upload-goods', [GoodController::class, 'uploadGoods']);
Route::post('/upload-promotional-goods', [PromotionalGoodsController::class, 'uploadPromotionalGoods']);

Route::get('/all-projects', [ProjectController::class, 'getProjects']);
Route::post('/list-projects', [ProjectController::class, 'projectsByIds']);


//});

Route::post('/login', [GatewayController::class, 'login']);
Route::get('/token/{refresh}', [GatewayController::class, 'refresh']);
Route::get('/logout', [GatewayController::class, 'logout']);

