<?php
define("SERVER", "localhost");
define("USER", "root");
define("PASSWORD", "iwscrud");
define("DB", "crud_db");
define("PORT", "3306");
$conn = new mysqli(SERVER, USER, PASSWORD, DB, PORT);
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}


echo '<div class="row col-12 mb-3">';

$search = $_POST["userData"];
$sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE email LIKE '%" . $search . "%' ";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	echo '<h4 class="text-center" style="color:white">Информация найдена!</h4>';
	echo '<table class="table table-striped table-bordered table-dark table-responsive-lg">
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Имя</th>
				<th scope="col">Фамилия</th>
				<th scope="col">Персональный код</th>
				<th scope="col">Почта</th>
				<th scope="col">Услуга</th>
				<th scope="col">Цена</th>
				<th scope="col">Дата</th>
			</tr>
		</thead>
	<tbody>';
	$counter = 1;
	while ($row = $result->fetch_assoc()) {
		echo '<tr>
			<th scope="row">' . $counter . '</th>
			<td>' . $row["first_name"] . '</td>
			<td>' . $row["last_name"] . ' </td>
			<td>' . $row["personal_id_code"] . ' </td>
			<td>' . $row["email"] . ' </td>
			<td>' . $row["service"] . ' </td>
			<td>' . $row["price"] . ' </td>
			<td>' . $row["date"] . ' </td>
		</tr>';
		$counter++;
	}
	echo '</tbody>
	</table>';
} else {
	echo  '<div class="container col-10 alert alert-danger" role="alert">
		Информация не найдена!
 	</div>';
}

echo '</div>';
