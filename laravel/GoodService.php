<?php

namespace App\Services\GoodService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class GoodService
{
    public function getServiceUrl()
    {
        return config('app.crud_service_url');
    }

    public function getGoodsBySearch(Request $request)
    {
        $projectId = $request->header('project');

        $response = Http::withHeaders(['Project' => $projectId])->post($this->getServiceUrl() . '/goods-by-search', $request->all());

        if ($response->status() === 400) {
            return response()->json($response->json(), 400);
        } else {
            return $response->json();
        }
    }

    public function getAllGoods(Request $request)
    {
        $projectId = $request->header('project');

        $response = Http::withHeaders(['Project' => $projectId])->get($this->getServiceUrl() . '/all-goods');

        if ($response->status() === 400) {
            return response()->json($response->json(), 400);
        } else {
            return $response->json();
        }
    }

    public function uploadGoods(Request $request)
    {
        $project = $request->header('project');

        $client = Http::asMultipart();

        $rules = [
            'file' => 'required|mimes:xlsx|max:2048', // Adjust max file size as needed
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        // Retrieve the uploaded file
        $excelFile = $request->file('file');

        if ($excelFile->isValid()) {

            $fileContents = file_get_contents($excelFile->getRealPath());
            $result = $client->attach('file', $fileContents, $excelFile->getClientOriginalName())
                ->withHeaders(['Project' => $project])
                ->post(env('CRUD_SERVICE_URL') . '/upload-goods');


            if ($result->successful()) {
                return response()->json([
                    'message' => 'File uploaded and sent successfully.',
                ], 200);
            } else {
                return response()->json(['error' => 'Failed to upload file', 'message' => $result->body()],
                    $result->status());
            }
        } else {
            return response()->json([
                'error' => 'File upload failed'
            ], 500);
        }

    }
}