package goods

import (
  initializers "app/initializer"
  "app/pkg/logging"
  "app/pkg/response"
  "encoding/json"
  "fmt"
  "github.com/julienschmidt/httprouter"
  "github.com/xuri/excelize/v2"
  "log"
  _ "mime/multipart"
  "net/http"
  "strconv"
  "time"
)

const (
  goods      = "/api/goods"
  goodUpload = "/api/upload-goods"
  goodId     = "/api/goods/:good_id"

  goodsAll      = "/api/all-goods"
  goodBySearch  = "/api/goods-by-search"
  MaxUploadSize = 5 * 1024 * 1024 //5MB
)

type Handler struct {
  Logger  logging.Logger
  Service Service
  Config  initializers.Config
}

func (h *Handler) Register(router *httprouter.Router) {
  router.HandlerFunc(http.MethodPost, goodUpload, h.ImportGoods)
  router.HandlerFunc(http.MethodPut, goodId, h.UpdateGood)
  router.HandlerFunc(http.MethodGet, goodId, h.GetGoodById)
  router.HandlerFunc(http.MethodGet, goods, h.GetAllGoods)
  router.HandlerFunc(http.MethodGet, goodsAll, h.GetAllGoodsWithStock)
  router.HandlerFunc(http.MethodDelete, goodId, h.DeleteGood)

  router.HandlerFunc(http.MethodPost, goodBySearch, h.GetStockGoodBySearch)
}

func (h *Handler) ImportGoods(w http.ResponseWriter, r *http.Request) {
  fmt.Println("Importing goods")

  h.Logger.Info("Create Category By Project Id")
  w.Header().Set("Content-Type", "application/json")

  projectIdStr := r.Header.Get("Project")
  fmt.Println("projectId", projectIdStr)
  if len(projectIdStr) == 0 {
    response.GetResponse(w, true, false, "Invalid Projects Uid", nil)
    return
  }
  // Get the uploaded file
  err := r.ParseMultipartForm(10 << 20) // 10 MB limit for file size
  if err != nil {
    http.Error(w, "Unable to parse form", http.StatusBadRequest)
    return
  }
  // Get the uploaded file
  file, _, err := r.FormFile("file") // "file" should match the name attribute of the file input in the HTML form
  if err != nil {
    http.Error(w, "Unable to get file from request", http.StatusBadRequest)
    return
  }
  defer file.Close()

  xlFile, err := excelize.OpenReader(file)
  if err != nil {
    // Handle the error
    log.Printf("Error opening Excel file: %v", err)
    return
  }
  defer xlFile.Close()

  sheetName := xlFile.GetSheetName(xlFile.GetActiveSheetIndex())
  rows, err := xlFile.GetRows(sheetName)
  if err != nil {
    // Handle the error
    log.Printf("Error getting rows: %v", err)
    return
  }
  var objs []Goods

  for i, row := range rows {
    if i == 0 {
      continue // Skip header row
    }

    data := Goods{
      ProjectId: projectIdStr,
      CreatedAt: time.Now(),
      UpdatedAt: time.Now(),
    }

    // Ensure the row has enough columns to avoid index out of range error
    if len(row) >= 7 {
      data.Barcode = row[0]
      data.Brand = row[1]
      data.Name = row[2]
      data.ImageUrl = row[5]
      data.CategoryId, _ = strconv.ParseInt(row[6], 10, 64)
    }

    objs = append(objs, data)
  }

  fmt.Println("Data imported successfully!")
  for _, obj := range objs {
    fmt.Printf("Barcode: %s, brand: %s, name: %s, image: %s, category: %s\n",
      obj.Barcode, obj.Brand, obj.Name, obj.ImageUrl, obj.CategoryId)
  }

  err = h.Service.ImportGoods(objs)
  if err != nil {
    response.GetResponse(w, true, false, err.Error(), nil)
    return
  }
  response.GetResponse(w, true, true, "Successfully created", err)
  return
}

