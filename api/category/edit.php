<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  if($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
  }
  else {
    include_once '../../config/database.php';
    include_once '../../models/user.php';
    include_once '../../models/category.php';
    
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    $category = new Category($db);

    $data = json_decode(file_get_contents("php://input"));
    $headers = apache_request_headers();
    $jwt = $headers['Authorization'];
  
    $url = $_SERVER['DOCUMENT_ROOT'];
    include_once $url . '/config/core.php';
    include_once $url. '/helper/authen.php';
  
    if ($jwt && authen($jwt, $key)) {
      $id = authen($jwt, $key);
      $user->id = $id;
      $result = $user->findUser();
      if ($result) {
        if ($user->isAdmin) {

          $category->id = $data->id;
          $category->name = $data->name;
          $category->image = $data->image;

          if($category->update()) {
            http_response_code(200);
            echo json_encode(
              array('message' => 'Category was updated.')
            );
          } else {
            http_response_code(401);
            echo json_encode(
              array('message' => 'Unable to update category')
            );
          }
        }
        else {
          http_response_code(403);
          echo json_encode(array("message" => "Access denied"));
        }
      }
      else {
        http_response_code(403);
      }
    }
    else {
      http_response_code(403);
    }
  }

