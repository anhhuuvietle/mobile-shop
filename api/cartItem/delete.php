<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
  }
  else {
    include_once '../../config/core.php';
    include_once '../../config/database.php';
    include_once '../../models/cartItem.php';
    include_once '../../helper/authen.php';
    $database = new Database();
    $db = $database->getConnection();

    $headers = apache_request_headers();  
    $token = $headers["Authorization"];
  
    if (!$token) http_response_code(400); 
    else {
      $userId = authen($token, $key);
      if ($userId) {      
        $cartItem = new CartItem($db);
        $cartItem->userId = $userId;
        
        $cartItem->productId = isset($_GET['productId']) ? $_GET['productId'] : die();
        $cartItem->color = isset($_GET['color']) ? $_GET['color'] : die();

        $result = $cartItem->delete();
        
        if ($result) http_response_code(200);
        else http_response_code(400);
      }
      else http_response_code(403);
    }
  }
  