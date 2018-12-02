<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../../config/database.php';
  include_once '../../models/order.php';

  $database = new Database();
  $db = $database->getConnection();

  $order = new Order($db);

  $data = json_decode(file_get_contents("php://input"));

  $order->id = $data->id;

  if($order->delete()) {
    http_response_code(200);
    echo json_encode(
      array('message' => 'Order was deleted')
    );
  } else {
    http_response_code(401);
    echo json_encode(
      array('message' => 'Unable to delete order')
    );
  }