func (h *Handler) GetAllGoods(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Get All Goods")
  writer.Header().Set("Content-Type", "application/json")

  projectIdStr := request.Header.Get("Project")

  if len(projectIdStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Projects Uid", nil)
    return
  }

  // Getting information from the service
  city, err := h.Service.GetAllGoods(projectIdStr)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  response.GetResponse(writer, true, true, "Success", city)
  return
}


func (h *Handler) GetAllGoodsWithStock(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Get All Goods with stocks")
  writer.Header().Set("Content-Type", "application/json")

  projectIdStr := request.Header.Get("Project")

  if len(projectIdStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Projects Uid", nil)
    return
  }

  // Getting information from the service
  city, err := h.Service.GetAllGoodsWithStock(projectIdStr)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  response.GetResponse(writer, true, true, "Success", city)
  return
}

func (h *Handler) GetGoodById(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Get Good By Id")
  writer.Header().Set("Content-Type", "application/json")

  params := request.Context().Value(httprouter.ParamsKey).(httprouter.Params)
  idStr := params.ByName("good_id")

  if len(idStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Good Uid", nil)
    return
  }

  id, err := strconv.ParseInt(idStr, 10, 64)

  // Getting information from the service
  good, err := h.Service.GetById(id)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  response.GetResponse(writer, true, true, "Success", good)
  return
}

func (h *Handler) UpdateGood(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Update Good By Project Id")
  writer.Header().Set("Content-Type", "application/json")

  params := request.Context().Value(httprouter.ParamsKey).(httprouter.Params)
  goodIdStr := params.ByName("good_id")
  if len(goodIdStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Good Uid", nil)
    return
  }
  goodId, err := strconv.ParseInt(goodIdStr, 10, 64)

  projectIdStr := request.Header.Get("Project")

  if len(projectIdStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Projects Uid", nil)
    return
  }

  var data GoodsInput
  defer request.Body.Close()
  if err := json.NewDecoder(request.Body).Decode(&data); err != nil {

    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  isValidate, errorMsg := Validate(data)
  if !isValidate {
    responses := response.Response{
      IsSuccess:    false,
      IsError:      true,
      ErrorMessage: "error",
      Errors:       errorMsg,
      Data:         nil,
    }
    responseJSON, _ := json.Marshal(responses)
    writer.Header().Set("Content-Type", "application/json")
    writer.WriteHeader(http.StatusBadRequest)
    writer.Write(responseJSON)
    return
  }

  // Updating information from the service
  good, err := h.Service.Update(goodId, projectIdStr, data)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }
  response.GetResponse(writer, true, true, "Successfully updated", good)
  return
}

func (h *Handler) DeleteGood(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Delete Good by id")
  writer.Header().Set("Content-Type", "application/json")

  params := request.Context().Value(httprouter.ParamsKey).(httprouter.Params)
  idStr := params.ByName("good_id")
  if len(idStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Good Uid", nil)
    return
  }

  id, err := strconv.ParseInt(idStr, 10, 64)

  // Deleting information from the service
  err = h.Service.Delete(id)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  response.GetResponse(writer, true, true, "Successfully deleted", nil)
  return
}

func (h *Handler) GetStockGoodBySearch(writer http.ResponseWriter, request *http.Request) {
  h.Logger.Info("Create StockGood By Search")
  writer.Header().Set("Content-Type", "application/json")

  projectIdStr := request.Header.Get("Project")

  if len(projectIdStr) == 0 {
    response.GetResponse(writer, true, false, "Invalid Projects Uid", nil)
    return
  }

var data SearchInput
  defer request.Body.Close()
  if err := json.NewDecoder(request.Body).Decode(&data); err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }

  // Creating information from the service
  goods, err := h.Service.GetStockGoodBySearch(data, projectIdStr)
  if err != nil {
    response.GetResponse(writer, true, false, err.Error(), nil)
    return
  }
  response.GetResponse(writer, true, true, "Successfully created", goods)
  return
}